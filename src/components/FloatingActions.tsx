import { useEffect, useRef, useState } from "react";
import { ArrowUp, Phone, Mail } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import callLottie from "@/assets/call-ringing.lottie?url";

export function FloatingActions() {
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={wrapRef} className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open && (
        <div className="animate-fade-in flex flex-col gap-2 rounded-2xl border border-gold/30 bg-navy-deep/95 p-3 shadow-2xl backdrop-blur-md">
          <a
            href="tel:+842439748506"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white transition hover:bg-gold/15"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/20 text-gold">
              <Phone size={14} />
            </span>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-gold/80">Hotline</div>
              <div className="font-medium">+84 24 3974 8506</div>
            </div>
          </a>
          <a
            href="mailto:asf2026@vbma.org.vn"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white transition hover:bg-gold/15"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/20 text-gold">
              <Mail size={14} />
            </span>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-gold/80">Email</div>
              <div className="font-medium">asf2026@vbma.org.vn</div>
            </div>
          </a>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Contact"
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-gold/30 to-gold/10 shadow-2xl shadow-gold/30 ring-2 ring-gold/40 transition hover:scale-105 sm:h-16 sm:w-16"
      >
        <DotLottieReact src={callLottie} loop autoplay style={{ width: 48, height: 48 }} />
      </button>

      {show && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 bg-navy-deep/80 text-gold shadow-xl backdrop-blur-md transition hover:bg-gold hover:text-navy-deep"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </div>
  );
}
