const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

router.get('/:id', userController.getProfile);
router.put('/profile', protect, userController.updateProfile);
router.post('/upload-picture', protect, upload.single('image'), userController.uploadProfilePicture);
router.delete('/profile', protect, userController.deleteProfile);

module.exports = router;
