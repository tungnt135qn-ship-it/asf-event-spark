// Per-item CRUD server functions for event lists.
// All operations are scoped by event_id; RLS is enforced by `can_manage_event`.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const i18n = z.object({ vi: z.string().default(""), en: z.string().default("") });
const i18nList = z.object({
  vi: z.array(z.string()).default([]),
  en: z.array(z.string()).default([]),
});

const idInput = z.object({ id: z.string().uuid(), event_id: z.string().uuid() });

async function nextPosition(supabase: any, table: string, eventId: string): Promise<number> {
  const r = await supabase
    .from(table)
    .select("position")
    .eq("event_id", eventId)
    .order("position", { ascending: false })
    .limit(1);
  if (r.error) throw new Error(r.error.message);
  const top = (r.data?.[0]?.position as number | undefined) ?? -1;
  return top + 1;
}

// ============ NEWS ============
const newsSchema = z.object({
  id: z.string().uuid().optional(),
  event_id: z.string().uuid(),
  slug: z.string().min(1).max(200),
  tag: z.string().max(80).nullable().optional(),
  title: i18n,
  excerpt: i18n,
  body: i18nList,
  cover_url: z.string().nullable().optional(),
  author: z.string().max(120).nullable().optional(),
  read_time: z.string().max(40).nullable().optional(),
  published_at: z.string().nullable().optional(),
});

export const upsertNewsItem = createServerFn({ method: "POST" })
  .inputValidator((d) => newsSchema.parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const payload: Record<string, unknown> = {
      event_id: data.event_id,
      slug: data.slug.trim(),
      tag: data.tag ?? null,
      title: data.title,
      excerpt: data.excerpt,
      body: data.body,
      cover_url: data.cover_url ?? null,
      author: data.author ?? null,
      read_time: data.read_time ?? null,
      published_at: data.published_at ?? null,
    };
    if (data.id) {
      const r = await supabase.from("news").update(payload as never).eq("id", data.id).select("id").single();
      if (r.error) throw new Error(r.error.message);
      return { id: r.data.id };
    }
    payload.position = await nextPosition(supabase, "news", data.event_id);
    const r = await supabase.from("news").insert(payload as never).select("id").single();
    if (r.error) throw new Error(r.error.message);
    return { id: r.data.id };
  });

export const deleteNewsItem = createServerFn({ method: "POST" })
  .inputValidator((d) => idInput.parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const r = await context.supabase.from("news").delete().eq("id", data.id).eq("event_id", data.event_id);
    if (r.error) throw new Error(r.error.message);
    return { ok: true };
  });

// ============ FAQS ============
const faqSchema = z.object({
  id: z.string().uuid().optional(),
  event_id: z.string().uuid(),
  category: i18n,
  question: i18n,
  answer: i18n,
});

export const upsertFaq = createServerFn({ method: "POST" })
  .inputValidator((d) => faqSchema.parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const payload: Record<string, unknown> = {
      event_id: data.event_id,
      category: data.category,
      question: data.question,
      answer: data.answer,
    };
    if (data.id) {
      const r = await supabase.from("faqs").update(payload as never).eq("id", data.id).select("id").single();
      if (r.error) throw new Error(r.error.message);
      return { id: r.data.id };
    }
    payload.position = await nextPosition(supabase, "faqs", data.event_id);
    const r = await supabase.from("faqs").insert(payload as never).select("id").single();
    if (r.error) throw new Error(r.error.message);
    return { id: r.data.id };
  });

export const deleteFaq = createServerFn({ method: "POST" })
  .inputValidator((d) => idInput.parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const r = await context.supabase.from("faqs").delete().eq("id", data.id).eq("event_id", data.event_id);
    if (r.error) throw new Error(r.error.message);
    return { ok: true };
  });

// ============ TOPICS ============
const topicSchema = z.object({
  id: z.string().uuid().optional(),
  event_id: z.string().uuid(),
  slug: z.string().min(1).max(200),
  abbr: z.string().max(40).nullable().optional(),
  image_url: z.string().nullable().optional(),
  title: i18n,
  summary: i18n,
  long_description: i18n,
});

