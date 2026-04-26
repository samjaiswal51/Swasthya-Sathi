const express = require('express');
const router = express.Router();
const socialController = require('../controllers/socialController');
const authMiddleware = require('../middleware/authMiddleware');

// Follow routes
router.post('/follow/:doctorId', authMiddleware, socialController.followDoctor);
router.delete('/follow/:doctorId', authMiddleware, socialController.unfollowDoctor);
router.get('/following', authMiddleware, socialController.getFollowing);
router.get('/doctor/:doctorId/followers-count', authMiddleware, socialController.getFollowersCount);

// Like routes
router.post('/like/:postId', authMiddleware, socialController.toggleLike);

// Feed routes
router.get('/feed', authMiddleware, socialController.getHealthFeed);

module.exports = router;
