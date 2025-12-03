const { Client } = require('pg');
require('dotenv').config();

const createDb = async () => {
    const dbName = process.env.DB_NAME || 'msmsdb';
    console.log(`Checking if database '${dbName}' exists...`);

    // Connect to default 'postgres' database to manage other databases
    const client = new Client({
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: 'postgres', // Connect to default DB
        password: process.env.DB_PASSWORD || 'Zombirock111',
        port: process.env.DB_PORT || 5432,
    });

    try {
        await client.connect();

        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);

        if (res.rowCount === 0) {
            console.log(`Database '${dbName}' does not exist. Creating...`);
            await client.query(`CREATE DATABASE "${dbName}"`);
            console.log(`Database '${dbName}' created successfully.`);
        } else {
            console.log(`Database '${dbName}' already exists.`);
        }

        await client.end();
        process.exit(0);
    } catch (err) {
        console.error('Error creating database:', err);
        process.exit(1);
    }
};

createDb();
