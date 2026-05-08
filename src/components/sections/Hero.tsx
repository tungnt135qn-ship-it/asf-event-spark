import { useEffect, useState } from "react";
import { Calendar, MapPin } from "lucide-react";
import { EVENT_START, getCountdown, getEventStatus } from "@/lib/event";
import logoUrl from "@/assets/asf-logo.png";

function StatusBadge() {
  const status = getEventStatus();
  const map = {
    upcoming: { text: "Upcoming", color: "bg-gold/20 text-gold border-gold/40" },
    live: { text: "Live Now", color: "bg-destructive/20 text-destructive border-destructive/50 animate-pulse" },
    completed: { text: "Completed", color: "bg-white/10 text-white/70 border-white/20" },
  } as const;
  const v = map[status];
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${v.color}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {v.text}
    </span>
  );
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="min-w-[64px] rounded-xl border border-white/15 bg-white/5 px-2 py-2.5 text-center backdrop-blur-md sm:min-w-[96px] sm:px-4 sm:py-3">
        <div className="text-gradient-gold text-2xl font-black tabular-nums sm:text-5xl">
          {value.toString().padStart(2, "0")}
        </div>
      </div>
      <div className="mt-2 text-[9px] uppercase tracking-[0.18em] text-white/70 sm:text-xs sm:tracking-[0.2em]">{label}</div>
    </div>
  );
}

export function Hero() {
  const [c, setC] = useState(getCountdown());

  useEffect(() => {
    const id = setInterval(() => setC(getCountdown()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-20"
    >
      {/* Glow background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,oklch(0.45_0.2_255_/_25%),transparent_60%)]" />
        <div className="absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,oklch(0.6_0.2_30_/_15%),transparent_70%)]" />
        <div className="absolute right-10 top-1/4 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,oklch(0.85_0.16_90_/_15%),transparent_70%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <div className="flex justify-center">
          <img
            src={logoUrl}
            alt="ASF 2026 Hanoi"
            className="h-48 w-auto drop-shadow-[0_0_60px_oklch(0.86_0.16_90_/_0.35)] sm:h-64 lg:h-80"
          />
        </div>
        <h1 className="sr-only">ASF 2026 — Asian Securities Forum, Hanoi</h1>
        <div className="mt-2 text-sm font-semibold uppercase tracking-[0.3em] text-white/80 sm:text-base">
          Asian Securities Forum
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-base text-white/80 sm:text-lg">
          Shaping the future of Asia's capital markets. Hosted by VBMA in Vietnam, ASF 2026
          convenes regulators, market leaders and global investors.
        </p>

        <a href="#location" className="mt-8 inline-flex flex-wrap items-center justify-center gap-4 rounded-full border border-white/15 bg-white/5 px-6 py-3 backdrop-blur-md transition hover:border-gold/50 hover:bg-white/10">
          <span className="inline-flex items-center gap-2 text-sm text-white">
            <Calendar size={16} className="text-gold" />
            1 – 4 October 2026
          </span>
          <span className="h-4 w-px bg-white/20" />
          <span className="inline-flex items-center gap-2 text-sm text-white">
            <MapPin size={16} className="text-gold" />
            Hanoi, Vietnam
          </span>
        </a>

        {/* Countdown */}
        <div className="mt-10 flex justify-center gap-3 sm:gap-5">
          <CountdownUnit value={c.days} label="Days" />
          <CountdownUnit value={c.hours} label="Hours" />
          <CountdownUnit value={c.minutes} label="Minutes" />
          <CountdownUnit value={c.seconds} label="Seconds" />
        </div>

      </div>
    </section>
  );
}
