-- =============================================
-- ÖĞRENCİ TAKİP SİSTEMİ VERİTABANI TASARIMI
-- =============================================

-- ----------------------------
-- 1. TABLOLARIN OLUŞTURULMASI
-- ----------------------------

-- Roller Tablosu
CREATE TABLE IF NOT EXISTS public.roles (
    id SERIAL PRIMARY KEY,
    role_name character varying(50) NOT NULL UNIQUE
);

-- Kullanıcılar (Base Table)
CREATE TABLE IF NOT EXISTS public.users (
    id SERIAL PRIMARY KEY,
    role_id integer REFERENCES public.roles(id),
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    email character varying(100) NOT NULL UNIQUE,
    password character varying(255) NOT NULL,
    tckn character(11) CHECK (length(tckn) = 11), -- Constraint: Veri bütünlüğü
    phone character varying(15),
    birth_date date,
    address text,
    avatar_url character varying(255),
    created_at timestamp without time zone DEFAULT now()
);

-- Mentorlar (Extension Table - 1:1 İlişki)
CREATE TABLE IF NOT EXISTS public.mentors (
    user_id integer PRIMARY KEY REFERENCES public.users(id),
    branch character varying(50),
    capacity integer DEFAULT 20
);

-- Öğrenciler (Extension Table - 1:1 İlişki)
CREATE TABLE IF NOT EXISTS public.students (
    user_id integer PRIMARY KEY REFERENCES public.users(id),
    mentor_id integer REFERENCES public.users(id),
    field character varying(20),
    target_university character varying(100),
    school_name character varying(150),
    grade_level integer,
    school_score numeric(5,2),
    success_score integer DEFAULT 0,
    risk_status character varying(20) DEFAULT 'Dengeli' 
        CHECK (risk_status IN ('Çok Riskli', 'Riskli', 'Dengeli', 'Yükselişte', 'Çok Yükselişte')) -- Constraint: Check
);

-- Görevler
CREATE TABLE IF NOT EXISTS public.tasks (
    id SERIAL PRIMARY KEY,
    student_id integer REFERENCES public.students(user_id),
    mentor_id integer REFERENCES public.mentors(user_id),
    title character varying(150) NOT NULL,
    description text,
    status character varying(20) DEFAULT 'Pending' 
        CHECK (status IN ('Pending', 'Completed', 'Cancelled', 'Overdue')),
    priority character varying(10) DEFAULT 'Orta',
    start_time timestamp without time zone,
    end_time timestamp without time zone,
    deadline timestamp without time zone,
    created_at timestamp without time zone DEFAULT now()
);

-- Sınavlar
CREATE TABLE IF NOT EXISTS public.exams (
    id SERIAL PRIMARY KEY,
    student_id integer REFERENCES public.students(user_id),
    exam_name character varying(100),
    exam_type character varying(10) CHECK (exam_type IN ('TYT', 'AYT')),
    exam_date date NOT NULL
);

-- Sınav Detayları (Cascade Delete Örneği)
CREATE TABLE IF NOT EXISTS public.exam_details (
    id SERIAL PRIMARY KEY,
    exam_id integer REFERENCES public.exams(id) ON DELETE CASCADE, -- Constraint: Bütünlük Stratejisi
    lesson_name character varying(50),
    correct_count integer DEFAULT 0,
    wrong_count integer DEFAULT 0,
    empty_count integer DEFAULT 0
);

-- Konu Analizleri
CREATE TABLE IF NOT EXISTS public.exam_topic_details (
    id SERIAL PRIMARY KEY,
    exam_detail_id integer REFERENCES public.exam_details(id) ON DELETE CASCADE,
    topic_name character varying(100),
    correct_count integer DEFAULT 0,
    wrong_count integer DEFAULT 0,
    empty_count integer DEFAULT 0
);

-- Görüşmeler
CREATE TABLE IF NOT EXISTS public.meetings (
    id SERIAL PRIMARY KEY,
    mentor_id integer REFERENCES public.mentors(user_id),
    meeting_date timestamp without time zone NOT NULL,
    title character varying(100),
    meeting_type character varying(50),
    notes text,
    meeting_link character varying(255)
);

-- Görüşme Katılımcıları (Çoka-Çok İlişki Çözümleme Tablosu)
CREATE TABLE IF NOT EXISTS public.meeting_participants (
    id SERIAL PRIMARY KEY,
    meeting_id integer REFERENCES public.meetings(id) ON DELETE CASCADE,
    student_id integer REFERENCES public.students(user_id) ON DELETE CASCADE,
    participation_status character varying(20) DEFAULT 'Bekleniyor',
    UNIQUE (meeting_id, student_id) -- Constraint: Unique
);

