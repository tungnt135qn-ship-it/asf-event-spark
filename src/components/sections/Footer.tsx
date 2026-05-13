import { AsfLogo } from "../AsfLogo";
import { Mail, Phone, MapPin, Linkedin, Facebook, Youtube, Globe, Twitter, Instagram, MessageCircle, Send } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useT } from "@/lib/i18n";
import type { Dict } from "@/lib/i18n/dictionaries/en";
import { useContactInfo, useFooterText } from "@/lib/event-adapters";

const FOOTER_SOCIAL_ICONS: Record<string, LucideIcon> = {
  facebook: Facebook,
  linkedin: Linkedin,
  youtube: Youtube,
  twitter: Twitter,
  x: Twitter,
  instagram: Instagram,
  zalo: MessageCircle,
  telegram: Send,
};
function footerIcon(name: string): LucideIcon {
  return FOOTER_SOCIAL_ICONS[name.trim().toLowerCase()] ?? Globe;
}

export function Footer() {
  const { t } = useT();
  const info = useContactInfo();
  const footerText = useFooterText();
  const socials = info?.socials?.length
    ? info.socials.map((s) => ({ Icon: footerIcon(s.name), href: s.url }))
    : [
        { Icon: Linkedin, href: "#" },
        { Icon: Facebook, href: "https://www.facebook.com/p/Vietnam-Bond-Market-Association-100064838944642/" },
        { Icon: Youtube, href: "#" },
      ];
  const links: { key: keyof Dict; href: string }[] = [
    { key: "nav.overview", href: "#overview" },
    { key: "nav.agenda", href: "#agenda" },
    { key: "nav.speakers", href: "#speakers" },
    { key: "nav.documents", href: "#documents" },
    { key: "nav.faq", href: "#faq" },
  ];
  return (
    <footer className="border-t border-white/10 bg-navy-deep/80 px-4 pt-16 pb-8 backdrop-blur-md">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <AsfLogo />
            <p className="mt-4 text-sm leading-relaxed text-white/65">{t("footer.about")}</p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-gold">
              {t("footer.quickLinks")}
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              {links.map((l) => (
                <li key={l.key}>
                  <a href={l.href} className="hover:text-gold">{t(l.key)}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-gold">
              {t("footer.contact")}
            </h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0 text-gold" />
                <span>{t("footer.location")}</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={16} className="mt-0.5 shrink-0 text-gold" />
                <a href="mailto:asf2026@vbma.org.vn" className="hover:text-gold">
                  asf2026@vbma.org.vn
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone size={16} className="mt-0.5 shrink-0 text-gold" />
                <span>+84 24 xxxx xxxx</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-gold">{t("footer.follow")}</h4>
            <div className="flex gap-3">
              {[
                { Icon: Linkedin, href: "#" },
                { Icon: Facebook, href: "https://www.facebook.com/p/Vietnam-Bond-Market-Association-100064838944642/" },
                { Icon: Youtube, href: "#" },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-white/70 transition hover:border-gold hover:text-gold"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
            <a
              href="https://vbma.org.vn/vi"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-block text-sm text-gold hover:underline"
            >
              vbma.org.vn →
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row">
          <div>{t("footer.rights")}</div>
          <div className="flex gap-5">
            <a href="#" className="hover:text-gold">{t("footer.privacy")}</a>
            <a href="#" className="hover:text-gold">{t("footer.terms")}</a>
            <a href="#" className="hover:text-gold">{t("footer.coc")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
