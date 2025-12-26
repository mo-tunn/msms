const pool = require('../config/db');

class ExamRepository {
    async createExam(studentId, examName, examType, examDate) {
        const query = 'CALL sp_create_exam_entry($1, $2, $3, $4)';
        await pool.query(query, [studentId, examName, examType, examDate]);

        // Since the SP doesn't return the ID, we fetch the latest exam for this student
        // This assumes the exam we just created is the latest one.
        const idQuery = 'SELECT id FROM exams WHERE student_id = $1 ORDER BY id DESC LIMIT 1';
        const result = await pool.query(idQuery, [studentId]);
        return result.rows[0]?.id;
    }

    async createExamDetail(examId, lessonName, correctCount, wrongCount, emptyCount) {
        const query = `
            INSERT INTO exam_details (exam_id, lesson_name, correct_count, wrong_count, empty_count)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id
        `;
        const result = await pool.query(query, [examId, lessonName, correctCount, wrongCount, emptyCount]);
        return result.rows[0].id;
    }

    async createExamTopicDetail(examDetailId, topicName, correctCount, wrongCount, emptyCount) {
        const query = `
            INSERT INTO exam_topic_details (exam_detail_id, topic_name, correct_count, wrong_count, empty_count)
            VALUES ($1, $2, $3, $4, $5)
        `;
        await pool.query(query, [examDetailId, topicName, correctCount, wrongCount, emptyCount]);
    }

    async getExamsByStudentId(studentId) {
        const query = `
            SELECT DISTINCT 
                exam_id AS id,
                student_id,
                exam_name,
                exam_type,
                exam_date,
                COALESCE(total_net, 0) as total_net
            FROM vw_exam_with_net_scores
            WHERE student_id = $1
            ORDER BY exam_date DESC
        `;
        const result = await pool.query(query, [studentId]);
        return result.rows;
    }

    async getExamById(examId) {
        const query = 'SELECT * FROM exams WHERE id = $1';
        const result = await pool.query(query, [examId]);
        return result.rows[0];
    }

    async getExamDetails(examId) {
        const query = 'SELECT * FROM exam_details WHERE exam_id = $1';
        const result = await pool.query(query, [examId]);
        return result.rows;
    }

    async getExamTopicDetails(examDetailId) {
        const query = 'SELECT * FROM exam_topic_details WHERE exam_detail_id = $1';
        const result = await pool.query(query, [examDetailId]);
        return result.rows;
    }
}

module.exports = new ExamRepository();
