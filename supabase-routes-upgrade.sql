-- VisorUp Route Storage Upgrade
-- Run this in the Supabase SQL Editor after the base schema
-- Adds route_coords and gpx_data columns to saved_trips for cloud-first route persistence

-- Store the full computed route polyline so loading doesn't require re-routing via OSRM
alter table public.saved_trips
  add column if not exists route_coords jsonb default '[]';

-- Pre-rendered GPX XML so offline export works without recomputing
alter table public.saved_trips
  add column if not exists gpx_data text;

-- Store day segment boundaries for multi-day trip reconstruction
alter table public.saved_trips
  add column if not exists day_segments jsonb default '[]';
