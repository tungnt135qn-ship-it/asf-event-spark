import { useT, type Lang } from "@/lib/i18n";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { lang, setLang } = useT();
  const Pill = ({ value, label }: { value: Lang; label: string }) => (
    <button
      onClick={() => setLang(value)}
      className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider transition ${
        lang === value ? "bg-gold text-navy-deep" : "text-white/70 hover:text-gold"
      }`}
      aria-pressed={lang === value}
    >
      {label}
    </button>
  );
  return (
    <div className={`inline-flex items-center overflow-hidden rounded-full border border-white/15 bg-white/5 ${className}`}>
      <Pill value="vi" label="VI" />
      <Pill value="en" label="EN" />
    </div>
  );
}
