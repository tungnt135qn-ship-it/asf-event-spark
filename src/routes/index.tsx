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
import { Library } from "@/components/sections/Library";
import { News } from "@/components/sections/News";
import { PressRelease } from "@/components/sections/PressRelease";
import { Sponsors } from "@/components/sections/Sponsors";
import { FAQ } from "@/components/sections/FAQ";
import { Contact } from "@/components/sections/Contact";
import { FloatingActions } from "@/components/FloatingActions";
import { Footer } from "@/components/sections/Footer";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ASF 2026 — Asian Securities Forum | Hanoi, Vietnam" },
      {
        name: "description",
        content:
          "Asian Securities Forum 2026 — co-hosted by VBMA & VASB in Hà Nội, Vietnam, 1–4 October 2026. Shaping Asia's capital markets.",
      },
      { property: "og:title", content: "ASF 2026 — Asian Securities Forum" },
      { property: "og:description", content: "Co-hosted by VBMA & VASB in Hà Nội, 1–4 October 2026." },
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
        <Reveal variant="up"><Overview /></Reveal>
        <Reveal variant="up"><WhyAttend /></Reveal>
        <Reveal variant="up"><Agenda /></Reveal>
        <Reveal variant="zoom"><Register /></Reveal>
        <Reveal variant="up"><Hotels /></Reveal>
        <Reveal variant="fade"><Location /></Reveal>
        <Reveal variant="up"><Speakers /></Reveal>
        <Reveal variant="up"><KeyContent /></Reveal>
        <Reveal variant="up"><Library preview /></Reveal>
        <Reveal variant="up"><Documents /></Reveal>
        <Reveal variant="up"><News /></Reveal>
        <Reveal variant="up"><PressRelease /></Reveal>
        <Reveal variant="fade"><Sponsors /></Reveal>
        <Reveal variant="left"><FAQ /></Reveal>
        <Reveal variant="up"><Contact /></Reveal>
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
