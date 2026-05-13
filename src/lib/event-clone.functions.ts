// Admin-only: clone the default event into a new draft event.
// Uses the auth-protected supabase client (RLS enforced as the calling user).
// Caller must be a super_admin (RLS on events table requires it for INSERT).
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const cloneInput = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  name_vi: z.string().min(1),
  name_en: z.string().min(1),
});

const CONTENT_TABLES = [
  "event_settings",
  "hero_content",
  "overview_content",
  "why_attend_items",
  "key_contents",
  "topics",
  "speakers",
  "agenda_days",
  "hotels",
  "news",
  "press_releases",
  "faqs",
  "sponsors",
  "documents",
  "library_items",
] as const;

type CloneRow = Record<string, unknown> & { id?: string; event_id?: string };

function stripMeta<T extends CloneRow>(row: T, newEventId: string): CloneRow {
  const { id: _id, created_at: _c, updated_at: _u, event_id: _e, ...rest } = row as CloneRow & {
    created_at?: unknown;
    updated_at?: unknown;
  };
  return { ...rest, event_id: newEventId };
}

export const cloneEventFromDefault = createServerFn({ method: "POST" })
  .inputValidator((d) => cloneInput.parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { supabase } = context;

    // 1) Find default event
    const { data: source, error: srcErr } = await supabase
      .from("events")
      .select("*")
      .eq("is_default", true)
      .maybeSingle();
    if (srcErr) throw new Error(`Cannot find default event: ${srcErr.message}`);
    if (!source) throw new Error("No default event found to clone from");

    // 2) Create the new draft event
    const { data: newEvent, error: insErr } = await supabase
      .from("events")
      .insert({
        slug: data.slug,
        name: { vi: data.name_vi, en: data.name_en },
        tagline: source.tagline,
        location: source.location,
        default_lang: source.default_lang,
        status: "draft",
        is_default: false,
        cover_url: source.cover_url,
        logo_url: source.logo_url,
        theme: source.theme,
      })
      .select("*")
      .single();
    if (insErr) throw new Error(`Cannot create event: ${insErr.message}`);

    // 3) Clone content tables (agenda_sessions handled separately because it FKs day_id)
    for (const table of CONTENT_TABLES) {
      const { data: rows, error } = await supabase
        .from(table)
        .select("*")
        .eq("event_id", source.id);
      if (error) throw new Error(`Read ${table}: ${error.message}`);
      if (!rows || rows.length === 0) continue;

      // For agenda_days we need to remember new ids to map sessions
      if (table === "agenda_days") {
        const dayIdMap = new Map<string, string>();
        for (const row of rows) {
          const oldId = (row as CloneRow).id as string;
          const payload = stripMeta(row as CloneRow, newEvent.id);
          const { data: inserted, error: dayErr } = await supabase
            .from("agenda_days")
            .insert(payload as never)
            .select("id")
            .single();
          if (dayErr) throw new Error(`Insert agenda_days: ${dayErr.message}`);
          dayIdMap.set(oldId, inserted.id);
        }

        // Now clone sessions, remapping day_id
        const { data: sessions, error: sErr } = await supabase
          .from("agenda_sessions")
          .select("*")
          .eq("event_id", source.id);
        if (sErr) throw new Error(`Read agenda_sessions: ${sErr.message}`);
        if (sessions && sessions.length > 0) {
          const payload = sessions.map((s) => {
            const stripped = stripMeta(s as CloneRow, newEvent.id);
            const oldDayId = (s as { day_id: string }).day_id;
            const newDayId = dayIdMap.get(oldDayId);
            return { ...stripped, day_id: newDayId };
          });
          const { error: insSErr } = await supabase
            .from("agenda_sessions")
            .insert(payload as never);
          if (insSErr) throw new Error(`Insert agenda_sessions: ${insSErr.message}`);
        }
        continue;
      }

      const payload = rows.map((r) => stripMeta(r as CloneRow, newEvent.id));
      const { error: insTableErr } = await supabase
        .from(table)
        .insert(payload as never);
      if (insTableErr) throw new Error(`Insert ${table}: ${insTableErr.message}`);
    }

    return { id: newEvent.id, slug: newEvent.slug };
  });
