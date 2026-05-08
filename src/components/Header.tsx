import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useRouter } from "@tanstack/react-router";
import { AsfLogo } from "./AsfLogo";
import { AuthButton } from "./AuthButton";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useAuth } from "@/lib/auth";
import { useT } from "@/lib/i18n";
import { Menu, X, ChevronDown } from "lucide-react";

type NavItem =
  | { kind: "link"; hash: string; labelKey: string; protected?: boolean }
  | { kind: "group"; labelKey: string; items: { hash: string; labelKey: string; protected?: boolean }[] };

const NAV: NavItem[] = [
  { kind: "link", hash: "overview", labelKey: "nav.overview" },
  { kind: "link", hash: "agenda", labelKey: "nav.agenda" },
  { kind: "link", hash: "hotels", labelKey: "nav.hotels", protected: true },
  { kind: "link", hash: "speakers", labelKey: "nav.speakers" },
  { kind: "link", hash: "topics", labelKey: "nav.topics" },
  { kind: "link", hash: "library", labelKey: "nav.library", protected: true },
  { kind: "link", hash: "documents", labelKey: "nav.documents", protected: true },
  {
    kind: "group",
    labelKey: "nav.newsGroup",
    items: [
      { hash: "news", labelKey: "nav.news" },
      { hash: "press", labelKey: "nav.press" },
    ],
  },
  { kind: "link", hash: "faq", labelKey: "nav.faq" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const location = useLocation();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { t } = useT();
  const isHome = location.pathname === "/";
  const groupRef = useRef<HTMLDivElement>(null);

  // Filter nav items: hide protected items if not authenticated
  const navItems = NAV
    .map((n) => {
      if (n.kind === "link") return n;
      const items = n.items.filter((it) => isAuthenticated || !it.protected);
      return items.length ? { ...n, items } : null;
    })
    .filter((n): n is NavItem => n !== null)
    .filter((n) => n.kind === "group" || isAuthenticated || !n.protected);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (groupRef.current && !groupRef.current.contains(e.target as Node)) {
        setOpenGroup(null);
      }
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  const goToHash = (hash: string) => {
    if (isHome) {
      const el = document.getElementById(hash) || document.getElementById(hash === "register" ? "registration" : "");
      if (el) el.scrollIntoView({ behavior: "smooth" });
      history.replaceState(null, "", `#${hash}`);
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    } else {
      router.navigate({ to: "/", hash });
    }
    setOpen(false);
    setOpenGroup(null);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <Link
          to="/"
          onClick={(e) => {
            if (isHome) {
              e.preventDefault();
              history.replaceState(null, "", window.location.pathname + window.location.search);
              window.scrollTo({ top: 0, behavior: "smooth" });
              setOpen(false);
            }
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
        </Link>

        <nav className="hidden items-center gap-6 xl:flex" ref={groupRef}>
          {navItems.map((n) =>
            n.kind === "link" ? (
              <button
                key={n.hash}
                onClick={() => goToHash(n.hash)}
                className="text-sm font-medium text-white/85 transition hover:text-gold"
              >
                {n.label}
              </button>
            ) : (
              <div key={n.label} className="relative">
                <button
                  onClick={() => setOpenGroup((g) => (g === n.label ? null : n.label))}
                  className="inline-flex items-center gap-1 text-sm font-medium text-white/85 transition hover:text-gold"
                >
                  {n.label}
                  <ChevronDown size={14} />
                </button>
                {openGroup === n.label && (
                  <div className="absolute left-1/2 top-full mt-2 w-44 -translate-x-1/2 overflow-hidden rounded-xl border border-white/10 bg-navy-deep/95 shadow-xl backdrop-blur">
                    {n.items.map((it) => (
                      <button
                        key={it.hash}
                        onClick={() => goToHash(it.hash)}
                        className="block w-full px-4 py-2.5 text-left text-sm text-white/85 hover:bg-gold/10 hover:text-gold"
                      >
                        {it.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ),
          )}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <button
              onClick={() => goToHash("documents")}
              className="hidden items-center justify-center rounded-full border-2 border-gold/60 px-4 py-1.5 text-[13px] font-semibold leading-none text-gold transition hover:bg-gold/10 sm:inline-flex"
            >
              Event Handbook
            </button>
          )}
          <button
            onClick={() => goToHash("register")}
            className="hidden items-center justify-center rounded-full bg-destructive px-4 py-1.5 text-[13px] font-semibold leading-none text-destructive-foreground shadow-lg transition hover:opacity-90 sm:inline-flex"
          >
            Register Now
          </button>
          <AuthButton />
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
            {navItems.map((n) =>
              n.kind === "link" ? (
                <button
                  key={n.hash}
                  onClick={() => goToHash(n.hash)}
                  className="border-b border-white/5 py-3 text-left text-sm font-medium text-white/85 hover:text-gold"
                >
                  {n.label}
                </button>
              ) : (
                <div key={n.label} className="border-b border-white/5 py-2">
                  <div className="py-1 text-xs uppercase tracking-wider text-white/50">
                    {n.label}
                  </div>
                  {n.items.map((it) => (
                    <button
                      key={it.hash}
                      onClick={() => goToHash(it.hash)}
                      className="block w-full py-2 text-left text-sm font-medium text-white/85 hover:text-gold"
                    >
                      {it.label}
                    </button>
                  ))}
                </div>
              ),
            )}
          </div>
        </div>
      )}
    </header>
  );
}
