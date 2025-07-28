import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import About from '../src/pages/Aboutpage';  // Make sure this path is correct
import Contact from '../src/pages/Contactpage';  // Make sure this path is correct
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import DashboardOverview from './components/UserDashboard/DashboardOverview';
import Items from './components/UserDashboard/Items';
import RecyclingQueue from './components/UserDashboard/RecyclingQueue';
import PostItem from './components/UserDashboard/PostItem';
import UserProfile from './components/UserDashboard/UserProfile';
import History from './components/UserDashboard/History';
import Settings from './components/UserDashboard/Settings';
import Wishlist from './components/UserDashboard/Wishlist';
import MyReviews from './components/UserDashboard/MyReviews';

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
          
          {/* Redirect old dashboard routes to new structure */}
          <Route path="/dashboard" element={<Navigate to="/user/dashboard" replace />} />
          <Route path="/dashboard/*" element={<Navigate to="/user/dashboard" replace />} />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
