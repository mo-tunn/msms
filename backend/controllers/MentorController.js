const MentorRepository = require('../repositories/MentorRepository');

class MentorController {
    async getMyStudents(req, res) {
        try {
            // Assuming req.user contains the logged-in user info
            // role_id 2 is Mentor
            if (req.user.role_id !== 2) {
                return res.status(403).json({ message: 'Access denied. Mentors only.' });
            }

            const students = await MentorRepository.findStudentsByMentorId(req.user.id);
            res.json(students);
        } catch (error) {
            console.error('Get My Students Error:', error);
            res.status(500).json({ message: 'Error fetching students', error: error.message });
        }
    }
}

module.exports = new MentorController();
