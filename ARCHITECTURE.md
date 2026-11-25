# System Architecture & Database Design - SpaFlow AI

## 1. Tech Stack chuẩn
- **Framework:** Next.js 15 (App Router, Server Actions, Route Handlers)
- **Language:** TypeScript 5.x (Strict Mode)
- **Styling & UI:** Tailwind CSS v3.4+, Shadcn/UI, Lucide React, Sonner (Toast)
- **Database & Auth:** Supabase (PostgreSQL 15+, Supabase Auth, Supabase Storage cho ảnh/video)
- **ORM / Query Builder:** Supabase JS Client (`@supabase/ssr`) kết hợp TypeScript generated types từ DB Schema.
- **Validation:** Zod + React Hook Form
- **AI & Automation Services:**
  - LLM & Content: Google Gemini 2.5 Flash API (`@google/genai`)
  - Text-to-Speech (TTS): Google Cloud TTS hoặc OpenAI TTS API
  - Video Rendering: FFmpeg.wasm (chạy phía client để ghép ảnh + audio + text thành MP4, không tốn tài nguyên server)
  - Email Service: Resend SDK
  - Zalo ZNS: Zalo OA Open API v3
  - Background Cron: Vercel Cron Jobs (`/api/cron/reminders`)

## 2. Cấu trúc thư mục dự án (Feature-Based Architecture)
```text
src/
├── app/                          # Next.js App Router (Routing & Pages)
│   ├── (auth)/                   # Nhóm route đăng nhập, đăng ký
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/              # Nhóm route ứng dụng chính (yêu cầu Auth)
│   │   ├── layout.tsx            # App Shell (Sidebar + Mobile Nav)
│   │   ├── dashboard/page.tsx    # Trang tổng quan
│   │   ├── appointments/page.tsx # Quản lý lịch hẹn
│   │   ├── customers/            # Quản lý khách hàng
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx     # Chi tiết & lịch sử dịch vụ khách
│   │   ├── services/page.tsx     # Quản lý dịch vụ & nhân viên
│   │   ├── automation/page.tsx   # Kết nối Zalo/Email & Lịch chăm sóc
│   │   └── ai-studio/page.tsx    # AI viết bài SEO & dựng video
│   ├── api/                      # API Routes & Webhooks
│   │   ├── cron/reminders/route.ts # Cron job quét gửi tin nhắn tự động
│   │   ├── ai/generate-post/route.ts
│   │   └── ai/generate-tts/route.ts
│   ├── layout.tsx                # Root Layout (Fonts, Toaster)
│   └── page.tsx                  # Landing Page
├── components/                   # Shared UI Components
│   ├── ui/                       # Shadcn/UI primitives (button, input, card...)
│   ├── layout/                   # Sidebar, MobileNav, Header
│   └── shared/                   # EmptyState, LoadingSkeleton, ConfirmDialog
├── features/                     # Business Logic & UI theo từng tính năng
│   ├── auth/
│   ├── customers/
│   │   ├── components/           # CustomerForm, CustomerTable, ServiceHistoryTabs
│   │   ├── actions.ts            # Server Actions (CRUD customer)
│   │   ├── schemas.ts            # Zod validation schemas
│   │   └── types.ts
│   ├── services/
│   ├── staff/
│   ├── appointments/
│   ├── automation/
│   └── ai-studio/
├── lib/                          # Core Utilities & External Clients
│   ├── supabase/
│   │   ├── client.ts             # Browser Supabase client
│   │   ├── server.ts             # Server Supabase client
│   │   └── middleware.ts         # Session refresh & route protection
│   ├── integrations/
│   │   ├── zalo.ts               # Zalo OA ZNS API wrapper
│   │   ├── email.ts              # Resend Email wrapper
│   │   └── gemini.ts             # Gemini AI wrapper
│   ├── crypto.ts                 # Mã hóa/giải mã API Keys lưu trong DB
│   └── utils.ts                  # Format tiền tệ VNĐ, ngày giờ Việt Nam
└── types/
    └── database.types.ts         # Supabase auto-generated types
```

## 3. Thiết kế Database Schema (PostgreSQL / Supabase)

