-- Corrected event-type tag seed: 0002_seed_event_tags.sql targeted an email
-- that doesn't match the real account (rowenlatif@gmail.com), so it never
-- inserted anything. This seeds the actual requested set for that account.
insert into public.tags (user_id, kind, label)
select u.id, 'event_type', label
from auth.users u
cross join unnest(array[
  'Casual', 'Work', 'Night Out', 'Formal', 'Home', 'Gym'
]) as label
where u.email = 'rowenlatif@gmail.com'
on conflict (user_id, kind, label) do nothing;
