## Mục tiêu

1. Sidebar admin tách 2 tầng rõ ràng: **Global** (luôn hiển thị) và **Event-scoped** (chỉ hiện khi đang ở trong 1 sự kiện).
2. Khi đổi sự kiện đang focus → toàn bộ menu con và dữ liệu các màn con tự động cập nhật theo `eventId`.
3. Các field nội dung dài (mô tả overview, key content, news body, topic body, footer, settings…) chuyển sang **rich-text editor** (TipTap) thay cho `<Textarea>`.
4. Chuẩn hoá lại layout các màn "nội dung" để dùng chung 1 khung: header + breadcrumb + tabs/sub-nav + content card.

---

## 1. Cấu trúc menu mới

```text
GLOBAL (luôn hiện)
├─ Dashboard          /admin
├─ Sự kiện            /admin                (list)
├─ Người dùng         /admin/users          (super admin)
└─ Cài đặt hệ thống   /admin/settings

EVENT (hiện khi route = /admin/events/$id/*)
[Selector sự kiện đang focus  ▼]
├─ Tổng quan          /admin/events/$id
├─ Thông tin chung    /admin/events/$id/general
├─ Cấu hình           /admin/events/$id/settings
├─ Giao diện          /admin/events/$id/theme
├─ Nội dung           /admin/events/$id/content
│   ├─ Overview
│   ├─ Key contents
│   ├─ News
│   ├─ Topics
│   └─ FAQ
├─ Module             /admin/events/$id/modules
├─ Tài nguyên         /admin/events/$id/resources
├─ Đăng ký            /admin/events/$id/registrations
└─ Đặt phòng          /admin/events/$id/bookings
```

- Mở rộng nhóm "Event" tự động khi URL match `/admin/events/$id`.
- Có **EventSwitcher** ở đầu nhóm Event (dropdown các event đang quản lý) → đổi sự kiện = `navigate` sang cùng sub-route của event mới, dữ liệu tự reload theo `eventId` mới.
- Sidebar collapsible (icon-only) để có nhiều không gian cho màn nội dung.

---

## 2. Refactor route

Hiện tại tất cả tab nội dung gộp trong 1 file `admin.events.$id.tsx` dùng `<Tabs>`. Sẽ tách thành các route con để URL phản ánh đúng vị trí, deep-link được, và sidebar highlight đúng:

- `admin.events.$id.tsx` → biến thành **layout route** (header + sidebar event scope + `<Outlet />`).
- Tách thành các file:
  - `admin.events.$id.index.tsx` (Tổng quan + KPI nhanh)
  - `admin.events.$id.general.tsx`
  - `admin.events.$id.settings.tsx`
  - `admin.events.$id.theme.tsx`
  - `admin.events.$id.content.tsx` (layout cho con)
  - `admin.events.$id.content.overview.tsx`
  - `admin.events.$id.content.key.tsx`
  - `admin.events.$id.content.news.tsx`
  - `admin.events.$id.content.topics.tsx`
  - `admin.events.$id.content.faq.tsx`
  - `admin.events.$id.modules.tsx`
  - `admin.events.$id.resources.tsx`
  - (đã có) `registrations`, `bookings`

Code form/list hiện có được di chuyển nguyên trạng vào các route con tương ứng — không đổi server functions.

---

## 3. Rich-text editor

- Dùng **TipTap** (`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-link`, `@tiptap/extension-image`, `@tiptap/extension-placeholder`).
- Tạo component dùng chung `src/components/admin/RichTextEditor.tsx`:
  - Toolbar: bold / italic / underline / heading 2-3 / bullet & ordered list / blockquote / link / image (upload qua bucket hiện có) / clear.
  - Output **HTML string** lưu thẳng vào DB (các field hiện đang là `text` nên không cần migration).
  - Hỗ trợ `value`, `onChange`, `placeholder`, `minHeight`.
  - Có biến thể `RichTextI18nField` (vi/en song song) thay cho `I18nField` textarea.
- Frontend render bằng `dangerouslySetInnerHTML` + class `prose` (Tailwind typography đã có thể dùng qua plugin hoặc CSS reset thủ công trong `styles.css`).

Các field áp dụng rich-editor:
- `overview_content.description` (vi/en)
- `key_contents.description` (vi/en)
- `news.body` (vi/en)
- `topics.body` (vi/en)
- `faq.answer` (vi/en)
- `event_settings.footer_text` (vi/en) — bản rút gọn (chỉ bold/link)

Field ngắn (title, tagline, location, label, slug, contact info…) **giữ nguyên** Input thường.

---

## 4. Chuẩn hoá layout các màn nội dung

Tạo wrapper `src/components/admin/PageShell.tsx`:

```text
┌─ Breadcrumb ────────────────────────────────┐
│ Sự kiện > {event.name} > Nội dung > News   │
├─ Title row + actions (Save / New / Filter)│
├─ Optional sub-tabs (vi/en, draft/published)│
└─ Content card (form hoặc list)             │
```

Mỗi màn nội dung:
- List view: bảng có search + filter trạng thái + nút "Tạo mới".
- Detail/edit: 2 cột — cột trái form (rich-editor full width), cột phải metadata (slug, cover, published_at, status).
- Validation + toast nhất quán.

---

## 5. Chi tiết kỹ thuật

- `bun add @tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-image @tiptap/extension-placeholder @tiptap/extension-underline`
- `EventSwitcher`: `useQuery` list events (đã có `listEventsAdmin`), lưu chọn vào URL (không cần localStorage).
- Sidebar mới đặt trong `admin.tsx` thay cho `<aside>` hiện tại; dùng shadcn `Sidebar` + `SidebarProvider` để có collapse/icon mode.
- Active state: `useRouterState({ select: r => r.location.pathname })` + `startsWith` cho group active.
- Mọi route con vẫn dùng `useAdminAuth` và server functions hiện có; chỉ tách UI, không đụng business logic.
- `routeTree.gen.ts` sẽ được Vite plugin tự cập nhật khi tạo file route mới.

---

## 6. Phạm vi giao hàng

Để tránh PR quá lớn, mốc này chia 3 bước nhỏ trong cùng 1 lần:

1. **Sidebar mới + EventSwitcher** (admin.tsx + AppSidebar component).
2. **Tách routes con** cho `/admin/events/$id/*` (di chuyển code từ Tabs sang route files, giữ logic).
3. **RichTextEditor + áp vào** Overview / Key content / News / Topics / FAQ / Footer.

Không thay đổi: schema DB, server functions, các route frontend `/e/$slug`, dashboard charts, SEO helpers.
