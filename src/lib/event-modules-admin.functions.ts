// Admin CRUD for event modules: speakers, topics, sponsors, faqs, agenda.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const i18n = z.object({ vi: z.string().default(""), en: z.string().default("") });
const eventIdInput = z.object({ event_id: z.string().uuid() });

// ============ READ ALL ============
export const getEventModulesAdmin = createServerFn({ method: "GET" })
  .inputValidator((d) => eventIdInput.parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const evId = data.event_id;
    const [speakers, topics, sponsors, faqs, days, sessions] = await Promise.all([
      supabase.from("speakers").select("*").eq("event_id", evId).order("position"),
      supabase.from("topics").select("*").eq("event_id", evId).order("position"),
      supabase.from("sponsors").select("*").eq("event_id", evId).order("position"),
      supabase.from("faqs").select("*").eq("event_id", evId).order("position"),
      supabase.from("agenda_days").select("*").eq("event_id", evId).order("position"),
      supabase.from("agenda_sessions").select("*").eq("event_id", evId).order("position"),
    ]);
    for (const r of [speakers, topics, sponsors, faqs, days, sessions]) {
      if (r.error) throw new Error(r.error.message);
    }
    return {
      speakers: speakers.data ?? [],
      topics: topics.data ?? [],
      sponsors: sponsors.data ?? [],
      faqs: faqs.data ?? [],
      agenda_days: days.data ?? [],
      agenda_sessions: sessions.data ?? [],
    };
  });

// ============ SPEAKERS ============
const speakerItem = z.object({
  position: z.number(),
  external_id: z.string().nullable().optional(),
  honorific: z.string().nullable().optional(),
  full_name: z.string().min(1),
  avatar_url: z.string().nullable().optional(),
  role: i18n,
  organization: i18n,
  bio: i18n,
  topic_slugs: z.array(z.string()).default([]),
  socials: z.record(z.string(), z.string()).default({}),
});

export const replaceSpeakers = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ event_id: z.string().uuid(), items: z.array(speakerItem) }).parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const del = await supabase.from("speakers").delete().eq("event_id", data.event_id);
    if (del.error) throw new Error(del.error.message);
    if (data.items.length) {
      const rows = data.items.map((it, idx) => ({
        event_id: data.event_id,
        position: idx,
        external_id: it.external_id ?? null,
        honorific: it.honorific ?? null,
        full_name: it.full_name,
        avatar_url: it.avatar_url ?? null,
        role: it.role,
        organization: it.organization,
        bio: it.bio,
        topic_slugs: it.topic_slugs as never,
        socials: it.socials as never,
      }));
      const ins = await supabase.from("speakers").insert(rows);
      if (ins.error) throw new Error(ins.error.message);
    }
    return { ok: true };
  });

// ============ TOPICS ============
const topicItem = z.object({
  position: z.number(),
  slug: z.string().min(1),
  abbr: z.string().nullable().optional(),
  image_url: z.string().nullable().optional(),
  title: i18n,
  summary: i18n,
  long_description: i18n,
});

export const replaceTopics = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ event_id: z.string().uuid(), items: z.array(topicItem) }).parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const del = await supabase.from("topics").delete().eq("event_id", data.event_id);
    if (del.error) throw new Error(del.error.message);
    if (data.items.length) {
      const rows = data.items.map((it, idx) => ({
        event_id: data.event_id,
        position: idx,
        slug: it.slug,
        abbr: it.abbr ?? null,
        image_url: it.image_url ?? null,
        title: it.title,
        summary: it.summary,
        long_description: it.long_description,
      }));
      const ins = await supabase.from("topics").insert(rows);
      if (ins.error) throw new Error(ins.error.message);
    }
    return { ok: true };
  });

// ============ SPONSORS ============
const sponsorItem = z.object({
  position: z.number(),
  name: z.string().min(1),
  tier: z.enum(["diamond", "gold", "silver", "bronze", "partner"]).default("partner"),
  logo_url: z.string().nullable().optional(),
  website_url: z.string().nullable().optional(),
});

export const replaceSponsors = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ event_id: z.string().uuid(), items: z.array(sponsorItem) }).parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const del = await supabase.from("sponsors").delete().eq("event_id", data.event_id);
    if (del.error) throw new Error(del.error.message);
    if (data.items.length) {
      const rows = data.items.map((it, idx) => ({
        event_id: data.event_id,
        position: idx,
        name: it.name,
        tier: it.tier,
        logo_url: it.logo_url ?? null,
        website_url: it.website_url ?? null,
      }));
      const ins = await supabase.from("sponsors").insert(rows);
      if (ins.error) throw new Error(ins.error.message);
    }
    return { ok: true };
  });

// ============ FAQS ============
const faqItem = z.object({
  position: z.number(),
  category: i18n,
  question: i18n,
  answer: i18n,
});

export const replaceFaqs = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ event_id: z.string().uuid(), items: z.array(faqItem) }).parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const del = await supabase.from("faqs").delete().eq("event_id", data.event_id);
    if (del.error) throw new Error(del.error.message);
    if (data.items.length) {
      const rows = data.items.map((it, idx) => ({
        event_id: data.event_id,
        position: idx,
        category: it.category,
        question: it.question,
        answer: it.answer,
      }));
      const ins = await supabase.from("faqs").insert(rows);
      if (ins.error) throw new Error(ins.error.message);
    }
    return { ok: true };
  });

// ============ AGENDA (days + sessions) ============
const sessionItem = z.object({
  position: z.number(),
  time_text: z.string().default(""),
  title: i18n,
  description: i18n,
  location: i18n,
  tag: z.string().nullable().optional(),
});

const dayItem = z.object({
  position: z.number(),
  date: z.string().min(1), // YYYY-MM-DD
  label: i18n,
  topic_slugs: z.array(z.string()).default([]),
  speaker_external_ids: z.array(z.string()).default([]),
  sessions: z.array(sessionItem).default([]),
});

export const replaceAgenda = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ event_id: z.string().uuid(), days: z.array(dayItem) }).parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    // Wipe sessions first (FK-free, both filtered by event_id)
    const delS = await supabase.from("agenda_sessions").delete().eq("event_id", data.event_id);
    if (delS.error) throw new Error(delS.error.message);
    const delD = await supabase.from("agenda_days").delete().eq("event_id", data.event_id);
    if (delD.error) throw new Error(delD.error.message);

    for (let i = 0; i < data.days.length; i++) {
      const d = data.days[i];
      const insDay = await supabase
        .from("agenda_days")
        .insert({
          event_id: data.event_id,
          position: i,
          date: d.date,
          label: d.label,
          topic_slugs: d.topic_slugs as never,
          speaker_external_ids: d.speaker_external_ids as never,
        })
        .select("id")
        .single();
      if (insDay.error) throw new Error(insDay.error.message);
      if (d.sessions.length) {
        const rows = d.sessions.map((s, idx) => ({
          event_id: data.event_id,
          day_id: insDay.data.id,
          position: idx,
          time_text: s.time_text,
          title: s.title,
          description: s.description,
          location: s.location,
          tag: s.tag ?? null,
        }));
        const insS = await supabase.from("agenda_sessions").insert(rows);
        if (insS.error) throw new Error(insS.error.message);
      }
    }
    return { ok: true };
  });