### Bảng 1: `spas` (Thông tin cơ sở Spa - Multi-tenant root)
- `id`: `uuid` (PK, default: `gen_random_uuid()`)
- `owner_id`: `uuid` (FK -> `auth.users.id`, Unique, Not Null)
- `name`: `text` (Not Null) - Tên Spa
- `phone`: `text` (Not Null) - SĐT hotline Spa
- `address`: `text` (Nullable)
- `created_at`: `timestamptz` (default: `now()`)

### Bảng 2: `staff` (Nhân viên / Kỹ thuật viên)
- `id`: `uuid` (PK, default: `gen_random_uuid()`)
- `spa_id`: `uuid` (FK -> `spas.id` ON DELETE CASCADE, Not Null)
- `full_name`: `text` (Not Null)
- `phone`: `text` (Nullable)
- `role`: `text` (Not Null, default: `'technician'`) - Enum: `'manager' | 'technician' | 'receptionist'`
- `is_active`: `boolean` (default: `true`)
- `created_at`: `timestamptz` (default: `now()`)
- *Index:* `idx_staff_spa_id` trên `(spa_id)`

### Bảng 3: `customers` (Khách hàng)
- `id`: `uuid` (PK, default: `gen_random_uuid()`)
- `spa_id`: `uuid` (FK -> `spas.id` ON DELETE CASCADE, Not Null)
- `full_name`: `text` (Not Null)
- `phone`: `text` (Not Null)
- `zalo_phone`: `text` (Nullable) - SĐT dùng Zalo (nếu khác SĐT chính)
- `email`: `text` (Nullable)
- `address`: `text` (Nullable)
- `notes`: `text` (Nullable) - Ghi chú tình trạng da, dị ứng
- `is_deleted`: `boolean` (default: `false`) - Soft delete
- `created_at`: `timestamptz` (default: `now()`)
- *Index:* `idx_customers_spa_phone` trên `(spa_id, phone)`

### Bảng 4: `services` (Danh mục dịch vụ Spa)
- `id`: `uuid` (PK, default: `gen_random_uuid()`)
- `spa_id`: `uuid` (FK -> `spas.id` ON DELETE CASCADE, Not Null)
- `name`: `text` (Not Null)
- `category`: `text` (Not Null, default: `'Chăm sóc da'`)
- `price`: `numeric(12,0)` (Not Null, default: `0`)
- `duration_minutes`: `integer` (Not Null, default: `60`)
- `description`: `text` (Nullable)
- `is_active`: `boolean` (default: `true`)
- `created_at`: `timestamptz` (default: `now()`)
- *Index:* `idx_services_spa_id` trên `(spa_id)`

### Bảng 5: `appointments` (Lịch hẹn & Lịch sử sử dụng dịch vụ)
- `id`: `uuid` (PK, default: `gen_random_uuid()`)
- `spa_id`: `uuid` (FK -> `spas.id` ON DELETE CASCADE, Not Null)
- `customer_id`: `uuid` (FK -> `customers.id` ON DELETE RESTRICT, Not Null)
- `staff_id`: `uuid` (FK -> `staff.id` ON DELETE SET NULL, Nullable)
- `appointment_date`: `date` (Not Null)
- `start_time`: `time` (Not Null)
- `end_time`: `time` (Not Null)
- `status`: `text` (Not Null, default: `'confirmed'`) - Enum: `'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'`
- `total_price`: `numeric(12,0)` (Not Null, default: `0`)
- `notes`: `text` (Nullable)
- `created_at`: `timestamptz` (default: `now()`)
- *Index:* `idx_appointments_spa_date` trên `(spa_id, appointment_date)`

### Bảng 6: `appointment_services` (Bảng trung gian N-N giữa Lịch hẹn & Dịch vụ)
- `id`: `uuid` (PK, default: `gen_random_uuid()`)
- `appointment_id`: `uuid` (FK -> `appointments.id` ON DELETE CASCADE, Not Null)
- `service_id`: `uuid` (FK -> `services.id` ON DELETE RESTRICT, Not Null)
- `price_at_booking`: `numeric(12,0)` (Not Null) - Lưu giá tại thời điểm đặt để tránh sai lệch khi đổi bảng giá