-- Bildirimler
CREATE TABLE IF NOT EXISTS public.notifications (
    id SERIAL PRIMARY KEY,
    sender_id integer REFERENCES public.users(id),
    receiver_id integer REFERENCES public.users(id),
    title character varying(100) NOT NULL,
    message text NOT NULL,
    is_read boolean DEFAULT false,
    notification_type character varying(20) 
        CHECK (notification_type IN ('Tümü', 'Akademik', 'Duyuru', 'Hatırlatma', 'Motivasyon', 'Mesaj', 'Ödev')),
    priority character varying(10) DEFAULT 'Normal',
    created_at timestamp without time zone DEFAULT now()
);

-- Günlük Aktiviteler (Zinciri kırmama özelliği için)
CREATE TABLE IF NOT EXISTS public.daily_activities (
    id SERIAL PRIMARY KEY,
    student_id integer REFERENCES public.students(user_id),
    activity_date date DEFAULT CURRENT_DATE,
    is_completed boolean DEFAULT true,
    notes character varying(255),
    UNIQUE (student_id, activity_date)
);

-- Kullanıcı Hareketleri (Loglama)
CREATE TABLE IF NOT EXISTS public.user_activities (
    id SERIAL PRIMARY KEY,
    user_id integer REFERENCES public.users(id),
    activity_type character varying(50),
    description text,
    created_at timestamp without time zone DEFAULT now()
);

-- ----------------------------
-- 2. SORGU PERFORMANSI İÇİN STRATEJİLER (INDEXLER)
-- ----------------------------

-- Foreign Key Indexleri (PostgreSQL otomatik indexlemez)
CREATE INDEX IF NOT EXISTS idx_users_role_id ON public.users(role_id);
CREATE INDEX IF NOT EXISTS idx_students_mentor_id ON public.students(mentor_id);
CREATE INDEX IF NOT EXISTS idx_tasks_student_id ON public.tasks(student_id);
CREATE INDEX IF NOT EXISTS idx_exams_student_id ON public.exams(student_id);
CREATE INDEX IF NOT EXISTS idx_notifications_receiver ON public.notifications(receiver_id);

-- Sık Sorgulanan Alanlar (Login ve Filtreleme)
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_tasks_status_deadline ON public.tasks(status, deadline); -- Composite Index
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(receiver_id) WHERE is_read = false; -- Partial Index

-- ----------------------------
-- 3. FONKSİYONLAR
-- ----------------------------

-- Öğrenci sınav ilerleme özeti fonksiyonu
CREATE OR REPLACE FUNCTION fn_get_student_exam_progress(p_student_id INTEGER, p_limit INTEGER DEFAULT 5)
RETURNS TABLE (
    exam_id INTEGER,
    exam_name VARCHAR(100),
    exam_type VARCHAR(10),
    exam_date DATE,
    total_correct INTEGER,
    total_wrong INTEGER,
    total_empty INTEGER,
    total_net NUMERIC(6,2),
    previous_net NUMERIC(6,2),
    net_change NUMERIC(6,2),
    trend VARCHAR(10)  -- 'up', 'down', 'stable'
) AS $$
BEGIN
    RETURN QUERY
    WITH exam_totals AS (
        SELECT 
            e.id,
            e.exam_name,
            e.exam_type,
            e.exam_date,
            SUM(d.correct_count)::INTEGER as total_correct,
            SUM(d.wrong_count)::INTEGER as total_wrong,
            SUM(d.empty_count)::INTEGER as total_empty,
            SUM(fn_calculate_net(d.correct_count, d.wrong_count)) as total_net,
            LAG(SUM(fn_calculate_net(d.correct_count, d.wrong_count))) OVER (ORDER BY e.exam_date) as previous_net
        FROM exams e
        LEFT JOIN exam_details d ON e.id = d.exam_id
        WHERE e.student_id = p_student_id
        GROUP BY e.id, e.exam_name, e.exam_type, e.exam_date
        ORDER BY e.exam_date DESC
        LIMIT p_limit
    )
    SELECT 
        et.id,
        et.exam_name,
        et.exam_type,
        et.exam_date,
        et.total_correct,
        et.total_wrong,
        et.total_empty,
        ROUND(et.total_net, 2),
        ROUND(et.previous_net, 2),
        ROUND(COALESCE(et.total_net - et.previous_net, 0), 2) as net_change,
        CASE 
            WHEN et.previous_net IS NULL THEN 'stable'
            WHEN et.total_net > et.previous_net + 2 THEN 'up'
            WHEN et.total_net < et.previous_net - 2 THEN 'down'
            ELSE 'stable'
        END::VARCHAR(10) as trend
    FROM exam_totals et
    ORDER BY et.exam_date DESC;
END;
$$ LANGUAGE plpgsql;

-- Net Hesaplama
CREATE OR REPLACE FUNCTION public.fn_calculate_net(correct integer, wrong integer) RETURNS numeric
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN COALESCE(correct, 0) - (COALESCE(wrong, 0)::NUMERIC / 4.0);
END;
$$;

