const ExamService = require('../services/ExamService');

class ExamController {
    async createExam(req, res) {
        try {
            // Expecting full exam structure in req.body
            // req.body should contain: { studentId, examName, examType, examDate, details: [...] }

            // Basic validation
            if (!req.body.studentId || !req.body.examName || !req.body.examDate) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            const result = await ExamService.saveExamResult(req.body);
            res.status(201).json(result);
        } catch (error) {
            console.error('Create Exam Error:', error);
            res.status(500).json({ message: 'Error creating exam record', error: error.message });
        }
    }

    async getExams(req, res) {
        try {
            const studentId = req.params.studentId;
            const exams = await ExamService.getStudentExams(studentId);
            res.json(exams);
        } catch (error) {
            console.error('Get Exams Error:', error);
            res.status(500).json({ message: 'Error fetching exams', error: error.message });
        }
    }

    async getExamById(req, res) {
        try {
            const examId = req.params.id;
            const exam = await ExamService.getExamById(examId);
            if (!exam) {
                return res.status(404).json({ message: 'Exam not found' });
            }
            res.json(exam);
        } catch (error) {
            console.error('Get Exam By Id Error:', error);
            res.status(500).json({ message: 'Error fetching exam details', error: error.message });
        }
    }
}

module.exports = new ExamController();
