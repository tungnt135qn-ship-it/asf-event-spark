// Shared types + client-safe fetchers for event content read by landing.
// Uses the browser supabase client (anon key); RLS allows public read for
// rows belonging to events with status='published'.
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Tables = Database["public"]["Tables"];

export type EventRow = Tables["events"]["Row"];
export type EventSettingsRow = Tables["event_settings"]["Row"];
export type HeroRow = Tables["hero_content"]["Row"];
export type OverviewRow = Tables["overview_content"]["Row"];
export type WhyAttendRow = Tables["why_attend_items"]["Row"];
export type KeyContentRow = Tables["key_contents"]["Row"];
export type TopicRow = Tables["topics"]["Row"];
export type SpeakerRow = Tables["speakers"]["Row"];
export type AgendaDayRow = Tables["agenda_days"]["Row"];
export type AgendaSessionRow = Tables["agenda_sessions"]["Row"];
export type HotelRow = Tables["hotels"]["Row"];
export type NewsRow = Tables["news"]["Row"];
export type PressRow = Tables["press_releases"]["Row"];
export type FaqRow = Tables["faqs"]["Row"];
export type SponsorRow = Tables["sponsors"]["Row"];
export type DocumentRow = Tables["documents"]["Row"];
export type LibraryItemRow = Tables["library_items"]["Row"];

export type EventContent = {
  event: EventRow;
  settings: EventSettingsRow | null;
  hero: HeroRow | null;
  overview: OverviewRow | null;
  whyAttend: WhyAttendRow[];
  keyContents: KeyContentRow[];
  topics: TopicRow[];
  speakers: SpeakerRow[];
  agendaDays: (AgendaDayRow & { sessions: AgendaSessionRow[] })[];
  hotels: HotelRow[];
  news: NewsRow[];
  pressReleases: PressRow[];
  faqs: FaqRow[];
  sponsors: SponsorRow[];
  documents: DocumentRow[];
  library: LibraryItemRow[];
};

export async function fetchPublishedEventBySlug(slug: string): Promise<EventRow | null> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchDefaultEventSlug(): Promise<string | null> {
  const { data, error } = await supabase
    .from("events")
    .select("slug")
    .eq("is_default", true)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw error;
  if (data?.slug) return data.slug;
  // fallback: first published
  const { data: fallback } = await supabase
    .from("events")
    .select("slug")
    .eq("status", "published")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  return fallback?.slug ?? null;
}

export async function fetchEventContent(slug: string): Promise<EventContent | null> {
  const event = await fetchPublishedEventBySlug(slug);
  if (!event) return null;
  const eventId = event.id;

  const [
    settings,
    hero,
    overview,
    whyAttend,
    keyContents,
    topics,
    speakers,
    agendaDays,
    agendaSessions,
    hotels,
    news,
    pressReleases,
    faqs,
    sponsors,
    documents,
    library,
  ] = await Promise.all([
    supabase.from("event_settings").select("*").eq("event_id", eventId).maybeSingle().then(r => r.data),
    supabase.from("hero_content").select("*").eq("event_id", eventId).maybeSingle().then(r => r.data),
    supabase.from("overview_content").select("*").eq("event_id", eventId).maybeSingle().then(r => r.data),
    supabase.from("why_attend_items").select("*").eq("event_id", eventId).order("position").then(r => r.data ?? []),
    supabase.from("key_contents").select("*").eq("event_id", eventId).order("position").then(r => r.data ?? []),
    supabase.from("topics").select("*").eq("event_id", eventId).order("position").then(r => r.data ?? []),
    supabase.from("speakers").select("*").eq("event_id", eventId).order("position").then(r => r.data ?? []),
    supabase.from("agenda_days").select("*").eq("event_id", eventId).order("position").then(r => r.data ?? []),
    supabase.from("agenda_sessions").select("*").eq("event_id", eventId).order("position").then(r => r.data ?? []),
    supabase.from("hotels").select("*").eq("event_id", eventId).order("position").then(r => r.data ?? []),
    supabase.from("news").select("*").eq("event_id", eventId).order("position").then(r => r.data ?? []),
    supabase.from("press_releases").select("*").eq("event_id", eventId).order("position").then(r => r.data ?? []),
    supabase.from("faqs").select("*").eq("event_id", eventId).order("position").then(r => r.data ?? []),
    supabase.from("sponsors").select("*").eq("event_id", eventId).order("position").then(r => r.data ?? []),
    supabase.from("documents").select("*").eq("event_id", eventId).order("position").then(r => r.data ?? []),
    supabase.from("library_items").select("*").eq("event_id", eventId).order("position").then(r => r.data ?? []),
  ]);

  const daysWithSessions = agendaDays.map(d => ({
    ...d,
    sessions: agendaSessions.filter(s => s.day_id === d.id),
  }));

  return {
    event,
    settings,
    hero,
    overview,
    whyAttend,
    keyContents,
    topics,
    speakers,
    agendaDays: daysWithSessions,
    hotels,
    news,
    pressReleases,
    faqs,
    sponsors,
    documents,
    library,
  };
}

// i18n picker helpers — JSONB columns are stored as { vi, en }
export type I18nText = { vi?: string; en?: string } | string | null | undefined;
export function pickI18n(value: I18nText, lang: "vi" | "en", fallback = ""): string {
  if (!value) return fallback;
  if (typeof value === "string") return value;
  return value[lang] || value.vi || value.en || fallback;
}

export function pickI18nList(value: { vi?: string[]; en?: string[] } | null | undefined, lang: "vi" | "en"): string[] {
  if (!value) return [];
  return value[lang] || value.vi || value.en || [];
}
