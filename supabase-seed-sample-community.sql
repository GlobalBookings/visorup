-- VisorUp — Seed sample community content for App Review
-- Run this in the Supabase SQL Editor (it runs as admin and bypasses RLS).
--
-- Creates benign ride-report posts authored by a "Sample Rider" account so the
-- App Review demo account always has another rider's content to REPORT and BLOCK
-- (Guideline 1.2). The sample account (sample.rider@visorup.co.uk) was already
-- created during seeding; this confirms it and gives it a friendly name + posts.
-- Idempotent: safe to run more than once.

-- 1) Confirm the sample author account so it is a valid, usable user.
update auth.users
  set email_confirmed_at = coalesce(email_confirmed_at, now())
  where email = 'sample.rider@visorup.co.uk';

-- 2) Ensure the profile exists with a friendly display name.
insert into public.profiles (id, email, display_name)
  select id, email, 'Sample Rider'
  from auth.users where email = 'sample.rider@visorup.co.uk'
  on conflict (id) do update set display_name = 'Sample Rider';

-- 3) Insert sample posts (only if this author has none yet).
insert into public.community_posts (user_id, type, title, body, photos, destination_slug, miles, tags)
select u.id, v.type, '', v.body, '{}'::text[], v.dest, v.miles, '{}'::text[]
from auth.users u
cross join (values
  ('ride-report',
   'Cracking loop around Snowdonia today — the A4086 over Pen-y-Pass was glorious in the morning light. Stopped for a brew at Pete''s Eats in Llanberis. Roads were dry and quiet.',
   'Snowdonia, Wales', 187),
  ('photo',
   'Sunrise over the North York Moors before the crowds turned up. Worth the 5am alarm.',
   'North York Moors', 0),
  ('question',
   'Heading up the NC500 next month — anyone got a favourite overnight stop between Durness and Tongue? Looking for something biker-friendly with secure parking.',
   'NC500, Scotland', 0),
  ('ride-report',
   'Quick blast through the Peak District. Snake Pass was busy but the Strines route was empty and brilliant. Bike ran perfectly.',
   'Peak District', 96)
) as v(type, body, dest, miles)
where u.email = 'sample.rider@visorup.co.uk'
  and not exists (
    select 1 from public.community_posts p where p.user_id = u.id
  );

-- Verify:
select p.created_at, p.type, p.destination_slug, left(p.body, 40) as preview
from public.community_posts p
join auth.users u on u.id = p.user_id
where u.email = 'sample.rider@visorup.co.uk'
order by p.created_at desc;
