const admin = require('firebase-admin');

if (process.env.FIREBASE_PROJECT_ID) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      })
    });
  } catch (err) {
    console.error('Firebase initialization failed. Push notifications will be disabled:', err.message);
  }
} else {
  console.warn('Firebase push notifications disabled: missing FIREBASE_PROJECT_ID');
}

exports.sendNotification = async (token, payload) => {
  if (!token) return;

  try {
    await admin.messaging().send({
      token,
      notification: {
        title: payload.title,
        body: payload.body
      },
      data: payload.data || {}
    });
    console.log('Push notification sent');
  } catch (error) {
    console.error(`Error sending push notification: ${error.message}`);
  }
};

exports.sendMultipleNotifications = async (tokens, payload) => {
  const validTokens = tokens.filter(t => t);
  if (validTokens.length === 0) return;

  try {
    await admin.messaging().sendMulticast({
      tokens: validTokens,
      notification: {
        title: payload.title,
        body: payload.body
      },
      data: payload.data || {}
    });
    console.log(`Push notifications sent to ${validTokens.length} devices`);
  } catch (error) {
    console.error(`Error sending push notifications: ${error.message}`);
  }
};

module.exports = exports;
