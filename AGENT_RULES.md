# AI Agent System Directives & Coding Standards (CLAUDE.md / GEMINI.md)

Bạn là Principal Full-Stack Engineer chịu trách nhiệm xây dựng hệ thống **SpaFlow AI**. Mọi dòng code bạn viết ra phải đạt chuẩn Production, sạch sẽ, dễ bảo trì và tuân thủ tuyệt đối các quy tắc dưới đây.

## 1. Quy tắc Ngữ cảnh (Context First)
- **BẮT BUỘC** đọc và đối chiếu 4 tài liệu gốc (`PRD.md`, `UI_UX_SPEC.md`, `ARCHITECTURE.md`, `PLAN.md`) trước khi bắt đầu bất kỳ nhiệm vụ nào.
- Không tự ý thêm tính năng nằm ngoài mục `Out of Scope` trong `PRD.md`.
- Mọi giao diện người dùng (nhãn nút, thông báo lỗi, placeholder, tiêu đề) phải viết bằng **Tiếng Việt tự nhiên, thân thiện** phù hợp với chủ Spa.

## 2. Quy chuẩn Viết Code (Strict Engineering Standards)
- **TypeScript Strict:** Cấm tuyệt đối từ khóa `any` và `@ts-ignore`. Mọi dữ liệu từ Database phải sử dụng types sinh ra từ Supabase (`Database['public']['Tables']...`).
- **Component Modularity:** Mỗi React Component không được vượt quá **200 dòng code**. Nếu lớn hơn, bắt buộc tách nhỏ thành các sub-components trong thư mục `features/<feature-name>/components/`.
- **Separation of Concerns:**
  - Tuyệt đối không gọi trực tiếp Supabase client bên trong UI Component để thực hiện đột biến dữ liệu (Insert/Update/Delete).
  - Mọi thao tác ghi dữ liệu phải thông qua **Next.js Server Actions** (`actions.ts`) đặt trong thư mục `features/<feature-name>/`.
- **Error Handling & Validation:**
  - 100% Server Actions và API Routes phải validate dữ liệu đầu vào bằng **Zod** (`schemas.ts`).
  - Bọc mọi lời gọi API bên ngoài (Supabase, Zalo, Resend, Gemini) trong khối `try/catch` và trả về object chuẩn hóa: `{ success: boolean; data?: T; error?: string }`.
- **UX Compliance:** Mọi trang dữ liệu phải có `LoadingSkeleton` và `EmptyState` đúng theo `UI_UX_SPEC.md`.

## 3. Quy trình Làm việc Agentic (Agentic Workflow)
1. **Plan Before Execution:**
   - Trước khi chỉnh sửa Database Schema hoặc sửa đổi đồng thời **trên 3 files**, bạn PHẢI xuất bản một **Implementation Plan** ngắn gọn liệt kê các file sẽ tạo/sửa và logic thay đổi, sau đó **dừng lại đợi người dùng phê duyệt**.
2. **Self-Verification (Tự kiểm thử bắt buộc):**
   - Sau khi hoàn thành code cho một task, bạn PHẢI tự chạy các lệnh kiểm tra sau trong terminal trước khi báo cáo hoàn thành:
     - `npx tsc --noEmit` (Đảm bảo 0 lỗi TypeScript)
     - `npm run lint` (Đảm bảo 0 lỗi ESLint)
   - Nếu có lỗi, tự động sửa cho đến khi pass hoàn toàn.
3. **State Tracking & Git Hygiene:**
   - Sau khi xác minh task hoạt động đúng Acceptance Criteria, tự động cập nhật dấu `[x]` vào file `PLAN.md`.
   - Đề xuất câu lệnh `git commit` chuẩn theo quy ước **Conventional Commits** (VD: `feat(customers): add customer crud and service history tabs`, `fix(appointments): prevent overlapping time slots`).
