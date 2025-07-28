import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import CollectorRatingModal from './CollectorRatingModal';

const History = () => {
    const [collectionRequests] = useLocalStorage('collectionRequests', []);
    const [collectorRatings, setCollectorRatings] = useLocalStorage('collectorRatings', []);
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [editingRating, setEditingRating] = useState(null);

    // Get rating for a specific request
    const getRatingForRequest = (requestId) => {
        return collectorRatings.find(rating => rating.collectionRequestId === requestId);
    };

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

    // Render star rating
    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <svg
                key={i}
                className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 24 24"
            >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
        ));
    };

    // Handle rating submission (both new and edit)
    const handleRatingSubmit = (ratingData) => {
        if (editingRating) {
            // Update existing rating
            const updatedRatings = collectorRatings.map(rating => 
                rating.collectionRequestId === ratingData.collectionRequestId 
                    ? { ...ratingData, ratingDate: rating.ratingDate, editedDate: new Date().toISOString() }
                    : rating
            );
            setCollectorRatings(updatedRatings);
        } else {
            // Add new rating
            setCollectorRatings([ratingData, ...collectorRatings]);
        }
        
        setIsRatingModalOpen(false);
        setSelectedRequest(null);
        setEditingRating(null);
        
        // Show success notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2';
        notification.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>${editingRating ? 'Review updated successfully!' : 'Thank you for your feedback!'}</span>
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 3000);
    };

    // Handle edit rating
    const handleEditRating = (request, rating) => {
        setSelectedRequest(request);
        setEditingRating(rating);
        setIsRatingModalOpen(true);
    };

    // Handle remove rating
    const handleRemoveRating = (requestId) => {
        if (window.confirm('Are you sure you want to remove your review? This action cannot be undone.')) {
            const updatedRatings = collectorRatings.filter(rating => 
                rating.collectionRequestId !== requestId
            );
            setCollectorRatings(updatedRatings);
            
            // Show success notification
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2';
            notification.innerHTML = `
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                <span>Review removed successfully</span>
            `;
            document.body.appendChild(notification);
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 3000);
        }
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
                        {sortedRequests.map((request) => {
                            const rating = getRatingForRequest(request.id);
                            const canRate = request.status === 'Completed' && request.collectorInfo && !rating;
                            
                            return (
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
                                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
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

                                    {/* Enhanced Rating Section */}
                                    {rating ? (
                                        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-medium text-gray-900">Your Rating</h4>
                                                <div className="flex items-center space-x-2">
                                                    <div className="flex items-center space-x-1">
                                                        {renderStars(rating.rating)}
                                                        <span className="ml-2 text-sm text-gray-600">({rating.rating}/5)</span>
                                                    </div>
                                                    {/* Edit/Remove buttons */}
                                                    <div className="flex items-center space-x-1">
                                                        <button
                                                            onClick={() => handleEditRating(request, rating)}
                                                            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors"
                                                            title="Edit review"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => handleRemoveRating(request.id)}
                                                            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
                                                            title="Remove review"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            {rating.feedback && (
                                                <p className="text-sm text-gray-700 italic mb-2">"{rating.feedback}"</p>
                                            )}
                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                <span>
                                                    Rated on {formatDate(rating.ratingDate)}
                                                </span>
                                                {rating.editedDate && (
                                                    <span className="text-blue-600">
                                                        • Edited on {formatDate(rating.editedDate)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ) : canRate && (
                                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="font-medium text-gray-900">Rate Your Experience</h4>
                                                    <p className="text-sm text-gray-600">How was your experience with {request.collectorInfo.name}?</p>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        setSelectedRequest(request);
                                                        setIsRatingModalOpen(true);
                                                    }}
                                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                    </svg>
                                                    <span>Rate Collector</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Enhanced Rating Modal */}
            <CollectorRatingModal
                isOpen={isRatingModalOpen}
                onClose={() => {
                    setIsRatingModalOpen(false);
                    setSelectedRequest(null);
                    setEditingRating(null);
                }}
                collectionRequest={selectedRequest}
                onSubmitRating={handleRatingSubmit}
                existingRating={editingRating}
            />
        </div>
    );
};

export default History;
