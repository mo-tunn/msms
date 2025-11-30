const axios = require('axios');

const AUTH_URL = 'http://localhost:3001';

// Test Data
const validUser = {
    first_name: 'Ahmet',
    last_name: 'Yılmaz',
    email: `ahmet.yilmaz.${Date.now()}@example.com`, // Unique email
    password: 'password123',
    tckn: '22222222220', // Assuming this is a valid TCKN in the mock provider
    phone: '5551234567',
    birth_date: '1990-01-01',
    role_name: 'Student'
};

const invalidUser = {
    ...validUser,
    tckn: '00000000000', // Assuming this is invalid
    email: `invalid.${Date.now()}@example.com`
};

async function runTests() {
    console.log('--- Starting Auth Service Tests ---');

    // 1. Test Registration with Valid Data
    try {
        console.log('\n1. Testing Registration with Valid Data...');
        const res = await axios.post(`${AUTH_URL}/register`, validUser);
        console.log('✅ Registration Successful:', res.data.message);
        console.log('Token:', res.data.token ? 'Received' : 'Missing');
    } catch (error) {
        console.error('❌ Registration Failed:', error.response ? error.response.data : error.message);
    }

    // 2. Test Login with Registered User
    try {
        console.log('\n2. Testing Login with Registered User...');
        const res = await axios.post(`${AUTH_URL}/login`, {
            email: validUser.email,
            password: validUser.password
        });
        console.log('✅ Login Successful:', res.data.message);
        console.log('Token:', res.data.token ? 'Received' : 'Missing');
    } catch (error) {
        console.error('❌ Login Failed:', error.response ? error.response.data : error.message);
    }

    // 3. Test Registration with Invalid Identity
    try {
        console.log('\n3. Testing Registration with Invalid Identity...');
        await axios.post(`${AUTH_URL}/register`, invalidUser);
        console.error('❌ Registration Should Have Failed but Succeeded');
    } catch (error) {
        if (error.response && error.response.status === 400) {
            console.log('✅ Registration Failed as Expected:', error.response.data.error);
        } else {
            console.error('❌ Unexpected Error:', error.response ? error.response.data : error.message);
        }
    }
}

runTests();
