# Product Requirements Document (PRD) - SpaFlow AI

## 1. Tóm tắt bài toán & Mục tiêu kinh doanh
- **Bài toán:** Các chủ Spa quy mô nhỏ (2-10 nhân viên) tại Việt Nam thường quản lý lịch hẹn bằng sổ tay, Excel hoặc tin nhắn Zalo rời rạc. Điều này dẫn đến tình trạng quên lịch khách, khách quên giờ hẹn (tỷ lệ No-show cao), bỏ sót chăm sóc sau liệu trình và tốn quá nhiều thời gian để tự viết bài quảng cáo trên mạng xã hội.
- **Giải pháp:** **SpaFlow AI** — Nền tảng Web App All-in-One siêu đơn giản, trực quan giúp chủ Spa quản lý khách hàng, dịch vụ, lịch hẹn, tự động gửi tin nhắn nhắc lịch/chăm sóc qua Zalo ZNS & Email, đồng thời tích hợp AI tự động tạo nội dung SEO và kịch bản video marketing.
- **Mục tiêu kinh doanh (MVP 1.0):**
  - Giảm 70% tỷ lệ khách quên lịch (No-show) thông qua nhắc lịch tự động.
  - Tiết kiệm 80% thời gian quản lý sổ sách và sáng tạo nội dung quảng cáo cho chủ Spa.
  - Đạt trải nghiệm người dùng "1-Click" phù hợp với người không rành công nghệ.

## 2. Chân dung người dùng (User Personas)
1. **Chị Lan (Chủ Spa - Admin):**
   - **Độ tuổi:** 28 - 45 tuổi. Quản lý 5 kỹ thuật viên.
   - **Đặc điểm:** Không rành công nghệ, thao tác chủ yếu trên điện thoại hoặc iPad tại quầy lễ tân. Thích giao diện chữ to, rõ ràng, ít nút bấm phức tạp.
   - **Nhu cầu:** Xem nhanh hôm nay có bao nhiêu khách, ai làm dịch vụ gì, tự động nhắn tin nhắc khách trước giờ hẹn và có sẵn bài viết hay để đăng Facebook/Zalo hút khách.
2. **Bạn Mai (Lễ tân / Kỹ thuật viên - Staff):**
   - **Độ tuổi:** 20 - 28 tuổi.
   - **Đặc điểm:** Nhanh nhẹn nhưng hay bận tay khi đang làm liệu trình cho khách.
   - **Nhu cầu:** Tạo nhanh lịch hẹn khi khách gọi điện/nhắn tin, cập nhật trạng thái dịch vụ khách đã làm.

## 3. Sơ đồ luồng người dùng (User Flow)
1. **Khởi tạo & Đăng nhập:**
   - Truy cập Landing Page -> Bấm "Dùng thử miễn phí" -> Đăng ký bằng Email/Mật khẩu -> Nhập tên Spa & Số điện thoại -> Vào thẳng Dashboard.
2. **Thiết lập ban đầu (Onboarding 3 bước):**
   - Bước 1: Thêm danh sách dịch vụ của Spa (Tên, Giá, Thời lượng).
   - Bước 2: Thêm danh sách nhân viên (Tên, Chức vụ).
   - Bước 3: Kết nối Zalo OA / Email để bật tính năng nhắc lịch tự động.
3. **Luồng vận hành hàng ngày (Core Loop):**
   - Khách đặt lịch -> Chủ Spa/Lễ tân bấm nút `+ Tạo lịch hẹn` -> Chọn khách hàng (hoặc tạo mới ngay trong modal) -> Chọn dịch vụ -> Chọn nhân viên -> Chọn ngày giờ -> Lưu.
   - Hệ thống tự động lên lịch nhắc hẹn (trước 24h và trước 2h) -> Đến giờ, Cron Job tự động gửi tin nhắn Zalo/Email cho khách.
   - Khách đến Spa -> Nhân viên chuyển trạng thái lịch hẹn từ `Đã đặt` -> `Đang phục vụ` -> `Hoàn thành`.
   - Sau khi `Hoàn thành` 24h -> Hệ thống tự động gửi tin nhắn hỏi thăm & xin đánh giá.
4. **Luồng AI Marketing:**
   - Chủ Spa vào mục `AI Content & Video` -> Chọn dịch vụ muốn quảng cáo (VD: Trị mụn chuẩn Y khoa) -> Chọn nền tảng (Facebook, TikTok, Zalo) -> Bấm `Tạo nội dung` -> AI trả về bài viết chuẩn SEO + Kịch bản video + Video slideshow tự động -> Bấm `Sao chép` hoặc `Tải Video`.

## 4. Danh sách tính năng MVP & Acceptance Criteria

### Module 1: Quản lý Khách hàng (CRM)
- **User Story:** Là chủ Spa, tôi muốn lưu trữ thông tin khách hàng và xem lịch sử dịch vụ của họ để tư vấn chính xác.
- **Acceptance Criteria:**
  - [ ] Có thể Thêm, Sửa, Xóa (soft-delete) khách hàng với các trường: Họ tên (bắt buộc), Số điện thoại (bắt buộc, validate chuẩn SĐT VN), Số Zalo, Email (tùy chọn), Địa chỉ, Ghi chú tình trạng da/sức khỏe.
  - [ ] Tìm kiếm khách hàng tức thì theo Tên hoặc Số điện thoại (< 300ms).
  - [ ] Trang chi tiết khách hàng hiển thị 3 tab rõ ràng: `Dịch vụ đã sử dụng`, `Đang sử dụng (Liệu trình)`, và `Lịch hẹn sắp tới`.

