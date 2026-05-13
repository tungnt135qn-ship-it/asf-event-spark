## Mục tiêu

1. Sửa lỗi trang **Tổng quan** sự kiện (mục đầu tiên trong sidebar khi đang focus 1 sự kiện).
2. Gom **Nội dung** và **Tài nguyên** thành 2 nhóm dropdown (collapsible) trong sidebar, mỗi nhóm liệt kê các mục con tương ứng.
3. Chuyển các phần **Tin tức, Thư viện, Tài liệu, Thông cáo, Chủ đề, FAQ, Lịch trình** sang dạng **bảng (Table)** với cột chính + cột Hành động (Xem / Sửa / Xoá), thao tác Tạo/Sửa/Xem mở **Dialog** riêng (không còn form danh sách dài như hiện tại).

## Thay đổi sidebar

- Thêm 2 nhóm collapsible (dùng `Collapsible` + `SidebarGroup`):
  - **Nội dung**: Hero, Overview, Why Attend, Key Content, Tin tức, Chủ đề, FAQ, Thông cáo, Lịch trình
  - **Tài nguyên**: Khách sạn, Tài liệu, Thư viện, Access codes, Diễn giả, Nhà tài trợ
- Mỗi mục con điều hướng tới `?tab=<group>&sub=<sub>` của trang sự kiện hiện tại.
- Mục **Tổng quan** trỏ tới `?tab=overview` (tab mới) — tránh xung đột với route mặc định.

## Sửa lỗi Tổng quan

- Hiện sidebar đẩy về `eventBase` (không có search) ⇒ rơi vào tab mặc định `general`. Đặt 1 tab riêng `overview` với nội dung dashboard nhanh (KPI: số đăng ký, số booking, trạng thái, link nhanh) — giải quyết "lỗi" và làm trang có ý nghĩa.

## Refactor `EventTabs`

- Thêm search param `sub` (string).
- Tabs chính giữ: `overview | general | settings | theme | content | modules | resources` nhưng phần `content` & `modules` & `resources` chỉ render **một panel con** dựa vào `sub` (mặc định panel đầu tiên).

## Bảng + Dialog cho 7 mục

Tạo component dùng chung `CrudListPage<T>` với props:
- `columns`: định nghĩa cột hiển thị
- `rows`, `loading`
- `onCreate`, `onEdit(row)`, `onView(row)`, `onDelete(row)`
- Render: thanh công cụ (search + nút "Tạo mới") + `<Table>` shadcn + cột "Hành động" dropdown.

Dialog form dùng các editor đã có (lấy ra từ `ModulesTab` / `ResourcesTab`) đặt vào `<Dialog>`. Mode `view` = readonly preview, `create`/`edit` = form save.

### Server functions per-item (mới)

Hiện tại các bảng dùng pattern **replace toàn bộ**. Dialog cần API per-item. Bổ sung:

- `news`: `upsertNewsItem`, `deleteNewsItem`
- `library_items`: `upsertLibraryItem`, `deleteLibraryItem`
- `documents`: `upsertDocument`, `deleteDocument`
- `press_releases`: `upsertPressRelease`, `deletePressRelease`
- `topics`: `upsertTopic`, `deleteTopic`
- `faqs`: `upsertFaq`, `deleteFaq`
- `agenda_days` + `agenda_sessions`: `upsertAgendaDay`, `deleteAgendaDay`, `upsertAgendaSession`, `deleteAgendaSession`

Tất cả validate bằng Zod, dùng `requireSupabaseAuth`, RLS đã sẵn sàng.

### Trang mới (mỗi mục 1 panel)

- `NewsListPanel`, `LibraryListPanel`, `DocumentsListPanel`, `PressListPanel`, `TopicsListPanel`, `FaqsListPanel`, `AgendaListPanel`
- Dùng `CrudListPage` + dialog tương ứng.
- Phần còn lại (Hero/Overview/WhyAttend/KeyContent/Hotels/Speakers/Sponsors/AccessCodes) giữ form cũ trong panel riêng — không nằm trong yêu cầu chuyển sang table.

## Phạm vi & file dự kiến

Sửa:
- `src/components/admin/AdminAppSidebar.tsx` — thêm 2 nhóm collapsible
- `src/routes/admin.events.$id.tsx` — thêm tab `overview`, hỗ trợ `?sub=`, gắn panel mới

Tạo:
- `src/lib/event-items-admin.functions.ts` — server fn per-item cho 7 mục
- `src/components/admin/CrudListPage.tsx` — khung table + dialog
- `src/components/admin/panels/{NewsPanel,LibraryPanel,DocumentsPanel,PressPanel,TopicsPanel,FaqsPanel,AgendaPanel,OverviewDashboard}.tsx`

Không đụng:
- DB schema, RLS, các route frontend `/e/$slug/*`, SEO helpers.

## Triển khai theo 3 đợt (PR liên tiếp)

1. **Đợt A**: Sidebar dropdown + tab `overview` (dashboard nhanh) + khung `CrudListPage` + per-item server fn cho **News & FAQ** (làm pilot).
2. **Đợt B**: Áp dụng cho **Documents, Library, Press, Topics**.
3. **Đợt C**: Áp dụng cho **Agenda** (days + sessions phức tạp hơn) và dọn lại `ModulesTab`/`ResourcesTab` (chỉ giữ các phần chưa chuyển: Speakers/Sponsors/AccessCodes/Hotels).

Sau mỗi đợt sẽ build & kiểm tra trước khi sang đợt tiếp theo.
