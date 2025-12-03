const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/TaskController');
const authMiddleware = require('../middleware/authMiddleware'); // Assuming this exists

// Apply auth middleware to all routes
router.use(authMiddleware);

router.post('/', TaskController.createTask);
router.get('/', TaskController.getTasks);
router.put('/:id', TaskController.updateTask);
router.delete('/:id', TaskController.deleteTask);

module.exports = router;
