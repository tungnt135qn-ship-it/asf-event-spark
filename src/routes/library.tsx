import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Starfield } from "@/components/Starfield";
import { Footer } from "@/components/sections/Footer";
import { Library } from "@/components/sections/Library";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Library — ASF 2026" },
      { name: "description", content: "Photos and videos from Asian Securities Forum 2026 across all event days." },
    ],
  }),
  component: LibraryPage,
});

function LibraryPage() {
  return (
    <div className="min-h-screen text-white">
      <Starfield />
      <Header />
      <main className="pt-20">
        <Library />
      </main>
      <Footer />
    </div>
  );
}
