import logoUrl from "@/assets/asf-logo.png";

type Props = { className?: string; size?: number };

export function AsfLogo({ className = "", size = 48 }: Props) {
  return (
    <img
      src={logoUrl}
      alt="ASF 2026 — Hanoi"
      className={className}
      style={{ height: size, width: "auto" }}
    />
  );
}
