import { ExternalLink, CheckCircle2, Globe2, Building2, Calendar } from "lucide-react";
import overviewImg from "@/assets/overview-hanoi.jpg";
import vbmaLogo from "@/assets/vbma-logo.png";

function Section({
  id,
  eyebrow,
  title,
  children,
  className = "",
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`relative px-4 py-20 lg:py-28 ${className}`}>
      <div className="mx-auto max-w-7xl">
        {(eyebrow || title) && (
          <div className="mb-12 text-center">
            {eyebrow && (
              <div className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
                {eyebrow}
              </div>
            )}
            {title && (
              <h2 className="text-3xl font-extrabold sm:text-5xl">
                <span className="text-gradient-gold">{title}</span>
              </h2>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

export function Overview() {
  const highlights = [
    { icon: Globe2, text: "20+ thị trường vốn châu Á cùng quy tụ" },
    { icon: Building2, text: "Tổ chức bởi VBMA — Hiệp hội Thị trường Trái phiếu Việt Nam" },
    { icon: Calendar, text: "4 ngày sự kiện chính thức tại Hà Nội" },
    { icon: CheckCircle2, text: "Quy tụ regulators, exchanges, dealers & investors" },
  ];

  return (
    <Section id="overview" eyebrow="Overview" title="Shaping Asia's Capital Markets">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
        {/* Left: Image */}
        <div className="relative">
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-gold/20 via-transparent to-destructive/20 blur-2xl" />
          <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
            <img
              src={overviewImg}
              alt="Asian Securities Forum 2026 in Hanoi"
              loading="lazy"
              width={1024}
              height={1280}
              className="h-full max-h-[580px] w-full object-cover object-bottom"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/70 via-transparent to-transparent" />
          </div>

          {/* Floating VBMA logo card */}
          <div className="absolute -bottom-6 -right-4 hidden rounded-2xl border border-gold/30 bg-white p-4 shadow-xl sm:block">
            <img src={vbmaLogo} alt="VBMA" className="h-12 w-auto" />
          </div>
        </div>

        {/* Right: Content + Highlights */}
        <div className="space-y-6 text-white/85">
          <p className="text-lg leading-relaxed">
            <strong className="text-gold">Asian Securities Forum (ASF) 2026</strong> là diễn đàn
            thường niên của các thị trường vốn châu Á, quy tụ cơ quan quản lý, sở giao dịch, nhà
            phát hành, đại lý và nhà đầu tư hàng đầu khu vực để cùng định hình tương lai của thị
            trường thu nhập cố định, cổ phiếu và tài chính bền vững.
          </p>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gold">
              <Building2 size={16} /> Đơn vị tổ chức
            </div>
            <p className="text-sm leading-relaxed text-white/85">
              <strong className="text-white">Hiệp hội Thị trường Trái phiếu Việt Nam (VBMA)</strong>{" "}
              — thành lập năm 2009, là tổ chức đại diện cho các thành viên định chế trên thị
              trường trái phiếu Việt Nam, thúc đẩy thị trường minh bạch, hiệu quả và bền vững.
            </p>
            <a
              href="https://vbma.org.vn/vi"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold underline-offset-4 hover:underline"
            >
              Truy cập VBMA <ExternalLink size={14} />
            </a>
          </div>

          <ul className="space-y-3">
            {highlights.map((h) => (
              <li
                key={h.text}
                className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3 transition hover:border-gold/30 hover:bg-white/[0.06]"
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-gold">
                  <h.icon size={16} />
                </span>
                <span className="text-sm text-white/90">{h.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

export { Section };
