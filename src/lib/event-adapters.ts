// Adapter hooks that return mock-compatible shapes from the DB EventContent context.
// Falls back to the original mock data if no EventContent is in scope (legacy routes).
import { useMemo } from "react";
import { useOptionalEventContent } from "./event-context";
import { pickI18n, pickI18nList, type EventContent } from "./event-content";
import { EVENT_DAYS, EVENT_START, EVENT_END, type EventDay } from "./event";
import { speakers as MOCK_SPEAKERS, type Speaker, type SpeakerTopic } from "./speakers";
import { topics as MOCK_TOPICS, type Topic } from "./topics";
import { hotels as MOCK_HOTELS, type Hotel } from "./hotels";
import { news as MOCK_NEWS, type NewsItem, type NewsBlock } from "./news";

type Lang = "vi" | "en";

// ---------- Topics ----------
function dbTopicToMock(row: EventContent["topics"][number], lang: Lang): Topic {
  const docs = (row.documents as Array<{ name?: string; size?: string }> | null) ?? [];
  const blocks =
    ((row.content_blocks as { vi?: NewsBlock[]; en?: NewsBlock[] } | null)?.[lang] ??
      (row.content_blocks as { vi?: NewsBlock[]; en?: NewsBlock[] } | null)?.vi ??
      []) as NewsBlock[];
  return {
    slug: row.slug,
    title: pickI18n(row.title as never, lang),
    desc: pickI18n(row.summary as never, lang),
    image: row.image_url || "",
    longDescription: pickI18n(row.long_description as never, lang),
    highlights: pickI18nList(row.highlights as never, lang),
    documents: docs.map((d) => ({ name: d.name ?? "", size: d.size ?? "" })),
    content: blocks,
  };
}

export function useTopics(): Topic[] {
  const ctx = useOptionalEventContent();
  return useMemo(() => {
    if (!ctx?.content.topics?.length) return MOCK_TOPICS;
    return ctx.content.topics.map((r) => dbTopicToMock(r, ctx.lang));
  }, [ctx?.content.topics, ctx?.lang]);
}

export function useTopic(slug: string): Topic | undefined {
  return useTopics().find((t) => t.slug === slug);
}

// ---------- Speakers ----------
function dbSpeakerToMock(
  row: EventContent["speakers"][number],
  lang: Lang,
  topicLookup: Map<string, { abbr: string; full: string }>,
): Speaker {
  const slugs = (row.topic_slugs as string[] | null) ?? [];
  const topics: SpeakerTopic[] = slugs
    .map((s) => {
      const t = topicLookup.get(s);
      return t ? { slug: s, abbr: t.abbr, full: t.full } : null;
    })
    .filter(Boolean) as SpeakerTopic[];
  return {
    id: row.external_id || row.id,
    img: row.avatar_url || "",
    title: row.honorific || "",
    name: row.full_name,
    role: pickI18n(row.role as never, lang),
    org: pickI18n(row.organization as never, lang),
    bio: pickI18n(row.bio as never, lang),
    topics,
  };
}

export function useSpeakers(): Speaker[] {
  const ctx = useOptionalEventContent();
  return useMemo(() => {
    if (!ctx?.content.speakers?.length) return MOCK_SPEAKERS;
    const lookup = new Map<string, { abbr: string; full: string }>();
    for (const t of ctx.content.topics) {
      lookup.set(t.slug, { abbr: t.abbr || t.slug.slice(0, 2).toUpperCase(), full: pickI18n(t.title as never, ctx.lang) });
    }
    return ctx.content.speakers.map((r) => dbSpeakerToMock(r, ctx.lang, lookup));
  }, [ctx?.content.speakers, ctx?.content.topics, ctx?.lang]);
}

export function useSpeakersForTopic(slug: string): Speaker[] {
  return useSpeakers().filter((s) => s.topics.some((t) => t.slug === slug));
}

// ---------- Agenda days ----------
export function useAgendaDays(): EventDay[] {
  const ctx = useOptionalEventContent();
  return useMemo(() => {
    if (!ctx?.content.agendaDays?.length) return EVENT_DAYS;
    return ctx.content.agendaDays.map((d, i) => ({
      index: d.position || i + 1,
      date: new Date(d.date),
      label: pickI18n(d.label as never, ctx.lang),
      topicSlugs: (d.topic_slugs as string[] | null) ?? [],
      speakerIds: (d.speaker_external_ids as string[] | null) ?? [],
      sessions: d.sessions.map((s) => ({
        time: s.time_text,
        title: pickI18n(s.title as never, ctx.lang),
        location: pickI18n(s.location as never, ctx.lang) || undefined,
        description: pickI18n(s.description as never, ctx.lang),
        tag: s.tag || "",
      })),
    }));
  }, [ctx?.content.agendaDays, ctx?.lang]);
}

