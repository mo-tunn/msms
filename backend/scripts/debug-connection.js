require('dotenv').config();
const pool = require('../config/db');

const debugConnection = async () => {
    try {
        console.log('--- Environment Variables ---');
        console.log('DB_NAME from env:', process.env.DB_NAME);
        console.log('DB_USER from env:', process.env.DB_USER);
        console.log('-----------------------------');

        const client = await pool.connect();
        const res = await client.query('SELECT current_database(), inet_server_addr(), inet_server_port()');
        console.log('--- Active Connection Info ---');
        console.log('Connected Database:', res.rows[0].current_database);
        console.log('Server Address:', res.rows[0].inet_server_addr);
        console.log('Server Port:', res.rows[0].inet_server_port);
        console.log('------------------------------');

        const users = await client.query('SELECT * FROM users');
        console.log('Total Users in this DB:', users.rows.length);
        users.rows.forEach(u => console.log(`User: ${u.first_name} ${u.last_name} (${u.email})`));

        client.release();
        process.exit(0);
    } catch (err) {
        console.error('Connection Error:', err);
        process.exit(1);
    }
};

debugConnection();
