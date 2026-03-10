import React, { useRef, useState } from 'react';

export default function Certificate({ skill, user, onClose }) {
  const certRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const certId = `SS-${Date.now().toString(36).toUpperCase()}`;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Use html2canvas if available, otherwise just print
      if (window.html2canvas) {
        const canvas = await window.html2canvas(certRef.current, { scale: 2, backgroundColor: '#0a0b10' });
        const link = document.createElement('a');
        link.download = `SkillSphere-${skill.name}-Certificate.png`;
        link.href = canvas.toDataURL();
        link.click();
      } else {
        window.print();
      }
    } catch (e) {
      window.print();
    }
    setDownloading(false);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, backdropFilter: 'blur(8px)',
      animation: 'fadeIn 0.3s ease'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fadeIn { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }
        @keyframes shimmer { 0%,100% { opacity:0.6; } 50% { opacity:1; } }
        @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-6px); } }
        @media print {
          body * { visibility: hidden; }
          #cert-print, #cert-print * { visibility: visible; }
          #cert-print { position: fixed; top:0; left:0; width:100%; }
        }
      `}</style>

      <div style={{ width: '100%', maxWidth: 820, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>

        {/* Certificate */}
        <div id="cert-print" ref={certRef} style={{
          width: '100%', background: '#0a0b10',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 4, position: 'relative', overflow: 'hidden',
          padding: '60px 70px', fontFamily: "'DM Sans', sans-serif",
        }}>
          {/* Corner decorations */}
          {[
            { top: 16, left: 16 }, { top: 16, right: 16 },
            { bottom: 16, left: 16 }, { bottom: 16, right: 16 }
          ].map((pos, i) => (
            <div key={i} style={{
              position: 'absolute', width: 40, height: 40,
              borderTop: i < 2 ? '2px solid ' + skill.color : 'none',
              borderBottom: i >= 2 ? '2px solid ' + skill.color : 'none',
              borderLeft: (i === 0 || i === 2) ? '2px solid ' + skill.color : 'none',
              borderRight: (i === 1 || i === 3) ? '2px solid ' + skill.color : 'none',
              ...pos, opacity: 0.7
            }} />
          ))}

          {/* Top accent line */}
          <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: 3, background: `linear-gradient(90deg, transparent, ${skill.color}, transparent)` }} />

          {/* Subtle background pattern */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.03,
            backgroundImage: `radial-gradient(circle, ${skill.color} 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }} />

          {/* Glow orb */}
          <div style={{
            position: 'absolute', top: -60, right: -60, width: 300, height: 300,
            background: skill.color, borderRadius: '50%', filter: 'blur(100px)', opacity: 0.07
          }} />

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 40, position: 'relative' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: 8, animation: 'float 3s ease-in-out infinite' }}>{skill.icon}</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.75rem', letterSpacing: '0.35em', color: skill.color, textTransform: 'uppercase', marginBottom: 6 }}>
              SkillSphere Academy
            </div>
            <div style={{ width: 60, height: 1, background: skill.color, margin: '12px auto', opacity: 0.5 }} />
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.65rem', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>
              Certificate of Completion
            </div>
          </div>

          {/* Main text */}
          <div style={{ textAlign: 'center', marginBottom: 40, position: 'relative' }}>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', letterSpacing: '0.1em', marginBottom: 16, textTransform: 'uppercase' }}>
              This certifies that
            </p>
            <h1 style={{
              fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 5vw, 3rem)',
              color: '#fff', fontWeight: 700, marginBottom: 8,
              textShadow: `0 0 40px ${skill.color}44`
            }}>
              {user?.name || 'Learner'}
            </h1>
            <div style={{ width: 120, height: 1, background: 'rgba(255,255,255,0.15)', margin: '16px auto' }} />
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', letterSpacing: '0.1em', marginBottom: 20, textTransform: 'uppercase' }}>
              has successfully completed
            </p>
            <div style={{
              display: 'inline-block', padding: '14px 32px',
              background: skill.color + '15', border: `1px solid ${skill.color}55`,
              borderRadius: 4, marginBottom: 20
            }}>
              <h2 style={{
                fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                color: skill.color, fontWeight: 700, margin: 0
              }}>
                {skill.name}
              </h2>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', maxWidth: 400, margin: '0 auto', lineHeight: 1.6 }}>
              Demonstrating dedication, perseverance, and mastery of all course modules and learning objectives.
            </p>
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', color: 'rgba(255,255,255,0.7)', marginBottom: 6 }}>
                {date}
              </div>
              <div style={{ width: 100, height: 1, background: 'rgba(255,255,255,0.2)', marginBottom: 6 }} />
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Date Issued</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 4, animation: 'shimmer 2s ease-in-out infinite' }}>{skill.icon}</div>
              <div style={{ fontSize: '0.6rem', color: skill.color, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>⬡ SkillSphere</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '1rem', color: 'rgba(255,255,255,0.7)', marginBottom: 6 }}>
                Spark AI Academy
              </div>
              <div style={{ width: 100, height: 1, background: 'rgba(255,255,255,0.2)', marginBottom: 6 }} />
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Authorized By</div>
            </div>
          </div>

          {/* Cert ID */}
          <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.15)', letterSpacing: '0.1em' }}>
            Certificate ID: {certId}
          </div>

          {/* Bottom accent */}
          <div style={{ position: 'absolute', bottom: 0, left: '15%', right: '15%', height: 3, background: `linear-gradient(90deg, transparent, ${skill.color}, transparent)` }} />
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={handleDownload} disabled={downloading} style={{
            padding: '12px 28px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 700,
            background: skill.color, color: '#08090d', fontSize: '0.9rem',
            opacity: downloading ? 0.7 : 1, transition: 'all 0.15s',
            fontFamily: "'DM Sans', sans-serif"
          }}>
            {downloading ? 'Saving...' : '⬇ Download Certificate'}
          </button>
          <button onClick={onClose} style={{
            padding: '12px 28px', borderRadius: 8, cursor: 'pointer', fontWeight: 600,
            background: 'transparent', border: '1px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem',
            fontFamily: "'DM Sans', sans-serif"
          }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
