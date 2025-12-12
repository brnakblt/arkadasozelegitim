-- ============================================================
-- ÖZEL EĞİTİM KURUMU ERP SİSTEMİ - VERİTABANI ŞEMASI
-- PostgreSQL + PostGIS
-- Oluşturulma Tarihi: 2024-12-12
-- ============================================================

-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============================================================
-- IDENTITY & ACCESS MANAGEMENT
-- ============================================================

-- Users Table (extends Strapi's users)
CREATE TABLE IF NOT EXISTS erp_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    strapi_user_id INTEGER UNIQUE,  -- Link to Strapi's users table
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Roles Table
CREATE TABLE IF NOT EXISTS erp_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100),
    description TEXT,
    is_system BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Permissions Table
CREATE TABLE IF NOT EXISTS erp_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action VARCHAR(100) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    conditions JSONB,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_permissions_action_subject 
ON erp_permissions(action, subject);

-- User-Roles Junction
CREATE TABLE IF NOT EXISTS erp_user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES erp_users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES erp_roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    assigned_by UUID REFERENCES erp_users(id),
    UNIQUE(user_id, role_id)
);

-- Role-Permissions Junction
CREATE TABLE IF NOT EXISTS erp_role_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id UUID NOT NULL REFERENCES erp_roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES erp_permissions(id) ON DELETE CASCADE,
    UNIQUE(role_id, permission_id)
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user ON erp_user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON erp_user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON erp_role_permissions(role_id);

-- ============================================================
-- USER PROFILES
-- ============================================================

-- Student Profiles
CREATE TABLE IF NOT EXISTS erp_student_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES erp_users(id) ON DELETE CASCADE,
    student_number VARCHAR(50) UNIQUE,
    date_of_birth DATE,
    gender VARCHAR(20),
    blood_type VARCHAR(5),
    disability_type VARCHAR(100),
    disability_level VARCHAR(50),
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    parent_guardian_id UUID REFERENCES erp_users(id),
    enrollment_date DATE,
    graduation_date DATE,
    classroom VARCHAR(50),
    notes TEXT,
    face_encoding BYTEA,
    face_encoding_updated_at TIMESTAMPTZ,
    face_photo_url VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teacher Profiles
CREATE TABLE IF NOT EXISTS erp_teacher_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES erp_users(id) ON DELETE CASCADE,
    employee_number VARCHAR(50) UNIQUE,
    specialization VARCHAR(100),
    certification TEXT[],
    hire_date DATE,
    department VARCHAR(100),
    office_location VARCHAR(100),
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- NEXTCLOUD INTEGRATION
-- ============================================================

