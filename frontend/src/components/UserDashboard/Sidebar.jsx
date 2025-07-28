import React from "react";
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({
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
      path: "/user/dashboard",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 5v4M16 5v4"
          />
        </svg>
      ),
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      id: "items",
      label: "Browse Items",
      path: "/user/dashboard/items",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
    {
      id: "recycling-queue",
      label: "Recycling Queue",
      path: "/user/dashboard/recycling-queue",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16l-1 14H5L4 6zM4 6L2 4m18 2l2-2M9 10v4m6-4v4"
          />
        </svg>
      ),
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      id: "post",
      label: "Post Item",
      path: "/user/dashboard/post",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
      ),
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      id: "profile",
      label: "Profile",
      path: "/user/dashboard/profile",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      id: "history",
      label: "History",
      path: "/user/dashboard/history",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      id: "wishlist",
      label: "Wishlist",
      path: "/user/dashboard/wishlist",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
      bgColor: "bg-pink-50",
      iconColor: "text-pink-600",
    },
    {
      id: "settings",
      label: "Settings",
      path: "/user/dashboard/settings",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      bgColor: "bg-gray-50",
      iconColor: "text-gray-600",
    },
  ];

  // Check if current path matches item path
  const isItemActive = (item) => {
    if (item.id === 'dashboard') {
      return location.pathname === '/user/dashboard';
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
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen w-72 bg-gradient-to-b from-white to-gray-50 shadow-2xl border-r border-gray-100 transform transition-all duration-300 ease-out z-50 lg:relative lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header with gradient background */}
        <div className="relative p-6 bg-gradient-to-r from-green-600 to-green-700 text-white">
          <div className="absolute inset-0 bg-cyan-950 bg-opacity-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* EcoSajha Logo - Same as navbar */}
                <img 
                  src="/logo.png" 
                  alt="EcoSajha" 
                  className="w-10 h-10 object-contain"
                />
                <div>
                  <h2 className="text-lg font-bold">EcoSajha Recycle</h2>
                  <p className="text-green-100 text-xs">Dashboard</p>
                </div>
              </div>
              <button
                className="lg:hidden text-white hover:text-green-100 transition-colors duration-200 p-1"
                onClick={() => setIsSidebarOpen(false)}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="white"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="pt-6 pb-6 px-4 space-y-2">
          {menuItems.map((item, index) => {
            const isActive = isItemActive(item);
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className={`group w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 transform hover:scale-105 ${
                  isActive
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25"
                    : "text-gray-700 hover:bg-gray-50 hover:shadow-md"
                }`}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                {/* Icon container - always keeps original colors */}
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

export default Sidebar;
