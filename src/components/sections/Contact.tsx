import { Section } from "./Overview";
import { Mail, Phone, MapPin, Globe, User, Facebook, Linkedin, Youtube, MessageCircle, Twitter, Instagram, Send } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useT } from "@/lib/i18n";
import { useContactInfo } from "@/lib/event-adapters";

const SOCIAL_ICONS: Record<string, LucideIcon> = {
  facebook: Facebook,
  linkedin: Linkedin,
  youtube: Youtube,
  twitter: Twitter,
  x: Twitter,
  instagram: Instagram,
  zalo: MessageCircle,
  telegram: Send,
};
function socialIcon(name: string): LucideIcon {
  return SOCIAL_ICONS[name.trim().toLowerCase()] ?? Globe;
}

export function Contact() {
  const { t } = useT();
  const info = useContactInfo();
  const socials = (info?.socials?.length ? info.socials : [
    { name: "Facebook", url: "https://www.facebook.com/p/Vietnam-Bond-Market-Association-100064838944642/" },
    { name: "LinkedIn", url: "#" },
    { name: "Zalo", url: "#" },
  ]).map((s) => ({ icon: socialIcon(s.name), label: s.name, href: s.url }));
  const phone = info?.phone || "+84 24 3974 8506";
  const email = info?.email || "asf2026@vbma.org.vn";
  const website = info?.website || "https://vbma.org.vn/vi";
  const address = info?.address || t("contact.addressValue");
  const websiteLabel = website.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const primaryContacts = [
    { icon: Phone, label: "Hotline", value: phone, href: `tel:${phone.replace(/\s+/g, "")}`, accent: "from-emerald-400/30 to-emerald-500/10" },
    { icon: Mail, label: "Email", value: email, href: `mailto:${email}`, accent: "from-sky-400/30 to-sky-500/10" },
    { icon: Globe, label: "Website", value: websiteLabel, href: website, accent: "from-violet-400/30 to-violet-500/10" },
  ];
  return (
    <Section id="contact" eyebrow={t("contact.eyebrow")} title={t("contact.title")}>
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left: Org card + socials */}
        <div className="lg:col-span-2 flex">
          <div className="flex w-full flex-col">
          <div className="flex flex-1 flex-col rounded-2xl border border-gold/25 bg-gradient-to-br from-gold/10 to-transparent p-6 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/20 text-gold">
                <User size={22} />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-gold/80">{t("contact.org.eyebrow")}</div>
                <div className="text-lg font-semibold text-white">VBMA</div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/75">
              {t("contact.org.desc")}
            </p>
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
              <MapPin className="mt-0.5 shrink-0 text-gold" size={18} />
              <div>
                <div className="text-xs uppercase tracking-wider text-gold/80">{t("contact.address")}</div>
                <a
                  href="https://maps.google.com/?q=35+Hang+Voi,+Hoan+Kiem,+Hanoi"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-white hover:text-gold"
                >
                  {t("contact.addressValue")}
                </a>
              </div>
            </div>
            <div className="mt-auto pt-5">
              <div className="mb-2 text-xs uppercase tracking-wider text-gold/80">{t("contact.follow")}</div>
              <div className="flex gap-2">
                {socials.map((s) => {
                  const Icon = s.icon;
                  const isExternal = s.href.startsWith("http");
                  return (
                    <a
                      key={s.label}
                      href={s.href}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      onClick={(e) => {
                        if (!isExternal) return;
                        e.preventDefault();
                        window.open(s.href, "_blank", "noopener,noreferrer");
                      }}
                      aria-label={s.label}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition hover:border-gold/50 hover:bg-gold/15 hover:text-gold"
                    >
                      <Icon size={16} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* Right: Contact channels + map */}
        <div className="lg:col-span-3 space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {primaryContacts.map((c) => {
              const Icon = c.icon;
              return (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition hover:-translate-y-1 hover:border-gold/50"
                >
                  <div
                    className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${c.accent} blur-2xl opacity-70 transition group-hover:opacity-100`}
                  />
                  <div className="relative">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/15 text-gold">
                      <Icon size={18} />
                    </div>
                    <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-gold/80">
                      {c.label}
                    </div>
                    <div className="mt-1 break-words text-sm font-medium text-white">{c.value}</div>
                  </div>
                </a>
              );
            })}
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <iframe
              title="VBMA location"
              src="https://www.google.com/maps?q=35+Hang+Voi,+Hoan+Kiem,+Hanoi&output=embed"
              loading="lazy"
              className="h-[280px] w-full grayscale-[40%] contrast-110"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </Section>
  );
}
