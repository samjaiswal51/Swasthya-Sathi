const mongoose = require('mongoose');

const profileViewSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  viewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  ipAddress: {
    type: String
  }
}, { timestamps: true });

// Optional: prevent the same user from spamming views in a single day
// by adding a compound index if needed, but for now we'll just log them.

module.exports = mongoose.model('ProfileView', profileViewSchema);
