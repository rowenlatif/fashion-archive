-- Fixes for advisor warnings raised after 0001_init.sql:
-- 1. Pin search_path on trigger functions so they can't be hijacked by a
--    role-mutable search_path.
-- 2. handle_new_user is SECURITY DEFINER and was callable directly via
--    PostgREST RPC by anon/authenticated — it should only ever run as the
--    on_auth_user_created trigger, so revoke direct EXECUTE. Triggers don't
--    need EXECUTE grants to fire, so this doesn't break sign-up.

alter function public.handle_new_user() set search_path = public;
alter function public.set_updated_at() set search_path = public;

revoke execute on function public.handle_new_user() from anon;
revoke execute on function public.handle_new_user() from authenticated;
