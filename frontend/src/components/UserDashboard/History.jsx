import React from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const History = () => {
    const [collectionRequests] = useLocalStorage('collectionRequests', []);

    // Enhanced status colors to match your collection system
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

    // Status icons
    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                );
            case 'Accepted':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                );
            case 'In Progress':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                );
            case 'Completed':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                );
            case 'Rejected':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                );
            default:
                return null;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Sort requests by date (most recent first)
    const sortedRequests = [...collectionRequests].sort((a, b) => 
        new Date(b.requestDate) - new Date(a.requestDate)
    );

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                <h1 className="text-2xl font-bold">Collection History</h1>
                <p className="text-orange-100">Track all your collection requests and their status</p>
            </div>

            {/* History List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                {sortedRequests.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No collection history</h3>
                        <p className="text-gray-600">Your collection requests will appear here</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {sortedRequests.map((request) => (
                            <div key={request.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                                {/* Request Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2 ${getStatusColor(request.status)}`}>
                                            {getStatusIcon(request.status)}
                                            <span>{request.status}</span>
                                        </div>
                                        <span className="text-sm text-gray-500">
                                            Request #{request.id}
                                        </span>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {formatDate(request.requestDate)}
                                    </span>
                                </div>

                                {/* Request Details */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Items</p>
                                        <p className="font-medium">{request.items.length} items</p>
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
                                        {request.items.map((item, index) => (
                                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                                                {item.name} ({item.quantity})
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Collector Info */}
                                {request.collectorInfo && (
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="font-medium text-gray-900 mb-2">Collector Information</h4>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{request.collectorInfo.name}</p>
                                                <p className="text-sm text-gray-600">
                                                    {request.collectorInfo.phone} • ⭐ {request.collectorInfo.rating}/5
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;
