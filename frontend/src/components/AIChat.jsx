import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/store';

const SPARK_GREETINGS = [
  "Hey! I'm **Spark** ⚡ — your SkillSphere AI tutor. Ask me anything about your learning journey!",
  "Hi there! I'm **Spark**, your personal AI learning coach. What would you like to master today? 🚀",
];

const QUICK_PROMPTS = [
  "What should I learn first?",
  "Create a study plan for me",
  "I'm stuck, help me!",
  "What's my next milestone?",
];

export default function AIChat({ onClose, skillContext = null, initialMessage = null }) {
  const user = useStore(s => s.user);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: SPARK_GREETINGS[0] + (skillContext ? `\n\nI see you're working on **${skillContext}**! How can I help you with that?` : '') }
  ]);
  const [input, setInput] = useState(initialMessage || '');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (initialMessage) {
      sendMessage(initialMessage);
    }
  }, []);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');
    const newMessages = [...messages, { role: 'user', content: msg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Call backend AI endpoint (or demo mode)
      const token = useStore.getState().token;
      let reply = '';

      if (token && !token.startsWith('demo-')) {
        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ message: msg, skillContext, conversationHistory: messages.slice(-6) })
        });
        const data = await res.json();
        reply = data.reply;
      } else {
        // Demo mode responses
        reply = getDemoReply(msg, skillContext, user);
      }

      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting right now. Make sure the backend is running with your ANTHROPIC_API_KEY! 🔧" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', padding: '20px', pointerEvents: 'none' }}>
      {/* BACKDROP */}
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', pointerEvents: 'all' }} onClick={onClose} />

      {/* CHAT WINDOW */}
      <div style={{ position: 'relative', width: '100%', maxWidth: 420, height: '85vh', maxHeight: 620, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 20px 80px rgba(0,0,0,0.6)', pointerEvents: 'all', animation: 'fadeUp 0.3s ease both', zIndex: 1001 }}>

        {/* HEADER */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, background: 'var(--surface2)' }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', boxShadow: '0 0 16px rgba(110,231,183,0.4)', animation: 'glow 3s infinite' }}>⚡</div>
          <div>
            <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '0.95rem' }}>Spark — AI Tutor</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', animation: 'pulse 2s infinite', display: 'inline-block' }} />
              Online · Always here to help
            </div>
          </div>
          {skillContext && <span className="badge badge-green" style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>📚 {skillContext}</span>}
          <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ marginLeft: 'auto', padding: '4px 8px', fontSize: '1.1rem' }}>✕</button>
        </div>

        {/* MESSAGES */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', animation: 'fadeUp 0.3s ease both' }}>
              {m.role === 'assistant' && (
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', flexShrink: 0, marginTop: 2 }}>⚡</div>
              )}
              <div style={{
                maxWidth: '80%', padding: '10px 14px', borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: m.role === 'user' ? 'linear-gradient(135deg, var(--accent), var(--accent2))' : 'var(--surface2)',
                color: m.role === 'user' ? '#08090d' : 'var(--text)',
                border: m.role === 'assistant' ? '1px solid var(--border)' : 'none',
                fontSize: '0.875rem', lineHeight: 1.6,
                whiteSpace: 'pre-wrap'
              }}>
                {m.content.replace(/\*\*(.*?)\*\*/g, '$1')}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>⚡</div>
              <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '16px 16px 16px 4px', padding: '12px 16px', display: 'flex', gap: 5, alignItems: 'center' }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', animation: `pulse 1.2s ${i * 0.2}s infinite` }} />)}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* QUICK PROMPTS */}
        {messages.length <= 2 && (
          <div style={{ padding: '0 12px 8px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {QUICK_PROMPTS.map(q => (
              <button key={q} onClick={() => sendMessage(q)}
                style={{ padding: '5px 12px', borderRadius: 100, background: 'rgba(110,231,183,0.08)', border: '1px solid rgba(110,231,183,0.2)', color: 'var(--accent)', fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(110,231,183,0.15)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(110,231,183,0.08)'}>
                {q}
              </button>
            ))}
          </div>
        )}

        {/* INPUT */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
          <input
            className="input" placeholder="Ask Spark anything..." value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            style={{ flex: 1, borderRadius: 100, padding: '10px 16px', fontSize: '0.875rem' }}
          />
          <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
            style={{ width: 40, height: 40, borderRadius: '50%', background: input.trim() ? 'linear-gradient(135deg, var(--accent), var(--accent2))' : 'var(--surface2)', border: 'none', cursor: input.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s', fontSize: '1rem', color: input.trim() ? '#08090d' : 'var(--muted)' }}>
            →
          </button>
        </div>
      </div>
    </div>
  );
}

function getDemoReply(msg, skillContext, user) {
  const name = user?.name?.split(' ')[0] || 'there';
  const lower = msg.toLowerCase();

  if (lower.includes('study plan') || lower.includes('roadmap')) {
    return `Great question, ${name}! Here's a focused study plan for you:\n\n📅 Week 1-2: Foundations\nStart with the first 2 modules, 30 min/day. Focus on understanding, not speed.\n\n📅 Week 3-4: Build momentum\nComplete 1 lesson daily. Take notes and do the exercises.\n\n📅 Month 2: Practice projects\nApply what you've learned by building something real.\n\n💡 Tip: Consistency beats intensity every time. 30 minutes daily > 3 hours on weekends!`;
  }
  if (lower.includes('stuck') || lower.includes('help')) {
    return `No worries, ${name} — getting stuck is part of learning! 💪\n\nHere's what I suggest:\n1. Re-watch the last lesson at 0.75x speed\n2. Try explaining the concept in your own words\n3. Search for a different explanation on YouTube\n4. Practice with a simpler example first\n\nWhat specifically are you stuck on? Tell me more and I'll help you break it down! 🎯`;
  }
  if (lower.includes('first') || lower.includes('start') || lower.includes('begin')) {
    return `Welcome to your learning journey! 🚀\n\nFor ${skillContext || 'your chosen skill'}, I recommend:\n\n✅ Start with Module A (the foundations)\n⏱ Commit to 20-30 minutes daily\n📝 Take notes as you watch\n🔄 Re-do exercises until they feel natural\n\nThe secret? Don't skip ahead. Every lesson builds on the last. You've got this, ${name}! ⭐`;
  }
  if (lower.includes('milestone') || lower.includes('next')) {
    return `You're making great progress, ${name}! 🎉\n\nYour next milestone: Complete your first full module!\n\nOnce you do:\n🏅 You'll earn your first badge\n⚡ +200 bonus XP\n📈 Unlock the next phase of your roadmap\n\nKeep going — you're closer than you think!`;
  }
  return `Great question! For ${skillContext || 'your learning journey'}, here's my advice:\n\nFocus on building consistent habits over cramming. Even 20 minutes of focused practice daily will get you much further than occasional long sessions.\n\nDon't hesitate to revisit lessons — rewatching something you "already know" often reveals new insights. What else would you like help with, ${name}? 😊`;
}
