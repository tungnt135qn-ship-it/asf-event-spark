import { ExternalLink } from "lucide-react";

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
    <section id={id} className={`relative px-4 py-20 lg:py-28 ${className}`}>
      <div className="mx-auto max-w-7xl">
        {(eyebrow || title) && (
          <div className="mb-12 text-center">
            {eyebrow && (
              <div className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
                {eyebrow}
              </div>
            )}
            {title && (
              <h2 className="text-3xl font-extrabold sm:text-5xl">
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
  const stats = [
    { v: "500+", l: "Delegates" },
    { v: "20+", l: "Countries" },
    { v: "60+", l: "Speakers" },
    { v: "30+", l: "Sessions" },
  ];

  return (
    <Section id="overview" eyebrow="Overview" title="Shaping Asia's Capital Markets">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="space-y-5 text-white/85">
          <p className="text-lg leading-relaxed">
            The <strong className="text-gold">Asian Securities Forum (ASF) 2026</strong> brings
            together regulators, exchanges, dealers, investors and policy-makers from across the
            region to discuss the future of fixed income, equities and sustainable finance in Asia.
          </p>
          <p className="leading-relaxed">
            ASF 2026 is hosted by the{" "}
            <a
              href="https://vbma.org.vn/vi"
              target="_blank"
              rel="noreferrer"
              className="text-gold underline-offset-4 hover:underline"
            >
              Vietnam Bond Market Association (VBMA)
            </a>{" "}
            — the official body representing institutional members of Vietnam's bond market.
            Established in 2009, VBMA promotes a transparent, efficient and sustainable fixed
            income market in Vietnam and acts as the voice of the industry to regulators and
            international counterparts.
          </p>
          <a
            href="https://vbma.org.vn/vi"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-gold/40 px-4 py-2 text-sm font-semibold text-gold transition hover:bg-gold/10"
          >
            Visit VBMA <ExternalLink size={14} />
          </a>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {stats.map((s) => (
            <div
              key={s.l}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-md transition hover:border-gold/40"
            >
              <div className="text-gradient-gold text-4xl font-black sm:text-5xl">{s.v}</div>
              <div className="mt-2 text-sm uppercase tracking-wider text-white/70">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

export { Section };
