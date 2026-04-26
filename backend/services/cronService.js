const cron = require('node-cron');
const Reminder = require('../models/Reminder');
const webpush = require('../config/webpush');

// Format Date object to "HH:MM AM/PM" strictly
const formatTimeTo12Hour = (date) => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
};

const startCronJobs = () => {
  console.log('[CRON] Medication Reminder Service Started');

  // Run every minute at 0 seconds
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      const currentFormattedTime = formatTimeTo12Hour(now);
      
      // Find all active reminders
      const activeReminders = await Reminder.find({ status: 'active' }).populate('user', 'name email pushSubscription');

      for (let reminder of activeReminders) {
        // 1. Check if today is within startDate and endDate
        // Strip time from today for accurate date comparison
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const start = new Date(reminder.startDate);
        start.setHours(0, 0, 0, 0);

        if (today < start) continue; // Hasn't started yet

        if (reminder.endDate) {
          const end = new Date(reminder.endDate);
          end.setHours(0, 0, 0, 0);
          if (today > end) {
            // Auto pause if past end date
            reminder.status = 'paused';
            await reminder.save();
            continue;
          }
        }

        // 2. Check if current time matches any of the reminder times
        if (reminder.times.includes(currentFormattedTime)) {
          
          // Check if it was already marked as Taken for this specific date and time
          const alreadyTaken = reminder.takenHistory.some(history => {
            const historyDate = new Date(history.date);
            historyDate.setHours(0,0,0,0);
            return historyDate.getTime() === today.getTime() && history.scheduledTime === currentFormattedTime && history.status === 'Taken';
          });

          if (!alreadyTaken) {
             // 3. Trigger Push Notification via Firebase Structure
             const title = 'Time for your Medicine! 💊';
             let body = `Please take ${reminder.dose} of ${reminder.medicineName}.`;
             if (reminder.mealTiming !== 'Any Time') {
                body += ` (${reminder.mealTiming})`;
             }
             if (reminder.waterReminder) {
                body += ` Remember to drink a glass of water! 💧`;
             }

             if (reminder.user.pushSubscription) {
                const payload = JSON.stringify({
                  title,
                  body,
                  icon: '/logo.png', // Optional icon, add to public/ if needed
                  url: '/patient-dashboard/reminders'
                });

                webpush.sendNotification(reminder.user.pushSubscription, payload)
                  .then(response => console.log(`[WEB PUSH] Sent successfully to ${reminder.user.name}`))
                  .catch(err => console.error('[WEB PUSH Error]', err));
             } else {
                console.log(`[WEB PUSH] Skipped: ${reminder.user.name} has no push subscription.`);
             }
          }
        }
      }
    } catch (error) {
      console.error('[CRON Error] Failed to process reminders:', error);
    }
  });
};

module.exports = { startCronJobs };
