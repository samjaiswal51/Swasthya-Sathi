const mongoose = require('mongoose');

const patientProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  profilePhoto: {
    type: String,
    default: ''
  },
  // Personal Details
  mobile: { type: String, trim: true },
  dob: { type: Date },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  address: {
    line: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String }
  },
  // Medical Details
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
  },
  height: { type: Number }, // in cm
  weight: { type: Number }, // in kg
  allergies: [{ type: String }],
  diseases: [{ type: String }],
  medications: { type: String },
  disability: { type: String },
  // Emergency Details
  emergencyContact: {
    name: { type: String },
    relation: { type: String },
    mobile: { type: String },
    alternateMobile: { type: String }
  },
  // Additional Details
  maritalStatus: { type: String, enum: ['Single', 'Married', 'Divorced', 'Widowed'] },
  occupation: { type: String },
  lifestyle: {
    smoker: { type: String, enum: ['Smoker', 'Non Smoker', 'Occasional'] },
    alcohol: { type: String, enum: ['No', 'Sometimes', 'Regular'] }
  },
  swasthyaCardId: { type: String, unique: true },
  qrToken: { type: String, unique: true },
  scanCount: { type: Number, default: 0 },
  lastScannedAt: { type: Date },
  favoriteDoctors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DoctorProfile' }]
}, { timestamps: true });

module.exports = mongoose.model('PatientProfile', patientProfileSchema);
