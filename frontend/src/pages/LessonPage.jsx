import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../context/store';
import { SKILLS } from '../data/skills';
import AIChat from '../components/AIChat';

export default function LessonPage() {
  const { slug, lessonId } = useParams();
  const navigate = useNavigate();
  const { markLessonComplete, isLessonComplete } = useStore();
  const [showChat, setShowChat] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);

  const skill = SKILLS.find(s => s.slug === slug);
  let lesson = null;
  skill?.modules.forEach(m => m.lessons.forEach(l => { if (l.id === lessonId) lesson = l; }));

  if (!lesson) return <div style={{ padding: 40 }}>Lesson not found. <span style={{ color: 'var(--accent)', cursor: 'pointer' }} onClick={() => navigate(-1)}>← Back</span></div>;

  const done = isLessonComplete(skill.id, lessonId) || justCompleted;

  const handleComplete = async () => {
    const result = await markLessonComplete(skill.id, lessonId);
    if (result) setJustCompleted(true);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Top bar */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/skill/${slug}`)}>← Back to {skill.name}</button>
        <span style={{ color: 'var(--muted)', fontSize: '0.85rem', marginLeft: 'auto' }}>{lesson.duration}</span>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
        {/* Video */}
        <div style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 24, background: '#000', aspectRatio: '16/9' }}>
          <iframe width="100%" height="100%" src={lesson.videoUrl} title={lesson.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ display: 'block' }} />
        </div>

        {/* Info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: 8 }}>{lesson.title}</h1>
            <span className="badge" style={{ background: skill.color + '22', color: skill.color, border: `1px solid ${skill.color}44` }}>{skill.icon} {skill.name}</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-ghost" onClick={() => setShowChat(true)}>⚡ Ask Spark AI</button>
            {!done ? (
              <button className="btn btn-primary" onClick={handleComplete}>✓ Mark Complete (+50 XP)</button>
            ) : (
              <div className="badge badge-green" style={{ padding: '10px 16px', fontSize: '0.875rem' }}>✅ Completed · +50 XP</div>
            )}
          </div>
        </div>

        {justCompleted && (
          <div style={{ marginTop: 24, background: 'rgba(110,231,183,0.1)', border: '1px solid rgba(110,231,183,0.3)', borderRadius: 12, padding: '20px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>🎉</div>
            <h3 style={{ color: 'var(--accent)', marginBottom: 4 }}>Lesson Complete!</h3>
            <p style={{ color: 'var(--muted)' }}>+50 XP earned! Keep going!</p>
          </div>
        )}
      </div>

      <button onClick={() => setShowChat(true)} style={{ position: 'fixed', bottom: 28, right: 28, width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent2))', border: 'none', cursor: 'pointer', fontSize: '1.4rem', boxShadow: '0 4px 20px rgba(110,231,183,0.4)', zIndex: 100 }}>⚡</button>
      {showChat && <AIChat onClose={() => setShowChat(false)} skillContext={skill.name} />}
    </div>
  );
}
