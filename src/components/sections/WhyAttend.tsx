import { Section } from "./Overview";
import { Users, TrendingUp, Landmark, Briefcase, ArrowUpRight } from "lucide-react";

const items = [
  {
    icon: Users,
    title: "Network with Industry Leaders",
    desc: "Connect with 500+ senior delegates from regulators, dealers, asset managers and exchanges across Asia.",
    stat: "500+",
    statLabel: "Delegates",
  },
  {
    icon: TrendingUp,
    title: "Market Insights",
    desc: "Hear first-hand analysis on Asia's fixed income, equities and sustainable finance landscape.",
    stat: "20+",
    statLabel: "Markets",
  },
  {
    icon: Landmark,
    title: "Policy Dialogue",
    desc: "Engage in candid conversations with regulators on cross-border capital flows, market reforms and ESG disclosure.",
    stat: "15+",
    statLabel: "Regulators",
  },
  {
    icon: Briefcase,
    title: "Investment Opportunities",
    desc: "Discover Vietnam — one of Asia's fastest-growing capital markets — through dedicated investment sessions.",
    stat: "1:1",
    statLabel: "Meetings",
  },
];

export function WhyAttend() {
  return (
    <Section id="why" eyebrow="Why Attend" title="Why ASF 2026">
      <div className="grid gap-5 lg:grid-cols-2">
        {items.map((it, i) => (
          <div
            key={it.title}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-7 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[var(--shadow-glow)]"
          >
            {/* decorative number */}
            <div className="pointer-events-none absolute -right-4 -top-6 text-[120px] font-black leading-none text-white/[0.04] transition group-hover:text-gold/10">
              0{i + 1}
            </div>

            <div className="relative flex items-start gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gold to-gold-soft text-navy-deep shadow-lg shadow-gold/20">
                <it.icon size={26} />
              </div>

              <div className="flex-1">
                <div className="mb-3 flex items-baseline justify-between gap-3">
                  <h3 className="text-lg font-bold text-white sm:text-xl">{it.title}</h3>
                  <div className="text-right leading-tight">
                    <div className="text-gradient-gold text-2xl font-black tabular-nums">
                      {it.stat}
                    </div>
                    <div className="text-[10px] uppercase tracking-[0.15em] text-white/60">
                      {it.statLabel}
                    </div>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-white/75">{it.desc}</p>

                <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gold/80 opacity-0 transition group-hover:opacity-100">
                  Learn more <ArrowUpRight size={14} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
