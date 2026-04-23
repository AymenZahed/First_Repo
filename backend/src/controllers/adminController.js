const User = require('../models/User');
const Mission = require('../models/Mission');
const Application = require('../models/Application');
const statsService = require('../services/statsService');

exports.getPendingOrganizations = async (req, res) => {
  try {
    const organizations = await User.find({
      role: 'organization',
      isValidated: false
    }).select('-password');
    res.json(organizations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.validateOrganization = async (req, res) => {
  try {
    const organization = await User.findById(req.params.id);
    organization.isValidated = true;
    organization.validatedBy = req.user._id;
    organization.validatedAt = new Date();
    await organization.save();
    res.json(organization);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getGlobalStats = async (req, res) => {
  try {
    const stats = await statsService.getGlobalStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deactivateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.isActive = false;
    await user.save();
    res.json({ message: 'User deactivated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
