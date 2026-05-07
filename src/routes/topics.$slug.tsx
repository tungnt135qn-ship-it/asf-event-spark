import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { FileText, CheckCircle2, Download } from "lucide-react";
import { Header } from "@/components/Header";
import { Starfield } from "@/components/Starfield";
import { Footer } from "@/components/sections/Footer";
import { getTopic, topics, type Topic } from "@/lib/topics";

export const Route = createFileRoute("/topics/$slug")({
  loader: ({ params }) => {
    const topic = getTopic(params.slug);
    if (!topic) throw notFound();
    return topic;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — ASF 2026` },
          { name: "description", content: loaderData.desc },
          { property: "og:title", content: `${loaderData.title} — ASF 2026` },
          { property: "og:description", content: loaderData.desc },
          { property: "og:image", content: loaderData.image },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center text-white">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">Topic not found</h1>
        <Link to="/" className="text-gold underline">Back to home</Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="flex min-h-screen items-center justify-center text-white">
      <p>{error.message}</p>
    </div>
  ),
  component: TopicDetail,
});

function TopicDetail() {
  const t = Route.useLoaderData() as Topic;
  const others = topics.filter((x) => x.slug !== t.slug).slice(0, 3);

  return (
    <div className="min-h-screen text-white">
      <Starfield />
      <Header />
      <main className="px-4 pb-20 pt-28">
        <article className="mx-auto max-w-3xl">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            Key Topic
          </div>
          <h1 className="mb-6 text-4xl font-extrabold leading-tight sm:text-5xl">
            <span className="text-gradient-gold">{t.title}</span>
          </h1>

          <p className="mb-10 text-lg leading-relaxed text-white/85">{t.longDescription}</p>

          <div className="space-y-6">
            {t.content.map((b, i) => {
              if (b.type === "p")
                return (
                  <p key={i} className="text-base leading-relaxed text-white/85">
                    {b.text}
                  </p>
                );
              if (b.type === "h")
                return (
                  <h2 key={i} className="mt-4 text-2xl font-bold text-white">
                    {b.text}
                  </h2>
                );
              if (b.type === "img")
                return (
                  <figure key={i} className="my-6 overflow-hidden rounded-2xl border border-white/10">
                    <img src={b.src} alt={b.caption ?? ""} loading="lazy" className="h-auto w-full" />
                    {b.caption && (
                      <figcaption className="bg-white/5 px-4 py-2 text-center text-xs text-white/60">
                        {b.caption}
                      </figcaption>
                    )}
                  </figure>
                );
              if (b.type === "quote")
                return (
                  <blockquote
                    key={i}
                    className="my-6 rounded-2xl border-l-4 border-gold bg-white/5 p-6 italic text-white/90"
                  >
                    <p className="text-lg">"{b.text}"</p>
                    {b.author && (
                      <footer className="mt-2 text-sm not-italic text-gold">— {b.author}</footer>
                    )}
                  </blockquote>
                );
              return null;
            })}
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="mb-4 text-2xl font-bold">Session Highlights</h2>
              <ul className="space-y-3">
                {t.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4"
                  >
                    <CheckCircle2 className="mt-0.5 shrink-0 text-gold" size={18} />
                    <span className="text-sm text-white/85">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="mb-4 text-2xl font-bold">Documents</h2>
              <ul className="space-y-3">
                {t.documents.map((d) => (
                  <li
                    key={d.name}
                    className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="shrink-0 text-gold" size={20} />
                      <div>
                        <div className="text-sm font-semibold text-white">{d.name}</div>
                        <div className="text-xs text-white/60">PDF · {d.size}</div>
                      </div>
                    </div>
                    <button className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 text-gold transition hover:bg-gold hover:text-navy-deep">
                      <Download size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="mb-6 text-2xl font-bold">Explore More Topics</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {others.map((o) => (
                <Link
                  key={o.slug}
                  to="/topics/$slug"
                  params={{ slug: o.slug }}
                  className="group relative h-44 overflow-hidden rounded-2xl border border-white/10"
                >
                  <img src={o.image} alt={o.title} className="h-full w-full object-cover transition group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
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
