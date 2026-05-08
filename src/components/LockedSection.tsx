import { Lock, KeyRound } from "lucide-react";
import { Section } from "./sections/Overview";
import { useAuth } from "@/lib/auth";
import { useT } from "@/lib/i18n";
import { AuthButton } from "./AuthButton";

export function LockedSection({
  id,
  eyebrow,
  title,
  hint,
}: {
  id: string;
  eyebrow: string;
  title: string;
  hint: string;
}) {
  const { t } = useT();
  return (
    <Section id={id} eyebrow={eyebrow} title={title}>
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/10 to-transparent p-10 text-center backdrop-blur-md">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold">
          <Lock size={26} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{t("locked.cta")}</h3>
          <p className="mt-2 text-sm text-white/70">{hint}</p>
        </div>
        <div className="mt-2 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70">
          <KeyRound size={14} className="text-gold" /> {t("locked.note")}
        </div>
        <AuthButton />
      </div>
    </Section>
  );
}

export function Gated({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  return <>{isAuthenticated ? children : fallback}</>;
}
