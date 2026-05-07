import { Section } from "./Overview";
import { Users, TrendingUp, Landmark, Sparkles } from "lucide-react";

const items = [
  {
    icon: Users,
    title: "Network with Industry Leaders",
    desc: "Connect with 500+ senior delegates from regulators, dealers, asset managers and exchanges across Asia.",
  },
  {
    icon: TrendingUp,
    title: "Market Insights",
    desc: "Hear first-hand analysis on Asia's fixed income, equities and sustainable finance landscape from leading economists.",
  },
  {
    icon: Landmark,
    title: "Policy Dialogue",
    desc: "Engage in candid conversations with regulators on cross-border capital flows, market reforms and ESG disclosure.",
  },
  {
    icon: Sparkles,
    title: "Investment Opportunities",
    desc: "Discover Vietnam — one of Asia's fastest-growing capital markets — through dedicated investment sessions.",
  },
];

export function WhyAttend() {
  return (
    <Section id="why" eyebrow="Why Attend" title="Why ASF 2026">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <div
            key={it.title}
            className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition hover:-translate-y-1 hover:border-gold/40 hover:shadow-[var(--shadow-glow)]"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold to-gold-soft text-navy-deep">
              <it.icon size={22} />
            </div>
            <h3 className="mb-2 text-lg font-bold text-white">{it.title}</h3>
            <p className="text-sm leading-relaxed text-white/75">{it.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
