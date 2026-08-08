import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Explore from './pages/Explore';
import ProfileDetail from './pages/ProfileDetail';
import Auth from './pages/Auth';
import Favorites from './pages/Favorites';
import { AdminAuthLayout } from './admin/layouts/AdminAuthLayout.jsx';
import { AdminShell } from './admin/layouts/AdminShell';
import { AdminLogin } from './admin/pages/AdminLogin.jsx';
import { AdminOverview } from './admin/pages/AdminOverview';
import { AdminProfiles } from './admin/pages/AdminProfiles';
import { AdminContent } from './admin/pages/AdminContent';
import { AdminMedia } from './admin/pages/AdminMedia';
import { AdminUsers } from './admin/pages/AdminUsers';
import { AdminReports } from './admin/pages/AdminReports';
import { AdminAnalytics } from './admin/pages/AdminAnalytics';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="explore" element={<Explore />} />
          <Route path="profile/:id" element={<ProfileDetail />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="auth" element={<Auth />} />
          <Route path="messages" element={<Navigate to="/explore" replace />} />
          <Route path="vip" element={<Navigate to="/explore" replace />} />
        </Route>

        <Route path="/admin" element={<AdminAuthLayout />}>
          <Route path="login" element={<AdminLogin />} />
          <Route element={<AdminShell />}>
            <Route index element={<AdminOverview />} />
            <Route path="profiles" element={<AdminProfiles />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="media" element={<AdminMedia />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="bookings" element={<Navigate to="/admin/profiles" replace />} />
            <Route path="vip" element={<Navigate to="/admin/profiles" replace />} />
            <Route path="messaging" element={<Navigate to="/admin/profiles" replace />} />
            <Route path="moderation" element={<Navigate to="/admin/reports" replace />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
