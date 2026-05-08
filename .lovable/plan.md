# Kế hoạch i18n Anh / Việt cho ASF 2026

## 1. Mục tiêu

- Người dùng có nút chuyển EN ↔ VI trên header (cạnh avatar/Register).
- Lưu lựa chọn vào `localStorage` (`asf2026.lang`), mặc định `vi`.
- Toàn bộ chữ tĩnh (UI labels, tiêu đề section, nội dung mock) dịch được.
- Không gọi API; tất cả là mock JSON tại frontend.

## 2. Kiến trúc

Tự build một i18n provider gọn nhẹ (không cần thư viện ngoài), tránh phình bundle.

```text
src/lib/i18n/
  index.tsx         -> LanguageProvider, useT(), useLang()
  dictionaries/
    en.ts           -> object phẳng dạng { "header.register": "Register Now", ... }
    vi.ts           -> bản dịch tương ứng
```

API dự kiến:

```ts
const { t, lang, setLang } = useT();
t("header.register")          // "Register Now" / "Đăng ký ngay"
t("agenda.day", { n: 2 })     // "Day 2" / "Ngày 2"
```

`LanguageProvider` bọc trong `__root.tsx` (sau `AuthProvider`).

## 3. Component chuyển ngôn ngữ

- `src/components/LanguageSwitcher.tsx`: 2 pill `EN | VI`, hiệu ứng active = gold.
- Đặt trong `Header.tsx` ngay trước nút "Register Now".
- Mobile drawer cũng có 1 hàng switch.

## 4. Phạm vi nội dung cần dịch (chia 4 nhóm để làm tuần tự)

**Nhóm A — Khung điều hướng & layout (ưu tiên 1)**

- `Header` (NAV labels, Register Now, Event Handbook, dropdown News)
- `Footer`
- `AccountMenu`, `AuthButton`, dialog đăng nhập
- `LockedSection` (text khóa)
- 404 / error page trong `__root.tsx`

**Nhóm B — Section trang chủ (ưu tiên 2)**
Hero, Overview, WhyAttend, Agenda, Register (form labels + success dialog),
Hotels (card + dialog booking), Location, Speakers, KeyContent, Documents,
Library, News, PressRelease, Sponsors, FAQ, Contact.

**Nhóm C — Trang phụ**
`/library`, `/account/registrations`, `/account/bookings`,
`/news/$slug`, `/topics/$slug`.

**Nhóm D — Dữ liệu mock có nội dung dài**

- `src/lib/event.ts` (agenda từng ngày, mô tả phiên)
- `src/lib/news.ts` (tin tức)
- `src/lib/topics.ts`, `src/lib/speakers.ts` (bio, mô tả chủ đề)
- `src/lib/hotels.ts` (mô tả, perks)
- `src/lib/countries.ts` (`customerTypes`)

→ Đổi shape: thay vì `title: string`, dùng `title: { en: string; vi: string }`,
hoặc thêm hàm helper `pickLocale(value, lang)`.

## 5. Quy ước key dịch

- Dạng dot-path theo vùng: `header.*`, `hero.*`, `agenda.*`, `register.form.*`, `auth.dialog.*`.
- Chuỗi có biến dùng `{name}`: `t("hero.dateRange", { start, end })`.
- Số ít/nhiều: dùng hàm `tn(key, count)` đơn giản (en: "1 day" / "{n} days"; vi: "{n} ngày").
- Ngày tháng: format theo `lang` qua `Intl.DateTimeFormat`.

## 6. Lộ trình triển khai (4 bước, làm dần)

1. **Bước 1 — Hạ tầng**: tạo `i18n/index.tsx`, 2 file dictionary rỗng,
  provider, `LanguageSwitcher`, gắn vào header & root. Mặc định `vi`.
2. **Bước 2 — Nhóm A**: dịch toàn bộ khung navigation + auth UI.
3. **Bước 3 — Nhóm B**: dịch các section trang chủ. Form Register/Hotels
  chỉ dịch label, giữ giá trị nhập của user.
4. **Bước 4 — Nhóm C + D**: chuyển mock data sang đa ngôn ngữ và dịch các
  trang phụ.

Mỗi bước có thể publish độc lập, không vỡ build.

## 7. Rủi ro & lưu ý

- **Bundle size**: 2 dictionary tải đồng bộ, ước < 30KB gzip — chấp nhận được.
- **SEO**: `<title>` và meta `description` trong `head()` của từng route sẽ
đọc theo lang lưu trong localStorage → SSR sẽ không biết. Giải pháp: vẫn
giữ tiếng Anh ở `head()` (chuẩn quốc tế), đổi text in-page theo lang.
- **Layout dài hơn**: tiếng Việt dài hơn ~15%, vài chỗ (button, badge) cần
kiểm tra wrap; sẽ rà lại ở bước 2.
- Không đụng tới logic Auth, route, dữ liệu submit — chỉ thay text hiển thị.

## 8. Bạn cần quyết định trước khi bắt đầu

- Ngôn ngữ mặc định khi vào lần đầu: **Tiếng Việt** (đề xuất) hay Tiếng Anh?
- Có cần auto-detect theo `navigator.language` không, hay luôn theo mặc định?
- Có muốn URL kèm tiền tố ngôn ngữ (`/vi/...`, `/en/...`) không? (Đề xuất:
KHÔNG — đơn giản hơn, đủ cho phạm vi mock hiện tại.)
  => Mặc định ngôn ngữ tiếng Việt.

9, Lưu ý: Đây chỉ là mockup mặc định cho Front-end để demo khách hàng, không phải xây dựng cả BE.