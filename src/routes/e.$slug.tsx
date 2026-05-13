import { createFileRoute, notFound } from "@tanstack/react-router";
import { useQuery, queryOptions, useSuspenseQuery } from "@tanstack/react-query";
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
import { fetchEventContent, pickI18n } from "@/lib/event-content";
import { EventContentProvider } from "@/lib/event-context";

export const eventContentQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["event-content", slug],
    queryFn: async () => {
      const c = await fetchEventContent(slug);
      if (!c) throw notFound();
      return c;
    },
    staleTime: 60_000,
  });

export const Route = createFileRoute("/e/$slug")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(eventContentQueryOptions(params.slug)),
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [] };
    const ev = loaderData.event;
    const seo = (ev as { /* no seo on events row directly */ }) && loaderData.settings?.seo as
      | { title?: { vi?: string; en?: string }; description?: { vi?: string; en?: string }; og_image?: string }
      | null;
    const title = pickI18n(seo?.title ?? null, "vi", pickI18n(ev.name as never, "vi", ev.slug));
    const desc = pickI18n(seo?.description ?? null, "vi", pickI18n(ev.tagline as never, "vi", ""));
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        ...(seo?.og_image ? [{ property: "og:image", content: seo.og_image }] : ev.cover_url ? [{ property: "og:image", content: ev.cover_url }] : []),
      ],
    };
  },
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center text-white">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">Event not found</h1>
        <a href="/" className="text-gold underline">Back to home</a>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="flex min-h-screen items-center justify-center text-white">
      <div className="text-center max-w-md px-4">
        <h1 className="mb-4 text-2xl font-bold">Lỗi tải sự kiện</h1>
        <p className="text-white/70 text-sm">{error.message}</p>
      </div>
    </div>
  ),
  component: EventLanding,
});

function EventLanding() {
  const { slug } = Route.useParams();
  const { data: content } = useSuspenseQuery(eventContentQueryOptions(slug));
  const { t } = useT();

  return (
    <EventContentProvider content={content}>
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
    </EventContentProvider>
  );
}
