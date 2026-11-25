# UI/UX Design Specification - SpaFlow AI

## 1. Phong cách thiết kế (Design Vibe)
- **Tên phong cách:** *Soft Organic Luxury & High-Clarity* (Sang trọng, thư giãn đặc trưng ngành Spa nhưng bố cục cực kỳ rõ ràng, chữ to, dễ thao tác như phần mềm bán hàng POS hiện đại).
- **Thư viện UI cốt lõi:** `Shadcn/UI` + `Tailwind CSS` + `Lucide Icons`.
- **Nguyên tắc thiết kế cho người không rành công nghệ:**
  - Nút bấm hành động chính luôn có nhãn chữ rõ ràng đi kèm icon (VD: `+ Thêm lịch hẹn` thay vì chỉ để dấu `+`).
  - Kích thước vùng chạm (Touch target) tối thiểu `44px x 44px` để bấm dễ dàng trên iPad/Điện thoại.
  - Hạn chế tối đa các bảng biểu có quá 5 cột; ưu tiên dạng Card trên thiết bị di động.

## 2. Design Tokens

### Bảng màu (Color Palette)

| Token Name | Hex Code | Mục đích sử dụng |
| :--- | :--- | :--- |
| `Primary` | `#0D9488` (Teal 600) | Nút hành động chính (CTA), trạng thái active, điểm nhấn thương hiệu Spa. |
| `Primary Hover` | `#0F766E` (Teal 700) | Trạng thái hover của nút chính. |
| `Secondary` | `#F0FDFA` (Teal 50) | Nền thẻ nổi bật, badge trạng thái tích cực, highlight menu đang chọn. |
| `Accent` | `#D97706` (Amber 600) | Nút tính năng AI Magic, nhãn VIP, thông báo nhắc nhở quan trọng. |
| `Background` | `#F8FAFC` (Slate 50) | Màu nền tổng thể của ứng dụng (giúp dịu mắt khi nhìn lâu). |
| `Surface` | `#FFFFFF` (White) | Màu nền của các Card, Modal, Bảng dữ liệu, Sidebar. |
| `Text Primary` | `#0F172A` (Slate 900) | Tiêu đề, nội dung chính (độ tương phản cao). |
| `Text Secondary` | `#475569` (Slate 600) | Nhãn phụ, mô tả ngắn, thời gian. |
| `Border` | `#E2E8F0` (Slate 200) | Viền thẻ, đường kẻ phân cách bảng, viền ô nhập liệu. |
| `Success` | `#16A34A` (Green 600) | Lịch hẹn hoàn thành, gửi tin nhắn Zalo/Email thành công. |
| `Warning` | `#EA580C` (Orange 600) | Lịch hẹn sắp đến giờ, chờ xác nhận. |
| `Error` | `#DC2626` (Red 600) | Lỗi nhập liệu, khách hủy lịch, gửi tin nhắn thất bại. |

### Typography & Spacing
- **Font chữ:** `Plus Jakarta Sans` (Tiêu đề) và `Inter` (Nội dung, số liệu) — Hỗ trợ tiếng Việt hoàn hảo, nét chữ tròn trịa, thân thiện.
- **Kích thước chữ chuẩn:**
  - Page Title: `24px` (Bold, `leading-8`)
  - Card Title: `18px` (SemiBold, `leading-7`)
  - Body Text: `15px` (Regular, `leading-6`) — *Lớn hơn chuẩn 14px thông thường để chủ Spa dễ đọc.*
  - Caption / Helper: `13px` (Regular, `leading-5`)
- **Spacing & Border Radius:**
  - Khoảng cách chuẩn giữa các khối (Grid gap): `20px` (`gap-5`) trên Desktop, `16px` (`gap-4`) trên Mobile.
  - Bo góc (Border Radius): `12px` (`rounded-xl`) cho Card/Modal, `8px` (`rounded-lg`) cho Button/Input.

## 3. Layout chi tiết từng màn hình

### A. Landing Page (`/`)
- **Header:** Logo SpaFlow AI + Nút `Đăng nhập` + Nút `Dùng thử miễn phí`.
- **Hero Section:** Tiêu đề lớn đánh trúng nỗi đau ("Quản lý lịch hẹn Spa & Tự động nhắc khách qua Zalo chỉ với 1 chạm") + Ảnh chụp màn hình giao diện trực quan + CTA nổi bật.
- **3 Tính năng trụ cột:** Card minh họa Lịch hẹn thông minh, Tự động nhắn Zalo/Email, AI viết bài & làm video.

