import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Section } from "./Overview";
import { EVENT_DAYS } from "@/lib/event";
import { Image as ImageIcon, Play, Calendar, X, ArrowRight } from "lucide-react";
import { useT } from "@/lib/i18n";

export type MediaType = "photo" | "video";
export type MediaItem = {
  id: string;
  type: MediaType;
  dayIndex: number;
  title: string;
  thumb: string;
  src: string;
};

// Mock data — Unsplash thumbnails grouped by event day
export const MEDIA: MediaItem[] = [
  { id: "p1-1", type: "photo", dayIndex: 1, title: "Welcome reception", thumb: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&q=70", src: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1600&q=80" },
  { id: "p1-2", type: "photo", dayIndex: 1, title: "Hanoi city tour", thumb: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600&q=70", src: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1600&q=80" },
  { id: "v1-1", type: "video", dayIndex: 1, title: "Opening highlights", thumb: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&q=70", src: "https://www.w3.org/2010/05/sintel/trailer.mp4" },
  { id: "p2-1", type: "photo", dayIndex: 2, title: "Main conference", thumb: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=70", src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80" },
  { id: "p2-2", type: "photo", dayIndex: 2, title: "Panel discussion", thumb: "https://images.unsplash.com/photo-1559223607-a43c990c692c?w=600&q=70", src: "https://images.unsplash.com/photo-1559223607-a43c990c692c?w=1600&q=80" },
  { id: "p2-3", type: "photo", dayIndex: 2, title: "Networking lunch", thumb: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=600&q=70", src: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1600&q=80" },
  { id: "p3-1", type: "photo", dayIndex: 3, title: "Investment forum", thumb: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&q=70", src: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1600&q=80" },
  { id: "v3-1", type: "video", dayIndex: 3, title: "Closing remarks", thumb: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=600&q=70", src: "https://www.w3.org/2010/05/sintel/trailer.mp4" },
  { id: "p4-1", type: "photo", dayIndex: 4, title: "Halong Bay tour", thumb: "https://images.unsplash.com/photo-1528127269322-539801943592?w=600&q=70", src: "https://images.unsplash.com/photo-1528127269322-539801943592?w=1600&q=80" },
  { id: "p4-2", type: "photo", dayIndex: 4, title: "Sunset cruise", thumb: "https://images.unsplash.com/photo-1573472580784-44726eef3eed?w=600&q=70", src: "https://images.unsplash.com/photo-1573472580784-44726eef3eed?w=1600&q=80" },
];

type TypeFilter = "all" | MediaType;

export function Library({ preview = false }: { preview?: boolean }) {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [dayFilter, setDayFilter] = useState<number | "all">("all");
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);

  const items = useMemo(() => {
    const filtered = MEDIA.filter(
      (m) =>
        (typeFilter === "all" || m.type === typeFilter) &&
        (dayFilter === "all" || m.dayIndex === dayFilter),
    );
    return preview ? filtered.slice(0, 8) : filtered;
  }, [typeFilter, dayFilter, preview]);

  return (
    <Section id="library" eyebrow="Library" title="Photos & Videos">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {(
              [
                { k: "all", label: "All media", Icon: ImageIcon },
                { k: "photo", label: "Photos", Icon: ImageIcon },
                { k: "video", label: "Videos", Icon: Play },
              ] as const
            ).map(({ k, label, Icon }) => (
              <button
                key={k}
                onClick={() => setTypeFilter(k)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
                  typeFilter === k
                    ? "border-gold bg-gold/15 text-gold"
                    : "border-white/15 bg-white/5 text-white/75 hover:border-white/30"
                }`}
              >
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Calendar size={14} className="text-white/50" />
            <button
              onClick={() => setDayFilter("all")}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                dayFilter === "all"
                  ? "border-gold bg-gold/15 text-gold"
                  : "border-white/15 bg-white/5 text-white/75 hover:border-white/30"
              }`}
            >
              All days
            </button>
            {EVENT_DAYS.map((d) => (
              <button
                key={d.index}
                onClick={() => setDayFilter(d.index)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                  dayFilter === d.index
                    ? "border-gold bg-gold/15 text-gold"
                    : "border-white/15 bg-white/5 text-white/75 hover:border-white/30"
                }`}
              >
                Day {d.index} · {d.date.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
              </button>
            ))}
          </div>
        </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-sm text-white/60">
          No media for this filter yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((m) => (
            <button
              key={m.id}
              onClick={() => setPreviewItem(m)}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-left transition hover:border-gold/40"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-white/5">
                <img
                  src={m.thumb}
                  alt={m.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-navy-deep/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gold backdrop-blur">
                Day {m.dayIndex}
              </div>
              {m.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/90 text-navy-deep shadow-lg">
                    <Play size={20} fill="currentColor" />
                  </span>
                </div>
              )}
              <div className="p-3">
                <div className="truncate text-sm font-semibold text-white">{m.title}</div>
                <div className="mt-0.5 text-xs text-white/55 capitalize">{m.type}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {preview && (
        <div className="mt-8 flex justify-center">
          <Link
            to="/library"
            className="inline-flex items-center gap-2 rounded-full border-2 border-gold/60 px-6 py-2.5 text-sm font-semibold text-gold transition hover:bg-gold/10"
          >
            Xem tất cả <ArrowRight size={16} />
          </Link>
        </div>
      )}

      {previewItem && (
        <div
          onClick={() => setPreviewItem(null)}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 backdrop-blur"
        >
          <button
            onClick={() => setPreviewItem(null)}
            className="absolute right-4 top-4 rounded-full border border-white/20 bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Close"
          >
            <X size={20} />
          </button>
          <div onClick={(e) => e.stopPropagation()} className="max-h-[85vh] w-full max-w-5xl">
            {previewItem.type === "photo" ? (
              <img src={previewItem.src} alt={previewItem.title} className="mx-auto max-h-[85vh] rounded-xl object-contain" />
            ) : (
              <video src={previewItem.src} controls autoPlay className="mx-auto max-h-[85vh] w-full rounded-xl bg-black" />
            )}
            <div className="mt-3 text-center text-sm text-white/80">
              {previewItem.title} · Day {previewItem.dayIndex}
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}
