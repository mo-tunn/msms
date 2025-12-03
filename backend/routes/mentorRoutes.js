const express = require('express');
const router = express.Router();
const MentorController = require('../controllers/MentorController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/students', MentorController.getMyStudents);

module.exports = router;
