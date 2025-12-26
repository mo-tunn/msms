-- =========================================================
-- DYNAMIC SCORING UPDATE
-- =========================================================

-- 1. Create Helper Function for Streak (Zinciri Kırma)
CREATE OR REPLACE FUNCTION fn_calculate_streak_score(p_student_id INT)
RETURNS NUMERIC AS $$
DECLARE
    v_streak INT := 0;
    v_score NUMERIC;
BEGIN
    -- Calculate streak (consecutive days ending yesterday or today)
    -- Simplified: Count completed activities in last 30 days specific to streak logic? 
    -- Or just count active days in last 30 days as per service logic: min(last_30_days_activity, 20) * 1.5
    SELECT COUNT(*) INTO v_streak
    FROM daily_activities
    WHERE student_id = p_student_id
    AND activity_date > CURRENT_DATE - INTERVAL '30 days'
    AND is_completed = TRUE;
    
    -- Cap at 20 days * 1.5 pts = 30 pts
    IF v_streak > 20 THEN v_streak := 20; END IF;
    v_score := v_streak * 1.5;
    
    RETURN v_score;
END;
$$ LANGUAGE plpgsql;

-- 2. Create Helper Function for Exam Trend
CREATE OR REPLACE FUNCTION fn_calculate_exam_score(p_student_id INT)
RETURNS NUMERIC AS $$
DECLARE
    v_last_net NUMERIC := 0;
    v_prev_net NUMERIC := 0;
    v_exam_count INT;
BEGIN
    -- Get count of exams
    SELECT COUNT(*) INTO v_exam_count FROM exams WHERE student_id = p_student_id;
    
    IF v_exam_count = 0 THEN
        RETURN 0;
    ELSIF v_exam_count = 1 THEN
        RETURN 15; -- Base score for starting
    END IF;

    -- Get last exam net
    SELECT COALESCE(SUM(fn_calculate_net(d.correct_count, d.wrong_count)), 0)
    INTO v_last_net
    FROM exams e
    JOIN exam_details d ON e.id = d.exam_id
    WHERE e.student_id = p_student_id
    AND e.exam_date = (
        SELECT MAX(exam_date) FROM exams WHERE student_id = p_student_id
    );

    -- Get previous exam net (2nd latest)
    SELECT COALESCE(SUM(fn_calculate_net(d.correct_count, d.wrong_count)), 0)
    INTO v_prev_net
    FROM exams e
    JOIN exam_details d ON e.id = d.exam_id
    WHERE e.student_id = p_student_id
    AND e.exam_date = (
        SELECT exam_date FROM exams WHERE student_id = p_student_id ORDER BY exam_date DESC LIMIT 1 OFFSET 1
    );
    
    IF v_last_net > v_prev_net THEN
        RETURN 30; -- Increasing
    ELSIF v_last_net >= v_prev_net - 2 THEN -- Tolerance
        RETURN 20; -- Stable
    ELSE
        RETURN 10; -- Decreasing
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 3. Main Scoring Function
CREATE OR REPLACE FUNCTION fn_calculate_student_score(p_student_id INT)
RETURNS INT AS $$
DECLARE
    v_task_rate NUMERIC;
    v_task_score NUMERIC;
    v_streak_score NUMERIC;
    v_exam_score NUMERIC;
    v_total_score INT;
BEGIN
    -- Task Score (Max 40)
    v_task_rate := fn_get_task_completion_rate(p_student_id); -- 0-100
    v_task_score := (v_task_rate / 100.0) * 40.0;
    
    -- Streak Score (Max 30)
    v_streak_score := fn_calculate_streak_score(p_student_id);
    
    -- Exam Score (Max 30)
    v_exam_score := fn_calculate_exam_score(p_student_id);
    
    v_total_score := ROUND(v_task_score + v_streak_score + v_exam_score);
    
    IF v_total_score > 100 THEN v_total_score := 100; END IF;
    
    RETURN v_total_score;
END;
$$ LANGUAGE plpgsql;

-- 4. Update View to use dynamic function
DROP VIEW IF EXISTS vw_dashboard_stats;

CREATE OR REPLACE VIEW vw_dashboard_stats AS
SELECT 
    s.user_id as student_id,
    u.first_name,
    u.last_name,
    -- Dynamic Risk Status Calculation based on Score
    CASE 
        WHEN fn_calculate_student_score(s.user_id) >= 80 THEN 'Çok Yükselişte'
        WHEN fn_calculate_student_score(s.user_id) >= 60 THEN 'Yükselişte'
        WHEN fn_calculate_student_score(s.user_id) >= 40 THEN 'Dengeli'
        WHEN fn_calculate_student_score(s.user_id) >= 20 THEN 'Riskli'
        ELSE 'Çok Riskli'
    END::VARCHAR(20) as risk_status,
    fn_calculate_student_score(s.user_id) as success_score,
    fn_get_task_completion_rate(s.user_id) as task_success_rate,
    (SELECT COUNT(*) FROM meeting_participants WHERE student_id = s.user_id AND participation_status = 'Katıldı') as attended_meetings,
    (SELECT COUNT(*) FROM notifications WHERE receiver_id = s.user_id AND is_read = FALSE) as unread_notifications
FROM students s
JOIN users u ON s.user_id = u.id;

GRANT SELECT ON vw_dashboard_stats TO PUBLIC;
