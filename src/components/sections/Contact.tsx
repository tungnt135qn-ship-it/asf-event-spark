import { Section } from "./Overview";
import { Mail, Phone, MapPin, Globe, User } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import callLottie from "@/assets/call-ringing.lottie?url";

const contacts = [
  {
    icon: User,
    label: "Ban tổ chức",
    value: "VBMA — Hiệp hội Thị trường Trái phiếu Việt Nam",
  },
  {
    icon: MapPin,
    label: "Địa chỉ",
    value: "Tầng 7, 35 Hàng Vôi, Hoàn Kiếm, Hà Nội",
  },
  {
    icon: Phone,
    label: "Hotline",
    value: "+84 24 3974 8506",
    href: "tel:+842439748506",
  },
  {
    icon: Mail,
    label: "Email",
    value: "asf2026@vbma.org.vn",
    href: "mailto:asf2026@vbma.org.vn",
  },
  {
    icon: Globe,
    label: "Website",
    value: "vbma.org.vn",
    href: "https://vbma.org.vn/vi",
  },
];

export function Contact() {
  return (
    <Section id="contact" eyebrow="Contact" title="Liên hệ Ban tổ chức">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div className="relative mx-auto w-full max-w-[480px]">
          <DotLottieReact src={callLottie} loop autoplay style={{ width: "100%", height: "auto" }} />
        </div>

        <div className="space-y-4">
          <p className="text-white/75">
            Quý đại biểu, đối tác và nhà tài trợ vui lòng liên hệ với Ban tổ chức ASF 2026
            qua các kênh dưới đây để được hỗ trợ nhanh nhất.
          </p>
          <ul className="space-y-3">
            {contacts.map((c) => {
              const Icon = c.icon;
              const inner = (
                <div className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition hover:border-gold/50">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-gold">
                    <Icon size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-gold/80">
                      {c.label}
                    </div>
                    <div className="mt-0.5 text-sm font-medium text-white">{c.value}</div>
                  </div>
                </div>
              );
              return (
                <li key={c.label}>
                  {c.href ? (
                    <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                      {inner}
                    </a>
                  ) : (
                    inner
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Section>
  );
}
