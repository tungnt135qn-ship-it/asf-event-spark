import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const getAdminRoles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await supabaseAdmin
      .from("user_roles")
      .select("role, event_id")
      .eq("user_id", context.userId);

    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getAdminEvents = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: roles, error: rolesError } = await supabaseAdmin
      .from("user_roles")
      .select("role, event_id")
      .eq("user_id", context.userId);

    if (rolesError) throw new Error(rolesError.message);

    const isSuperAdmin = roles?.some((role) => role.role === "super_admin") ?? false;
    const eventIds =
      roles
        ?.filter((role) => role.role === "event_admin" || role.role === "editor")
        .map((role) => role.event_id)
        .filter((eventId): eventId is string => Boolean(eventId)) ?? [];

    if (!isSuperAdmin && eventIds.length === 0) return [];

    let query = supabaseAdmin
      .from("events")
      .select("id, slug, name, status, is_default, start_at, end_at, created_at")
      .order("created_at", { ascending: false });

    if (!isSuperAdmin) query = query.in("id", eventIds);

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data ?? [];
  });