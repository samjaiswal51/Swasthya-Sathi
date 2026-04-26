const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  lastMessage:  { type: String, default: '' },
  lastMessageAt:{ type: Date, default: Date.now },
  lastSenderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  unreadCount: {
    type: Map,
    of: Number,
    default: {},
  },
}, { timestamps: true });

// Ensure a pair of users has only one conversation
conversationSchema.index({ participants: 1 });

module.exports = mongoose.model('Conversation', conversationSchema);
