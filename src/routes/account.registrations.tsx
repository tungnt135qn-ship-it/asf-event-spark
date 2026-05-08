import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Starfield } from "@/components/Starfield";
import { Footer } from "@/components/sections/Footer";
import { useAuth } from "@/lib/auth";
import { ClipboardList, Calendar, Mail, Building2, Phone, Globe } from "lucide-react";

export const Route = createFileRoute("/account/registrations")({
  head: () => ({
    meta: [{ title: "Lịch sử đăng ký — ASF 2026" }],
  }),
  component: RegistrationsPage,
});

function fmt(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", { dateStyle: "medium", timeStyle: "short" });
}

function RegistrationsPage() {
  const { isAuthenticated, registrations, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" />;

  const mine = registrations.filter((r) => r.code === user?.code);

  return (
    <div className="min-h-screen text-white">
      <Starfield />
      <Header />
      <main className="mx-auto max-w-5xl px-4 pb-24 pt-32 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <ClipboardList className="text-gold" />
          <h1 className="text-3xl font-extrabold">Lịch sử đăng ký</h1>
        </div>
        <p className="mb-8 text-sm text-white/70">
          Tất cả đăng ký tham dự ASF 2026 gắn với mã <span className="font-bold text-gold">{user?.code}</span>.
        </p>

        {mine.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
            <p className="text-white/70">Bạn chưa có đăng ký nào.</p>
            <Link
              to="/"
              hash="register"
              className="mt-4 inline-flex items-center justify-center rounded-full bg-destructive px-5 py-2 text-sm font-bold text-destructive-foreground"
            >
              Đăng ký ngay
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {mine.map((r) => (
              <article
                key={r.id}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md transition hover:border-gold/30"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-lg font-bold">{r.name}</div>
                    <div className="text-xs text-white/60">{r.title || "—"}</div>
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gold">
                    {r.customerType}
                  </div>
                </div>
                <div className="mt-3 grid gap-2 text-sm text-white/80 sm:grid-cols-2">
                  <span className="inline-flex items-center gap-2"><Mail size={13} className="text-gold" /> {r.email}</span>
                  <span className="inline-flex items-center gap-2"><Phone size={13} className="text-gold" /> {r.phone}</span>
                  <span className="inline-flex items-center gap-2"><Building2 size={13} className="text-gold" /> {r.organisation}</span>
                  <span className="inline-flex items-center gap-2"><Globe size={13} className="text-gold" /> {r.nationality}</span>
                  <span className="inline-flex items-center gap-2 sm:col-span-2"><Calendar size={13} className="text-gold" /> Đăng ký {fmt(r.createdAt)}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
