REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role, uuid) FROM PUBLIC, authenticated;
REVOKE EXECUTE ON FUNCTION public.can_manage_event(uuid, uuid) FROM PUBLIC, authenticated;