### Bảng 7: `platform_connections` (Kết nối Zalo, Email, Social Media)
- `id`: `uuid` (PK, default: `gen_random_uuid()`)
- `spa_id`: `uuid` (FK -> `spas.id` ON DELETE CASCADE, Not Null)
- `platform`: `text` (Not Null) - Enum: `'zalo_oa' | 'email' | 'facebook' | 'tiktok' | 'youtube' | 'website'`
- `is_connected`: `boolean` (default: `false`)
- `credentials_encrypted`: `text` (Nullable) - JSON chứa Token/API Key đã mã hóa AES-256
- `profile_url`: `text` (Nullable) - Link trang mạng xã hội/website của Spa
- `updated_at`: `timestamptz` (default: `now()`)
- *Unique Constraint:* `(spa_id, platform)`

### Bảng 8: `automation_rules` (Cấu hình kịch bản gửi tin tự động)
- `id`: `uuid` (PK, default: `gen_random_uuid()`)
- `spa_id`: `uuid` (FK -> `spas.id` ON DELETE CASCADE, Not Null)
- `trigger_type`: `text` (Not Null) - Enum: `'before_24h' | 'before_2h' | 'after_completed_24h'`
- `channel`: `text` (Not Null) - Enum: `'zalo' | 'email' | 'both'`
- `template_content`: `text` (Not Null)
- `is_active`: `boolean` (default: `true`)

### Bảng 9: `message_logs` (Lịch sử gửi tin nhắn tự động)
- `id`: `uuid` (PK, default: `gen_random_uuid()`)
- `spa_id`: `uuid` (FK -> `spas.id` ON DELETE CASCADE, Not Null)
- `appointment_id`: `uuid` (FK -> `appointments.id` ON DELETE CASCADE, Not Null)
- `customer_id`: `uuid` (FK -> `customers.id` ON DELETE CASCADE, Not Null)
- `rule_id`: `uuid` (FK -> `automation_rules.id` ON DELETE SET NULL, Nullable)
- `channel`: `text` (Not Null) - `'zalo' | 'email'`
- `status`: `text` (Not Null) - `'sent' | 'failed'`
- `error_message`: `text` (Nullable)
- `sent_at`: `timestamptz` (default: `now()`)
- *Unique Constraint:* `(appointment_id, rule_id, channel)` để chống gửi trùng lặp tin nhắn.

### Bảng 10: `ai_contents` (Lưu trữ bài viết SEO & kịch bản AI đã tạo)
- `id`: `uuid` (PK, default: `gen_random_uuid()`)
- `spa_id`: `uuid` (FK -> `spas.id` ON DELETE CASCADE, Not Null)
- `service_id`: `uuid` (FK -> `services.id` ON DELETE SET NULL, Nullable)
- `platform`: `text` (Not Null) - `'facebook' | 'zalo' | 'tiktok' | 'youtube' | 'website'`
- `title`: `text` (Not Null)
- `content`: `text` (Not Null)
- `video_script`: `text` (Nullable)
- `created_at`: `timestamptz` (default: `now()`)

## 4. Kiến trúc Bảo mật & Phân quyền
- **Row Level Security (RLS):** Bật RLS trên **100% các bảng**.
  - Policy chuẩn cho mọi bảng có cột `spa_id`:
    ```sql
    CREATE POLICY "Users can only access their own spa data" ON <table_name>
    FOR ALL USING (
      spa_id IN (SELECT id FROM spas WHERE owner_id = auth.uid())
    );
    ```
- **Bảo vệ Secret Keys:** Mọi Token của Zalo OA, Resend API Key của khách hàng khi lưu vào bảng `platform_connections` bắt buộc phải được mã hóa bằng thuật toán `AES-256-GCM` thông qua biến môi trường `ENCRYPTION_SECRET_KEY` ở phía Server. Tuyệt đối không trả `credentials_encrypted` về Client.
- **Bảo vệ Cron Endpoint:** Route `/api/cron/reminders` bắt buộc kiểm tra header `Authorization: Bearer <CRON_SECRET>` để ngăn chặn người lạ kích hoạt spam tin nhắn.
- **Validation:** Toàn bộ đầu vào của Server Actions và API Routes phải đi qua `schema.safeParse(data)` của Zod trước khi chạm vào Database.
