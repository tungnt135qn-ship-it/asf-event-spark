import { useEffect, useState } from "react";
import { AsfLogo } from "./AsfLogo";
import { Menu, X } from "lucide-react";

const NAV = [
  { href: "#overview", label: "Overview" },
  { href: "#agenda", label: "Agenda" },
  { href: "#hotels", label: "Hotels" },
  { href: "#speakers", label: "Speakers" },
  { href: "#topics", label: "Topics" },
  { href: "#library", label: "Library" },
  { href: "#news", label: "News" },
  { href: "#sponsors", label: "Sponsors" },
  { href: "#faq", label: "FAQ" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            history.replaceState(null, "", window.location.pathname + window.location.search);
            window.scrollTo({ top: 0, behavior: "smooth" });
            setOpen(false);
          }}
          className="flex shrink-0 items-center gap-3 cursor-pointer"
        >
          <AsfLogo size={scrolled ? 44 : 56} className="transition-all duration-300" />
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="text-gradient-gold text-base font-extrabold tracking-tight">
              ASF 2026
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/70">
              Asian Securities Forum
            </span>
          </div>
        </a>

        <nav className="hidden items-center gap-6 xl:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-sm font-medium text-white/85 transition hover:text-gold"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#documents"
            className="hidden items-center justify-center rounded-full border-2 border-gold/60 px-4 py-1.5 text-[13px] font-semibold leading-none text-gold transition hover:bg-gold/10 sm:inline-flex"
          >
            Event Handbook
          </a>
          <a
            href="#register"
            className="hidden items-center justify-center rounded-full bg-destructive px-4 py-1.5 text-[13px] font-semibold leading-none text-destructive-foreground shadow-lg transition hover:opacity-90 sm:inline-flex"
          >
            Register Now
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-md p-2 text-white xl:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="glass border-t border-white/10 xl:hidden">
          <div className="mx-auto flex max-w-7xl flex-col px-4 py-4">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="border-b border-white/5 py-3 text-sm font-medium text-white/85 hover:text-gold"
              >
                {n.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