-- Task Rate (Yardımcı Fonksiyon)
CREATE OR REPLACE FUNCTION public.fn_get_task_completion_rate(p_student_id integer) RETURNS numeric
    LANGUAGE plpgsql
    AS $$
DECLARE
    total_tasks INT;
    completed_tasks INT;
BEGIN
    SELECT COUNT(*), COUNT(*) FILTER (WHERE status = 'Completed')
    INTO total_tasks, completed_tasks
    FROM tasks
    WHERE student_id = p_student_id;
    IF total_tasks = 0 THEN RETURN 0; END IF;
    RETURN (completed_tasks::NUMERIC / total_tasks) * 100;
END;
$$;

-- Streak Score (Yardımcı Fonksiyon)
CREATE OR REPLACE FUNCTION public.fn_calculate_streak_score(p_student_id integer) RETURNS numeric
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_streak INT := 0;
    v_score NUMERIC;
BEGIN
    SELECT COUNT(*) INTO v_streak
    FROM daily_activities
    WHERE student_id = p_student_id
    AND activity_date > CURRENT_DATE - INTERVAL '30 days'
    AND is_completed = TRUE;
    
    IF v_streak > 20 THEN v_streak := 20; END IF;
    v_score := v_streak * 1.5;
    
    RETURN v_score;
END;
$$;

-- Exam Score (Yardımcı Fonksiyon)
CREATE OR REPLACE FUNCTION public.fn_calculate_exam_score(p_student_id integer) RETURNS numeric
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_last_net NUMERIC := 0;
    v_prev_net NUMERIC := 0;
    v_exam_count INT;
BEGIN
    SELECT COUNT(*) INTO v_exam_count FROM exams WHERE student_id = p_student_id;
    
    IF v_exam_count = 0 THEN RETURN 0;
    ELSIF v_exam_count = 1 THEN RETURN 15;
    END IF;

    SELECT COALESCE(SUM(fn_calculate_net(d.correct_count, d.wrong_count)), 0)
    INTO v_last_net
    FROM exams e
    JOIN exam_details d ON e.id = d.exam_id
    WHERE e.student_id = p_student_id
    AND e.exam_date = (SELECT MAX(exam_date) FROM exams WHERE student_id = p_student_id);

    SELECT COALESCE(SUM(fn_calculate_net(d.correct_count, d.wrong_count)), 0)
    INTO v_prev_net
    FROM exams e
    JOIN exam_details d ON e.id = d.exam_id
    WHERE e.student_id = p_student_id
    AND e.exam_date = (SELECT exam_date FROM exams WHERE student_id = p_student_id ORDER BY exam_date DESC LIMIT 1 OFFSET 1);
    
    IF v_last_net > v_prev_net THEN RETURN 30;
    ELSIF v_last_net >= v_prev_net - 2 THEN RETURN 20;
    ELSE RETURN 10;
    END IF;
END;
$$;

-- Ana Skorlama Fonksiyonu (Karmaşık Mantık)
CREATE OR REPLACE FUNCTION public.fn_calculate_student_score(p_student_id integer) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_task_rate NUMERIC;
    v_task_score NUMERIC;
    v_streak_score NUMERIC;
    v_exam_score NUMERIC;
    v_total_score INT;
BEGIN
    v_task_rate := fn_get_task_completion_rate(p_student_id);
    v_task_score := (v_task_rate / 100.0) * 40.0;
    v_streak_score := fn_calculate_streak_score(p_student_id);
    v_exam_score := fn_calculate_exam_score(p_student_id);
    
    v_total_score := ROUND(v_task_score + v_streak_score + v_exam_score);
    IF v_total_score > 100 THEN v_total_score := 100; END IF;
    
    RETURN v_total_score;
END;
$$;

-- ----------------------------
-- 4. STORED PROCEDURES
-- ----------------------------

-- Sınav Girişi Prosedürü
CREATE OR REPLACE PROCEDURE public.sp_create_exam_entry(IN p_student_id integer, IN p_exam_name character varying, IN p_exam_type character varying, IN p_exam_date date)
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO exams (student_id, exam_name, exam_type, exam_date)
    VALUES (p_student_id, p_exam_name, p_exam_type, p_exam_date);
END;
$$;

-- Gecikmiş Görevleri İşaretleme (Otomasyon/Job için)
CREATE OR REPLACE PROCEDURE public.sp_mark_overdue_tasks()
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE tasks
    SET status = 'Overdue'
    WHERE deadline < NOW() 
    AND status IN ('Pending');
    
    COMMIT;
END;
$$;

-- ----------------------------
-- 5. VIEW'LAR VE MASKELEME
-- ----------------------------

