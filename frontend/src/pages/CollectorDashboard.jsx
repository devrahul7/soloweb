// CollectorDashboard.jsx - FIXED VERSION
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CollectorSidebar from '../components/collector/CollectorSidebar';
import CollectorNavbar from '../components/collector/CollectorNavbar';
import CollectorDashboardHome from '../components/collector/CollectorDashboardHome';
import CollectionRequests from '../components/collector/CollectionRequests';
import CollectorProfile from '../components/collector/CollectorProfile';
import CollectorReviews from '../components/collector/CollectorReviews';
import CollectorNotifications from '../components/collector/CollectorNotifications';
import CollectorEarnings from '../components/collector/CollectorEarnings';
import CollectorSettings from '../components/collector/CollectorSettings';

const CollectorDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <CollectorSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Navbar - Fixed at top */}
                <CollectorNavbar 
                    setIsSidebarOpen={setIsSidebarOpen}
                    isSidebarOpen={isSidebarOpen}
                />
                
                {/* Main Content - KEY FIX: Add proper top padding */}
                <main className="flex-1 pt-20 lg:pt-20 p-6 overflow-auto">
                    <Routes>
                        <Route index element={<CollectorDashboardHome />} />
                        <Route path="requests" element={<CollectionRequests />} />
                        <Route path="profile" element={<CollectorProfile />} />
                        <Route path="reviews" element={<CollectorReviews />} />
                        <Route path="notifications" element={<CollectorNotifications />} />
                        <Route path="earnings" element={<CollectorEarnings />} />
                        <Route path="settings" element={<CollectorSettings />} />
                        <Route path="*" element={<Navigate to="/collector/dashboard" replace />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default CollectorDashboard;
