const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  against: {
    type: String, // Name or user ID string of the person being reported
    required: true,
  },
  type: {
    type: String,
    enum: ['Fake Doctor', 'Misbehavior', 'Spam', 'Technical Issue', 'Other'],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['open', 'resolved'],
    default: 'open',
  },
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
