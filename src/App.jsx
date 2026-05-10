import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Explore from './pages/Explore';
import ProfileDetail from './pages/ProfileDetail';
import Messaging from './pages/Messaging';
import Auth from './pages/Auth';
import Favorites from './pages/Favorites';
import VIPOnly from './pages/VIPOnly';
import Pricing from './pages/Pricing';
import { AdminShell } from './admin/layouts/AdminShell';
import { AdminOverview } from './admin/pages/AdminOverview';
import { AdminProfiles } from './admin/pages/AdminProfiles';
import { AdminPricing } from './admin/pages/AdminPricing';
import { AdminContent } from './admin/pages/AdminContent';
import { AdminMedia } from './admin/pages/AdminMedia';
import { AdminUsers } from './admin/pages/AdminUsers';
import { AdminModeration } from './admin/pages/AdminModeration';
import { AdminBookings } from './admin/pages/AdminBookings';
import { AdminMessaging } from './admin/pages/AdminMessaging';
import { AdminVIP } from './admin/pages/AdminVIP';
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
          <Route path="messages" element={<Messaging />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="auth" element={<Auth />} />
          <Route path="vip" element={<VIPOnly />} />
          <Route path="pricing" element={<Pricing />} />
        </Route>

        <Route path="/admin/*" element={<AdminShell />}>
          <Route index element={<AdminOverview />} />
          <Route path="profiles" element={<AdminProfiles />} />
          <Route path="pricing" element={<AdminPricing />} />
          <Route path="content" element={<AdminContent />} />
          <Route path="media" element={<AdminMedia />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="moderation" element={<AdminModeration />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="messaging" element={<AdminMessaging />} />
          <Route path="vip" element={<AdminVIP />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="analytics" element={<AdminAnalytics />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
