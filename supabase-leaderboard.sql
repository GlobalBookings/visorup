-- VisorUp: Leaderboards & Kudos (Phase 2.3)
-- Adds a public aggregate table for community leaderboards plus a kudos table
-- so riders can cheer each other's rides. Per-user `rides` stay private; only
-- these aggregate/interaction tables are publicly readable.
-- Idempotent: safe to run more than once.

create table if not exists public.rider_stats (
  user_id uuid primary key references auth.users on delete cascade,
  display_name text,
  avatar_url text,
  curvy_miles numeric default 0,
  total_miles numeric default 0,
  rides int default 0,
  kudos int default 0,
  updated_at timestamptz default now()
);

create table if not exists public.ride_kudos (
  id uuid default gen_random_uuid() primary key,
  ride_id uuid,
  from_user uuid references auth.users on delete cascade,
  to_user uuid,
  created_at timestamptz default now(),
  unique (ride_id, from_user)
);

alter table public.rider_stats enable row level security;
alter table public.ride_kudos enable row level security;

-- rider_stats: readable by everyone; each rider may only write their own row.
drop policy if exists "rider_stats select" on public.rider_stats;
create policy "rider_stats select" on public.rider_stats
  for select using (true);

drop policy if exists "rider_stats insert" on public.rider_stats;
create policy "rider_stats insert" on public.rider_stats
  for insert with check (auth.uid() = user_id);

drop policy if exists "rider_stats update" on public.rider_stats;
create policy "rider_stats update" on public.rider_stats
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ride_kudos: readable by everyone; each rider may only create/remove their own kudos.
drop policy if exists "ride_kudos select" on public.ride_kudos;
create policy "ride_kudos select" on public.ride_kudos
  for select using (true);

drop policy if exists "ride_kudos insert" on public.ride_kudos;
create policy "ride_kudos insert" on public.ride_kudos
  for insert with check (auth.uid() = from_user);

drop policy if exists "ride_kudos delete" on public.ride_kudos;
create policy "ride_kudos delete" on public.ride_kudos
  for delete using (auth.uid() = from_user);

create index if not exists ride_kudos_ride_idx on public.ride_kudos (ride_id);
