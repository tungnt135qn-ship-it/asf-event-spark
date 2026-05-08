import s1 from "@/assets/speakers/s1.jpg";
import s2 from "@/assets/speakers/s2.jpg";
import s3 from "@/assets/speakers/s3.jpg";
import s4 from "@/assets/speakers/s4.jpg";
import s5 from "@/assets/speakers/s5.jpg";
import s6 from "@/assets/speakers/s6.jpg";
import s7 from "@/assets/speakers/s7.jpg";
import s8 from "@/assets/speakers/s8.jpg";

export type SpeakerTopic = { slug: string; abbr: string; full: string };

export type Speaker = {
  id: string;
  img: string;
  title: string;
  name: string;
  role: string;
  org: string;
  bio: string;
  topics: SpeakerTopic[];
};

const SGF: SpeakerTopic = { slug: "sustainable-green-finance", abbr: "SGF", full: "Sustainable & Green Finance" };
const ABM: SpeakerTopic = { slug: "asia-bond-market-outlook", abbr: "ABM", full: "Asia Bond Market Outlook" };
const CCF: SpeakerTopic = { slug: "cross-border-capital-flows", abbr: "CCF", full: "Cross-border Capital Flows" };
const DAT: SpeakerTopic = { slug: "digital-assets-tokenization", abbr: "DAT", full: "Digital Assets & Tokenization" };
const MIR: SpeakerTopic = { slug: "market-infrastructure-resilience", abbr: "MIR", full: "Market Infrastructure & Resilience" };

export const speakers: Speaker[] = [
  { id: "laurent", img: s1, title: "Dr.", name: "Christine Laurent", role: "President", org: "European Central Bank", bio: "Steering Europe's monetary policy and championing global financial stability.", topics: [SGF, ABM, CCF, MIR] },
  { id: "dorman", img: s2, title: "Mr.", name: "James Dorman", role: "CEO", org: "JP Morgan Asia", bio: "Leading one of the world's largest investment banks across Asia-Pacific markets.", topics: [ABM, CCF, DAT] },
  { id: "tanaka", img: s3, title: "Prof.", name: "Hiroshi Tanaka", role: "Managing Director", org: "Japan Securities Dealers Assoc.", bio: "Expert on cross-border fixed income flows across Asia.", topics: [CCF, ABM] },
  { id: "minhanh", img: s4, title: "Ms.", name: "Le Thi Minh Anh", role: "Deputy Director", org: "State Securities Commission", bio: "Architect of Vietnam's market reform and ESG disclosure framework.", topics: [SGF, MIR, CCF, ABM] },
  { id: "mehta", img: s5, title: "Mr.", name: "Raj Mehta", role: "CEO", org: "Asia Capital Markets", bio: "Pioneer of digital bond issuance platforms in Southeast Asia.", topics: [DAT, MIR] },
  { id: "kim", img: s6, title: "Dr.", name: "Kim Soo-jin", role: "Chief Economist", org: "Korea Financial Investment", bio: "Authority on Asian monetary policy and rate cycles.", topics: [ABM, SGF] },
  { id: "lim", img: s7, title: "Mr.", name: "Andrew Lim", role: "Partner", org: "Singapore Exchange", bio: "Drives SGX's regional debt listing and clearing initiatives.", topics: [MIR, DAT, CCF, ABM] },
  { id: "santos", img: s8, title: "Ms.", name: "Maria Santos", role: "Head of ESG", org: "ASEAN Capital Markets Forum", bio: "Champion of sustainable finance and green bond standards.", topics: [SGF, CCF] },
];

export function getSpeakersForTopic(slug: string) {
  return speakers.filter((s) => s.topics.some((t) => t.slug === slug));
}

export function getSpeakersByIds(ids: string[]) {
  return ids.map((id) => speakers.find((s) => s.id === id)).filter(Boolean) as Speaker[];
}
