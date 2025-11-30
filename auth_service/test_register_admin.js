const axios = require('axios');
const { Pool } = require('pg');
require('dotenv').config();

const API_URL = 'http://localhost:3001';
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function cleanUp(email, tckn) {
    const client = await pool.connect();
    try {
        // Get user ID first
        const res = await client.query('SELECT id FROM users WHERE email = $1 OR tckn = $2', [email, tckn]);
        if (res.rows.length > 0) {
            const userId = res.rows[0].id;
            await client.query('DELETE FROM students WHERE user_id = $1', [userId]);
            await client.query('DELETE FROM mentors WHERE user_id = $1', [userId]);
            await client.query('DELETE FROM users WHERE id = $1', [userId]);
        }
    } finally {
        client.release();
    }
}

let adminToken = '';

async function loginAdmin() {
    try {
        const response = await axios.post(`${API_URL}/adminlogin`, { password: 'admin123' });
        if (response.status === 200) {
            adminToken = response.data.token;
            console.log('Admin login successful. Token received.');
        }
    } catch (error) {
        console.error('Admin login failed:', error.message);
        process.exit(1);
    }
}

async function testRegisterStudent() {
    console.log('\n--- Testing Student Registration ---');
    const studentData = {
        first_name: 'Ahmet',
        last_name: 'Yılmaz',
        email: 'test.student@example.com',
        password: 'password123',
        tckn: '22222222220',
        phone: '5551234567',
        birth_date: '1990-01-01',
        role_name: 'Student',
        address: 'Test Address',
        school_name: 'Test High School',
        grade_level: '12. Sınıf',
        field: 'Sayısal',
        school_score: 85.5
    };

    try {
        await cleanUp(studentData.email, studentData.tckn);

        const response = await axios.post(`${API_URL}/register`, studentData, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log('Status:', response.status);
        console.log('Data:', response.data);

        if (response.status === 201) {
            const client = await pool.connect();
            const res = await client.query('SELECT * FROM students WHERE user_id = $1', [response.data.user.id]);
            client.release();

            if (res.rows.length > 0 && res.rows[0].school_name === studentData.school_name) {
                console.log('SUCCESS: Student data verified in DB.');
            } else {
                console.error('FAILURE: Student data missing or incorrect in DB.');
            }
        }
    } catch (error) {
        console.error('Error:', error.response ? JSON.stringify(error.response.data) : error.message);
    }
}

async function testRegisterMentor() {
    console.log('\n--- Testing Mentor Registration ---');
    const mentorData = {
        first_name: 'Ahmet',
        last_name: 'Yılmaz',
        email: 'test.mentor@example.com',
        password: 'password123',
        tckn: '22222222220',
        phone: '5559876543',
        birth_date: '1990-01-01',
        role_name: 'Mentor',
        address: 'Mentor Address',
        title: 'Senior Mentor',
        branch: 'Matematik'
    };

    try {
        await cleanUp(mentorData.email, mentorData.tckn);

        const response = await axios.post(`${API_URL}/register`, mentorData, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log('Status:', response.status);
        console.log('Data:', response.data);

        if (response.status === 201) {
            const client = await pool.connect();
            const res = await client.query('SELECT * FROM mentors WHERE user_id = $1', [response.data.user.id]);
            client.release();

            if (res.rows.length > 0 && res.rows[0].title === mentorData.title) {
                console.log('SUCCESS: Mentor data verified in DB.');
            } else {
                console.error('FAILURE: Mentor data missing or incorrect in DB.');
            }
        }
    } catch (error) {
        console.error('Error:', error.response ? JSON.stringify(error.response.data) : error.message);
    }
}

async function runTests() {
    await loginAdmin();
    await testRegisterStudent();
    await testRegisterMentor();
    await pool.end();
}

runTests();
