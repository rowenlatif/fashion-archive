-- Starter event-type tags for the single account. Run once the auth user
-- (latif.f@northeastern.edu) exists — safe to re-run, upserts by label.
insert into public.tags (user_id, kind, label)
select u.id, 'event_type', label
from auth.users u
cross join unnest(array[
  'Casual', 'Work', 'Night Out', 'Formal', 'Athletic', 'Travel'
]) as label
where u.email = 'latif.f@northeastern.edu'
on conflict (user_id, kind, label) do nothing;
