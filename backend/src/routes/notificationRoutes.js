const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.put('/fcm-token', protect, notificationController.updateFCMToken);
router.put('/settings', protect, notificationController.updateNotificationSettings);

module.exports = router;
