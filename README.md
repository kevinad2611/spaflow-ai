# SpaFlow AI

Nền tảng Web App All-in-One giúp chủ Spa quy mô nhỏ (2–10 nhân viên) quản lý khách hàng, dịch vụ, lịch hẹn, tự động gửi tin nhắn nhắc lịch/chăm sóc qua Zalo ZNS & Email, đồng thời tích hợp AI sáng tạo bài viết SEO và dựng video marketing ngắn.

## Công nghệ sử dụng

- **Frontend & Backend:** Next.js 15 (App Router, Server Actions, Route Handlers), TypeScript Strict Mode
- **UI & Styling:** Tailwind CSS v3.4+, Shadcn/UI, Lucide Icons, Sonner Toast
- **Database & Auth:** Supabase (PostgreSQL 15+ với Row Level Security)
- **Validation:** Zod + React Hook Form
- **AI & Automation:** Google Gemini 2.5 Flash (`@google/genai`), Google Cloud TTS, FFmpeg.wasm (`@ffmpeg/ffmpeg`), Resend Email, Zalo OA v3, Vercel Cron Jobs

---

## 1. Cài đặt môi trường Local

### Bước 1: Cài đặt dependencies
```bash
npm install
```

### Bước 2: Tạo file `.env.local`
Sao chép `.env.example` thành `.env.local` và điền các biến môi trường:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase (Project Settings -> Data API / API Keys)
NEXT_PUBLIC_SUPABASE_URL=https://<project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<supabase-service-role-key>

# Khóa mã hóa AES-256-GCM (chuỗi 64 ký tự hex) dùng mã hóa Token/API Key lưu DB
ENCRYPTION_SECRET_KEY=<64-char-hex-secret>

# Bí mật bảo vệ route /api/cron/reminders
CRON_SECRET=<strong-random-cron-secret>

# AI Marketing & Giọng đọc tiếng Việt
GEMINI_API_KEY=<google-gemini-api-key>
GOOGLE_TTS_API_KEY=<google-cloud-tts-api-key>

# Email mặc định (tùy chọn)
RESEND_API_KEY=<resend-api-key>
```

> **Lưu ý:** Có thể tạo nhanh khóa 64 ký tự hex bằng lệnh:
> `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### Bước 3: Khởi tạo Database trên Supabase
1. Mở **SQL Editor** trong Supabase Dashboard.
2. Chạy toàn bộ nội dung file `supabase/migrations/001_initial_schema.sql` để tạo 10 bảng dữ liệu, Indexes và kích hoạt Row Level Security (RLS).
3. Trong **Authentication -> Sign In / Providers -> Email**, cấu hình xác nhận email theo nhu cầu (có thể tắt *Confirm email* khi thử nghiệm để đăng ký xong vào thẳng Dashboard).

### Bước 4: Chạy ứng dụng
```bash
npm run dev
```
Truy cập `http://localhost:3000`.

---

## 2. Hướng dẫn kết nối Zalo OA, Email & AI cho chủ Spa

1. **Zalo OA / ZNS:** Vào mục **Chăm sóc tự động** -> **Cài đặt Kết nối**, nhập `App ID`, `Secret Key`, `Refresh Token` từ cổng Zalo Developers và `Template ID` ZNS đã duyệt, sau đó bấm **Lưu kết nối Zalo OA** và **Gửi test** để kiểm tra ngay.
2. **Email (Resend):** Tạo API Key tại `resend.com`, nhập vào thẻ **Email (Resend)** trong mục **Cài đặt Kết nối** và bấm **Gửi test**.
3. **Kịch bản tự động:** Bật/tắt và tùy chỉnh nội dung 3 mốc gửi tin (`Trước 24h`, `Trước 2h`, `Sau hoàn thành 24h`) với các biến động `{{ten_khach}}`, `{{ten_spa}}`, `{{dich_vu}}`, `{{ngay_hen}}`, `{{gio_hen}}`.
4. **AI Marketing Studio:** Cần cấu hình `GEMINI_API_KEY` để sinh bài SEO/kịch bản video và `GOOGLE_TTS_API_KEY` (đã bật Cloud Text-to-Speech API) để tạo giọng đọc tiếng Việt ghép vào video MP4.

---

## 3. Triển khai Production lên Vercel

1. Push mã nguồn lên GitHub và import dự án vào **Vercel**.
2. Khai báo đầy đủ toàn bộ biến môi trường từ `.env.example` trong **Project Settings -> Environment Variables** (đặc biệt `CRON_SECRET`, `ENCRYPTION_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).
3. File `vercel.json` đã cấu hình sẵn Vercel Cron Job tự động gọi `GET /api/cron/reminders` mỗi **15 phút** (`*/15 * * * *`) kèm header `Authorization: Bearer <CRON_SECRET>`.
