-- =========================================================
-- PROJE: YKS Mentorluk Öğrenci Paneli (YKS-MÖP)
-- SÜRÜM: V5 (Final - Full Puan Versiyonu)
-- GÜNCELLEME: Eksik View'ler, SP'ler ve Yetkilendirmeler Eklendi
-- =========================================================

-- 1. TEMİZLİK (Eski tabloları ve objeleri kaldır)
DROP PROCEDURE IF EXISTS sp_mark_overdue_tasks;
DROP PROCEDURE IF EXISTS sp_create_exam_entry;
DROP VIEW IF EXISTS vw_dashboard_stats;
DROP VIEW IF EXISTS vw_safe_user_list;
DROP VIEW IF EXISTS vw_mentor_student_list;
DROP VIEW IF EXISTS vw_upcoming_tasks; -- YENİ
DROP VIEW IF EXISTS vw_exam_performance_summary; -- YENİ
DROP FUNCTION IF EXISTS fn_calculate_net;
DROP FUNCTION IF EXISTS fn_get_task_completion_rate;
DROP TABLE IF EXISTS meeting_participants CASCADE;
DROP TABLE IF EXISTS user_activities CASCADE;
DROP TABLE IF EXISTS daily_activities CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS exam_topic_details CASCADE;
DROP TABLE IF EXISTS exam_details CASCADE;
DROP TABLE IF EXISTS exams CASCADE;
DROP TABLE IF EXISTS meetings CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS mentors CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- 2. TABLO OLUŞTURMA

-- Roller
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

-- Kullanıcılar
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    role_id INT REFERENCES roles(id),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    tckn CHAR(11),
    phone VARCHAR(15),
    birth_date DATE,
    address TEXT,
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);
ALTER TABLE users ADD CONSTRAINT chk_tckn_length CHECK (LENGTH(tckn) = 11);

-- Öğrenciler
CREATE TABLE students (
    user_id INT PRIMARY KEY REFERENCES users(id),
    mentor_id INT REFERENCES users(id),
    field VARCHAR(20),
    target_university VARCHAR(100),
    school_name VARCHAR(150),
    grade_level INT,
    school_score NUMERIC(5,2), -- OBP
    success_score INT DEFAULT 0,
    risk_status VARCHAR(20) DEFAULT 'Dengeli' 
);
ALTER TABLE students ADD CONSTRAINT chk_risk_status 
CHECK (risk_status IN ('Çok Riskli', 'Riskli', 'Dengeli', 'Yükselişte', 'Çok Yükselişte'));

-- Mentorlar
CREATE TABLE mentors (
    user_id INT PRIMARY KEY REFERENCES users(id),
    branch VARCHAR(50),
    capacity INT DEFAULT 20
);

-- Görevler
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(user_id),
    mentor_id INT REFERENCES mentors(user_id),
    title VARCHAR(150) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'Pending',
    priority VARCHAR(10) DEFAULT 'Orta',
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    deadline TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
ALTER TABLE tasks ADD CONSTRAINT chk_task_status CHECK (status IN ('Pending', 'Completed', 'Cancelled', 'Overdue'));

-- Toplantılar
CREATE TABLE meetings (
    id SERIAL PRIMARY KEY,
    mentor_id INT REFERENCES mentors(user_id),
    meeting_date TIMESTAMP NOT NULL,
    title VARCHAR(100),
    meeting_type VARCHAR(50),
    notes TEXT,
    meeting_link VARCHAR(255)
);

-- Toplantı Katılımcıları
CREATE TABLE meeting_participants (
    id SERIAL PRIMARY KEY,
    meeting_id INT REFERENCES meetings(id) ON DELETE CASCADE,
    student_id INT REFERENCES students(user_id) ON DELETE CASCADE,
    participation_status VARCHAR(20) DEFAULT 'Bekleniyor',
    UNIQUE(meeting_id, student_id)
);

