// components/CollectorNotifications.jsx
import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const CollectorNotifications = () => {
    const [collectionRequests] = useLocalStorage('collectionRequests', []);
    const [notifications, setNotifications] = useLocalStorage('collectorNotifications', []);
    const [filterType, setFilterType] = useState('All');

    // Generate notifications from collection requests
    const generateNotifications = () => {
        const autoNotifications = [];
        
        // Pending requests notifications
        const pendingRequests = collectionRequests.filter(req => req.status === 'Pending');
        pendingRequests.forEach(request => {
            autoNotifications.push({
                id: `pending-${request.id}`,
                type: 'new_request',
                title: 'New Collection Request',
                message: `New collection request from ${request.userInfo?.name || 'Customer'} - ${request.items?.length || 0} items worth Rs. ${request.totalEstimatedValue}`,
                timestamp: request.requestDate,
                isRead: false,
                priority: 'high',
                actionUrl: '/collector/dashboard/requests'
            });
        });

        // Recent reviews notifications
        const [collectorRatings] = useLocalStorage('collectorRatings', []);
        const recentRatings = collectorRatings.filter(rating => {
            const ratingDate = new Date(rating.ratingDate);
            const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
            return ratingDate > threeDaysAgo;
        });

        recentRatings.forEach(rating => {
            const request = collectionRequests.find(req => req.id === rating.collectionRequestId);
            autoNotifications.push({
                id: `review-${rating.collectionRequestId}`,
                type: 'review',
                title: 'New Review Received',
                message: `${request?.userInfo?.name || 'A customer'} rated you ${rating.rating} stars${rating.feedback ? ': "' + rating.feedback.substring(0, 50) + '..."' : ''}`,
                timestamp: rating.ratingDate,
                isRead: false,
                priority: 'medium',
                actionUrl: '/collector/dashboard/reviews'
            });
        });

        return [...autoNotifications, ...notifications].sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
        );
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
            case 'new_request':
                return (
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                        </svg>
                    </div>
                );
            case 'review':
                return (
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                        </svg>
                    </div>
                );
            case 'system':
                return (
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                );
            default:
                return (
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                        </svg>
                    </div>
                );
        }
    };

    const markAsRead = (notificationId) => {
        setNotifications(prev => 
            prev.map(notification => 
                notification.id === notificationId 
                    ? { ...notification, isRead: true }
                    : notification
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => 
            prev.map(notification => ({ ...notification, isRead: true }))
        );
    };

    const deleteNotification = (notificationId) => {
        setNotifications(prev => 
            prev.filter(notification => notification.id !== notificationId)
        );
    };

    const filterCounts = {
        All: allNotifications.length,
        Unread: allNotifications.filter(n => !n.isRead).length,
        'New_request': allNotifications.filter(n => n.type === 'new_request').length,
        Review: allNotifications.filter(n => n.type === 'review').length,
        System: allNotifications.filter(n => n.type === 'system').length,
    };

    return (
        <div className="max-w-4xl mx-auto my-5 space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Notifications</h1>
                        <p className="text-indigo-100">Stay updated with your collection activities</p>
                    </div>
                    {filterCounts.Unread > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors"
                        >
                            Mark all as read
                        </button>
                    )}
                </div>
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
                                    ? 'bg-indigo-500 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {type.replace('_', ' ')} ({count})
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
                                {filterType === 'All' 
                                    ? 'You\'re all caught up! New notifications will appear here.'
                                    : `No ${filterType.toLowerCase()} notifications found.`
                                }
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
                                        
                                        {/* Action Buttons */}
                                        <div className="flex items-center space-x-2 mt-3">
                                            {notification.actionUrl && (
                                                <button
                                                    onClick={() => {
                                                        markAsRead(notification.id);
                                                        window.location.href = notification.actionUrl;
                                                    }}
                                                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                                                >
                                                    View Details →
                                                </button>
                                            )}
                                            {!notification.isRead && (
                                                <button
                                                    onClick={() => markAsRead(notification.id)}
                                                    className="text-gray-500 hover:text-gray-700 text-sm"
                                                >
                                                    Mark as read
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteNotification(notification.id)}
                                                className="text-red-500 hover:text-red-700 text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>

                                    {!notification.isRead && (
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
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

export default CollectorNotifications;
