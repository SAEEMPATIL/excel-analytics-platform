const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const User = require('../models/User');
const upload = require('../middlewares/upload');

// GET /api/users/me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/users/me
router.put('/me', authMiddleware, upload.single('profilePic'), async (req, res) => {
  try {
    let profilePicUrl = req.body.profilePic; // default from body

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'profile_pics',
      });
      profilePicUrl = result.secure_url;
    }

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      {
        dob: req.body.dob,
        place: req.body.place,
        phone: req.body.phone,
        designation: req.body.designation,
        profilePic: profilePicUrl,
      },
      { new: true }
    ).select('-password');

    res.json({ message: 'Profile updated', user: updated });
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
});
module.exports = router;
