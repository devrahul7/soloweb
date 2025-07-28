// components/admin/AdminNotifications.jsx
import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const AdminNotifications = () => {
    const [collectionRequests] = useLocalStorage('collectionRequests', []);
    const [userProfiles] = useLocalStorage('userProfiles', []);
    const [collectorProfiles] = useLocalStorage('collectorProfiles', []);
    const [collectorRatings] = useLocalStorage('collectorRatings', []);
    const [filterType, setFilterType] = useState('All');

    // Generate system notifications
    const generateNotifications = () => {
        const notifications = [];
        const now = new Date();

        // Pending requests notifications
        const pendingRequests = collectionRequests.filter(req => req.status === 'Pending');
        pendingRequests.forEach(request => {
            notifications.push({
                id: `pending-${request.id}`,
                type: 'pending_request',
                title: 'Pending Collection Request',
                message: `Request #${request.id} from ${request.userInfo?.name || 'User'} is awaiting collector assignment`,
                timestamp: request.requestDate,
                isRead: false,
                priority: 'high',
                actionUrl: '/admin/dashboard/requests'
            });
        });

        // Low ratings notifications
        const lowRatings = collectorRatings.filter(rating => rating.rating <= 2);
        lowRatings.forEach(rating => {
            const request = collectionRequests.find(req => req.id === rating.collectionRequestId);
            notifications.push({
                id: `low-rating-${rating.collectionRequestId}`,
                type: 'low_rating',
                title: 'Low Rating Alert',
                message: `Collector received ${rating.rating} star rating. Feedback: "${rating.feedback?.substring(0, 50)}..."`,
                timestamp: rating.ratingDate,
                isRead: false,
                priority: 'medium',
                actionUrl: '/admin/dashboard/reviews'
            });
        });

        // New user registrations (last 7 days)
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const recentUsers = userProfiles.filter(user => 
            user.createdAt && new Date(user.createdAt) > weekAgo
        );
        recentUsers.forEach(user => {
            notifications.push({
                id: `new-user-${user.id || user.email}`,
                type: 'new_user',
                title: 'New User Registration',
                message: `${user.fullName || 'New user'} has registered on the platform`,
                timestamp: user.createdAt || now.toISOString(),
                isRead: false,
                priority: 'low',
                actionUrl: '/admin/dashboard/users'
            });
        });

        return notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    };

    const allNotifications = generateNotifications();
    
    // Filter notifications
    const filteredNotifications = allNotifications.filter(notification => {
        if (filterType === 'All') return true;
        if (filterType === 'Unread') return !notification.isRead;
        return notification.type === filterType.toLowerCase();
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInHours < 48) return 'Yesterday';
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'pending_request':
                return (
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                );
            case 'low_rating':
                return (
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                    </div>
                );
            case 'new_user':
                return (
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                        </svg>
                    </div>
                );
            default:
                return (
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                );
        }
    };

    const filterCounts = {
        All: allNotifications.length,
        Unread: allNotifications.filter(n => !n.isRead).length,
        pending_request: allNotifications.filter(n => n.type === 'pending_request').length,
        low_rating: allNotifications.filter(n => n.type === 'low_rating').length,
        new_user: allNotifications.filter(n => n.type === 'new_user').length,
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl p-6 text-white">
                <h1 className="text-2xl font-bold">System Notifications</h1>
                <p className="text-cyan-100">Stay updated with system alerts and activities</p>
            </div>

            {/* Filter Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-wrap gap-2 mb-6">
                    {Object.entries(filterCounts).map(([type, count]) => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                                filterType === type
                                    ? 'bg-cyan-500 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} ({count})
                        </button>
                    ))}
                </div>

                {/* Notifications List */}
                <div className="space-y-4">
                    {filteredNotifications.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No {filterType.toLowerCase()} notifications
                            </h3>
                            <p className="text-gray-600">
                                You're all caught up! New notifications will appear here.
                            </p>
                        </div>
                    ) : (
                        filteredNotifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                                    notification.isRead 
                                        ? 'bg-white border-gray-200' 
                                        : 'bg-blue-50 border-blue-200'
                                }`}
                            >
                                <div className="flex items-start space-x-4">
                                    {getNotificationIcon(notification.type)}
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className={`text-sm font-medium ${
                                                notification.isRead ? 'text-gray-900' : 'text-gray-900 font-semibold'
                                            }`}>
                                                {notification.title}
                                            </h4>
                                            <div className="flex items-center space-x-2">
                                                {notification.priority === 'high' && (
                                                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                                                        High Priority
                                                    </span>
                                                )}
                                                <span className="text-xs text-gray-500">
                                                    {formatDate(notification.timestamp)}
                                                </span>
                                            </div>
                                        </div>
                                        <p className={`text-sm ${
                                            notification.isRead ? 'text-gray-600' : 'text-gray-700'
                                        }`}>
                                            {notification.message}
                                        </p>
                                        
                                        {/* Action Button */}
                                        {notification.actionUrl && (
                                            <div className="mt-3">
                                                <button
                                                    onClick={() => {
                                                        window.location.href = notification.actionUrl;
                                                    }}
                                                    className="text-cyan-600 hover:text-cyan-700 text-sm font-medium"
                                                >
                                                    View Details →
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {!notification.isRead && (
                                        <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2"></div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminNotifications;
