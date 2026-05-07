type Props = { className?: string; compact?: boolean };

export function AsfLogo({ className = "", compact = false }: Props) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div className="relative">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-gold to-gold-soft text-navy-deep shadow-[var(--shadow-glow)]">
          <span className="font-black text-lg leading-none">A</span>
        </div>
      </div>
      {!compact && (
        <div className="leading-tight">
          <div className="text-gradient-gold text-xl font-extrabold tracking-tight">ASF 2026</div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-white/70">Asian Securities Forum</div>
        </div>
      )}
    </div>
  );
}
