const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['patient', 'admin', 'doctor', 'family'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  pushSubscription: {
    type: Object // Stores the endpoint, p256dh, and auth keys
  },
  isSuspended: {
    type: Boolean,
    default: false,
  },
  theme: {
    type: String,
    enum: ['default', 'light', 'dark'],
    default: 'default',
  },
});

module.exports = mongoose.model('User', userSchema);