export function useEventDates(): { start: Date; end: Date; countdownTo: Date } {
  const ctx = useOptionalEventContent();
  return useMemo(() => {
    if (!ctx) return { start: EVENT_START, end: EVENT_END, countdownTo: EVENT_START };
    const start = ctx.content.event.start_at ? new Date(ctx.content.event.start_at) : EVENT_START;
    const end = ctx.content.event.end_at ? new Date(ctx.content.event.end_at) : EVENT_END;
    const countdownTo = ctx.content.hero?.countdown_to ? new Date(ctx.content.hero.countdown_to) : start;
    return { start, end, countdownTo };
  }, [ctx]);
}

// ---------- Hotels ----------
function dbHotelToMock(row: EventContent["hotels"][number], lang: Lang): Hotel {
  const contact = (row.contact as { name?: string; email?: string; phone?: string } | null) ?? {};
  const images = (row.images as string[] | null) ?? [];
  return {
    id: row.external_id || row.id,
    name: row.name,
    tier: pickI18n(row.tier as never, lang),
    address: pickI18n(row.address as never, lang),
    mapUrl: row.map_url || "",
    website: row.website_url || "",
    perks: pickI18nList(row.perks as never, lang),
    contact: {
      name: contact.name ?? "",
      email: contact.email ?? "",
      phone: contact.phone ?? "",
    },
    images,
    description: pickI18n(row.description as never, lang),
  };
}

export function useHotels(): Hotel[] {
  const ctx = useOptionalEventContent();
  return useMemo(() => {
    if (!ctx?.content.hotels?.length) return MOCK_HOTELS;
    return ctx.content.hotels.map((r) => dbHotelToMock(r, ctx.lang));
  }, [ctx?.content.hotels, ctx?.lang]);
}

