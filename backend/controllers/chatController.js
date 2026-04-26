const Conversation = require('../models/Conversation');
const Message      = require('../models/Message');

// ── GET /api/chat/conversations ──────────────────────────────────────
// Returns all conversations for the logged-in user, sorted by latest activity
exports.getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ participants: req.user.id })
      .populate('participants', 'name email role')
      .sort({ lastMessageAt: -1 });

    // Attach unread count for this user
    const result = conversations.map(c => ({
      ...c.toObject(),
      unreadForMe: c.unreadCount?.get?.(req.user.id) || 0,
    }));

    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// ── POST /api/chat/conversations ─────────────────────────────────────
// Start or get an existing conversation with another user
exports.startConversation = async (req, res) => {
  try {
    const { participantId } = req.body;
    if (!participantId) return res.status(400).json({ message: 'participantId required' });

    const participants = [req.user.id, participantId].sort(); // canonical ordering

    let conversation = await Conversation.findOne({
      participants: { $all: participants, $size: 2 },
    }).populate('participants', 'name email role');

    if (!conversation) {
      conversation = await Conversation.create({ participants });
      conversation = await conversation.populate('participants', 'name email role');
    }

    res.json(conversation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// ── GET /api/chat/messages/:conversationId ───────────────────────────
// Returns messages for a conversation + marks unread as read
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    // Verify user is a participant
    const conv = await Conversation.findById(conversationId);
    if (!conv) return res.status(404).json({ message: 'Conversation not found' });
    if (!conv.participants.map(p => p.toString()).includes(req.user.id)) {
      return res.status(403).json({ message: 'Not a participant' });
    }

    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });

    // Mark as read
    await Message.updateMany(
      { conversationId, receiverId: req.user.id, read: false },
      { $set: { read: true } }
    );

    // Reset unread for this user
    conv.unreadCount.set(req.user.id, 0);
    await conv.save();

    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// ── POST /api/chat/send ──────────────────────────────────────────────
// HTTP fallback for sending a message (Socket is preferred)
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, receiverId, message } = req.body;

    const conv = await Conversation.findById(conversationId);
    if (!conv) return res.status(404).json({ message: 'Conversation not found' });

    const newMsg = await Message.create({
      conversationId,
      senderId:   req.user.id,
      receiverId,
      senderRole: req.user.role,
      message,
      messageType: 'text',
    });

    // Update conversation last message
    const currentCount = conv.unreadCount?.get?.(receiverId) || 0;
    conv.lastMessage   = message;
    conv.lastMessageAt = new Date();
    conv.lastSenderId  = req.user.id;
    conv.unreadCount.set(receiverId, currentCount + 1);
    await conv.save();

    res.json(newMsg);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// ── POST /api/chat/upload ────────────────────────────────────────────
// Upload file attachment and save message
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const { conversationId, receiverId } = req.body;
    const conv = await Conversation.findById(conversationId);
    if (!conv) return res.status(404).json({ message: 'Conversation not found' });

    const fileUrl  = `${req.protocol}://${req.get('host')}/uploads/chat/${req.file.filename}`;
    const fileName = req.file.originalname;
    const mimetype = req.file.mimetype || '';
    let fileType = 'other';
    if (mimetype.startsWith('image/')) fileType = 'image';
    else if (mimetype === 'application/pdf') fileType = 'pdf';

    const newMsg = await Message.create({
      conversationId,
      senderId:    req.user.id,
      receiverId,
      senderRole:  req.user.role,
      message:     fileName,
      messageType: 'file',
      fileUrl,
      fileName,
      fileType,
    });

    const currentCount = conv.unreadCount?.get?.(receiverId) || 0;
    conv.lastMessage   = `📎 ${fileName}`;
    conv.lastMessageAt = new Date();
    conv.lastSenderId  = req.user.id;
    conv.unreadCount.set(receiverId, currentCount + 1);
    await conv.save();

    res.json(newMsg);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
