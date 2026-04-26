const webpush = require('web-push');

// Statically generated VAPID keys for Swasthya Sathi Push Notifications
const publicVapidKey = 'BMNt1dhwihkGNWlD6N-FU73toSu7Kp07m4D6du3xoH_yqn0MZS-uLZwLDGlEbBKJ1ZoQKjVd3R0YaoWUgy-eoFE';
const privateVapidKey = '2MH9qjq_6vHHcOudUKTfDZvDK5P3Nzsa-5fDCmhd8r0';

webpush.setVapidDetails(
  'mailto:support@swasthyasathi.com',
  publicVapidKey,
  privateVapidKey
);

module.exports = webpush;
