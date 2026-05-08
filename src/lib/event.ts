// Mock event date — easy to update later
export const EVENT_START = new Date("2026-10-01T09:00:00+07:00");
export const EVENT_END = new Date("2026-10-04T18:00:00+07:00");

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
    date: new Date("2026-10-01T00:00:00+07:00"),
    label: "Day 1 — Arrival, City Tour & Pre-Meeting",
    topicSlugs: [],
    speakerIds: ["laurent", "tanaka", "minhanh"],
    sessions: [
      { time: "09:00 – 12:00", title: "City Tour Hà Nội", location: "Hanoi Old Quarter", description: "Welcome city tour for delegates. Discover Hanoi's heritage, French Quarter and Hoan Kiem Lake area with local guides.", tag: "Networking" },
      { time: "14:00 – 17:00", title: "ASF Pre-Meeting", location: "Meliá Hanoi — Conference Hall", description: "Closed-door ASF council pre-meeting: agenda alignment and country reports.", tag: "Council" },
      { time: "18:30 – 21:00", title: "Welcome Dinner", location: "Meliá Hanoi — Grand Ballroom", description: "Welcome dinner hosted by VBMA & VASB with cultural performances and networking.", tag: "Gala" },
    ],
  },
  {
    index: 2,
    date: new Date("2026-10-02T00:00:00+07:00"),
    label: "Day 2 — ASF Conference (Part 1)",
    topicSlugs: ["asian-equity-outlook", "asian-bond-markets", "digital-ai-capital-markets"],
    speakerIds: ["dorman", "kim", "santos", "mehta", "laurent"],
    sessions: [
      { time: "09:00 – 10:15", title: "Theme 1 — Recent Developments and Outlook for Asian Equity Markets", location: "Main Hall", description: "Cập nhật xu hướng thị trường cổ phiếu khu vực; triển vọng tăng trưởng và dòng vốn; tác động của chính sách tiền tệ, địa chính trị và công nghệ.", tag: "Plenary" },
      { time: "10:30 – 11:45", title: "Theme 2 — Development of Asian Bond Markets", location: "Main Hall", description: "Thực trạng và xu hướng phát triển thị trường trái phiếu; minh bạch, thanh khoản và chuẩn hoá; vai trò của trái phiếu trong ổn định tài chính khu vực.", tag: "Plenary" },
      { time: "13:30 – 14:45", title: "Theme 3 — Digitalization, Online Trading and AI: Transforming Capital Markets", location: "Main Hall", description: "Ứng dụng công nghệ số trong giao dịch chứng khoán; AI trong phân tích đầu tư và quản trị rủi ro; xu hướng chuyển đổi số trên thị trường vốn.", tag: "Plenary" },
      { time: "15:00 – 17:30", title: "Member Market Reports — Part 1", location: "Main Hall", description: "Báo cáo của các thị trường thành viên ASF — phần 1.", tag: "Reports" },
    ],
  },
  {
    index: 3,
    date: new Date("2026-10-03T00:00:00+07:00"),
    label: "Day 3 — ASF Conference (Part 2) & Vietnam Special Session",
    topicSlugs: ["asian-bond-markets", "vietnam-new-era"],
    speakerIds: ["lim", "tanaka", "minhanh", "dorman"],
    sessions: [
      { time: "09:00 – 12:00", title: "Member Market Reports — Part 2 & 3", location: "Main Hall", description: "Báo cáo của các thị trường thành viên ASF — phần 2 và 3. ASF chính thức kết thúc lúc 12:00.", tag: "Reports" },
      { time: "13:30 – 17:30", title: "Vietnam Special Session — Thị trường Chứng khoán Việt Nam: Kỷ nguyên mới", location: "Main Hall", description: "Hội thảo chuyên đề do phía Việt Nam đề xuất: Chiến lược phát triển vốn equity & debt; nhu cầu vốn cho hạ tầng; thúc đẩy kinh tế tư nhân; sức hấp dẫn của cổ phiếu & trái phiếu Việt Nam; đối thoại Nhà đầu tư quốc tế – Cơ quan quản lý – Doanh nghiệp.", tag: "Vietnam" },
    ],
  },
  {
    index: 4,
    date: new Date("2026-10-04T00:00:00+07:00"),
    label: "Day 4 — Halong Bay Day Tour",
    topicSlugs: [],
    speakerIds: ["santos", "mehta"],
    sessions: [
      { time: "07:30 – 19:00", title: "Tour Hạ Long trong ngày", location: "Halong Bay", description: "Day tour to Halong Bay — UNESCO World Heritage Site. Transport, lunch and cruise included.", tag: "Tour" },
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
