## Mốc 2: Tạo super admin + Schema toàn bộ + Seed dữ liệu ASF 2026

### A. Tạo tài khoản Super Admin
1. Bật **auto-confirm email** tạm thời (để tài khoản `superadmin@gmail.com` đăng nhập được ngay không cần verify).
2. Insert user vào `auth.users` với email `superadmin@gmail.com` / mật khẩu `123123` (qua migration dùng `crypt()` + bcrypt của extension `pgcrypto`, hoặc qua SQL admin function).
3. Trigger `handle_new_user` tự tạo `profiles`. Thêm bản ghi `user_roles (user_id, role='super_admin', event_id=null)`.
4. Sau khi tạo xong, **tắt** auto-confirm để các user sau vẫn phải verify email (giữ default an toàn).

### B. Schema dữ liệu nội dung sự kiện

Tất cả bảng có: `id uuid pk`, `event_id uuid references events on delete cascade`, `created_at`, `updated_at`, trigger `set_updated_at`. Các trường text song ngữ dùng `jsonb` dạng `{vi, en}`. Các trường mảng song ngữ dùng `jsonb`.

**Cấu hình & meta**
- `event_settings` (1-1 với event): contact (email, phone, address jsonb i18n), social_links jsonb, seo jsonb i18n, footer_text jsonb i18n, registration_enabled bool, booking_enabled bool, library_locked bool.
- `hero_content`: title jsonb i18n, subtitle jsonb i18n, cta_label jsonb i18n, cta_url, background_url, countdown_to timestamptz.
- `overview_content`: title, body (rich) — đều jsonb i18n; stats jsonb (mảng {label_i18n, value}).
- `why_attend_items`: position int, icon, title i18n, description i18n.
- `key_contents`: position int, title i18n, body i18n, image_url.

**Nội dung động**
- `agenda_days`: position, date, title i18n.
- `agenda_sessions`: day_id fk, position, time_start, time_end, title i18n, description i18n, room i18n, speaker_ids uuid[].
- `topics`: slug, position, title i18n, summary i18n, body i18n, image_url, color.
- `speakers`: position, full_name, title i18n, organization i18n, bio i18n, avatar_url, socials jsonb, topic_ids uuid[].
- `hotels`: position, name, address i18n, description i18n, price_text i18n, image_url, booking_url, distance_km, rating.
- `news`: slug, position, title i18n, excerpt i18n, body i18n, cover_url, published_at, source.
- `press_releases`: title i18n, body i18n, file_url, published_at.
- `faqs`: position, question i18n, answer i18n, category i18n.
- `sponsors`: tier (enum: platinum/gold/silver/bronze/partner), position, name, logo_url, website_url.
- `documents`: position, title i18n, description i18n, file_url, type, size_bytes, requires_code bool.
- `library_items`: position, title i18n, description i18n, file_url, thumbnail_url, type (video/pdf/image), requires_code bool.

**Vận hành**
- `access_codes`: code (unique trong event), label i18n, scope (enum: registration/library/document), max_uses, used_count, expires_at, active bool.
- `registrations`: full_name, email, phone, country_code, organization, title, dietary, notes, language, access_code_id, raw jsonb (toàn bộ payload form), submitted_at.
- `bookings`: hotel_id fk, full_name, email, phone, check_in date, check_out date, guests int, room_type, notes, status, raw jsonb.

### C. RLS

- **Public read** (anon + authenticated) chỉ khi `event_id` thuộc event có `status='published'` — kiểm qua subquery `EXISTS (SELECT 1 FROM events WHERE id = event_id AND status='published')`. Áp cho mọi bảng nội dung trừ `access_codes`, `registrations`, `bookings`.
- **`access_codes`**: không cho public select. Việc verify code làm qua server function (sẽ thêm ở mốc 7) bằng `supabaseAdmin`.
- **`registrations` / `bookings`**:
  - INSERT cho anon (kèm validate `event_id` thuộc event published) — vì user công khai submit form.
  - SELECT/UPDATE/DELETE chỉ cho `super_admin` hoặc `can_manage_event(event_id)`.
- **CRUD admin** (insert/update/delete) trên các bảng nội dung: chỉ khi `can_manage_event(auth.uid(), event_id)`.

### D. Seed ASF 2026 từ mock

- Lấy `event_id` của `asf-2026` đã tạo ở mốc 1.
- Cập nhật `events.name/tagline/location/start_at/end_at/theme/logo_url/cover_url` từ dữ liệu hiện có trong `src/lib/event.ts` + i18n dictionaries.
- Insert `event_settings`, `hero_content`, `overview_content` từ Hero/Overview sections + dictionaries.
- Insert toàn bộ `why_attend_items`, `key_contents` từ `WhyAttend.tsx`, `KeyContent.tsx`.
- Insert `agenda_days` + `agenda_sessions` từ `Agenda.tsx`.
- Insert `topics` (5 chủ đề) từ `src/lib/topics.ts` — set cả `vi` và `en` từ dictionaries.
- Insert `speakers` từ `src/lib/speakers.ts`.
- Insert `hotels` từ `src/lib/hotels.ts`.
- Insert `news` từ `src/lib/news.ts`.
- Insert `faqs` từ `FAQ.tsx`.
- Insert `sponsors` từ `Sponsors.tsx`.
- Insert `documents` (Cẩm nang sự kiện, agenda PDF…) từ `Documents.tsx`.
- Insert `library_items` từ `Library.tsx` / dictionaries.
- Insert `press_releases` từ `PressRelease.tsx`.
- Trường i18n: nếu mock chỉ có 1 ngôn ngữ thì lấy dictionaries `vi.ts` + `en.ts` để fill cả 2 phía.

### E. Phạm vi mốc 2 (KHÔNG gồm)

- Refactor landing để đọc từ DB (sẽ ở mốc 3).
- Multi-event URL `/e/$slug` (mốc 4).
- Trang CMS chi tiết (mốc 5–6).
- Server functions verify code / submit registration (mốc 7).

### F. Kỹ thuật triển khai

- 1 migration tạo schema + RLS + triggers `set_updated_at`.
- 1 migration tạo super admin (auto-confirm on → insert user → role → off).
- 1–2 migration seed (tách ra cho dễ rollback nếu lỗi). Seed dùng CTE lấy `event_id` của `asf-2026`.
- Sau khi migrate xong, kiểm tra bằng `read_query` đếm số bản ghi mỗi bảng và chạy `linter`.

### Sau khi mốc 2 xong

Bạn có thể đăng nhập `superadmin@gmail.com / 123123` tại `/admin`, thấy ASF 2026, nhưng landing vẫn dùng mock — đến mốc 3 mới đọc DB. OK để bắt đầu?
