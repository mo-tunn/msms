-- =========================================================
-- MSMS SAMPLE DATA GENERATION SCRIPT (Final Refined)
-- Date Range: 05.09.2025 - 12.01.2026
-- Emails: student1@msms.com, mentor1@msms.com format
-- Task Times: Populated with logic (Deadline = End + 24h)
-- =========================================================

DO $$
DECLARE
    -- IDs
    v_mentor1_id INT;
    v_mentor2_id INT;
    v_s1_id INT; -- Student 1
    v_s2_id INT; -- Student 2
    v_s3_id INT; -- Student 3
    v_s4_id INT; -- Student 4
    
    v_exam_id INT;
    
    -- Valid Bcrypt Hash for '123456'
    v_hash VARCHAR := '$2b$10$UwkzhRlkRAEY3C3rFdL8teD6dH0ysPj/.VLdaB0tnnB9158GuhbQ.';
    
    -- Date Range Configuration
    v_start_date TIMESTAMP := '2025-09-05 08:00:00';
    v_end_date TIMESTAMP := '2026-01-12 17:00:00';
    v_date_span INTERVAL;
    
    -- Loop variables
    i INT;
    v_random_student_id INT;
    v_random_mentor_id INT;
    v_random_status VARCHAR;
    v_random_start TIMESTAMP;
    v_random_end TIMESTAMP;
    v_random_deadline TIMESTAMP;
    v_random_score INT;
