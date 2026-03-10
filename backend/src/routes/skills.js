const express = require('express');
const { Skill } = require('../models/Skill');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find().select('-modules');
    res.json({ skills });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:slug', async (req, res) => {
  try {
    const skill = await Skill.findOne({ slug: req.params.slug });
    if (!skill) return res.status(404).json({ message: 'Skill not found' });
    res.json({ skill });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/seed/all', async (req, res) => {
  try {
    await Skill.deleteMany({});
    const skills = [
      { name: 'Web Development', slug: 'web-development', icon: '💻', color: '#6EE7B7', category: 'Technology', level: 'Beginner', description: 'Build modern websites from scratch.', totalLessons: 20,
        modules: [
          { title: 'HTML Basics', order: 1, lessons: [
            { title: 'What is HTML?', videoUrl: 'https://youtube.com/watch?v=UB1O30fR-EE', duration: '8 min', order: 1 },
            { title: 'HTML Tags', videoUrl: 'https://youtube.com/watch?v=salY_Sm6mv4', duration: '12 min', order: 2 },
          ]},
          { title: 'CSS Styling', order: 2, lessons: [
            { title: 'CSS Basics', videoUrl: 'https://youtube.com/watch?v=1PnVor36_40', duration: '10 min', order: 1 },
            { title: 'Flexbox', videoUrl: 'https://youtube.com/watch?v=JJSoEo8JSnc', duration: '14 min', order: 2 },
          ]},
        ]},
      { name: 'UI/UX Design', slug: 'ui-ux-design', icon: '🎨', color: '#F472B6', category: 'Design', level: 'Beginner', description: 'Design beautiful interfaces.', totalLessons: 13,
        modules: [
          { title: 'Design Fundamentals', order: 1, lessons: [
            { title: 'Color Theory', videoUrl: 'https://youtube.com/watch?v=AvgCkHrcj8w', duration: '12 min', order: 1 },
          ]},
        ]},
      { name: 'Music & Guitar', slug: 'music', icon: '🎸', color: '#FBBF24', category: 'Arts', level: 'Beginner', description: 'Learn guitar from zero.', totalLessons: 8,
        modules: [
          { title: 'Guitar Basics', order: 1, lessons: [
            { title: 'First Chords', videoUrl: 'https://youtube.com/watch?v=VcmGlQyiJxU', duration: '14 min', order: 1 },
          ]},
        ]},
      { name: 'Photography', slug: 'photography', icon: '📸', color: '#38BDF8', category: 'Arts', level: 'Beginner', description: 'Master your camera.', totalLessons: 6,
        modules: [
          { title: 'Camera Basics', order: 1, lessons: [
            { title: 'Exposure Triangle', videoUrl: 'https://youtube.com/watch?v=YojL7UQTVhc', duration: '15 min', order: 1 },
          ]},
        ]},
      { name: 'AI & Machine Learning', slug: 'ai-ml', icon: '🧠', color: '#A78BFA', category: 'Technology', level: 'Intermediate', description: 'Learn AI and build models.', totalLessons: 8,
        modules: [
          { title: 'AI Fundamentals', order: 1, lessons: [
            { title: 'What is ML?', videoUrl: 'https://youtube.com/watch?v=ukzFI9rgwfU', duration: '12 min', order: 1 },
          ]},
        ]},
      { name: 'Cooking', slug: 'cooking', icon: '🍳', color: '#FB7185', category: 'Lifestyle', level: 'Beginner', description: 'Cook delicious meals.', totalLessons: 6,
        modules: [
          { title: 'Kitchen Basics', order: 1, lessons: [
            { title: 'Knife Skills', videoUrl: 'https://youtube.com/watch?v=JMA2SqaDgG8', duration: '10 min', order: 1 },
          ]},
        ]},
      { name: 'Finance & Investing', slug: 'finance', icon: '💰', color: '#34D399', category: 'Business', level: 'Beginner', description: 'Master your money.', totalLessons: 4,
        modules: [
          { title: 'Money Basics', order: 1, lessons: [
            { title: 'Budgeting 101', videoUrl: 'https://youtube.com/watch?v=sVKQn2I4HDM', duration: '14 min', order: 1 },
          ]},
        ]},
      { name: 'Creative Writing', slug: 'creative-writing', icon: '✍️', color: '#F9A8D4', category: 'Arts', level: 'Beginner', description: 'Tell compelling stories.', totalLessons: 4,
        modules: [
          { title: 'Story Basics', order: 1, lessons: [
            { title: 'Story Structure', videoUrl: 'https://youtube.com/watch?v=4JgS_OlEelc', duration: '12 min', order: 1 },
          ]},
        ]},
    ];
    await Skill.insertMany(skills);
    res.json({ message: `✅ ${skills.length} skills seeded!` });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
