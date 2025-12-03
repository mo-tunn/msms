const TaskRepository = require('../repositories/TaskRepository');

class TaskService {
    async createTask(taskData, user) {
        const { date, startTime, endTime, title, description, priority, studentId } = taskData;

        const startTimestamp = new Date(`${date}T${startTime}:00`);
        const endTimestamp = new Date(`${date}T${endTime}:00`);
        const deadlineTimestamp = new Date(endTimestamp.getTime() + 24 * 60 * 60 * 1000);

        let targetStudentId = user.id;
        let mentorId = null;

        // role_id 2 is Mentor
        if (user.role_id === 2) {
            if (!studentId) {
                throw new Error('Student ID is required for mentors to create tasks');
            }
            // Verify student belongs to mentor? For now assuming yes or checking later.
            targetStudentId = studentId;
            mentorId = user.id;
        }

        const newTask = {
            student_id: targetStudentId,
            mentor_id: mentorId,
            title,
            description,
            status: 'Pending',
            priority,
            start_time: startTimestamp,
            end_time: endTimestamp,
            deadline: deadlineTimestamp
        };

        return await TaskRepository.create(newTask);
    }

    async updateTask(taskId, taskData, user) {
        // Verify ownership
        const existingTask = await TaskRepository.findById(taskId);
        if (!existingTask) {
            throw new Error('Task not found');
        }

        if (existingTask.student_id !== user.id && existingTask.mentor_id !== user.id) {
            if (user.role_id === 2) {
                // Allow mentor
            } else {
                throw new Error('Unauthorized');
            }
        }

        if (existingTask.status === 'Overdue') {
            throw new Error('Cannot update overdue tasks');
        }

        const updates = {};
        if (taskData.title) updates.title = taskData.title;
        if (taskData.description) updates.description = taskData.description;
        if (taskData.priority) updates.priority = taskData.priority;
        if (taskData.status) updates.status = taskData.status;

        // Recalculate timestamps if date/time changes
        if (taskData.date || taskData.startTime || taskData.endTime) {
            const currentStart = new Date(existingTask.start_time);
            const currentEnd = new Date(existingTask.end_time);

            // Extract current date/time parts if not provided
            const dateStr = taskData.date || currentStart.toISOString().split('T')[0];
            const startTimeStr = taskData.startTime || currentStart.toTimeString().slice(0, 5);
            const endTimeStr = taskData.endTime || currentEnd.toTimeString().slice(0, 5);

            const newStart = new Date(`${dateStr}T${startTimeStr}:00`);
            const newEnd = new Date(`${dateStr}T${endTimeStr}:00`);
            const newDeadline = new Date(newEnd.getTime() + 24 * 60 * 60 * 1000);

            updates.start_time = newStart;
            updates.end_time = newEnd;
            updates.deadline = newDeadline;
        }

        return await TaskRepository.update(taskId, updates);
    }

    async getStudentTasks(studentId) {
        await TaskRepository.markOverdueTasks(studentId);
        return await TaskRepository.findByStudentId(studentId);
    }

    async deleteTask(taskId) {
        const existingTask = await TaskRepository.findById(taskId);
        if (existingTask && existingTask.status === 'Overdue') {
            throw new Error('Cannot delete overdue tasks');
        }
        return await TaskRepository.delete(taskId);
    }
}

module.exports = new TaskService();
