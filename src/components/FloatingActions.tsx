import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function FloatingActions() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <a
        href="#register"
        className="inline-flex items-center justify-center rounded-full bg-destructive px-5 py-3 text-sm font-semibold text-destructive-foreground shadow-2xl shadow-destructive/40 transition hover:scale-105 hover:opacity-95"
      >
        Register Now
      </a>
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
