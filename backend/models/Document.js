// backend/models/Document.js

const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  fileName: {
    type: String,
    required: true
  },
  fileURL: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true,
    enum: ['Prescription', 'Lab Report', 'Scan', 'Invoice', 'Other'],
    default: 'Other'
  },
  cloudinary_id: {
    type: String,
    required: true
  },
  mimeType: {
    type: String
  },
  fileSize: {
    type: Number
  },
  resourceType: {
    type: String,
    enum: ['image', 'raw', 'video', 'auto'],
    default: 'raw'
  },
  format: {
    type: String
  }
}, {
  timestamps: true
});

// Index for faster queries
documentSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Document', documentSchema);