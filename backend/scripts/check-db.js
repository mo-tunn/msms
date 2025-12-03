const pool = require('../config/db');

const checkDb = async () => {
    try {
        console.log('Checking database content...');

        // Check Users
        const users = await pool.query('SELECT * FROM users');
        console.log(`Total Users: ${users.rows.length}`);
        users.rows.forEach(u => console.log(`- ${u.first_name} ${u.last_name} (${u.email}) [Role: ${u.role_id}]`));

        // Check Roles
        const roles = await pool.query('SELECT * FROM roles');
        console.log(`Total Roles: ${roles.rows.length}`);
        roles.rows.forEach(r => console.log(`- ${r.id}: ${r.role_name}`));

        process.exit(0);
    } catch (error) {
        console.error('Error checking database:', error);
        process.exit(1);
    }
};

checkDb();