// ---------- News ----------
function dbNewsToMock(row: EventContent["news"][number], lang: Lang): NewsItem {
  const body =
    ((row.body as { vi?: NewsBlock[]; en?: NewsBlock[] } | null)?.[lang] ??
      (row.body as { vi?: NewsBlock[]; en?: NewsBlock[] } | null)?.vi ??
      []) as NewsBlock[];
  const date = row.published_at
    ? new Date(row.published_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : "";
  return {
    slug: row.slug,
    date,
    tag: row.tag || "",
    title: pickI18n(row.title as never, lang),
    excerpt: pickI18n(row.excerpt as never, lang),
    cover: row.cover_url || "",
    author: row.author || "",
    readTime: row.read_time || "",
    body,
  };
}

export function useNewsList(): NewsItem[] {
  const ctx = useOptionalEventContent();
  return useMemo(() => {
    if (!ctx?.content.news?.length) return MOCK_NEWS;
    return ctx.content.news.map((r) => dbNewsToMock(r, ctx.lang));
  }, [ctx?.content.news, ctx?.lang]);
}

export function useNewsItem(slug: string): NewsItem | undefined {
  return useNewsList().find((n) => n.slug === slug);
}

// ---------- Sponsors ----------
export type SponsorTier = { name: string; items: string[] };
const SPONSOR_LABEL: Record<string, string> = {
  diamond: "Diamond Sponsors",
  gold: "Gold Sponsors",
  silver: "Silver Sponsors",
  partner: "Partners",
};

export function useSponsorTiers(): SponsorTier[] {
  const ctx = useOptionalEventContent();
  return useMemo(() => {
    const rows = ctx?.content.sponsors;
    if (!rows?.length) {
      return [
        { name: "Diamond Sponsors", items: ["Vietcombank", "BIDV"] },
        { name: "Gold Sponsors", items: ["VPBank", "Techcombank", "MB Securities", "ACB", "Sacombank"] },
        { name: "Silver Sponsors", items: ["SSI", "VNDirect", "HSC", "Mirae Asset", "VCBS", "BSC", "KIS"] },
        { name: "Partners", items: ["ASIFMA", "JSDA", "KOFIA", "ICMA", "SIFMA", "ASEAN+3 BMI", "ADB", "IFC"] },
      ];
    }
    const groups = new Map<string, string[]>();
    for (const s of rows) {
      const tier = (s.tier as string) || "partner";
      const arr = groups.get(tier) ?? [];
      arr.push(s.name);
      groups.set(tier, arr);
    }
    const order = ["diamond", "gold", "silver", "partner"];
    return order
      .filter((k) => groups.has(k))
      .map((k) => ({ name: SPONSOR_LABEL[k] ?? k, items: groups.get(k)! }));
  }, [ctx?.content.sponsors]);
}

// ---------- FAQ ----------
export type FaqItem = { q: string; a: string };
export function useFaqs(): FaqItem[] | null {
  const ctx = useOptionalEventContent();
  return useMemo(() => {
    const rows = ctx?.content.faqs;
    if (!rows?.length) return null;
    return rows.map((r) => ({
      q: pickI18n(r.question as never, ctx!.lang),
      a: pickI18n(r.answer as never, ctx!.lang),
    }));
  }, [ctx?.content.faqs, ctx?.lang]);
}

// ---------- Press releases ----------
export type PressItem = { date: string; title: string; description: string; url: string; source?: string };
export function usePressReleases(): PressItem[] | null {
  const ctx = useOptionalEventContent();
  return useMemo(() => {
    const rows = ctx?.content.pressReleases;
    if (!rows?.length) return null;
    return rows.map((p) => ({
      date: p.published_at
        ? new Date(p.published_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
        : "",
      title: pickI18n(p.title as never, ctx!.lang),
      description: pickI18n(p.description as never, ctx!.lang),
      url: p.url || p.file_url || "#",
      source: p.source ?? undefined,
    }));
  }, [ctx?.content.pressReleases, ctx?.lang]);
}

// ---------- Documents ----------
export type DocItem = { name: string; size: string; type: string; url?: string; requiresCode: boolean };
export function useDocuments(): DocItem[] | null {
  const ctx = useOptionalEventContent();
  return useMemo(() => {
    const rows = ctx?.content.documents;
    if (!rows?.length) return null;
    return rows.map((d) => ({
      name: pickI18n(d.name as never, ctx!.lang),
      size: d.file_size || "",
      type: d.file_type || "PDF",
      url: d.file_url ?? undefined,
      requiresCode: d.requires_code,
    }));
  }, [ctx?.content.documents, ctx?.lang]);
}

// ---------- Library ----------
export type LibraryItem = { id: string; type: "photo" | "video"; dayIndex: number; title: string; thumb: string; src: string };
export function useLibraryItems(): LibraryItem[] | null {
  const ctx = useOptionalEventContent();
  return useMemo(() => {
    const rows = ctx?.content.library;
    if (!rows?.length) return null;
    return rows.map((r) => ({
      id: r.external_id || r.id,
      type: (r.type as "photo" | "video") || "photo",
      dayIndex: r.day_index ?? 1,
      title: pickI18n(r.title as never, ctx!.lang),
      thumb: r.thumbnail_url,
      src: r.source_url,
    }));
  }, [ctx?.content.library, ctx?.lang]);
}

// ---------- WhyAttend ----------
export type WhyItem = { icon: string | null; title: string; desc: string; stat: string; statLabel: string };
export function useWhyAttend(): WhyItem[] | null {
  const ctx = useOptionalEventContent();
  return useMemo(() => {
    const rows = ctx?.content.whyAttend;
    if (!rows?.length) return null;
    return rows.map((r) => ({
      icon: r.icon,
      title: pickI18n(r.title as never, ctx!.lang),
      desc: pickI18n(r.description as never, ctx!.lang),
      stat: r.stat || "",
      statLabel: pickI18n(r.stat_label as never, ctx!.lang),
    }));
  }, [ctx?.content.whyAttend, ctx?.lang]);
}

// ---------- Key contents (topics highlights / cards on landing) ----------
// Reuses topics for the KeyContent section.

// ---------- Settings: footer / contact ----------
export function useEventSettings() {
  const ctx = useOptionalEventContent();
  return ctx?.content.settings ?? null;
}

// ---------- Current event slug (for Link params) ----------
export function useCurrentEventSlug(): string | null {
  const ctx = useOptionalEventContent();
  return ctx?.content.event.slug ?? null;
}
