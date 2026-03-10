const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, ageGroup } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
    if (await User.findOne({ email })) return res.status(400).json({ message: 'Email already exists' });
    const user = await User.create({ name, email, password, ageGroup });
    res.status(201).json({ token: signToken(user._id), user: { id: user._id, name: user.name, email: user.email, xp: 0, level: 1 } });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(400).json({ message: 'Invalid email or password' });
    res.json({ token: signToken(user._id), user: { id: user._id, name: user.name, email: user.email, xp: user.xp, level: user.level, streak: user.streak, ageGroup: user.ageGroup } });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/me', auth, (req, res) => res.json({ user: req.user }));

module.exports = router;
