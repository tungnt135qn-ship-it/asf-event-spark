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
import s1 from "@/assets/speakers/s1.jpg";
import s2 from "@/assets/speakers/s2.jpg";
import s3 from "@/assets/speakers/s3.jpg";
import s4 from "@/assets/speakers/s4.jpg";
import s5 from "@/assets/speakers/s5.jpg";
import s6 from "@/assets/speakers/s6.jpg";
import s7 from "@/assets/speakers/s7.jpg";
import s8 from "@/assets/speakers/s8.jpg";

type SpeakerTopic = { abbr: string; full: string };

const speakers: {
  img: string; title: string; name: string; role: string; org: string; bio: string; topics: SpeakerTopic[];
}[] = [
  { img: s1, title: "Dr.", name: "Christine Laurent", role: "President", org: "European Central Bank", bio: "Steering Europe's monetary policy and championing global financial stability.", topics: [
    { abbr: "SGF", full: "Sustainable & Green Finance" },
    { abbr: "ABM", full: "Asia Bond Market Outlook" },
    { abbr: "CCF", full: "Cross-border Capital Flows" },
    { abbr: "MIR", full: "Market Infrastructure & Resilience" },
  ]},
  { img: s2, title: "Mr.", name: "James Dorman", role: "CEO", org: "JP Morgan Asia", bio: "Leading one of the world's largest investment banks across Asia-Pacific markets.", topics: [
    { abbr: "ABM", full: "Asia Bond Market Outlook" },
    { abbr: "CCF", full: "Cross-border Capital Flows" },
    { abbr: "DAT", full: "Digital Assets & Tokenization" },
  ]},
  { img: s3, title: "Prof.", name: "Hiroshi Tanaka", role: "Managing Director", org: "Japan Securities Dealers Assoc.", bio: "Expert on cross-border fixed income flows across Asia.", topics: [
    { abbr: "CCF", full: "Cross-border Capital Flows" },
    { abbr: "ABM", full: "Asia Bond Market Outlook" },
  ]},
  { img: s4, title: "Ms.", name: "Le Thi Minh Anh", role: "Deputy Director", org: "State Securities Commission", bio: "Architect of Vietnam's market reform and ESG disclosure framework.", topics: [
    { abbr: "SGF", full: "Sustainable & Green Finance" },
    { abbr: "MIR", full: "Market Infrastructure & Resilience" },
    { abbr: "CCF", full: "Cross-border Capital Flows" },
    { abbr: "ABM", full: "Asia Bond Market Outlook" },
  ]},
  { img: s5, title: "Mr.", name: "Raj Mehta", role: "CEO", org: "Asia Capital Markets", bio: "Pioneer of digital bond issuance platforms in Southeast Asia.", topics: [
    { abbr: "DAT", full: "Digital Assets & Tokenization" },
    { abbr: "MIR", full: "Market Infrastructure & Resilience" },
  ]},
  { img: s6, title: "Dr.", name: "Kim Soo-jin", role: "Chief Economist", org: "Korea Financial Investment", bio: "Authority on Asian monetary policy and rate cycles.", topics: [
    { abbr: "ABM", full: "Asia Bond Market Outlook" },
    { abbr: "SGF", full: "Sustainable & Green Finance" },
  ]},
  { img: s7, title: "Mr.", name: "Andrew Lim", role: "Partner", org: "Singapore Exchange", bio: "Drives SGX's regional debt listing and clearing initiatives.", topics: [
    { abbr: "MIR", full: "Market Infrastructure & Resilience" },
    { abbr: "DAT", full: "Digital Assets & Tokenization" },
    { abbr: "CCF", full: "Cross-border Capital Flows" },
    { abbr: "ABM", full: "Asia Bond Market Outlook" },
  ]},
  { img: s8, title: "Ms.", name: "Maria Santos", role: "Head of ESG", org: "ASEAN Capital Markets Forum", bio: "Champion of sustainable finance and green bond standards.", topics: [
    { abbr: "SGF", full: "Sustainable & Green Finance" },
    { abbr: "CCF", full: "Cross-border Capital Flows" },
  ]},
];

function SpeakerCard({ s }: { s: (typeof speakers)[number] }) {
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
