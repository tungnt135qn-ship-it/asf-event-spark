import t1 from "@/assets/topics/t1.jpg";
import t2 from "@/assets/topics/t2.jpg";
import t3 from "@/assets/topics/t3.jpg";
import t4 from "@/assets/topics/t4.jpg";
import t5 from "@/assets/topics/t5.jpg";

export type Topic = {
  slug: string;
  title: string;
  desc: string;
  image: string;
  longDescription: string;
  highlights: string[];
  documents: { name: string; size: string }[];
};

export const topics: Topic[] = [
  {
    slug: "sustainable-green-finance",
    title: "Sustainable & Green Finance",
    desc: "ESG integration, transition finance, sustainability-linked bonds and Asia's path to net zero.",
    image: t1,
    longDescription:
      "Asia's transition to a net-zero economy hinges on the rapid scaling of sustainable finance. This track explores ESG integration in fixed income, the rise of sustainability-linked and transition bonds, taxonomy harmonisation across ASEAN+3, and the role of regulators and issuers in mobilising trillions of dollars of green capital.",
    highlights: [
      "Transition finance frameworks for hard-to-abate sectors",
      "ASEAN green & social bond standards alignment",
      "Sovereign sustainability-linked issuance pipeline",
      "Climate disclosure and ISSB adoption across the region",
    ],
    documents: [
      { name: "ASF 2026 — Green Finance Whitepaper.pdf", size: "2.4 MB" },
      { name: "ASEAN Taxonomy v3 Briefing.pdf", size: "1.1 MB" },
    ],
  },
  {
    slug: "asia-bond-market-outlook",
    title: "Asia Bond Market Outlook",
    desc: "Macro trends, yield curves, sovereign and corporate issuance across ASEAN+3 markets.",
    image: t2,
    longDescription:
      "A deep dive into the macroeconomic drivers shaping Asian bond markets in 2026 — from rate cycles and currency dynamics to sovereign and corporate issuance pipelines across the region.",
    highlights: [
      "ASEAN+3 sovereign yield curve outlook",
      "Corporate issuance trends and credit spreads",
      "Currency and FX hedging strategies",
      "Foreign investor positioning",
    ],
    documents: [
      { name: "Asia Bond Market Outlook 2026.pdf", size: "3.2 MB" },
    ],
  },
  {
    slug: "cross-border-capital-flows",
    title: "Cross-border Capital Flows",
    desc: "Regulatory harmonisation, foreign investor access and regional connectivity initiatives.",
    image: t3,
    longDescription:
      "Examining the structures, regulations and infrastructure enabling capital to flow across Asia — and the friction points that remain.",
    highlights: [
      "Bond Connect and CIBM Direct evolution",
      "ASEAN Collective Investment Schemes",
      "Regulatory passporting initiatives",
      "Cross-border settlement infrastructure",
    ],
    documents: [
      { name: "Cross-border Investor Access Report.pdf", size: "1.8 MB" },
    ],
  },
  {
    slug: "digital-assets-tokenization",
    title: "Digital Assets & Tokenization",
    desc: "Tokenized bonds, DLT settlement infrastructure and the future of post-trade systems.",
    image: t4,
    longDescription:
      "How tokenisation, distributed ledger technology and digital assets are reshaping the issuance, trading and settlement of fixed income instruments.",
    highlights: [
      "Tokenised bond issuance case studies",
      "DLT-based settlement and atomic DvP",
      "CBDCs and wholesale payment rails",
      "Regulatory sandboxes for digital securities",
    ],
    documents: [
      { name: "Tokenised Bonds in Asia.pdf", size: "2.0 MB" },
    ],
  },
  {
    slug: "market-infrastructure-resilience",
    title: "Market Infrastructure & Resilience",
    desc: "Clearing, custody and risk management in a fragmented geopolitical landscape.",
    image: t5,
    longDescription:
      "Building resilient market infrastructure — CCPs, CSDs, custody networks and cyber-security — to withstand geopolitical, operational and systemic shocks.",
    highlights: [
      "CCP risk and margin frameworks",
      "Operational resilience and DORA-style regimes",
      "Cyber-security in capital markets",
      "Geopolitical risk and sanctions compliance",
    ],
    documents: [
      { name: "Market Resilience Framework.pdf", size: "1.5 MB" },
    ],
  },
];

export function getTopic(slug: string) {
  return topics.find((t) => t.slug === slug);
}
