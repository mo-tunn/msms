import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import MentorLayout from './layouts/MentorLayout';
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import HomePage from './pages/HomePage';
import SchedulePage from './pages/SchedulePage';
import AnalysisPage from './pages/AnalysisPage';
import MeetingsPage from './pages/MeetingsPage';
import MessagesPage from './pages/MessagesPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import ExamsPage from './pages/ExamsPage';
import ExamDetailPage from './pages/ExamDetailPage';
import BookAnalysisPage from './pages/BookAnalysisPage';
import HelpPage from './pages/HelpPage';
import PlaceholderPage from './pages/PlaceholderPage';

// Mentor Pages
import MentorHomePage from './pages/mentor/MentorHomePage';
import MentorSchedulePage from './pages/mentor/MentorSchedulePage';
import MentorExamsPage from './pages/mentor/MentorExamsPage';
import MentorMeetingsPage from './pages/mentor/MentorMeetingsPage';
import MentorNotificationsPage from './pages/mentor/MentorNotificationsPage';
import MentorProfilePage from './pages/mentor/MentorProfilePage';
import MentorAnalyticsPage from './pages/mentor/analytics/MentorAnalyticsPage';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/dashboard" element={<AdminDashboardPage />} />

      {/* Student Routes */}
      <Route path="/app" element={<DashboardLayout />}>
        <Route index element={<Navigate to="/app/ana-sayfa" replace />} />
        <Route path="ana-sayfa" element={<HomePage />} />
        <Route path="ders-programi" element={<SchedulePage />} />
        <Route path="analizler" element={<AnalysisPage />} />
        <Route path="toplantilar" element={<MeetingsPage />} />
        <Route path="mesajlar" element={<MessagesPage />} />
        <Route path="profilim" element={<ProfilePage />} />
        <Route path="bildirimler" element={<NotificationsPage />} />
        <Route path="sinavlarim" element={<ExamsPage />} />
        <Route path="sinavlarim/:id" element={<ExamDetailPage />} />
        <Route path="yapay-zeka/kitap-analizi" element={<BookAnalysisPage />} />
        <Route path="nasil-kullanirim" element={<HelpPage />} />
        <Route path="*" element={<PlaceholderPage />} />
      </Route>

      {/* Mentor Routes */}
      <Route path="/mentor" element={<MentorLayout />}>
        <Route index element={<Navigate to="/mentor/ana-sayfa" replace />} />
        <Route path="ana-sayfa" element={<MentorHomePage />} />
        <Route path="ders-programi" element={<MentorSchedulePage />} />
        <Route path="sinavlar" element={<MentorExamsPage />} />
        <Route path="toplantilar" element={<MentorMeetingsPage />} />
        <Route path="bildirimler" element={<MentorNotificationsPage />} />
        <Route path="profil" element={<MentorProfilePage />} />
        <Route path="analizler/genel" element={<MentorAnalyticsPage />} />

      </Route>
    </Routes>
  );
}

export default App;
