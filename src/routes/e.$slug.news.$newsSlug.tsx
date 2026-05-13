import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, CalendarDays, User2, Clock } from "lucide-react";
import { Header } from "@/components/Header";
import { Starfield } from "@/components/Starfield";
import { Footer } from "@/components/sections/Footer";
import { EventContentProvider } from "@/lib/event-context";
import { eventContentQueryOptions } from "./e.$slug";
import { useNewsList } from "@/lib/event-adapters";

export const Route = createFileRoute("/e/$slug/news/$newsSlug")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(eventContentQueryOptions(params.slug)),
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center text-white">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">Article not found</h1>
        <Link to="/" className="text-gold underline">Back to home</Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="flex min-h-screen items-center justify-center text-white">
      <p>{error.message}</p>
    </div>
  ),
  component: NewsRoute,
});

function NewsRoute() {
  const { slug, newsSlug } = Route.useParams();
  const { data: content } = useSuspenseQuery(eventContentQueryOptions(slug));
  return (
    <EventContentProvider content={content}>
      <NewsInner newsSlug={newsSlug} eventSlug={slug} />
    </EventContentProvider>
  );
}

function NewsInner({ newsSlug, eventSlug }: { newsSlug: string; eventSlug: string }) {
  const list = useNewsList();
  const n = list.find((x) => x.slug === newsSlug);
  if (!n) throw notFound();
  const others = list.filter((x) => x.slug !== n.slug).slice(0, 2);

  return (
    <div className="min-h-screen text-white">
      <Starfield />
      <Header />
      <main className="px-4 pb-20 pt-28">
        <article className="mx-auto max-w-3xl">
          <Link to="/e/$slug" params={{ slug: eventSlug }} hash="news" className="mb-6 inline-flex items-center gap-2 text-sm text-white/70 hover:text-gold">
            <ArrowLeft size={16} /> Back to News
          </Link>

          <h1 className="mb-4 text-3xl font-extrabold leading-tight sm:text-5xl">
            <span className="text-gradient-gold">{n.title}</span>
          </h1>

          <div className="mb-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/60">
            <span className="inline-flex items-center gap-1.5"><CalendarDays size={14} /> {n.date}</span>
            <span className="inline-flex items-center gap-1.5"><User2 size={14} /> {n.author}</span>
            <span className="inline-flex items-center gap-1.5"><Clock size={14} /> {n.readTime}</span>
          </div>

          <div className="mb-10 overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
            <img src={n.cover} alt={n.title} className="h-72 w-full object-cover sm:h-96" />
          </div>

          <p className="mb-8 text-lg leading-relaxed text-white/85">{n.excerpt}</p>

          <div className="space-y-6">
            {n.body.map((b, i) => {
              if (b.type === "p") return <p key={i} className="text-base leading-relaxed text-white/85">{b.text}</p>;
              if (b.type === "h") return <h2 key={i} className="mt-4 text-2xl font-bold text-white">{b.text}</h2>;
              if (b.type === "img") return (
                <figure key={i} className="my-6 overflow-hidden rounded-2xl border border-white/10">
                  <img src={b.src} alt={b.caption ?? ""} loading="lazy" className="h-auto w-full" />
                  {b.caption && <figcaption className="bg-white/5 px-4 py-2 text-center text-xs text-white/60">{b.caption}</figcaption>}
                </figure>
              );
              if (b.type === "quote") return (
                <blockquote key={i} className="my-6 rounded-2xl border-l-4 border-gold bg-white/5 p-6 italic text-white/90">
                  <p className="text-lg">"{b.text}"</p>
                  {b.author && <footer className="mt-2 text-sm not-italic text-gold">— {b.author}</footer>}
                </blockquote>
              );
              return null;
            })}
          </div>

          <div className="mt-16">
            <h2 className="mb-6 text-2xl font-bold">Related Stories</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {others.map((o) => (
                <Link key={o.slug} to="/e/$slug/news/$newsSlug" params={{ slug: eventSlug, newsSlug: o.slug }} className="group relative h-44 overflow-hidden rounded-2xl border border-white/10">
                  <img src={o.cover} alt={o.title} className="h-full w-full object-cover transition group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-gold">{o.tag}</div>
                    <h3 className="text-base font-bold text-white">{o.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
