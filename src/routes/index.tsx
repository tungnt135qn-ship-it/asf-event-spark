import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Starfield } from "@/components/Starfield";
import { Hero } from "@/components/sections/Hero";
import { Overview } from "@/components/sections/Overview";
import { WhyAttend } from "@/components/sections/WhyAttend";
import { Agenda } from "@/components/sections/Agenda";
import { Register } from "@/components/sections/Register";
import { Hotels } from "@/components/sections/Hotels";
import { Location } from "@/components/sections/Location";
import { Speakers } from "@/components/sections/Speakers";
import { KeyContent } from "@/components/sections/KeyContent";
import { Documents } from "@/components/sections/Documents";
import { News } from "@/components/sections/News";
import { Sponsors } from "@/components/sections/Sponsors";
import { FAQ } from "@/components/sections/FAQ";
import { Footer } from "@/components/sections/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ASF 2026 — Asian Securities Forum | Hanoi, Vietnam" },
      {
        name: "description",
        content:
          "Asian Securities Forum 2026 — hosted by VBMA in Hanoi, Vietnam, 14–17 April 2026. Shaping Asia's capital markets.",
      },
      { property: "og:title", content: "ASF 2026 — Asian Securities Forum" },
      { property: "og:description", content: "Hosted by VBMA in Hanoi, 14–17 April 2026." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen text-white">
      <Starfield />
      <Header />
      <main>
        <Hero />
        <Overview />
        <WhyAttend />
        <Agenda />
        <Register />
        <Hotels />
        <Location />
        <Speakers />
        <KeyContent />
        <Documents />
        <News />
        <Sponsors />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
