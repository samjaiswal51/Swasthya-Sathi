const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getTheme, updateTheme } = require('../controllers/settingsController');

// All routes are JWT-protected
router.get('/theme', auth, getTheme);
router.put('/theme', auth, updateTheme);

module.exports = router;
