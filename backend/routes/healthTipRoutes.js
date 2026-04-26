const express = require('express');
const router = express.Router();
const healthTipController = require('../controllers/healthTipController');
const auth = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Local disk storage for health tip thumbnails
const uploadDir = path.join(__dirname, '../uploads/health-tips');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `tip_${Date.now()}_${Math.round(Math.random() * 1e6)}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
    if (allowed.includes(path.extname(file.originalname).toLowerCase())) cb(null, true);
    else cb(new Error('Only image files allowed'));
  }
});

// Public/Patient facing routes
router.get('/', auth, healthTipController.getAllPublishedTips);
router.get('/my-posts', auth, healthTipController.getMyTips);
router.get('/:id', auth, healthTipController.getTipById);

// Doctor specific routes
router.post('/', auth, upload.single('thumbnail'), healthTipController.createTip);
router.put('/:id', auth, upload.single('thumbnail'), healthTipController.updateTip);
router.delete('/:id', auth, healthTipController.deleteTip);

// Interactive routes
router.post('/:id/like', auth, healthTipController.toggleLike);
router.post('/:id/save', auth, healthTipController.toggleSave);

module.exports = router;
