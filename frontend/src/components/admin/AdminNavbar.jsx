// components/admin/AdminNavbar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const AdminNavbar = ({ setIsSidebarOpen }) => {
    const navigate = useNavigate();
    const [adminProfile] = useLocalStorage('adminProfile', {});
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [collectionRequests] = useLocalStorage('collectionRequests', []);

    // Calculate system statistics (keeping only for notification badge)
    const pendingRequests = collectionRequests.filter(req => req.status === 'Pending').length;

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown-container')) {
                setIsDropdownOpen(false);
                setIsNotificationOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleProfileClick = () => {
        navigate('/admin/dashboard/profile');
        setIsDropdownOpen(false);
    };

    const handleSettingsClick = () => {
        navigate('/admin/dashboard/settings');
        setIsDropdownOpen(false);
    };

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            localStorage.clear();
            navigate('/');
        }
    };

    const getUserInitials = () => {
        if (adminProfile?.fullName) {
            const names = adminProfile.fullName.trim().split(' ');
            if (names.length >= 2) {
                return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
            }
            return names[0].charAt(0).toUpperCase();
        }
        return 'A';
    };

    return (
        <nav className="bg-white shadow-lg border-b border-gray-200 px-3 sm:px-4 lg:px-8 py-3 sm:py-4 fixed top-0 left-0 right-0 z-30 h-14 sm:h-16">
            <div className="flex items-center justify-between h-full">
                {/* Left Section - Logo and Brand */}
                <div className="flex items-center min-w-0 flex-1">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="lg:hidden p-1.5 sm:p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 mr-2 sm:mr-3"
                        aria-label="Open sidebar"
                    >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>

                    {/* Logo and Brand */}
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                        <img 
                            src="/logo.png" 
                            alt="EcoSajha" 
                            className="w-6 h-6 sm:w-8 sm:h-8 object-contain flex-shrink-0"
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                        <div className="min-w-0">
                            <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">Admin Panel</h1>
                            <p className="text-xs sm:text-sm text-gray-500 hidden sm:block truncate">System Management</p>
                        </div>
                    </div>
                </div>
                
                {/* Right Section - Actions */}
                <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
                    {/* Notifications */}
                    <div className="relative dropdown-container">
                        <button 
                            onClick={() => {
                                setIsNotificationOpen(!isNotificationOpen);
                                setIsDropdownOpen(false);
                            }}
                            className="relative p-1.5 sm:p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                            aria-label="Notifications"
                        >
                            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                            </svg>
                            {pendingRequests > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                                    {pendingRequests > 9 ? '9+' : pendingRequests}
                                </span>
                            )}
                        </button>

                        {/* Notification Dropdown - Responsive */}
                        {isNotificationOpen && (
                            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-80 sm:max-h-96 overflow-hidden">
                                <div className="p-3 sm:p-4 border-b border-gray-200">
                                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">System Alerts</h3>
                                </div>
                                
                                <div className="max-h-56 sm:max-h-64 overflow-y-auto">
                                    {pendingRequests === 0 ? (
                                        <div className="p-6 sm:p-8 text-center">
                                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                                                </svg>
                                            </div>
                                            <p className="text-sm sm:text-base text-gray-500">No pending alerts</p>
                                        </div>
                                    ) : (
                                        <div className="p-3 sm:p-4">
                                            <button
                                                onClick={() => {
                                                    navigate('/admin/dashboard/requests');
                                                    setIsNotificationOpen(false);
                                                }}
                                                className="w-full bg-yellow-50 rounded-lg p-3 border border-yellow-200 hover:bg-yellow-100 transition-colors text-left"
                                            >
                                                <p className="text-yellow-800 font-medium text-sm sm:text-base">
                                                    {pendingRequests} pending collection request{pendingRequests !== 1 ? 's' : ''}
                                                </p>
                                                <p className="text-yellow-600 text-xs sm:text-sm mt-1">
                                                    Click to review and manage requests
                                                </p>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User Profile Section */}
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        {/* User Info - Hidden on very small screens */}
                        <div className="hidden md:block text-right">
                            <div className="text-sm font-medium text-gray-900 truncate max-w-32 lg:max-w-none">
                                {adminProfile?.fullName || 'Administrator'}
                            </div>
                            <div className="text-xs text-gray-500">System Admin</div>
                        </div>
                        
                        {/* User Avatar with Dropdown */}
                        <div className="relative dropdown-container">
                            <button 
                                onClick={() => {
                                    setIsDropdownOpen(!isDropdownOpen);
                                    setIsNotificationOpen(false);
                                }}
                                className="flex items-center space-x-1 sm:space-x-2 p-1 rounded-lg hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                                aria-label="User menu"
                            >
                                {adminProfile?.profileImage ? (
                                    <img
                                        src={adminProfile.profileImage}
                                        alt="Profile"
                                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover shadow-lg"
                                    />
                                ) : (
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-lg">
                                        {getUserInitials()}
                                    </div>
                                )}
                                <svg className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </button>
                            
                            {/* Dropdown Menu - Responsive */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-44 sm:w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                    {/* Mobile-only user info */}
                                    <div className="block md:hidden px-4 py-2 border-b border-gray-200 mb-2">
                                        <div className="text-sm font-medium text-gray-900 truncate">
                                            {adminProfile?.fullName || 'Administrator'}
                                        </div>
                                        <div className="text-xs text-gray-500">System Admin</div>
                                    </div>

                                    <button
                                        onClick={handleProfileClick}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                            </svg>
                                            <span>Profile</span>
                                        </div>
                                    </button>
                                    <button
                                        onClick={handleSettingsClick}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                            </svg>
                                            <span>Settings</span>
                                        </div>
                                    </button>
                                    <hr className="my-2 border-gray-200" />
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                                            </svg>
                                            <span>Logout</span>
                                        </div>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;
