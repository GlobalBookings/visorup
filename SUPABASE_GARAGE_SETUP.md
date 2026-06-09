# Supabase Garage Setup

Run this in **Supabase Dashboard > SQL Editor > New Query**.

```sql
create table public.user_bikes (
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

alter table public.user_bikes enable row level security;

create policy "Users can view their own bikes"
  on public.user_bikes for select using (auth.uid() = user_id);

create policy "Anyone can view bikes for community"
  on public.user_bikes for select using (true);

create policy "Users can insert their own bikes"
  on public.user_bikes for insert with check (auth.uid() = user_id);

create policy "Users can update their own bikes"
  on public.user_bikes for update using (auth.uid() = user_id);

create policy "Users can delete their own bikes"
  on public.user_bikes for delete using (auth.uid() = user_id);

create index idx_user_bikes_user on public.user_bikes(user_id);

create trigger update_user_bikes_updated_at
  before update on public.user_bikes
  for each row execute function public.update_updated_at();
```

If `update_updated_at` function doesn't exist yet, run this first:

```sql
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;
```

Then run the bike_photos storage bucket:

```sql
insert into storage.buckets (id, name, public)
values ('bike-photos', 'bike-photos', true)
on conflict do nothing;

create policy "Users can upload bike photos"
  on storage.objects for insert
  with check (bucket_id = 'bike-photos' and auth.role() = 'authenticated');

create policy "Anyone can view bike photos"
  on storage.objects for select
  using (bucket_id = 'bike-photos');

create policy "Users can delete their own bike photos"
  on storage.objects for delete
  using (bucket_id = 'bike-photos' and auth.uid()::text = (storage.foldername(name))[1]);
```
