// components/CollectorNavbar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const CollectorNavbar = ({ setIsSidebarOpen }) => {
    const navigate = useNavigate();
    const [collectorProfile] = useLocalStorage('collectorProfile', {});
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [collectionRequests] = useLocalStorage('collectionRequests', []);

    // Get pending requests count
    const pendingRequestsCount = collectionRequests.filter(req => req.status === 'Pending').length;

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
        navigate('/collector/dashboard/profile');
        setIsDropdownOpen(false);
    };

    const handleSettingsClick = () => {
        navigate('/collector/dashboard/settings');
        setIsDropdownOpen(false);
    };

    const handleNotificationClick = () => {
        navigate('/collector/dashboard/requests');
        setIsNotificationOpen(false);
    };

    const handleLogout = () => {
        try {
            localStorage.clear();
            navigate('/');
        } catch (error) {
            console.error('Error during logout:', error);
            navigate('/');
        }
    };

    const getUserInitials = () => {
        try {
            if (collectorProfile?.fullName) {
                const names = collectorProfile.fullName.trim().split(' ');
                if (names.length >= 2) {
                    return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
                }
                return names[0].charAt(0).toUpperCase();
            }
            return 'C';
        } catch (error) {
            console.error('Error getting user initials:', error);
            return 'C';
        }
    };

    return (
        <nav className="bg-white shadow-lg border-b border-gray-100 px-4 lg:px-8 py-4 fixed top-0 left-0 right-0 z-30">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Open sidebar"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                    <div className="ml-2 lg:ml-0 flex items-center space-x-3">
                        <img 
                            src="/logo.png" 
                            alt="EcoSajha" 
                            className="w-8 h-8 object-contain"
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Collector Panel</h1>
                            <p className="text-sm text-gray-500 hidden sm:block">Manage your collections</p>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center space-x-6">
                    {/* Notifications */}
                    <div className="relative dropdown-container">
                        <button 
                            onClick={() => {
                                setIsNotificationOpen(!isNotificationOpen);
                                setIsDropdownOpen(false);
                            }}
                            className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                            </svg>
                            {pendingRequestsCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                                    {pendingRequestsCount > 9 ? '9+' : pendingRequestsCount}
                                </span>
                            )}
                        </button>

                        {/* Notification Dropdown */}
                        {isNotificationOpen && (
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden">
                                <div className="p-4 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                                </div>
                                
                                <div className="max-h-64 overflow-y-auto">
                                    {pendingRequestsCount === 0 ? (
                                        <div className="p-8 text-center">
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                                                </svg>
                                            </div>
                                            <p className="text-gray-500">No new notifications</p>
                                        </div>
                                    ) : (
                                        <div className="p-4">
                                            <button
                                                onClick={handleNotificationClick}
                                                className="w-full bg-blue-50 rounded-lg p-3 border border-blue-200 hover:bg-blue-100 transition-colors"
                                            >
                                                <p className="text-blue-800 font-medium text-left">
                                                    {pendingRequestsCount} new collection request{pendingRequestsCount !== 1 ? 's' : ''}
                                                </p>
                                                <p className="text-blue-600 text-sm text-left">
                                                    Click to view and respond to requests
                                                </p>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User Profile Section */}
                    <div className="flex items-center space-x-3">
                        <div className="hidden sm:block text-right">
                            <div className="text-sm font-medium text-gray-900">
                                {collectorProfile?.fullName || 'Collector'}
                            </div>
                            <div className="text-xs text-gray-500">EcoSajha Collector</div>
                        </div>
                        
                        {/* User Avatar with Dropdown */}
                        <div className="relative dropdown-container">
                            <button 
                                onClick={() => {
                                    setIsDropdownOpen(!isDropdownOpen);
                                    setIsNotificationOpen(false);
                                }}
                                className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {collectorProfile?.profileImage ? (
                                    <img
                                        src={collectorProfile.profileImage}
                                        alt="Profile"
                                        className="w-10 h-10 rounded-full object-cover shadow-lg"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : (
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                                        {getUserInitials()}
                                    </div>
                                )}
                                <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </button>
                            
                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
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

export default CollectorNavbar;
