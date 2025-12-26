const pool = require('../config/db');
const bcrypt = require('bcrypt');

const seed = async () => {
    try {
        console.log('Seeding database...');

        // 1. Seed Roles
        const roles = ['Admin', 'Mentor', 'Student'];
        for (const role of roles) {
            await pool.query(
                'INSERT INTO roles (role_name) VALUES ($1) ON CONFLICT (role_name) DO NOTHING',
                [role]
            );
        }
        console.log('Roles seeded.');

        // 2. Seed Admin User
        const adminEmail = 'admin@msms.com';
        const adminPassword = await bcrypt.hash('admin123', 10);

        // Check if admin exists
        const adminCheck = await pool.query('SELECT * FROM users WHERE email = $1', [adminEmail]);

        if (adminCheck.rows.length === 0) {
            await pool.query(`
                INSERT INTO users (role_id, first_name, last_name, email, password, tckn, phone, address)
                VALUES (
                    (SELECT id FROM roles WHERE role_name = 'Admin'),
                    'System', 'Admin', $1, $2, '11111111111', '5555555555', 'System Admin Address'
                )
            `, [adminEmail, adminPassword]);
            console.log('Admin user seeded.');
        } else {
            console.log('Admin user already exists.');
        }

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seed();
