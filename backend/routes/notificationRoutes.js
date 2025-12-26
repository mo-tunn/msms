const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/NotificationController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Send notifications
router.post('/', NotificationController.sendNotification);
router.post('/bulk', NotificationController.sendBulkNotification);

// Get notifications for a user
router.get('/user/:userId', NotificationController.getNotificationsByUser);
router.get('/user/:userId/unread', NotificationController.getUnreadNotifications);
router.get('/user/:userId/unread/count', NotificationController.getUnreadCount);
router.get('/user/:userId/type/:type', NotificationController.getNotificationsByType);

// Get notifications sent by a mentor
router.get('/sent/:senderId', NotificationController.getSentNotifications);

// Notification actions
router.get('/:id', NotificationController.getNotificationById);
router.patch('/:id/read', NotificationController.markAsRead);
router.delete('/:id', NotificationController.deleteNotification);

// Bulk actions for a user
router.patch('/user/:userId/read-all', NotificationController.markAllAsRead);
router.delete('/user/:userId', NotificationController.deleteAllNotifications);

module.exports = router;
