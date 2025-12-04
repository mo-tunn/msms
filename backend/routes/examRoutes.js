const express = require('express');
const router = express.Router();
const ExamController = require('../controllers/ExamController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', ExamController.createExam);
router.get('/:studentId', ExamController.getExams);
router.get('/detail/:id', ExamController.getExamById);

module.exports = router;
