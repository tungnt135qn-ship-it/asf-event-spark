import { ExternalLink, CheckCircle2, Globe2, Building2, Calendar } from "lucide-react";
import overviewImg from "@/assets/overview-hanoi.jpg";
import vbmaLogo from "@/assets/vbma-logo.png";
import { useT } from "@/lib/i18n";

function Section({
  id,
  eyebrow,
  title,
  children,
  className = "",
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`relative px-4 py-14 sm:px-6 sm:py-20 lg:py-28 ${className}`}>
      <div className="mx-auto max-w-7xl">
        {(eyebrow || title) && (
          <div className="mb-8 text-center sm:mb-12">
            {eyebrow && (
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold sm:text-xs sm:tracking-[0.3em]">
                {eyebrow}
              </div>
            )}
            {title && (
              <h2 className="text-2xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
                <span className="text-gradient-gold">{title}</span>
              </h2>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

export function Overview() {
  const { t } = useT();
  const highlights = [
    { icon: Globe2, text: t("overview.h1") },
    { icon: Calendar, text: t("overview.h2") },
    { icon: CheckCircle2, text: t("overview.h3") },
  ];

  return (
    <Section id="overview" eyebrow={t("overview.eyebrow")} title={t("overview.title")}>
      <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
        {/* Left: Image */}
        <div className="relative">
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-gold/20 via-transparent to-destructive/20 blur-2xl" />
          <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
            <img
              src={overviewImg}
              alt="Asian Securities Forum 2026 in Hanoi"
              loading="lazy"
              width={1024}
              height={1280}
              className="h-full max-h-[580px] w-full object-cover object-bottom"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/70 via-transparent to-transparent" />
          </div>

          {/* Floating organizer logos */}
          <div className="absolute -bottom-6 -right-4 hidden items-center gap-3 rounded-2xl border border-gold/30 bg-white p-3 shadow-xl sm:flex">
            <img src={vbmaLogo} alt="VBMA" className="h-10 w-auto" />
          </div>
        </div>

        {/* Right: Content + Highlights */}
        <div className="space-y-6 text-white/85">
          <p className="text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: t("overview.lead") }} />

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gold">
              <Building2 size={16} /> {t("overview.orgsTitle")}
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-white/85">
              <p dangerouslySetInnerHTML={{ __html: t("overview.vbma") }} />
              <p dangerouslySetInnerHTML={{ __html: t("overview.vasb") }} />
            </div>
            <div className="mt-4 flex flex-wrap gap-4">
              <a
                href="https://vbma.org.vn/vi"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-gold underline-offset-4 hover:underline"
              >
                VBMA <ExternalLink size={14} />
              </a>
              <a
                href="https://vasb.vn/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-gold underline-offset-4 hover:underline"
              >
                VASB <ExternalLink size={14} />
              </a>
            </div>
          </div>

          <ul className="space-y-3">
            {highlights.map((h) => (
              <li
                key={h.text}
                className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3 transition hover:border-gold/30 hover:bg-white/[0.06]"
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-gold">
                  <h.icon size={16} />
                </span>
                <span className="text-sm text-white/90">{h.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

export { Section };
