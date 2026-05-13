GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role, uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.can_manage_event(uuid, uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.event_is_published(uuid) TO anon, authenticated;