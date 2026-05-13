
# Kế hoạch: CMS quản trị sự kiện (multi-event template)

## 1. Mô hình tổng thể

- **Mỗi sự kiện = 1 bản ghi `events` độc lập** với `id` (uuid) + `slug` (vd `asf-2026`).
- Landing public chuyển sang URL theo sự kiện:
  - `/e/$eventSlug` → trang chủ của sự kiện đó
  - `/e/$eventSlug/news/$slug`, `/e/$eventSlug/topics/$slug`, `/e/$eventSlug/library`, `/e/$eventSlug/account/...`
  - `/` → redirect về sự kiện "default" (ASF 2026 sau seed) để link cũ không vỡ.
- **CMS** ở `/admin/*`, đăng nhập bằng email/password (Lovable Cloud Auth). Khi vào CMS, admin chọn 1 sự kiện trong danh sách → mọi màn cấu hình đều scope theo `event_id` đang chọn (giữ trong context + URL `/admin/$eventId/...`).
- **Cô lập dữ liệu**: mọi bảng nội dung đều có `event_id` + RLS lọc theo `event_id` + role admin có quyền trên sự kiện đó.

## 2. Bật Lovable Cloud + Auth

- Bật Cloud (Postgres + Auth).
- Auth: email/password cho admin. Không dùng Google/Apple ở giai đoạn này.
- Bảng phụ trợ:
  - `profiles` (id ↔ auth.users, full_name, avatar)
  - `app_role` enum: `super_admin`, `event_admin`, `editor`
  - `user_roles` (user_id, role, event_id nullable) — `super_admin` không gắn event_id, `event_admin/editor` gắn theo từng event.
  - `has_role(_uid, _role, _event_id)` security definer cho RLS (tránh đệ quy).

## 3. Schema dữ liệu (chính)

Tất cả bảng nội dung đều có `event_id uuid not null references events(id) on delete cascade`, `created_at`, `updated_at`, và các field text song ngữ lưu dạng JSONB `{ vi: string, en: string }` (gọn, không nhân đôi cột).

- `events` — id, slug (unique), name_i18n, tagline_i18n, status (draft/published/archived), default_lang, start_at, end_at, location_i18n, cover, logo, theme (json: màu, gradient), is_default (bool, đúng 1 cái true).
- `event_settings` — 1-1 với event: countdown target, registration deadline, contact info, social links, footer content (i18n).
- `access_codes` — code, role (AFF/SPN/SPK), name, email, organisation, active.
- `registrations`, `bookings` — kế thừa từ `RegistrationRecord`/`BookingRecord` hiện tại + `event_id`.
- `agenda_days` (index, date, label_i18n) → `agenda_sessions` (day_id, time, title_i18n, description_i18n, location_i18n, tag).
- `topics` (slug, title_i18n, desc_i18n, image, long_description_i18n, highlights_i18n[], content_blocks_i18n jsonb).
- `speakers` (name, title, role_i18n, org_i18n, bio_i18n, img) + `speaker_topics` (m-n).
- `hotels` (name, tier_i18n, address_i18n, map_url, website, perks_i18n[], contact, images[], description_i18n).
- `news` (slug, date, tag_i18n, title_i18n, excerpt_i18n, cover, author, read_time, body_blocks_i18n jsonb).
- `faqs` (order, question_i18n, answer_i18n, category).
- `sponsors` (tier, name, logo, url, order).
- `documents` (title_i18n, file_url, size, category, requires_role).
- `library_items` (title_i18n, type, url, requires_role).
- `key_contents`, `why_attend_items`, `overview_blocks`, `press_releases` — các block tĩnh nhưng vẫn cho admin sửa (đáp ứng "Toàn bộ landing").
- `hero_content` (1-1: headline_i18n, subheadline_i18n, cta_i18n, badges_i18n, background_image).

Storage buckets: `event-assets/{event_id}/...` cho ảnh hero/cover/speaker/hotel/news/sponsor/document.

