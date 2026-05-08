import { Section } from "./Overview";
import { FileText, Download } from "lucide-react";
import { useT } from "@/lib/i18n";

const docs = [
  { name: "ASF 2026 Brochure", size: "2.4 MB", type: "PDF" },
  { name: "Preliminary Agenda", size: "1.1 MB", type: "PDF" },
  { name: "Sponsorship Pack", size: "3.8 MB", type: "PDF" },
  { name: "Vietnam Bond Market Report 2025", size: "5.2 MB", type: "PDF" },
  { name: "ASF 2025 Communiqué", size: "640 KB", type: "PDF" },
  { name: "Visa & Travel Guide", size: "1.8 MB", type: "PDF" },
];

export function Documents() {
  const { t } = useT();
  return (
    <Section id="documents" eyebrow={t("docs.eyebrow")} title={t("docs.title")}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {docs.map((d) => (
          <a
            key={d.name}
            href="#"
            className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition hover:border-gold/40"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold">
              <FileText size={22} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-white">{d.name}</div>
              <div className="text-xs text-white/55">{d.type} · {d.size}</div>
            </div>
            <Download size={18} className="shrink-0 text-white/50 transition group-hover:text-gold" />
          </a>
        ))}
      </div>
    </Section>
  );
}
