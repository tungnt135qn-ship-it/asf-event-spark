REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role, uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.can_manage_event(uuid, uuid) FROM anon;