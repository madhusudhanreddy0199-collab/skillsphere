import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../context/store';

export default function AuthPage() {
  const [params] = useSearchParams();
  const [mode, setMode] = useState(params.get('mode') === 'login' ? 'login' : 'signup');
  const [form, setForm] = useState({ name: '', email: '', password: '', ageGroup: 'adults' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const login = useStore(s => s.login);

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      // Demo mode fallback
      login({ name: form.name || form.email.split('@')[0], email: form.email, xp: 0, level: 1, streak: 3, ageGroup: form.ageGroup }, 'demo-token');
      navigate('/dashboard');
    }
    setLoading(false);
  };

  const AGE_GROUPS = ['kids','teens','young-adults','adults','seniors'];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="orb orb1" /><div className="orb orb2" />
      <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>⬡</div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: 8 }}>{mode === 'login' ? 'Welcome back!' : 'Join SkillSphere'}</h1>
          <p style={{ color: 'var(--muted)' }}>{mode === 'login' ? 'Sign in to continue learning' : 'Start your learning journey today — free'}</p>
        </div>
        <div className="card" style={{ padding: 32 }}>
          {error && <div style={{ background: 'rgba(251,113,133,0.1)', border: '1px solid rgba(251,113,133,0.3)', borderRadius: 8, padding: '10px 14px', color: '#FB7185', marginBottom: 16, fontSize: '0.875rem' }}>{error}</div>}
          <form onSubmit={handle} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {mode === 'signup' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--muted)', marginBottom: 6, fontWeight: 600 }}>YOUR NAME</label>
                <input className="input" placeholder="Alex Smith" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
            )}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--muted)', marginBottom: 6, fontWeight: 600 }}>EMAIL</label>
              <input className="input" type="email" placeholder="you@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--muted)', marginBottom: 6, fontWeight: 600 }}>PASSWORD</label>
              <input className="input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
            </div>
            {mode === 'signup' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--muted)', marginBottom: 8, fontWeight: 600 }}>AGE GROUP</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {AGE_GROUPS.map(ag => (
                    <button key={ag} type="button"
                      style={{ padding: '6px 14px', borderRadius: 100, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', border: `1px solid ${form.ageGroup === ag ? 'var(--accent)' : 'var(--border)'}`, background: form.ageGroup === ag ? 'rgba(110,231,183,0.15)' : 'var(--surface2)', color: form.ageGroup === ag ? 'var(--accent)' : 'var(--muted)', transition: 'all 0.15s' }}
                      onClick={() => setForm({...form, ageGroup: ag})}>{ag}</button>
                  ))}
                </div>
              </div>
            )}
            <button className="btn btn-primary" type="submit" disabled={loading} style={{ marginTop: 8, padding: '14px' }}>
              {loading ? 'Loading...' : mode === 'login' ? 'Sign In →' : 'Start Learning Free →'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--muted)', fontSize: '0.875rem' }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <span style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }} onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
              {mode === 'login' ? 'Sign up free' : 'Sign in'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
