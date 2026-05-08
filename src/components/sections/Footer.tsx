import { AsfLogo } from "../AsfLogo";
import { Mail, Phone, MapPin, Linkedin, Facebook, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy-deep/80 px-4 pt-16 pb-8 backdrop-blur-md">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <AsfLogo />
            <p className="mt-4 text-sm leading-relaxed text-white/65">
              The Asian Securities Forum 2026 — hosted by VBMA in Hanoi, Vietnam.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-gold">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              {["Overview", "Agenda", "Speakers", "Documents", "FAQ"].map((l) => (
                <li key={l}>
                  <a href={`#${l.toLowerCase()}`} className="hover:text-gold">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-gold">
              Contact (VBMA)
            </h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0 text-gold" />
                <span>Hanoi, Vietnam</span>
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
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-gold">Follow</h4>
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
          <div>© 2026 ASF 2026 / Vietnam Bond Market Association. All rights reserved.</div>
          <div className="flex gap-5">
            <a href="#" className="hover:text-gold">Privacy</a>
            <a href="#" className="hover:text-gold">Terms</a>
            <a href="#" className="hover:text-gold">Code of Conduct</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
