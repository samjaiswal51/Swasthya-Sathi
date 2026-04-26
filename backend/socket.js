const jwt          = require('jsonwebtoken');
const Conversation = require('./models/Conversation');
const Message      = require('./models/Message');

// Track online users: Map<userId, socketId>
const onlineUsers = new Map();

const initSocket = (io) => {
  // Auth middleware for sockets
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication error'));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded.user; // { id, role }
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user.id;
    onlineUsers.set(userId, socket.id);

    // Broadcast online status
    socket.broadcast.emit('userOnline', userId);

    // ── Join conversation room ──────────────────────
    socket.on('joinRoom', (conversationId) => {
      socket.join(conversationId);
    });

    // ── Send message ────────────────────────────────
    socket.on('sendMessage', async (data) => {
      try {
        const { conversationId, receiverId, message } = data;

        const conv = await Conversation.findById(conversationId);
        if (!conv) return;

        const newMsg = await Message.create({
          conversationId,
          senderId:    userId,
          receiverId,
          senderRole:  socket.user.role,
          message,
          messageType: 'text',
        });

        const currentCount = conv.unreadCount?.get?.(receiverId) || 0;
        conv.lastMessage   = message;
        conv.lastMessageAt = new Date();
        conv.lastSenderId  = userId;
        conv.unreadCount.set(receiverId, currentCount + 1);
        await conv.save();

        // Emit to whole room (including sender for confirmation)
        io.to(conversationId).emit('receiveMessage', newMsg);

        // If receiver is online but in different room, notify them
        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('newConversationUpdate', {
            conversationId,
            lastMessage:   message,
            lastMessageAt: conv.lastMessageAt,
          });
        }
      } catch (err) {
        console.error('[Socket] sendMessage error:', err.message);
      }
    });

    // ── Forward File Message ────────────────────────
    socket.on('forwardMessage', async (msg) => {
      io.to(msg.conversationId).emit('receiveMessage', msg);
      
      const receiverSocketId = onlineUsers.get(msg.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('newConversationUpdate', {
          conversationId: msg.conversationId,
          lastMessage:   msg.message || msg.fileName || 'Attachment',
          lastMessageAt: msg.createdAt,
        });
      }
    });

    // ── Typing indicator ────────────────────────────
    socket.on('typing', ({ conversationId, isTyping }) => {
      socket.to(conversationId).emit('typing', { senderId: userId, isTyping });
    });

    // ── Mark as seen ────────────────────────────────
    socket.on('seenMessage', async ({ conversationId }) => {
      try {
        await Message.updateMany(
          { conversationId, receiverId: userId, read: false },
          { $set: { read: true } }
        );
        const conv = await Conversation.findById(conversationId);
        if (conv) {
          conv.unreadCount.set(userId, 0);
          await conv.save();
        }
        socket.to(conversationId).emit('messageSeen', { conversationId, seenBy: userId });
      } catch (err) {
        console.error('[Socket] seenMessage error:', err.message);
      }
    });

    // ── Disconnect ──────────────────────────────────
    socket.on('disconnect', () => {
      onlineUsers.delete(userId);
      socket.broadcast.emit('userOffline', userId);
    });
  });
};

const getOnlineUsers = () => onlineUsers;

module.exports = { initSocket, getOnlineUsers };
