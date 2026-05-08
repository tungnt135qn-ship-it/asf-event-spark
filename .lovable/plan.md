## Mục tiêu

Đồng bộ toàn bộ thông tin mock của site với nội dung chính thức từ Tờ trình VBMA về ASF 2026.

## Khác biệt phát hiện giữa mock hiện tại và Tờ trình

| Hạng mục | Mock hiện tại | Theo Tờ trình | Hành động |
|---|---|---|---|
| Ngày tổ chức | 14–17/04/2026 | **01–04/10/2026** | Sửa toàn bộ |
| Địa điểm | National Convention Center | **Khách sạn 5 sao tại Hà Nội** (đã chọn Meliá Hanoi) | Sửa FAQ, đồng bộ Meliá |
| Quy mô | "500+ delegates", "20+ markets" | **100–150 đại biểu**, ~30 hiệp hội thành viên | Sửa WhyAttend, Overview |
| Agenda Day 1 | City tour + Welcome reception | City tour + **ASF Pre-meeting** + Welcome Dinner | Cập nhật sessions |
| Agenda Day 2 | Generic "Main Conference" | 3 chủ đề sáng + Báo cáo thị trường thành viên P1 | Viết lại sessions + topics |
| Agenda Day 3 | Closing + Vietnam Investment Conference | Báo cáo P2/P3 (kết thúc 12:00) + **Hội thảo "TTCK Việt Nam — Kỷ nguyên mới"** chiều 13:30 với 5 nội dung | Viết lại sessions |
| Agenda Day 4 | Halong Bay Day Tour | Tour Hạ Long trong ngày | Giữ nguyên, chỉnh ngày |
| Topics | 5 topic generic | 3 chủ đề ASF + 1 chủ đề VN Kỷ nguyên mới (5 sub-topics) | Cập nhật topics.ts |
| Thành phần tham dự | Không nêu rõ | 4 nhóm: ICMA/ASIFMA/ICSA; 30+ hiệp hội; cơ quan QL VN; NĐT | Bổ sung trong Overview/WhyAttend |
| Đồng tổ chức | VBMA + VASB (đã có) | VBMA + VASB ✓ | Giữ nguyên |

## Thay đổi chi tiết theo file

### `src/lib/event.ts`
- `EVENT_START` → `2026-10-01T09:00:00+07:00`
- `EVENT_END` → `2026-10-04T18:00:00+07:00`
- Cập nhật 4 `EventDay` với `date` mới và sessions:
  - **Day 1 (01/10):** City tour Hà Nội · ASF Pre-meeting · Welcome Dinner
  - **Day 2 (02/10):** Sáng — 3 chủ đề (Asian Equity Markets Outlook, Asian Bond Markets Development, Digitalization/AI/Online Trading); Chiều — Báo cáo thị trường thành viên Phần 1
  - **Day 3 (03/10):** Sáng — Báo cáo thị trường thành viên Phần 2 & 3 (kết 12:00); Chiều 13:30 — Hội thảo "Thị trường Chứng khoán Việt Nam — Kỷ nguyên mới" với 5 chủ đề con
  - **Day 4 (04/10):** Tour Hạ Long trong ngày

### `src/lib/topics.ts`
Thay 5 topic hiện tại bằng 4 topic chính khớp Tờ trình:
1. `asian-equity-outlook` — Recent Developments and Outlook for Asian Equity Markets
2. `asian-bond-markets` — Development of Asian Bond Markets
3. `digital-ai-capital-markets` — Digitalization, Online Trading and AI: Transforming Capital Markets
4. `vietnam-new-era` — Thị trường Chứng khoán Việt Nam — Kỷ nguyên mới (5 sub-bullets từ mục 3.3)

Cập nhật `topicSlugs` trong event.ts khớp slug mới.

### `src/components/sections/Hero.tsx`
- Sửa "14 – 17 April 2026" → **"1 – 4 October 2026"**

### `src/components/sections/FAQ.tsx`
- Q location: "Meliá Hanoi Hotel, Hà Nội — 1–4/10/2026"
- Cập nhật câu trả lời liên quan ngày tháng/visa nếu có

### `src/components/sections/WhyAttend.tsx`
- "500+ senior delegates" → **"100–150 đại biểu cấp cao"**
- Giữ "20+" hoặc đổi thành "30+ hiệp hội chứng khoán khu vực"
- Bổ sung 4 nhóm thành phần tham dự nếu phù hợp layout

### `src/components/sections/Overview.tsx`
- Highlight "20+ thị trường vốn châu Á" → **"30+ hiệp hội chứng khoán khu vực Châu Á – Châu Đại Dương"**
- Highlight "4 ngày sự kiện chính thức tại Hà Nội" → **"4 ngày (1–4/10/2026) tại Hà Nội"**
- Cập nhật mô tả ASF: "thành lập 1995, mạng lưới hiệp hội chứng khoán Châu Á – Châu Đại Dương"

### `src/components/sections/KeyContent.tsx` (kiểm tra)
- Đồng bộ các mốc nội dung chính (3 chủ đề ASF + chủ đề VN)

### `src/components/sections/Footer.tsx`
- Nếu có ngày tháng → cập nhật

### `src/components/sections/Register.tsx` & countdown
- Tự động dùng `EVENT_START` mới → không cần sửa code

## Phạm vi KHÔNG đổi
- Speakers (mock placeholder, giữ nguyên)
- Hotels (Meliá/InterContinental/Sheraton — phù hợp "khách sạn 5 sao Hà Nội")
- Sponsors/News/Press/Library (mock UI)
- Logo/branding VBMA + VASB

## Thứ tự thực hiện
1. Sửa `event.ts` (ngày + sessions) và `topics.ts` (4 topic mới) — nguồn dữ liệu trung tâm
2. Sửa Hero, Overview, WhyAttend, FAQ — UI phụ thuộc
3. Quét lại bằng `rg` xem còn chuỗi "April" hoặc "14"/"17" cứng nào không
4. Kiểm tra preview các trang: Home, /topics/$slug, /library

## Câu hỏi xác nhận trước khi triển khai
- Có giữ thêm các speaker placeholder hiện tại, hay chờ danh sách chính thức?
- Có cần dịch toàn bộ agenda sang tiếng Anh (cho khách quốc tế) song song bản tiếng Việt, hay giữ tiếng Anh như hiện tại?
