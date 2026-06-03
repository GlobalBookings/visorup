-- VisorUp Garage Setup
-- Paste this entire file into Supabase SQL Editor and hit Run

-- 1. Updated_at trigger function (safe to re-run)
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 2. User bikes table
create table if not exists public.user_bikes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  make text not null,
  model text not null,
  year integer,
  nickname text,
  photo_url text,
  notes text,
  is_primary boolean default false,
  tank_litres numeric,
  mpg numeric,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Row level security
alter table public.user_bikes enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'user_bikes' and policyname = 'Users can view their own bikes') then
    execute 'create policy "Users can view their own bikes" on public.user_bikes for select using (auth.uid() = user_id)';
  end if;
  if not exists (select 1 from pg_policies where tablename = 'user_bikes' and policyname = 'Anyone can view bikes for community') then
    execute 'create policy "Anyone can view bikes for community" on public.user_bikes for select using (true)';
  end if;
  if not exists (select 1 from pg_policies where tablename = 'user_bikes' and policyname = 'Users can insert their own bikes') then
    execute 'create policy "Users can insert their own bikes" on public.user_bikes for insert with check (auth.uid() = user_id)';
  end if;
  if not exists (select 1 from pg_policies where tablename = 'user_bikes' and policyname = 'Users can update their own bikes') then
    execute 'create policy "Users can update their own bikes" on public.user_bikes for update using (auth.uid() = user_id)';
  end if;
  if not exists (select 1 from pg_policies where tablename = 'user_bikes' and policyname = 'Users can delete their own bikes') then
    execute 'create policy "Users can delete their own bikes" on public.user_bikes for delete using (auth.uid() = user_id)';
  end if;
end $$;

-- 4. Index
create index if not exists idx_user_bikes_user on public.user_bikes(user_id);

-- 5. Updated_at trigger
drop trigger if exists update_user_bikes_updated_at on public.user_bikes;
create trigger update_user_bikes_updated_at
  before update on public.user_bikes
  for each row execute function public.update_updated_at();

-- 6. Bike photos storage bucket
insert into storage.buckets (id, name, public)
values ('bike-photos', 'bike-photos', true)
on conflict do nothing;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'objects' and policyname = 'Users can upload bike photos') then
    execute 'create policy "Users can upload bike photos" on storage.objects for insert with check (bucket_id = ''bike-photos'' and auth.role() = ''authenticated'')';
  end if;
  if not exists (select 1 from pg_policies where tablename = 'objects' and policyname = 'Anyone can view bike photos') then
    execute 'create policy "Anyone can view bike photos" on storage.objects for select using (bucket_id = ''bike-photos'')';
  end if;
  if not exists (select 1 from pg_policies where tablename = 'objects' and policyname = 'Users can delete their own bike photos') then
    execute 'create policy "Users can delete their own bike photos" on storage.objects for delete using (bucket_id = ''bike-photos'' and auth.uid()::text = (storage.foldername(name))[1])';
  end if;
end $$;
