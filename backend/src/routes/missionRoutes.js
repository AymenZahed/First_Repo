const express = require('express');
const router = express.Router();
const missionController = require('../controllers/missionController');
const { protect } = require('../middleware/authMiddleware');
const { authorize, requireValidatedOrganization } = require('../middleware/roleMiddleware');

router.get('/', missionController.getMissions);
router.get('/:id', missionController.getMissionById);
router.get('/organization/:id', missionController.getOrganizationMissions);

router.post(
  '/',
  protect,
  authorize('organization'),
  requireValidatedOrganization,
  missionController.createMission
);

router.put(
  '/:id',
  protect,
  authorize('organization'),
  missionController.updateMission
);

router.delete(
  '/:id',
  protect,
  authorize('organization'),
  missionController.deleteMission
);

module.exports = router;
