import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import MentorLayout from './layouts/MentorLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RootRedirect from './components/auth/RootRedirect';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import AdminLoginPage from './pages/auth/AdminLoginPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

// Student Pages
import HomePage from './pages/student/HomePage';
import SchedulePage from './pages/student/SchedulePage';
import AnalysisPage from './pages/student/AnalysisPage';
import MeetingsPage from './pages/student/MeetingsPage';
import MessagesPage from './pages/student/MessagesPage';
import ProfilePage from './pages/student/ProfilePage';
import NotificationsPage from './pages/student/NotificationsPage';
import ExamsPage from './pages/student/ExamsPage';
import ExamDetailPage from './pages/student/ExamDetailPage';
import BookAnalysisPage from './pages/student/BookAnalysisPage';
import HelpPage from './pages/student/HelpPage';

// Common Pages
import PlaceholderPage from './pages/common/PlaceholderPage';

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
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={[1]}>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Student Routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={[3]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/student/ana-sayfa" replace />} />
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
      <Route
        path="/mentor"
        element={
          <ProtectedRoute allowedRoles={[2]}>
            <MentorLayout />
          </ProtectedRoute>
        }
      >
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
