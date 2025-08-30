const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Add path module for static serving

// NEW ADDITIONS START HERE
const fileUpload = require('express-fileupload');
// NEW ADDITIONS END HERE

const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');

// NEW ADDITIONS START HERE
const pdfDocumentRoutes = require('./routes/pdfDocument.routes');
// NEW ADDITIONS END HERE

const app = express();

// --- Middleware ---
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// NEW ADDITIONS START HERE
// Middleware for handling file uploads
app.use(fileUpload());

// Middleware to serve uploaded files statically
// This makes files in the 'uploads' directory accessible via URL
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// NEW ADDITIONS END HERE


// --- Database Connection ---
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

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/patient', patientRoutes);

// NEW ADDITIONS START HERE
app.use('/api/documents', pdfDocumentRoutes);
// NEW ADDITIONS END HERE


// --- Basic Route for Testing ---
app.get('/', (req, res) => {
  res.send('API is running...');
});

// --- Server Startup ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));