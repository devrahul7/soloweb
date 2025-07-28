// components/CollectorReviews.jsx
import React from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const CollectorReviews = () => {
    const [collectorRatings] = useLocalStorage('collectorRatings', []);
    const [collectionRequests] = useLocalStorage('collectionRequests', []);

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

    // Calculate average rating and statistics
    const averageRating = collectorRatings.length > 0 
        ? (collectorRatings.reduce((sum, rating) => sum + rating.rating, 0) / collectorRatings.length).toFixed(1)
        : 0;

    const ratingDistribution = [5, 4, 3, 2, 1].map(stars => ({
        stars,
        count: collectorRatings.filter(rating => rating.rating === stars).length,
        percentage: collectorRatings.length > 0 
            ? Math.round((collectorRatings.filter(rating => rating.rating === stars).length / collectorRatings.length) * 100)
            : 0
    }));

    // Sort reviews by date (most recent first)
    const sortedReviews = [...collectorRatings].sort((a, b) => 
        new Date(b.ratingDate) - new Date(a.ratingDate)
    );

    return (
        <div className="max-w-6xl mx-auto my-5 space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
                <h1 className="text-2xl font-bold">My Reviews</h1>
                <p className="text-yellow-100">See what customers are saying about your service</p>
            </div>

            {/* Rating Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
            </div>

            {/* Reviews List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Customer Reviews</h2>
                
                {sortedReviews.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                        <p className="text-gray-600">Customer reviews will appear here after completed collections</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {sortedReviews.map((rating) => {
                            const request = getRequestForRating(rating.collectionRequestId);
                            
                            return (
                                <div key={rating.collectionRequestId} className="border border-gray-200 rounded-lg p-6">
                                    {/* Review Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">
                                                    {request?.userInfo?.name || 'Anonymous Customer'}
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    Request #{rating.collectionRequestId}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center space-x-1 mb-1">
                                                {renderStars(rating.rating)}
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                {formatDate(rating.ratingDate)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Review Content */}
                                    {rating.feedback && (
                                        <div className="mb-4">
                                            <p className="text-gray-700 italic">"{rating.feedback}"</p>
                                        </div>
                                    )}

                                    {/* Collection Details */}
                                    {request && (
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h5 className="font-medium text-gray-900 mb-2">Collection Details</h5>
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

                                    {/* Edit History */}
                                    {rating.editedDate && (
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <p className="text-xs text-blue-600">
                                                Review edited on {formatDate(rating.editedDate)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CollectorReviews;
