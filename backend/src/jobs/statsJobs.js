const cron = require('node-cron');
const User = require('../models/User');
const Mission = require('../models/Mission');
const redisClient = require('../config/redis');

// Update cached stats every hour
exports.updateGlobalStats = cron.schedule('0 * * * *', async () => {
  console.log('Updating global stats cache...');

  try {
    const stats = {
      totalVolunteers: await User.countDocuments({ role: 'volunteer' }),
      totalOrganizations: await User.countDocuments({ role: 'organization' }),
      totalMissions: await Mission.countDocuments(),
      activeMissions: await Mission.countDocuments({ status: 'published' }),
      timestamp: new Date()
    };

    await redisClient.set('global_stats', JSON.stringify(stats), 'EX', 3600);

    console.log('Global stats updated');
  } catch (error) {
    console.error('Error updating global stats:', error);
  }
});

// Update mission status based on dates
exports.updateMissionStatus = cron.schedule('0 0 * * *', async () => {
  console.log('Updating mission statuses...');

  try {
    const now = new Date();

    // Mark missions as ongoing if start date has passed
    await Mission.updateMany(
      {
        status: 'published',
        'dates.0.startDate': { $lte: now }
      },
      { status: 'ongoing' }
    );

    // Mark missions as completed if end date has passed
    await Mission.updateMany(
      {
        status: 'ongoing',
        'dates.0.endDate': { $lte: now }
      },
      { status: 'completed' }
    );

    console.log('Mission statuses updated');
  } catch (error) {
    console.error('Error updating mission statuses:', error);
  }
});

module.exports = exports;