-- 1. Dashboard Özeti
CREATE OR REPLACE VIEW public.vw_dashboard_stats AS
 SELECT s.user_id AS student_id,
    u.first_name,
    u.last_name,
    (CASE
        WHEN (public.fn_calculate_student_score(s.user_id) >= 80) THEN 'Çok Yükselişte'
        WHEN (public.fn_calculate_student_score(s.user_id) >= 60) THEN 'Yükselişte'
        WHEN (public.fn_calculate_student_score(s.user_id) >= 40) THEN 'Dengeli'
        WHEN (public.fn_calculate_student_score(s.user_id) >= 20) THEN 'Riskli'
        ELSE 'Çok Riskli'
    END)::character varying(20) AS risk_status,
    public.fn_calculate_student_score(s.user_id) AS success_score,
    public.fn_get_task_completion_rate(s.user_id) AS task_success_rate
   FROM public.students s
   JOIN public.users u ON s.user_id = u.id;

-- 2. Öğrenci Profili
CREATE OR REPLACE VIEW public.vw_student_full_profile AS
 SELECT u.id,
    u.first_name || ' ' || u.last_name AS full_name,
    u.email,
    s.grade_level,
    s.school_name,
    s.target_university,
    mentor_u.first_name || ' ' || mentor_u.last_name AS mentor_name
   FROM public.users u
   JOIN public.students s ON u.id = s.user_id
   LEFT JOIN public.users mentor_u ON s.mentor_id = mentor_u.id
  WHERE u.role_id = 3;

-- 3. Sınav Net Analizi
CREATE OR REPLACE VIEW public.vw_exam_with_net_scores AS
 SELECT e.id AS exam_id,
    e.student_id,
    e.exam_name,
    d.lesson_name,
    public.fn_calculate_net(d.correct_count, d.wrong_count) AS lesson_net
   FROM public.exams e
   LEFT JOIN public.exam_details d ON e.id = d.exam_id;

-- 4. Katılımcılı Toplantı Listesi
CREATE OR REPLACE VIEW public.vw_meeting_with_participants AS
 SELECT m.id AS meeting_id,
    m.title,
    m.meeting_date,
    mentor_u.first_name AS mentor_name,
    count(mp.student_id) AS participant_count
   FROM public.meetings m
   LEFT JOIN public.users mentor_u ON m.mentor_id = mentor_u.id
   LEFT JOIN public.meeting_participants mp ON m.id = mp.meeting_id
  GROUP BY m.id, m.title, m.meeting_date, mentor_u.first_name;

-- 5. Bildirim Detayı
CREATE OR REPLACE VIEW public.vw_notification_full AS
 SELECT n.id,
    n.title,
    n.message,
    n.is_read,
    sender.first_name AS sender_name,
    receiver.first_name AS receiver_name
   FROM public.notifications n
   LEFT JOIN public.users sender ON n.sender_id = sender.id
   LEFT JOIN public.users receiver ON n.receiver_id = receiver.id;

-- 6. MASKELEME VIEW'I (Gizlilik ve Güvenlik için)
-- TCKN ve Telefon gibi verileri maskeler
CREATE OR REPLACE VIEW public.vw_users_masked_secure AS
SELECT 
    id,
    first_name,
    last_name,
    role_id,
    -- Email maskeleme: ilk 3 karakter açık, kalanı ****
    CONCAT(LEFT(email, 3), '****@****.com') as masked_email,
    -- TCKN maskeleme: son 2 hane açık
    CONCAT('*********', RIGHT(tckn, 2)) as masked_tckn,
    -- Telefon maskeleme
    CONCAT(LEFT(phone, 3), '******', RIGHT(phone, 2)) as masked_phone
FROM public.users;

-- ----------------------------
-- 6. YETKİLENDİRME (AUTHORIZATION)
-- ----------------------------

-- Not: Bu komutlar genelde veritabanı yöneticisi (postgres) tarafından çalıştırılır.
-- Uygulama kullanıcısı ve Raporlama kullanıcısı oluşturuyoruz.

DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'app_admin_role') THEN
        CREATE ROLE app_admin_role WITH LOGIN PASSWORD 'SecurePass123!';
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'readonly_reporter_role') THEN
        CREATE ROLE readonly_reporter_role WITH LOGIN PASSWORD 'ReportPass123!';
    END IF;
END
$$;

-- Admin Rolüne Tam Yetki (Tablolar ve Sequence'ler için)
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO app_admin_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_admin_role;

-- Raporcu Rolüne Sadece Okuma Yetkisi (Viewlar dahil)
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_reporter_role;
-- Raporcu hassas veriyi görmesin, sadece maskeli view'ı görsün
REVOKE SELECT ON public.users FROM readonly_reporter_role;
GRANT SELECT ON public.vw_users_masked_secure TO readonly_reporter_role;