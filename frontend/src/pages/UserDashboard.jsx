import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from "../components/UserDashboard/Sidebar";
import DashboardNav from "../components/UserDashboard/DashboardNav";

const UserDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Extract active tab from current URL
  const getActiveTabFromPath = (pathname) => {
    const segments = pathname.split('/');
    if (pathname === '/user/dashboard') return 'dashboard';
    return segments[segments.length - 1]; // Get last segment
  };

  const activeTab = getActiveTabFromPath(location.pathname);

  // Function to handle tab changes and navigation
  const setActiveTab = (tabId) => {
    if (tabId === 'dashboard') {
      navigate('/user/dashboard');
    } else {
      navigate(`/user/dashboard/${tabId}`);
    }
  };

  // Close sidebar when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle navigation from items component to other sections
  useEffect(() => {
    const handleNavigateToWishlist = () => {
      navigate('/user/dashboard/wishlist');
    };

    const handleNavigateToItems = () => {
      navigate('/user/dashboard/items');
    };

    const handleNavigateToRecyclingQueue = () => {
      navigate('/user/dashboard/recycling-queue');
    };

    window.addEventListener('navigate-to-wishlist', handleNavigateToWishlist);
    window.addEventListener('navigate-to-items', handleNavigateToItems);
    window.addEventListener('navigate-to-recycling-queue', handleNavigateToRecyclingQueue);
    
    return () => {
      window.removeEventListener('navigate-to-wishlist', handleNavigateToWishlist);
      window.removeEventListener('navigate-to-items', handleNavigateToItems);
      window.removeEventListener('navigate-to-recycling-queue', handleNavigateToRecyclingQueue);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar - Fixed on desktop, overlay on mobile */}
        <div className="lg:flex lg:flex-shrink-0">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Navigation header */}
          <div className="flex-shrink-0">
            <DashboardNav setIsSidebarOpen={setIsSidebarOpen} />
          </div>

          {/* Scrollable main content */}
          <main className="flex-1 overflow-y-auto bg-gray-50">
            <div className="container mx-auto px-4 py-6 lg:px-8 lg:py-8">
              <div className="max-w-7xl mx-auto">
                {/* This renders the matched child route */}
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
