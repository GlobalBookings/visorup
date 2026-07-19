-- Group Rides: Supabase migration for real-time group ride sessions.
-- Stores ride metadata and join codes. Live positions handled via Realtime Presence.

create table if not exists group_rides (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  leader_id uuid references auth.users(id) not null,
  leader_name text not null,
  route_id uuid references saved_trips(id),
  status text not null default 'waiting' check (status in ('waiting', 'active', 'finished')),
  join_code text unique not null,
  created_at timestamptz default now()
);

-- Fast lookup by join code (used during ride join flow)
create index idx_group_rides_join_code on group_rides(join_code);

-- Partial index for active/waiting rides (finished rides excluded from common queries)
create index idx_group_rides_status on group_rides(status) where status != 'finished';

-- Row Level Security
alter table group_rides enable row level security;

-- Anyone authenticated can see non-finished rides (needed to join via code)
create policy "Anyone can read active rides by join code"
  on group_rides for select
  using (status != 'finished');

-- Only authenticated users can create rides (must be the leader)
create policy "Authenticated users can create rides"
  on group_rides for insert
  with check (auth.uid() = leader_id);

-- Only the leader can update their own ride (start/end)
create policy "Leader can update own ride"
  on group_rides for update
  using (auth.uid() = leader_id);
