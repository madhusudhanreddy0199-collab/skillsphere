import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/store';
import { SKILLS } from '../data/skills';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, enrolledSkills, getSkillProgress } = useStore();
  const enrolled = SKILLS.filter(s => enrolledSkills.includes(s.id));
  const xpInLevel = (user?.xp || 0) % 500;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '60px 24px' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/dashboard')} style={{ marginBottom: 24 }}>← Dashboard</button>
        <div className="card" style={{ padding: 32, textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(110,231,183,0.2)', border: '3px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800, color: 'var(--accent)', margin: '0 auto 16px' }}>{user?.name?.[0]?.toUpperCase()}</div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: 4 }}>{user?.name}</h2>
          <p style={{ color: 'var(--muted)', marginBottom: 16 }}>{user?.email}</p>
          <span className="badge badge-green">⚡ Level {user?.level} Learner</span>
        </div>

        <div className="card" style={{ padding: 24, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontWeight: 600 }}>Level {user?.level}</span>
            <span style={{ color: 'var(--accent)' }}>{xpInLevel}/500 XP</span>
            <span style={{ fontWeight: 600 }}>Level {(user?.level || 1) + 1}</span>
          </div>
          <div style={{ background: 'var(--surface2)', height: 10, borderRadius: 5, overflow: 'hidden' }}>
            <div style={{ width: `${(xpInLevel / 500) * 100}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent), var(--accent2))', borderRadius: 5 }} />
          </div>
        </div>

        {enrolled.length > 0 && (
          <div className="card" style={{ padding: 24, marginBottom: 24 }}>
            <h3 style={{ marginBottom: 16 }}>My Skills</h3>
            {enrolled.map(skill => {
              const totalL = skill.modules.reduce((a, m) => a + m.lessons.length, 0);
              const prog = getSkillProgress(skill.id, totalL);
              return (
                <div key={skill.id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <span style={{ fontSize: '1.5rem' }}>{skill.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, marginBottom: 4, fontSize: '0.9rem' }}>{skill.name}</div>
                    <div style={{ background: 'var(--surface2)', height: 4, borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: `${prog.percent}%`, height: '100%', background: skill.color }} />
                    </div>
                  </div>
                  <span style={{ color: skill.color, fontWeight: 700, fontSize: '0.85rem' }}>{prog.percent}%</span>
                </div>
              );
            })}
          </div>
        )}

        <button className="btn" style={{ width: '100%', padding: 14, background: 'rgba(251,113,133,0.1)', border: '1px solid rgba(251,113,133,0.3)', color: '#FB7185' }}
          onClick={() => { logout(); navigate('/'); }}>🚪 Log Out</button>
      </div>
    </div>
  );
}
