import { Section } from "./Overview";
import { ArrowRight, Calendar, MapPin, Users, Mail } from "lucide-react";

export function Register() {
  return (
    <Section id="register" eyebrow="Registration" title="Reserve Your Seat at ASF 2026">
      <div className="relative overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-navy via-secondary to-navy-deep p-8 sm:p-14">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-destructive/20 blur-3xl" />

        <div className="relative grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <h3 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              Join 1,000+ delegates shaping{" "}
              <span className="text-gradient-gold">Asia's capital markets</span>
            </h3>
            <p className="mt-4 text-base leading-relaxed text-white/80">
              Early-bird registration is open until 15 February 2026. Secure your delegate pass,
              optional gala dinner and Halong Bay day tour today.
            </p>

            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                { Icon: Calendar, text: "14 – 17 April 2026" },
                { Icon: MapPin, text: "National Convention Center, Hanoi" },
                { Icon: Users, text: "20+ markets · 60+ speakers" },
                { Icon: Mail, text: "asf2026@vbma.org.vn" },
              ].map(({ Icon, text }) => (
                <li
                  key={text}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85"
                >
                  <Icon size={16} className="text-gold" />
                  {text}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#hotels"
                className="inline-flex items-center justify-center rounded-full bg-destructive px-7 py-3 text-sm font-bold text-destructive-foreground shadow-lg transition hover:opacity-90"
              >
                Register Now <ArrowRight size={16} className="ml-2" />
              </a>
              <a
                href="#documents"
                className="inline-flex items-center justify-center rounded-full border-2 border-gold/60 px-7 py-3 text-sm font-bold text-gold transition hover:bg-gold/10"
              >
                Download Brochure
              </a>
            </div>
          </div>

          {/* Pricing card */}
          <div className="grid gap-4">
            {[
              {
                tier: "Early Bird",
                price: "USD 690",
                until: "Until 15 Feb 2026",
                highlight: true,
              },
              {
                tier: "Standard",
                price: "USD 890",
                until: "Until 31 Mar 2026",
                highlight: false,
              },
              {
                tier: "On-site",
                price: "USD 1,090",
                until: "From 1 Apr 2026",
                highlight: false,
              },
            ].map((p) => (
              <div
                key={p.tier}
                className={`flex items-center justify-between rounded-2xl border p-5 backdrop-blur-md ${
                  p.highlight
                    ? "border-gold bg-gold/10 shadow-[0_0_40px_rgba(212,175,55,0.25)]"
                    : "border-white/10 bg-white/5"
                }`}
              >
                <div>
                  <div className={`text-xs font-bold uppercase tracking-[0.2em] ${p.highlight ? "text-gold" : "text-white/60"}`}>
                    {p.tier}
                  </div>
                  <div className="mt-1 text-xs text-white/60">{p.until}</div>
                </div>
                <div className="text-2xl font-extrabold text-white">{p.price}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
