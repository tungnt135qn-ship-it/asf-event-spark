import { useMemo } from "react";

type Star = {
  top: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
};

function rand(seed: number) {
  // simple deterministic PRNG so SSR/client match
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function Starfield({ count = 160 }: { count?: number }) {
  const stars = useMemo<Star[]>(() => {
    const r = rand(42);
    return Array.from({ length: count }, () => ({
      top: r() * 100,
      left: r() * 100,
      size: 0.6 + r() * 2.2,
      delay: r() * 6,
      duration: 2 + r() * 5,
      opacity: 0.4 + r() * 0.6,
    }));
  }, [count]);

  const shooters = useMemo(
    () =>
      Array.from({ length: 3 }, (_, i) => ({
        top: 10 + i * 25,
        delay: i * 4,
      })),
    [],
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% -10%, oklch(0.30 0.16 260 / 0.55), transparent 55%)," +
          "radial-gradient(ellipse at 85% 80%, oklch(0.32 0.18 285 / 0.40), transparent 55%)," +
          "radial-gradient(ellipse at 10% 60%, oklch(0.35 0.15 250 / 0.30), transparent 55%)," +
          "var(--navy-deep)",
      }}
    >
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: s.opacity,
            boxShadow: `0 0 ${s.size * 2}px rgba(255,255,255,0.6)`,
            animation: `star-twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}

      {shooters.map((sh, i) => (
        <span
          key={`sh-${i}`}
          className="absolute h-[1px] w-[120px] bg-gradient-to-r from-transparent via-white to-transparent"
          style={{
            top: `${sh.top}%`,
            left: "-150px",
            animation: `shooting-star 8s linear ${sh.delay}s infinite`,
            opacity: 0.8,
          }}
        />
      ))}
    </div>
  );
}
