import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './context/store';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import SkillPage from './pages/SkillPage';
import LessonPage from './pages/LessonPage';
import ExplorePage from './pages/ExplorePage';
import ProfilePage from './pages/ProfilePage';
import RoadmapPage from './pages/RoadmapPage';

function Protected({ children }) {
  const isLoggedIn = useStore(s => s.isLoggedIn);
  return isLoggedIn ? children : <Navigate to="/auth" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
        <Route path="/roadmap" element={<Protected><RoadmapPage /></Protected>} />
        <Route path="/skill/:slug" element={<Protected><SkillPage /></Protected>} />
        <Route path="/skill/:slug/lesson/:lessonId" element={<Protected><LessonPage /></Protected>} />
        <Route path="/profile" element={<Protected><ProfilePage /></Protected>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
