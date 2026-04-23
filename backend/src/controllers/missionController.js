const Mission = require('../models/Mission');
const Application = require('../models/Application');
const qrCodeService = require('../services/qrCodeService');
const geocodingService = require('../services/geocodingService');

// @desc    Get all missions with filters
// @route   GET /api/missions
// @access  Public
exports.getMissions = async (req, res) => {
  try {
    const {
      category,
      city,
      type,
      status = 'published',
      latitude,
      longitude,
      radius = 50,
      page = 1,
      limit = 12
    } = req.query;

    let query = { status };

    if (category) query.category = category;
    if (city) query['location.city'] = new RegExp(city, 'i');
    if (type) query.type = type;

    // Geospatial query
    if (latitude && longitude) {
      query['location.coordinates'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      };
    }

    const missions = await Mission.find(query)
      .populate('organization', 'organizationName logo email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Mission.countDocuments(query);

    res.json({
      missions,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get mission by ID
// @route   GET /api/missions/:id
// @access  Public
exports.getMissionById = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id)
      .populate('organization', '-password');

    if (!mission) {
      return res.status(404).json({ message: 'Mission not found' });
    }

    // Increment views
    mission.views += 1;
    await mission.save();

    res.json(mission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new mission
// @route   POST /api/missions
// @access  Private (Organization)
exports.createMission = async (req, res) => {
  try {
    const missionData = {
      ...req.body,
      organization: req.user._id
    };

    // Geocode address if provided
    if (missionData.location && missionData.location.address) {
      const coords = await geocodingService.geocode(missionData.location.address);
      if (coords) {
        missionData.location.coordinates = {
          type: 'Point',
          coordinates: [coords.longitude, coords.latitude]
        };
      }
    }

    const mission = await Mission.create(missionData);

    // Generate QR code
    const qrCode = await qrCodeService.generateQRCode(mission._id.toString());
    mission.qrCode = qrCode;
    await mission.save();

    res.status(201).json(mission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update mission
// @route   PUT /api/missions/:id
// @access  Private (Organization)
exports.updateMission = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);

    if (!mission) {
      return res.status(404).json({ message: 'Mission not found' });
    }

    if (mission.organization.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update geocoding if address changed
    if (req.body.location && req.body.location.address) {
      const coords = await geocodingService.geocode(req.body.location.address);
      if (coords) {
        req.body.location.coordinates = {
          type: 'Point',
          coordinates: [coords.longitude, coords.latitude]
        };
      }
    }

    Object.assign(mission, req.body);
    await mission.save();

    res.json(mission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete mission
// @route   DELETE /api/missions/:id
// @access  Private (Organization)
exports.deleteMission = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);

    if (!mission) {
      return res.status(404).json({ message: 'Mission not found' });
    }

    if (mission.organization.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if there are accepted applications
    const acceptedApplications = await Application.countDocuments({
      mission: mission._id,
      status: 'accepted'
    });

    if (acceptedApplications > 0) {
      return res.status(400).json({
        message: 'Cannot delete mission with accepted applications'
      });
    }

    await mission.deleteOne();
    res.json({ message: 'Mission deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get organization's missions
// @route   GET /api/missions/organization/:id
// @access  Public
exports.getOrganizationMissions = async (req, res) => {
  try {
    const missions = await Mission.find({ organization: req.params.id })
      .sort({ createdAt: -1 });

    res.json(missions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
