import { Section } from "./Overview";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { topics } from "@/lib/topics";

export function KeyContent() {
  return (
    <Section id="topics" eyebrow="Key Topics" title="What We'll Discuss">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {topics.map((t) => (
          <div
            key={t.slug}
            className="group relative h-72 overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:border-gold/40 hover:shadow-[var(--shadow-glow)]"
          >
            <img
              src={t.image}
              alt={t.title}
              loading="lazy"
              width={800}
              height={600}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/40 to-transparent" />

            {/* Centered title */}
            <div className="absolute inset-0 flex items-center justify-center p-6 transition group-hover:opacity-0">
              <h3 className="text-center text-2xl font-bold text-white drop-shadow-lg">
                {t.title}
              </h3>
            </div>

            {/* Hover state */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-navy-deep/80 p-6 opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
              <h3 className="text-center text-2xl font-bold text-white">{t.title}</h3>
              <p className="line-clamp-3 text-center text-sm text-white/80">{t.desc}</p>
              <Link
                to="/topics/$slug"
                params={{ slug: t.slug }}
                className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2 text-sm font-bold text-navy-deep transition hover:bg-gold-soft"
              >
                Detail <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
