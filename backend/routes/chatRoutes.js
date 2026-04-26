const express = require('express');
const router  = express.Router();
const chatController = require('../controllers/chatController');
const auth    = require('../middleware/authMiddleware');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');

// Local disk storage for chat file uploads
const uploadDir = path.join(__dirname, '../uploads/chat');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `chat_${Date.now()}_${Math.round(Math.random() * 1e6)}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

// GET  /api/chat/conversations
router.get('/conversations', auth, chatController.getConversations);

// POST /api/chat/conversations  (start / get existing)
router.post('/conversations', auth, chatController.startConversation);

// GET  /api/chat/messages/:conversationId
router.get('/messages/:conversationId', auth, chatController.getMessages);

// POST /api/chat/send  (HTTP fallback)
router.post('/send', auth, chatController.sendMessage);

// POST /api/chat/upload
router.post('/upload', auth, upload.single('file'), chatController.uploadFile);

module.exports = router;
