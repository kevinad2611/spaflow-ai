# Iterative Implementation Roadmap - SpaFlow AI

> **Hướng dẫn cho AI Agent:** Thực hiện tuần tự từng Phase. Hoàn thành toàn bộ checkbox trong một sub-task, chạy `tsc --noEmit` & `npm run lint` sạch lỗi trước khi chuyển sang task tiếp theo.

---

## Phase 1: Setup & Infrastructure (Khởi tạo nền tảng)
- [x] **1.1 Khởi tạo dự án Next.js & Cấu hình Strict:**
  - Khởi tạo Next.js 15 (App Router, TypeScript, Tailwind CSS, ESLint).
  - Bật `"strict": true` và `"noUncheckedIndexedAccess": true` trong `tsconfig.json`.
  - Cài đặt các thư viện cốt lõi: `lucide-react`, `zod`, `react-hook-form`, `@hookform/resolvers`, `sonner`, `date-fns`.
- [x] **1.2 Cài đặt Design System (Shadcn/UI & Tokens):**
  - Khởi tạo Shadcn/UI và cài đặt các component cơ bản: `button`, `input`, `label`, `card`, `dialog`, `sheet`, `table`, `tabs`, `badge`, `select`, `textarea`, `switch`, `skeleton`, `avatar`, `dropdown-menu`.
  - Cấu hình bảng màu (`#0D9488` Primary, `#F8FAFC` Background...) và font chữ `Plus Jakarta Sans` + `Inter` trong `globals.css` và `layout.tsx` theo `UI_UX_SPEC.md`.
- [x] **1.3 Cấu trúc thư mục & Shared UI Components:**
  - Tạo cây thư mục chuẩn Feature-based (`src/features/*`, `src/lib/*`, `src/components/shared/*`).
  - Xây dựng 3 component dùng chung: `EmptyState.tsx`, `LoadingSkeleton.tsx`, `ConfirmDialog.tsx`.

---

## Phase 2: Database & Authentication (Cơ sở dữ liệu & Xác thực)
- [ ] **2.1 Thiết lập Supabase Client & Environment:**
  - Cài đặt `@supabase/supabase-js` và `@supabase/ssr`.
  - Cấu hình `src/lib/supabase/client.ts`, `server.ts`, và `middleware.ts` để bảo vệ các route `/dashboard/*`.
  - Tạo file `.env.example` đầy đủ các biến môi trường cần thiết.
- [ ] **2.2 Khởi tạo Database Schema & RLS Policies:**
  - Viết file migration SQL (`supabase/migrations/001_initial_schema.sql`) tạo đầy đủ 10 bảng (`spas`, `staff`, `customers`, `services`, `appointments`, `appointment_services`, `platform_connections`, `automation_rules`, `message_logs`, `ai_contents`) kèm Indexes và Foreign Keys theo `ARCHITECTURE.md`.
  - Viết và kích hoạt Row Level Security (RLS) cho tất cả 10 bảng.
  - Sinh file `src/types/database.types.ts`.
- [ ] **2.3 Xây dựng Luồng Đăng ký & Đăng nhập (`/login`, `/register`):**
  - Tạo Zod schema và Server Actions cho Đăng nhập, Đăng ký (tự động tạo record trong bảng `spas` và 3 mẫu `automation_rules` mặc định ngay khi user đăng ký thành công), và Đăng xuất.
  - Xây dựng giao diện `/login` và `/register` chuẩn responsive.

---

## Phase 3: Core UI Layout & Landing Page (Khung giao diện chính)
- [ ] **3.1 Xây dựng App Shell (`/dashboard/layout.tsx`):**
  - Xây dựng `Sidebar.tsx` cho Desktop (6 mục menu chính + thông tin Spa hiện tại + nút Đăng xuất).
  - Xây dựng `MobileNav.tsx` (Bottom Navigation Bar) cho màn hình điện thoại `< 768px`.
- [ ] **3.2 Xây dựng Landing Page (`/page.tsx`):**
  - Thiết kế Hero Section, 3 khối tính năng nổi bật, và nút điều hướng thông minh (nếu đã đăng nhập thì hiện nút `Vào trang quản lý`).

---

## Phase 4: Core Features Implementation (Phát triển từng Module nghiệp vụ)

### Module 4A: Quản lý Dịch vụ & Nhân viên (`/dashboard/services`)
- [ ] **4A.1 CRUD Dịch vụ Spa:**
  - Tạo Zod schema, Server Actions (`getServices`, `createService`, `updateService`, `toggleServiceStatus`).
  - Xây dựng UI danh sách dịch vụ (dạng Bảng trên Desktop, Card trên Mobile) + Drawer Thêm/Sửa dịch vụ + Nút gạt trạng thái kinh doanh.
- [ ] **4A.2 CRUD Nhân viên / Kỹ thuật viên:**
  - Tạo Zod schema, Server Actions (`getStaff`, `createStaff`, `updateStaff`, `toggleStaffStatus`).
  - Xây dựng Tab `Nhân viên` ngay trong trang `/dashboard/services` để chủ Spa quản lý đội ngũ dễ dàng.

### Module 4B: Quản lý Khách hàng (`/dashboard/customers`)
- [ ] **4B.1 Danh sách & Tìm kiếm Khách hàng:**
  - Tạo Zod schema (validate SĐT Việt Nam), Server Actions (`getCustomers`, `createCustomer`, `updateCustomer`, `softDeleteCustomer`).
  - Xây dựng UI danh sách khách hàng với thanh tìm kiếm theo Tên/SĐT tức thì + Drawer Thêm/Sửa khách hàng.
