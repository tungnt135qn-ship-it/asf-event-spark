import { Section } from "./Overview";
import { MapPin, Navigation, Plane } from "lucide-react";
import { useT } from "@/lib/i18n";

export function Location() {
  const { t } = useT();
  return (
    <Section id="location" eyebrow={t("loc.eyebrow")} title={t("loc.title")}>
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="overflow-hidden rounded-2xl border border-white/10 lg:col-span-3">
          <iframe
            title="ASF 2026 Venue Map"
            src="https://www.google.com/maps?q=Melia+Hanoi+Hotel&output=embed"
            className="h-[420px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-gold">
              {t("loc.venue")}
            </div>
            <h3 className="text-2xl font-bold text-white">{t("loc.venueName")}</h3>
            <div className="mt-3 flex items-start gap-2 text-sm text-white/80">
              <MapPin className="mt-0.5 shrink-0 text-gold" size={16} />
              <span>{t("loc.address")}</span>
            </div>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=Melia+Hanoi+Hotel"
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground transition hover:opacity-90"
            >
              <Navigation size={14} /> {t("loc.openMaps")}
            </a>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <div className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-gold">
              <Plane size={16} /> {t("loc.gettingHere")}
            </div>
            <ul className="space-y-2 text-sm text-white/75">
              <li>• {t("loc.t1")}</li>
              <li>• {t("loc.t2")}</li>
              <li>• {t("loc.t3")}</li>
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
