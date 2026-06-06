-- VisorUp Community Schema
-- Run this in the Supabase SQL Editor after the base schema (supabase-schema.sql)

-- ── Community Posts (Ride Reports) ──
create table if not exists public.community_posts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null default 'ride-report',
  title text not null default '',
  body text not null default '',
  photos text[] default '{}',
  route_slug text,
  destination_slug text,
  miles numeric default 0,
  rating integer default 0,
  bike text default '',
  tags text[] default '{}',
  likes_count integer default 0,
  comments_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.community_posts enable row level security;

create policy "Anyone can view community posts"
  on public.community_posts for select using (true);

create policy "Users can insert their own posts"
  on public.community_posts for insert with check (auth.uid() = user_id);

create policy "Users can update their own posts"
  on public.community_posts for update using (auth.uid() = user_id);

create policy "Users can delete their own posts"
  on public.community_posts for delete using (auth.uid() = user_id);

create index idx_community_posts_user on public.community_posts(user_id);
create index idx_community_posts_created on public.community_posts(created_at desc);

-- ── Community Comments ──
create table if not exists public.community_comments (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references public.community_posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamptz default now()
);

alter table public.community_comments enable row level security;

create policy "Anyone can view comments"
  on public.community_comments for select using (true);

create policy "Users can insert their own comments"
  on public.community_comments for insert with check (auth.uid() = user_id);

create policy "Users can delete their own comments"
  on public.community_comments for delete using (auth.uid() = user_id);

create index idx_community_comments_post on public.community_comments(post_id);

-- ── Community Likes ──
create table if not exists public.community_likes (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references public.community_posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(post_id, user_id)
);

alter table public.community_likes enable row level security;

create policy "Anyone can view likes"
  on public.community_likes for select using (true);

create policy "Users can insert their own likes"
  on public.community_likes for insert with check (auth.uid() = user_id);

create policy "Users can delete their own likes"
  on public.community_likes for delete using (auth.uid() = user_id);

create index idx_community_likes_post on public.community_likes(post_id);
create index idx_community_likes_user on public.community_likes(user_id);

-- ── Trigger: update likes_count on community_posts ──
create or replace function public.update_post_likes_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update public.community_posts set likes_count = likes_count + 1 where id = NEW.post_id;
    return NEW;
  elsif TG_OP = 'DELETE' then
    update public.community_posts set likes_count = greatest(0, likes_count - 1) where id = OLD.post_id;
    return OLD;
  end if;
  return null;
end;
$$ language plpgsql security definer;

create trigger on_community_like_change
  after insert or delete on public.community_likes
  for each row execute function public.update_post_likes_count();

-- ── Trigger: update comments_count on community_posts ──
create or replace function public.update_post_comments_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update public.community_posts set comments_count = comments_count + 1 where id = NEW.post_id;
    return NEW;
  elsif TG_OP = 'DELETE' then
    update public.community_posts set comments_count = greatest(0, comments_count - 1) where id = OLD.post_id;
    return OLD;
  end if;
  return null;
end;
$$ language plpgsql security definer;

create trigger on_community_comment_change
  after insert or delete on public.community_comments
  for each row execute function public.update_post_comments_count();

-- ── Trigger: update updated_at on community_posts ──
create trigger update_community_posts_updated_at
  before update on public.community_posts
  for each row execute function public.update_updated_at();
