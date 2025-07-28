// components/admin/SystemAnalytics.jsx
import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const SystemAnalytics = () => {
    const [collectionRequests] = useLocalStorage('collectionRequests', []);
    const [collectorRatings] = useLocalStorage('collectorRatings', []);
    const [userProfiles] = useLocalStorage('userProfiles', []);
    const [collectorProfiles] = useLocalStorage('collectorProfiles', []);
    const [selectedPeriod, setSelectedPeriod] = useState('This Month');

    // Calculate analytics data
    const totalUsers = userProfiles.length;
    const totalCollectors = collectorProfiles.length;
    const totalRequests = collectionRequests.length;
    const completedRequests = collectionRequests.filter(req => req.status === 'Completed');
    const pendingRequests = collectionRequests.filter(req => req.status === 'Pending');
    const totalRevenue = completedRequests.reduce((sum, req) => sum + parseFloat(req.totalEstimatedValue || 0), 0);
    
    // Calculate monthly data
    const monthlyData = {};
    collectionRequests.forEach(request => {
        const date = new Date(request.requestDate);
        const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = {
                requests: 0,
                completed: 0,
                revenue: 0,
                month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
            };
        }
        monthlyData[monthKey].requests++;
        if (request.status === 'Completed') {
            monthlyData[monthKey].completed++;
            monthlyData[monthKey].revenue += parseFloat(request.totalEstimatedValue || 0);
        }
    });

    const monthlyStats = Object.values(monthlyData).slice(-6); // Last 6 months

    // Category-wise analytics
    const categoryStats = {};
    collectionRequests.forEach(request => {
        request.items?.forEach(item => {
            const category = item.category || 'Others';
            if (!categoryStats[category]) {
                categoryStats[category] = {
                    count: 0,
                    revenue: 0,
                    items: 0
                };
            }
            categoryStats[category].count++;
            categoryStats[category].revenue += parseFloat(item.estimatedValue || 0);
            categoryStats[category].items += parseInt(item.quantity || 1);
        });
    });

    // Top performing collectors
    const collectorStats = collectorProfiles.map(collector => {
        const collectorRequests = collectionRequests.filter(req => 
            req.collectorInfo?.id === collector.id || req.collectorInfo?.name === collector.fullName
        );
        const completedCount = collectorRequests.filter(req => req.status === 'Completed').length;
        const earnings = collectorRequests
            .filter(req => req.status === 'Completed')
            .reduce((sum, req) => sum + parseFloat(req.totalEstimatedValue || 0), 0);
        const reviews = collectorRatings.filter(rating => rating.collectorId === collector.id);
        const avgRating = reviews.length > 0 
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
            : 0;

        return {
            ...collector,
            totalRequests: collectorRequests.length,
            completedRequests: completedCount,
            totalEarnings: earnings,
            averageRating: parseFloat(avgRating),
            reviewCount: reviews.length
        };
    }).sort((a, b) => b.totalEarnings - a.totalEarnings).slice(0, 5);

    const formatCurrency = (amount) => `Rs. ${amount.toFixed(2)}`;

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl p-6 text-white">
                <h1 className="text-2xl font-bold">System Analytics</h1>
                <p className="text-indigo-100">Comprehensive insights into your recycling platform</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Revenue</p>
                            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
                            <p className="text-xs text-gray-500 mt-1">From {completedRequests.length} completed requests</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Completion Rate</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {totalRequests > 0 ? Math.round((completedRequests.length / totalRequests) * 100) : 0}%
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{completedRequests.length}/{totalRequests} requests</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Active Users</p>
                            <p className="text-2xl font-bold text-purple-600">{totalUsers}</p>
                            <p className="text-xs text-gray-500 mt-1">Registered users</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Active Collectors</p>
                            <p className="text-2xl font-bold text-orange-600">{totalCollectors}</p>
                            <p className="text-xs text-gray-500 mt-1">Verified collectors</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts and Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Trends */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
                    <div className="space-y-4">
                        {monthlyStats.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <p>No data available for monthly trends</p>
                            </div>
                        ) : (
                            monthlyStats.map((month, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{month.month}</p>
                                        <p className="text-sm text-gray-600">
                                            {month.requests} requests • {month.completed} completed
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-green-600">{formatCurrency(month.revenue)}</p>
                                        <p className="text-sm text-gray-500">
                                            {month.requests > 0 ? Math.round((month.completed / month.requests) * 100) : 0}% completion
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Category Performance */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Performance</h3>
                    <div className="space-y-3">
                        {Object.entries(categoryStats)
                            .sort(([,a], [,b]) => b.revenue - a.revenue)
                            .slice(0, 5)
                            .map(([category, stats]) => {
                                const maxRevenue = Math.max(...Object.values(categoryStats).map(s => s.revenue));
                                const percentage = maxRevenue > 0 ? (stats.revenue / maxRevenue) * 100 : 0;
                                
                                return (
                                    <div key={category} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-900">{category}</span>
                                            <span className="text-sm text-gray-600">{formatCurrency(stats.revenue)}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-indigo-500 h-2 rounded-full transition-all duration-300" 
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            {stats.count} requests • {stats.items} items
                                        </p>
                                    </div>
                                );
                            })}
                        {Object.keys(categoryStats).length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <p>No category data available</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Top Performers and System Health */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Performing Collectors */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Collectors</h3>
                    <div className="space-y-3">
                        {collectorStats.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <p>No collector data available</p>
                            </div>
                        ) : (
                            collectorStats.map((collector, index) => (
                                <div key={collector.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-medium text-green-600">#{index + 1}</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{collector.fullName}</p>
                                        <p className="text-sm text-gray-600">
                                            {collector.completedRequests} collections • ⭐ {collector.averageRating}/5
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-green-600">{formatCurrency(collector.totalEarnings)}</p>
                                        <p className="text-xs text-gray-500">{collector.reviewCount} reviews</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* System Health */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <div>
                                <p className="font-medium text-gray-900">Completed Requests</p>
                                <p className="text-sm text-gray-600">{completedRequests.length} out of {totalRequests}</p>
                            </div>
                            <div className="text-2xl font-bold text-green-600">
                                {totalRequests > 0 ? Math.round((completedRequests.length / totalRequests) * 100) : 0}%
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                            <div>
                                <p className="font-medium text-gray-900">Pending Requests</p>
                                <p className="text-sm text-gray-600">Awaiting collector response</p>
                            </div>
                            <div className="text-2xl font-bold text-yellow-600">
                                {pendingRequests.length}
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <div>
                                <p className="font-medium text-gray-900">Average Rating</p>
                                <p className="text-sm text-gray-600">System-wide collector rating</p>
                            </div>
                            <div className="text-2xl font-bold text-blue-600">
                                {collectorRatings.length > 0 
                                    ? (collectorRatings.reduce((sum, r) => sum + r.rating, 0) / collectorRatings.length).toFixed(1)
                                    : '0.0'
                                }⭐
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                            <div>
                                <p className="font-medium text-gray-900">Total Reviews</p>
                                <p className="text-sm text-gray-600">Customer feedback received</p>
                            </div>
                            <div className="text-2xl font-bold text-purple-600">
                                {collectorRatings.length}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemAnalytics;