## 4. RLS

- Public read các bảng nội dung **chỉ khi `events.status = 'published'`** (hoặc `event_id` thuộc event published).
- Write/Update/Delete: chỉ `super_admin`, hoặc `event_admin/editor` của đúng `event_id` (qua `has_role`).
- `registrations`/`bookings`: insert public (form đăng ký), select chỉ admin của event.
- `access_codes`: select chỉ admin; check code khi đăng nhập làm qua server function (không expose cả bảng).

## 5. Refactor frontend (landing public)

- Tạo `EventProvider` (giống `LanguageProvider`) đọc `eventSlug` từ URL → fetch toàn bộ data event 1 lần (React Query) → cung cấp qua context cho mọi section.
- Tách logic data: thay vì import trực tiếp `news`, `topics`, `speakers`, `hotels`, `EVENT_DAYS`, các section dùng hook `useEvent()`/`useEventNews()`/v.v.
- Helper `pickI18n(value, lang)` cho field JSONB.
- Routes mới:
  ```
  src/routes/e.$eventSlug.tsx                  (layout: load event + provider)
  src/routes/e.$eventSlug.index.tsx            (landing)
  src/routes/e.$eventSlug.news.$slug.tsx
  src/routes/e.$eventSlug.topics.$slug.tsx
  src/routes/e.$eventSlug.library.tsx
  src/routes/e.$eventSlug.account.registrations.tsx
  src/routes/e.$eventSlug.account.bookings.tsx
  src/routes/index.tsx                          (redirect → /e/{default})
  ```
- Auth code (AFF/SPN/SPK) chuyển sang gọi server function `verifyAccessCode(eventId, code)`.

## 6. Cấu trúc CMS (`/admin`)

```
src/routes/admin.tsx                       layout: yêu cầu đăng nhập + sidebar chọn event
src/routes/admin.login.tsx                 đăng nhập admin
src/routes/admin.index.tsx                 danh sách sự kiện + nút "Tạo sự kiện mới"
src/routes/admin.$eventId.tsx              layout cho 1 event (sidebar trái: các section)
  ├─ overview              dashboard: số lượng đăng ký, booking, trạng thái
  ├─ settings              tên/slug/ngày/logo/theme/status/default_lang/is_default
  ├─ hero, overview, why-attend, key-content
  ├─ agenda                CRUD ngày + sessions (drag reorder)
  ├─ speakers              CRUD + chọn topics liên quan
  ├─ topics                CRUD + content blocks editor
  ├─ hotels                CRUD + ảnh + perks
  ├─ news, press-release   CRUD + block editor (p/h/img/quote)
  ├─ faq, sponsors, documents, library
  ├─ contact, footer
  ├─ access-codes          CRUD code đăng nhập khách
  ├─ registrations         table + filter + export CSV (read-only)
  ├─ bookings              table + filter + export CSV (read-only)
  └─ team                  (super_admin + event_admin) mời admin theo event
src/routes/admin.users.tsx                 chỉ super_admin: quản lý toàn bộ admin/role
```

### UX nhập song ngữ
- Mỗi field i18n hiển thị 2 tab `VI | EN` trong cùng FormField (component `<I18nInput>`, `<I18nTextarea>`, `<I18nRichBlocks>`). Giá trị lưu `{ vi, en }`.
- Validate: bắt buộc cả 2 ngôn ngữ ở các field chính (title, name); description có thể fallback nếu thiếu.
- Block editor (news/topics): danh sách block kéo-thả, mỗi block có 2 tab VI/EN.

### Tạo sự kiện mới
- Form: name (i18n), slug, ngày bắt đầu/kết thúc, địa điểm, ngôn ngữ mặc định.
- "Bản ghi trống" — không clone. (theo lựa chọn của bạn)
- Sau khi tạo: chuyển vào `/admin/$eventId/settings`.

## 7. Seed dữ liệu ASF 2026 từ mock

