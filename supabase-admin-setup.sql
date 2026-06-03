-- VisorUp Admin Dashboard Function
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- This creates a function that returns admin stats, bypassing RLS
-- Only callable by whitelisted admin emails

create or replace function public.admin_dashboard_stats()
returns json
language plpgsql
security definer
as $$
declare
  result json;
  caller_email text;
begin
  select email into caller_email from auth.users where id = auth.uid();

  if caller_email is null or caller_email not in ('jackchittenden@googlemail.com') then
    raise exception 'Unauthorized';
  end if;

  select json_build_object(
    'total_users', (select count(*) from profiles),
    'users', (select coalesce(json_agg(row_to_json(u)), '[]'::json) from (
      select
        p.id,
        p.email,
        p.display_name,
        p.avatar_url,
        p.created_at,
        (select count(*) from user_bikes b where b.user_id = p.id) as bike_count,
        (select count(*) from saved_trips t where t.user_id = p.id) as trip_count,
        (select json_agg(json_build_object('make', b.make, 'model', b.model, 'nickname', b.nickname))
         from user_bikes b where b.user_id = p.id) as bikes
      from profiles p
      order by p.created_at desc
    ) u),
    'total_bikes', (select count(*) from user_bikes),
    'total_trips', (select count(*) from saved_trips),
    'total_public_trips', (select count(*) from saved_trips where is_public = true),
    'popular_bikes', (select coalesce(json_agg(row_to_json(bk)), '[]'::json) from (
      select make, model, count(*) as rider_count
      from user_bikes
      group by make, model
      order by count(*) desc
      limit 10
    ) bk),
    'users_this_week', (select count(*) from profiles where created_at > now() - interval '7 days'),
    'users_this_month', (select count(*) from profiles where created_at > now() - interval '30 days')
  ) into result;

  return result;
end;
$$;
