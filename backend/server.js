const express    = require('express');
const http       = require('http');
const { Server } = require('socket.io');
const mongoose   = require('mongoose');
const cors       = require('cors');
const dotenv     = require('dotenv');

// Load env vars before anything else
dotenv.config();

const authRoutes           = require('./routes/authRoutes');
const profileRoutes        = require('./routes/profileRoutes');
const documentRoutes       = require('./routes/documentRoutes');
const reminderRoutes       = require('./routes/reminderRoutes');
const reportAnalyzerRoutes = require('./routes/reportAnalyzerRoutes');
const emergencyRoutes      = require('./routes/emergencyRoutes');
const doctorRoutes         = require('./routes/doctorRoutes');
const adminRoutes          = require('./routes/adminRoutes');
const chatRoutes           = require('./routes/chatRoutes');
const availabilityRoutes   = require('./routes/availabilityRoutes');
const appointmentRoutes    = require('./routes/appointmentRoutes');
const paymentRoutes        = require('./routes/paymentRoutes');
const doctorStatsRoutes    = require('./routes/doctorStatsRoutes');
const cronService          = require('./services/cronService');
const { initSocket }       = require('./socket');

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

// Middleware
app.use(cors());
app.use(express.json());

// Serve static uploads
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth',                 authRoutes);
app.use('/api/patient/profile',      profileRoutes);
app.use('/api/patient/documents',    documentRoutes);
app.use('/api/patient/reminders',    reminderRoutes);
app.use('/api/patient/report-analyzer', reportAnalyzerRoutes);
app.use('/api/doctor',               doctorRoutes);
app.use('/api/admin',                adminRoutes);
app.use('/api/public',               emergencyRoutes);
app.use('/api/chat',                 chatRoutes);
app.use('/api/health-tips',          require('./routes/healthTipRoutes'));
app.use('/api/update-requests',      require('./routes/updateRequestRoutes'));
app.use('/api/connections',          require('./routes/connectionRoutes'));
app.use('/api/social',               require('./routes/socialRoutes'));
app.use('/api/notifications',        require('./routes/notificationRoutes'));
app.use('/api/availability',         availabilityRoutes);
app.use('/api/appointments',         appointmentRoutes);
app.use('/api/payment',              paymentRoutes);
app.use('/api/doctor-stats',         doctorStatsRoutes);
app.use('/api/settings',             require('./routes/settingsRoutes'));

// Socket.io
initSocket(io);

// Database Connection
const PORT     = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    cronService.startCronJobs();
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
  });

