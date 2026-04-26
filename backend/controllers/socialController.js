const DoctorFollower = require('../models/DoctorFollower');
const PostLike = require('../models/PostLike');
const HealthTip = require('../models/HealthTip');
const Notification = require('../models/Notification');
const DoctorProfile = require('../models/DoctorProfile');
const User = require('../models/User');

// --- FOLLOW SYSTEM ---

exports.followDoctor = async (req, res) => {
  try {
    const patientId = req.user.id;
    const { doctorId } = req.params;

    // Prevent self-follow
    if (patientId === doctorId) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    // Check if already following (upsert safely)
    const existingFollow = await DoctorFollower.findOne({ doctorId, patientId });
    if (existingFollow) {
      return res.status(400).json({ message: 'Already following this doctor' });
    }

    await DoctorFollower.create({ doctorId, patientId });

    // Notify doctor
    const patientUser = await User.findById(patientId);
    if (patientUser) {
      await Notification.create({
        userId: doctorId,
        type: 'follow',
        title: 'New Follower',
        message: `${patientUser.name || 'A patient'} started following you.`
      });
    }

    res.status(200).json({ message: 'Successfully followed doctor' });
  } catch (error) {
    console.error('Follow error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.unfollowDoctor = async (req, res) => {
  try {
    const patientId = req.user.id;
    const { doctorId } = req.params;

    await DoctorFollower.findOneAndDelete({ doctorId, patientId });
    res.status(200).json({ message: 'Successfully unfollowed doctor' });
  } catch (error) {
    console.error('Unfollow error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getFollowing = async (req, res) => {
  try {
    const patientId = req.user.id;
    const following = await DoctorFollower.find({ patientId }).select('doctorId');
    const doctorIds = following.map(f => f.doctorId);
    res.status(200).json(doctorIds);
  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getFollowersCount = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const count = await DoctorFollower.countDocuments({ doctorId });
    res.status(200).json({ count });
  } catch (error) {
    console.error('Get followers count error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// --- LIKE SYSTEM ---

exports.toggleLike = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.params;

    const existingLike = await PostLike.findOne({ postId, userId });

    if (existingLike) {
      // Unlike
      await PostLike.findOneAndDelete({ postId, userId });
      await HealthTip.findByIdAndUpdate(postId, { $pull: { likes: userId } });
      const likesCount = await PostLike.countDocuments({ postId });
      return res.status(200).json({ message: 'Post unliked', isLiked: false, likesCount });
    } else {
      // Like
      await PostLike.create({ postId, userId, role: req.user.role || 'patient' });
      const post = await HealthTip.findByIdAndUpdate(
        postId,
        { $addToSet: { likes: userId } },
        { new: true }
      );

      // Notify doctor (author) — don't notify if liking your own post
      if (post && post.doctorId.toString() !== userId.toString()) {
        const user = await User.findById(userId);
        await Notification.create({
          userId: post.doctorId,
          type: 'like',
          title: 'New Like on Post',
          message: `${user?.name || 'Someone'} liked your post: "${post.title}"`,
          link: `/doctor-dashboard/blogs`
        });
      }

      const likesCount = await PostLike.countDocuments({ postId });
      return res.status(200).json({ message: 'Post liked', isLiked: true, likesCount });
    }
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// --- HEALTH FEED ---

exports.getHealthFeed = async (req, res) => {
  try {
    const patientId = req.user.id;
    const feedType = req.query.type || 'general'; // 'general' or 'following'

    let query = { status: 'published' };

    if (feedType === 'following') {
      const followingList = await DoctorFollower.find({ patientId });
      const doctorIds = followingList.map(f => f.doctorId);
      if (doctorIds.length === 0) {
        return res.status(200).json([]);
      }
      query.doctorId = { $in: doctorIds };
    }

    // Fetch posts newest first
    const posts = await HealthTip.find(query)
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    // Attach like status + doctor profile info in parallel
    const feed = await Promise.all(posts.map(async (post) => {
      const [isLiked, likesCount, docProfile] = await Promise.all([
        PostLike.exists({ postId: post._id, userId: patientId }),
        PostLike.countDocuments({ postId: post._id }),
        DoctorProfile.findOne({ user: post.doctorId }).select('verificationStatus profilePhoto').lean()
      ]);

      return {
        ...post,
        likesCount,
        isLiked: !!isLiked,
        doctorInfo: {
          profilePhoto: docProfile?.profilePhoto || null,
          isVerified: docProfile?.verificationStatus === 'approved'
        }
      };
    }));

    res.status(200).json(feed);
  } catch (error) {
    console.error('Get feed error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
