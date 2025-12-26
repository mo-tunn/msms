const TaskService = require('../services/TaskService');

class TaskController {
    async createTask(req, res) {
        try {
            const task = await TaskService.createTask(req.body, req.user);
            res.status(201).json(task);
        } catch (error) {
            console.error('Create Task Error:', error);
            res.status(500).json({ message: 'Error creating task', error: error.message });
        }
    }

    async updateTask(req, res) {
        try {
            const task = await TaskService.updateTask(req.params.id, req.body, req.user);
            res.json(task);
        } catch (error) {
            console.error('Update Task Error:', error);
            res.status(500).json({ message: 'Error updating task', error: error.message });
        }
    }

    async getTasks(req, res) {
        try {
            // Assuming req.user contains the logged-in user info
            let studentId = req.user.id;

            // role_id 2 is Mentor
            if (req.user.role_id === 2) {
                // If mentor, check if they requested a specific student's tasks
                if (req.query.studentId) {
                    studentId = parseInt(req.query.studentId);
                    // TODO: Verify this student belongs to this mentor
                } else {
                    // If no student specified, maybe return empty or all?
                    // For schedule page, we usually select a student first.
                    // If no student selected, return empty array.
                    return res.json([]);
                }
            }

            const tasks = await TaskService.getStudentTasks(studentId);
            res.json(tasks);
        } catch (error) {
            console.error('Get Tasks Error:', error);
            res.status(500).json({ message: 'Error fetching tasks', error: error.message });
        }
    }

    async deleteTask(req, res) {
        try {
            await TaskService.deleteTask(req.params.id);
            res.json({ message: 'Task deleted successfully' });
        } catch (error) {
            console.error('Delete Task Error:', error);
            res.status(500).json({ message: 'Error deleting task', error: error.message });
        }
    }
}

module.exports = new TaskController();