CREATE TABLE IF NOT EXISTS erp_nextcloud_sync (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES erp_users(id) ON DELETE CASCADE,
    nextcloud_user_id VARCHAR(100) NOT NULL,
    nextcloud_display_name VARCHAR(255),
    home_folder_path VARCHAR(500),
    quota_used BIGINT DEFAULT 0,
    quota_total BIGINT,
    sync_status VARCHAR(20) DEFAULT 'active',
    last_sync_at TIMESTAMPTZ,
    last_error TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_nextcloud_sync_nc_user ON erp_nextcloud_sync(nextcloud_user_id);

-- ============================================================
-- SCHEDULING SYSTEM
-- ============================================================

CREATE TABLE IF NOT EXISTS erp_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    schedule_type VARCHAR(50) NOT NULL,
    location VARCHAR(200),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    recurrence_rule VARCHAR(500),
    is_all_day BOOLEAN DEFAULT false,
    created_by UUID REFERENCES erp_users(id),
    color VARCHAR(20),
    status VARCHAR(20) DEFAULT 'scheduled',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS erp_schedule_attendees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    schedule_id UUID NOT NULL REFERENCES erp_schedules(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES erp_users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'attendee',
    response_status VARCHAR(20) DEFAULT 'pending',
    UNIQUE(schedule_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_schedules_time ON erp_schedules(start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_schedules_type ON erp_schedules(schedule_type);

-- ============================================================
-- GPS TRACKING (Service Bus)
-- ============================================================

CREATE TABLE IF NOT EXISTS erp_service_routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    driver_id UUID REFERENCES erp_users(id),
    assistant_id UUID REFERENCES erp_users(id),
    vehicle_plate VARCHAR(20),
    capacity INTEGER,
    is_active BOOLEAN DEFAULT true,
    route_path GEOMETRY(LINESTRING, 4326),
    estimated_duration_minutes INTEGER,
    morning_departure_time TIME,
    afternoon_departure_time TIME,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS erp_route_stops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID NOT NULL REFERENCES erp_service_routes(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    location GEOMETRY(POINT, 4326) NOT NULL,
    address TEXT,
    stop_order INTEGER NOT NULL,
    estimated_arrival_offset_minutes INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_route_stops_route ON erp_route_stops(route_id);
CREATE INDEX IF NOT EXISTS idx_route_stops_location ON erp_route_stops USING GIST(location);

CREATE TABLE IF NOT EXISTS erp_student_route_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES erp_users(id) ON DELETE CASCADE,
    route_id UUID NOT NULL REFERENCES erp_service_routes(id) ON DELETE CASCADE,
    pickup_stop_id UUID REFERENCES erp_route_stops(id),
    dropoff_stop_id UUID REFERENCES erp_route_stops(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, route_id)
);

CREATE TABLE IF NOT EXISTS erp_location_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES erp_users(id) ON DELETE CASCADE,
    route_id UUID REFERENCES erp_service_routes(id),
    location GEOMETRY(POINT, 4326) NOT NULL,
    accuracy_meters DECIMAL(10, 2),
    speed_kmh DECIMAL(10, 2),
    heading DECIMAL(5, 2),
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    source VARCHAR(20) DEFAULT 'gps'
);

CREATE INDEX IF NOT EXISTS idx_location_logs_recorded ON erp_location_logs(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_location_logs_user ON erp_location_logs(user_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_location_logs_geo ON erp_location_logs USING GIST(location);

-- ============================================================
-- ATTENDANCE & FACE RECOGNITION
-- ============================================================

CREATE TABLE IF NOT EXISTS erp_attendance_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES erp_users(id) ON DELETE CASCADE,
    event_type VARCHAR(20) NOT NULL,
    method VARCHAR(30) NOT NULL,
    confidence_score DECIMAL(5, 4),
    location VARCHAR(100),
    photo_url VARCHAR(500),
    device_id VARCHAR(100),
    verified_by UUID REFERENCES erp_users(id),
    notes TEXT,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attendance_user_date ON erp_attendance_logs(user_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_attendance_type_date ON erp_attendance_logs(event_type, recorded_at DESC);

CREATE TABLE IF NOT EXISTS erp_face_training_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES erp_users(id) ON DELETE CASCADE,
    training_images_count INTEGER,
    model_version VARCHAR(50),
    accuracy_score DECIMAL(5, 4),
    trained_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    trained_by UUID REFERENCES erp_users(id)
);

-- ============================================================
-- SEEDING: Default Roles & Permissions
-- ============================================================

INSERT INTO erp_roles (name, display_name, description, is_system) VALUES
    ('super_admin', 'Süper Yönetici', 'Tam yetki - Tüm sistem erişimi', true),
    ('admin', 'Yönetici', 'Sistem yönetimi yetkisi', true),
    ('teacher', 'Öğretmen', 'Öğretmen rolü', true),
    ('therapist', 'Terapist', 'Terapist/Uzman rolü', true),
    ('parent', 'Veli', 'Veli erişim yetkisi', true),
    ('driver', 'Servis Şoförü', 'Servis şoförü yetkisi', true),
    ('student', 'Öğrenci', 'Öğrenci (kısıtlı erişim)', true)
ON CONFLICT (name) DO NOTHING;

INSERT INTO erp_permissions (action, subject, description) VALUES
    ('manage', 'all', 'Tam yetki'),
    ('read', 'users', 'Kullanıcıları görüntüleme'),
    ('write', 'users', 'Kullanıcı oluşturma/güncelleme'),
    ('delete', 'users', 'Kullanıcı silme'),
    ('read', 'students', 'Öğrenci bilgilerini görüntüleme'),
    ('write', 'students', 'Öğrenci bilgilerini düzenleme'),
    ('read', 'teachers', 'Öğretmen bilgilerini görüntüleme'),
    ('write', 'teachers', 'Öğretmen bilgilerini düzenleme'),
    ('read', 'schedules', 'Programları görüntüleme'),
    ('write', 'schedules', 'Program oluşturma/düzenleme'),
    ('read', 'attendance', 'Yoklama kayıtlarını görüntüleme'),
    ('write', 'attendance', 'Yoklama kaydı oluşturma'),
    ('read', 'locations', 'Konum bilgilerini görüntüleme'),
    ('manage', 'routes', 'Servis güzergahlarını yönetme'),
    ('read', 'files', 'Dosyaları görüntüleme'),
    ('write', 'files', 'Dosya yükleme/düzenleme'),
    ('read', 'reports', 'Raporları görüntüleme'),
    ('manage', 'nextcloud', 'Nextcloud entegrasyonu yönetimi')
ON CONFLICT ON CONSTRAINT idx_permissions_action_subject DO NOTHING;

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE OR REPLACE TRIGGER update_erp_users_updated_at
    BEFORE UPDATE ON erp_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_erp_roles_updated_at
    BEFORE UPDATE ON erp_roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_erp_student_profiles_updated_at
    BEFORE UPDATE ON erp_student_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_erp_teacher_profiles_updated_at
    BEFORE UPDATE ON erp_teacher_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_erp_nextcloud_sync_updated_at
    BEFORE UPDATE ON erp_nextcloud_sync FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_erp_schedules_updated_at
    BEFORE UPDATE ON erp_schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_erp_service_routes_updated_at
    BEFORE UPDATE ON erp_service_routes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- VIEWS
-- ============================================================

CREATE OR REPLACE VIEW v_users_with_roles AS
SELECT 
    u.id, u.email, u.first_name, u.last_name, u.is_active,
    array_agg(r.name) as roles,
    array_agg(r.display_name) as role_display_names
FROM erp_users u
LEFT JOIN erp_user_roles ur ON u.id = ur.user_id
LEFT JOIN erp_roles r ON ur.role_id = r.id
GROUP BY u.id, u.email, u.first_name, u.last_name, u.is_active;

CREATE OR REPLACE VIEW v_today_attendance AS
SELECT 
    u.id as user_id, u.first_name, u.last_name,
    al.event_type, al.method, al.recorded_at, al.confidence_score
FROM erp_attendance_logs al
JOIN erp_users u ON al.user_id = u.id
WHERE DATE(al.recorded_at) = CURRENT_DATE
ORDER BY al.recorded_at DESC;

-- Table comments
COMMENT ON TABLE erp_users IS 'Sistem kullanıcıları';
COMMENT ON TABLE erp_roles IS 'Kullanıcı rolleri (RBAC)';
COMMENT ON TABLE erp_permissions IS 'Sistem izinleri';
COMMENT ON TABLE erp_student_profiles IS 'Öğrenci profil bilgileri';
COMMENT ON TABLE erp_teacher_profiles IS 'Öğretmen profil bilgileri';
COMMENT ON TABLE erp_nextcloud_sync IS 'Nextcloud kullanıcı eşleştirme';
COMMENT ON TABLE erp_schedules IS 'Ders, terapi, toplantı programları';
COMMENT ON TABLE erp_service_routes IS 'Servis güzergahları';
COMMENT ON TABLE erp_attendance_logs IS 'Yoklama kayıtları';
