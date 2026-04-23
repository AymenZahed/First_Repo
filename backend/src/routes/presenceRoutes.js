const express = require('express');
const router = express.Router();
const presenceController = require('../controllers/presenceController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/check-in', protect, authorize('volunteer'), presenceController.checkIn);
router.put('/:id/check-out', protect, authorize('volunteer'), presenceController.checkOut);
router.get('/history', protect, authorize('volunteer'), presenceController.getPresenceHistory);

module.exports = router;
