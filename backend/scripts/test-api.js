const fetch = require('node-fetch');

const API_URL = 'http://127.0.0.1:3000/api';

async function testApi() {
    try {
        console.log('1. Logging in as Admin...');
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@msms.com',
                password: 'admin123'
            })
        });

        if (!loginRes.ok) {
            const err = await loginRes.text();
            throw new Error(`Login failed: ${err}`);
        }

        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log('Login successful. Token received.');

        console.log('2. Fetching Users...');
        const usersRes = await fetch(`${API_URL}/users`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!usersRes.ok) {
            const err = await usersRes.text();
            console.error('Status:', usersRes.status);
            throw new Error(`Fetch users failed: ${err}`);
        }

        const users = await usersRes.json();
        console.log(`Successfully fetched ${users.length} users:`);
        users.forEach(u => console.log(`- ${u.first_name} ${u.last_name} (${u.role_name})`));

    } catch (error) {
        console.error('API Test Failed:', error);
    }
}

testApi();