export const upsertTopic = createServerFn({ method: "POST" })
  .inputValidator((d) => topicSchema.parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const payload: Record<string, unknown> = {
      event_id: data.event_id,
      slug: data.slug.trim(),
      abbr: data.abbr ?? null,
      image_url: data.image_url ?? null,
      title: data.title,
      summary: data.summary,
      long_description: data.long_description,
    };
    if (data.id) {
      const r = await supabase.from("topics").update(payload as never).eq("id", data.id).select("id").single();
      if (r.error) throw new Error(r.error.message);
      return { id: r.data.id };
    }
    payload.position = await nextPosition(supabase, "topics", data.event_id);
    const r = await supabase.from("topics").insert(payload as never).select("id").single();
    if (r.error) throw new Error(r.error.message);
    return { id: r.data.id };
  });

export const deleteTopic = createServerFn({ method: "POST" })
  .inputValidator((d) => idInput.parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const r = await context.supabase.from("topics").delete().eq("id", data.id).eq("event_id", data.event_id);
    if (r.error) throw new Error(r.error.message);
    return { ok: true };
  });

// ============ DOCUMENTS ============
const documentSchema = z.object({
  id: z.string().uuid().optional(),
  event_id: z.string().uuid(),
  name: i18n,
  description: i18n,
  file_url: z.string().nullable().optional(),
  file_type: z.string().max(40).nullable().optional(),
  file_size: z.string().max(40).nullable().optional(),
  requires_code: z.boolean().default(false),
});

export const upsertDocument = createServerFn({ method: "POST" })
  .inputValidator((d) => documentSchema.parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const payload: Record<string, unknown> = {
      event_id: data.event_id,
      name: data.name,
      description: data.description,
      file_url: data.file_url ?? null,
      file_type: data.file_type ?? null,
      file_size: data.file_size ?? null,
      requires_code: data.requires_code,
    };
    if (data.id) {
      const r = await supabase.from("documents").update(payload as never).eq("id", data.id).select("id").single();
      if (r.error) throw new Error(r.error.message);
      return { id: r.data.id };
    }
    payload.position = await nextPosition(supabase, "documents", data.event_id);
    const r = await supabase.from("documents").insert(payload as never).select("id").single();
    if (r.error) throw new Error(r.error.message);
    return { id: r.data.id };
  });

export const deleteDocument = createServerFn({ method: "POST" })
  .inputValidator((d) => idInput.parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const r = await context.supabase.from("documents").delete().eq("id", data.id).eq("event_id", data.event_id);
    if (r.error) throw new Error(r.error.message);
    return { ok: true };
  });

// ============ LIBRARY ============
const librarySchema = z.object({
  id: z.string().uuid().optional(),
  event_id: z.string().uuid(),
  external_id: z.string().max(80).nullable().optional(),
  type: z.enum(["photo", "video"]),
  day_index: z.number().nullable().optional(),
  title: i18n,
  thumbnail_url: z.string().min(1),
  source_url: z.string().min(1),
  requires_code: z.boolean().default(false),
});

export const upsertLibraryItem = createServerFn({ method: "POST" })
  .inputValidator((d) => librarySchema.parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const payload: Record<string, unknown> = {
      event_id: data.event_id,
      external_id: data.external_id ?? null,
      type: data.type,
      day_index: data.day_index ?? null,
      title: data.title,
      thumbnail_url: data.thumbnail_url,
      source_url: data.source_url,
      requires_code: data.requires_code,
    };
    if (data.id) {
      const r = await supabase.from("library_items").update(payload as never).eq("id", data.id).select("id").single();
      if (r.error) throw new Error(r.error.message);
      return { id: r.data.id };
    }
    payload.position = await nextPosition(supabase, "library_items", data.event_id);
    const r = await supabase.from("library_items").insert(payload as never).select("id").single();
    if (r.error) throw new Error(r.error.message);
    return { id: r.data.id };
  });

export const deleteLibraryItem = createServerFn({ method: "POST" })
  .inputValidator((d) => idInput.parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const r = await context.supabase.from("library_items").delete().eq("id", data.id).eq("event_id", data.event_id);
    if (r.error) throw new Error(r.error.message);
    return { ok: true };
  });

// ============ PRESS RELEASES ============
const pressSchema = z.object({
  id: z.string().uuid().optional(),
  event_id: z.string().uuid(),
  title: i18n,
  description: i18n,
  source: z.string().max(120).nullable().optional(),
  url: z.string().nullable().optional(),
  file_url: z.string().nullable().optional(),
  published_at: z.string().nullable().optional(),
});

