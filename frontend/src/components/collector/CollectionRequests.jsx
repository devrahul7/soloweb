// components/CollectionRequests.jsx
import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const CollectionRequests = () => {
    const [collectionRequests, setCollectionRequests] = useLocalStorage('collectionRequests', []);
    const [collectorProfile] = useLocalStorage('collectorProfile', {});
    const [filterStatus, setFilterStatus] = useState('All');

    // Filter requests based on status
    const filteredRequests = collectionRequests.filter(request => {
        if (filterStatus === 'All') return true;
        return request.status === filterStatus;
    });

    // Sort by date (most recent first)
    const sortedRequests = [...filteredRequests].sort((a, b) => 
        new Date(b.requestDate) - new Date(a.requestDate)
    );

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
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

    const handleAcceptRequest = (requestId) => {
        const updatedRequests = collectionRequests.map(request => {
            if (request.id === requestId) {
                return {
                    ...request,
                    status: 'Accepted',
                    collectorInfo: {
                        id: 'collector-1',
                        name: collectorProfile.fullName || 'Collector',
                        phone: collectorProfile.phone || '+977-9800000000',
                        rating: 4.8
                    },
                    estimatedCollectionDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                    statusHistory: [
                        ...(request.statusHistory || []),
                        {
                            status: 'Accepted',
                            timestamp: new Date().toISOString(),
                            message: 'Request accepted by collector'
                        }
                    ]
                };
            }
            return request;
        });

        setCollectionRequests(updatedRequests);
        
        // Show success notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2';
        notification.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Request accepted successfully!</span>
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 3000);
    };

    const handleRejectRequest = (requestId) => {
        if (window.confirm('Are you sure you want to reject this collection request?')) {
            const updatedRequests = collectionRequests.map(request => {
                if (request.id === requestId) {
                    return {
                        ...request,
                        status: 'Rejected',
                        statusHistory: [
                            ...(request.statusHistory || []),
                            {
                                status: 'Rejected',
                                timestamp: new Date().toISOString(),
                                message: 'Request rejected by collector'
                            }
                        ]
                    };
                }
                return request;
            });

            setCollectionRequests(updatedRequests);
            
            // Show notification
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2';
            notification.innerHTML = `
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                <span>Request rejected</span>
            `;
            document.body.appendChild(notification);
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 3000);
        }
    };

    const handleMarkInProgress = (requestId) => {
        const updatedRequests = collectionRequests.map(request => {
            if (request.id === requestId) {
                return {
                    ...request,
                    status: 'In Progress',
                    statusHistory: [
                        ...(request.statusHistory || []),
                        {
                            status: 'In Progress',
                            timestamp: new Date().toISOString(),
                            message: 'Collection started'
                        }
                    ]
                };
            }
            return request;
        });

        setCollectionRequests(updatedRequests);
    };

    const handleMarkCompleted = (requestId) => {
        const updatedRequests = collectionRequests.map(request => {
            if (request.id === requestId) {
                return {
                    ...request,
                    status: 'Completed',
                    statusHistory: [
                        ...(request.statusHistory || []),
                        {
                            status: 'Completed',
                            timestamp: new Date().toISOString(),
                            message: 'Collection completed successfully'
                        }
                    ]
                };
            }
            return request;
        });

        setCollectionRequests(updatedRequests);
        
        // Show success notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2';
        notification.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Collection completed!</span>
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 3000);
    };

    const statusCounts = {
        All: collectionRequests.length,
        Pending: collectionRequests.filter(r => r.status === 'Pending').length,
        Accepted: collectionRequests.filter(r => r.status === 'Accepted').length,
        'In Progress': collectionRequests.filter(r => r.status === 'In Progress').length,
        Completed: collectionRequests.filter(r => r.status === 'Completed').length,
        Rejected: collectionRequests.filter(r => r.status === 'Rejected').length,
    };

    return (
        <div className="max-w-7xl mx-auto my-5 space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                <h1 className="text-2xl font-bold">Collection Requests</h1>
                <p className="text-green-100">Manage and respond to recycling collection requests</p>
            </div>

            {/* Filter Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-wrap gap-2 mb-6">
                    {Object.entries(statusCounts).map(([status, count]) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                                filterStatus === status
                                    ? 'bg-blue-500 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {status} ({count})
                        </button>
                    ))}
                </div>

                {/* Requests List */}
                <div className="space-y-4">
                    {sortedRequests.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No {filterStatus.toLowerCase()} requests
                            </h3>
                            <p className="text-gray-600">
                                {filterStatus === 'All' 
                                    ? 'Collection requests will appear here when users submit them'
                                    : `No requests with ${filterStatus.toLowerCase()} status found`
                                }
                            </p>
                        </div>
                    ) : (
                        sortedRequests.map((request) => (
                            <div key={request.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                                {/* Request Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                                            {request.status}
                                        </div>
                                        <span className="text-sm text-gray-500">
                                            Request #{request.id}
                                        </span>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {formatDate(request.requestDate)}
                                    </span>
                                </div>

                                {/* User Info */}
                                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                    <h4 className="font-medium text-gray-900 mb-2">Customer Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-600">Name:</span>
                                            <span className="ml-2 font-medium">{request.userInfo?.name || 'N/A'}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Phone:</span>
                                            <span className="ml-2 font-medium">{request.userInfo?.phone || 'N/A'}</span>
                                        </div>
                                        <div className="md:col-span-2">
                                            <span className="text-gray-600">Address:</span>
                                            <span className="ml-2 font-medium">
                                                {request.userInfo?.address ? 
                                                    `${request.userInfo.address}, ${request.userInfo.city || ''}` : 
                                                    'N/A'
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Collection Details */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Items</p>
                                        <p className="font-medium">{request.items?.length || 0} items</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Total Value</p>
                                        <p className="font-medium text-green-600">Rs. {request.totalEstimatedValue}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Collection Date</p>
                                        <p className="font-medium">
                                            {request.estimatedCollectionDate 
                                                ? formatDate(request.estimatedCollectionDate)
                                                : 'TBD'
                                            }
                                        </p>
                                    </div>
                                </div>

                                {/* Items List */}
                                <div className="mb-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Items:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {request.items?.map((item, index) => (
                                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                                                {item.name} ({item.quantity})
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                                    {request.status === 'Pending' && (
                                        <>
                                            <button
                                                onClick={() => handleAcceptRequest(request.id)}
                                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                                <span>Accept</span>
                                            </button>
                                            <button
                                                onClick={() => handleRejectRequest(request.id)}
                                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                                </svg>
                                                <span>Reject</span>
                                            </button>
                                        </>
                                    )}

                                    {request.status === 'Accepted' && (
                                        <button
                                            onClick={() => handleMarkInProgress(request.id)}
                                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                            </svg>
                                            <span>Start Collection</span>
                                        </button>
                                    )}

                                    {request.status === 'In Progress' && (
                                        <button
                                            onClick={() => handleMarkCompleted(request.id)}
                                            className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors flex items-center space-x-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                            <span>Mark Completed</span>
                                        </button>
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

export default CollectionRequests;
