# ASF 2026 Landing Page — Kế hoạch triển khai

## Tóm tắt
Xây dựng landing page demo cho sự kiện **ASF 2026 (Asian Securities Forum 2026)** — một sự kiện thường niên của hiệp hội thị trường trái phiếu châu Á, do **VBMA (Vietnam Bond Market Association)** đăng cai. Phong cách lấy cảm hứng từ `fdn20y.fptsoftware.com`: hero full-screen điện ảnh, header trong suốt → glass khi scroll, bố cục section rõ ràng.

## Bảng màu & Design tokens
- **Nền chính**: xanh navy đậm (`oklch(~0.20 0.10 250)`) + gradient xanh sâu hơn cho hero
- **Chữ**: vàng gold (`oklch(~0.85 0.15 90)`) cho heading nhấn, trắng cho body
- **Button CTA**: đỏ (`oklch(~0.58 0.22 25)`) với hover sáng hơn
- **Glass overlay**: `backdrop-blur` + nền trắng 8-10% cho header sticky
- Tất cả định nghĩa trong `src/styles.css` qua oklch tokens (`--primary`, `--accent` = vàng, `--destructive` = đỏ CTA, `--background` = navy).

## Cấu trúc routes (TanStack)
Single landing page → tất cả section nằm trong `src/routes/index.tsx`. Dùng anchor scroll cho menu (vì user yêu cầu nội dung chảy theo flow một trang). Mỗi section là 1 component riêng trong `src/components/sections/`.

## Sections (theo đúng thứ tự yêu cầu)

1. **Header** (`Header.tsx`)
   - Trong suốt khi ở top, chuyển sang glass (`backdrop-blur-xl bg-white/8 border-b`) khi scroll > 50px (dùng `useEffect` + scroll listener).
   - Logo ASF 2026 (placeholder text-logo gradient vàng) + nav: Overview, Why Attend, Agenda, Location, Speakers, Content, Documents, News, Sponsors, FAQ + CTA "Register" (đỏ).

2. **Hero** (`Hero.tsx`) — luôn full viewport (`min-h-screen`)
   - Background gradient navy + hiệu ứng particles/glow nhẹ (CSS radial gradient, không cần lib).
   - Logo lớn "ASF 2026" + tagline.
   - **Countdown timer** đếm ngược tới ngày sự kiện (Days/Hours/Minutes/Seconds — `useEffect` với `setInterval`).
   - Pill chip ngày + địa điểm (Vietnam, dự kiến Hà Nội — sẽ đặt mock).
   - 2 CTA: "Register Now" (đỏ) + "Event Handbook" (outline vàng).

3. **Overview** (`Overview.tsx`)
   - Giới thiệu chung về ASF 2026 + giới thiệu **VBMA** (đơn vị tổ chức): "Vietnam Bond Market Association — established 2009, member of ASIFMA, đại diện cho các thành viên thị trường trái phiếu Việt Nam…" (lấy ý từ vbma.org.vn).
   - 3 stat counters (Delegates, Countries, Speakers).
   - Logo VBMA + link.

4. **Why Attend** (`WhyAttend.tsx`)
   - Grid 4 cards với icon (Lucide): Networking, Market Insights, Policy Dialogue, Investment Opportunities.

5. **Agenda** (`Agenda.tsx`)
   - Tabs 4 ngày. Mỗi tab có **status badge** tự tính theo ngày thực (Upcoming / Live Today / Completed) so sánh với ngày event mock.
   - **Day 1 (chi tiết đầy đủ)**: 09:00–12:00 City Tour · 15:00–17:00 Pre-meeting (timeline với mô tả, địa điểm, speakers).
   - Day 2: Main Event ASF2026 (chỉ tiêu đề + thời gian — "To be finalized").
   - Day 3: 09:00–12:00 ASF2026 · 14:00–17:00 Vietnam Investment Conference.
   - Day 4: Day Tour Halong Bay.
   - Note "Agenda may be updated" + last-updated timestamp.

6. **Location / Map** (`Location.tsx`)
   - Iframe Google Maps embed (URL `maps.google.com/maps?q=...&output=embed` — không cần API key) trỏ tới venue mock (Hanoi).
   - Card thông tin venue, địa chỉ, hướng dẫn di chuyển, nút "Open in Google Maps".

7. **Speakers** (`Speakers.tsx`)
   - Grid 6–8 speaker cards (avatar placeholder, tên, chức vụ, tổ chức). Hover hiện bio ngắn.

8. **Key Content / Topics** (`KeyContent.tsx`)
   - 4–5 chủ đề chính (Sustainable Finance, Green Bonds, ESG, Market Infrastructure, Digital Assets) dạng feature blocks.

9. **Documents** (`Documents.tsx`)
   - Danh sách file tải về: Agenda PDF, Brochure, Sponsorship Pack, Past Reports — card với icon file + nút download.

10. **News & Activities** (`News.tsx`)
    - Grid 3 news card (ảnh placeholder, ngày, tiêu đề, excerpt, "Read more").

11. **Sponsors / Partners** (`Sponsors.tsx`)
    - Tier: Diamond, Gold, Silver, Partners. Logo grid (placeholder boxes có tên).

12. **FAQ** (`FAQ.tsx`)
    - Accordion shadcn (`@/components/ui/accordion`) với 6–8 Q&A (registration, venue, visa, dress code, language, accommodation…).

13. **Footer** (`Footer.tsx`)
    - 4 cột: About ASF, Quick Links, Contact (VBMA), Social. Copyright + link VBMA.

## Chi tiết kỹ thuật
- **Stack**: TanStack Start (đã có), Tailwind v4, shadcn ui (Accordion, Tabs, Button, Card đã có sẵn).
- **Logo**: dùng placeholder text-logo "ASF 2026" với gradient vàng/trắng + có thể swap dễ dàng khi user gửi file thật. Sẽ tạo component `<AsfLogo />` riêng để 1 chỗ thay là xong.
- **Smooth scroll**: thêm `scroll-behavior: smooth` vào `html` + anchor link `#overview`, `#agenda`…
- **Countdown / Status**: hằng số `EVENT_DATE` (mock 2026-04-15) trong `src/lib/event.ts`. Helper `getEventStatus()`, `getDayStatus(dayDate)`.
- **SEO**: `head()` trong route index với title "ASF 2026 — Asian Securities Forum | Vietnam", description, og tags.
- **Responsive**: mobile-first, header chuyển hamburger menu < md.
- **Performance**: hình ảnh placeholder dùng gradient/CSS, chỉ generate vài ảnh nếu cần (có thể bỏ qua cho demo nhanh).

## Files sẽ tạo
- `src/styles.css` — update tokens (navy/gold/red).
- `src/lib/event.ts` — config ngày + helpers status.
- `src/components/AsfLogo.tsx`
- `src/components/Header.tsx`
- `src/components/sections/{Hero, Overview, WhyAttend, Agenda, Location, Speakers, KeyContent, Documents, News, Sponsors, FAQ, Footer}.tsx`
- `src/routes/index.tsx` — compose tất cả section.

## Ngoài scope (cần user xác nhận sau)
- Logo thật của ASF 2026 (đang dùng text placeholder).
- Ảnh speaker, venue, news thật.
- Form đăng ký kết nối backend (hiện chỉ button demo).
