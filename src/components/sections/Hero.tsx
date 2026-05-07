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
      <div className="min-w-[56px] rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-center backdrop-blur-md sm:min-w-[72px]">
        <div className="text-gradient-gold text-2xl font-black tabular-nums sm:text-3xl">
          {value.toString().padStart(2, "0")}
        </div>
      </div>
      <div className="mt-1.5 text-[10px] uppercase tracking-[0.2em] text-white/70">{label}</div>
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
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-24 pb-10"
    >
      {/* Status badge pinned just under header */}
      <div className="absolute left-1/2 top-20 z-20 -translate-x-1/2 sm:top-24">
        <StatusBadge />
      </div>

      {/* Glow background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,oklch(0.45_0.2_255_/_25%),transparent_60%)]" />
        <div className="absolute bottom-0 left-1/4 h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,oklch(0.6_0.2_30_/_15%),transparent_70%)]" />
        <div className="absolute right-10 top-1/4 h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,oklch(0.85_0.16_90_/_15%),transparent_70%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <div className="flex justify-center">
          <img
            src={logoUrl}
            alt="ASF 2026 Hanoi"
            className="h-28 w-auto drop-shadow-[0_0_60px_oklch(0.86_0.16_90_/_0.35)] sm:h-36 lg:h-44"
          />
        </div>
        <h1 className="sr-only">ASF 2026 — Asian Securities Forum, Hanoi</h1>
        <div className="mt-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/80 sm:text-sm">
          Asian Securities Forum
        </div>

        <p className="mx-auto mt-4 max-w-2xl text-sm text-white/80 sm:text-base">
          Shaping the future of Asia's capital markets. Hosted by VBMA in Vietnam, ASF 2026
          convenes regulators, market leaders and global investors.
        </p>

        <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-3 rounded-full border border-white/15 bg-white/5 px-5 py-2 backdrop-blur-md">
          <span className="inline-flex items-center gap-2 text-xs text-white sm:text-sm">
            <Calendar size={14} className="text-gold" />
            10 – 13 November 2026
          </span>
          <span className="h-4 w-px bg-white/20" />
          <span className="inline-flex items-center gap-2 text-xs text-white sm:text-sm">
            <MapPin size={14} className="text-gold" />
            Hanoi, Vietnam
          </span>
        </div>

        {/* Countdown */}
        <div className="mt-6 flex justify-center gap-2 sm:gap-4">
          <CountdownUnit value={c.days} label="Days" />
          <CountdownUnit value={c.hours} label="Hours" />
          <CountdownUnit value={c.minutes} label="Minutes" />
          <CountdownUnit value={c.seconds} label="Seconds" />
        </div>

        <div id="register" className="mt-7 flex flex-wrap justify-center gap-3">
          <a
            href="#register"
            className="rounded-full bg-destructive px-6 py-2.5 text-sm font-semibold text-destructive-foreground shadow-lg shadow-destructive/30 transition hover:scale-105 hover:opacity-95 sm:text-base"
          >
            Register Now
          </a>
          <a
            href="#documents"
            className="rounded-full border-2 border-gold/60 bg-transparent px-6 py-2.5 text-sm font-semibold text-gold transition hover:bg-gold/10 sm:text-base"
          >
            Event Handbook
          </a>
        </div>

        <div className="mt-4 text-[11px] text-white/50">
          Event date: {EVENT_START.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
        </div>
      </div>
    </section>
  );
}
