const express = require('express');
const auth = require('../middleware/auth');
const { ChatSession } = require('../models/Skill');
const router = express.Router();

// POST /api/ai/chat — AI Tutor powered by Claude
router.post('/chat', auth, async (req, res) => {
  try {
    const { message, skillContext, sessionId, conversationHistory = [] } = req.body;
    if (!message) return res.status(400).json({ message: 'Message required' });

    const systemPrompt = `You are Spark — SkillSphere's friendly, expert AI tutor. You help learners of ALL ages master skills with encouragement and clarity.

Current skill context: ${skillContext || 'General learning'}
User: ${req.user.name} (${req.user.ageGroup} age group, Level ${req.user.level})

Your personality:
- Warm, encouraging, patient — never condescending
- Adapt language complexity to the user's age group (simpler for kids, detailed for adults)
- Use emojis sparingly but warmly 
- Give practical, actionable advice
- When explaining concepts, use real-world examples
- If a student is stuck, break it into smaller steps
- Celebrate progress and milestones!

You can help with:
- Explaining concepts in the current skill
- Creating personalized study plans
- Answering questions about lessons
- Motivation and overcoming learning blocks
- Recommending next steps

Keep responses concise (2-4 paragraphs max) unless the user asks for detail.`;

    // Call Anthropic Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          ...conversationHistory.slice(-8).map(m => ({ role: m.role, content: m.content })),
          { role: 'user', content: message }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Claude API error:', error);
      return res.status(500).json({ message: 'AI service unavailable' });
    }

    const data = await response.json();
    const aiReply = data.content[0]?.text || 'I had trouble responding. Please try again!';

    // Save to DB
    if (sessionId) {
      await ChatSession.findByIdAndUpdate(sessionId, {
        $push: {
          messages: [
            { role: 'user', content: message },
            { role: 'assistant', content: aiReply }
          ]
        }
      });
    } else {
      await ChatSession.create({
        user: req.user._id,
        skillContext,
        messages: [
          { role: 'user', content: message },
          { role: 'assistant', content: aiReply }
        ]
      });
    }

    res.json({ reply: aiReply });
  } catch (err) {
    console.error('AI chat error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/ai/roadmap — Generate personalized roadmap
router.post('/roadmap', auth, async (req, res) => {
  try {
    const { skillName, currentLevel, goals, timeAvailable } = req.body;

    const prompt = `Create a personalized learning roadmap for:
- Skill: ${skillName}
- Current level: ${currentLevel}
- Goals: ${goals}
- Time available per week: ${timeAvailable} hours
- Learner: ${req.user.ageGroup} age group

Return a JSON array of roadmap steps with this structure:
[{
  "week": 1,
  "title": "Step title",
  "description": "What to learn",
  "topics": ["topic1", "topic2"],
  "resources": ["resource description"],
  "milestone": "What you'll be able to do",
  "phase": "beginner|intermediate|advanced|expert"
}]

Make it realistic, progressive, and motivating. Include 8-12 steps.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    const text = data.content[0]?.text || '[]';
    
    // Extract JSON
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    const roadmap = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

    res.json({ roadmap });
  } catch (err) {
    res.status(500).json({ message: 'Could not generate roadmap', error: err.message });
  }
});

module.exports = router;
