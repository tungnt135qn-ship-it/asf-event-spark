// Super-admin user & role management.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

async function assertSuperAdmin(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "super_admin")
    .limit(1);
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) throw new Error("Chỉ Super Admin được thao tác");
}

export const listAdminUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertSuperAdmin(context.userId);

    const { data: usersData, error: uErr } =
      await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
    if (uErr) throw new Error(uErr.message);

    const users = usersData.users ?? [];
    const ids = users.map((u) => u.id);

    const [{ data: profiles }, { data: roles }, { data: events }] = await Promise.all([
      supabaseAdmin.from("profiles").select("id, full_name").in("id", ids),
      supabaseAdmin.from("user_roles").select("id, user_id, role, event_id").in("user_id", ids),
      supabaseAdmin.from("events").select("id, slug, name"),
    ]);

    const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));
    const rolesByUser = new Map<string, Array<{ id: string; role: string; event_id: string | null }>>();
    (roles ?? []).forEach((r) => {
      const arr = rolesByUser.get(r.user_id) ?? [];
      arr.push({ id: r.id, role: r.role, event_id: r.event_id });
      rolesByUser.set(r.user_id, arr);
    });

    return {
      users: users.map((u) => ({
        id: u.id,
        email: u.email ?? "",
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at ?? null,
        full_name: profileMap.get(u.id)?.full_name ?? null,
        roles: rolesByUser.get(u.id) ?? [],
      })),
      events: events ?? [],
    };
  });

const grantInput = z.object({
  user_id: z.string().uuid(),
  role: z.enum(["super_admin", "event_admin", "editor"]),
  event_id: z.string().uuid().nullable(),
});

export const grantRole = createServerFn({ method: "POST" })
  .inputValidator((d) => grantInput.parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    await assertSuperAdmin(context.userId);

    const eventId = data.role === "super_admin" ? null : data.event_id;
    if (data.role !== "super_admin" && !eventId) {
      throw new Error("Vai trò này yêu cầu chọn sự kiện");
    }

    // Avoid duplicate
    let existingQuery = supabaseAdmin
      .from("user_roles")
      .select("id")
      .eq("user_id", data.user_id)
      .eq("role", data.role);
    existingQuery = eventId
      ? existingQuery.eq("event_id", eventId)
      : existingQuery.is("event_id", null);
    const { data: existing } = await existingQuery.maybeSingle();
    if (existing) return { ok: true, id: existing.id };

    const { data: row, error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: data.user_id, role: data.role, event_id: eventId })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { ok: true, id: row.id };
  });

const revokeInput = z.object({ id: z.string().uuid() });

export const revokeRole = createServerFn({ method: "POST" })
  .inputValidator((d) => revokeInput.parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    await assertSuperAdmin(context.userId);
    const { error } = await supabaseAdmin.from("user_roles").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const inviteInput = z.object({
  email: z.string().email(),
  full_name: z.string().optional(),
  role: z.enum(["super_admin", "event_admin", "editor"]),
  event_id: z.string().uuid().nullable(),
  redirect_to: z.string().url().optional(),
});

export const inviteAdminUser = createServerFn({ method: "POST" })
  .inputValidator((d) => inviteInput.parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    await assertSuperAdmin(context.userId);

    const eventId = data.role === "super_admin" ? null : data.event_id;
    if (data.role !== "super_admin" && !eventId) {
      throw new Error("Vai trò này yêu cầu chọn sự kiện");
    }

    // Try invite; if user exists, fall back to lookup.
    let userId: string | null = null;
    const { data: invited, error: invErr } =
      await supabaseAdmin.auth.admin.inviteUserByEmail(data.email, {
        redirectTo: data.redirect_to,
        data: data.full_name ? { full_name: data.full_name } : undefined,
      });

    if (invErr) {
      // Look up existing user
      const { data: list } = await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 200,
      });
      const found = list?.users?.find(
        (u) => (u.email ?? "").toLowerCase() === data.email.toLowerCase(),
      );
      if (!found) throw new Error(invErr.message);
      userId = found.id;
    } else {
      userId = invited.user?.id ?? null;
    }

    if (!userId) throw new Error("Không xác định được user");

    const { error: rErr } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: userId, role: data.role, event_id: eventId });
    if (rErr && !rErr.message.includes("duplicate")) throw new Error(rErr.message);

    return { ok: true, user_id: userId, invited: !invErr };
  });
