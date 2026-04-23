const User = require('../models/User');
const Mission = require('../models/Mission');
const Application = require('../models/Application');
const Presence = require('../models/Presence');

exports.getGlobalStats = async () => {
  const totalVolunteers = await User.countDocuments({ role: 'volunteer' });
  const totalOrganizations = await User.countDocuments({ role: 'organization' });
  const totalMissions = await Mission.countDocuments();
  const activeMissions = await Mission.countDocuments({ status: 'published' });
  const completedMissions = await Mission.countDocuments({ status: 'completed' });
  const totalApplications = await Application.countDocuments();
  const acceptedApplications = await Application.countDocuments({ status: 'accepted' });

  const totalHoursResult = await User.aggregate([
    { $match: { role: 'volunteer' } },
    { $group: { _id: null, total: { $sum: '$totalHours' } } }
  ]);

  return {
    totalVolunteers,
    totalOrganizations,
    totalMissions,
    activeMissions,
    completedMissions,
    totalApplications,
    acceptedApplications,
    totalHours: totalHoursResult[0]?.total || 0
  };
};

exports.getVolunteerStats = async (volunteerId) => {
  const applications = await Application.countDocuments({ volunteer: volunteerId });
  const accepted = await Application.countDocuments({ volunteer: volunteerId, status: 'accepted' });
  const completed = await Application.countDocuments({ volunteer: volunteerId, status: 'completed' });
  const presences = await Presence.find({ volunteer: volunteerId });
  const totalHours = presences.reduce((sum, p) => sum + (p.duration || 0), 0);

  return { applications, accepted, completed, totalHours };
};

exports.getOrganizationStats = async (organizationId) => {
  const missions = await Mission.countDocuments({ organization: organizationId });
  const activeMissions = await Mission.countDocuments({ organization: organizationId, status: 'published' });
  const completedMissions = await Mission.countDocuments({ organization: organizationId, status: 'completed' });

  const missionIds = await Mission.find({ organization: organizationId }).distinct('_id');
  const totalApplications = await Application.countDocuments({ mission: { $in: missionIds } });
  const acceptedApplications = await Application.countDocuments({ mission: { $in: missionIds }, status: 'accepted' });

  return { missions, activeMissions, completedMissions, totalApplications, acceptedApplications };
};

module.exports = exports;
