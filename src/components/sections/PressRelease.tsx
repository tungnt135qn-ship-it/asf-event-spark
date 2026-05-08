import { Section } from "./Overview";
import { ExternalLink, FileText } from "lucide-react";
import { useT } from "@/lib/i18n";

type PressItem = {
  date: string;
  title: string;
  description: string;
  url: string;
  source?: string;
};

const items: PressItem[] = [
  {
    date: "20 Mar 2026",
    title: "VBMA announces ASF 2026 host city and headline programme",
    description:
      "The Vietnam Bond Market Association formally announces Hanoi as the host city for the Asian Securities Forum 2026, alongside the headline programme.",
    url: "https://example.com/press/asf-2026-host-city",
    source: "VBMA Press Office",
  },
  {
    date: "05 Mar 2026",
    title: "ASF 2026 partners with leading Asian regulators on sustainable finance track",
    description:
      "Joint statement on the dedicated regulators' roundtable for sustainable and transition finance at ASF 2026.",
    url: "https://example.com/press/asf-2026-sustainable-track",
    source: "Joint Press Release",
  },
  {
    date: "18 Feb 2026",
    title: "Early-bird registration for ASF 2026 now open",
    description:
      "Delegate registration is open with early-bird pricing for member institutions until 15 August 2026.",
    url: "https://example.com/press/asf-2026-registration-open",
    source: "VBMA Secretariat",
  },
  {
    date: "10 Jan 2026",
    title: "ASF 2026 to feature dedicated digital assets & tokenization day",
    description:
      "Programme expands to include a dedicated full-day track on tokenised bonds and DLT-based market infrastructure.",
    url: "https://example.com/press/asf-2026-digital-assets-day",
    source: "VBMA Press Office",
  },
];

export function PressRelease() {
  const { t } = useT();
  return (
    <Section id="press" eyebrow={t("press.eyebrow")} title={t("press.title")}>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((p) => (
          <a
            key={p.title}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition hover:border-gold/40 hover:shadow-[var(--shadow-glow)]"
          >
            <div className="flex items-center justify-between text-xs text-white/60">
              <span className="inline-flex items-center gap-2">
                <FileText size={14} className="text-gold" />
                {p.source ?? t("press.default")}
              </span>
              <span>{p.date}</span>
            </div>
            <h3 className="text-base font-bold leading-snug text-white group-hover:text-gold">
              {p.title}
            </h3>
            <p className="text-sm leading-relaxed text-white/75">{p.description}</p>
            <span className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold text-gold">
              {t("press.readFull")} <ExternalLink size={12} />
            </span>
          </a>
        ))}
      </div>
    </Section>
  );
}
