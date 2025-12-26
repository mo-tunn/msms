const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

const initDb = async () => {
    try {
        const sqlPath = path.join(__dirname, '../../database/final_sql_db_script.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Running database initialization script...');
        await pool.query(sql);
        console.log('Database initialized successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
};

initDb();