### Module 2: Quản lý Dịch vụ Spa
- **User Story:** Là chủ Spa, tôi muốn quản lý bảng giá và thông tin dịch vụ để dễ dàng tư vấn và lên lịch.
- **Acceptance Criteria:**
  - [ ] CRUD dịch vụ gồm: Tên dịch vụ, Danh mục (Chăm sóc da, Body, Triệt lông, Phun xăm...), Giá tiền (VNĐ), Thời lượng thực hiện (phút), Mô tả liệu trình.
  - [ ] Có nút gạt `Đang kinh doanh / Tạm ngưng` để ẩn các dịch vụ không còn cung cấp khi đặt lịch.

### Module 3: Quản lý Lịch hẹn & Nhân viên
- **User Story:** Là lễ tân, tôi muốn xem lịch hẹn theo ngày/tuần và phân công nhân viên để tránh trùng lịch.
- **Acceptance Criteria:**
  - [ ] CRUD nhân viên (Họ tên, Số điện thoại, Vai trò: Quản lý / Kỹ thuật viên, Trạng thái làm việc).
  - [ ] Giao diện Lịch hẹn hỗ trợ 2 chế độ xem: `Danh sách hôm nay` (mặc định cho dễ nhìn) và `Lịch biểu (Calendar)`.
  - [ ] Form đặt lịch cho phép chọn: Khách hàng (có thể tạo nhanh khách mới), Nhiều dịch vụ cùng lúc, Nhân viên phụ trách, Ngày & Giờ bắt đầu (tự tính giờ kết thúc dựa trên thời lượng dịch vụ).
  - [ ] Cập nhật trạng thái lịch hẹn 1 chạm: `Chờ xác nhận`, `Đã xác nhận`, `Đang làm`, `Hoàn thành`, `Đã hủy`.

### Module 4: Kết nối Nền tảng & Chăm sóc Khách hàng Tự động
- **User Story:** Là chủ Spa, tôi muốn hệ thống tự động nhắn tin nhắc lịch và hỏi thăm khách qua Zalo/Email để không phải nhớ thủ công.
- **Acceptance Criteria:**
  - [ ] Trang `Cài đặt Kết nối` cho phép nhập cấu hình API cho: Zalo OA (App ID, Secret Key, Refresh Token), Email (SMTP/Resend API Key), và lưu trữ Link/Token của Facebook Page, TikTok, YouTube, Website.
  - [ ] Có nút `Gửi tin nhắn test` để kiểm tra kết nối thành công ngay lập tức.
  - [ ] Cấu hình kịch bản tự động (Automation Rules):
    - Nhắc lịch trước 24 tiếng.
    - Nhắc lịch trước 2 tiếng.
    - Chăm sóc/Hỏi thăm sau khi hoàn thành dịch vụ 1 ngày.
  - [ ] Mẫu tin nhắn hỗ trợ biến động: `{{ten_khach}}`, `{{ten_spa}}`, `{{dich_vu}}`, `{{ngay_hen}}`, `{{gio_hen}}`.
  - [ ] Hiển thị bảng `Lịch sử gửi tin` (Thành công / Thất bại / Lý do lỗi).

### Module 5: AI Sáng tạo Nội dung & Video Marketing
- **User Story:** Là chủ Spa không biết viết content, tôi muốn AI tự viết bài chuẩn SEO và tạo video ngắn từ thông tin dịch vụ của Spa.
- **Acceptance Criteria:**
  - [ ] Chọn dịch vụ có sẵn trong Spa + Nhập từ khóa/khuyến mãi + Chọn nền tảng đích (Facebook, Zalo OA, Website SEO, Kịch bản TikTok/YouTube Shorts).
  - [ ] AI sinh ra bài viết hoàn chỉnh có tiêu đề hấp dẫn, icon phù hợp ngành Spa, hashtag và lời kêu gọi hành động (CTA).
  - [ ] Tính năng tạo Video ngắn (Slideshow Video): Người dùng tải lên 3-5 ảnh thực tế tại Spa -> AI tự viết lời bình (Voiceover script) -> Tạo file audio giọng đọc tiếng Việt -> Xuất ra video MP4 có chèn chữ (subtitles) và nhạc nền nhẹ nhàng để tải về đăng TikTok/Reels.

## 5. Out of Scope (Ngoài phạm vi MVP 1.0 - CẤM LÀM)
- **KHÔNG** làm hệ thống quản lý kho mỹ phẩm, định lượng nguyên vật liệu tiêu hao.
- **KHÔNG** tích hợp cổng thanh toán trực tuyến (VNPay, Momo, Stripe) hay xuất hóa đơn đỏ điện tử.
- **KHÔNG** làm tính năng tính lương, hoa hồng phức tạp cho nhân viên.
- **KHÔNG** tích hợp đăng bài tự động trực tiếp lên TikTok/YouTube qua API (do quy trình duyệt App của TikTok/Google quá phức tạp cho MVP; chỉ dừng ở mức tạo nội dung/video và cho phép Copy/Download 1 chạm).
- **KHÔNG** làm Mobile App Native (iOS/Android); chỉ làm Responsive Web App (PWA).
