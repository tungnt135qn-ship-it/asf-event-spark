// Admin server functions for event detail (General + Settings) management.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const i18n = z.object({ vi: z.string().default(""), en: z.string().default("") });

const idInput = z.object({ id: z.string().uuid() });

export const getEventDetail = createServerFn({ method: "GET" })
  .inputValidator((d) => idInput.parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // Authorization: super_admin or can_manage_event via RLS — supabase client respects RLS.
    const { data: event, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!event) throw new Error("Không tìm thấy sự kiện hoặc không có quyền truy cập");

    const { data: settings, error: sErr } = await supabase
      .from("event_settings")
      .select("*")
      .eq("event_id", data.id)
      .maybeSingle();
    if (sErr) throw new Error(sErr.message);

    return { event, settings, viewerId: userId };
  });

const generalInput = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  name: i18n,
  tagline: i18n,
  location: i18n,
  default_lang: z.enum(["vi", "en"]),
  start_at: z.string().nullable(),
  end_at: z.string().nullable(),
  logo_url: z.string().nullable(),
  cover_url: z.string().nullable(),
});

export const updateEventGeneral = createServerFn({ method: "POST" })
  .inputValidator((d) => generalInput.parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { id, ...patch } = data;
    const { error } = await supabase.from("events").update(patch).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const statusInput = z.object({
  id: z.string().uuid(),
  status: z.enum(["draft", "published", "archived"]),
});

export const updateEventStatus = createServerFn({ method: "POST" })
  .inputValidator((d) => statusInput.parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { error } = await supabase.from("events").update({ status: data.status }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// Setting an event as default requires super_admin (we unset others first).
export const setDefaultEvent = createServerFn({ method: "POST" })
  .inputValidator((d) => idInput.parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { userId } = context;
    // Verify super_admin via admin client (bypasses RLS for the role check).
    const { data: roles } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    const isSuper = (roles ?? []).some((r) => r.role === "super_admin");
    if (!isSuper) throw new Error("Chỉ super_admin mới có thể đặt sự kiện mặc định");

    const { error: e1 } = await supabaseAdmin.from("events").update({ is_default: false }).neq("id", data.id);
    if (e1) throw new Error(e1.message);
    const { error: e2 } = await supabaseAdmin.from("events").update({ is_default: true }).eq("id", data.id);
    if (e2) throw new Error(e2.message);
    return { ok: true };
  });

const contactSchema = z.object({
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  address_vi: z.string().optional().nullable(),
  address_en: z.string().optional().nullable(),
}).partial();

const socialSchema = z.array(
  z.object({
    platform: z.string(),
    url: z.string(),
    label: z.string().optional().nullable(),
  }),
);

const settingsInput = z.object({
  event_id: z.string().uuid(),
  registration_enabled: z.boolean(),
  booking_enabled: z.boolean(),
  documents_locked: z.boolean(),
  library_locked: z.boolean(),
  footer_text: i18n,
  contact: contactSchema,
  social_links: socialSchema,
  seo: z.record(z.string(), z.unknown()).default({}),
});

export const upsertEventSettings = createServerFn({ method: "POST" })
  .inputValidator((d) => settingsInput.parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: existing } = await supabase
      .from("event_settings")
      .select("id")
      .eq("event_id", data.event_id)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from("event_settings")
        .update({
          registration_enabled: data.registration_enabled,
          booking_enabled: data.booking_enabled,
          documents_locked: data.documents_locked,
          library_locked: data.library_locked,
          footer_text: data.footer_text,
          contact: data.contact as never,
          social_links: data.social_links as never,
          seo: data.seo as never,
        })
        .eq("id", existing.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase.from("event_settings").insert({
        event_id: data.event_id,
        registration_enabled: data.registration_enabled,
        booking_enabled: data.booking_enabled,
        documents_locked: data.documents_locked,
        library_locked: data.library_locked,
        footer_text: data.footer_text,
        contact: data.contact as never,
        social_links: data.social_links as never,
        seo: data.seo as never,
      });
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });
