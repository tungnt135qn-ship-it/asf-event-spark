import { Section } from "./Overview";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";
import { speakers, type Speaker } from "@/lib/speakers";

function SpeakerCard({ s }: { s: Speaker }) {
  return (
    <div className="group relative h-[480px] overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md transition hover:border-gold/40 hover:shadow-[var(--shadow-glow)]">
      <img
        src={s.img}
        alt={`${s.title} ${s.name}`}
        loading="lazy"
        width={512}
        height={640}
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />

      {/* Always-visible name footer — overlay only bottom 50% */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-navy-deep via-navy-deep/70 to-transparent transition group-hover:opacity-0">
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h3 className="text-lg font-bold text-white">
            <span className="text-gold/90">{s.title}</span> {s.name}
          </h3>
          <div className="mt-1 text-xs text-gold">{s.role}</div>
          {s.topics.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {s.topics.slice(0, 3).map((t) => (
                <span
                  key={t.abbr}
                  title={t.full}
                  className="rounded-full border border-gold/40 bg-gold/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-gold"
                >
                  {t.abbr}
                </span>
              ))}
              {s.topics.length > 3 && (
                <span className="rounded-full border border-white/20 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-white/70">
                  +{s.topics.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-navy-deep via-navy-deep/95 to-navy-deep/40 p-6 opacity-0 transition duration-300 group-hover:opacity-100">
        <h3 className="text-xl font-bold text-white">
          <span className="text-gold/90">{s.title}</span> {s.name}
        </h3>
        <div className="mt-1 text-sm font-semibold text-gold">{s.role}</div>
        <div className="mt-0.5 text-xs text-white/70">{s.org}</div>
        <p className="mt-3 text-sm leading-relaxed text-white/85">{s.bio}</p>
        {s.topics.length > 0 && (
          <div className="mt-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-gold/80">Topics</div>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {s.topics.map((t) => (
                <span
                  key={t.abbr}
                  className="rounded-full border border-gold/40 bg-gold/10 px-2.5 py-0.5 text-[11px] font-semibold text-gold"
                >
                  {t.full}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function Speakers() {
  const autoplay = useRef(Autoplay({ delay: 3500, stopOnInteraction: true }));

  return (
    <Section id="speakers" eyebrow="Speakers" title="Voices Shaping the Future">
      <Carousel
        opts={{ align: "start", loop: true }}
        plugins={[autoplay.current]}
        className="mx-auto w-full max-w-6xl"
      >
        <CarouselContent>
          {speakers.map((s) => (
            <CarouselItem key={s.name} className="sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <SpeakerCard s={s} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </Section>
  );
}
