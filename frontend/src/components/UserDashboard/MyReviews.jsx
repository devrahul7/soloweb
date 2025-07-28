import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import CollectorRatingModal from './CollectorRatingModal';

const MyReviews = () => {
    const [collectorRatings, setCollectorRatings] = useLocalStorage('collectorRatings', []);
    const [collectionRequests] = useLocalStorage('collectionRequests', []);
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
    const [editingReview, setEditingReview] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);

    // Get collection request details for a rating
    const getRequestForRating = (ratingId) => {
        return collectionRequests.find(request => request.id === ratingId);
    };

    // Format date
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
                className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 24 24"
            >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
        ));
    };

    // Handle edit review
    const handleEditReview = (rating) => {
        const request = getRequestForRating(rating.collectionRequestId);
        setSelectedRequest(request);
        setEditingReview(rating);
        setIsRatingModalOpen(true);
    };

    // Handle remove review
    const handleRemoveReview = (ratingId) => {
        if (window.confirm('Are you sure you want to remove this review? This action cannot be undone.')) {
            const updatedRatings = collectorRatings.filter(rating => 
                rating.collectionRequestId !== ratingId
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

    // Handle rating update
    const handleRatingUpdate = (ratingData) => {
        const updatedRatings = collectorRatings.map(rating => 
            rating.collectionRequestId === ratingData.collectionRequestId 
                ? { ...ratingData, ratingDate: rating.ratingDate, editedDate: new Date().toISOString() }
                : rating
        );
        setCollectorRatings(updatedRatings);
        
        setIsRatingModalOpen(false);
        setEditingReview(null);
        setSelectedRequest(null);
        
        // Show success notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2';
        notification.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Review updated successfully!</span>
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 3000);
    };

    // Sort reviews by date (most recent first)
    const sortedReviews = [...collectorRatings].sort((a, b) => 
        new Date(b.ratingDate) - new Date(a.ratingDate)
    );

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
                <h1 className="text-2xl font-bold">My Reviews</h1>
                <p className="text-yellow-100">Manage all your collector reviews and ratings</p>
            </div>

            {/* Reviews List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                {sortedReviews.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                        <p className="text-gray-600">Your reviews of collectors will appear here after completed collections</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {sortedReviews.map((rating) => {
                            const request = getRequestForRating(rating.collectionRequestId);
                            
                            return (
                                <div key={rating.collectionRequestId} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                                    {/* Review Header */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">
                                                    {request?.collectorInfo?.name || 'Unknown Collector'}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    Request #{rating.collectionRequestId}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleEditReview(rating)}
                                                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors"
                                                title="Edit review"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleRemoveReview(rating.collectionRequestId)}
                                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
                                                title="Remove review"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Rating Display */}
                                    <div className="mb-4">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <div className="flex items-center space-x-1">
                                                {renderStars(rating.rating)}
                                            </div>
                                            <span className="text-sm text-gray-600">({rating.rating}/5)</span>
                                        </div>
                                        {rating.feedback && (
                                            <p className="text-gray-700 italic">"{rating.feedback}"</p>
                                        )}
                                    </div>

                                    {/* Collection Details */}
                                    {request && (
                                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                            <h4 className="font-medium text-gray-900 mb-2">Collection Details</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                <div>
                                                    <span className="text-gray-600">Items:</span>
                                                    <span className="ml-2 font-medium">{request.items?.length || 0}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">Value:</span>
                                                    <span className="ml-2 font-medium text-green-600">Rs. {request.totalEstimatedValue}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">Collection Date:</span>
                                                    <span className="ml-2 font-medium">
                                                        {request.estimatedCollectionDate 
                                                            ? formatDate(request.estimatedCollectionDate)
                                                            : 'N/A'
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Review Metadata */}
                                    <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-200">
                                        <span>
                                            Reviewed on {formatDate(rating.ratingDate)}
                                        </span>
                                        {rating.editedDate && (
                                            <span className="text-blue-600">
                                                • Edited on {formatDate(rating.editedDate)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Rating Modal */}
            <CollectorRatingModal
                isOpen={isRatingModalOpen}
                onClose={() => {
                    setIsRatingModalOpen(false);
                    setEditingReview(null);
                    setSelectedRequest(null);
                }}
                collectionRequest={selectedRequest}
                onSubmitRating={handleRatingUpdate}
                existingRating={editingReview}
            />
        </div>
    );
};

export default MyReviews;
