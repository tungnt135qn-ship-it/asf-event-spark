// Admin CRUD for landing content modules: hero, overview, why_attend, key_contents.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const i18n = z.object({ vi: z.string().default(""), en: z.string().default("") });
const eventIdInput = z.object({ event_id: z.string().uuid() });

// ---------- READ ----------
export const getEventContentAdmin = createServerFn({ method: "GET" })
  .inputValidator((d) => eventIdInput.parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const evId = data.event_id;

    const [hero, overview, whys, keys] = await Promise.all([
      supabase.from("hero_content").select("*").eq("event_id", evId).maybeSingle(),
      supabase.from("overview_content").select("*").eq("event_id", evId).maybeSingle(),
      supabase.from("why_attend_items").select("*").eq("event_id", evId).order("position"),
      supabase.from("key_contents").select("*").eq("event_id", evId).order("position"),
    ]);
    if (hero.error) throw new Error(hero.error.message);
    if (overview.error) throw new Error(overview.error.message);
    if (whys.error) throw new Error(whys.error.message);
    if (keys.error) throw new Error(keys.error.message);

    return {
      hero: hero.data,
      overview: overview.data,
      why_attend_items: whys.data ?? [],
      key_contents: keys.data ?? [],
    };
  });

// ---------- HERO ----------
const heroInput = z.object({
  event_id: z.string().uuid(),
  tagline: i18n,
  lead: i18n,
  date_text: i18n,
  location_text: i18n,
  cta_register_label: i18n,
  cta_agenda_label: i18n,
  background_url: z.string().nullable(),
  countdown_to: z.string().nullable(),
});

export const upsertHero = createServerFn({ method: "POST" })
  .inputValidator((d) => heroInput.parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: existing } = await supabase
      .from("hero_content")
      .select("id")
      .eq("event_id", data.event_id)
      .maybeSingle();
    if (existing) {
      const { error } = await supabase.from("hero_content").update(data).eq("id", existing.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase.from("hero_content").insert(data);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

// ---------- OVERVIEW ----------
const overviewInput = z.object({
  event_id: z.string().uuid(),
  eyebrow: i18n,
  title: i18n,
  lead: i18n,
  orgs_title: i18n,
  orgs: z.array(z.record(z.string(), z.unknown())).default([]),
  highlights: z.array(z.record(z.string(), z.unknown())).default([]),
});

export const upsertOverview = createServerFn({ method: "POST" })
  .inputValidator((d) => overviewInput.parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const payload = {
      ...data,
      orgs: data.orgs as never,
      highlights: data.highlights as never,
    };
    const { data: existing } = await supabase
      .from("overview_content")
      .select("id")
      .eq("event_id", data.event_id)
      .maybeSingle();
    if (existing) {
      const { error } = await supabase.from("overview_content").update(payload).eq("id", existing.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase.from("overview_content").insert(payload);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

// ---------- WHY ATTEND ----------
const whyItem = z.object({
  id: z.string().uuid().optional(),
  position: z.number(),
  icon: z.string().nullable().optional(),
  stat: z.string().nullable().optional(),
  stat_label: i18n,
  title: i18n,
  description: i18n,
});

const whyListInput = z.object({
  event_id: z.string().uuid(),
  items: z.array(whyItem),
});

export const replaceWhyAttend = createServerFn({ method: "POST" })
  .inputValidator((d) => whyListInput.parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { error: delErr } = await supabase
      .from("why_attend_items")
      .delete()
      .eq("event_id", data.event_id);
    if (delErr) throw new Error(delErr.message);
    if (data.items.length > 0) {
      const rows = data.items.map((it, idx) => ({
        event_id: data.event_id,
        position: idx,
        icon: it.icon ?? null,
        stat: it.stat ?? null,
        stat_label: it.stat_label,
        title: it.title,
        description: it.description,
      }));
      const { error } = await supabase.from("why_attend_items").insert(rows);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

// ---------- KEY CONTENT ----------
const keyItem = z.object({
  id: z.string().uuid().optional(),
  position: z.number(),
  image_url: z.string().nullable().optional(),
  title: i18n,
  body: i18n,
});

const keyListInput = z.object({
  event_id: z.string().uuid(),
  items: z.array(keyItem),
});

export const replaceKeyContent = createServerFn({ method: "POST" })
  .inputValidator((d) => keyListInput.parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { error: delErr } = await supabase
      .from("key_contents")
      .delete()
      .eq("event_id", data.event_id);
    if (delErr) throw new Error(delErr.message);
    if (data.items.length > 0) {
      const rows = data.items.map((it, idx) => ({
        event_id: data.event_id,
        position: idx,
        image_url: it.image_url ?? null,
        title: it.title,
        body: it.body,
      }));
      const { error } = await supabase.from("key_contents").insert(rows);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });
