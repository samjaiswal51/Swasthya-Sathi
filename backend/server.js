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

/* ----------------------- Firebase Admin Init ----------------------- */
/*
   - LOCAL dev:
       ./config/serviceAccountKey.json se read karega (agar file hai).
   - RENDER / PRODUCTION:
       process.env.FIREBASE_SERVICE_ACCOUNT (JSON string) se read karega.
*/

let firebaseInitialized = false;

try {
  let serviceAccountConfig = null;

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // Render / production: env variable se JSON parse
    serviceAccountConfig = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else {
    // Local development: file se try karo (agar ho)
    try {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      serviceAccountConfig = require('./config/serviceAccountKey.json');
    } catch (err) {
      console.warn(
        'No FIREBASE_SERVICE_ACCOUNT env var or local serviceAccountKey.json file found – Firebase notifications will be disabled.'
      );
    }
  }

  if (serviceAccountConfig) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountConfig),
    });
    firebaseInitialized = true;
    console.log('Firebase Admin SDK initialized successfully.');
  } else {
    console.log('Firebase Admin SDK not initialized (no credentials provided).');
  }
} catch (error) {
  console.error('Firebase Admin SDK initialization failed:', error.message);
}

/* -------------------------- MongoDB Connect ------------------------- */

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

/* --------------------------- Express App ---------------------------- */

const app = express();

// CORS: local Vite + deployed Vercel frontend
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      process.env.FRONTEND_URL || 'https://swasthya-sathi-pearl.vercel.app',
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* ----------------------------- Routes ------------------------------- */

app.use('/api/auth', authRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/documents', pdfDocumentRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/reminders', reminderRoutes);

// Save FCM token for logged-in user
app.post(
  '/api/user/save-fcm-token',
  require('./middleware/authMiddleware').protect,
  async (req, res) => {
    if (!req.body.token) {
      return res.status(400).json({ message: 'Token is required.' });
    }
    try {
      await User.findByIdAndUpdate(req.user.id, { fcmToken: req.body.token });
      return res.status(200).json({ message: 'Token saved successfully.' });
    } catch (error) {
      console.error('Error saving FCM token:', error);
      return res
        .status(500)
        .json({ message: 'Server error while saving token.' });
    }
  }
);

app.get('/', (req, res) => {
  res.send('API is running...');
});

/* ------------------------ Cron: Med Reminders ----------------------- */

cron.schedule('* * * * *', async () => {
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(
    now.getMinutes()
  ).padStart(2, '0')}`;
  const currentDay = now.getDay(); // 0=Sunday, 1=Monday, ...

  try {
    const remindersToTrigger = await Reminder.find({
      isActive: true,
      times: currentTime,
      daysOfWeek: currentDay,
    }).populate('user', 'name email fcmToken');

    if (remindersToTrigger.length > 0) {
      console.log(
        `[${currentTime} on day ${currentDay}] Found ${remindersToTrigger.length} reminders to trigger.`
      );

      // Agar Firebase init nahi hua hai to notification skip kar do
      if (!firebaseInitialized) {
        console.warn(
          'Firebase not initialized – skipping push notifications for reminders.'
        );
        return;
      }

      for (const reminder of remindersToTrigger) {
        if (reminder.user && reminder.user.fcmToken) {
          const dosageText = reminder.dosage ? ` (${reminder.dosage})` : '';
          const userName =
            reminder.user.name || reminder.user.email.split('@')[0];

          const message = {
            notification: {
              title: '💊 Medication Reminder',
              body: `Hi ${userName}, it's time to take your ${reminder.medicationName}${dosageText}.`,
            },
            token: reminder.user.fcmToken,
            webpush: {
              fcmOptions: {
                // Deployed frontend URL
                link:
                  process.env.FRONTEND_URL ||
                  'http://localhost:5173',
              },
            },
          };

          admin
            .messaging()
            .send(message)
            .then((response) => {
              console.log(
                `Successfully sent notification to ${reminder.user.email}:`,
                response
              );
            })
            .catch((error) => {
              console.error(
                `Error sending notification to ${reminder.user.email}:`,
                error.message
              );
            });
        }
      }
    }
  } catch (error) {
    console.error('Error in reminder cron job:', error);
  }
});

/* ------------------------- Error Handlers --------------------------- */

app.use(notFound);
app.use(errorHandler);

/* --------------------------- Start Server --------------------------- */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
