const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/authMiddleware');

// Get all notifications
router.get('/', auth, notificationController.getNotifications);

// Mark all as read
router.put('/mark-all-read', auth, notificationController.markAllAsRead);

// Mark specific as read
router.put('/:id/read', auth, notificationController.markAsRead);

// Delete notification
router.delete('/:id', auth, notificationController.deleteNotification);

module.exports = router;
