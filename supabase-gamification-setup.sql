-- VisorUp Gamification Schema
-- Paste this entire file into Supabase SQL Editor and hit Run
-- This is optional - gamification currently uses localStorage
-- These tables enable server-side persistence when ready

-- 1. Ride log table
create table if not exists public.ride_log (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  date date not null,
  miles integer default 0,
  rating integer default 0,
  notes text,
  route_slug text,
  start_time text,
  created_at timestamptz default now()
);

alter table public.ride_log enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'ride_log' and policyname = 'Users can view their own rides') then
    execute 'create policy "Users can view their own rides" on public.ride_log for select using (auth.uid() = user_id)';
  end if;
  if not exists (select 1 from pg_policies where tablename = 'ride_log' and policyname = 'Users can insert their own rides') then
    execute 'create policy "Users can insert their own rides" on public.ride_log for insert with check (auth.uid() = user_id)';
  end if;
  if not exists (select 1 from pg_policies where tablename = 'ride_log' and policyname = 'Users can delete their own rides') then
    execute 'create policy "Users can delete their own rides" on public.ride_log for delete using (auth.uid() = user_id)';
  end if;
end $$;

create index if not exists idx_ride_log_user on public.ride_log(user_id);

-- 2. User achievements table
create table if not exists public.user_achievements (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  badge_id text not null,
  earned_at timestamptz default now(),
  unique(user_id, badge_id)
);

alter table public.user_achievements enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'user_achievements' and policyname = 'Users can view their own achievements') then
    execute 'create policy "Users can view their own achievements" on public.user_achievements for select using (auth.uid() = user_id)';
  end if;
  if not exists (select 1 from pg_policies where tablename = 'user_achievements' and policyname = 'Anyone can view achievements') then
    execute 'create policy "Anyone can view achievements" on public.user_achievements for select using (true)';
  end if;
  if not exists (select 1 from pg_policies where tablename = 'user_achievements' and policyname = 'Users can insert their own achievements') then
    execute 'create policy "Users can insert their own achievements" on public.user_achievements for insert with check (auth.uid() = user_id)';
  end if;
end $$;

create index if not exists idx_achievements_user on public.user_achievements(user_id);

-- 3. Visited destinations table
create table if not exists public.visited_destinations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  destination_slug text not null,
  visited_at timestamptz default now(),
  unique(user_id, destination_slug)
);

alter table public.visited_destinations enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'visited_destinations' and policyname = 'Users can manage their own visits') then
    execute 'create policy "Users can manage their own visits" on public.visited_destinations for all using (auth.uid() = user_id)';
  end if;
  if not exists (select 1 from pg_policies where tablename = 'visited_destinations' and policyname = 'Anyone can view visits') then
    execute 'create policy "Anyone can view visits" on public.visited_destinations for select using (true)';
  end if;
end $$;

create index if not exists idx_visited_dest_user on public.visited_destinations(user_id);

-- 4. Add XP column to profiles
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'xp') then
    alter table public.profiles add column xp integer default 0;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'rider_level') then
    alter table public.profiles add column rider_level integer default 1;
  end if;
end $$;
