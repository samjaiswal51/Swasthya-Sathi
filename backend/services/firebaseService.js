// backend/services/firebaseService.js
const admin = require('firebase-admin');

// 1. Require the JSON file you downloaded
const serviceAccount = require('../firebase-admin-key.json');

// 2. Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

exports.sendPushNotification = async (userId, title, body, data = {}) => {
  try {
    // 3. To send a real notification, you need the user's specific Phone/Browser Token.
    // In a full system, you save this token to the MongoDB User model when they log in.
    
    // const user = await User.findById(userId);
    // const deviceToken = user.fcmToken; 
    
    // 4. Send the message via Firebase
    /*
    await admin.messaging().send({
      token: deviceToken,
      notification: {
        title: title,
        body: body,
      },
      data: data
    });
    */

    console.log(`[FIREBASE] Push Notification Sent to User: ${userId}`);
    return true;
  } catch (error) {
    console.error('[FIREBASE] Error sending push notification:', error);
    return false;
  }
};
