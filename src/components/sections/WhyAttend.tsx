import { Section } from "./Overview";
import { Users, TrendingUp, Landmark, Briefcase, ArrowUpRight, type LucideIcon } from "lucide-react";
import { useT } from "@/lib/i18n";
import { useWhyAttend } from "@/lib/event-adapters";

const ICONS: Record<string, LucideIcon> = {
  users: Users,
  "trending-up": TrendingUp,
  landmark: Landmark,
  briefcase: Briefcase,
};
const FALLBACK_ICONS = [Users, TrendingUp, Landmark, Briefcase];

export function WhyAttend() {
  const { t } = useT();
  const dbItems = useWhyAttend();
  const items = (dbItems
    ? dbItems.map((d, i) => ({
        icon: (d.icon && ICONS[d.icon]) || FALLBACK_ICONS[i % FALLBACK_ICONS.length],
        title: d.title,
        desc: d.desc,
        stat: d.stat,
        statLabel: d.statLabel,
      }))
    : [
        { icon: Users, title: t("why.1.title"), desc: t("why.1.desc"), stat: "100–150", statLabel: t("why.1.statLabel") },
        { icon: TrendingUp, title: t("why.2.title"), desc: t("why.2.desc"), stat: "30+", statLabel: t("why.2.statLabel") },
        { icon: Landmark, title: t("why.3.title"), desc: t("why.3.desc"), stat: "ICMA · ASIFMA · ICSA", statLabel: t("why.3.statLabel") },
        { icon: Briefcase, title: t("why.4.title"), desc: t("why.4.desc"), stat: "1:1", statLabel: t("why.4.statLabel") },
      ]);

  return (
    <Section id="why" eyebrow={t("why.eyebrow")} title={t("why.title")}>
      <div className="grid gap-5 lg:grid-cols-2">
        {items.map((it, i) => (
          <div
            key={it.title}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-7 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[var(--shadow-glow)]"
          >
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
                  {t("why.learnMore")} <ArrowUpRight size={14} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
