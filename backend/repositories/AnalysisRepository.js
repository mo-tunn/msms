const pool = require('../config/db');

class AnalysisRepository {
    async getDailyActivities(studentId) {
        // Updated Logic: Calculate daily completion status from tasks table
        // A day is completed if:
        // 1. Tasks exist for that day (count > 0)
        // 2. All tasks for that day are 'Completed' (every status = 'Completed')
        const query = `
            SELECT 
                CASE 
                    WHEN deadline > CURRENT_DATE THEN CURRENT_DATE 
                    ELSE deadline::DATE 
                END as activity_date,
                COUNT(*) FILTER (WHERE status = 'Completed') as completed_count
            FROM tasks 
            WHERE 
                student_id = $1 
                AND deadline IS NOT NULL
            GROUP BY 1
            ORDER BY 1 DESC
        `;
        const result = await pool.query(query, [studentId]);
        return result.rows;
    }

    async getTaskCompletionStats(studentId, startDate) {
        // This leverages the existing tasks table but filters by date if needed
        // Assuming startDate is provided to filter recent tasks
        let query = `
            SELECT status, count(*) as count 
            FROM tasks 
            WHERE student_id = $1
        `;
        const values = [studentId];

        if (startDate) {
            query += ` AND created_at >= $2`;
            values.push(startDate);
        }

        query += ` GROUP BY status`;

        const result = await pool.query(query, values);
        return result.rows;
    }

    async getTaskTimeSeries(studentId, startDate, interval) {
        // interval: 'day' or 'month'
        let dateTrunc = interval === 'day' ? 'day' : 'month';

        // This query groups completed tasks by time bucket
        const query = `
            SELECT 
                DATE_TRUNC($3, deadline) as date_bucket,
                COUNT(*) FILTER (WHERE status = 'Completed') as completed_count
            FROM tasks
            WHERE 
                student_id = $1 
                AND deadline >= $2
                AND deadline <= NOW()
                AND status = 'Completed'
            GROUP BY date_bucket
            ORDER BY date_bucket ASC
        `;

        const result = await pool.query(query, [studentId, startDate, dateTrunc]);
        return result.rows;
    }

    async getStudentStats(studentId) {
        const query = `SELECT * FROM fn_get_student_task_summary($1)`;
        const result = await pool.query(query, [studentId]);
        return result.rows[0];
    }

    async getStudentExamHistory(studentId, limit = 5) {
        const query = `SELECT * FROM fn_get_student_exam_progress($1, $2)`;
        const result = await pool.query(query, [studentId, limit]);
        return result.rows;
    }

    async getMentorStudentsBasic(mentorId) {
        const query = `
            SELECT 
                student_id as id,
                full_name as name,
                avatar_url,
                grade_level,
                risk_status
            FROM vw_student_full_profile
            WHERE mentor_id = $1
        `;
        const result = await pool.query(query, [mentorId]);
        return result.rows.map(row => ({
            ...row,
            avatar: row.avatar_url || (row.name ? row.name.split(' ').map(n => n[0]).join('').toUpperCase() : '??')
        }));
    }
    async getDashboardStats(studentId) {
        const query = `SELECT * FROM vw_dashboard_stats WHERE student_id = $1`;
        const result = await pool.query(query, [studentId]);
        return result.rows[0];
    }

    async getUpcomingTasks(studentId) {
        const query = `
            SELECT id, title, deadline, priority 
            FROM tasks 
            WHERE student_id = $1 AND status = 'Pending' AND deadline >= NOW()
            ORDER BY deadline ASC 
            LIMIT 5
        `;
        const result = await pool.query(query, [studentId]);
        return result.rows;
    }

    async getWeeklyMeetings(studentId) {
        // Meetings that the student is a participant of (based on meeting_participants table)
        // OR meetings where the student's mentor is hosting? 
        // Logic: Usually specific meetings defined in `meeting_participants` OR generic mentor meetings?
        // Script says `meeting_participants` links meetings to students.
        const query = `
            SELECT m.id, m.title, m.meeting_date, m.meeting_type
            FROM meetings m
            JOIN meeting_participants mp ON m.id = mp.meeting_id
            WHERE mp.student_id = $1 
            AND m.meeting_date >= DATE_TRUNC('week', CURRENT_DATE)
            AND m.meeting_date < DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '1 week'
            ORDER BY m.meeting_date ASC
        `;
        const result = await pool.query(query, [studentId]);
        return result.rows;
    }
}

module.exports = new AnalysisRepository();
