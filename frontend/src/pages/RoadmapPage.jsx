import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/store';
import { SKILLS } from '../data/skills';

function RoadmapNode({ lesson, index, skillId, skill, isComplete, isActive, isFuture, onClick }) {
  const [hovered, setHovered] = useState(false);

  const nodeColor = isComplete ? skill.color : isActive ? '#fff' : 'rgba(255,255,255,0.15)';
  const bgColor = isComplete ? skill.color + '22' : isActive ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)';
  const borderColor = isComplete ? skill.color : isActive ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.1)';

  const isLeft = index % 2 === 0;

  return (
    <div style={{
      display: 'flex',
      flexDirection: isLeft ? 'row' : 'row-reverse',
      alignItems: 'center',
      gap: 0,
      position: 'relative',
      marginBottom: 0,
    }}>
      {/* Card */}
      <div onClick={() => !isFuture && onClick(lesson)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: '42%',
          background: hovered && !isFuture ? skill.color + '15' : bgColor,
          border: `1px solid ${hovered && !isFuture ? skill.color + '66' : borderColor}`,
          borderRadius: 14,
          padding: '14px 18px',
          cursor: isFuture ? 'default' : 'pointer',
          transition: 'all 0.25s',
          transform: hovered && !isFuture ? 'scale(1.02)' : 'scale(1)',
          opacity: isFuture ? 0.45 : 1,
          position: 'relative',
          overflow: 'hidden',
        }}>
        {isComplete && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${skill.color}, transparent)` }} />
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
            background: isComplete ? skill.color : isActive ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)',
            border: `2px solid ${isComplete ? skill.color : isActive ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.75rem', fontWeight: 800,
            color: isComplete ? '#080A0F' : isActive ? '#fff' : 'rgba(255,255,255,0.3)',
            boxShadow: isComplete ? `0 0 12px ${skill.color}66` : 'none',
            transition: 'all 0.3s',
          }}>
            {isComplete ? '✓' : index + 1}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: isComplete ? '#fff' : isActive ? '#fff' : 'rgba(255,255,255,0.5)', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {lesson.title}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>
              {lesson.duration} · {isComplete ? <span style={{ color: skill.color }}>+50 XP ✓</span> : isActive ? <span style={{ color: '#fff' }}>Up next →</span> : '50 XP'}
            </div>
          </div>
        </div>
      </div>

      {/* Center line + node */}
      <div style={{ width: '16%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 2 }}>
        <div style={{
          width: 20, height: 20, borderRadius: '50%',
          background: isComplete ? skill.color : isActive ? '#fff' : 'rgba(255,255,255,0.1)',
          border: `3px solid ${isComplete ? skill.color : isActive ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)'}`,
          boxShadow: isComplete ? `0 0 16px ${skill.color}88` : isActive ? '0 0 16px rgba(255,255,255,0.3)' : 'none',
          transition: 'all 0.3s',
          flexShrink: 0,
        }} />
      </div>

      {/* Empty space for other side */}
      <div style={{ width: '42%' }} />
    </div>
  );
}

