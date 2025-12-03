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
            SELECT u.id, u.first_name, u.last_name, u.email, u.avatar_url, s.grade_level, s.school_name
            FROM students s
            JOIN users u ON s.user_id = u.id
            WHERE s.mentor_id = $1
        `;
        const result = await pool.query(query, [mentorId]);
        return result.rows;
    }
}

module.exports = new MentorRepository();
