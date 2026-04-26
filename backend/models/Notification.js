const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['update_request', 'update_approved', 'update_rejected', 'system', 'reminder', 'follow', 'like', 'booking', 'payment'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  link: {
    type: String // Optional link to redirect when clicked
  }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
