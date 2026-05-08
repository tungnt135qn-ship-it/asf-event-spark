import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Section } from "./Overview";
import { EVENT_DAYS, getDayStatus, type DayStatus, type EventDay } from "@/lib/event";
import { speakers as ALL_SPEAKERS } from "@/lib/speakers";
import { topics as ALL_TOPICS } from "@/lib/topics";
import { useT } from "@/lib/i18n";
import { Clock, MapPin, CheckCircle2, Radio, CalendarClock, ChevronDown, LayoutGrid, Users, Tag } from "lucide-react";

function StatusPill({ status }: { status: DayStatus }) {
  const { t } = useT();
  const STATUS_CFG: Record<DayStatus, { text: string; cls: string; Icon: typeof Clock }> = {
    completed: { text: t("agenda.status.completed"), cls: "bg-white/10 text-white/60 border-white/20", Icon: CheckCircle2 },
    live: { text: t("agenda.status.live"), cls: "bg-destructive/20 text-destructive border-destructive/40 animate-pulse", Icon: Radio },
    upcoming: { text: t("agenda.status.upcoming"), cls: "bg-gold/15 text-gold border-gold/40", Icon: CalendarClock },
  };
  const cfg = STATUS_CFG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${cfg.cls}`}
    >
      <cfg.Icon size={12} />
      {cfg.text}
    </span>
  );
}

export function Agenda() {
  // active: -1 = "All" tab, otherwise day index
  const [active, setActive] = useState(0);
  const [openDays, setOpenDays] = useState<Record<number, boolean>>({});
  const day = active >= 0 ? EVENT_DAYS[active] : null;

  const toggleDay = (idx: number) =>
    setOpenDays((s) => ({ ...s, [idx]: !s[idx] }));

  return (
    <Section id="agenda" eyebrow="Agenda" title="Four Days of Insight">
      {/* Day tabs */}
      <div className="mb-8 flex flex-wrap justify-center gap-3">
        <button
          onClick={() => setActive(-1)}
          className={`group rounded-2xl border px-5 py-3 text-left transition ${
            active === -1
              ? "border-gold bg-gold/10 shadow-[var(--shadow-glow)]"
              : "border-white/10 bg-white/5 hover:border-white/30"
          }`}
        >
          <div className="flex items-center gap-2">
            <LayoutGrid size={14} className={active === -1 ? "text-gold" : "text-white/60"} />
            <div className={`text-xs font-bold uppercase tracking-wider ${active === -1 ? "text-gold" : "text-white/60"}`}>
              All
            </div>
          </div>
          <div className="mt-1 text-sm font-semibold text-white">All days</div>
        </button>
        {EVENT_DAYS.map((d, i) => {
          const status = getDayStatus(d.date);
          const isActive = i === active;
          return (
            <button
              key={d.index}
              onClick={() => setActive(i)}
              className={`group rounded-2xl border px-5 py-3 text-left transition ${
                isActive
                  ? "border-gold bg-gold/10 shadow-[var(--shadow-glow)]"
                  : "border-white/10 bg-white/5 hover:border-white/30"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`text-xs font-bold uppercase tracking-wider ${isActive ? "text-gold" : "text-white/60"}`}>
                  Day {d.index}
                </div>
                <StatusPill status={status} />
              </div>
              <div className="mt-1 text-sm font-semibold text-white">
                {d.date.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
              </div>
            </button>
          );
        })}
      </div>

      {active === -1 ? (
        // ALL view — collapsible per-day
        <div className="space-y-4">
          {EVENT_DAYS.map((d, i) => {
            const status = getDayStatus(d.date);
            const isOpen = !!openDays[i];
            return (
              <div
                key={d.index}
                className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md"
              >
                <button
                  onClick={() => toggleDay(i)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-gold">
                      Day {d.index}
                    </span>
                    <StatusPill status={status} />
                    <h3 className="text-base font-bold text-white sm:text-lg">{d.label}</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="hidden text-xs text-white/60 sm:inline">
                      {d.date.toLocaleDateString("en-GB", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span className="text-xs text-white/50">{d.sessions.length} sessions</span>
                    <ChevronDown
                      size={18}
                      className={`text-white/70 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </div>
                </button>
                <div className="border-t border-white/10 px-5 pb-4 pt-4">
                  <DayMeta day={d} />
                </div>
                {isOpen && (
                  <div className="border-t border-white/10 p-5 sm:p-8">
                    <ol className="relative space-y-6 border-l-2 border-gold/30 pl-6">
                      {d.sessions.map((s, idx) => (
                        <SessionItem key={idx} s={s} />
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Selected day timeline */
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md sm:p-10">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-2xl font-bold text-white">{day!.label}</h3>
            <div className="text-sm text-white/60">
              {day!.date.toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>

          <DayMeta day={day!} className="mb-6" />

          <ol className="relative space-y-6 border-l-2 border-gold/30 pl-6">
            {day!.sessions.map((s, idx) => (
              <SessionItem key={idx} s={s} />
            ))}
          </ol>

          <div className="mt-8 rounded-lg border border-gold/20 bg-gold/5 p-4 text-xs text-white/70">
            <strong className="text-gold">Note:</strong> Agenda is preliminary and may be updated.
            Last updated: {new Date().toLocaleDateString("en-GB")}
          </div>
        </div>
      )}
    </Section>
  );
}

type Session = (typeof EVENT_DAYS)[number]["sessions"][number];

function SessionItem({ s }: { s: Session }) {
  return (
    <li className="relative">
      <div className="absolute -left-[31px] top-2 h-4 w-4 rounded-full border-2 border-gold bg-navy-deep" />
      <div className="rounded-xl border border-white/10 bg-white/5 p-5 transition hover:border-gold/30">
        <div className="mb-2 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-gold/15 px-2 py-1 text-xs font-bold text-gold">
            <Clock size={12} /> {s.time}
          </span>
          <span className="rounded-md border border-white/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/70">
            {s.tag}
          </span>
        </div>
        <h4 className="text-lg font-bold text-white">{s.title}</h4>
        {s.location && (
          <div className="mt-1 inline-flex items-center gap-1.5 text-xs text-white/60">
            <MapPin size={12} /> {s.location}
          </div>
        )}
        <p className="mt-2 text-sm leading-relaxed text-white/75">{s.description}</p>
      </div>
    </li>
  );
}

function DayMeta({ day, className = "" }: { day: EventDay; className?: string }) {
  const dayTopics = ALL_TOPICS.filter((t) => day.topicSlugs.includes(t.slug));
  const daySpeakers = day.speakerIds
    .map((id) => ALL_SPEAKERS.find((s) => s.id === id))
    .filter(Boolean) as typeof ALL_SPEAKERS;

  if (dayTopics.length === 0 && daySpeakers.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-x-6 gap-y-3 ${className}`}>
      {daySpeakers.length > 0 && (
        <div className="flex items-center gap-2">
          <Users size={14} className="text-gold/80" />
          <div className="flex -space-x-2">
            {daySpeakers.slice(0, 6).map((s) => (
              <img
                key={s.id}
                src={s.img}
                alt={s.name}
                title={`${s.title} ${s.name} — ${s.role}`}
                className="h-8 w-8 rounded-full border-2 border-navy-deep object-cover"
                loading="lazy"
              />
            ))}
            {daySpeakers.length > 6 && (
              <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-navy-deep bg-white/10 text-[10px] font-bold text-white/80">
                +{daySpeakers.length - 6}
              </span>
            )}
          </div>
        </div>
      )}

      {dayTopics.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <Tag size={14} className="text-gold/80" />
          {dayTopics.map((t) => (
            <Link
              key={t.slug}
              to="/topics/$slug"
              params={{ slug: t.slug }}
              className="rounded-full border border-gold/40 bg-gold/10 px-2.5 py-0.5 text-[11px] font-semibold text-gold transition hover:bg-gold/20"
            >
              {t.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

