import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SKILLS } from '../data/skills';

export default function ExplorePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');
  const cats = ['All', 'Technology', 'Design', 'Arts', 'Business', 'Lifestyle'];
  const filtered = SKILLS.filter(s => (cat === 'All' || s.category === cat) && s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '60px 24px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 20 }}>← Back</button>
        <h1 style={{ fontSize: '2rem', marginBottom: 8 }}>Explore Skills</h1>
        <p style={{ color: 'var(--muted)', marginBottom: 24 }}>120+ skills to master</p>
        <input className="input" placeholder="🔍 Search skills..." value={search} onChange={e => setSearch(e.target.value)} style={{ marginBottom: 16, maxWidth: 400 }} />
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {cats.map(c => <button key={c} onClick={() => setCat(c)} style={{ padding: '6px 16px', borderRadius: 100, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', border: `1px solid ${cat === c ? 'var(--accent)' : 'var(--border)'}`, background: cat === c ? 'rgba(110,231,183,0.15)' : 'var(--surface)', color: cat === c ? 'var(--accent)' : 'var(--muted)' }}>{c}</button>)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
          {filtered.map(skill => (
            <div key={skill.id} className="card" style={{ padding: 20, cursor: 'pointer', borderColor: skill.color + '33', transition: 'all 0.2s' }}
              onClick={() => navigate(`/skill/${skill.slug}`)}
              onMouseEnter={e => { e.currentTarget.style.borderColor = skill.color; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = skill.color + '33'; e.currentTarget.style.transform = 'none'; }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>{skill.icon}</div>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>{skill.name}</div>
              <div style={{ color: skill.color, fontSize: '0.75rem', marginBottom: 8 }}>{skill.category}</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>📚 {skill.totalLessons} lessons</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
