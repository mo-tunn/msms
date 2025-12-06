const NotificationRepository = require('../repositories/NotificationRepository');

class NotificationService {
    /**
     * Send a notification to a single recipient
     */
    async sendNotification(notificationData) {
        const { senderId, receiverId, title, message, notificationType, priority } = notificationData;

        const notification = await NotificationRepository.createNotification(
            senderId,
            receiverId,
            title,
            message,
            notificationType || 'Duyuru',
            priority || 'Normal'
        );

        return this.formatNotification(notification);
    }

    /**
     * Send notification to multiple recipients (bulk send)
     */
    async sendBulkNotification(notificationData) {
        const { senderId, receiverIds, title, message, notificationType, priority } = notificationData;

        if (!receiverIds || !Array.isArray(receiverIds) || receiverIds.length === 0) {
            throw new Error('At least one receiver must be specified');
        }

        const notifications = await NotificationRepository.createBulkNotifications(
            senderId,
            receiverIds,
            title,
            message,
            notificationType || 'Duyuru',
            priority || 'Normal'
        );

        return {
            success: true,
            sentCount: notifications.length,
            notifications: notifications.map(n => this.formatNotification(n))
        };
    }

    /**
     * Get all notifications for a user
     */
    async getNotificationsByUserId(userId) {
        const notifications = await NotificationRepository.getNotificationsByReceiverId(userId);
        return notifications.map(n => this.formatNotification(n));
    }

    /**
     * Get unread notifications for a user
     */
    async getUnreadNotifications(userId) {
        const notifications = await NotificationRepository.getUnreadNotificationsByReceiverId(userId);
        return notifications.map(n => this.formatNotification(n));
    }

    /**
     * Get unread notification count for a user
     */
    async getUnreadCount(userId) {
        return await NotificationRepository.getUnreadCountByReceiverId(userId);
    }

    /**
     * Get a single notification by ID
     */
    async getNotificationById(notificationId) {
        const notification = await NotificationRepository.getNotificationById(notificationId);
        if (!notification) return null;
        return this.formatNotification(notification);
    }

    /**
     * Mark a notification as read
     */
    async markAsRead(notificationId) {
        const notification = await NotificationRepository.markAsRead(notificationId);
        if (!notification) {
            throw new Error('Notification not found');
        }
        return this.formatNotification(notification);
    }

    /**
     * Mark all notifications as read for a user
     */
    async markAllAsRead(userId) {
        const count = await NotificationRepository.markAllAsRead(userId);
        return { success: true, markedCount: count };
    }

    /**
     * Delete a notification
     */
    async deleteNotification(notificationId) {
        const deletedId = await NotificationRepository.deleteNotification(notificationId);
        if (!deletedId) {
            throw new Error('Notification not found');
        }
        return { success: true, deletedId };
    }

    /**
     * Delete all notifications for a user
     */
    async deleteAllNotifications(userId) {
        const count = await NotificationRepository.deleteAllByReceiverId(userId);
        return { success: true, deletedCount: count };
    }

    /**
     * Get notifications sent by a mentor
     */
    async getSentNotifications(senderId) {
        const notifications = await NotificationRepository.getNotificationsBySenderId(senderId);
        return notifications.map(n => this.formatSentNotification(n));
    }

    /**
     * Get notifications filtered by type
     */
    async getNotificationsByType(userId, notificationType) {
        const validTypes = ['Tümü', 'Akademik', 'Duyuru', 'Hatırlatma', 'Motivasyon', 'Mesaj', 'Ödev'];
        if (!validTypes.includes(notificationType)) {
            throw new Error('Invalid notification type');
        }
        const notifications = await NotificationRepository.getNotificationsByType(userId, notificationType);
        return notifications.map(n => this.formatNotification(n));
    }

    /**
     * Convert UTC date to UTC+3 (Turkey timezone)
     */
    convertToUTC3(date) {
        if (!date) return null;
        const utcDate = new Date(date);
        // Add 3 hours for UTC+3
        const utc3Date = new Date(utcDate.getTime() + (3 * 60 * 60 * 1000));
        return utc3Date.toISOString();
    }

    /**
     * Format notification for response (receiver perspective)
     */
    formatNotification(notification) {
        return {
            id: notification.id,
            senderId: notification.sender_id,
            receiverId: notification.receiver_id,
            title: notification.title,
            message: notification.message,
            isRead: notification.is_read,
            notificationType: notification.notification_type,
            priority: notification.priority,
            createdAt: this.convertToUTC3(notification.created_at),
            sender: notification.sender_first_name ? {
                firstName: notification.sender_first_name,
                lastName: notification.sender_last_name,
                avatarUrl: notification.sender_avatar_url
            } : null
        };
    }

    /**
     * Format notification for response (sender perspective)
     */
    formatSentNotification(notification) {
        return {
            id: notification.id,
            senderId: notification.sender_id,
            receiverId: notification.receiver_id,
            title: notification.title,
            message: notification.message,
            isRead: notification.is_read,
            notificationType: notification.notification_type,
            priority: notification.priority,
            createdAt: this.convertToUTC3(notification.created_at),
            receiver: notification.receiver_first_name ? {
                firstName: notification.receiver_first_name,
                lastName: notification.receiver_last_name
            } : null
        };
    }
}

module.exports = new NotificationService();
