const pool = require('../config/db');

class NotificationRepository {
    /**
     * Create a new notification
     */
    async createNotification(senderId, receiverId, title, message, notificationType, priority) {
        const query = `
            INSERT INTO notifications (sender_id, receiver_id, title, message, notification_type, priority)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        const result = await pool.query(query, [senderId, receiverId, title, message, notificationType, priority]);
        return result.rows[0];
    }

    /**
     * Create multiple notifications (bulk)
     */
    async createBulkNotifications(senderId, receiverIds, title, message, notificationType, priority) {
        const notifications = [];
        for (const receiverId of receiverIds) {
            const notification = await this.createNotification(
                senderId,
                receiverId,
                title,
                message,
                notificationType,
                priority
            );
            notifications.push(notification);
        }
        return notifications;
    }

    /**
     * Get all notifications for a user (receiver)
     */
    async getNotificationsByReceiverId(receiverId) {
        const query = `
            SELECT 
                n.*,
                u.first_name as sender_first_name,
                u.last_name as sender_last_name,
                u.avatar_url as sender_avatar_url
            FROM notifications n
            LEFT JOIN users u ON n.sender_id = u.id
            WHERE n.receiver_id = $1
            ORDER BY n.created_at DESC
        `;
        const result = await pool.query(query, [receiverId]);
        return result.rows;
    }

    /**
     * Get unread notifications for a user
     */
    async getUnreadNotificationsByReceiverId(receiverId) {
        const query = `
            SELECT 
                n.*,
                u.first_name as sender_first_name,
                u.last_name as sender_last_name,
                u.avatar_url as sender_avatar_url
            FROM notifications n
            LEFT JOIN users u ON n.sender_id = u.id
            WHERE n.receiver_id = $1 AND n.is_read = FALSE
            ORDER BY n.created_at DESC
        `;
        const result = await pool.query(query, [receiverId]);
        return result.rows;
    }

    /**
     * Get unread notifications count for a user
     */
    async getUnreadCountByReceiverId(receiverId) {
        const query = `
            SELECT COUNT(*) as count
            FROM notifications
            WHERE receiver_id = $1 AND is_read = FALSE
        `;
        const result = await pool.query(query, [receiverId]);
        return parseInt(result.rows[0].count, 10);
    }

    /**
     * Get a notification by ID
     */
    async getNotificationById(notificationId) {
        const query = `
            SELECT 
                n.*,
                u.first_name as sender_first_name,
                u.last_name as sender_last_name,
                u.avatar_url as sender_avatar_url
            FROM notifications n
            LEFT JOIN users u ON n.sender_id = u.id
            WHERE n.id = $1
        `;
        const result = await pool.query(query, [notificationId]);
        return result.rows[0];
    }

    /**
     * Mark a notification as read
     */
    async markAsRead(notificationId) {
        const query = `
            UPDATE notifications
            SET is_read = TRUE
            WHERE id = $1
            RETURNING *
        `;
        const result = await pool.query(query, [notificationId]);
        return result.rows[0];
    }

    /**
     * Mark all notifications as read for a user
     */
    async markAllAsRead(receiverId) {
        const query = `
            UPDATE notifications
            SET is_read = TRUE
            WHERE receiver_id = $1 AND is_read = FALSE
            RETURNING id
        `;
        const result = await pool.query(query, [receiverId]);
        return result.rows.length;
    }

    /**
     * Delete a notification
     */
    async deleteNotification(notificationId) {
        const query = 'DELETE FROM notifications WHERE id = $1 RETURNING id';
        const result = await pool.query(query, [notificationId]);
        return result.rows[0]?.id;
    }

    /**
     * Delete all notifications for a user
     */
    async deleteAllByReceiverId(receiverId) {
        const query = 'DELETE FROM notifications WHERE receiver_id = $1 RETURNING id';
        const result = await pool.query(query, [receiverId]);
        return result.rows.length;
    }

    /**
     * Get notifications sent by a user (for mentors)
     */
    async getNotificationsBySenderId(senderId) {
        const query = `
            SELECT 
                n.*,
                receiver.first_name as receiver_first_name,
                receiver.last_name as receiver_last_name
            FROM notifications n
            LEFT JOIN users receiver ON n.receiver_id = receiver.id
            WHERE n.sender_id = $1
            ORDER BY n.created_at DESC
        `;
        const result = await pool.query(query, [senderId]);
        return result.rows;
    }

    /**
     * Get notifications by type for a user
     */
    async getNotificationsByType(receiverId, notificationType) {
        const query = `
            SELECT 
                n.*,
                u.first_name as sender_first_name,
                u.last_name as sender_last_name,
                u.avatar_url as sender_avatar_url
            FROM notifications n
            LEFT JOIN users u ON n.sender_id = u.id
            WHERE n.receiver_id = $1 AND n.notification_type = $2
            ORDER BY n.created_at DESC
        `;
        const result = await pool.query(query, [receiverId, notificationType]);
        return result.rows;
    }
}

module.exports = new NotificationRepository();