export const upsertPressRelease = createServerFn({ method: "POST" })
  .inputValidator((d) => pressSchema.parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const payload: Record<string, unknown> = {
      event_id: data.event_id,
      title: data.title,
      description: data.description,
      source: data.source ?? null,
      url: data.url ?? null,
      file_url: data.file_url ?? null,
      published_at: data.published_at ?? null,
    };
    if (data.id) {
      const r = await supabase.from("press_releases").update(payload as never).eq("id", data.id).select("id").single();
      if (r.error) throw new Error(r.error.message);
      return { id: r.data.id };
    }
    payload.position = await nextPosition(supabase, "press_releases", data.event_id);
    const r = await supabase.from("press_releases").insert(payload as never).select("id").single();
    if (r.error) throw new Error(r.error.message);
    return { id: r.data.id };
  });

export const deletePressRelease = createServerFn({ method: "POST" })
  .inputValidator((d) => idInput.parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const r = await context.supabase
      .from("press_releases")
      .delete()
      .eq("id", data.id)
      .eq("event_id", data.event_id);
    if (r.error) throw new Error(r.error.message);
    return { ok: true };
  });

// ============ AGENDA DAYS ============
const dayInput = z.object({
  id: z.string().uuid().optional(),
  event_id: z.string().uuid(),
  date: z.string().min(1),
  label: i18n,
  topic_slugs: z.array(z.string()).default([]),
  speaker_external_ids: z.array(z.string()).default([]),
});

export const upsertAgendaDay = createServerFn({ method: "POST" })
  .inputValidator((d) => dayInput.parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const payload: Record<string, unknown> = {
      event_id: data.event_id,
      date: data.date,
      label: data.label,
      topic_slugs: data.topic_slugs,
      speaker_external_ids: data.speaker_external_ids,
    };
    if (data.id) {
      const r = await supabase.from("agenda_days").update(payload as never).eq("id", data.id).select("id").single();
      if (r.error) throw new Error(r.error.message);
      return { id: r.data.id };
    }
    payload.position = await nextPosition(supabase, "agenda_days", data.event_id);
    const r = await supabase.from("agenda_days").insert(payload as never).select("id").single();
    if (r.error) throw new Error(r.error.message);
    return { id: r.data.id };
  });

export const deleteAgendaDay = createServerFn({ method: "POST" })
  .inputValidator((d) => idInput.parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    // Delete sessions first (no FK enforcement, but keep tidy)
    const ds = await context.supabase
      .from("agenda_sessions")
      .delete()
      .eq("event_id", data.event_id)
      .eq("day_id", data.id);
    if (ds.error) throw new Error(ds.error.message);
    const r = await context.supabase
      .from("agenda_days")
      .delete()
      .eq("id", data.id)
      .eq("event_id", data.event_id);
    if (r.error) throw new Error(r.error.message);
    return { ok: true };
  });

// ============ AGENDA SESSIONS ============
const sessionInput = z.object({
  id: z.string().uuid().optional(),
  event_id: z.string().uuid(),
  day_id: z.string().uuid(),
  time_text: z.string().max(60).default(""),
  title: i18n,
  description: i18n,
  location: i18n,
  tag: z.string().max(40).nullable().optional(),
});

export const upsertAgendaSession = createServerFn({ method: "POST" })
  .inputValidator((d) => sessionInput.parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const payload: Record<string, unknown> = {
      event_id: data.event_id,
      day_id: data.day_id,
      time_text: data.time_text,
      title: data.title,
      description: data.description,
      location: data.location,
      tag: data.tag ?? null,
    };
    if (data.id) {
      const r = await supabase.from("agenda_sessions").update(payload as never).eq("id", data.id).select("id").single();
      if (r.error) throw new Error(r.error.message);
      return { id: r.data.id };
    }
    // next position scoped to day
    const top = await supabase
      .from("agenda_sessions")
      .select("position")
      .eq("event_id", data.event_id)
      .eq("day_id", data.day_id)
      .order("position", { ascending: false })
      .limit(1);
    if (top.error) throw new Error(top.error.message);
    payload.position = ((top.data?.[0]?.position as number | undefined) ?? -1) + 1;
    const r = await supabase.from("agenda_sessions").insert(payload as never).select("id").single();
    if (r.error) throw new Error(r.error.message);
    return { id: r.data.id };
  });

export const deleteAgendaSession = createServerFn({ method: "POST" })
  .inputValidator((d) => idInput.parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const r = await context.supabase
      .from("agenda_sessions")
      .delete()
      .eq("id", data.id)
      .eq("event_id", data.event_id);
    if (r.error) throw new Error(r.error.message);
    return { ok: true };
  });
