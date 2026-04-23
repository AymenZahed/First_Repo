const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/organizations/pending', adminController.getPendingOrganizations);
router.put('/organizations/:id/validate', adminController.validateOrganization);
router.get('/stats', adminController.getGlobalStats);
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/deactivate', adminController.deactivateUser);

module.exports = router;
