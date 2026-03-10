import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../context/store';
import { SKILLS } from '../data/skills';
import AIChat from '../components/AIChat';
import Certificate from '../components/Certificate';

export default function SkillPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { enrollSkill, enrolledSkills, getSkillProgress, isLessonComplete, user } = useStore();
  const [showChat, setShowChat] = useState(false);
  const [showCert, setShowCert] = useState(false);

  const skill = SKILLS.find(s => s.slug === slug);
  if (!skill) return (
    <div style={{ padding: 40, color: 'var(--white)' }}>
      Skill not found. <span style={{ color: 'var(--accent)', cursor: 'pointer' }} onClick={() => navigate('/explore')}>← Back</span>
    </div>
  );

  const isEnrolled = enrolledSkills.includes(skill.id);
  const totalL = skill.modules.reduce((a, m) => a + m.lessons.length, 0);
  const prog = getSkillProgress(skill.id, totalL);
  const isComplete = prog.percent === 100;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${skill.color}15, transparent)`, borderBottom: '1px solid var(--border)', padding: '60px 40px 40px' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 20 }}>← Back</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '4rem' }}>{skill.icon}</span>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '2rem', marginBottom: 8 }}>{skill.name}</h1>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
              <span className="badge badge-green">{skill.category}</span>
              <span className="badge">{skill.level}</span>
              <span className="badge">📚 {totalL} lessons</span>
            </div>
            {isEnrolled ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Your progress</span>
                  <span style={{ color: skill.color, fontWeight: 700 }}>{prog.percent}%</span>
                </div>
                <div style={{ background: 'var(--surface)', height: 8, borderRadius: 4, width: 300, overflow: 'hidden', marginBottom: 12 }}>
                  <div style={{ width: `${prog.percent}%`, height: '100%', background: skill.color, borderRadius: 4, transition: 'width 0.6s' }} />
                </div>
                {isComplete && (
                  <button
                    onClick={() => setShowCert(true)}
                    style={{
                      padding: '10px 22px', borderRadius: 8, border: 'none', cursor: 'pointer',
                      background: `linear-gradient(135deg, ${skill.color}, #38BDF8)`,
                      color: '#08090d', fontWeight: 700, fontSize: '0.9rem',
                      animation: 'pulse 2s ease-in-out infinite',
                      fontFamily: 'DM Sans, sans-serif'
                    }}>
                    🎓 View Your Certificate
                  </button>
                )}
              </div>
            ) : (
              <button className="btn btn-primary" onClick={() => enrollSkill(skill.id)}>🚀 Enroll Free</button>
            )}
          </div>
        </div>
      </div>

      {/* Modules */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px' }}>
        {isComplete && (
          <div style={{
            marginBottom: 24, padding: '20px 24px',
            background: `linear-gradient(135deg, ${skill.color}15, rgba(56,189,248,0.1))`,
            border: `1px solid ${skill.color}44`, borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12
          }}>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 4 }}>🎉 Skill Complete!</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>You've mastered all lessons in {skill.name}</div>
            </div>
            <button onClick={() => setShowCert(true)} style={{
              padding: '10px 20px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: skill.color, color: '#08090d', fontWeight: 700, fontSize: '0.875rem',
              fontFamily: 'DM Sans, sans-serif'
            }}>
              🎓 Get Certificate
            </button>
          </div>
        )}

        <h2 style={{ marginBottom: 24 }}>Course Content</h2>
        {skill.modules.map((mod, mi) => (
          <div key={mod.id} className="card" style={{ marginBottom: 16, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: skill.color + '33', color: skill.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>{mi + 1}</div>
              <span style={{ fontWeight: 700 }}>{mod.title}</span>
              <span style={{ color: 'var(--muted)', fontSize: '0.8rem', marginLeft: 'auto' }}>{mod.lessons.length} lessons</span>
            </div>
            {mod.lessons.map(lesson => {
              const done = isLessonComplete(skill.id, lesson.id);
              return (
                <div key={lesson.id}
                  style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border)', cursor: isEnrolled ? 'pointer' : 'default', opacity: isEnrolled ? 1 : 0.6, transition: 'background 0.15s' }}
                  onClick={() => isEnrolled && navigate(`/skill/${slug}/lesson/${lesson.id}`)}
                  onMouseEnter={e => isEnrolled && (e.currentTarget.style.background = 'var(--surface2)')}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: done ? skill.color : 'var(--surface2)', border: `2px solid ${done ? skill.color : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: done ? '#08090d' : 'var(--muted)', fontWeight: 800 }}>
                    {done ? '✓' : '▶'}
                  </div>
                  <span style={{ flex: 1, fontSize: '0.9rem', textDecoration: done ? 'line-through' : 'none', color: done ? 'var(--muted)' : 'var(--white)' }}>{lesson.title}</span>
                  <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>{lesson.duration}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <button onClick={() => setShowChat(true)} style={{ position: 'fixed', bottom: 28, right: 28, width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent2))', border: 'none', cursor: 'pointer', fontSize: '1.4rem', boxShadow: '0 4px 20px rgba(110,231,183,0.4)', zIndex: 100 }}>⚡</button>
      {showChat && <AIChat onClose={() => setShowChat(false)} skillContext={skill.name} />}
      {showCert && <Certificate skill={skill} user={user} onClose={() => setShowCert(false)} />}
    </div>
  );
}