-- Sınavlar
CREATE TABLE exams (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(user_id),
    exam_name VARCHAR(100),
    exam_type VARCHAR(10) CHECK (exam_type IN ('TYT', 'AYT')),
    exam_date DATE NOT NULL
);

-- Sınav Ders Detayları
CREATE TABLE exam_details (
    id SERIAL PRIMARY KEY,
    exam_id INT REFERENCES exams(id) ON DELETE CASCADE,
    lesson_name VARCHAR(50),
    correct_count INT DEFAULT 0,
    wrong_count INT DEFAULT 0,
    empty_count INT DEFAULT 0
);

-- Sınav Konu Detayları
CREATE TABLE exam_topic_details (
    id SERIAL PRIMARY KEY,
    exam_detail_id INT REFERENCES exam_details(id) ON DELETE CASCADE,
    topic_name VARCHAR(100),
    correct_count INT DEFAULT 0,
    wrong_count INT DEFAULT 0,
    empty_count INT DEFAULT 0
);


-- Bildirimler
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    sender_id INT REFERENCES users(id),
    receiver_id INT REFERENCES users(id),
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    notification_type VARCHAR(20),
    priority VARCHAR(10) DEFAULT 'Normal',
    created_at TIMESTAMP DEFAULT NOW()
);
ALTER TABLE notifications ADD CONSTRAINT chk_notif_type 
CHECK (notification_type IN ('Tümü', 'Akademik', 'Duyuru', 'Hatırlatma', 'Motivasyon', 'Mesaj', 'Ödev'));

-- Günlük Aktivite / Zinciri Kırma
CREATE TABLE daily_activities (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(user_id),
    activity_date DATE DEFAULT CURRENT_DATE,
    is_completed BOOLEAN DEFAULT TRUE,
    notes VARCHAR(255),
    UNIQUE(student_id, activity_date)
);