- [ ] **4B.2 Trang Chi tiết Khách hàng & Lịch sử Dịch vụ (`/dashboard/customers/[id]`):**
  - Query dữ liệu khách hàng kèm toàn bộ lịch hẹn và dịch vụ đã/đang/sẽ sử dụng.
  - Xây dựng giao diện 3 Tabs (`Đang sử dụng`, `Đã sử dụng`, `Lịch hẹn sắp tới`) và nút gọi điện / mở Zalo nhanh.

### Module 4C: Quản lý Lịch hẹn & Tổng quan (`/dashboard/appointments` & `/dashboard`)
- [ ] **4C.1 CRUD Lịch hẹn & Phân công nhân viên:**
  - Tạo Server Actions (`getAppointments`, `createAppointment`, `updateAppointmentStatus`). Hỗ trợ chọn nhiều dịch vụ trong 1 lịch hẹn và tự động tính tổng tiền + giờ kết thúc.
  - Xây dựng Drawer `Tạo lịch hẹn` (tích hợp tính năng tạo nhanh khách hàng mới ngay trong form nếu khách lần đầu đến).
- [ ] **4C.2 Giao diện Lịch hẹn & Trang Tổng quan (Dashboard):**
  - Xây dựng trang `/dashboard/appointments` với bộ lọc Ngày, Nhân viên, 2 chế độ xem (`Danh sách` & `Lịch biểu`), và nút đổi trạng thái 1 chạm (`Đã xác nhận` -> `Đang làm` -> `Hoàn thành`).
  - Hoàn thiện trang `/dashboard` với 4 thẻ KPI thực tế và danh sách lịch hẹn hôm nay.

### Module 4D: Kết nối Nền tảng & Chăm sóc Tự động (`/dashboard/automation`)
- [ ] **4D.1 Quản lý Kết nối Nền tảng (Zalo, Email, Social Links):**
  - Tạo tiện ích mã hóa/giải mã AES-256 (`src/lib/crypto.ts`).
  - Xây dựng UI nhập cấu hình Zalo OA, Email (Resend/SMTP), và lưu link Facebook/TikTok/YouTube/Website.
  - Tích hợp nút `Gửi tin nhắn test` cho Zalo và Email.
- [ ] **4D.2 Cấu hình Kịch bản Chăm sóc & Cron Job Tự động:**
  - Xây dựng UI bật/tắt và chỉnh sửa nội dung mẫu tin nhắn cho 3 mốc thời gian (`Trước 24h`, `Trước 2h`, `Sau hoàn thành 24h`) với các biến động (`{{ten_khach}}`, `{{gio_hen}}`...).
  - Xây dựng API Route `/api/cron/reminders` quét lịch hẹn và gửi tin nhắn tự động qua Zalo ZNS / Resend Email, ghi log vào bảng `message_logs` (chống gửi trùng).
  - Hiển thị bảng `Lịch sử gửi tin nhắn` trên UI.

### Module 4E: AI Viết bài SEO & Dựng Video Marketing (`/dashboard/ai-studio`)
- [ ] **4E.1 AI Viết bài chuẩn SEO & Kịch bản Video:**
  - Xây dựng API Route `/api/ai/generate-post` kết nối Google Gemini API với System Prompt chuyên sâu ngành Spa/Thẩm mỹ.
  - Xây dựng UI chọn dịch vụ có sẵn của Spa, chọn nền tảng (Facebook, Zalo, Website SEO, TikTok/YouTube), sinh nội dung, lưu vào bảng `ai_contents` và nút `Sao chép 1 chạm`.
- [ ] **4E.2 AI Dựng Video Ngắn Tự động (Slideshow + Voiceover):**
  - Xây dựng API Route `/api/ai/generate-tts` tạo file âm thanh giọng đọc tiếng Việt từ kịch bản AI.
  - Tích hợp `@ffmpeg/ffmpeg` phía client để ghép 3-5 ảnh Spa tải lên + file giọng đọc TTS thành file video `.mp4` hoàn chỉnh kèm nút `Tải video về máy`.

---

## Phase 5: QA, Security Audit & Polish (Kiểm thử & Tối ưu)
- [ ] **5.1 Kiểm tra Bảo mật & Phân quyền (Security Audit):**
  - Rà soát lại toàn bộ RLS policies trên Supabase để đảm bảo Spa A không bao giờ đọc/sửa được dữ liệu của Spa B.
  - Kiểm tra mã hóa API Keys và bảo vệ route `/api/cron/reminders`.
- [ ] **5.2 Kiểm thử Responsive & UX Edge Cases:**
  - Kiểm tra hiển thị toàn bộ ứng dụng trên khung nhìn Mobile (`375px`), Tablet (`768px`), và Desktop (`1440px`).
  - Đảm bảo 100% màn hình có `LoadingSkeleton`, `EmptyState`, và `ErrorBoundary` hoạt động mượt mà.

---

## Phase 6: Deployment & Documentation (Triển khai)
- [ ] **6.1 Chuẩn bị Production & Tài liệu hướng dẫn:**
  - Chạy `npm run build` đảm bảo quá trình build production thành công 0 lỗi, 0 warning nghiêm trọng.
  - Cấu hình file `vercel.json` để kích hoạt Vercel Cron Job chạy mỗi 15 phút cho `/api/cron/reminders`.
  - Cập nhật `README.md` với hướng dẫn cài đặt biến môi trường và cách kết nối Zalo OA / Resend cho chủ Spa.
