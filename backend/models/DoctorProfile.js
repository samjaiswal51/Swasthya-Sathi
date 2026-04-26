const mongoose = require('mongoose');

const doctorProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

  // Step 1 – Basic Details
  fullName:     { type: String, trim: true },
  gender:       { type: String, enum: ['Male', 'Female', 'Other'] },
  dob:          { type: Date },
  mobile:       { type: String, trim: true },
  email:        { type: String, trim: true },
  profilePhoto: { type: String, default: '' },

  // Step 2 – Professional Details
  registrationNumber: { type: String, trim: true },
  degree:             { type: String, trim: true },
  specialization:     { type: String },
  experienceYears:    { type: Number },
  hospitalName:       { type: String, trim: true },
  consultationFee:    { type: Number },
  languages:          [{ type: String }],
  bio:                { type: String },

  // Step 3 – Availability
  availability: {
    days:         [{ type: String }],
    morningStart: { type: String },
    morningEnd:   { type: String },
    eveningStart: { type: String },
    eveningEnd:   { type: String },
  },
  consultationMode: { type: String, enum: ['Online', 'Offline', 'Both'] },
  clinicAddress:    { type: String },
  city:             { type: String },
  state:            { type: String },
  pincode:          { type: String },

  // Step 4 – Documents (Cloudinary URLs)
  documents: {
    degreeCertificate:      { type: String },
    licenseCertificate:     { type: String },
    idProof:                { type: String },
    additionalCertificates: [{ type: String }],
  },

  // Verification
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  rejectionReason:   { type: String, default: '' },
  isProfileComplete: { type: Boolean, default: false },
  verifiedAt:        { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('DoctorProfile', doctorProfileSchema);
