// Build per-route head() meta tags from EventContent + optional override.
import type { EventContent } from "@/lib/event-content";
import { pickI18n } from "@/lib/event-content";

const BASE_URL = "https://asf-event-spark.lovable.app";

type SeoJson = {
  title?: { vi?: string; en?: string };
  description?: { vi?: string; en?: string };
  og_image?: string;
} | null;

export function buildEventHead(args: {
  content: EventContent;
  path: string; // e.g. /e/asf-2026
  override?: { title?: string; description?: string; image?: string | null; type?: string };
}) {
  const { content, path, override } = args;
  const lang = (content.event.default_lang as "vi" | "en") ?? "vi";
  const seo = (content.settings?.seo as SeoJson) ?? null;
  const title =
    override?.title ||
    pickI18n(seo?.title ?? null, lang, pickI18n(content.event.name as never, lang, content.event.slug));
  const description =
    override?.description ||
    pickI18n(seo?.description ?? null, lang, pickI18n(content.event.tagline as never, lang, ""));
  const image =
    override?.image ?? seo?.og_image ?? content.event.cover_url ?? null;
  const url = `${BASE_URL}${path}`;
  const type = override?.type ?? "website";

  const meta: Array<Record<string, string>> = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { property: "og:url", content: url },
    { name: "twitter:card", content: image ? "summary_large_image" : "summary" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
  if (image) {
    meta.push({ property: "og:image", content: image });
    meta.push({ name: "twitter:image", content: image });
  }
  return {
    meta,
    links: [{ rel: "canonical", href: url }],
  };
}
