const express = require('express');
const auth = require('../middleware/auth');
const { Progress } = require('../models/Skill');
const User = require('../models/User');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.user._id }).populate('skill', 'name slug icon color');
    res.json({ progress });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/complete-lesson', auth, async (req, res) => {
  try {
    const { skillId, lessonId } = req.body;
    let progress = await Progress.findOne({ user: req.user._id, skill: skillId });
    if (!progress) progress = new Progress({ user: req.user._id, skill: skillId, completedLessons: [] });
    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
      progress.xpEarned += 50;
      await progress.save();
      await User.findByIdAndUpdate(req.user._id, { $inc: { xp: 50 }, $set: { level: Math.floor((req.user.xp + 50) / 500) + 1 } });
    }
    res.json({ success: true, xpEarned: 50 });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
