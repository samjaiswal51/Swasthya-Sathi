const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
  senderId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderRole:     { type: String, enum: ['patient','doctor','admin'], required: true },
  message:        { type: String, default: '' },
  messageType:    { type: String, enum: ['text','file'], default: 'text' },
  fileUrl:        { type: String, default: '' },
  fileName:       { type: String, default: '' },
  fileType:       { type: String, default: '' }, // 'image' | 'pdf' | 'other'
  read:           { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
