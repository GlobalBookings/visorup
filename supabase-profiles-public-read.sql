-- VisorUp — Public profile read access (fixes community feed visibility)
-- Run this in the Supabase SQL Editor.
--
-- WHY: The community feed joins each post to its author via `profiles!inner`.
-- The previous profiles RLS only allowed a user to read their OWN profile, so
-- the inner join silently dropped every other rider's posts — each user only
-- ever saw their own posts, and there was no other-user content to report or
-- block (App Store Guideline 1.2 block-mechanism rejection).
--
-- This makes public profile fields (display name, avatar) readable by everyone
-- so the feed shows all riders. Email and push_token stay private via
-- column-level privileges (owners read their email from the auth session;
-- admins use the security-definer RPCs / service role).

drop policy if exists "Users can view their own profile" on public.profiles;

create policy "Public profiles are viewable"
  on public.profiles for select
  using (true);

-- Restrict which columns anon/authenticated can read: identity fields only.
revoke select on public.profiles from anon, authenticated;
grant select (id, display_name, avatar_url, bike_slug, created_at, updated_at)
  on public.profiles to anon, authenticated;
