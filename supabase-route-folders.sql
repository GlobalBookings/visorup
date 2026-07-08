-- VisorUp: Route folders
-- Adds an optional folder label to saved routes so riders can organise them.
-- Idempotent: safe to run more than once.

alter table public.saved_trips add column if not exists folder text;

create index if not exists saved_trips_user_folder_idx
  on public.saved_trips (user_id, folder);
