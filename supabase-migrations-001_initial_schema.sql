-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Bảng SPAS (Multi-tenant root)
CREATE TABLE public.spas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Bảng STAFF (Nhân viên / Kỹ thuật viên)
CREATE TABLE public.staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    spa_id UUID NOT NULL REFERENCES public.spas(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'technician' CHECK (role IN ('manager', 'technician', 'receptionist')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_staff_spa_id ON public.staff(spa_id);

-- 3. Bảng CUSTOMERS (Khách hàng)
CREATE TABLE public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    spa_id UUID NOT NULL REFERENCES public.spas(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    zalo_phone TEXT,
    email TEXT,
    address TEXT,
    notes TEXT,
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_customers_spa_phone ON public.customers(spa_id, phone);

-- 4. Bảng SERVICES (Dịch vụ Spa)
CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    spa_id UUID NOT NULL REFERENCES public.spas(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Chăm sóc da',
    price NUMERIC(12, 0) NOT NULL DEFAULT 0,
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_services_spa_id ON public.services(spa_id);

-- 5. Bảng APPOINTMENTS (Lịch hẹn)
CREATE TABLE public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    spa_id UUID NOT NULL REFERENCES public.spas(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
    staff_id UUID REFERENCES public.staff(id) ON DELETE SET NULL,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    total_price NUMERIC(12, 0) NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_appointments_spa_date ON public.appointments(spa_id, appointment_date);

-- 6. Bảng APPOINTMENT_SERVICES (Chi tiết dịch vụ trong lịch hẹn)
CREATE TABLE public.appointment_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
    price_at_booking NUMERIC(12, 0) NOT NULL
);

-- 7. Bảng PLATFORM_CONNECTIONS (Kết nối Zalo, Email, Mạng xã hội)
CREATE TABLE public.platform_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    spa_id UUID NOT NULL REFERENCES public.spas(id) ON DELETE CASCADE,
    platform TEXT NOT NULL CHECK (platform IN ('zalo_oa', 'email', 'facebook', 'tiktok', 'youtube', 'website')),
    is_connected BOOLEAN NOT NULL DEFAULT false,
    credentials_encrypted TEXT,
    profile_url TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(spa_id, platform)
);

-- 8. Bảng AUTOMATION_RULES (Kịch bản nhắc lịch & chăm sóc tự động)
CREATE TABLE public.automation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    spa_id UUID NOT NULL REFERENCES public.spas(id) ON DELETE CASCADE,
    trigger_type TEXT NOT NULL CHECK (trigger_type IN ('before_24h', 'before_2h', 'after_completed_24h')),
    channel TEXT NOT NULL DEFAULT 'zalo' CHECK (channel IN ('zalo', 'email', 'both')),
    template_content TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    UNIQUE(spa_id, trigger_type)
);

-- 9. Bảng MESSAGE_LOGS (Lịch sử gửi tin nhắn)
CREATE TABLE public.message_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    spa_id UUID NOT NULL REFERENCES public.spas(id) ON DELETE CASCADE,
    appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    rule_id UUID REFERENCES public.automation_rules(id) ON DELETE SET NULL,
    channel TEXT NOT NULL CHECK (channel IN ('zalo', 'email')),
    status TEXT NOT NULL CHECK (status IN ('sent', 'failed')),
    error_message TEXT,
    sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(appointment_id, rule_id, channel)
);

-- 10. Bảng AI_CONTENTS (Nội dung & kịch bản AI đã tạo)
CREATE TABLE public.ai_contents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    spa_id UUID NOT NULL REFERENCES public.spas(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    platform TEXT NOT NULL CHECK (platform IN ('facebook', 'zalo', 'tiktok', 'youtube', 'website')),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    video_script TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================
ALTER TABLE public.spas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_contents ENABLE ROW LEVEL SECURITY;

-- Policy cho bảng spas
CREATE POLICY "Owner can manage own spa" ON public.spas
    FOR ALL USING (owner_id = auth.uid());

-- Policy chuẩn cho các bảng có spa_id
CREATE POLICY "Spa owner access staff" ON public.staff
    FOR ALL USING (spa_id IN (SELECT id FROM public.spas WHERE owner_id = auth.uid()));

CREATE POLICY "Spa owner access customers" ON public.customers
    FOR ALL USING (spa_id IN (SELECT id FROM public.spas WHERE owner_id = auth.uid()));

CREATE POLICY "Spa owner access services" ON public.services
    FOR ALL USING (spa_id IN (SELECT id FROM public.spas WHERE owner_id = auth.uid()));

CREATE POLICY "Spa owner access appointments" ON public.appointments
    FOR ALL USING (spa_id IN (SELECT id FROM public.spas WHERE owner_id = auth.uid()));

CREATE POLICY "Spa owner access appointment_services" ON public.appointment_services
    FOR ALL USING (
        appointment_id IN (
            SELECT id FROM public.appointments 
            WHERE spa_id IN (SELECT id FROM public.spas WHERE owner_id = auth.uid())
        )
    );

CREATE POLICY "Spa owner access platform_connections" ON public.platform_connections
    FOR ALL USING (spa_id IN (SELECT id FROM public.spas WHERE owner_id = auth.uid()));

CREATE POLICY "Spa owner access automation_rules" ON public.automation_rules
    FOR ALL USING (spa_id IN (SELECT id FROM public.spas WHERE owner_id = auth.uid()));

CREATE POLICY "Spa owner access message_logs" ON public.message_logs
    FOR ALL USING (spa_id IN (SELECT id FROM public.spas WHERE owner_id = auth.uid()));

CREATE POLICY "Spa owner access ai_contents" ON public.ai_contents
    FOR ALL USING (spa_id IN (SELECT id FROM public.spas WHERE owner_id = auth.uid()));
