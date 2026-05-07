import t1 from "@/assets/topics/t1.jpg";
import t2 from "@/assets/topics/t2.jpg";
import t3 from "@/assets/topics/t3.jpg";
import t4 from "@/assets/topics/t4.jpg";
import t5 from "@/assets/topics/t5.jpg";

export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "img"; src: string; caption?: string }
  | { type: "quote"; text: string; author?: string };

export type Topic = {
  slug: string;
  title: string;
  desc: string;
  image: string;
  longDescription: string;
  highlights: string[];
  documents: { name: string; size: string }[];
  content: ContentBlock[];
};

export const topics: Topic[] = [
  {
    slug: "sustainable-green-finance",
    title: "Sustainable & Green Finance",
    desc: "ESG integration, transition finance, sustainability-linked bonds and Asia's path to net zero.",
    image: t1,
    longDescription:
      "Asia's transition to a net-zero economy hinges on the rapid scaling of sustainable finance.",
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
    content: [
      {
        type: "p",
        text: "Asia is the epicentre of the global energy transition. With more than half of the world's emissions and the majority of its growth in renewable capacity, the region's sustainable-finance market has scaled from a niche product into a USD-trillion category in less than a decade.",
      },
      { type: "img", src: t1, caption: "ASEAN markets are reshaping green finance" },
      { type: "h", text: "From green bonds to transition finance" },
      {
        type: "p",
        text: "While green bonds dominated the first wave of issuance, transition finance is now the fastest-growing segment. Hard-to-abate sectors — steel, cement, shipping and aviation — require credible, science-based pathways and bond structures that reward measurable progress.",
      },
      {
        type: "quote",
        text: "Capital is no longer waiting for perfect taxonomies. It is rewarding credible transition plans today.",
        author: "Head of Sustainable Bonds, regional bank",
      },
      { type: "h", text: "What ASF 2026 will cover" },
      {
        type: "p",
        text: "Across two plenary sessions and a regulators' roundtable, ASF 2026 will examine taxonomy interoperability, the rise of sovereign sustainability-linked bonds and the operationalisation of ISSB-aligned climate disclosure across the region.",
      },
    ],
  },
  {
    slug: "asia-bond-market-outlook",
    title: "Asia Bond Market Outlook",
    desc: "Macro trends, yield curves, sovereign and corporate issuance across ASEAN+3 markets.",
    image: t2,
    longDescription: "Macro drivers shaping Asian bond markets in 2026.",
    highlights: [
      "ASEAN+3 sovereign yield curve outlook",
      "Corporate issuance trends and credit spreads",
      "Currency and FX hedging strategies",
      "Foreign investor positioning",
    ],
    documents: [{ name: "Asia Bond Market Outlook 2026.pdf", size: "3.2 MB" }],
    content: [
      {
        type: "p",
        text: "After a year of policy divergence, Asia's bond markets enter 2026 with cautious optimism. Inflation has normalised across most economies, central banks have begun easing, and foreign positioning in local-currency debt is at a multi-year high.",
      },
      { type: "img", src: t2 },
      { type: "h", text: "Sovereign issuance in focus" },
      {
        type: "p",
        text: "ASEAN+3 sovereigns are expected to issue a record USD 480 billion in 2026, with Indonesia, the Philippines and Vietnam leading on sustainability-linked structures and Japan extending its super-long curve.",
      },
      { type: "h", text: "What investors are watching" },
      {
        type: "p",
        text: "FX volatility, the pace of Fed easing, and China's policy stance remain the dominant cross-asset variables. Spreads on Asia IG corporates have compressed but offer relative value compared with US peers.",
      },
    ],
  },
  {
    slug: "cross-border-capital-flows",
    title: "Cross-border Capital Flows",
    desc: "Regulatory harmonisation, foreign investor access and regional connectivity initiatives.",
    image: t3,
    longDescription:
      "Examining structures and infrastructure enabling capital flow across Asia.",
    highlights: [
      "Bond Connect and CIBM Direct evolution",
      "ASEAN Collective Investment Schemes",
      "Regulatory passporting initiatives",
      "Cross-border settlement infrastructure",
    ],
    documents: [{ name: "Cross-border Investor Access Report.pdf", size: "1.8 MB" }],
    content: [
      {
        type: "p",
        text: "Cross-border capital flows in Asia have entered a new chapter. The combination of CIBM Direct enhancements, Bond Connect's southbound expansion and ASEAN's CIS passport are dismantling friction that defined the previous decade.",
      },
      { type: "img", src: t3 },
      { type: "h", text: "From access to interoperability" },
      {
        type: "p",
        text: "The next frontier is interoperability between national CSDs and harmonisation of withholding-tax regimes — both topics ASF 2026 will tackle in dedicated panels with senior regulators.",
      },
    ],
  },
  {
    slug: "digital-assets-tokenization",
    title: "Digital Assets & Tokenization",
    desc: "Tokenized bonds, DLT settlement infrastructure and the future of post-trade systems.",
    image: t4,
    longDescription: "Tokenisation, DLT and digital assets reshaping fixed income.",
    highlights: [
      "Tokenised bond issuance case studies",
      "DLT-based settlement and atomic DvP",
      "CBDCs and wholesale payment rails",
      "Regulatory sandboxes for digital securities",
    ],
    documents: [{ name: "Tokenised Bonds in Asia.pdf", size: "2.0 MB" }],
    content: [
      {
        type: "p",
        text: "From Hong Kong's tokenised green bond to Singapore's Project Guardian, Asia is leading the world in real-world adoption of distributed-ledger market infrastructure.",
      },
      { type: "img", src: t4 },
      { type: "h", text: "Atomic settlement is becoming real" },
      {
        type: "p",
        text: "Wholesale CBDCs and tokenised commercial-bank money are converging with on-chain securities to enable atomic delivery-versus-payment — collapsing settlement risk and unlocking intraday liquidity.",
      },
      {
        type: "quote",
        text: "By 2030, a meaningful share of Asia's IG primary market will be issued natively on-chain.",
        author: "Head of Digital Assets, global custodian",
      },
    ],
  },
  {
    slug: "market-infrastructure-resilience",
    title: "Market Infrastructure & Resilience",
    desc: "Clearing, custody and risk management in a fragmented geopolitical landscape.",
    image: t5,
    longDescription: "Building resilient market infrastructure to withstand systemic shocks.",
    highlights: [
      "CCP risk and margin frameworks",
      "Operational resilience and DORA-style regimes",
      "Cyber-security in capital markets",
      "Geopolitical risk and sanctions compliance",
    ],
    documents: [{ name: "Market Resilience Framework.pdf", size: "1.5 MB" }],
    content: [
      {
        type: "p",
        text: "Geopolitical fragmentation has elevated operational and cyber resilience to a board-level concern across Asia's exchanges, CCPs and custodians.",
      },
      { type: "img", src: t5 },
      { type: "h", text: "From compliance to capability" },
      {
        type: "p",
        text: "Operational-resilience regimes inspired by the EU's DORA are being adopted across major Asian jurisdictions, shifting the conversation from periodic compliance to continuous capability.",
      },
    ],
  },
];

export function getTopic(slug: string) {
  return topics.find((t) => t.slug === slug);
}
