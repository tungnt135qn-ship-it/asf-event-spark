import n1 from "@/assets/news/n1.jpg";
import n2 from "@/assets/news/n2.jpg";
import n3 from "@/assets/news/n3.jpg";

export type NewsBlock =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "img"; src: string; caption?: string }
  | { type: "quote"; text: string; author?: string };

export type NewsItem = {
  slug: string;
  date: string;
  tag: string;
  title: string;
  excerpt: string;
  cover: string;
  author: string;
  readTime: string;
  body: NewsBlock[];
};

export const news: NewsItem[] = [
  {
    slug: "asf-2026-programme-released",
    date: "12 Mar 2026",
    tag: "Announcement",
    title: "ASF 2026 Programme Released — Record Lineup of Speakers",
    excerpt:
      "VBMA unveils the preliminary programme for ASF 2026 featuring over 60 speakers from regulators, exchanges and global asset managers.",
    cover: n1,
    author: "VBMA Secretariat",
    readTime: "4 min read",
    body: [
      {
        type: "p",
        text: "The Vietnam Bond Market Association (VBMA), together with the Vietnam Association of Securities Business (VASB), has officially unveiled the preliminary programme for the Asian Securities Forum (ASF) 2026, taking place 1–4 October 2026 at Meliá Hanoi Hotel, Hà Nội. The four-day programme covers three core ASF themes plus a dedicated Vietnam special session.",
      },
      { type: "h", text: "A regional dialogue at scale" },
      {
        type: "p",
        text: "ASF 2026 brings together regulators, exchanges, dealers and institutional investors representing more than 30 securities associations across Asia – Oceania. Plenary sessions will focus on Asian equity outlook, bond market development, digitalization & AI in capital markets, plus a dedicated Vietnam special session 'New Era for Vietnam Capital Markets'.",
      },
      { type: "img", src: n2, caption: "Hanoi — host city of ASF 2026" },
      { type: "h", text: "Speaker highlights" },
      {
        type: "p",
        text: "Confirmed keynote speakers include senior officials from the Ministry of Finance of Vietnam, the State Securities Commission, Bank of Japan, Bank Negara Malaysia, the Monetary Authority of Singapore, as well as global executives from JP Morgan, BlackRock, MUFG and Standard Chartered.",
      },
      {
        type: "quote",
        text: "ASF 2026 is the most ambitious edition we have hosted. Our goal is to make Hanoi the regional hub for capital-markets dialogue this October.",
        author: "VBMA Secretary General",
      },
      {
        type: "p",
        text: "The full agenda, side events and Vietnam special session programme will be published in the Documents section in the coming weeks. Early-bird registration closes 15 August 2026.",
      },
    ],
  },
  {
    slug: "vietnam-investment-conference-joins-asf",
    date: "28 Feb 2026",
    tag: "Partnership",
    title: "Vietnam Investment Conference Joins ASF 2026 Agenda",
    excerpt:
      "A dedicated half-day Vietnam Investment Conference will close the forum, spotlighting opportunities in the country's capital markets.",
    cover: n2,
    author: "ASF Programme Committee",
    readTime: "3 min read",
    body: [
      {
        type: "p",
        text: "The Vietnam Investment Conference (VIC) will be integrated into the ASF 2026 programme as a dedicated half-day track on 17 April 2026, closing the forum with a deep-dive into Vietnam's rapidly developing capital markets.",
      },
      { type: "img", src: n2 },
      { type: "h", text: "Why Vietnam, why now" },
      {
        type: "p",
        text: "With nominal GDP growth above 6% and one of the fastest-expanding bond markets in Southeast Asia, Vietnam has become a focal point for regional and international investors. The VIC track will feature the State Securities Commission, leading domestic issuers and global investors active in Vietnamese fixed income and equities.",
      },
      {
        type: "p",
        text: "Sessions will cover the upgrade roadmap to FTSE / MSCI Emerging Market status, foreign-investor access reforms, ESG and green bond issuance pipelines, and the country's plans for tokenised securities.",
      },
    ],
  },
  {
    slug: "asia-sustainable-bond-market-milestone",
    date: "15 Jan 2026",
    tag: "Insight",
    title: "Asia's Sustainable Bond Market Hits New Milestone",
    excerpt:
      "Green and sustainability-linked bond issuance in Asia surged in 2025 — what this means for ASF 2026 delegates.",
    cover: n3,
    author: "VBMA Research",
    readTime: "5 min read",
    body: [
      {
        type: "p",
        text: "Sustainable bond issuance across Asia reached a record USD 320 billion in 2025, up 28% year-on-year. Green bonds accounted for the largest share, followed by sustainability-linked and social bonds.",
      },
      { type: "img", src: n3, caption: "Sustainable finance is reshaping Asia's bond markets" },
      { type: "h", text: "Drivers of growth" },
      {
        type: "p",
        text: "Three drivers stand out: the maturation of the ASEAN Taxonomy v3, sovereign sustainability-linked issuance from Indonesia, the Philippines and Vietnam, and rising investor demand for transition-finance instruments aligned with science-based pathways.",
      },
      {
        type: "quote",
        text: "Asia is no longer a follower in sustainable finance — it is becoming a standard-setter for the global market.",
        author: "Head of ESG, regional asset manager",
      },
      {
        type: "p",
        text: "ASF 2026 will dedicate a full track to sustainable & green finance, including a closed-door regulators' roundtable on taxonomy interoperability and a panel on transition finance for hard-to-abate sectors.",
      },
    ],
  },
];

export function getNews(slug: string) {
  return news.find((n) => n.slug === slug);
}
