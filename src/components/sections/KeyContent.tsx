import { Section } from "./Overview";
import { Leaf, BarChart3, Globe2, Cpu, Shield } from "lucide-react";

const topics = [
  {
    icon: Leaf,
    title: "Sustainable & Green Finance",
    desc: "ESG integration, transition finance, sustainability-linked bonds and Asia's path to net zero.",
  },
  {
    icon: BarChart3,
    title: "Asia Bond Market Outlook",
    desc: "Macro trends, yield curves, sovereign and corporate issuance across ASEAN+3 markets.",
  },
  {
    icon: Globe2,
    title: "Cross-border Capital Flows",
    desc: "Regulatory harmonisation, foreign investor access and regional connectivity initiatives.",
  },
  {
    icon: Cpu,
    title: "Digital Assets & Tokenization",
    desc: "Tokenized bonds, DLT settlement infrastructure and the future of post-trade systems.",
  },
  {
    icon: Shield,
    title: "Market Infrastructure & Resilience",
    desc: "Clearing, custody and risk management in a fragmented geopolitical landscape.",
  },
];

export function KeyContent() {
  return (
    <Section id="topics" eyebrow="Key Topics" title="What We'll Discuss">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {topics.map((t) => (
          <div
            key={t.title}
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-7 backdrop-blur-md transition hover:border-gold/40"
          >
            <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/30 bg-gold/10 text-gold">
              <t.icon size={26} />
            </div>
            <h3 className="mb-2 text-xl font-bold text-white">{t.title}</h3>
            <p className="text-sm leading-relaxed text-white/75">{t.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
