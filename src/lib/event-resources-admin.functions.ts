// Admin CRUD for: hotels, news, documents, library_items, press_releases, access_codes
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const i18n = z.object({ vi: z.string().default(""), en: z.string().default("") });
const i18nList = z.object({
  vi: z.array(z.string()).default([]),
  en: z.array(z.string()).default([]),
});
const eventIdInput = z.object({ event_id: z.string().uuid() });

export const getEventResourcesAdmin = createServerFn({ method: "GET" })
  .inputValidator((d) => eventIdInput.parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const evId = data.event_id;
    const [hotels, news, documents, library, press, codes] = await Promise.all([
      supabase.from("hotels").select("*").eq("event_id", evId).order("position"),
      supabase.from("news").select("*").eq("event_id", evId).order("position"),
      supabase.from("documents").select("*").eq("event_id", evId).order("position"),
      supabase.from("library_items").select("*").eq("event_id", evId).order("position"),
      supabase.from("press_releases").select("*").eq("event_id", evId).order("position"),
      supabase.from("access_codes").select("*").eq("event_id", evId).order("created_at"),
    ]);
    for (const r of [hotels, news, documents, library, press, codes]) {
      if (r.error) throw new Error(r.error.message);
    }
    return {
      hotels: hotels.data ?? [],
      news: news.data ?? [],
      documents: documents.data ?? [],
      library_items: library.data ?? [],
      press_releases: press.data ?? [],
      access_codes: codes.data ?? [],
    };
  });

// ============ HOTELS ============
const hotelItem = z.object({
  position: z.number(),
  external_id: z.string().nullable().optional(),
  name: z.string().min(1),
  tier: i18n,
  address: i18n,
  description: i18n,
  perks: i18nList,
  contact: z.record(z.string(), z.string().nullable()).default({}),
  images: z.array(z.string()).default([]),
  map_url: z.string().nullable().optional(),
  website_url: z.string().nullable().optional(),
});

export const replaceHotels = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ event_id: z.string().uuid(), items: z.array(hotelItem) }).parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const del = await supabase.from("hotels").delete().eq("event_id", data.event_id);
    if (del.error) throw new Error(del.error.message);
    if (data.items.length) {
      const rows = data.items.map((it, idx) => ({
        event_id: data.event_id,
        position: idx,
        external_id: it.external_id ?? null,
        name: it.name,
        tier: it.tier,
        address: it.address,
        description: it.description,
        perks: it.perks as never,
        contact: it.contact as never,
        images: it.images as never,
        map_url: it.map_url ?? null,
        website_url: it.website_url ?? null,
      }));
      const ins = await supabase.from("hotels").insert(rows);
      if (ins.error) throw new Error(ins.error.message);
    }
    return { ok: true };
  });

// ============ NEWS ============
const newsItem = z.object({
  position: z.number(),
  slug: z.string().min(1),
  tag: z.string().nullable().optional(),
  title: i18n,
  excerpt: i18n,
  body: i18nList,
  cover_url: z.string().nullable().optional(),
  author: z.string().nullable().optional(),
  read_time: z.string().nullable().optional(),
  published_at: z.string().nullable().optional(),
});

export const replaceNews = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ event_id: z.string().uuid(), items: z.array(newsItem) }).parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const del = await supabase.from("news").delete().eq("event_id", data.event_id);
    if (del.error) throw new Error(del.error.message);
    if (data.items.length) {
      const rows = data.items.map((it, idx) => ({
        event_id: data.event_id,
        position: idx,
        slug: it.slug,
        tag: it.tag ?? null,
        title: it.title,
        excerpt: it.excerpt,
        body: it.body as never,
        cover_url: it.cover_url ?? null,
        author: it.author ?? null,
        read_time: it.read_time ?? null,
        published_at: it.published_at ?? null,
      }));
      const ins = await supabase.from("news").insert(rows);
      if (ins.error) throw new Error(ins.error.message);
    }
    return { ok: true };
  });

