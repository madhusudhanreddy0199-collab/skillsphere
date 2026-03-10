import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const SKILLS = [
  { icon: '💻', name: 'Web Development', category: 'Technology', color: '#6EE7B7', students: '12.4k' },
  { icon: '🎨', name: 'UI/UX Design', category: 'Design', color: '#F472B6', students: '8.1k' },
  { icon: '🧠', name: 'AI & Machine Learning', category: 'Technology', color: '#A78BFA', students: '9.7k' },
  { icon: '🎸', name: 'Music & Guitar', category: 'Arts', color: '#FBBF24', students: '5.3k' },
  { icon: '📸', name: 'Photography', category: 'Arts', color: '#38BDF8', students: '6.2k' },
  { icon: '💰', name: 'Finance & Investing', category: 'Business', color: '#34D399', students: '11.8k' },
  { icon: '🍳', name: 'Cooking', category: 'Lifestyle', color: '#FB7185', students: '4.9k' },
  { icon: '✍️', name: 'Creative Writing', category: 'Arts', color: '#F9A8D4', students: '3.6k' },
];

const STATS = [
  { value: '120+', label: 'Skills Available' },
  { value: '62k+', label: 'Active Learners' },
  { value: '4.9★', label: 'Average Rating' },
  { value: '100%', label: 'Free to Start' },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma', role: 'Frontend Developer', avatar: 'P', color: '#6EE7B7', text: 'SkillSphere transformed how I learn. The AI tutor Spark helped me go from zero to landing my first dev job in 4 months.' },
  { name: 'Arjun Mehta', role: 'UI Designer', avatar: 'A', color: '#F472B6', text: 'The structured roadmaps are incredible. I finally stopped jumping between random YouTube videos and actually finished a skill A to Z.' },
  { name: 'Sneha Patel', role: 'Entrepreneur', avatar: 'S', color: '#FBBF24', text: 'I completed Finance & Investing in 3 weeks. The XP system kept me addicted to learning — best decision I made this year.' },
];

