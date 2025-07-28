// components/admin/AdminDashboard.jsx
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminNavbar from '../components/admin/AdminNavbar';
import AdminDashboardHome from '../components/admin/AdminDashboardHome';
import UserManagement from '../components/admin/UserManagement';
import CollectorManagement from '../components/admin/CollectorManagement';
import RequestHistory from '../components/admin/RequestHistory';
import SystemAnalytics from '../components/admin/SystemAnalytics';
import ReviewManagement from '../components/admin/ReviewManagement';
import AdminProfile from '../components/admin/AdminProfile';
import AdminSettings from '../components/admin/AdminSettings';
import AdminNotifications from '../components/admin/AdminNotifications';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <AdminSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Navbar */}
                <AdminNavbar 
                    setIsSidebarOpen={setIsSidebarOpen}
                    isSidebarOpen={isSidebarOpen}
                />
                
                {/* Main Content */}
                <main className="flex-1 pt-20 p-6 overflow-auto">
                    <Routes>
                        <Route index element={<AdminDashboardHome />} />
                        <Route path="users" element={<UserManagement />} />
                        <Route path="collectors" element={<CollectorManagement />} />
                        <Route path="requests" element={<RequestHistory />} />
                        <Route path="analytics" element={<SystemAnalytics />} />
                        <Route path="reviews" element={<ReviewManagement />} />
                        <Route path="profile" element={<AdminProfile />} />
                        <Route path="notifications" element={<AdminNotifications />} />
                        <Route path="settings" element={<AdminSettings />} />
                        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
