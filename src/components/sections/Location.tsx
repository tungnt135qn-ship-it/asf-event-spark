import { Section } from "./Overview";
import { MapPin, Navigation, Plane } from "lucide-react";

export function Location() {
  return (
    <Section id="location" eyebrow="Location" title="Where to Find Us">
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
              Venue
            </div>
            <h3 className="text-2xl font-bold text-white">Meliá Hanoi Hotel</h3>
            <div className="mt-3 flex items-start gap-2 text-sm text-white/80">
              <MapPin className="mt-0.5 shrink-0 text-gold" size={16} />
              <span>44B Ly Thuong Kiet, Hoan Kiem District, Hanoi, Vietnam</span>
            </div>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=Melia+Hanoi+Hotel"
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground transition hover:opacity-90"
            >
              <Navigation size={14} /> Open in Google Maps
            </a>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <div className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-gold">
              <Plane size={16} /> Getting Here
            </div>
            <ul className="space-y-2 text-sm text-white/75">
              <li>• 40 min drive from Noi Bai International Airport (HAN)</li>
              <li>• 5 min walk to Hoan Kiem Lake & Old Quarter</li>
              <li>• Shuttle service provided for registered delegates</li>
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
