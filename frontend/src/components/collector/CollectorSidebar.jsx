// components/CollectorSidebar.jsx
import React from "react";
import { useNavigate, useLocation } from 'react-router-dom';

const CollectorSidebar = ({
  activeTab,
  setActiveTab,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      path: "/collector/dashboard",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5v4M16 5v4" />
        </svg>
      ),
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      id: "requests",
      label: "Collection Requests",
      path: "/collector/dashboard/requests",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      id: "earnings",
      label: "Earnings",
      path: "/collector/dashboard/earnings",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      id: "reviews",
      label: "My Reviews",
      path: "/collector/dashboard/reviews",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
    },
    {
      id: "profile",
      label: "Profile",
      path: "/collector/dashboard/profile",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      id: "notifications",
      label: "Notifications",
      path: "/collector/dashboard/notifications",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
    {
      id: "settings",
      label: "Settings",
      path: "/collector/dashboard/settings",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      bgColor: "bg-gray-50",
      iconColor: "text-gray-600",
    },
  ];

  // Check if current path matches item path
  const isItemActive = (item) => {
    if (item.id === 'dashboard') {
      return location.pathname === '/collector/dashboard';
    }
    return location.pathname === item.path;
  };

  // Handle navigation
  const handleNavigation = (item) => {
    navigate(item.path);
    setActiveTab(item.id);
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile overlay with blur effect */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0  bg-opacity-60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:sticky 
          left-0 top-0 
          h-screen w-72 
          bg-gradient-to-b from-white to-gray-50 
          shadow-2xl border-r border-gray-100 
          transform transition-all duration-300 ease-out 
          z-50 
          flex flex-col
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header with gradient background */}
        <div className="relative p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white flex-shrink-0">
          <div className="absolute inset-0 bg-cyan-950 bg-opacity-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img 
                  src="/logo.png" 
                  alt="EcoSajha" 
                  className="w-10 h-10 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div>
                  <h2 className="text-lg font-bold">EcoSajha Collector</h2>
                  <p className="text-blue-100 text-xs">Dashboard</p>
                </div>
              </div>
              <button
                className="lg:hidden text-white hover:text-blue-100 transition-colors duration-200 p-1"
                onClick={() => setIsSidebarOpen(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="white" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 scrollbar-thin scrollbar-thumb-gray-300">
          {menuItems.map((item, index) => {
            const isActive = isItemActive(item);
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className={`group w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 transform hover:scale-105 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25"
                    : "text-gray-700 hover:bg-gray-50 hover:shadow-md"
                }`}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-lg mr-4 transition-all duration-200 ${item.bgColor} group-hover:scale-110`}
                >
                  <div className={item.iconColor}>{item.icon}</div>
                </div>
                <div className="flex-1">
                  <span
                    className={`font-medium transition-all duration-200 ${
                      isActive
                        ? "text-white"
                        : "text-gray-800 group-hover:text-gray-900"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
                {isActive && (
                  <div className="w-2 h-2 bg-white rounded-full opacity-80"></div>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default CollectorSidebar;
