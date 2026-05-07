import { Section } from "./Overview";

const tiers = [
  {
    name: "Diamond Sponsors",
    items: ["Vietcombank", "BIDV"],
    cls: "from-gold/30 to-gold/5 text-2xl h-28 min-w-[260px]",
  },
  {
    name: "Gold Sponsors",
    items: ["VPBank", "Techcombank", "MB Securities", "ACB", "Sacombank"],
    cls: "from-gold/20 to-transparent text-xl h-24 min-w-[220px]",
  },
  {
    name: "Silver Sponsors",
    items: ["SSI", "VNDirect", "HSC", "Mirae Asset", "VCBS", "BSC", "KIS"],
    cls: "from-white/10 to-transparent text-lg h-20 min-w-[180px]",
  },
  {
    name: "Partners",
    items: ["ASIFMA", "JSDA", "KOFIA", "ICMA", "SIFMA", "ASEAN+3 BMI", "ADB", "IFC"],
    cls: "from-white/5 to-transparent text-base h-16 min-w-[160px]",
  },
];

function Track({
  items,
  cls,
}: {
  items: string[];
  cls: string;
}) {
  return (
    <div className="flex shrink-0">
      {items.map((logo, i) => (
        <div
          key={`${logo}-${i}`}
          className={`mr-4 flex shrink-0 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br px-8 font-bold text-white/80 backdrop-blur-md transition hover:border-gold/30 hover:text-gold ${cls}`}
        >
          {logo}
        </div>
      ))}
    </div>
  );
}

function MarqueeRow({
  items,
  cls,
  reverse,
  speed,
}: {
  items: string[];
  cls: string;
  reverse: boolean;
  speed: number;
}) {
  return (
    <div className="group relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-navy-deep to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-navy-deep to-transparent" />

      <div
        className="flex w-max group-hover:[animation-play-state:paused]"
        style={{
          animation: `${reverse ? "marquee-right" : "marquee-left"} ${speed}s linear infinite`,
        }}
      >
        {/* Two identical tracks. Translating -50% loops seamlessly because
            each track ends with the same trailing margin (mr-4 on last item). */}
        <Track items={items} cls={cls} />
        <Track items={items} cls={cls} />
      </div>
    </div>
  );
}

export function Sponsors() {
  return (
    <Section id="sponsors" eyebrow="Partners" title="Sponsors & Partners">
      <div className="space-y-10">
        {tiers.map((tier, idx) => (
          <div key={tier.name}>
            <div className="mb-4 text-center text-xs font-bold uppercase tracking-[0.3em] text-gold">
              {tier.name}
            </div>
            <MarqueeRow
              items={tier.items}
              cls={tier.cls}
              reverse={idx % 2 === 1}
              speed={30 + idx * 8}
            />
          </div>
        ))}
      </div>
    </Section>
  );
}