### B. Auth Pages (`/login`, `/register`)
- Bố cục chia 2 cột trên Desktop (1 cột trên Mobile): Bên trái là Form đăng nhập/đăng ký siêu gọn (Email, Mật khẩu, Tên Spa); bên phải là hình ảnh không gian Spa thư giãn kèm câu trích dẫn lợi ích.

### C. App Shell (Sau khi đăng nhập - `/dashboard/*`)
- **Desktop:** Sidebar cố định bên trái rộng `260px` gồm 6 mục menu rõ ràng:
  1. `Tổng quan` (Dashboard)
  2. `Lịch hẹn` (Appointments)
  3. `Khách hàng` (Customers)
  4. `Dịch vụ & Nhân viên` (Services & Staff)
  5. `Chăm sóc tự động` (Automation & Connections)
  6. `AI Marketing` (AI Content & Video)
- **Mobile (< 768px):** Ẩn Sidebar, thay bằng **Bottom Navigation Bar** cố định dưới đáy màn hình với 4 tab chính (`Tổng quan`, `Lịch hẹn`, `Khách hàng`, `AI Marketing`) + nút `Menu mở rộng`.

### D. Chi tiết các màn hình chức năng
1. **Tổng quan (`/dashboard`):**
   - Hàng trên: 4 thẻ KPI lớn (Lịch hẹn hôm nay, Khách đang phục vụ, Tin nhắn tự động đã gửi, Doanh thu dự kiến hôm nay).
   - Hàng dưới: Danh sách "Lịch hẹn sắp diễn ra trong hôm nay" với nút thao tác nhanh `Check-in` / `Hoàn thành`.
2. **Quản lý Lịch hẹn (`/dashboard/appointments`):**
   - Thanh công cụ trên cùng: Bộ lọc ngày (Hôm nay, Ngày mai, Tuần này), Lọc theo nhân viên, Nút chuyển chế độ xem (`Danh sách` | `Lịch biểu`), và Nút CTA lớn `+ Tạo lịch hẹn`.
   - Modal/Drawer Tạo lịch hẹn: Mở dạng `Sheet` (trượt từ phải sang) trên Desktop và `Drawer` (trượt từ dưới lên) trên Mobile.
3. **Chi tiết Khách hàng (`/dashboard/customers/[id]`):**
   - Phần đầu: Thẻ thông tin cá nhân (Tên, SĐT có nút bấm gọi/mở Zalo nhanh, Địa chỉ, Ghi chú tình trạng da).
   - Phần thân: 3 Tabs: `Đang sử dụng (Liệu trình)`, `Lịch sử dịch vụ`, `Lịch hẹn sắp tới`.
4. **AI Marketing (`/dashboard/ai-studio`):**
   - Chia 2 cột: Cột trái là bảng điều khiển (Chọn dịch vụ, Chọn mục tiêu bài viết, Tải ảnh lên để làm video); Cột phải là khung xem trước (Preview) bài viết chuẩn SEO hoặc trình phát Video MP4 vừa tạo kèm nút `Sao chép văn bản` / `Tải video về máy`.

## 4. Quy chuẩn trạng thái UX bắt buộc
- **Loading Skeleton:** Mọi trang tải dữ liệu đều phải dùng `Skeleton` của Shadcn/UI mô phỏng đúng hình dáng Card/Table. Tuyệt đối không dùng màn hình trắng trơn hoặc spinner xoay giữa trang.
- **Empty State:** Khi chưa có dữ liệu (VD: Chưa có lịch hẹn hôm nay), hiển thị một khung viền nét đứt nhẹ nhàng, icon minh họa, câu thông báo thân thiện ("Hôm nay chưa có lịch hẹn nào") và nút hành động ngay bên dưới (`+ Tạo lịch hẹn đầu tiên`).
- **Error Boundary:** Bắt lỗi toàn cục ở cấp route (`error.tsx`), hiển thị thông báo tiếng Việt dễ hiểu ("Hệ thống đang gặp chút gián đoạn, vui lòng thử lại") kèm nút `Tải lại trang`.
- **Toast Notification:** Dùng thư viện `sonner` hiển thị góc trên bên phải cho mọi thao tác Thêm/Sửa/Xóa/Gửi tin (Màu xanh lá khi thành công, màu đỏ kèm lý do cụ thể khi thất bại).
