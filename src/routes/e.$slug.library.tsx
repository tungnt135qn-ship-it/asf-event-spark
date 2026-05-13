import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Starfield } from "@/components/Starfield";
import { Footer } from "@/components/sections/Footer";
import { Library } from "@/components/sections/Library";
import { Gated, LockedSection } from "@/components/LockedSection";
import { EventContentProvider } from "@/lib/event-context";
import { eventContentQueryOptions } from "./e.$slug";
import { pickI18n } from "@/lib/event-content";
import { buildEventHead } from "@/lib/seo-helpers";

export const Route = createFileRoute("/e/$slug/library")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(eventContentQueryOptions(params.slug)),
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [] };
    const lang = (loaderData.event.default_lang as "vi" | "en") ?? "vi";
    const evName = pickI18n(loaderData.event.name as never, lang, loaderData.event.slug);
    return buildEventHead({
      content: loaderData,
      path: `/e/${params.slug}/library`,
      override: {
        title: `Library — ${evName}`,
        description: lang === "vi"
          ? "Thư viện ảnh và video của các ngày sự kiện."
          : "Photos and videos across all event days.",
      },
    });
  },
  component: LibraryRoute,
});

function LibraryRoute() {
  const { slug } = Route.useParams();
  const { data: content } = useSuspenseQuery(eventContentQueryOptions(slug));
  return (
    <EventContentProvider content={content}>
      <div className="min-h-screen text-white">
        <Starfield />
        <Header />
        <main className="pt-20">
          <Gated fallback={<LockedSection id="library" eyebrow="Library" title="Photos & Videos" hint="Thư viện ảnh và video chính thức chỉ dành cho đại biểu đã đăng nhập." />}>
            <Library />
          </Gated>
        </main>
        <Footer />
      </div>
    </EventContentProvider>
  );
}
