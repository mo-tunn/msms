const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserRepository = require('../repositories/UserRepository');
const StudentRepository = require('../repositories/StudentRepository');
const MentorRepository = require('../repositories/MentorRepository');
const IdentityVerificationService = require('./IdentityVerificationService');

class AuthService {
    async login(email, password) {
        const user = await UserRepository.findByEmail(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        const token = this.generateToken(user);
        return { user, token };
    }

    async register(userData) {
        console.log('AuthService.register called');
        // Verify Identity first
        console.log('Verifying identity...');
        const isVerified = await IdentityVerificationService.verifyTCKN(
            userData.tckn,
            userData.first_name,
            userData.last_name,
            new Date(userData.birth_date).getFullYear()
        );
        console.log('Identity verification result:', isVerified);

        if (!isVerified) {
            throw new Error('Identity verification failed');
        }

        // Check if user exists
        console.log('Checking if user exists...');
        const existingUser = await UserRepository.findByEmail(userData.email);
        console.log('Existing user check result:', existingUser);
        if (existingUser) {
            throw new Error('User already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        userData.password = hashedPassword;

        // Create user
        console.log('Creating user in DB with data:', userData);
        const newUser = await UserRepository.create(userData);
        console.log('User created:', newUser);

        // Create role specific profile
        if (userData.role_id === 3) { // Student
            await StudentRepository.create({
                user_id: newUser.id,
                mentor_id: userData.mentor_id || null,
                field: userData.field,
                target_university: userData.target_university,
                school_name: userData.school_name,
                grade_level: userData.grade_level,
                school_score: userData.school_score
            });
        } else if (userData.role_id === 2) { // Mentor
            await MentorRepository.create({
                user_id: newUser.id,
                branch: userData.branch,
                capacity: userData.capacity || 20
            });

            // Assign students if provided
            if (userData.studentIds && Array.isArray(userData.studentIds)) {
                console.log(`Assigning ${userData.studentIds.length} students to mentor ${newUser.id}`);
                for (const studentId of userData.studentIds) {
                    await StudentRepository.updateMentor(studentId, newUser.id);
                }
            }
        }

        const token = this.generateToken(newUser);
        return { user: newUser, token };
    }

    generateToken(user) {
        return jwt.sign(
            { id: user.id, email: user.email, role_id: user.role_id },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1d' }
        );
    }
}

module.exports = new AuthService();
