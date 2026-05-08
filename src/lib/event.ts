// Mock event date — easy to update later
export const EVENT_START = new Date("2026-04-14T09:00:00+07:00");
export const EVENT_END = new Date("2026-04-17T18:00:00+07:00");

export type EventDay = {
  index: number;
  date: Date;
  label: string;
  topicSlugs: string[];
  speakerIds: string[];
  sessions: {
    time: string;
    title: string;
    location?: string;
    description: string;
    tag: string;
  }[];
};

export const EVENT_DAYS: EventDay[] = [
  {
    index: 1,
    date: new Date("2026-04-14T00:00:00+07:00"),
    label: "Day 1 — Arrival & Pre-meeting",
    topicSlugs: ["cross-border-capital-flows"],
    speakerIds: ["laurent", "tanaka", "minhanh"],
    sessions: [
      { time: "09:00 – 12:00", title: "City Tour", location: "Hanoi Old Quarter", description: "Welcome city tour for delegates. Discover Hanoi's heritage, French Quarter and the Hoan Kiem Lake area with local guides.", tag: "Networking" },
      { time: "12:30 – 14:30", title: "Welcome Lunch", location: "Hotel Ballroom", description: "Informal lunch and badge collection for early arrivals.", tag: "Hospitality" },
      { time: "15:00 – 17:00", title: "ASF 2026 Pre-Meeting", location: "Conference Hall A", description: "Closed-door pre-meeting for ASF council members and invited delegates. Agenda alignment and country reports.", tag: "Council" },
      { time: "18:30 – 21:00", title: "Welcome Reception & Gala Dinner", location: "Grand Ballroom", description: "Opening reception hosted by VBMA with cultural performances and networking dinner.", tag: "Gala" },
    ],
  },
  {
    index: 2,
    date: new Date("2026-04-15T00:00:00+07:00"),
    label: "Day 2 — Main Event",
    topicSlugs: ["asia-bond-market-outlook", "sustainable-green-finance", "digital-assets-tokenization"],
    speakerIds: ["dorman", "kim", "santos", "mehta", "laurent"],
    sessions: [
      { time: "09:00 – 17:30", title: "ASF 2026 Main Conference", location: "Main Hall", description: "Full-day plenary and panel sessions. Detailed agenda to be finalized.", tag: "Main" },
    ],
  },
  {
    index: 3,
    date: new Date("2026-04-16T00:00:00+07:00"),
    label: "Day 3 — Conference & Investment Forum",
    topicSlugs: ["market-infrastructure-resilience", "cross-border-capital-flows", "asia-bond-market-outlook"],
    speakerIds: ["lim", "tanaka", "minhanh", "dorman"],
    sessions: [
      { time: "09:00 – 12:00", title: "ASF 2026 Closing Sessions", location: "Main Hall", description: "Closing plenary, working group reports and ASF communiqué.", tag: "Main" },
      { time: "14:00 – 17:00", title: "Vietnam Investment Conference", location: "Conference Hall B", description: "Vietnam Investment Conference — agenda to be finalized.", tag: "Investment" },
    ],
  },
  {
    index: 4,
    date: new Date("2026-04-17T00:00:00+07:00"),
    label: "Day 4 — Day Tour",
    topicSlugs: [],
    speakerIds: ["santos", "mehta"],
    sessions: [
      { time: "07:30 – 19:00", title: "Halong Bay Day Tour", location: "Halong Bay", description: "Optional full-day tour to Halong Bay, a UNESCO World Heritage Site. Transport, lunch and cruise included.", tag: "Tour" },
    ],
  },
];

export type DayStatus = "completed" | "live" | "upcoming";

export function getDayStatus(date: Date): DayStatus {
  const now = new Date();
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  if (now > end) return "completed";
  if (now >= start && now <= end) return "live";
  return "upcoming";
}

export function getEventStatus(): DayStatus {
  const now = new Date();
  if (now > EVENT_END) return "completed";
  if (now >= EVENT_START && now <= EVENT_END) return "live";
  return "upcoming";
}

export function getCountdown(target: Date = EVENT_START) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds, done: false };
}