BEGIN
    v_date_span := v_end_date - v_start_date;
    RAISE NOTICE 'Cleaning up existing data...';
    
    -- 1. CLEANUP
    DELETE FROM meeting_participants WHERE student_id IN (SELECT user_id FROM students WHERE user_id IN (SELECT id FROM users WHERE role_id != 1));
    DELETE FROM daily_activities WHERE student_id IN (SELECT user_id FROM students WHERE user_id IN (SELECT id FROM users WHERE role_id != 1));
    DELETE FROM tasks WHERE student_id IN (SELECT user_id FROM students WHERE user_id IN (SELECT id FROM users WHERE role_id != 1));
    
    DELETE FROM exam_topic_details WHERE exam_detail_id IN (SELECT id FROM exam_details WHERE exam_id IN (SELECT id FROM exams WHERE student_id IN (SELECT user_id FROM students WHERE user_id IN (SELECT id FROM users WHERE role_id != 1))));
    DELETE FROM exam_details WHERE exam_id IN (SELECT id FROM exams WHERE student_id IN (SELECT user_id FROM students WHERE user_id IN (SELECT id FROM users WHERE role_id != 1)));
    DELETE FROM exams WHERE student_id IN (SELECT user_id FROM students WHERE user_id IN (SELECT id FROM users WHERE role_id != 1));
    
    DELETE FROM meetings WHERE mentor_id IN (SELECT user_id FROM mentors WHERE user_id IN (SELECT id FROM users WHERE role_id != 1));
    DELETE FROM notifications WHERE sender_id IN (SELECT id FROM users WHERE role_id != 1) OR receiver_id IN (SELECT id FROM users WHERE role_id != 1);
    DELETE FROM user_activities WHERE user_id IN (SELECT id FROM users WHERE role_id != 1);
    
    DELETE FROM students WHERE user_id IN (SELECT id FROM users WHERE role_id != 1);
    DELETE FROM mentors WHERE user_id IN (SELECT id FROM users WHERE role_id != 1);
    DELETE FROM users WHERE role_id != 1;

    RAISE NOTICE 'Inserting new users with standardized emails...';

    -- 2. CREATE MENTORS
    -- Mentor 1
    INSERT INTO users (role_id, first_name, last_name, email, password, tckn, phone, address)
    VALUES (2, 'Ahmet', 'Yılmaz', 'mentor1@msms.com', v_hash, '11111111111', '5551001001', 'İstanbul, Kadıköy')
    RETURNING id INTO v_mentor1_id;
    INSERT INTO mentors (user_id, branch, capacity) VALUES (v_mentor1_id, 'Matematik', 20);
    
    -- Mentor 2
    INSERT INTO users (role_id, first_name, last_name, email, password, tckn, phone, address)
    VALUES (2, 'Zeynep', 'Demir', 'mentor2@msms.com', v_hash, '22222222222', '5551001002', 'Ankara, Çankaya')
    RETURNING id INTO v_mentor2_id;
    INSERT INTO mentors (user_id, branch, capacity) VALUES (v_mentor2_id, 'Fen Bilimleri', 15);

    -- 3. CREATE STUDENTS
    -- Student 1
    INSERT INTO users (role_id, first_name, last_name, email, password, tckn, phone) VALUES (3, 'Can', 'Yıldız', 'student1@msms.com', v_hash, '33333333333', '5552002001') RETURNING id INTO v_s1_id;
    INSERT INTO students (user_id, mentor_id, field, school_name, grade_level, school_score, risk_status, success_score) VALUES (v_s1_id, v_mentor1_id, 'SAY', 'Atatürk Fen Lisesi', 12, 95.0, 'Yükselişte', 85);
    
    -- Student 2
    INSERT INTO users (role_id, first_name, last_name, email, password, tckn, phone) VALUES (3, 'Elif', 'Kara', 'student2@msms.com', v_hash, '44444444444', '5552002002') RETURNING id INTO v_s2_id;
    INSERT INTO students (user_id, mentor_id, field, school_name, grade_level, school_score, risk_status, success_score) VALUES (v_s2_id, v_mentor1_id, 'EA', 'Cumhuriyet Anadolu Lisesi', 12, 82.5, 'Dengeli', 50);
    
    -- Student 3
    INSERT INTO users (role_id, first_name, last_name, email, password, tckn, phone) VALUES (3, 'Burak', 'Çelik', 'student3@msms.com', v_hash, '55555555555', '5552002003') RETURNING id INTO v_s3_id;
    INSERT INTO students (user_id, mentor_id, field, school_name, grade_level, school_score, risk_status, success_score) VALUES (v_s3_id, v_mentor1_id, 'SAY', 'Mehmet Akif Lisesi', 11, 65.0, 'Riskli', 25);
    
    -- Student 4
    INSERT INTO users (role_id, first_name, last_name, email, password, tckn, phone) VALUES (3, 'Ayşe', 'Sönmez', 'student4@msms.com', v_hash, '66666666666', '5552002004') RETURNING id INTO v_s4_id;
    INSERT INTO students (user_id, mentor_id, field, school_name, grade_level, school_score, risk_status, success_score) VALUES (v_s4_id, v_mentor2_id, 'SÖZ', 'Sosyal Bilimler Lisesi', 12, 88.0, 'Yükselişte', 75);

    -- 4. BULK INSERT TASKS (Refined timing)
    RAISE NOTICE 'Generating tasks with logic...';
    FOR i IN 1..100 LOOP
        -- Select random student
        SELECT CASE floor(random() * 4 + 1)::INT
            WHEN 1 THEN v_s1_id WHEN 2 THEN v_s2_id WHEN 3 THEN v_s3_id ELSE v_s4_id END INTO v_random_student_id;
            
        -- Determine mentor
        SELECT mentor_id FROM students WHERE user_id = v_random_student_id INTO v_random_mentor_id;
        
        -- Random Status
        SELECT CASE floor(random() * 4 + 1)::INT
            WHEN 1 THEN 'Completed' WHEN 2 THEN 'Pending' WHEN 3 THEN 'Overdue' ELSE 'Completed' END INTO v_random_status;
            
        -- TIMING LOGIC
        -- Random start time in range
        v_random_start := v_start_date + (random() * extract(epoch from v_date_span) * interval '1 second');
        
        -- End time is 2-5 hours after start
        v_random_end := v_random_start + (floor(random() * 4 + 2) || ' hours')::INTERVAL;
        
        -- Deadline is EXACTLY 24 hours after End Time (as requested)
        v_random_deadline := v_random_end + INTERVAL '24 hours';

        INSERT INTO tasks (student_id, mentor_id, title, status, start_time, end_time, deadline, priority, description, created_at) 
        VALUES (
            v_random_student_id, 
            v_random_mentor_id, 
            'Otomatik Görev #' || i, 
            v_random_status,
            v_random_start,
            v_random_end,
            v_random_deadline,
            CASE floor(random() * 3 + 1)::INT WHEN 1 THEN 'Yüksek' WHEN 2 THEN 'Orta' ELSE 'Düşük' END,
            'Otomatik oluşturulmuş görev.',
            v_random_start - INTERVAL '2 days' -- Created 2 days before start
        );
    END LOOP;

    -- 5. DAILY ACTIVITIES
    RAISE NOTICE 'Generating activities...';
    FOR i IN 1..150 LOOP
        SELECT CASE floor(random() * 4 + 1)::INT
            WHEN 1 THEN v_s1_id WHEN 2 THEN v_s2_id WHEN 3 THEN v_s3_id ELSE v_s4_id END INTO v_random_student_id;
            
        -- Random date
        v_random_start := v_start_date + (random() * extract(epoch from v_date_span) * interval '1 second');

        INSERT INTO daily_activities (student_id, activity_date, is_completed) 
        VALUES (v_random_student_id, v_random_start::DATE, true)
        ON CONFLICT DO NOTHING;
    END LOOP;

    -- 6. MEETINGS
    RAISE NOTICE 'Generating meetings...';
    FOR i IN 1..40 LOOP
        v_random_start := v_start_date + (random() * extract(epoch from v_date_span) * interval '1 second');
        
        -- Business hours adjustment (8am - 6pm)
        -- Simplified: just use timestamp
        
        INSERT INTO meetings (mentor_id, meeting_date, title, meeting_type, notes)
        VALUES (
            v_mentor1_id,
            v_random_start,
            'Mentörlük Görüşmesi #' || i,
            CASE floor(random() * 2 + 1)::INT WHEN 1 THEN 'Online' ELSE 'Yüz Yüze' END,
            'Otomatik planlanmış toplantı.'
        );
    END LOOP;
    
    -- Assign participants
    INSERT INTO meeting_participants (meeting_id, student_id, participation_status)
    SELECT id, v_s1_id, 'Katıldı' FROM meetings WHERE id % 4 = 0;
    
    INSERT INTO meeting_participants (meeting_id, student_id, participation_status)
    SELECT id, v_s2_id, 'Bekleniyor' FROM meetings WHERE id % 4 = 1;

    INSERT INTO meeting_participants (meeting_id, student_id, participation_status)
    SELECT id, v_s3_id, 'Gelmendi' FROM meetings WHERE id % 4 = 2;
    
    INSERT INTO meeting_participants (meeting_id, student_id, participation_status)
    SELECT id, v_s4_id, 'Katıldı' FROM meetings WHERE id % 4 = 3;

    -- 7. EXAMS (BULK)
    RAISE NOTICE 'Generating exams...';
    FOR i IN 1..30 LOOP
        SELECT CASE floor(random() * 4 + 1)::INT
            WHEN 1 THEN v_s1_id WHEN 2 THEN v_s2_id WHEN 3 THEN v_s3_id ELSE v_s4_id END INTO v_random_student_id;
            
        v_random_start := v_start_date + (random() * extract(epoch from v_date_span) * interval '1 second');
        
        INSERT INTO exams (student_id, exam_name, exam_type, exam_date) 
        VALUES (
            v_random_student_id, 
            'Deneme Sınavı #' || i, 
            CASE floor(random() * 2 + 1)::INT WHEN 1 THEN 'TYT' ELSE 'AYT' END, 
            v_random_start::DATE
        ) RETURNING id INTO v_exam_id;
        
        -- Details
        v_random_score := floor(random() * 35 + 5);
        INSERT INTO exam_details (exam_id, lesson_name, correct_count, wrong_count) VALUES (v_exam_id, 'Matematik', v_random_score, 40 - v_random_score);
        
        v_random_score := floor(random() * 15 + 5);
        INSERT INTO exam_details (exam_id, lesson_name, correct_count, wrong_count) VALUES (v_exam_id, 'Fen Bilimleri', v_random_score, 20 - v_random_score);
        
        v_random_score := floor(random() * 30 + 10);
        INSERT INTO exam_details (exam_id, lesson_name, correct_count, wrong_count) VALUES (v_exam_id, 'Türkçe', v_random_score, 40 - v_random_score);

    END LOOP;
    
    RAISE NOTICE 'Final refined data generation completed.';
END $$;
