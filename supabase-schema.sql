-- VisorUp Supabase Schema
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── User Profiles ──
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  display_name text,
  avatar_url text,
  bike_slug text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', null)
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Saved Trips ──
create table public.saved_trips (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  description text,
  waypoints jsonb not null default '[]',
  settings jsonb default '{}',
  route_stats jsonb default '{}',
  is_public boolean default false,
  share_slug text unique,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.saved_trips enable row level security;

create policy "Users can view their own trips"
  on public.saved_trips for select using (auth.uid() = user_id);

create policy "Anyone can view public trips"
  on public.saved_trips for select using (is_public = true);

create policy "Users can insert their own trips"
  on public.saved_trips for insert with check (auth.uid() = user_id);

create policy "Users can update their own trips"
  on public.saved_trips for update using (auth.uid() = user_id);

create policy "Users can delete their own trips"
  on public.saved_trips for delete using (auth.uid() = user_id);

create index idx_saved_trips_user on public.saved_trips(user_id);
create index idx_saved_trips_share on public.saved_trips(share_slug) where share_slug is not null;

-- ── Favourites ──
create table public.favourites (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  item_type text not null,  -- 'destination', 'route', 'bike'
  item_slug text not null,
  created_at timestamptz default now(),
  unique(user_id, item_type, item_slug)
);

alter table public.favourites enable row level security;

create policy "Users can view their own favourites"
  on public.favourites for select using (auth.uid() = user_id);

create policy "Users can insert their own favourites"
  on public.favourites for insert with check (auth.uid() = user_id);

create policy "Users can delete their own favourites"
  on public.favourites for delete using (auth.uid() = user_id);

create index idx_favourites_user on public.favourites(user_id);

-- ── User Garage (Bikes) ──
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

create policy "Anyone can view bikes (for community)"
  on public.user_bikes for select using (true);

create policy "Users can insert their own bikes"
  on public.user_bikes for insert with check (auth.uid() = user_id);

create policy "Users can update their own bikes"
  on public.user_bikes for update using (auth.uid() = user_id);

create policy "Users can delete their own bikes"
  on public.user_bikes for delete using (auth.uid() = user_id);

create index idx_user_bikes_user on public.user_bikes(user_id);

-- ── Updated_at trigger ──
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at();

create trigger update_saved_trips_updated_at
  before update on public.saved_trips
  for each row execute function public.update_updated_at();

create trigger update_user_bikes_updated_at
  before update on public.user_bikes
  for each row execute function public.update_updated_at();

-- ── Avatar Storage ──
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true)
  on conflict do nothing;

create policy "Users can upload their own avatar"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can update their own avatar"
  on storage.objects for update
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Anyone can view avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- ── Bike Photo Storage ──
insert into storage.buckets (id, name, public) values ('bike-photos', 'bike-photos', true)
  on conflict do nothing;

create policy "Users can upload bike photos"
  on storage.objects for insert
  with check (bucket_id = 'bike-photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can update bike photos"
  on storage.objects for update
  using (bucket_id = 'bike-photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can delete bike photos"
  on storage.objects for delete
  using (bucket_id = 'bike-photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Anyone can view bike photos"
  on storage.objects for select
  using (bucket_id = 'bike-photos');
