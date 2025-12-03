const pool = require('../config/db');

class UserRepository {
    async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await pool.query(query, [email]);
        return result.rows[0];
    }

    async findById(id) {
        const query = `
            SELECT u.id, u.first_name, u.last_name, u.email, u.phone, u.tckn, u.birth_date, u.address, u.role_id, r.role_name,
                   s.school_name, s.grade_level, s.field, s.school_score,
                   m.branch
            FROM users u
            LEFT JOIN roles r ON u.role_id = r.id
            LEFT JOIN students s ON u.id = s.user_id
            LEFT JOIN mentors m ON u.id = m.user_id
            WHERE u.id = $1
        `;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    async findAllByRole(roleId) {
        const query = 'SELECT id, first_name, last_name, email FROM users WHERE role_id = $1';
        const result = await pool.query(query, [roleId]);
        return result.rows;
    }

    async findAll() {
        const query = `
            SELECT u.id, u.first_name, u.last_name, u.email, u.phone, u.tckn, u.birth_date, u.address, u.role_id, r.role_name,
                   s.school_name, s.grade_level, s.field, s.school_score,
                   m.branch
            FROM users u
            LEFT JOIN roles r ON u.role_id = r.id
            LEFT JOIN students s ON u.id = s.user_id
            LEFT JOIN mentors m ON u.id = m.user_id
            ORDER BY u.id ASC
        `;
        const result = await pool.query(query);
        return result.rows;
    }

    async delete(id) {
        const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    async create(user) {
        const { role_id, first_name, last_name, email, password, tckn, phone, birth_date, address, avatar_url } = user;
        const query = `
            INSERT INTO users (role_id, first_name, last_name, email, password, tckn, phone, birth_date, address, avatar_url)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *
        `;
        const values = [role_id, first_name, last_name, email, password, tckn, phone, birth_date, address, avatar_url];
        console.log('UserRepository.create values:', values);
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    async update(id, user) {
        const query = `
            UPDATE users 
            SET first_name = COALESCE($2, first_name),
                last_name = COALESCE($3, last_name),
                phone = COALESCE($4, phone),
                address = COALESCE($5, address),
                email = COALESCE($6, email),
                tckn = COALESCE($7, tckn),
                birth_date = COALESCE($8, birth_date),
                password = COALESCE($9, password)
            WHERE id = $1
            RETURNING *
        `;
        const values = [id, user.first_name, user.last_name, user.phone, user.address, user.email, user.tckn, user.birth_date, user.password];
        const result = await pool.query(query, values);
        return result.rows[0];
    }
    async findStudentsByMentorId(mentorId) {
        const query = `
            SELECT s.user_id, u.first_name, u.last_name, s.grade_level, s.school_name, s.field, s.school_score, s.risk_status
            FROM students s
            JOIN users u ON s.user_id = u.id
            WHERE s.mentor_id = $1
        `;
        const result = await pool.query(query, [mentorId]);
        return result.rows;
    }
}

module.exports = new UserRepository();
