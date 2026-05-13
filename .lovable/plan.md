# Mốc 3 — Landing đọc DB, đa sự kiện, clone template

## Mục tiêu
1. Landing (`/` + `/e/$slug` + route con) đọc 100% từ DB.
2. `/` redirect tới event mặc định (`is_default=true, status=published`); `/e/$slug` render theo slug.
3. Tạo event mới = **clone toàn bộ dữ liệu** từ event mặc định (ASF 2026) — không bao giờ để landing trống.
4. Giữ nguyên giao diện hiện tại, không đổi UI.

## A. Server functions (data layer)

File `src/lib/event-content.functions.ts`:
- `getEventBySlug(slug)` → row `events` + đảm bảo `status=published` (anon).
- `getDefaultEventSlug()` → slug của event `is_default=true, status=published`.
- `getEventContent(eventId)` → 1 RPC gom: `event_settings`, `hero_content`, `overview_content`, `why_attend_items`, `key_contents`, `topics`, `speakers`, `agenda_days` + `agenda_sessions`, `hotels`, `news`, `press_releases`, `faqs`, `sponsors`, `documents`, `library_items`. Trả về object `EventContent` đã chuẩn hoá.
- `getNewsBySlug(eventId, slug)` cho `/news/$slug` (hoặc đổi sang `/e/$slug/news/$newsSlug`).
- `getTopicBySlug(eventId, slug)` cho `/topics/$slug`.

File `src/lib/event-clone.functions.ts` (admin-only, `requireSupabaseAuth` + `super_admin`):
- `cloneEventFromDefault({ slug, name_vi, name_en })`:
  - Tạo row `events` mới (status=`draft`, is_default=false).
  - Copy tất cả bảng nội dung từ event mặc định sang event mới (giữ nguyên position/i18n).
  - Trả về event mới.

## B. Adapter i18n
`src/lib/i18n/from-db.ts`: helper `pickI18n(jsonb, lang) → string` và `pickI18nList`.
Tất cả section nhận `EventContent` + `lang` từ context, gọi adapter để hiển thị.

## C. Context + provider
`src/lib/event-content-context.tsx`:
- `EventContentProvider` bọc landing, expose `useEventContent()` trả `{event, content, lang}`.
- Loader của route landing dùng `ensureQueryData` với `eventContentQueryOptions(slug)`.

## D. Routing

### Đổi cấu trúc routes
- `src/routes/index.tsx`: chỉ làm redirect → `/e/{defaultSlug}` (loader gọi `getDefaultEventSlug`).
- Mới: `src/routes/e.$slug.tsx` — layout event, render `<Landing />` (toàn bộ section hiện tại).
- Mới: `src/routes/e.$slug.topics.$topicSlug.tsx` thay `topics/$slug` cũ.
- Mới: `src/routes/e.$slug.news.$newsSlug.tsx` thay `news/$slug` cũ.
- Mới: `src/routes/e.$slug.library.tsx` thay `library` cũ.
- Cập nhật mọi `<Link to=...>` trong Header/Footer/section dùng param `slug`.

### Backwards compat
- Giữ `/topics/$slug`, `/news/$slug`, `/library` nhưng làm redirect tới event mặc định để không vỡ link cũ.

## E. Refactor 17 section
Mỗi section đổi từ `import { mock } from "@/lib/..."` sang `useEventContent()`:

| Section | Nguồn DB |
|---|---|
| Hero | `hero_content` (+ countdown_to) |
| Overview | `overview_content` |
| WhyAttend | `why_attend_items` |
| KeyContent | `key_contents` |
| Agenda | `agenda_days` + `agenda_sessions` |
| Speakers | `speakers` |
| Topics (list) | `topics` |
| Hotels | `hotels` + `event_settings.booking_enabled` |
| News (list) | `news` |
| PressRelease | `press_releases` |
| FAQ | `faqs` |
| Sponsors | `sponsors` |
| Documents | `documents` + `event_settings.documents_locked` |
| Library | `library_items` + `event_settings.library_locked` |
| Contact | `event_settings.contact` |
| Footer | `event_settings.footer_text` + `social_links` |
| Register | `event_settings.registration_enabled` |

Mock files (`src/lib/event.ts`, `topics.ts`, `speakers.ts`, `hotels.ts`, `news.ts`, dictionaries section content) **giữ lại** làm reference, không xoá ngay (để rollback nếu cần). Dictionaries vẫn dùng cho UI strings (label nút, nav, form…).

## F. CMS dashboard cập nhật
- Form "Tạo event mới" trong `admin.index.tsx` đổi sang gọi `cloneEventFromDefault` → đảm bảo event mới có sẵn data.
- Hiển thị badge "Mặc định" / "Đã clone từ ASF 2026".

## G. SEO
Mỗi route event set `head()` từ `event_settings.seo` + `events.name`.

## H. Kiểm thử
1. `/` → redirect `/e/asf-2026`, landing render đầy đủ y hệt hiện tại.
2. Topics/News/Library deep link hoạt động ở cả URL cũ lẫn mới.
3. Tạo event mới `test-2027` qua CMS → publish → `/e/test-2027` render đầy đủ data ASF clone.
4. Bật `library_locked` qua DB → section khoá lại trên landing.
5. Kiểm tra console không còn import từ mock content (chỉ dictionaries UI strings).

## Ngoài phạm vi mốc 3
- CMS UI form CRUD nội dung từng module (mốc 4).
- Quản lý access codes / registrations / bookings UI (mốc 5).
- Quản lý admin users (mốc 6).
