const Application = require('../models/Application');
const Mission = require('../models/Mission');
const User = require('../models/User');
const emailService = require('../services/emailService');
const pushService = require('../services/pushService');

// @desc    Create application
// @route   POST /api/applications
// @access  Private (Volunteer)
exports.createApplication = async (req, res) => {
  try {
    const { missionId, motivation, availability, experience, selectedDates } = req.body;

    const mission = await Mission.findById(missionId);
    if (!mission) {
      return res.status(404).json({ message: 'Mission not found' });
    }

    if (mission.status !== 'published') {
      return res.status(400).json({ message: 'Mission is not accepting applications' });
    }

    const existingApplication = await Application.findOne({
      mission: missionId,
      volunteer: req.user._id
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied to this mission' });
    }

    const application = await Application.create({
      mission: missionId,
      volunteer: req.user._id,
      motivation,
      availability,
      experience,
      selectedDates,
      statusHistory: [{
        status: 'pending',
        changedAt: new Date()
      }]
    });

    mission.applicationsCount += 1;
    await mission.save();

    const organization = await User.findById(mission.organization);
    await emailService.sendNewApplicationEmail(organization.email, mission.title);
    await pushService.sendNotification(organization.fcmToken, {
      title: 'New Application',
      body: `New application for ${mission.title}`
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get applications by mission
// @route   GET /api/applications/mission/:missionId
// @access  Private (Organization)
exports.getApplicationsByMission = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.missionId);

    if (!mission) {
      return res.status(404).json({ message: 'Mission not found' });
    }

    if (mission.organization.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const applications = await Application.find({ mission: req.params.missionId })
      .populate('volunteer', '-password')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get volunteer's applications
// @route   GET /api/applications/my-applications
// @access  Private (Volunteer)
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ volunteer: req.user._id })
      .populate({
        path: 'mission',
        populate: { path: 'organization', select: 'organizationName email' }
      })
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Organization)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status, reason } = req.body;
    const application = await Application.findById(req.params.id).populate('mission volunteer');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const mission = await Mission.findById(application.mission._id);

    if (mission.organization.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (status === 'accepted' && mission.volunteersAccepted >= mission.volunteersNeeded) {
      return res.status(400).json({ message: 'Mission is full' });
    }

    application.status = status;
    application.statusHistory.push({
      status,
      changedBy: req.user._id,
      changedAt: new Date(),
      reason
    });

    await application.save();

    if (status === 'accepted') {
      mission.volunteersAccepted += 1;
      await mission.save();
      await emailService.sendApplicationAcceptedEmail(
        application.volunteer.email,
        mission.title
      );
    } else if (status === 'rejected') {
      await emailService.sendApplicationRejectedEmail(
        application.volunteer.email,
        mission.title,
        reason
      );
    }

    await pushService.sendNotification(application.volunteer.fcmToken, {
      title: 'Application Update',
      body: `Your application for ${mission.title} has been ${status}`
    });

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel application
// @route   PUT /api/applications/:id/cancel
// @access  Private (Volunteer)
exports.cancelApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.volunteer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (application.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel completed application' });
    }

    const previousStatus = application.status;
    application.status = 'cancelled';
    application.statusHistory.push({
      status: 'cancelled',
      changedAt: new Date()
    });

    await application.save();

    if (previousStatus === 'accepted') {
      const mission = await Mission.findById(application.mission);
      mission.volunteersAccepted -= 1;
      await mission.save();
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
