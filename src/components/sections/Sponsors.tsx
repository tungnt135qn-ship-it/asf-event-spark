import { Section } from "./Overview";

const tiers = [
  {
    name: "Diamond Sponsors",
    items: ["Vietcombank", "BIDV"],
    cls: "from-gold/30 to-gold/5 text-2xl h-28",
  },
  {
    name: "Gold Sponsors",
    items: ["VPBank", "Techcombank", "MB Securities"],
    cls: "from-gold/20 to-transparent text-xl h-24",
  },
  {
    name: "Silver Sponsors",
    items: ["SSI", "VNDirect", "HSC", "Mirae Asset"],
    cls: "from-white/10 to-transparent text-lg h-20",
  },
  {
    name: "Partners",
    items: ["ASIFMA", "JSDA", "KOFIA", "ICMA", "SIFMA", "ASEAN+3 BMI"],
    cls: "from-white/5 to-transparent text-base h-16",
  },
];

export function Sponsors() {
  return (
    <Section id="sponsors" eyebrow="Partners" title="Sponsors & Partners">
      <div className="space-y-10">
        {tiers.map((tier) => (
          <div key={tier.name}>
            <div className="mb-4 text-center text-xs font-bold uppercase tracking-[0.3em] text-gold">
              {tier.name}
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {tier.items.map((logo) => (
                <div
                  key={logo}
                  className={`flex min-w-[180px] flex-1 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br p-4 font-bold text-white/80 backdrop-blur-md transition hover:border-gold/30 hover:text-gold ${tier.cls}`}
                  style={{ maxWidth: "240px" }}
                >
                  {logo}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
