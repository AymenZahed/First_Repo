const pushService = require('../services/pushService');
const User = require('../models/User');

exports.updateFCMToken = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.fcmToken = req.body.token;
    await user.save();
    res.json({ message: 'FCM token updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateNotificationSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.notifications = req.body;
    await user.save();
    res.json(user.notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
