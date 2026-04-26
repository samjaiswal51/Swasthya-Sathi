const mongoose = require('mongoose');

const medicalDocumentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: [
      'Prescription', 'Lab Report', 'X-Ray', 'MRI', 'CT Scan', 
      'ECG', 'BP Reading', 'Sugar Reading', 'Vaccination', 
      'Discharge Summary', 'Other'
    ],
    required: true
  },
  doctorName: {
    type: String,
    trim: true
  },
  hospitalName: {
    type: String,
    trim: true
  },
  reportDate: {
    type: Date,
    required: true
  },
  notes: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  fileName: {
    type: String,
    required: true
  },
  fileData: {
    type: Buffer,
    required: true
  },
  fileSize: {
    type: Number, // size in bytes
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  isFavorite: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('MedicalDocument', medicalDocumentSchema);
