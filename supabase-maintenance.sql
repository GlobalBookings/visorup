-- Maintenance tracking: per-bike service logs (Phase 4.1)
-- Idempotent: safe to run multiple times.

create table if not exists public.bike_maintenance (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  bike_id uuid,
  service_type text,
  mileage numeric,
  cost numeric,
  notes text,
  serviced_at date,
  created_at timestamptz default now()
);

alter table public.bike_maintenance enable row level security;

drop policy if exists "bike_maintenance_select_own" on public.bike_maintenance;
create policy "bike_maintenance_select_own" on public.bike_maintenance
  for select using (auth.uid() = user_id);

drop policy if exists "bike_maintenance_insert_own" on public.bike_maintenance;
create policy "bike_maintenance_insert_own" on public.bike_maintenance
  for insert with check (auth.uid() = user_id);

drop policy if exists "bike_maintenance_update_own" on public.bike_maintenance;
create policy "bike_maintenance_update_own" on public.bike_maintenance
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "bike_maintenance_delete_own" on public.bike_maintenance;
create policy "bike_maintenance_delete_own" on public.bike_maintenance
  for delete using (auth.uid() = user_id);

create index if not exists bike_maintenance_bike_id_idx on public.bike_maintenance (bike_id);
