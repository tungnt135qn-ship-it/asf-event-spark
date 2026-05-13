import { Link } from "@tanstack/react-router";
import { Section } from "./Overview";
import { ArrowRight } from "lucide-react";
import { useNewsList, useCurrentEventSlug } from "@/lib/event-adapters";
import { useT } from "@/lib/i18n";

export function News() {
  const { t } = useT();
  const news = useNewsList();
  const eventSlug = useCurrentEventSlug();
  return (
    <Section id="news" eyebrow={t("news.eyebrow")} title={t("news.title")}>
      <div className="grid gap-6 md:grid-cols-3">
        {news.map((n) => {
          const cardClass = "group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md transition hover:-translate-y-1 hover:border-gold/40";
          const body = (
            <>
              <div className="relative h-44 overflow-hidden">
                <img src={n.cover} alt={n.title} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/80 via-navy-deep/10 to-transparent" />
                <span className="absolute left-4 top-4 rounded-md bg-gold/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-navy-deep">
                  {n.tag}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="text-xs text-white/55">{n.date} · {n.readTime}</div>
                <h3 className="mt-2 text-lg font-bold leading-snug text-white">{n.title}</h3>
                <div className="mt-2 flex-1 text-sm text-white/70" dangerouslySetInnerHTML={{ __html: n.excerpt }} />
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold transition group-hover:gap-3">
                  {t("news.readMore")} <ArrowRight size={14} />
                </span>
              </div>
            </>
          );
          return eventSlug ? (
            <Link key={n.slug} to="/e/$slug/news/$newsSlug" params={{ slug: eventSlug, newsSlug: n.slug }} className={cardClass}>
              {body}
            </Link>
          ) : (
            <Link key={n.slug} to="/news/$slug" params={{ slug: n.slug }} className={cardClass}>
              {body}
            </Link>
          );
        })}
      </div>
    </Section>
  );
}