// ============ DOCUMENTS ============
const documentItem = z.object({
  position: z.number(),
  name: i18n,
  description: i18n,
  file_url: z.string().nullable().optional(),
  file_type: z.string().nullable().optional(),
  file_size: z.string().nullable().optional(),
  requires_code: z.boolean().default(false),
});

export const replaceDocuments = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ event_id: z.string().uuid(), items: z.array(documentItem) }).parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const del = await supabase.from("documents").delete().eq("event_id", data.event_id);
    if (del.error) throw new Error(del.error.message);
    if (data.items.length) {
      const rows = data.items.map((it, idx) => ({
        event_id: data.event_id,
        position: idx,
        name: it.name,
        description: it.description,
        file_url: it.file_url ?? null,
        file_type: it.file_type ?? null,
        file_size: it.file_size ?? null,
        requires_code: it.requires_code,
      }));
      const ins = await supabase.from("documents").insert(rows);
      if (ins.error) throw new Error(ins.error.message);
    }
    return { ok: true };
  });

// ============ LIBRARY ============
const libraryItem = z.object({
  position: z.number(),
  external_id: z.string().nullable().optional(),
  type: z.enum(["photo", "video"]),
  day_index: z.number().nullable().optional(),
  title: i18n,
  thumbnail_url: z.string().min(1),
  source_url: z.string().min(1),
  requires_code: z.boolean().default(false),
});

export const replaceLibrary = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ event_id: z.string().uuid(), items: z.array(libraryItem) }).parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const del = await supabase.from("library_items").delete().eq("event_id", data.event_id);
    if (del.error) throw new Error(del.error.message);
    if (data.items.length) {
      const rows = data.items.map((it, idx) => ({
        event_id: data.event_id,
        position: idx,
        external_id: it.external_id ?? null,
        type: it.type,
        day_index: it.day_index ?? null,
        title: it.title,
        thumbnail_url: it.thumbnail_url,
        source_url: it.source_url,
        requires_code: it.requires_code,
      }));
      const ins = await supabase.from("library_items").insert(rows);
      if (ins.error) throw new Error(ins.error.message);
    }
    return { ok: true };
  });

// ============ PRESS RELEASES ============
const pressItem = z.object({
  position: z.number(),
  title: i18n,
  description: i18n,
  source: z.string().nullable().optional(),
  url: z.string().nullable().optional(),
  file_url: z.string().nullable().optional(),
  published_at: z.string().nullable().optional(),
});

export const replacePressReleases = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ event_id: z.string().uuid(), items: z.array(pressItem) }).parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const del = await supabase.from("press_releases").delete().eq("event_id", data.event_id);
    if (del.error) throw new Error(del.error.message);
    if (data.items.length) {
      const rows = data.items.map((it, idx) => ({
        event_id: data.event_id,
        position: idx,
        title: it.title,
        description: it.description,
        source: it.source ?? null,
        url: it.url ?? null,
        file_url: it.file_url ?? null,
        published_at: it.published_at ?? null,
      }));
      const ins = await supabase.from("press_releases").insert(rows);
      if (ins.error) throw new Error(ins.error.message);
    }
    return { ok: true };
  });

// ============ ACCESS CODES ============
const accessCodeItem = z.object({
  code: z.string().min(1),
  label: i18n,
  scope: z.enum(["all", "documents", "library"]).default("all"),
  max_uses: z.number().nullable().optional(),
  expires_at: z.string().nullable().optional(),
  active: z.boolean().default(true),
});

export const replaceAccessCodes = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ event_id: z.string().uuid(), items: z.array(accessCodeItem) }).parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const del = await supabase.from("access_codes").delete().eq("event_id", data.event_id);
    if (del.error) throw new Error(del.error.message);
    if (data.items.length) {
      const rows = data.items.map((it) => ({
        event_id: data.event_id,
        code: it.code.trim(),
        label: it.label,
        scope: it.scope,
        max_uses: it.max_uses ?? null,
        expires_at: it.expires_at ?? null,
        active: it.active,
        used_count: 0,
      }));
      const ins = await supabase.from("access_codes").insert(rows);
      if (ins.error) throw new Error(ins.error.message);
    }
    return { ok: true };
  });
