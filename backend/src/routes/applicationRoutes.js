const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post(
  '/',
  protect,
  authorize('volunteer'),
  applicationController.createApplication
);

router.get(
  '/my-applications',
  protect,
  authorize('volunteer'),
  applicationController.getMyApplications
);

router.get(
  '/mission/:missionId',
  protect,
  authorize('organization'),
  applicationController.getApplicationsByMission
);

router.put(
  '/:id/status',
  protect,
  authorize('organization'),
  applicationController.updateApplicationStatus
);

router.put(
  '/:id/cancel',
  protect,
  authorize('volunteer'),
  applicationController.cancelApplication
);

module.exports = router;
