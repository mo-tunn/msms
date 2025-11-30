const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function applyChanges() {
    try {
        console.log('Connecting to database...');
        const client = await pool.connect();
        try {
            console.log('Adding title column to mentors table...');
            await client.query('ALTER TABLE mentors ADD COLUMN IF NOT EXISTS title VARCHAR(50);');
            console.log('Successfully added title column.');
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('Error applying changes:', err);
    } finally {
        await pool.end();
    }
}

applyChanges();
