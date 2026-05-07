import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";

type Variant = "up" | "down" | "left" | "right" | "fade" | "zoom";

const initial: Record<Variant, CSSProperties> = {
  up: { opacity: 0, transform: "translateY(40px)" },
  down: { opacity: 0, transform: "translateY(-40px)" },
  left: { opacity: 0, transform: "translateX(-50px)" },
  right: { opacity: 0, transform: "translateX(50px)" },
  fade: { opacity: 0 },
  zoom: { opacity: 0, transform: "scale(0.92)" },
};

export function Reveal({
  children,
  variant = "up",
  delay = 0,
  duration = 700,
  className = "",
  once = true,
}: {
  children: ReactNode;
  variant?: Variant;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            if (once) io.unobserve(e.target);
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  const style: CSSProperties = visible
    ? {
        opacity: 1,
        transform: "translate3d(0,0,0) scale(1)",
        transition: `opacity ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }
    : {
        ...initial[variant],
        transition: `opacity ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        willChange: "opacity, transform",
      };

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
