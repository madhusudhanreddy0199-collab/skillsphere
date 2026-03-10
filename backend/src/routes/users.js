const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

router.get('/profile', auth, (req, res) => res.json({ user: req.user }));

router.patch('/profile', auth, async (req, res) => {
  try {
    const { name, bio, location } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, bio, location }, { new: true }).select('-password');
    res.json({ user });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
