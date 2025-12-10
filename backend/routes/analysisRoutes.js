const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/AnalysisController');
const authenticateToken = require('../middleware/authMiddleware');

// Base path: /api/analysis

// Get daily activities (Zinciri Kırma data)
router.get('/daily-activities', authenticateToken, analysisController.getDailyActivities);



// Get Task Analysis stats
router.get('/tasks', authenticateToken, analysisController.getTaskAnalysis);

// Get Mentor Students Analytics
router.get('/mentor/students-analytics', authenticateToken, analysisController.getMentorStudentsAnalytics);

// Get Student Dashboard Data
router.get('/student-dashboard', authenticateToken, analysisController.getStudentDashboard);

module.exports = router;
