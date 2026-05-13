
CREATE OR REPLACE FUNCTION public.event_is_published(_event_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.events WHERE id = _event_id AND status = 'published')
$$;
