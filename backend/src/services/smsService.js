const twilio = require('twilio');

let client = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_ACCOUNT_SID.startsWith('AC')) {
  client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
} else {
  console.warn('Twilio SMS disabled: Missing or invalid TWILIO_ACCOUNT_SID');
}

exports.sendSMS = async (to, message) => {
  try {
    if (!client) {
      console.warn(`SMS simulation to ${to}: ${message}`);
      return;
    }
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to
    });
    console.log(`SMS sent to ${to}`);
  } catch (error) {
    console.error(`Error sending SMS: ${error.message}`);
    throw error;
  }
};

exports.sendMissionReminder = async (phone, missionTitle, date) => {
  const message = `Reminder: You have a volunteer mission "${missionTitle}" on ${date}`;
  await this.sendSMS(phone, message);
};

module.exports = exports;
