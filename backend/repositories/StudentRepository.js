const pool = require('../config/db');

class StudentRepository {
    async create(studentData) {
        const { user_id, mentor_id, field, target_university, school_name, grade_level, school_score } = studentData;
        const query = `
            INSERT INTO students (user_id, mentor_id, field, target_university, school_name, grade_level, school_score)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `;
        const values = [user_id, mentor_id, field, target_university, school_name, grade_level, school_score];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    async updateMentor(studentId, mentorId) {
        const query = 'UPDATE students SET mentor_id = $2 WHERE user_id = $1 RETURNING *';
        const result = await pool.query(query, [studentId, mentorId]);
        return result.rows[0];
    }
}

module.exports = new StudentRepository();
