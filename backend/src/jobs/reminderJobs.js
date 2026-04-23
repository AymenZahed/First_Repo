const cron = require('node-cron');
const Mission = require('../models/Mission');
const Application = require('../models/Application');
const User = require('../models/User');
const emailService = require('../services/emailService');
const smsService = require('../services/smsService');
const pushService = require('../services/pushService');

// Send reminders 24 hours before mission
exports.sendMissionReminders = cron.schedule('0 9 * * *', async () => {
  console.log('Running mission reminder job...');

  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);

    const missions = await Mission.find({
      status: 'published',
      'dates.startDate': {
        $gte: tomorrow,
        $lt: dayAfter
      }
    });

    for (const mission of missions) {
      const applications = await Application.find({
        mission: mission._id,
        status: 'accepted'
      }).populate('volunteer');

      for (const application of applications) {
        const volunteer = application.volunteer;

        if (volunteer.notifications.email) {
          await emailService.sendMissionReminderEmail(
            volunteer.email,
            mission.title,
            mission.dates[0].startDate
          );
        }

        if (volunteer.notifications.sms && volunteer.phone) {
          await smsService.sendMissionReminder(
            volunteer.phone,
            mission.title,
            mission.dates[0].startDate
          );
        }

        if (volunteer.notifications.push && volunteer.fcmToken) {
          await pushService.sendNotification(volunteer.fcmToken, {
            title: 'Mission Reminder',
            body: `Don't forget your mission "${mission.title}" tomorrow!`
          });
        }
      }
    }

    console.log('Mission reminder job completed');
  } catch (error) {
    console.error('Error in mission reminder job:', error);
  }
});

module.exports = exports;
