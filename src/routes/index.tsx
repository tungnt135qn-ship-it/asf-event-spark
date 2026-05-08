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
import { Gated, LockedSection } from "@/components/LockedSection";
import { useT } from "@/lib/i18n";

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
  const { t } = useT();
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
        <Reveal variant="up">
          <Gated fallback={<LockedSection id="hotels" eyebrow={t("hotels.eyebrow")} title={t("hotels.title")} hint={t("hotels.lead")} />}>
            <Hotels />
          </Gated>
        </Reveal>
        <Reveal variant="fade"><Location /></Reveal>
        <Reveal variant="up"><Speakers /></Reveal>
        <Reveal variant="up"><KeyContent /></Reveal>
        <Reveal variant="up">
          <Gated fallback={<LockedSection id="library" eyebrow={t("library.eyebrow")} title={t("library.title")} hint={t("locked.note")} />}>
            <Library preview />
          </Gated>
        </Reveal>
        <Reveal variant="up">
          <Gated fallback={<LockedSection id="documents" eyebrow={t("documents.eyebrow")} title={t("documents.title")} hint={t("locked.note")} />}>
            <Documents />
          </Gated>
        </Reveal>
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
