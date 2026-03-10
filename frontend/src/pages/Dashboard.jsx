import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/store';
import { SKILLS } from '../data/skills';
import AIChat from '../components/AIChat';

// ─── Mini Components ───────────────────────────────────────────────────────────

function XPRing({ percent, color, size = 64 }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={5} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={5}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 1s ease', filter: `drop-shadow(0 0 6px ${color}88)` }} />
    </svg>
  );
}

function StatCard({ icon, label, value, sub, color, delay = 0 }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 16, padding: '20px 22px', position: 'relative', overflow: 'hidden',
      animation: `fadeUp 0.5s ${delay}s ease both`,
      transition: 'border-color 0.2s, transform 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = color + '55'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
      <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, background: color, borderRadius: '50%', filter: 'blur(30px)', opacity: 0.12 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: color + '18', border: `1px solid ${color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>{icon}</div>
        {sub && <span style={{ fontSize: '0.7rem', color: '#6EE7B7', background: 'rgba(110,231,183,0.1)', border: '1px solid rgba(110,231,183,0.2)', borderRadius: 100, padding: '2px 8px', fontWeight: 600 }}>{sub}</span>}
      </div>
      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.9rem', fontWeight: 800, color, lineHeight: 1, marginBottom: 4 }}>{value}</div>
      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>{label}</div>
    </div>
  );
}

// ─── Pages ─────────────────────────────────────────────────────────────────────

function HomePage({ user, enrolledSkills, getSkillProgress, navigate }) {
  const enrolled = SKILLS.filter(s => enrolledSkills.includes(s.id));
  const xpInLevel = (user?.xp || 0) % 500;
  const totalXP = user?.xp || 0;
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div style={{ animation: 'fadeUp 0.4s ease both' }}>
      {/* Greeting */}
      <div style={{ marginBottom: 32 }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: 6, letterSpacing: '0.05em' }}>
          {greeting()}, {user?.name?.split(' ')[0]} 👋
        </p>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, lineHeight: 1.2 }}>
          {enrolled.length === 0 ? "Let's start your journey" : `You're on a ${user?.streak || 0}-day streak 🔥`}
        </h1>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 32 }}>
        <StatCard icon="⚡" label="Total XP Earned" value={totalXP.toLocaleString()} sub="+50 today" color="#6EE7B7" delay={0} />
        <StatCard icon="🎯" label="Current Level" value={`Lv.${user?.level || 1}`} color="#38BDF8" delay={0.05} />
        <StatCard icon="🔥" label="Day Streak" value={user?.streak || 0} sub="Keep going!" color="#FBBF24" delay={0.1} />
        <StatCard icon="📚" label="Skills Enrolled" value={enrolled.length} color="#F472B6" delay={0.15} />
      </div>

      {/* Level progress */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '20px 24px', marginBottom: 32, animation: 'fadeUp 0.5s 0.2s ease both' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700 }}>Level {user?.level || 1}</span>
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', marginLeft: 10 }}>{xpInLevel} / 500 XP to next level</span>
          </div>
          <span style={{ color: '#6EE7B7', fontSize: '0.8rem', fontWeight: 600 }}>Level {(user?.level || 1) + 1} →</span>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 8, height: 8, overflow: 'hidden' }}>
          <div style={{ width: `${(xpInLevel / 500) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #6EE7B7, #38BDF8)', borderRadius: 8, transition: 'width 1s ease', boxShadow: '0 0 12px rgba(110,231,183,0.5)' }} />
        </div>
      </div>

      {/* Enrolled skills */}
      <div style={{ display: 'grid', gridTemplateColumns: enrolled.length === 0 ? '1fr' : 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16, marginBottom: 32 }}>
        {enrolled.length === 0 ? (
          <div style={{ background: 'rgba(110,231,183,0.04)', border: '1px dashed rgba(110,231,183,0.2)', borderRadius: 20, padding: '48px 32px', textAlign: 'center', animation: 'fadeUp 0.5s 0.25s ease both' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>🚀</div>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.2rem', marginBottom: 10 }}>Start Your First Skill!</h3>
            <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 24, fontSize: '0.9rem' }}>120+ skills waiting for you — all free, all structured A to Z</p>
            <button onClick={() => navigate('/explore')} style={{ background: '#6EE7B7', color: '#080A0F', border: 'none', padding: '12px 28px', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'DM Sans, sans-serif' }}>Explore Skills →</button>
          </div>
        ) : enrolled.map((skill, i) => {
          const totalL = skill.modules.reduce((a, m) => a + m.lessons.length, 0);
          const prog = getSkillProgress(skill.id, totalL);
          return (
            <div key={skill.id} onClick={() => navigate(`/skill/${skill.slug}`)}
              style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${skill.color}22`, borderRadius: 16, padding: 22, cursor: 'pointer', transition: 'all 0.2s', animation: `fadeUp 0.5s ${0.25 + i * 0.05}s ease both` }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = skill.color + '55'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.background = skill.color + '08'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = skill.color + '22'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <XPRing percent={prog.percent} color={skill.color} size={60} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>{skill.icon}</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: 4, fontSize: '0.95rem' }}>{skill.name}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginBottom: 8 }}>{prog.done}/{totalL} lessons complete</div>
                  <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 4, height: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${prog.percent}%`, height: '100%', background: skill.color, borderRadius: 4, boxShadow: `0 0 8px ${skill.color}88` }} />
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ color: skill.color, fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.1rem' }}>{prog.percent}%</div>
                  {prog.percent === 100 && <div style={{ fontSize: '0.65rem', color: '#6EE7B7', marginTop: 2 }}>🎓 Done!</div>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trending */}
      <div style={{ animation: 'fadeUp 0.5s 0.3s ease both' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.1rem', fontWeight: 700 }}>🔥 Trending Skills</h2>
          <button onClick={() => navigate('/explore')} style={{ background: 'none', border: 'none', color: '#6EE7B7', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>View All →</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
          {SKILLS.filter(s => !enrolledSkills.includes(s.id)).slice(0, 4).map((skill, i) => (
            <div key={skill.id} onClick={() => navigate(`/skill/${skill.slug}`)}
              style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid rgba(255,255,255,0.07)`, borderRadius: 14, padding: '18px 16px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = skill.color + '55'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>{skill.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '0.8rem', marginBottom: 4 }}>{skill.name}</div>
              <div style={{ color: skill.color, fontSize: '0.7rem' }}>{skill.category}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ExploreDashPage({ enrolledSkills, navigate }) {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');
  const cats = ['All', 'Technology', 'Design', 'Arts', 'Business', 'Lifestyle'];
  const filtered = SKILLS.filter(s => (cat === 'All' || s.category === cat) && s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ animation: 'fadeUp 0.4s ease both' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.8rem', fontWeight: 800, marginBottom: 6 }}>Explore Skills</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>120+ skills across every category — all free</p>
      </div>
      <div style={{ position: 'relative', marginBottom: 20, maxWidth: 420 }}>
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', fontSize: '1rem' }}>🔍</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search skills..."
          style={{ width: '100%', padding: '12px 16px 12px 40px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: '0.9rem', fontFamily: 'DM Sans, sans-serif', outline: 'none' }} />
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
        {cats.map(c => (
          <button key={c} onClick={() => setCat(c)} style={{ padding: '7px 16px', borderRadius: 100, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', border: `1px solid ${cat === c ? '#6EE7B7' : 'rgba(255,255,255,0.1)'}`, background: cat === c ? 'rgba(110,231,183,0.12)' : 'transparent', color: cat === c ? '#6EE7B7' : 'rgba(255,255,255,0.45)', transition: 'all 0.15s', fontFamily: 'DM Sans, sans-serif' }}>{c}</button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
        {filtered.map((skill, i) => {
          const isEnrolled = enrolledSkills.includes(skill.id);
          return (
            <div key={skill.id} onClick={() => navigate(`/skill/${skill.slug}`)}
              style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${skill.color}22`, borderRadius: 16, padding: '22px 20px', cursor: 'pointer', transition: 'all 0.2s', position: 'relative', overflow: 'hidden', animation: `fadeUp 0.4s ${i * 0.04}s ease both` }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = skill.color + '55'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = skill.color + '22'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div style={{ position: 'absolute', top: -20, right: -20, width: 70, height: 70, background: skill.color, borderRadius: '50%', filter: 'blur(25px)', opacity: 0.1 }} />
              {isEnrolled && <div style={{ position: 'absolute', top: 12, right: 12, background: '#6EE7B7', color: '#080A0F', fontSize: '0.6rem', fontWeight: 800, borderRadius: 100, padding: '2px 7px' }}>ENROLLED</div>}
              <div style={{ fontSize: '2.2rem', marginBottom: 12 }}>{skill.icon}</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: 5, fontSize: '0.9rem' }}>{skill.name}</div>
              <div style={{ color: skill.color, fontSize: '0.75rem', marginBottom: 10, fontWeight: 600 }}>{skill.category}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem' }}>📚 {skill.totalLessons} lessons</span>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem' }}>{skill.level}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProgressPage({ user, enrolledSkills, getSkillProgress }) {
  const enrolled = SKILLS.filter(s => enrolledSkills.includes(s.id));
  const totalLessonsCompleted = enrolled.reduce((acc, skill) => {
    const totalL = skill.modules.reduce((a, m) => a + m.lessons.length, 0);
    return acc + getSkillProgress(skill.id, totalL).done;
  }, 0);
  const completedSkills = enrolled.filter(skill => {
    const totalL = skill.modules.reduce((a, m) => a + m.lessons.length, 0);
    return getSkillProgress(skill.id, totalL).percent === 100;
  });

  return (
    <div style={{ animation: 'fadeUp 0.4s ease both' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.8rem', fontWeight: 800, marginBottom: 6 }}>My Progress</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>Track your learning journey</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 32 }}>
        <StatCard icon="📖" label="Lessons Completed" value={totalLessonsCompleted} color="#6EE7B7" />
        <StatCard icon="✅" label="Skills Finished" value={completedSkills.length} color="#38BDF8" />
        <StatCard icon="⚡" label="Total XP" value={(user?.xp || 0).toLocaleString()} color="#FBBF24" />
      </div>

      {enrolled.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.3)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>📊</div>
          <p>Enroll in skills to track progress here</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {enrolled.map((skill, i) => {
            const totalL = skill.modules.reduce((a, m) => a + m.lessons.length, 0);
            const prog = getSkillProgress(skill.id, totalL);
            return (
              <div key={skill.id} style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid rgba(255,255,255,0.07)`, borderRadius: 16, padding: '20px 24px', animation: `fadeUp 0.4s ${i * 0.07}s ease both` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <XPRing percent={prog.percent} color={skill.color} size={56} />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>{skill.icon}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700 }}>{skill.name}</span>
                      <span style={{ color: skill.color, fontWeight: 800, fontFamily: 'Syne, sans-serif' }}>{prog.percent}%</span>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 6, height: 6, overflow: 'hidden' }}>
                      <div style={{ width: `${prog.percent}%`, height: '100%', background: `linear-gradient(90deg, ${skill.color}, ${skill.color}88)`, borderRadius: 6, transition: 'width 1s ease' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                      <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>{prog.done} of {totalL} lessons</span>
                      <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>+{prog.done * 50} XP earned</span>
                    </div>
                  </div>
                </div>
                {/* Module breakdown */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {skill.modules.map((mod, mi) => (
                    <div key={mi} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '5px 10px', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>
                      {mod.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ProfileDashPage({ user, logout, navigate, enrolledSkills, getSkillProgress }) {
  const enrolled = SKILLS.filter(s => enrolledSkills.includes(s.id));
  const xpInLevel = (user?.xp || 0) % 500;
  const BADGES = [
    { icon: '🚀', name: 'First Launch', desc: 'Enrolled in first skill', earned: enrolledSkills.length > 0 },
    { icon: '🔥', name: 'On Fire', desc: '3+ day streak', earned: (user?.streak || 0) >= 3 },
    { icon: '⚡', name: 'XP Hunter', desc: 'Earned 100+ XP', earned: (user?.xp || 0) >= 100 },
    { icon: '🎓', name: 'Graduate', desc: 'Completed a skill', earned: enrolled.some(s => { const t = s.modules.reduce((a, m) => a + m.lessons.length, 0); return getSkillProgress(s.id, t).percent === 100; }) },
    { icon: '📚', name: 'Collector', desc: 'Enrolled in 3+ skills', earned: enrolledSkills.length >= 3 },
    { icon: '🏆', name: 'Champion', desc: 'Reached level 5', earned: (user?.level || 1) >= 5 },
  ];

  return (
    <div style={{ animation: 'fadeUp 0.4s ease both' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.8rem', fontWeight: 800, marginBottom: 6 }}>My Profile</h1>
      </div>

      {/* Profile card */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '28px 32px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, background: 'rgba(110,231,183,0.06)', borderRadius: '50%', filter: 'blur(40px)' }} />
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #6EE7B7, #38BDF8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800, color: '#080A0F', flexShrink: 0, boxShadow: '0 0 30px rgba(110,231,183,0.4)' }}>
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.4rem', fontWeight: 800, marginBottom: 4 }}>{user?.name}</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: 12 }}>{user?.email}</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(110,231,183,0.1)', border: '1px solid rgba(110,231,183,0.25)', borderRadius: 100, padding: '4px 12px', fontSize: '0.75rem', color: '#6EE7B7', fontWeight: 600 }}>⚡ Level {user?.level || 1}</span>
            <span style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.25)', borderRadius: 100, padding: '4px 12px', fontSize: '0.75rem', color: '#FBBF24', fontWeight: 600 }}>🔥 {user?.streak || 0} Day Streak</span>
            <span style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.25)', borderRadius: 100, padding: '4px 12px', fontSize: '0.75rem', color: '#A78BFA', fontWeight: 600 }}>🎓 {user?.ageGroup || 'Learner'}</span>
          </div>
        </div>
        <div style={{ textAlign: 'center', position: 'relative' }}>
          <XPRing percent={(xpInLevel / 500) * 100} color="#6EE7B7" size={80} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1rem', color: '#6EE7B7' }}>{user?.xp || 0}</div>
            <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)' }}>XP</div>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '24px 28px', marginBottom: 24 }}>
        <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: 20 }}>🏅 Badges</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
          {BADGES.map((b, i) => (
            <div key={i} style={{ background: b.earned ? 'rgba(110,231,183,0.06)' : 'rgba(255,255,255,0.02)', border: `1px solid ${b.earned ? 'rgba(110,231,183,0.2)' : 'rgba(255,255,255,0.05)'}`, borderRadius: 12, padding: '14px 12px', textAlign: 'center', opacity: b.earned ? 1 : 0.4, transition: 'all 0.2s' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: 6, filter: b.earned ? 'none' : 'grayscale(1)' }}>{b.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '0.8rem', marginBottom: 3 }}>{b.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.68rem' }}>{b.desc}</div>
              {b.earned && <div style={{ color: '#6EE7B7', fontSize: '0.65rem', marginTop: 5, fontWeight: 600 }}>✓ Earned</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Logout */}
      <button onClick={() => { logout(); }} style={{ width: '100%', padding: '14px', background: 'rgba(251,113,133,0.06)', border: '1px solid rgba(251,113,133,0.2)', borderRadius: 12, color: '#FB7185', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s' }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(251,113,133,0.12)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(251,113,133,0.06)'}>
        🚪 Sign Out
      </button>
    </div>
  );
}

// ─── Main Dashboard ─────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: 'home', icon: '⬡', label: 'Dashboard' },
  { id: 'explore', icon: '🔭', label: 'Explore' },
  { id: 'progress', icon: '📊', label: 'Progress' },
  { id: 'profile', icon: '👤', label: 'Profile' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout, enrolledSkills, getSkillProgress } = useStore();
  const [activePage, setActivePage] = useState('home');
  const [showChat, setShowChat] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const pageProps = { user, enrolledSkills, getSkillProgress, navigate, logout: handleLogout };

  return (
    <div style={{ minHeight: '100vh', background: '#080A0F', display: 'flex', fontFamily: 'DM Sans, sans-serif', color: '#fff' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.5;} }
        ::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        .nav-item { display:flex; align-items:center; gap:12px; padding:10px 14px; border-radius:12px; cursor:pointer; transition:all 0.2s; color:rgba(255,255,255,0.4); font-size:0.875rem; font-weight:500; border:none; background:none; width:100%; font-family:'DM Sans',sans-serif; }
        .nav-item:hover { background:rgba(255,255,255,0.05); color:rgba(255,255,255,0.8); }
        .nav-item.active { background:rgba(110,231,183,0.1); color:#6EE7B7; border:1px solid rgba(110,231,183,0.2); }
        @media (max-width: 768px) {
          .sidebar { width: 60px !important; }
          .sidebar-label { display: none !important; }
          .main-content { padding: 20px 16px !important; }
          .stats-row { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>

      {/* ── Sidebar ── */}
      <div className="sidebar" style={{
        width: sidebarCollapsed ? 68 : 240, background: 'rgba(255,255,255,0.02)',
        borderRight: '1px solid rgba(255,255,255,0.06)', padding: '20px 12px',
        display: 'flex', flexDirection: 'column', gap: 4,
        position: 'sticky', top: 0, height: '100vh', flexShrink: 0,
        transition: 'width 0.3s ease', overflow: 'hidden',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'space-between', padding: '8px 10px 20px', marginBottom: 8 }}>
          {!sidebarCollapsed && (
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#6EE7B7' }}>⬡</span>
              <span className="sidebar-label">SkillSphere</span>
            </div>
          )}
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '1rem', padding: 4, borderRadius: 6, transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}>
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>

        {/* Nav items */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {NAV_ITEMS.map(item => (
            <button key={item.id} className={`nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => setActivePage(item.id)}
              style={{ justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}
              title={sidebarCollapsed ? item.label : ''}>
              <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{item.icon}</span>
              {!sidebarCollapsed && <span className="sidebar-label">{item.label}</span>}
            </button>
          ))}
        </div>

        {/* User card at bottom */}
        {!sidebarCollapsed && (
          <div style={{ padding: '14px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, marginTop: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #6EE7B7, #38BDF8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', color: '#080A0F', flexShrink: 0 }}>
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
                <div style={{ color: '#6EE7B7', fontSize: '0.7rem' }}>⚡ {user?.xp || 0} XP · Lv.{user?.level || 1}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Main content ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        {/* Topbar */}
        <div style={{ padding: '16px 32px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(8,10,15,0.8)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 10 }}>
          <div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem', color: 'rgba(255,255,255,0.9)' }}>
              {NAV_ITEMS.find(n => n.id === activePage)?.label}
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <div style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 100, padding: '5px 12px', fontSize: '0.75rem', color: '#FBBF24', fontWeight: 600 }}>🔥 {user?.streak || 0}</div>
              <div style={{ background: 'rgba(110,231,183,0.1)', border: '1px solid rgba(110,231,183,0.2)', borderRadius: 100, padding: '5px 12px', fontSize: '0.75rem', color: '#6EE7B7', fontWeight: 600 }}>⚡ {user?.xp || 0} XP</div>
            </div>
            <button onClick={() => setShowChat(true)} style={{ background: 'linear-gradient(135deg, #6EE7B7, #38BDF8)', border: 'none', borderRadius: 10, padding: '8px 16px', color: '#080A0F', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'DM Sans, sans-serif', boxShadow: '0 0 16px rgba(110,231,183,0.3)' }}>
              ⚡ Ask Spark
            </button>
          </div>
        </div>

        {/* Page content */}
        <div className="main-content" style={{ flex: 1, padding: '32px 36px', overflowY: 'auto', maxWidth: 1200 }}>
          {activePage === 'home' && <HomePage {...pageProps} />}
          {activePage === 'explore' && <ExploreDashPage {...pageProps} />}
          {activePage === 'progress' && <ProgressPage {...pageProps} />}
          {activePage === 'profile' && <ProfileDashPage {...pageProps} />}
        </div>
      </div>

      {/* AI Chat */}
      {showChat && <AIChat onClose={() => setShowChat(false)} />}
    </div>
  );
}
