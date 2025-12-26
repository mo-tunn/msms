const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/students', authMiddleware, UserController.getStudents);
router.get('/mentors', authMiddleware, UserController.getMentors);
router.get('/', authMiddleware, UserController.getAllUsers);
router.get('/:id', authMiddleware, UserController.getUserById);
router.get('/mentor/:id/students', authMiddleware, UserController.getStudentsByMentorId);
router.put('/:id', authMiddleware, UserController.updateUser);
router.delete('/:id', authMiddleware, UserController.deleteUser);

module.exports = router;
