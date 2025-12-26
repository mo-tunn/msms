const fetch = require('node-fetch');

async function testAdminLogin() {
    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@msms.com',
                password: 'admin123'
            })
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Data:', data);

        if (response.ok) {
            console.log('Login successful!');
            console.log('Role ID:', data.user.role_id);
        } else {
            console.log('Login failed.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

testAdminLogin();
