const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
}, { _id: false });

const doctorProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required.'],
    trim: true,
  },
  profilePicture: {
    type: String,
    default: 'https://via.placeholder.com/150', // Default placeholder
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required.'],
  },
  licenseNumber: {
    type: String,
    required: [true, 'Medical license number is required.'],
    unique: true,
  },
  specialization: {
    type: String,
    required: [true, 'Specialization is required.'],
  },
  qualifications: {
    type: [String],
    required: [true, 'At least one qualification is required.'],
  },
  yearsOfExperience: {
    type: Number,
    required: [true, 'Years of experience are required.'],
  },
  clinicName: {
    type: String,
  },
  clinicAddress: {
    type: String,
  },
  consultationFees: {
    type: Number,
  },
  availability: [availabilitySchema],
  verificationStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
}, {
  timestamps: true,
});

const DoctorProfile = mongoose.model('DoctorProfile', doctorProfileSchema);

module.exports = DoctorProfile;
