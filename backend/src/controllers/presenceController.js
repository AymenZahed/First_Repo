const Presence = require('../models/Presence');
const Application = require('../models/Application');
const User = require('../models/User');

exports.checkIn = async (req, res) => {
  try {
    const { applicationId, method, location } = req.body;

    const application = await Application.findById(applicationId);
    if (!application || application.volunteer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const presence = await Presence.create({
      mission: application.mission,
      volunteer: req.user._id,
      application: applicationId,
      checkIn: {
        time: new Date(),
        method,
        location
      }
    });

    res.status(201).json(presence);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.checkOut = async (req, res) => {
  try {
    const presence = await Presence.findById(req.params.id);

    if (!presence || presence.volunteer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    presence.checkOut = {
      time: new Date(),
      method: req.body.method,
      location: req.body.location
    };

    const duration = (presence.checkOut.time - presence.checkIn.time) / 1000 / 60 / 60;
    presence.duration = duration;
    presence.status = 'checked-out';

    await presence.save();

    const user = await User.findById(req.user._id);
    user.totalHours += duration;
    await user.save();

    res.json(presence);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPresenceHistory = async (req, res) => {
  try {
    const presences = await Presence.find({ volunteer: req.user._id })
      .populate('mission', 'title organization')
      .sort({ 'checkIn.time': -1 });
    res.json(presences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
