const HealthTip = require('../models/HealthTip');
const DoctorProfile = require('../models/DoctorProfile');
const User = require('../models/User');

// @route   POST /api/health-tips
// @desc    Create a new health tip
// @access  Private (Doctor only)
exports.createTip = async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Only doctors can create health tips' });
    }

    const { title, category, summary, content, status, tags } = req.body;
    
    // Parse tags if sent as string
    let parsedTags = [];
    if (tags) {
      parsedTags = Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim()).filter(Boolean);
    }

    // Get doctor profile details for denormalization
    const doctorProfile = await DoctorProfile.findOne({ user: req.user.id });
    const user = await User.findById(req.user.id);
    
    const doctorName = doctorProfile?.fullName || `Dr. ${user.name}`;
    const specialization = doctorProfile?.specialization || 'General Physician';

    let thumbnailUrl = '';
    if (req.file && req.file.filename) {
      thumbnailUrl = `${req.protocol}://${req.get('host')}/uploads/health-tips/${req.file.filename}`;
    }

    const tip = new HealthTip({
      doctorId: req.user.id,
      doctorName,
      specialization,
      title,
      category,
      summary,
      content,
      tags: parsedTags,
      status: status || 'draft',
      thumbnail: thumbnailUrl
    });

    await tip.save();
    res.status(201).json(tip);
  } catch (err) {
    console.error('Error creating health tip:', err);
    res.status(500).json({ message: 'Server error creating health tip' });
  }
};

// @route   GET /api/health-tips
// @desc    Get all published health tips (with filtering)
// @access  Private
exports.getAllPublishedTips = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = { status: 'published' };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
        { doctorName: { $regex: search, $options: 'i' } }
      ];
    }

    const tips = await HealthTip.find(query).sort({ createdAt: -1 });
    res.json(tips);
  } catch (err) {
    console.error('Error fetching health tips:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   GET /api/health-tips/my-posts
// @desc    Get all posts by logged in doctor
// @access  Private (Doctor only)
exports.getMyTips = async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Only doctors can access their posts' });
    }

    const tips = await HealthTip.find({ doctorId: req.user.id }).sort({ createdAt: -1 });
    res.json(tips);
  } catch (err) {
    console.error('Error fetching doctor posts:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   GET /api/health-tips/:id
// @desc    Get tip by ID and increment view count
// @access  Private
exports.getTipById = async (req, res) => {
  try {
    const tip = await HealthTip.findById(req.params.id);
    if (!tip) return res.status(404).json({ message: 'Health tip not found' });

    // Increment views (don't block the request)
    tip.viewsCount += 1;
    await tip.save();

    res.json(tip);
  } catch (err) {
    console.error('Error fetching health tip:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   PUT /api/health-tips/:id
// @desc    Update a health tip
// @access  Private (Doctor only)
exports.updateTip = async (req, res) => {
  try {
    let tip = await HealthTip.findById(req.params.id);
    if (!tip) return res.status(404).json({ message: 'Health tip not found' });

    if (tip.doctorId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const { title, category, summary, content, status, tags } = req.body;

    let parsedTags = tip.tags;
    if (tags) {
      parsedTags = Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim()).filter(Boolean);
    }

    tip.title = title || tip.title;
    tip.category = category || tip.category;
    tip.summary = summary || tip.summary;
    tip.content = content || tip.content;
    tip.status = status || tip.status;
    tip.tags = tags ? parsedTags : tip.tags;

    if (req.file && req.file.filename) {
      tip.thumbnail = `${req.protocol}://${req.get('host')}/uploads/health-tips/${req.file.filename}`;
    }

    await tip.save();
    res.json(tip);
  } catch (err) {
    console.error('Error updating health tip:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   DELETE /api/health-tips/:id
// @desc    Delete a health tip
// @access  Private (Doctor only)
exports.deleteTip = async (req, res) => {
  try {
    const tip = await HealthTip.findById(req.params.id);
    if (!tip) return res.status(404).json({ message: 'Health tip not found' });

    if (tip.doctorId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await HealthTip.findByIdAndDelete(req.params.id);
    res.json({ message: 'Health tip removed' });
  } catch (err) {
    console.error('Error deleting health tip:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   POST /api/health-tips/:id/like
// @desc    Toggle like on a health tip
// @access  Private
exports.toggleLike = async (req, res) => {
  try {
    const tip = await HealthTip.findById(req.params.id);
    if (!tip) return res.status(404).json({ message: 'Health tip not found' });

    const isLiked = tip.likes.includes(req.user.id);
    if (isLiked) {
      tip.likes = tip.likes.filter(id => id.toString() !== req.user.id);
    } else {
      tip.likes.push(req.user.id);
    }
    await tip.save();
    res.json({ likes: tip.likes, isLiked: !isLiked });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   POST /api/health-tips/:id/save
// @desc    Toggle save on a health tip
// @access  Private
exports.toggleSave = async (req, res) => {
  try {
    const tip = await HealthTip.findById(req.params.id);
    if (!tip) return res.status(404).json({ message: 'Health tip not found' });

    const isSaved = tip.saves.includes(req.user.id);
    if (isSaved) {
      tip.saves = tip.saves.filter(id => id.toString() !== req.user.id);
    } else {
      tip.saves.push(req.user.id);
    }
    await tip.save();
    res.json({ saves: tip.saves, isSaved: !isSaved });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
