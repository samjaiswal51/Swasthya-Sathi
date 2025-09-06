// backend/server.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const cron = require('node-cron');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const admin = require('firebase-admin');

const Reminder = require('./models/reminderModel');
const User = require('./models/User');

const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const pdfDocumentRoutes = require('./routes/pdfDocument.routes');
const doctorRoutes = require('./routes/doctorRoutes');
const reminderRoutes = require('./routes/reminderRoutes');

dotenv.config();

try {
    const serviceAccount = require('./config/serviceAccountKey.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin SDK initialized successfully.');
} catch (error) {
    console.error('Firebase Admin SDK initialization failed:', error.message);
    console.log('Please ensure you have a valid "serviceAccountKey.json" in the "/backend/config" directory.');
}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Atlas connected successfully!');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};
connectDB();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/auth', authRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/documents', pdfDocumentRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/reminders', reminderRoutes);

app.post('/api/user/save-fcm-token', require('./middleware/authMiddleware').protect, async (req, res) => {
    if (!req.body.token) {
        return res.status(400).json({ message: 'Token is required.' });
    }
    try {
        await User.findByIdAndUpdate(req.user.id, { fcmToken: req.body.token });
        res.status(200).json({ message: 'Token saved successfully.'});
    } catch (error) {
        console.error('Error saving FCM token:', error);
        res.status(500).json({ message: 'Server error while saving token.' });
    }
});

app.get('/', (req, res) => {
  res.send('API is running...');
});

cron.schedule('* * * * *', async () => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const currentDay = now.getDay(); // 0=Sunday, 1=Monday, ...

    try {
      const remindersToTrigger = await Reminder.find({
        isActive: true,
        times: currentTime,
        daysOfWeek: currentDay,
      }).populate('user', 'name email fcmToken');

      if (remindersToTrigger.length > 0) {
        console.log(`[${currentTime} on day ${currentDay}] Found ${remindersToTrigger.length} reminders to trigger.`);
        
        for (const reminder of remindersToTrigger) {
          if (reminder.user && reminder.user.fcmToken) {
            const dosageText = reminder.dosage ? ` (${reminder.dosage})` : '';
            const userName = reminder.user.name || reminder.user.email.split('@')[0];

            const message = {
              notification: {
                title: "💊 Medication Reminder",
                body: `Hi ${userName}, it's time to take your ${reminder.medicationName}${dosageText}.`
              },
              token: reminder.user.fcmToken,
              webpush: {
                fcmOptions: {
                  link: 'http://localhost:5173'
                }
              }
            };

            admin.messaging().send(message)
              .then((response) => {
                console.log(`Successfully sent notification to ${reminder.user.email}:`, response);
              })
              .catch((error) => {
                console.error(`Error sending notification to ${reminder.user.email}:`, error.message);
              });
          }
        }
      }
    } catch (error) {
      console.error('Error in reminder cron job:', error);
    }
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));