-- VisorUp: Expense & fuel logging
-- Per-bike running costs and fuel fill-ups with running totals and economy insight.
-- Idempotent: safe to run more than once.

create table if not exists public.expenses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  bike_id uuid,
  type text,
  amount numeric,
  litres numeric,
  mileage numeric,
  notes text,
  spent_at date,
  created_at timestamptz default now()
);

alter table public.expenses enable row level security;

drop policy if exists "Users can view their own expenses" on public.expenses;
create policy "Users can view their own expenses"
  on public.expenses for select using (auth.uid() = user_id);

drop policy if exists "Users can insert their own expenses" on public.expenses;
create policy "Users can insert their own expenses"
  on public.expenses for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update their own expenses" on public.expenses;
create policy "Users can update their own expenses"
  on public.expenses for update using (auth.uid() = user_id);

drop policy if exists "Users can delete their own expenses" on public.expenses;
create policy "Users can delete their own expenses"
  on public.expenses for delete using (auth.uid() = user_id);

create index if not exists idx_expenses_user on public.expenses(user_id);
create index if not exists idx_expenses_bike on public.expenses(bike_id);
create index if not exists idx_expenses_user_spent on public.expenses(user_id, spent_at desc);
