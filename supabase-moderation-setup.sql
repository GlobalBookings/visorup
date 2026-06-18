-- VisorUp Moderation Schema (App Store Guideline 1.2 — User-Generated Content)
-- Run this in the Supabase SQL Editor AFTER supabase-community-setup.sql.
--
-- Implements the required UGC safety precautions:
--   * content reporting/flagging queue (content_reports)
--   * user blocking (user_blocks)
--   * objectionable content can be hidden from the feed (is_hidden columns)
--   * content reaching a report threshold is auto-hidden pending review
--   * admin RPCs to review reports and remove content / eject users within 24h

-- ── Hide flags on community content ──
alter table public.community_posts    add column if not exists is_hidden boolean not null default false;
alter table public.community_comments add column if not exists is_hidden boolean not null default false;

-- Hidden content is visible only to its author (and to admins via RPC).
drop policy if exists "Anyone can view community posts" on public.community_posts;
create policy "Anyone can view visible posts"
  on public.community_posts for select
  using (is_hidden = false or auth.uid() = user_id);

drop policy if exists "Anyone can view comments" on public.community_comments;
create policy "Anyone can view visible comments"
  on public.community_comments for select
  using (is_hidden = false or auth.uid() = user_id);

-- ── Content reports (flagging queue) ──
create table if not exists public.content_reports (
  id uuid default uuid_generate_v4() primary key,
  reporter_id uuid references public.profiles(id) on delete cascade not null,
  content_type text not null,                 -- 'post' | 'comment' | 'user'
  content_id uuid not null,
  post_id uuid,
  reported_user_id uuid references public.profiles(id) on delete cascade,
  reason text not null,
  details text,
  status text not null default 'open',        -- 'open' | 'actioned' | 'dismissed'
  created_at timestamptz default now()
);

alter table public.content_reports enable row level security;

-- Reporters can file and see their own reports; nobody else can read the queue
-- through the client (admins use the security-definer RPCs below).
create policy "Users can file reports"
  on public.content_reports for insert
  with check (auth.uid() = reporter_id);

create policy "Users can view their own reports"
  on public.content_reports for select
  using (auth.uid() = reporter_id);

create index if not exists idx_content_reports_status  on public.content_reports(status, created_at desc);
create index if not exists idx_content_reports_content on public.content_reports(content_type, content_id);

-- ── User blocks ──
create table if not exists public.user_blocks (
  id uuid default uuid_generate_v4() primary key,
  blocker_id uuid references public.profiles(id) on delete cascade not null,
  blocked_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(blocker_id, blocked_id)
);

alter table public.user_blocks enable row level security;

create policy "Users manage their own blocks (select)"
  on public.user_blocks for select using (auth.uid() = blocker_id);
create policy "Users manage their own blocks (insert)"
  on public.user_blocks for insert with check (auth.uid() = blocker_id);
create policy "Users manage their own blocks (delete)"
  on public.user_blocks for delete using (auth.uid() = blocker_id);

create index if not exists idx_user_blocks_blocker on public.user_blocks(blocker_id);

-- ── Auto-hide content once it accumulates distinct reports ──
-- Removes likely-objectionable content from everyone's feed immediately while the
-- developer reviews it, without waiting for manual action.
create or replace function public.auto_hide_reported_content()
returns trigger as $$
declare
  report_count integer;
begin
  select count(distinct reporter_id) into report_count
    from public.content_reports
    where content_type = NEW.content_type and content_id = NEW.content_id;

  if report_count >= 3 then
    if NEW.content_type = 'post' then
      update public.community_posts set is_hidden = true where id = NEW.content_id;
    elsif NEW.content_type = 'comment' then
      update public.community_comments set is_hidden = true where id = NEW.content_id;
    end if;
  end if;
  return NEW;
end;
$$ language plpgsql security definer;

drop trigger if exists on_content_report_insert on public.content_reports;
create trigger on_content_report_insert
  after insert on public.content_reports
  for each row execute function public.auto_hide_reported_content();

-- ── Admin: review the moderation queue ──
-- Whitelisted by email (matches supabase-admin-setup.sql).
create or replace function public.admin_list_reports()
returns json
language plpgsql
security definer
as $$
declare
  result json;
  caller_email text;
begin
  select email into caller_email from auth.users where id = auth.uid();
  if caller_email is null or caller_email not in ('jackchittenden@googlemail.com') then
    raise exception 'Unauthorized';
  end if;

  select coalesce(json_agg(row_to_json(r) order by r.created_at desc), '[]'::json) into result
  from (
    select
      cr.id, cr.content_type, cr.content_id, cr.post_id, cr.reason, cr.details,
      cr.status, cr.created_at,
      cr.reporter_id, cr.reported_user_id,
      rep.display_name  as reporter_name,
      tgt.display_name  as reported_name,
      tgt.email         as reported_email
    from public.content_reports cr
    left join public.profiles rep on rep.id = cr.reporter_id
    left join public.profiles tgt on tgt.id = cr.reported_user_id
    where cr.status = 'open'
  ) r;

  return result;
end;
$$;

-- ── Admin: act on a report (remove content and/or eject the offending user) ──
-- action: 'remove_content' | 'ban_user' | 'dismiss'
create or replace function public.admin_moderate(report_id uuid, action text)
returns json
language plpgsql
security definer
as $$
declare
  caller_email text;
  rec public.content_reports%rowtype;
begin
  select email into caller_email from auth.users where id = auth.uid();
  if caller_email is null or caller_email not in ('jackchittenden@googlemail.com') then
    raise exception 'Unauthorized';
  end if;

  select * into rec from public.content_reports where id = report_id;
  if rec.id is null then
    raise exception 'Report not found';
  end if;

  if action = 'remove_content' or action = 'ban_user' then
    if rec.content_type = 'post' then
      update public.community_posts set is_hidden = true where id = rec.content_id;
    elsif rec.content_type = 'comment' then
      update public.community_comments set is_hidden = true where id = rec.content_id;
    end if;
  end if;

  if action = 'ban_user' and rec.reported_user_id is not null then
    -- Eject the offending user: remove all their content and delete the account.
    update public.community_posts    set is_hidden = true where user_id = rec.reported_user_id;
    update public.community_comments set is_hidden = true where user_id = rec.reported_user_id;
    delete from auth.users where id = rec.reported_user_id;
    update public.content_reports set status = 'actioned'
      where reported_user_id = rec.reported_user_id and status = 'open';
  else
    update public.content_reports set status =
      case when action = 'dismiss' then 'dismissed' else 'actioned' end
      where id = report_id;
  end if;

  return json_build_object('success', true, 'action', action);
end;
$$;
