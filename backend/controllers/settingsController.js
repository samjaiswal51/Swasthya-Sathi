const User = require('../models/User');

// GET /api/settings/theme
const getTheme = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('theme');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ theme: user.theme || 'default' });
  } catch (err) {
    console.error('getTheme error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/settings/theme
const updateTheme = async (req, res) => {
  try {
    const { theme } = req.body;
    const valid = ['default', 'light', 'dark'];
    if (!valid.includes(theme)) {
      return res.status(400).json({ message: 'Invalid theme value' });
    }
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { theme },
      { new: true, select: 'theme' }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Theme updated', theme: user.theme });
  } catch (err) {
    console.error('updateTheme error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getTheme, updateTheme };
