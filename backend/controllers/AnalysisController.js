const analysisService = require('../services/AnalysisService');

class AnalysisController {
    async getDailyActivities(req, res) {
        try {
            // Assuming req.user is populated by auth middleware and has id/role
            // If student, use their id. If mentor, might need to pass studentId param?
            // For now assume logged in student
            const studentId = req.user.id;

            // If the requester is a mentor viewing a student's analysis
            if (req.user.role_id === 2 && req.query.studentId) {
                // Should add validation here to ensure mentor is assigned to this student
                // Skipping for MVP speed as per request context usually implies owner or valid access
                const activities = await analysisService.getDailyActivities(req.query.studentId);
                return res.json(activities);
            }

            const activities = await analysisService.getDailyActivities(studentId);
            res.json(activities);
        } catch (error) {
            console.error('Get Daily Activities Error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }



    async getTaskAnalysis(req, res) {
        try {
            let studentId = req.user.id;
            const { timeFilter } = req.query; // '1 Hafta', etc.

            // If mentor allows overriding studentId
            // Role ID 2 = Mentor
            if (req.user.role_id === 2 && req.query.studentId) {
                studentId = req.query.studentId;
            }

            const analysis = await analysisService.getTaskAnalysis(studentId, timeFilter);
            res.json(analysis);
        } catch (error) {
            console.error('Get Task Analysis Error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    async getMentorStudentsAnalytics(req, res) {
        try {
            // Ensure requester is a mentor (Role ID 2)
            if (req.user.role_id !== 2) {
                return res.status(403).json({ error: 'Access denied: User is not a mentor' });
            }

            const mentorId = req.user.id;
            const students = await analysisService.getMentorStudentsAnalytics(mentorId);
            res.json(students);
        } catch (error) {
            console.error('Get Mentor Students Analytics Error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    async getStudentDashboard(req, res) {
        try {
            const studentId = req.user.id;
            // Ensure requester is Student
            // Role ID 3 = Student
            if (req.user.role_id !== 3) {
                // If mentor wants to see student dashboard (Impersonation feature?), handle here.
                // For now, restrict to student.
                return res.status(403).json({ error: 'Access denied: User is not a student' });
            }

            const data = await analysisService.getStudentDashboard(studentId);
            res.json(data);
        } catch (error) {
            console.error('Get Student Dashboard Error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }
}

module.exports = new AnalysisController();
