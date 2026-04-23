const cron = require('node-cron');
const User = require('../models/User');
const Message = require('../models/Message');
const redisClient = require('../config/redis');

// Delete unverified users after 7 days
exports.cleanupUnverifiedUsers = cron.schedule('0 2 * * *', async () => {
  console.log('Cleaning up unverified users...');

  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const result = await User.deleteMany({
      isVerified: false,
      createdAt: { $lt: sevenDaysAgo }
    });

    console.log(`Deleted ${result.deletedCount} unverified users`);
  } catch (error) {
    console.error('Error cleaning up unverified users:', error);
  }
});

// Delete old messages (older than 1 year)
exports.cleanupOldMessages = cron.schedule('0 3 * * 0', async () => {
  console.log('Cleaning up old messages...');

  try {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const result = await Message.deleteMany({
      createdAt: { $lt: oneYearAgo }
    });

    console.log(`Deleted ${result.deletedCount} old messages`);
  } catch (error) {
    console.error('Error cleaning up old messages:', error);
  }
});

// Clear Redis cache for expired keys
exports.clearExpiredCache = cron.schedule('0 4 * * *', async () => {
  console.log('Clearing expired cache...');

  try {
    const keys = await redisClient.keys('*');
    let cleared = 0;

    for (const key of keys) {
      const ttl = await redisClient.ttl(key);
      if (ttl === -2) {
        await redisClient.del(key);
        cleared++;
      }
    }

    console.log(`Cleared ${cleared} expired cache keys`);
  } catch (error) {
    console.error('Error clearing expired cache:', error);
  }
});

module.exports = exports;
