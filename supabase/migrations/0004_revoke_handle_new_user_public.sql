-- 0003 revoked EXECUTE from anon/authenticated directly, but every new
-- function also grants EXECUTE to PUBLIC by default, which anon/authenticated
-- inherit from regardless. Revoke from PUBLIC to actually close this off.
revoke execute on function public.handle_new_user() from public;
