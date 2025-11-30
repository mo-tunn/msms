const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

// Database connection
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    console.log('Connected to PostgreSQL database');
    release();
});

// Helper function to generate JWT
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, role_id: user.role_id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

// Middleware to authenticate Admin
const authenticateAdmin = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if role is Admin
        const roleResult = await pool.query('SELECT role_name FROM roles WHERE id = $1', [decoded.role_id]);
        if (roleResult.rows.length === 0 || roleResult.rows[0].role_name !== 'Admin') {
            return res.status(403).json({ error: 'Access denied. Admins only.' });
        }

        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token.' });
    }
};

// Admin Login Endpoint
app.post('/adminlogin', async (req, res) => {
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ error: 'Password is required' });
    }

    if (password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Invalid admin password' });
    }

    try {
        // Get Admin Role ID
        const roleResult = await pool.query('SELECT id FROM roles WHERE role_name = $1', ['Admin']);
        if (roleResult.rows.length === 0) {
            return res.status(500).json({ error: 'Admin role not found in database' });
        }
        const adminRoleId = roleResult.rows[0].id;

        // Generate Token for System Admin (mock user ID -1)
        const token = jwt.sign(
            { id: -1, email: 'admin@system', role_id: adminRoleId },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.json({
            message: 'Admin login successful',
            token
        });

    } catch (error) {
        console.error('Admin Login Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Register Endpoint (Secured)
app.post('/register', authenticateAdmin, async (req, res) => {
    const {
        // Common
        first_name, last_name, email, password, tckn, phone, birth_date, role_name, address,
        // Student specific
        school_name, grade_level, field, school_score,
        // Mentor specific
        title, branch, student_ids
    } = req.body;

    if (!first_name || !last_name || !email || !password || !tckn || !birth_date || !role_name) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Verify Identity
        try {
            const verificationResponse = await axios.post(process.env.IDENTITY_SERVICE_URL, {
                TCKimlikNo: Number(tckn),
                Ad: first_name.toUpperCase(),
                Soyad: last_name.toUpperCase(),
                DogumYili: new Date(birth_date).getFullYear()
            });

            if (!verificationResponse.data.success) {
                await client.query('ROLLBACK');
                return res.status(400).json({ error: 'Identity verification failed. Citizen not found.' });
            }
        } catch (verifyError) {
            // If identity service is down or returns error, we might want to fail or mock. 
            // For now, let's assume strict verification.
            console.error("Identity Verification Error:", verifyError.message);
            await client.query('ROLLBACK');
            return res.status(500).json({ error: 'Identity verification service error' });
        }

        // 2. Check if user already exists
        const userCheck = await client.query('SELECT * FROM users WHERE email = $1 OR tckn = $2', [email, tckn]);
        if (userCheck.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(409).json({ error: 'User already exists with this email or TCKN' });
        }

        // 3. Get Role ID
        const roleResult = await client.query('SELECT id FROM roles WHERE role_name = $1', [role_name]);
        if (roleResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'Invalid role' });
        }
        const role_id = roleResult.rows[0].id;

        // 4. Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 5. Insert User
        const insertUserQuery = `
            INSERT INTO users (role_id, first_name, last_name, email, password, tckn, phone, birth_date, address)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id, role_id, first_name, last_name, email, created_at
        `;
        const newUserResult = await client.query(insertUserQuery, [
            role_id, first_name, last_name, email, hashedPassword, tckn, phone, birth_date, address
        ]);
        const newUser = newUserResult.rows[0];

        // 6. Role Specific Insertions
        if (role_name === 'Student') {
            let parsedGrade = null;
            if (grade_level) {
                if (typeof grade_level === 'string' && grade_level.includes('Mezun')) {
                    parsedGrade = 13; // Convention for graduates
                } else {
                    parsedGrade = parseInt(grade_level) || null;
                }
            }

            const insertStudentQuery = `
                INSERT INTO students (user_id, school_name, grade_level, field, school_score)
                VALUES ($1, $2, $3, $4, $5)
            `;
            await client.query(insertStudentQuery, [
                newUser.id, school_name, parsedGrade, field, school_score
            ]);

        } else if (role_name === 'Mentor') {
            const insertMentorQuery = `
                INSERT INTO mentors (user_id, title, branch)
                VALUES ($1, $2, $3)
            `;
            await client.query(insertMentorQuery, [
                newUser.id, title, branch
            ]);

            // Assign students if provided
            if (student_ids && Array.isArray(student_ids) && student_ids.length > 0) {
                const updateStudentsQuery = `
                    UPDATE students SET mentor_id = $1 WHERE user_id = ANY($2::int[])
                `;
                await client.query(updateStudentsQuery, [newUser.id, student_ids]);
            }
        }

        await client.query('COMMIT');

        // 7. Generate Token
        const token = generateToken(newUser);

        res.status(201).json({
            message: 'User registered successfully',
            user: newUser,
            token
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Registration Error:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    } finally {
        client.release();
    }
});

// Login Endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // 1. Find User
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];

        // 2. Check Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // 3. Generate Token
        const token = generateToken(user);

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role_id: user.role_id
            },
            token
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Auth service listening at http://localhost:${port}`);
});
