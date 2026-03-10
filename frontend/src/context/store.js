import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(persist((set, get) => ({
  user: null,
  token: null,
  isLoggedIn: false,

  login: (user, token) => set({ user, token, isLoggedIn: true }),
  logout: () => set({ user: null, token: null, isLoggedIn: false, progress: {} }),

  progress: {},
  enrolledSkills: [],

  enrollSkill: (skillId) => {
    const { enrolledSkills } = get();
    if (!enrolledSkills.includes(skillId))
      set({ enrolledSkills: [...enrolledSkills, skillId] });
  },

  markLessonComplete: async (skillId, lessonId) => {
    const { progress, user, token } = get();
    const skillProgress = new Set(progress[skillId] || []);
    if (skillProgress.has(lessonId)) return false;
    skillProgress.add(lessonId);
    const newXp = (user?.xp || 0) + 50;
    set({
      progress: { ...progress, [skillId]: Array.from(skillProgress) },
      user: { ...user, xp: newXp, level: Math.floor(newXp / 500) + 1 }
    });
    try {
      await fetch('/api/progress/complete-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ skillId, lessonId })
      });
    } catch (e) {}
    return true;
  },

  getSkillProgress: (skillId, totalLessons) => {
    const done = (get().progress[skillId] || []).length;
    return { done, total: totalLessons, percent: totalLessons ? Math.round((done / totalLessons) * 100) : 0 };
  },

  isLessonComplete: (skillId, lessonId) => (get().progress[skillId] || []).includes(lessonId),

}), { name: 'skillsphere-store' }));
