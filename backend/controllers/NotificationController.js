const NotificationService = require('../services/NotificationService');

class NotificationController {
    /**
     * Send a notification to a single recipient
     * POST /api/notifications
     */
    async sendNotification(req, res) {
        try {
            const { senderId, receiverId, title, message, notificationType, priority } = req.body;

            // Basic validation
            if (!senderId || !receiverId || !title || !message) {
                return res.status(400).json({
                    message: 'Missing required fields: senderId, receiverId, title, message'
                });
            }

            const result = await NotificationService.sendNotification(req.body);
            res.status(201).json(result);
        } catch (error) {
            console.error('Send Notification Error:', error);
            res.status(500).json({ message: 'Error sending notification', error: error.message });
        }
    }

    /**
     * Send notification to multiple recipients (bulk)
     * POST /api/notifications/bulk
     */
    async sendBulkNotification(req, res) {
        try {
            const { senderId, receiverIds, title, message, notificationType, priority } = req.body;

            // Basic validation
            if (!senderId || !title || !message) {
                return res.status(400).json({
                    message: 'Missing required fields: senderId, title, message'
                });
            }

            if (!receiverIds || !Array.isArray(receiverIds) || receiverIds.length === 0) {
                return res.status(400).json({
                    message: 'At least one receiver must be specified'
                });
            }

            const result = await NotificationService.sendBulkNotification(req.body);
            res.status(201).json(result);
        } catch (error) {
            console.error('Send Bulk Notification Error:', error);
            res.status(500).json({ message: 'Error sending notifications', error: error.message });
        }
    }

    /**
     * Get all notifications for a user
     * GET /api/notifications/user/:userId
     */
    async getNotificationsByUser(req, res) {
        try {
            const userId = req.params.userId;
            const notifications = await NotificationService.getNotificationsByUserId(userId);
            res.json(notifications);
        } catch (error) {
            console.error('Get Notifications Error:', error);
            res.status(500).json({ message: 'Error fetching notifications', error: error.message });
        }
    }

    /**
     * Get unread notifications for a user
     * GET /api/notifications/user/:userId/unread
     */
    async getUnreadNotifications(req, res) {
        try {
            const userId = req.params.userId;
            const notifications = await NotificationService.getUnreadNotifications(userId);
            res.json(notifications);
        } catch (error) {
            console.error('Get Unread Notifications Error:', error);
            res.status(500).json({ message: 'Error fetching unread notifications', error: error.message });
        }
    }

    /**
     * Get unread notification count for a user
     * GET /api/notifications/user/:userId/unread/count
     */
    async getUnreadCount(req, res) {
        try {
            const userId = req.params.userId;
            const count = await NotificationService.getUnreadCount(userId);
            res.json({ count });
        } catch (error) {
            console.error('Get Unread Count Error:', error);
            res.status(500).json({ message: 'Error fetching unread count', error: error.message });
        }
    }

    /**
     * Get a specific notification by ID
     * GET /api/notifications/:id
     */
    async getNotificationById(req, res) {
        try {
            const notificationId = req.params.id;
            const notification = await NotificationService.getNotificationById(notificationId);

            if (!notification) {
                return res.status(404).json({ message: 'Notification not found' });
            }

            res.json(notification);
        } catch (error) {
            console.error('Get Notification By Id Error:', error);
            res.status(500).json({ message: 'Error fetching notification', error: error.message });
        }
    }

    /**
     * Mark a notification as read
     * PATCH /api/notifications/:id/read
     */
    async markAsRead(req, res) {
        try {
            const notificationId = req.params.id;
            const result = await NotificationService.markAsRead(notificationId);
            res.json(result);
        } catch (error) {
            console.error('Mark As Read Error:', error);
            res.status(500).json({ message: 'Error marking notification as read', error: error.message });
        }
    }

    /**
     * Mark all notifications as read for a user
     * PATCH /api/notifications/user/:userId/read-all
     */
    async markAllAsRead(req, res) {
        try {
            const userId = req.params.userId;
            const result = await NotificationService.markAllAsRead(userId);
            res.json(result);
        } catch (error) {
            console.error('Mark All As Read Error:', error);
            res.status(500).json({ message: 'Error marking all notifications as read', error: error.message });
        }
    }

    /**
     * Delete a notification
     * DELETE /api/notifications/:id
     */
    async deleteNotification(req, res) {
        try {
            const notificationId = req.params.id;
            const result = await NotificationService.deleteNotification(notificationId);
            res.json(result);
        } catch (error) {
            console.error('Delete Notification Error:', error);
            res.status(500).json({ message: 'Error deleting notification', error: error.message });
        }
    }

    /**
     * Delete all notifications for a user
     * DELETE /api/notifications/user/:userId
     */
    async deleteAllNotifications(req, res) {
        try {
            const userId = req.params.userId;
            const result = await NotificationService.deleteAllNotifications(userId);
            res.json(result);
        } catch (error) {
            console.error('Delete All Notifications Error:', error);
            res.status(500).json({ message: 'Error deleting notifications', error: error.message });
        }
    }

    /**
     * Get notifications sent by a mentor
     * GET /api/notifications/sent/:senderId
     */
    async getSentNotifications(req, res) {
        try {
            const senderId = req.params.senderId;
            const notifications = await NotificationService.getSentNotifications(senderId);
            res.json(notifications);
        } catch (error) {
            console.error('Get Sent Notifications Error:', error);
            res.status(500).json({ message: 'Error fetching sent notifications', error: error.message });
        }
    }

    /**
     * Get notifications filtered by type
     * GET /api/notifications/user/:userId/type/:type
     */
    async getNotificationsByType(req, res) {
        try {
            const { userId, type } = req.params;
            const notifications = await NotificationService.getNotificationsByType(userId, type);
            res.json(notifications);
        } catch (error) {
            console.error('Get Notifications By Type Error:', error);
            res.status(500).json({ message: 'Error fetching notifications by type', error: error.message });
        }
    }
}

module.exports = new NotificationController();
