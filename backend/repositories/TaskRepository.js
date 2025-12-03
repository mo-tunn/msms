const pool = require('../config/db');

class TaskRepository {
    async create(task) {
        const { student_id, mentor_id, title, description, status, priority, start_time, end_time, deadline } = task;
        const query = `
            INSERT INTO tasks (student_id, mentor_id, title, description, status, priority, start_time, end_time, deadline)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        `;
        const values = [student_id, mentor_id, title, description, status, priority, start_time, end_time, deadline];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    async update(id, task) {
        const query = `
            UPDATE tasks
            SET title = COALESCE($2, title),
                description = COALESCE($3, description),
                status = COALESCE($4, status),
                priority = COALESCE($5, priority),
                start_time = COALESCE($6, start_time),
                end_time = COALESCE($7, end_time),
                deadline = COALESCE($8, deadline)
            WHERE id = $1
            RETURNING *
        `;
        const values = [id, task.title, task.description, task.status, task.priority, task.start_time, task.end_time, task.deadline];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    async findByStudentId(studentId) {
        const query = 'SELECT * FROM tasks WHERE student_id = $1 ORDER BY start_time ASC';
        const result = await pool.query(query, [studentId]);
        return result.rows;
    }

    async findById(id) {
        const query = 'SELECT * FROM tasks WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    async delete(id) {
        const query = 'DELETE FROM tasks WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    async markOverdueTasks(studentId) {
        const query = `
            UPDATE tasks
            SET status = 'Overdue'
            WHERE student_id = $1 
            AND status = 'Pending' 
            AND deadline < NOW()
        `;
        await pool.query(query, [studentId]);
    }
}

module.exports = new TaskRepository();
