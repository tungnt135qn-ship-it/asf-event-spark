import { Section } from "./Overview";
import { ArrowRight } from "lucide-react";

const news = [
  {
    date: "12 Mar 2026",
    tag: "Announcement",
    title: "ASF 2026 Programme Released — Record Lineup of Speakers",
    excerpt:
      "VBMA unveils the preliminary programme for ASF 2026 featuring over 60 speakers from regulators, exchanges and global asset managers.",
  },
  {
    date: "28 Feb 2026",
    tag: "Partnership",
    title: "Vietnam Investment Conference Joins ASF 2026 Agenda",
    excerpt:
      "A dedicated half-day Vietnam Investment Conference will close the forum, spotlighting opportunities in the country's capital markets.",
  },
  {
    date: "15 Jan 2026",
    tag: "Insight",
    title: "Asia's Sustainable Bond Market Hits New Milestone",
    excerpt:
      "Green and sustainability-linked bond issuance in Asia surged in 2025 — what this means for ASF 2026 delegates.",
  },
];

export function News() {
  return (
    <Section id="news" eyebrow="News" title="Latest Updates">
      <div className="grid gap-6 md:grid-cols-3">
        {news.map((n) => (
          <article
            key={n.title}
            className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md transition hover:-translate-y-1 hover:border-gold/40"
          >
            <div className="relative h-44 overflow-hidden bg-gradient-to-br from-navy via-secondary to-navy-deep">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,oklch(0.86_0.16_90_/_25%),transparent_60%)]" />
              <span className="absolute left-4 top-4 rounded-md bg-gold/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-navy-deep">
                {n.tag}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <div className="text-xs text-white/55">{n.date}</div>
              <h3 className="mt-2 text-lg font-bold leading-snug text-white">{n.title}</h3>
              <p className="mt-2 flex-1 text-sm text-white/70">{n.excerpt}</p>
              <a
                href="#"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold transition group-hover:gap-3"
              >
                Read more <ArrowRight size={14} />
              </a>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
