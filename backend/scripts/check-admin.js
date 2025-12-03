const pool = require('../config/db');
const bcrypt = require('bcrypt');

async function checkAdmin() {
    try {
        console.log('Checking for admin user...');
        const res = await pool.query("SELECT * FROM users WHERE email = 'admin@msms.com'");

        if (res.rows.length === 0) {
            console.log('Admin user not found. Creating...');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            const insertRes = await pool.query(`
                INSERT INTO users (role_id, first_name, last_name, email, password, tckn, phone, birth_date, address, avatar_url)
                VALUES (1, 'Admin', 'User', 'admin@msms.com', $1, '11111111111', '5555555555', '1990-01-01', 'Admin Address', 'https://ui-avatars.com/api/?name=Admin+User')
                RETURNING *
            `, [hashedPassword]);
            console.log('Admin user created:', insertRes.rows[0]);
        } else {
            console.log('Admin user found:', res.rows[0]);
            console.log('Resetting password to admin123...');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await pool.query("UPDATE users SET password = $1 WHERE email = 'admin@msms.com'", [hashedPassword]);
            console.log('Password reset successful.');
        }
    } catch (err) {
        console.error('Error:', err);
    } finally {
        pool.end();
    }
}

checkAdmin();