function ModuleSection({ mod, modIndex, skill, isLessonComplete, navigate, slug, isFirstLocked }) {
  const completedInMod = mod.lessons.filter(l => isLessonComplete(skill.id, l.id)).length;
  const modProgress = Math.round((completedInMod / mod.lessons.length) * 100);

  return (
    <div style={{ marginBottom: 8 }}>
      {/* Module header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, margin: '28px 0 20px', position: 'relative' }}>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${skill.color}44)` }} />
        <div style={{
          background: modProgress === 100 ? skill.color + '22' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${modProgress === 100 ? skill.color + '55' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: 100, padding: '6px 18px',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <div style={{ width: 22, height: 22, borderRadius: '50%', background: skill.color + '22', border: `2px solid ${skill.color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800, color: skill.color }}>
            {modIndex + 1}
          </div>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: modProgress === 100 ? skill.color : 'rgba(255,255,255,0.7)' }}>{mod.title}</span>
          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>{completedInMod}/{mod.lessons.length}</span>
        </div>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${skill.color}44, transparent)` }} />
      </div>

      {/* Lessons */}
      <div style={{ position: 'relative' }}>
        {/* Vertical line */}
        <div style={{
          position: 'absolute', left: '50%', top: 0, bottom: 0,
          width: 2, transform: 'translateX(-50%)',
          background: `linear-gradient(180deg, ${skill.color}44, ${skill.color}11)`,
          zIndex: 1,
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {mod.lessons.map((lesson, li) => {
            const globalIndex = modIndex * 10 + li;
            const isComplete = isLessonComplete(skill.id, lesson.id);
            const prevLessonDone = li === 0 ? (modIndex === 0 ? true : true) : isLessonComplete(skill.id, mod.lessons[li - 1].id);
            const isActive = !isComplete && prevLessonDone && !isFirstLocked;
            const isFuture = !isComplete && !isActive;

            return (
              <RoadmapNode
                key={lesson.id}
                lesson={lesson}
                index={globalIndex}
                skillId={skill.id}
                skill={skill}
                isComplete={isComplete}
                isActive={isActive}
                isFuture={isFuture}
                onClick={() => navigate(`/skill/${slug}/lesson/${lesson.id}`)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function RoadmapPage() {
  const navigate = useNavigate();
  const { enrolledSkills, getSkillProgress, isLessonComplete } = useStore();
  const [selectedSkill, setSelectedSkill] = useState(null);

  const enrolled = SKILLS.filter(s => enrolledSkills.includes(s.id));
  const activeSkill = selectedSkill ? SKILLS.find(s => s.id === selectedSkill) : enrolled[0];

  const totalLessons = activeSkill ? activeSkill.modules.reduce((a, m) => a + m.lessons.length, 0) : 0;
  const prog = activeSkill ? getSkillProgress(activeSkill.id, totalLessons) : { done: 0, total: 0, percent: 0 };

  return (
    <div style={{ minHeight: '100vh', background: '#080A0F', fontFamily: 'DM Sans, sans-serif', color: '#fff' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.7;transform:scale(1.1);} }
        @keyframes glow { 0%,100%{box-shadow:0 0 16px rgba(110,231,183,0.3);} 50%{box-shadow:0 0 32px rgba(110,231,183,0.6);} }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>

      {/* Header */}
      <div style={{
        padding: '20px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(8,10,15,0.9)', backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 20,
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <button onClick={() => navigate('/dashboard')} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 14px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}>
          ← Dashboard
        </button>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>🗺️ Skill Roadmap</h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', margin: 0 }}>Your complete A-to-Z learning path</p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>

        {enrolled.length === 0 ? (
          /* Empty state */
          <div style={{ textAlign: 'center', padding: '80px 20px', animation: 'fadeUp 0.5s ease both' }}>
            <div style={{ fontSize: '4rem', marginBottom: 20 }}>🗺️</div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.5rem', marginBottom: 12 }}>No roadmaps yet!</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 28 }}>Enroll in a skill to see your personalized A-to-Z roadmap</p>
            <button onClick={() => navigate('/explore')} style={{ background: '#6EE7B7', color: '#080A0F', border: 'none', padding: '13px 28px', borderRadius: 12, fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem', fontFamily: 'DM Sans, sans-serif' }}>
              Browse Skills →
            </button>
          </div>
        ) : (
          <>
            {/* Skill selector pills */}
            {enrolled.length > 1 && (
              <div style={{ display: 'flex', gap: 10, marginBottom: 32, flexWrap: 'wrap', animation: 'fadeUp 0.4s ease both' }}>
                {enrolled.map(skill => {
                  const tl = skill.modules.reduce((a, m) => a + m.lessons.length, 0);
                  const p = getSkillProgress(skill.id, tl);
                  const isSelected = (selectedSkill || enrolled[0].id) === skill.id;
                  return (
                    <button key={skill.id} onClick={() => setSelectedSkill(skill.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '9px 18px', borderRadius: 100, cursor: 'pointer',
                        border: `1px solid ${isSelected ? skill.color : 'rgba(255,255,255,0.1)'}`,
                        background: isSelected ? skill.color + '18' : 'rgba(255,255,255,0.03)',
                        color: isSelected ? skill.color : 'rgba(255,255,255,0.5)',
                        fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.85rem',
                        transition: 'all 0.2s',
                      }}>
                      <span>{skill.icon}</span>
                      <span>{skill.name}</span>
                      <span style={{ background: isSelected ? skill.color + '33' : 'rgba(255,255,255,0.07)', borderRadius: 100, padding: '1px 7px', fontSize: '0.7rem' }}>{p.percent}%</span>
                    </button>
                  );
                })}
              </div>
            )}

            {activeSkill && (
              <div style={{ animation: 'fadeUp 0.4s ease both' }}>
                {/* Skill hero */}
                <div style={{
                  background: `linear-gradient(135deg, ${activeSkill.color}12, rgba(255,255,255,0.02))`,
                  border: `1px solid ${activeSkill.color}33`,
                  borderRadius: 20, padding: '28px 32px', marginBottom: 40,
                  position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, background: activeSkill.color, borderRadius: '50%', filter: 'blur(60px)', opacity: 0.1 }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                    <div style={{ fontSize: '3.5rem' }}>{activeSkill.icon}</div>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.4rem', fontWeight: 800, marginBottom: 6 }}>{activeSkill.name}</h2>
                      <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
                        <span style={{ background: activeSkill.color + '22', border: `1px solid ${activeSkill.color}44`, borderRadius: 100, padding: '3px 10px', fontSize: '0.72rem', color: activeSkill.color, fontWeight: 600 }}>{activeSkill.category}</span>
                        <span style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 100, padding: '3px 10px', fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>📚 {totalLessons} Lessons</span>
                        <span style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 100, padding: '3px 10px', fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{activeSkill.modules.length} Modules</span>
                      </div>
                      {/* Progress bar */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                          <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>{prog.done} of {totalLessons} lessons complete</span>
                          <span style={{ fontSize: '0.78rem', color: activeSkill.color, fontWeight: 700 }}>{prog.percent}%</span>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 6, height: 8, overflow: 'hidden' }}>
                          <div style={{ width: `${prog.percent}%`, height: '100%', background: `linear-gradient(90deg, ${activeSkill.color}, ${activeSkill.color}88)`, borderRadius: 6, transition: 'width 1s ease', boxShadow: `0 0 10px ${activeSkill.color}66` }} />
                        </div>
                      </div>
                    </div>
                    {/* XP earned */}
                    <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '16px 20px' }}>
                      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.6rem', fontWeight: 800, color: activeSkill.color, lineHeight: 1 }}>{prog.done * 50}</div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', marginTop: 4 }}>XP Earned</div>
                    </div>
                  </div>

                  {prog.percent === 100 && (
                    <div style={{ marginTop: 20, background: activeSkill.color + '15', border: `1px solid ${activeSkill.color}44`, borderRadius: 12, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: '1.4rem', animation: 'pulse 2s infinite' }}>🎓</span>
                      <div>
                        <div style={{ fontWeight: 700, color: activeSkill.color, fontSize: '0.9rem' }}>Skill Complete! Congratulations!</div>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>Go to the skill page to download your certificate</div>
                      </div>
                      <button onClick={() => navigate(`/skill/${activeSkill.slug}`)} style={{ marginLeft: 'auto', background: activeSkill.color, color: '#080A0F', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'DM Sans, sans-serif', flexShrink: 0 }}>
                        Get Certificate →
                      </button>
                    </div>
                  )}
                </div>

                {/* Legend */}
                <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginBottom: 32, flexWrap: 'wrap' }}>
                  {[
                    { color: activeSkill.color, label: 'Completed', dot: true },
                    { color: '#fff', label: 'Up Next', dot: true },
                    { color: 'rgba(255,255,255,0.2)', label: 'Locked', dot: true },
                  ].map((l, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)' }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: l.color, boxShadow: l.color !== 'rgba(255,255,255,0.2)' ? `0 0 8px ${l.color}88` : 'none' }} />
                      {l.label}
                    </div>
                  ))}
                </div>

                {/* START node */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                  <div style={{ background: activeSkill.color + '22', border: `2px solid ${activeSkill.color}66`, borderRadius: 100, padding: '8px 24px', fontSize: '0.8rem', fontWeight: 700, color: activeSkill.color, animation: 'glow 3s ease-in-out infinite' }}>
                    🚀 START
                  </div>
                </div>

                {/* Modules + lessons */}
                {activeSkill.modules.map((mod, mi) => (
                  <ModuleSection
                    key={mod.id}
                    mod={mod}
                    modIndex={mi}
                    skill={activeSkill}
                    isLessonComplete={isLessonComplete}
                    navigate={navigate}
                    slug={activeSkill.slug}
                    isFirstLocked={false}
                  />
                ))}

                {/* END node */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24, marginBottom: 40 }}>
                  <div style={{
                    background: prog.percent === 100 ? activeSkill.color + '22' : 'rgba(255,255,255,0.04)',
                    border: `2px solid ${prog.percent === 100 ? activeSkill.color : 'rgba(255,255,255,0.15)'}`,
                    borderRadius: 100, padding: '8px 24px',
                    fontSize: '0.8rem', fontWeight: 700,
                    color: prog.percent === 100 ? activeSkill.color : 'rgba(255,255,255,0.3)',
                    boxShadow: prog.percent === 100 ? `0 0 20px ${activeSkill.color}44` : 'none',
                    transition: 'all 0.5s',
                  }}>
                    {prog.percent === 100 ? '🎓 COMPLETE!' : '🏁 FINISH'}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
