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

const speakers = [
  { name: "Dr. Nguyen Hoang Duong", role: "Chairman", org: "VBMA", bio: "Leading Vietnam's bond market development with 20+ years in capital markets." },
  { name: "Le Thi Minh Anh", role: "Deputy Director", org: "State Securities Commission", bio: "Architect of Vietnam's market reform & ESG disclosure framework." },
  { name: "Hiroshi Tanaka", role: "Managing Director", org: "Japan Securities Dealers Assoc.", bio: "Expert on cross-border fixed income flows across Asia." },
  { name: "Sarah Chen", role: "Head of Asia Fixed Income", org: "Global Asset Management", bio: "Manages USD 30B+ in Asian credit and sovereign portfolios." },
  { name: "Raj Mehta", role: "CEO", org: "Asia Capital Markets", bio: "Pioneer of digital bond issuance platforms in Southeast Asia." },
  { name: "Kim Soo-jin", role: "Chief Economist", org: "Korea Financial Investment", bio: "Authority on Asian monetary policy and rate cycles." },
  { name: "Andrew Lim", role: "Partner", org: "Singapore Exchange", bio: "Drives SGX's regional debt listing and clearing initiatives." },
  { name: "Maria Santos", role: "Head of ESG", org: "ASEAN Capital Markets Forum", bio: "Champion of sustainable finance and green bond standards." },
];

const gradients = [
  "from-gold via-gold-soft to-amber-200",
  "from-blue-400 via-indigo-500 to-purple-500",
  "from-rose-400 via-pink-500 to-fuchsia-500",
  "from-emerald-400 via-teal-500 to-cyan-500",
  "from-orange-400 via-red-500 to-rose-500",
  "from-violet-400 via-purple-500 to-indigo-600",
  "from-cyan-400 via-sky-500 to-blue-600",
  "from-yellow-400 via-orange-500 to-red-500",
];

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("");
}

function SpeakerCard({ s, gradient }: { s: (typeof speakers)[number]; gradient: string }) {
  return (
    <div className="group relative h-[380px] overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md transition hover:border-gold/40 hover:shadow-[var(--shadow-glow)]">
      {/* Image / gradient avatar */}
      <div className={`relative h-full w-full bg-gradient-to-br ${gradient}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-7xl font-black text-white/90 drop-shadow-lg">{initials(s.name)}</span>
        </div>

        {/* Always-visible name footer */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-deep via-navy-deep/80 to-transparent p-5 transition group-hover:opacity-0">
          <h3 className="text-lg font-bold text-white">{s.name}</h3>
          <div className="mt-1 text-xs text-gold">{s.role}</div>
        </div>

        {/* Hover overlay with details */}
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-navy-deep via-navy-deep/95 to-navy-deep/40 p-6 opacity-0 transition duration-300 group-hover:opacity-100">
          <h3 className="text-xl font-bold text-white">{s.name}</h3>
          <div className="mt-1 text-sm font-semibold text-gold">{s.role}</div>
          <div className="mt-0.5 text-xs text-white/70">{s.org}</div>
          <p className="mt-3 text-sm leading-relaxed text-white/85">{s.bio}</p>
        </div>
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
          {speakers.map((s, i) => (
            <CarouselItem key={s.name} className="sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <SpeakerCard s={s} gradient={gradients[i % gradients.length]} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </Section>
  );
}
