const bcrypt = require('bcrypt');
const UserRepository = require('../repositories/UserRepository');

class UserService {
    async getStudents() {
        // Role ID 3 is for Students
        return await UserRepository.findAllByRole(3);
    }

    async getAllUsers() {
        return await UserRepository.findAll();
    }

    async getUserById(id) {
        return await UserRepository.findById(id);
    }

    async getStudentsByMentorId(mentorId) {
        return await UserRepository.findStudentsByMentorId(mentorId);
    }

    async updateUser(id, userData) {
        if (userData.password && userData.password.trim() !== '') {
            userData.password = await bcrypt.hash(userData.password, 10);
        } else {
            delete userData.password; // Remove empty password to prevent overwriting with empty string if logic fails elsewhere
        }
        return await UserRepository.update(id, userData);
    }

    async deleteUser(id) {
        return await UserRepository.delete(id);
    }
}

module.exports = new UserService();
