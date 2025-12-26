const pool = require('../config/db');

class MentorRepository {
    async create(mentorData) {
        const { user_id, branch, capacity } = mentorData;
        const query = `
            INSERT INTO mentors (user_id, branch, capacity)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        const values = [user_id, branch, capacity];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    async findStudentsByMentorId(mentorId) {
        const query = `
            SELECT id, first_name, last_name, email, avatar_url, grade_level, school_name
            FROM vw_student_full_profile
            WHERE mentor_id = $1
        `;
        const result = await pool.query(query, [mentorId]);
        return result.rows;
    }
}

module.exports = new MentorRepository();
