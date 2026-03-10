const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: String, videoUrl: String, duration: String, order: Number,
});
const moduleSchema = new mongoose.Schema({
  title: String, order: Number, lessons: [lessonSchema],
});
const skillSchema = new mongoose.Schema({
  name: String, slug: { type: String, unique: true },
  description: String, icon: String, color: String,
  category: String, level: String, totalLessons: Number,
  modules: [moduleSchema], rating: { type: Number, default: 4.8 },
  enrolledCount: { type: Number, default: 0 },
});

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  skill: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill' },
  completedLessons: [String],
  xpEarned: { type: Number, default: 0 },
}, { timestamps: true });

const chatSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  skillContext: String,
  messages: [{ role: String, content: String, createdAt: { type: Date, default: Date.now } }],
}, { timestamps: true });

module.exports = {
  Skill: mongoose.model('Skill', skillSchema),
  Progress: mongoose.model('Progress', progressSchema),
  ChatSession: mongoose.model('ChatSession', chatSchema),
};
