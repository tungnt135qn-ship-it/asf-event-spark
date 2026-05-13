import { Section } from "./Overview";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useTopics, useCurrentEventSlug } from "@/lib/event-adapters";
import { useT } from "@/lib/i18n";

export function KeyContent() {
  const { t } = useT();
  const topics = useTopics();
  const eventSlug = useCurrentEventSlug();
  return (
    <Section id="topics" eyebrow={t("topics.eyebrow")} title={t("topics.title")}>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {topics.map((tp) => (
          <div
            key={tp.slug}
            className="group relative h-72 overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:border-gold/40 hover:shadow-[var(--shadow-glow)]"
          >
            <img
              src={tp.image}
              alt={tp.title}
              loading="lazy"
              width={800}
              height={600}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/40 to-transparent" />

            <div className="absolute inset-0 flex items-center justify-center p-6 transition group-hover:opacity-0">
              <h3 className="text-center text-2xl font-bold text-white drop-shadow-lg">
                {tp.title}
              </h3>
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-navy-deep/80 p-6 opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
              <h3 className="text-center text-2xl font-bold text-white">{tp.title}</h3>
              <p className="line-clamp-3 text-center text-sm text-white/80">{tp.desc}</p>
              {eventSlug ? (
                <Link
                  to="/e/$slug/topics/$topicSlug"
                  params={{ slug: eventSlug, topicSlug: tp.slug }}
                  className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2 text-sm font-bold text-navy-deep transition hover:bg-gold-soft"
                >
                  {t("topics.detail")} <ArrowRight size={16} />
                </Link>
              ) : (
                <Link
                  to="/topics/$slug"
                  params={{ slug: tp.slug }}
                  className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2 text-sm font-bold text-navy-deep transition hover:bg-gold-soft"
                >
                  {t("topics.detail")} <ArrowRight size={16} />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
