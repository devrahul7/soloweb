// components/admin/AdminDashboardHome.jsx
import React from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useNavigate } from 'react-router-dom';

const AdminDashboardHome = () => {
    const navigate = useNavigate();
    const [collectionRequests] = useLocalStorage('collectionRequests', []);
    const [collectorRatings] = useLocalStorage('collectorRatings', []);
    const [userProfiles] = useLocalStorage('userProfiles', []);
    const [collectorProfiles] = useLocalStorage('collectorProfiles', []);

    // Calculate statistics
    const totalUsers = userProfiles.length;
    const totalCollectors = collectorProfiles.length;
    const totalRequests = collectionRequests.length;
    const pendingRequests = collectionRequests.filter(req => req.status === 'Pending').length;
    const completedRequests = collectionRequests.filter(req => req.status === 'Completed').length;
    const totalRevenue = collectionRequests
        .filter(req => req.status === 'Completed')
        .reduce((sum, req) => sum + parseFloat(req.totalEstimatedValue || 0), 0);
    
    const averageRating = collectorRatings.length > 0 
        ? (collectorRatings.reduce((sum, rating) => sum + rating.rating, 0) / collectorRatings.length).toFixed(1)
        : 0;

    // Recent activities (last 5)
    const recentRequests = [...collectionRequests]
        .sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate))
        .slice(0, 5);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'Accepted':
                return 'bg-blue-100 text-blue-800';
            case 'In Progress':
                return 'bg-purple-100 text-purple-800';
            case 'Completed':
                return 'bg-green-100 text-green-800';
            case 'Rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
                <h1 className="text-2xl font-bold mb-2">
                    Welcome to EcoSajha Admin Panel
                </h1>
                <p className="text-red-100">
                    Manage your recycling platform from this central dashboard
                </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Users */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Users</p>
                            <p className="text-2xl font-bold text-blue-600">{totalUsers}</p>
                            <p className="text-xs text-gray-500 mt-1">Registered users</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Total Collectors */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Collectors</p>
                            <p className="text-2xl font-bold text-green-600">{totalCollectors}</p>
                            <p className="text-xs text-gray-500 mt-1">Active collectors</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Pending Requests */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Pending Requests</p>
                            <p className="text-2xl font-bold text-yellow-600">{pendingRequests}</p>
                            <p className="text-xs text-gray-500 mt-1">Awaiting approval</p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                    </div>
                    {pendingRequests > 0 && (
                        <button
                            onClick={() => navigate('/admin/dashboard/requests')}
                            className="mt-2 text-xs text-yellow-600 hover:text-yellow-700 font-medium"
                        >
                            View pending requests →
                        </button>
                    )}
                </div>

                {/* Total Revenue */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Revenue</p>
                            <p className="text-2xl font-bold text-emerald-600">Rs. {totalRevenue.toFixed(2)}</p>
                            <p className="text-xs text-gray-500 mt-1">From completed requests</p>
                        </div>
                        <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Dashboard Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                        <button
                            onClick={() => navigate('/admin/dashboard/requests')}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                            View all →
                        </button>
                    </div>
                    
                    <div className="space-y-3">
                        {recentRequests.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                                    </svg>
                                </div>
                                <p className="text-gray-500">No recent activity</p>
                            </div>
                        ) : (
                            recentRequests.map((request) => (
                                <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(request.status)}`}>
                                                {request.status}
                                            </span>
                                            <span className="text-sm text-gray-500">#{request.id}</span>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {request.userInfo?.name || 'Unknown User'}
                                        </p>
                                        <p className="text-xs text-gray-600">
                                            {request.items?.length || 0} items • Rs. {request.totalEstimatedValue}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">{formatDate(request.requestDate)}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Quick Stats & Actions */}
                <div className="space-y-6">
                    {/* System Health */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Completion Rate</span>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium">
                                        {totalRequests > 0 ? Math.round((completedRequests / totalRequests) * 100) : 0}%
                                    </span>
                                    <div className="w-16 bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-green-500 h-2 rounded-full" 
                                            style={{ width: `${totalRequests > 0 ? (completedRequests / totalRequests) * 100 : 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Average Rating</span>
                                <div className="flex items-center space-x-1">
                                    <span className="text-sm font-medium">{averageRating}</span>
                                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                    </svg>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Total Reviews</span>
                                <span className="text-sm font-medium">{collectorRatings.length}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/admin/dashboard/users')}
                                className="w-full flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                                        </svg>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">Manage Users</span>
                                </div>
                            </button>

                            <button
                                onClick={() => navigate('/admin/dashboard/collectors')}
                                className="w-full flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                        </svg>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">Manage Collectors</span>
                                </div>
                            </button>

                            <button
                                onClick={() => navigate('/admin/dashboard/analytics')}
                                className="w-full flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                        </svg>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">View Analytics</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardHome;
