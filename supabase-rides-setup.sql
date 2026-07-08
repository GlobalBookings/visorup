-- VisorUp: Ride History + Analysis
-- Stores each navigated ride (GPS track + stats) for later review/replay.
-- Idempotent: safe to run more than once.

create table if not exists public.rides (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  trip_id uuid references public.saved_trips(id) on delete set null,
  name text not null default 'Ride',
  distance_m integer not null default 0,
  duration_s integer not null default 0,
  avg_speed numeric not null default 0,
  max_speed numeric not null default 0,
  track jsonb not null default '[]'::jsonb,
  started_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists rides_user_id_created_at_idx
  on public.rides (user_id, created_at desc);

alter table public.rides enable row level security;

drop policy if exists "Users manage own rides" on public.rides;
create policy "Users manage own rides"
  on public.rides for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Note: rides cascade-delete with the auth.users row, so no change to the
-- delete-account function is required for GDPR erasure.
