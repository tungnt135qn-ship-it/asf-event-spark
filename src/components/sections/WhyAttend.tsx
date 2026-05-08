import { Section } from "./Overview";
import { Users, TrendingUp, Landmark, Briefcase, ArrowUpRight } from "lucide-react";

const items = [
  {
    icon: Users,
    title: "Network with Industry Leaders",
    desc: "Kết nối với 100–150 đại biểu cấp cao từ cơ quan quản lý, sở giao dịch, công ty chứng khoán và nhà đầu tư khắp Châu Á – Châu Đại Dương.",
    stat: "100–150",
    statLabel: "Delegates",
  },
  {
    icon: TrendingUp,
    title: "Mạng lưới hiệp hội khu vực",
    desc: "Quy tụ trên 30 hiệp hội chứng khoán thành viên ASF từ Nhật Bản, Hàn Quốc, Trung Quốc, Singapore, Thái Lan, Indonesia, Malaysia, Ấn Độ, Úc…",
    stat: "30+",
    statLabel: "Hiệp hội",
  },
  {
    icon: Landmark,
    title: "Đối thoại chính sách",
    desc: "Đối thoại trực tiếp với Bộ Tài chính, UBCKNN, NHNN, Sở Giao dịch Chứng khoán Việt Nam, HOSE, HNX và VSDC.",
    stat: "ICMA · ASIFMA · ICSA",
    statLabel: "Đối tác toàn cầu",
  },
  {
    icon: Briefcase,
    title: "Cơ hội đầu tư Việt Nam",
    desc: "Phiên đặc biệt 'Thị trường Chứng khoán Việt Nam — Kỷ nguyên mới' kết nối nhà đầu tư quốc tế với cơ quan quản lý và doanh nghiệp Việt.",
    stat: "1:1",
    statLabel: "Meetings",
  },
];

export function WhyAttend() {
  return (
    <Section id="why" eyebrow="Why Attend" title="Why ASF 2026">
      <div className="grid gap-5 lg:grid-cols-2">
        {items.map((it, i) => (
          <div
            key={it.title}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-7 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[var(--shadow-glow)]"
          >
            {/* decorative number */}
            <div className="pointer-events-none absolute -right-4 -top-6 text-[120px] font-black leading-none text-white/[0.04] transition group-hover:text-gold/10">
              0{i + 1}
            </div>

            <div className="relative flex items-start gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gold to-gold-soft text-navy-deep shadow-lg shadow-gold/20">
                <it.icon size={26} />
              </div>

              <div className="flex-1">
                <div className="mb-3 flex items-baseline justify-between gap-3">
                  <h3 className="text-lg font-bold text-white sm:text-xl">{it.title}</h3>
                  <div className="text-right leading-tight">
                    <div className="text-gradient-gold text-2xl font-black tabular-nums">
                      {it.stat}
                    </div>
                    <div className="text-[10px] uppercase tracking-[0.15em] text-white/60">
                      {it.statLabel}
                    </div>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-white/75">{it.desc}</p>

                <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gold/80 opacity-0 transition group-hover:opacity-100">
                  Learn more <ArrowUpRight size={14} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
