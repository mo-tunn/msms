const pool = require('../config/db');

async function debugQuery() {
    try {
        console.log('Testing findAll query...');
        const query = `
            SELECT u.id, u.first_name, u.last_name, u.email, u.phone, u.tckn, u.birth_date, u.address, u.role_id, r.role_name,
                   s.school_name, s.grade_level, s.field, s.school_score,
                   m.branch, m.title
            FROM users u
            LEFT JOIN roles r ON u.role_id = r.id
            LEFT JOIN students s ON u.id = s.user_id
            LEFT JOIN mentors m ON u.id = m.user_id
            ORDER BY u.id ASC
        `;
        const result = await pool.query(query);
        console.log('Query successful!');
        console.log('Rows:', result.rows);
    } catch (error) {
        console.error('Query failed:', error);
    } finally {
        pool.end();
    }
}

debugQuery();