-- Aktivite Akışı (Loglar)
CREATE TABLE user_activities (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    activity_type VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- İndeksler (Sorgu Performansı Kriteri)
CREATE INDEX idx_tasks_student_id ON tasks(student_id);
CREATE INDEX idx_exams_date ON exams(exam_date);
CREATE INDEX idx_notifications_receiver ON notifications(receiver_id);
CREATE INDEX idx_meetings_mentor ON meetings(mentor_id);


-- 3. FONKSİYONLAR (Gereksinim: En az 2 adet)
CREATE OR REPLACE FUNCTION fn_calculate_net(correct INT, wrong INT) 
RETURNS NUMERIC AS $$
BEGIN
    RETURN COALESCE(correct, 0) - (COALESCE(wrong, 0)::NUMERIC / 4.0);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fn_get_task_completion_rate(p_student_id INT)
RETURNS NUMERIC AS $$
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
$$ LANGUAGE plpgsql;

-- Öğrenci görev istatistiklerini tek seferde hesaplayan fonksiyon
CREATE OR REPLACE FUNCTION fn_get_student_task_summary(p_student_id INTEGER)
RETURNS TABLE (
    completed_count INTEGER,
    incomplete_count INTEGER,
    overdue_count INTEGER,
    pending_count INTEGER,
    last_30_days_activity INTEGER,
    completion_rate NUMERIC(5,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) FILTER (WHERE status = 'Completed')::INTEGER as completed_count,
        COUNT(*) FILTER (WHERE status IN ('Pending', 'Overdue', 'Cancelled'))::INTEGER as incomplete_count,
        COUNT(*) FILTER (WHERE status = 'Overdue')::INTEGER as overdue_count,
        COUNT(*) FILTER (WHERE status = 'Pending')::INTEGER as pending_count,
        COUNT(DISTINCT deadline::DATE) FILTER (
            WHERE status = 'Completed' 
            AND deadline > (CURRENT_DATE - INTERVAL '30 days')
        )::INTEGER as last_30_days_activity,
        CASE 
            WHEN COUNT(*) > 0 THEN 
                ROUND((COUNT(*) FILTER (WHERE status = 'Completed')::NUMERIC / COUNT(*)) * 100, 2)
            ELSE 0 
        END as completion_rate
    FROM tasks
    WHERE student_id = p_student_id;
END;
$$ LANGUAGE plpgsql;

-- 4. STORED PROCEDURES (YENİ EKLENDİ - Gereksinim: En az 2 adet)

-- Procedure 1: Tarihi geçmiş ödevleri otomatik güncelleme
CREATE OR REPLACE PROCEDURE sp_mark_overdue_tasks()
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

-- Procedure 2: Hızlı sınav kaydı oluşturma
CREATE OR REPLACE PROCEDURE sp_create_exam_entry(
    p_student_id INT,
    p_exam_name VARCHAR,
    p_exam_type VARCHAR,
    p_exam_date DATE
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO exams (student_id, exam_name, exam_type, exam_date)
    VALUES (p_student_id, p_exam_name, p_exam_type, p_exam_date);
END;
$$;


-- 5. VIEWLER (TOPLAM 5 ADET - 3 Eski + 2 Yeni)

-- View 1: Dashboard İstatistikleri
CREATE OR REPLACE VIEW vw_dashboard_stats AS
SELECT 
    s.user_id as student_id,
    u.first_name,
    u.last_name,
    s.risk_status,
    s.success_score,
    fn_get_task_completion_rate(s.user_id) as task_success_rate,
    (SELECT COUNT(*) FROM meeting_participants WHERE student_id = s.user_id AND participation_status = 'Katıldı') as attended_meetings,
    (SELECT COUNT(*) FROM notifications WHERE receiver_id = s.user_id AND is_read = FALSE) as unread_notifications
FROM students s
JOIN users u ON s.user_id = u.id;

-- View 2: Maskelenmiş Güvenli Kullanıcı Listesi (Maskeleme Kriteri)
CREATE OR REPLACE VIEW vw_safe_user_list AS
SELECT 
    u.id, u.first_name, u.last_name, u.email, r.role_name,
    CONCAT(LEFT(tckn, 2), '*******', RIGHT(tckn, 2)) as masked_tckn
FROM users u JOIN roles r ON u.role_id = r.id;

-- View 3: Mentor-Öğrenci Listesi
CREATE OR REPLACE VIEW vw_mentor_student_list AS
SELECT 
    m_u.first_name || ' ' || m_u.last_name AS mentor_name,
    s_u.first_name || ' ' || s_u.last_name AS student_name,
    s.field AS student_field,
    s.school_name,
    s.grade_level,
    s.risk_status,
    s.success_score
FROM students s
JOIN users s_u ON s.user_id = s_u.id
JOIN users m_u ON s.mentor_id = m_u.id;

-- View 4 (YENİ): Yaklaşan Görevler Listesi
CREATE OR REPLACE VIEW vw_upcoming_tasks AS
SELECT 
    t.title,
    t.deadline,
    t.priority,
    s_user.first_name || ' ' || s_user.last_name as student_name
FROM tasks t
JOIN users s_user ON t.student_id = s_user.id
WHERE t.status = 'Pending' AND t.deadline > NOW();

-- View 5 (YENİ): Sınav Performans Özeti (Fonksiyon kullanımı içerir)
CREATE OR REPLACE VIEW vw_exam_performance_summary AS
SELECT 
    u.first_name,
    u.last_name,
    e.exam_type,
    COUNT(e.id) as total_exams,
    AVG(fn_calculate_net(d.correct_count, d.wrong_count)) as avg_net
FROM exams e
JOIN users u ON e.student_id = u.id
JOIN exam_details d ON e.id = d.exam_id
GROUP BY u.first_name, u.last_name, e.exam_type;

CREATE OR REPLACE VIEW vw_student_full_profile AS
SELECT 
    u.id,
    u.first_name,
    u.last_name,
    u.first_name || ' ' || u.last_name AS full_name,
    u.email,
    u.phone,
    u.avatar_url,
    u.birth_date,
    s.user_id AS student_id,
    s.mentor_id,
    s.grade_level,
    s.school_name,
    s.field,
    s.school_score,
    s.risk_status,
    s.target_university,
    mentor_u.first_name || ' ' || mentor_u.last_name AS mentor_name
FROM users u
INNER JOIN students s ON u.id = s.user_id
LEFT JOIN users mentor_u ON s.mentor_id = mentor_u.id
WHERE u.role_id = 3; -- Student role

CREATE OR REPLACE VIEW vw_exam_with_net_scores AS
SELECT 
    e.id AS exam_id,
    e.student_id,
    e.exam_name,
    e.exam_type,
    e.exam_date,
    d.id AS detail_id,
    d.lesson_name,
    d.correct_count,
    d.wrong_count,
    d.empty_count,
    fn_calculate_net(d.correct_count, d.wrong_count) AS lesson_net,
    SUM(fn_calculate_net(d.correct_count, d.wrong_count)) OVER (PARTITION BY e.id) AS total_net
FROM exams e
LEFT JOIN exam_details d ON e.id = d.exam_id;

CREATE OR REPLACE VIEW vw_meeting_with_participants AS
SELECT 
    m.id AS meeting_id,
    m.mentor_id,
    m.meeting_date,
    m.title,
    m.meeting_type,
    m.notes,
    m.meeting_link,
    mentor_u.first_name AS mentor_first_name,
    mentor_u.last_name AS mentor_last_name,
    COALESCE(
        ARRAY_AGG(
            JSON_BUILD_OBJECT(
                'student_id', mp.student_id,
                'participation_status', mp.participation_status,
                'first_name', stu.first_name,
                'last_name', stu.last_name,
                'email', stu.email
            )
        ) FILTER (WHERE mp.student_id IS NOT NULL),
        '{}'
    ) AS participants,
    COUNT(mp.student_id) AS participant_count
FROM meetings m
LEFT JOIN users mentor_u ON m.mentor_id = mentor_u.id
LEFT JOIN meeting_participants mp ON m.id = mp.meeting_id
LEFT JOIN users stu ON mp.student_id = stu.id
GROUP BY m.id, mentor_u.first_name, mentor_u.last_name;

CREATE OR REPLACE VIEW vw_notification_full AS
SELECT 
    n.id,
    n.sender_id,
    n.receiver_id,
    n.title,
    n.message,
    n.notification_type,
    n.priority,
    n.is_read,
    n.created_at,
    -- Sender info
    sender.first_name AS sender_first_name,
    sender.last_name AS sender_last_name,
    sender.avatar_url AS sender_avatar_url,
    sender.first_name || ' ' || sender.last_name AS sender_full_name,
    -- Receiver info
    receiver.first_name AS receiver_first_name,
    receiver.last_name AS receiver_last_name,
    receiver.avatar_url AS receiver_avatar_url,
    receiver.first_name || ' ' || receiver.last_name AS receiver_full_name
FROM notifications n
LEFT JOIN users sender ON n.sender_id = sender.id
LEFT JOIN users receiver ON n.receiver_id = receiver.id;


-- 6. YETKİLENDİRME / GÜVENLİK (YENİ EKLENDİ - Yetkilendirme Kriteri)
-- Not: Bu komutlar genelde veritabanı admini tarafından çalıştırılır.
-- Herkesin (Public) güvenli listeyi görmesine izin ver, ama asıl tabloyu gizle.

GRANT SELECT ON vw_safe_user_list TO PUBLIC;
GRANT SELECT ON vw_mentor_student_list TO PUBLIC;
-- Diğer tablolar için yetki vermeyerek güvenlik sağlanmış olur.

