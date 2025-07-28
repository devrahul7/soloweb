// App.jsx - Updated with Admin Panel Routes
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import About from "../src/pages/Aboutpage";
import Contact from "../src/pages/Contactpage";
import Login from "./pages/Login";
import Register from "./pages/Register";

// User Dashboard Components
import UserDashboard from "./pages/UserDashboard";
import DashboardOverview from "./components/UserDashboard/DashboardOverview";
import Items from "./components/UserDashboard/Items";
import RecyclingQueue from "./components/UserDashboard/RecyclingQueue";
import PostItem from "./components/UserDashboard/PostItem";
import UserProfile from "./components/UserDashboard/UserProfile";
import History from "./components/UserDashboard/History";
import Settings from "./components/UserDashboard/Settings";
import Wishlist from "./components/UserDashboard/Wishlist";
import MyReviews from "./components/UserDashboard/MyReviews";

// Collector Dashboard Components
import CollectorDashboard from "./pages/CollectorDashboard";
import CollectorDashboardHome from "./components/collector/CollectorDashboardHome";
import CollectionRequests from "./components/collector/CollectionRequests";
import CollectorProfile from "./components/collector/CollectorProfile";
import CollectorReviews from "./components/collector/CollectorReviews";
import CollectorNotifications from "./components/collector/CollectorNotifications";
import CollectorEarnings from "./components/collector/CollectorEarnings";
import CollectorSettings from "./components/collector/CollectorSettings";

// Admin Dashboard Components
import AdminDashboard from "./pages/AdminDashboard";
import AdminDashboardHome from "./components/admin/AdminDashboardHome";
import UserManagement from "./components/admin/UserManagement";
import CollectorManagement from "./components/admin/CollectorManagement";
import RequestHistory from "./components/admin/RequestHistory";
import SystemAnalytics from "./components/admin/SystemAnalytics";
import ReviewManagement from "./components/admin/ReviewManagement";
import AdminProfile from "./components/admin/AdminProfile";
import AdminNotifications from "./components/admin/AdminNotifications";
import AdminSettings from "./components/admin/AdminSettings";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User Dashboard Routes */}
          <Route path="/user/dashboard" element={<UserDashboard />}>
            <Route index element={<DashboardOverview />} />
            <Route path="items" element={<Items />} />
            <Route path="recycling-queue" element={<RecyclingQueue />} />
            <Route path="post" element={<PostItem />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="history" element={<History />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="settings" element={<Settings />} />
            <Route path="reviews" element={<MyReviews />} />
          </Route>

          {/* Collector Dashboard Routes */}
          <Route path="/collector/dashboard" element={<CollectorDashboard />}>
            <Route index element={<CollectorDashboardHome />} />
            <Route path="requests" element={<CollectionRequests />} />
            <Route path="earnings" element={<CollectorEarnings />} />
            <Route path="reviews" element={<CollectorReviews />} />
            <Route path="profile" element={<CollectorProfile />} />
            <Route path="notifications" element={<CollectorNotifications />} />
            <Route path="settings" element={<CollectorSettings />} />
          </Route>

          {/* Admin Dashboard Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />}>
            <Route index element={<AdminDashboardHome />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="collectors" element={<CollectorManagement />} />
            <Route path="requests" element={<RequestHistory />} />
            <Route path="analytics" element={<SystemAnalytics />} />
            <Route path="reviews" element={<ReviewManagement />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Redirect old dashboard routes to new structure */}
          <Route
            path="/dashboard"
            element={<Navigate to="/user/dashboard" replace />}
          />
          <Route
            path="/dashboard/*"
            element={<Navigate to="/user/dashboard" replace />}
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
