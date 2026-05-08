import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Starfield } from "@/components/Starfield";
import { Footer } from "@/components/sections/Footer";
import { useAuth } from "@/lib/auth";
import { useT } from "@/lib/i18n";
import { hotels } from "@/lib/hotels";
import { HotelCard } from "@/components/sections/Hotels";
import { Hotel as HotelIcon, Calendar, Mail, Phone, Users, BedDouble, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/account/bookings")({
  head: () => ({
    meta: [{ title: "Khách sạn đã booking — ASF 2026" }],
  }),
  component: BookingsPage,
});

function fmt(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", { dateStyle: "medium", timeStyle: "short" });
}
function fmtDate(s: string) {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("vi-VN", { dateStyle: "medium" });
}

function BookingsPage() {
  const { isAuthenticated, bookings, user } = useAuth();
  const { t } = useT();
  if (!isAuthenticated) return <Navigate to="/" />;

  const mine = bookings.filter((b) => b.code === user?.code);

  return (
    <div className="min-h-screen text-white">
      <Starfield />
      <Header />
      <main className="mx-auto max-w-5xl px-4 pb-24 pt-32 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <HotelIcon className="text-gold" />
          <h1 className="text-3xl font-extrabold">{t("acc.book.title")}</h1>
        </div>
        <p className="mb-8 text-sm text-white/70">
          {t("acc.book.desc", { code: user?.code ?? "" })}
        </p>

        {mine.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
            <p className="text-white/70">{t("acc.book.empty")}</p>
            <Link
              to="/"
              hash="hotels"
              className="mt-4 inline-flex items-center justify-center rounded-full bg-destructive px-5 py-2 text-sm font-bold text-destructive-foreground"
            >
              {t("acc.book.cta")}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {mine.map((b) => (
              <article
                key={b.id}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md transition hover:border-gold/30"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-lg font-bold">{b.hotelName}</div>
                    <div className="text-xs text-white/60">{fmt(b.createdAt)}</div>
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gold">
                    {b.roomType}
                  </div>
                </div>
                <div className="mt-3 grid gap-2 text-sm text-white/80 sm:grid-cols-2">
                  <span className="inline-flex items-center gap-2"><Calendar size={13} className="text-gold" /> {t("book.checkin")} {fmtDate(b.checkin)}</span>
                  <span className="inline-flex items-center gap-2"><Calendar size={13} className="text-gold" /> {t("book.checkout")} {fmtDate(b.checkout)}</span>
                  <span className="inline-flex items-center gap-2"><BedDouble size={13} className="text-gold" /> {b.rooms}</span>
                  <span className="inline-flex items-center gap-2"><Users size={13} className="text-gold" /> {b.guests}</span>
                  <span className="inline-flex items-center gap-2"><Mail size={13} className="text-gold" /> {b.email}</span>
                  <span className="inline-flex items-center gap-2"><Phone size={13} className="text-gold" /> {b.phone}</span>
                  {b.notes && (
                    <span className="sm:col-span-2 text-white/70">{b.notes}</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        <section className="mt-16">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-gold">{t("acc.book.partnerEyebrow")}</div>
              <h2 className="mt-1 text-2xl font-extrabold">{t("acc.book.partnerTitle")}</h2>
            </div>
            <Link
              to="/"
              hash="hotels"
              className="hidden shrink-0 items-center gap-1 rounded-full border border-gold/50 px-4 py-1.5 text-xs font-semibold text-gold hover:bg-gold/10 sm:inline-flex"
            >
              {t("acc.book.viewAll")} <ExternalLink size={12} />
            </Link>
          </div>
          <div className="space-y-10">
            {hotels.map((h) => (
              <HotelCard key={h.id} h={h} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