- Một migration/script chạy 1 lần: tạo event `asf-2026` (is_default=true, status=published) + insert toàn bộ dữ liệu hiện tại từ `src/lib/event.ts`, `news.ts`, `topics.ts`, `speakers.ts`, `hotels.ts`, `countries.ts (customerTypes)`, các text trong section component.
- Field i18n: với chỗ hiện chỉ có 1 ngôn ngữ → đặt cùng giá trị cho cả `vi` và `en` để admin sửa lại sau (có badge "Chưa dịch" trong CMS để dễ rà).
- Asset import: copy file ảnh trong `src/assets/...` lên Storage bucket khi seed (script Node chạy với service role).

## 8. Server functions chính

- `verifyAccessCode({ eventId, code })` — kiểm code khách, trả AuthUser.
- `submitRegistration({ eventId, payload })`, `submitBooking({ eventId, payload })`.
- `cloneEvent({ sourceEventId, newSlug, newName })` (tuỳ chọn để clone nhanh, không bắt buộc giai đoạn 1).
- `exportRegistrations(eventId)` / `exportBookings(eventId)` → CSV.

## 9. Lộ trình triển khai (8 mốc)

1. **Bật Cloud + Auth + bảng `events`/`profiles`/`user_roles`/`has_role`** + route `/admin/login`, `/admin` (danh sách event), seed 1 super_admin đầu tiên.
2. **Schema toàn bộ bảng nội dung + RLS + Storage bucket**. Migration seed ASF 2026 từ mock (insert dữ liệu hiện tại).
3. **Refactor landing**: thêm `EventProvider`, đổi tất cả section dùng data từ context (chưa đổi URL — vẫn `/`, đọc event default). Verify trang chủ chạy đúng từ DB.
4. **Multi-event URL**: thêm routes `/e/$eventSlug/...`, redirect `/` → default. Auth khách + form đăng ký gọi server fn theo event.
5. **CMS — nhóm core**: Settings, Hero, Overview, Agenda, Speakers, Topics (kèm `<I18nInput>` + `<I18nRichBlocks>`).
6. **CMS — nhóm còn lại**: Hotels, News, Press, FAQ, Sponsors, Documents, Library, Contact, Footer, Why Attend, Key Content.
7. **CMS — vận hành**: Access Codes, Registrations, Bookings (table + export), Team/Users + phân quyền.
8. **Hoàn thiện**: dashboard overview, badge "chưa dịch", upload ảnh, theme/branding per event, nút duplicate event (clone).

Mỗi mốc có thể publish độc lập, không vỡ landing.

## 10. Rủi ro & lưu ý

- **Khối lượng**: rất lớn — nên bám lộ trình 8 mốc, mỗi mốc 1 lượt build.
- **Routing**: chuyển sang `/e/$slug` sẽ ảnh hưởng SEO của link cũ; redirect 301 từ `/` về default event sẽ giải quyết.
- **i18n JSONB**: query đơn giản (`value->>lang`), nhưng nếu cần search full-text 2 ngôn ngữ sẽ cần index riêng (chưa cần giai đoạn này).
- **Storage**: ảnh seed dùng path tương đối hiện tại; sau khi đẩy lên bucket cần đổi sang URL public của Cloud.
- **Phân quyền**: super_admin không gắn event; event_admin chỉ thao tác đúng event_id của mình — RLS bắt buộc, không tin client.
- **Backward compat**: trong lúc refactor, giữ song song mock cũ tới hết mốc 3 để landing không vỡ.

## 11. Câu cần bạn quyết trước khi bắt đầu mốc 1

- Email super_admin đầu tiên là gì? (mình sẽ thêm bằng add-secret hoặc seed thủ công sau khi bạn đăng ký)
- URL public mặc định: giữ `/` redirect → `/e/asf-2026`, hay đổi hẳn root thành `/e/asf-2026` (link cũ sẽ vỡ)?
- "Cẩm nang sự kiện" có nằm trong template per-event hay là tài liệu chung? (giả định: per-event, nằm trong `documents`).