function useCounter(target, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const num = parseInt(target.replace(/\D/g, ''));
    const step = num / (duration / 16);
    const timer = setInterval(() => {
      setCount(prev => {
        if (prev >= num) { clearInterval(timer); return num; }
        return Math.min(prev + step, num);
      });
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return Math.floor(count);
}

function StatCard({ value, label }) {
  const num = useCounter(value);
  const suffix = value.replace(/[\d.]/g, '');
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
        {num}{suffix}
      </div>
      <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', marginTop: 6, letterSpacing: '0.05em' }}>{label}</div>
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeSkill, setActiveSkill] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [visible, setVisible] = useState({});
  const sectionRefs = useRef({});

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setActiveSkill(p => (p + 1) % SKILLS.length), 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) setVisible(v => ({ ...v, [e.target.id]: true }));
      }),
      { threshold: 0.1 }
    );
    Object.values(sectionRefs.current).forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const setRef = (id) => (el) => { sectionRefs.current[id] = el; };

  return (
    <div style={{ background: '#080A0F', minHeight: '100vh', overflowX: 'hidden', fontFamily: "'DM Sans', sans-serif", color: '#fff' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: rgba(110,231,183,0.3); }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #080A0F; } ::-webkit-scrollbar-thumb { background: rgba(110,231,183,0.3); border-radius: 2px; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:translateY(0); } }
        @keyframes float { 0%,100% { transform:translateY(0px) rotate(0deg); } 50% { transform:translateY(-12px) rotate(2deg); } }
        @keyframes floatReverse { 0%,100% { transform:translateY(0px); } 50% { transform:translateY(10px); } }
        @keyframes pulse { 0%,100% { opacity:0.6; transform:scale(1); } 50% { opacity:1; transform:scale(1.05); } }
        @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes marquee { from { transform:translateX(0); } to { transform:translateX(-50%); } }
        @keyframes glow { 0%,100% { box-shadow: 0 0 20px rgba(110,231,183,0.3); } 50% { box-shadow: 0 0 40px rgba(110,231,183,0.6); } }
        .reveal { opacity:0; transform:translateY(24px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .reveal.visible { opacity:1; transform:translateY(0); }
        .skill-card:hover { transform:translateY(-4px) scale(1.02); border-color: var(--c) !important; }
        .nav-link { color:rgba(255,255,255,0.5); text-decoration:none; font-size:0.875rem; font-weight:500; transition:color 0.2s; cursor:pointer; }
        .nav-link:hover { color:#fff; }
        .btn-primary-land { background:#6EE7B7; color:#080A0F; border:none; padding:14px 32px; border-radius:10px; font-weight:700; font-size:0.95rem; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.2s; animation: glow 3s ease-in-out infinite; }
        .btn-primary-land:hover { background:#5dd4a8; transform:translateY(-2px); box-shadow:0 8px 30px rgba(110,231,183,0.4); }
        .btn-ghost-land { background:transparent; color:rgba(255,255,255,0.7); border:1px solid rgba(255,255,255,0.15); padding:14px 32px; border-radius:10px; font-weight:600; font-size:0.95rem; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.2s; }
        .btn-ghost-land:hover { border-color:rgba(255,255,255,0.4); color:#fff; background:rgba(255,255,255,0.05); }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .skills-grid { grid-template-columns: repeat(2,1fr) !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .testimonials-grid { grid-template-columns: 1fr !important; }
          .hide-mobile { display:none !important; }
          .nav-btns { gap: 8px !important; }
          .hero-title { font-size: clamp(2.2rem, 8vw, 3.5rem) !important; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 clamp(20px, 5vw, 60px)',
        background: scrollY > 40 ? 'rgba(8,10,15,0.95)' : 'transparent',
        backdropFilter: scrollY > 40 ? 'blur(20px)' : 'none',
        borderBottom: scrollY > 40 ? '1px solid rgba(255,255,255,0.06)' : 'none',
        transition: 'all 0.3s', height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#6EE7B7' }}>⬡</span> SkillSphere
          </div>
          <div className="hide-mobile" style={{ display: 'flex', gap: 28 }}>
            {['Explore', 'How it Works', 'Stories'].map(l => <span key={l} className="nav-link">{l}</span>)}
          </div>
        </div>
        <div className="nav-btns" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button className="btn-ghost-land" style={{ padding: '9px 20px', fontSize: '0.85rem' }} onClick={() => navigate('/auth?mode=login')}>Sign In</button>
          <button className="btn-primary-land" style={{ padding: '9px 20px', fontSize: '0.85rem' }} onClick={() => navigate('/auth')}>Get Started Free</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '100px clamp(20px, 6vw, 80px) 60px', position: 'relative', overflow: 'hidden' }}>
        {/* Background effects */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '10%', right: '5%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(110,231,183,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: '10%', left: '-5%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: '40%', left: '40%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(244,114,182,0.05) 0%, transparent 70%)', borderRadius: '50%' }} />
          {/* Grid */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px', maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)' }} />
        </div>

        <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center', maxWidth: 1200, margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
          {/* Left */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(110,231,183,0.1)', border: '1px solid rgba(110,231,183,0.25)', borderRadius: 100, padding: '6px 14px', marginBottom: 28, animation: 'fadeUp 0.6s ease both' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6EE7B7', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              <span style={{ color: '#6EE7B7', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em' }}>62,000+ learners already inside</span>
            </div>

            <h1 className="hero-title" style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(2.8rem, 5vw, 4.2rem)', fontWeight: 800, lineHeight: 1.08, marginBottom: 24, animation: 'fadeUp 0.6s 0.1s ease both', opacity: 0, animationFillMode: 'both' }}>
              Master Any Skill<br />
              <span style={{ background: 'linear-gradient(135deg, #6EE7B7 0%, #38BDF8 50%, #A78BFA 100%)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'shimmer 4s linear infinite' }}>
                A to Z
              </span>
              <br />
              <span style={{ color: 'rgba(255,255,255,0.75)' }}>With AI by Your Side</span>
            </h1>

            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)', lineHeight: 1.75, marginBottom: 36, maxWidth: 480, animation: 'fadeUp 0.6s 0.2s ease both', opacity: 0, animationFillMode: 'both' }}>
              Structured roadmaps, AI-powered tutoring, and a gamified XP system that keeps you addicted to learning — for every skill, every age, every goal.
            </p>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 48, animation: 'fadeUp 0.6s 0.3s ease both', opacity: 0, animationFillMode: 'both' }}>
              <button className="btn-primary-land" onClick={() => navigate('/auth')}>Start Learning Free →</button>
              <button className="btn-ghost-land" onClick={() => navigate('/explore')}>Browse 120+ Skills</button>
            </div>

            {/* Social proof */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, animation: 'fadeUp 0.6s 0.4s ease both', opacity: 0, animationFillMode: 'both' }}>
              <div style={{ display: 'flex' }}>
                {['#6EE7B7','#F472B6','#38BDF8','#FBBF24','#A78BFA'].map((c, i) => (
                  <div key={i} style={{ width: 32, height: 32, borderRadius: '50%', background: c + '33', border: `2px solid ${c}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800, color: c, marginLeft: i === 0 ? 0 : -8, zIndex: 5 - i }}>
                    {['A','B','C','D','E'][i]}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>★★★★★ <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>from 4,200+ reviews</span></div>
              </div>
            </div>
          </div>

          {/* Right — Floating UI mockup */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', animation: 'fadeUp 0.6s 0.3s ease both', opacity: 0, animationFillMode: 'both' }}>
            {/* Main card */}
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 28, width: '100%', maxWidth: 380, backdropFilter: 'blur(10px)', animation: 'float 6s ease-in-out infinite', position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Currently Learning</div>
                <div style={{ background: 'rgba(110,231,183,0.15)', border: '1px solid rgba(110,231,183,0.3)', borderRadius: 100, padding: '3px 10px', fontSize: '0.7rem', color: '#6EE7B7', fontWeight: 600 }}>⚡ On a Streak</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                <div style={{ fontSize: '2.5rem', animation: 'float 4s ease-in-out infinite' }}>{SKILLS[activeSkill].icon}</div>
                <div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.1rem', marginBottom: 3 }}>{SKILLS[activeSkill].name}</div>
                  <div style={{ color: SKILLS[activeSkill].color, fontSize: '0.8rem', fontWeight: 600 }}>{SKILLS[activeSkill].category}</div>
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>Progress</span>
                  <span style={{ color: SKILLS[activeSkill].color, fontWeight: 700, fontSize: '0.8rem' }}>68%</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.08)', height: 6, borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: '68%', height: '100%', background: `linear-gradient(90deg, ${SKILLS[activeSkill].color}, ${SKILLS[activeSkill].color}88)`, borderRadius: 3, transition: 'all 0.5s' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  { label: 'XP', value: '2,450', icon: '⚡' },
                  { label: 'Streak', value: '12d', icon: '🔥' },
                  { label: 'Rank', value: '#47', icon: '🏆' },
                ].map(s => (
                  <div key={s.label} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '10px 8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.9rem', marginBottom: 3 }}>{s.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{s.value}</div>
                    <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating badges */}
            <div style={{ position: 'absolute', top: -20, right: -20, background: 'rgba(244,114,182,0.15)', border: '1px solid rgba(244,114,182,0.3)', borderRadius: 12, padding: '10px 14px', backdropFilter: 'blur(10px)', animation: 'floatReverse 5s ease-in-out infinite', zIndex: 3 }}>
              <div style={{ fontSize: '0.7rem', color: '#F472B6', fontWeight: 700 }}>🎓 Certificate Earned!</div>
            </div>
            <div style={{ position: 'absolute', bottom: 10, left: -30, background: 'rgba(110,231,183,0.15)', border: '1px solid rgba(110,231,183,0.3)', borderRadius: 12, padding: '10px 14px', backdropFilter: 'blur(10px)', animation: 'float 7s ease-in-out infinite', zIndex: 3 }}>
              <div style={{ fontSize: '0.7rem', color: '#6EE7B7', fontWeight: 700 }}>+50 XP ⚡</div>
            </div>
            <div style={{ position: 'absolute', top: '40%', left: -40, background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.3)', borderRadius: 12, padding: '10px 14px', backdropFilter: 'blur(10px)', animation: 'floatReverse 4s ease-in-out infinite', zIndex: 3 }}>
              <div style={{ fontSize: '0.7rem', color: '#A78BFA', fontWeight: 700 }}>⚡ Spark AI is ready</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '16px 0', overflow: 'hidden', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ display: 'flex', animation: 'marquee 20s linear infinite', width: 'max-content' }}>
          {[...SKILLS, ...SKILLS].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 28px', whiteSpace: 'nowrap' }}>
              <span>{s.icon}</span>
              <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{s.name}</span>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: s.color, opacity: 0.5 }} />
            </div>
          ))}
        </div>
      </div>

      {/* ── STATS ── */}
      <section style={{ padding: '80px clamp(20px, 6vw, 80px)' }}>
        <div className="stats-grid" id="stats" ref={setRef('stats')} style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 32, maxWidth: 900, margin: '0 auto' }}>
          {STATS.map((s, i) => <StatCard key={i} {...s} />)}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '80px clamp(20px, 6vw, 80px)', position: 'relative' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div id="how" ref={setRef('how')} className={`reveal ${visible.how ? 'visible' : ''}`} style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ display: 'inline-block', background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 100, padding: '5px 16px', fontSize: '0.75rem', color: '#38BDF8', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>How It Works</div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 800, marginBottom: 16 }}>
              From Zero to Certified<br />
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>in Four Simple Steps</span>
            </h2>
          </div>

          <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
            {[
              { step: '01', icon: '🔭', title: 'Pick a Skill', desc: 'Browse 120+ skills across tech, arts, business, and lifestyle. Find your passion.', color: '#6EE7B7' },
              { step: '02', icon: '🗺️', title: 'Follow the Roadmap', desc: 'Every skill has a structured A-to-Z path with video lessons, no guesswork.', color: '#38BDF8' },
              { step: '03', icon: '⚡', title: 'Learn with Spark AI', desc: 'Ask your AI tutor anything, get instant personalized explanations and feedback.', color: '#A78BFA' },
              { step: '04', icon: '🎓', title: 'Earn Certificate', desc: 'Complete all lessons, earn your certificate, and show the world your achievement.', color: '#F472B6' },
            ].map((f, i) => (
              <div key={i} id={`feat${i}`} ref={setRef(`feat${i}`)} className={`reveal ${visible[`feat${i}`] ? 'visible' : ''}`}
                style={{ transitionDelay: `${i * 0.1}s`, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 28, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 16, right: 16, fontFamily: 'Syne, sans-serif', fontSize: '3rem', fontWeight: 800, color: 'rgba(255,255,255,0.04)', lineHeight: 1 }}>{f.step}</div>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: f.color + '15', border: `1px solid ${f.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1rem', fontWeight: 700, marginBottom: 10, color: f.color }}>{f.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SKILLS GRID ── */}
      <section style={{ padding: '80px clamp(20px, 6vw, 80px)', background: 'rgba(255,255,255,0.01)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div id="skills" ref={setRef('skills')} className={`reveal ${visible.skills ? 'visible' : ''}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ display: 'inline-block', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 100, padding: '5px 16px', fontSize: '0.75rem', color: '#FBBF24', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>120+ Skills</div>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 800 }}>What Will You<br />Master Next?</h2>
            </div>
            <button className="btn-ghost-land" onClick={() => navigate('/explore')} style={{ padding: '11px 22px', fontSize: '0.875rem' }}>View All Skills →</button>
          </div>

          <div className="skills-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
            {SKILLS.map((skill, i) => (
              <div key={i} className="skill-card" id={`skill${i}`} ref={setRef(`skill${i}`)}
                onClick={() => navigate('/explore')}
                style={{ '--c': skill.color, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '22px 20px', cursor: 'pointer', transition: 'all 0.25s', transitionDelay: `${i * 0.05}s` }}>
                <div style={{ fontSize: '2rem', marginBottom: 12 }}>{skill.icon}</div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.9rem', marginBottom: 6 }}>{skill.name}</div>
                <div style={{ color: skill.color, fontSize: '0.75rem', fontWeight: 600, marginBottom: 10 }}>{skill.category}</div>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>👥 {skill.students} learners</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: '80px clamp(20px, 6vw, 80px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div id="testi" ref={setRef('testi')} className={`reveal ${visible.testi ? 'visible' : ''}`} style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ display: 'inline-block', background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 100, padding: '5px 16px', fontSize: '0.75rem', color: '#A78BFA', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>Success Stories</div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 800 }}>Real People. Real Results.</h2>
          </div>
          <div className="testimonials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} id={`testi${i}`} ref={setRef(`testi${i}`)} className={`reveal ${visible[`testi${i}`] ? 'visible' : ''}`}
                style={{ transitionDelay: `${i * 0.1}s`, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 28 }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                  {[...Array(5)].map((_, j) => <span key={j} style={{ color: '#FBBF24', fontSize: '0.85rem' }}>★</span>)}
                </div>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 20 }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: t.color + '22', border: `2px solid ${t.color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: t.color, fontSize: '0.9rem' }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{t.name}</div>
                    <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '80px clamp(20px, 6vw, 80px)' }}>
        <div id="cta" ref={setRef('cta')} className={`reveal ${visible.cta ? 'visible' : ''}`}
          style={{ maxWidth: 750, margin: '0 auto', textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: 'clamp(40px, 6vw, 72px)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)', width: 400, height: 400, background: 'radial-gradient(circle, rgba(110,231,183,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
          <div style={{ fontSize: '3rem', marginBottom: 20 }}>🚀</div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 800, marginBottom: 16, position: 'relative' }}>
            Your Journey Starts<br />
            <span style={{ background: 'linear-gradient(135deg, #6EE7B7, #38BDF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Today. For Free.</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '1rem', marginBottom: 36, position: 'relative', maxWidth: 440, margin: '0 auto 36px' }}>
            Join 62,000 learners mastering new skills every day. No credit card. No catch. Just learning.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
            <button className="btn-primary-land" style={{ padding: '15px 36px', fontSize: '1rem' }} onClick={() => navigate('/auth')}>
              Create Free Account →
            </button>
            <button className="btn-ghost-land" style={{ padding: '15px 36px', fontSize: '1rem' }} onClick={() => navigate('/explore')}>
              Browse Skills First
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px clamp(20px, 6vw, 80px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#6EE7B7' }}>⬡</span> SkillSphere
        </div>
        <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem' }}>
          © 2026 SkillSphere. Built with ⚡ and AI.
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          {['Privacy', 'Terms', 'Contact'].map(l => (
            <span key={l} style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#fff'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.3)'}>{l}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}
