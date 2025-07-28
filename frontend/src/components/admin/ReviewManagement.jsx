// components/admin/ReviewManagement.jsx
import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const ReviewManagement = () => {
    const [collectorRatings, setCollectorRatings] = useLocalStorage('collectorRatings', []);
    const [collectionRequests] = useLocalStorage('collectionRequests', []);
    const [collectorProfiles] = useLocalStorage('collectorProfiles', []);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRating, setFilterRating] = useState('All');
    const [selectedReview, setSelectedReview] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Get reviews with additional information
    const reviewsWithDetails = collectorRatings.map(rating => {
        const request = collectionRequests.find(req => req.id === rating.collectionRequestId);
        const collector = collectorProfiles.find(col => col.id === rating.collectorId);
        
        return {
            ...rating,
            collectorName: collector?.fullName || 'Unknown Collector',
            collectorEmail: collector?.email || 'N/A',
            userName: request?.userInfo?.name || 'Anonymous User',
            userEmail: request?.userInfo?.email || 'N/A',
            requestValue: request?.totalEstimatedValue || 0,
            requestDate: request?.requestDate || rating.ratingDate,
            items: request?.items || []
        };
    });

    // Filter reviews
    const filteredReviews = reviewsWithDetails.filter(review => {
        const matchesSearch = 
            review.collectorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.feedback?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesRating = filterRating === 'All' || review.rating.toString() === filterRating;
        
        return matchesSearch && matchesRating;
    });

    // Sort by date (most recent first)
    const sortedReviews = [...filteredReviews].sort((a, b) => 
        new Date(b.ratingDate) - new Date(a.ratingDate)
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

    const handleDeleteReview = (reviewId) => {
        if (window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
            const updatedReviews = collectorRatings.filter(rating => rating.id !== reviewId);
            setCollectorRatings(updatedReviews);
            
            // Show notification
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2';
            notification.innerHTML = `
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Review deleted successfully!</span>
            `;
            document.body.appendChild(notification);
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 3000);
        }
    };

    const ratingCounts = {
        All: collectorRatings.length,
        5: collectorRatings.filter(r => r.rating === 5).length,
        4: collectorRatings.filter(r => r.rating === 4).length,
        3: collectorRatings.filter(r => r.rating === 3).length,
        2: collectorRatings.filter(r => r.rating === 2).length,
        1: collectorRatings.filter(r => r.rating === 1).length,
    };

    // Calculate analytics
    const averageRating = collectorRatings.length > 0 
        ? (collectorRatings.reduce((sum, rating) => sum + rating.rating, 0) / collectorRatings.length).toFixed(1)
        : 0;

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
                <h1 className="text-2xl font-bold">Review Management</h1>
                <p className="text-yellow-100">Monitor and manage customer reviews and ratings</p>
            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="text-center">
                        <p className="text-sm text-gray-600">Total Reviews</p>
                        <p className="text-2xl font-bold text-blue-600">{collectorRatings.length}</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="text-center">
                        <p className="text-sm text-gray-600">Average Rating</p>
                        <p className="text-2xl font-bold text-yellow-600">{averageRating}⭐</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="text-center">
                        <p className="text-sm text-gray-600">5-Star Reviews</p>
                        <p className="text-2xl font-bold text-green-600">{ratingCounts[5]}</p>
                        <p className="text-xs text-gray-500">
                            {collectorRatings.length > 0 ? Math.round((ratingCounts[5] / collectorRatings.length) * 100) : 0}%
                        </p>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="text-center">
                        <p className="text-sm text-gray-600">Low Ratings (≤2)</p>
                        <p className="text-2xl font-bold text-red-600">{ratingCounts[1] + ratingCounts[2]}</p>
                        <p className="text-xs text-gray-500">Need attention</p>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-6">
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                            <input
                                type="text"
                                placeholder="Search reviews by collector, user, or feedback..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(ratingCounts).map(([rating, count]) => (
                            <button
                                key={rating}
                                onClick={() => setFilterRating(rating)}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                                    filterRating === rating
                                        ? 'bg-yellow-500 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {rating === 'All' ? 'All' : `${rating}⭐`} ({count})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Reviews Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 font-medium text-gray-600">Rating</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600">Collector</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600">Customer</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600">Feedback</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedReviews.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-8">
                                        <div className="text-gray-500">
                                            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                                            </svg>
                                            No reviews found
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                sortedReviews.map((review) => (
                                    <tr key={review.id || review.collectionRequestId} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center space-x-1">
                                                {renderStars(review.rating)}
                                                <span className="ml-2 text-sm font-medium">{review.rating}/5</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div>
                                                <p className="font-medium text-gray-900">{review.collectorName}</p>
                                                <p className="text-sm text-gray-500">{review.collectorEmail}</p>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div>
                                                <p className="font-medium text-gray-900">{review.userName}</p>
                                                <p className="text-sm text-gray-500">{review.userEmail}</p>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 max-w-xs">
                                            <p className="text-sm text-gray-700 truncate">
                                                {review.feedback || 'No feedback provided'}
                                            </p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className="text-sm text-gray-600">{formatDate(review.ratingDate)}</p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedReview(review);
                                                        setIsModalOpen(true);
                                                    }}
                                                    className="text-yellow-600 hover:text-yellow-800 text-sm font-medium"
                                                >
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteReview(review.id || review.collectionRequestId)}
                                                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Review Detail Modal */}
            {isModalOpen && selectedReview && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">Review Details</h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-6">
                                {/* Rating */}
                                <div className="text-center">
                                    <div className="flex items-center justify-center space-x-1 mb-2">
                                        {renderStars(selectedReview.rating)}
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">{selectedReview.rating}/5</p>
                                    <p className="text-sm text-gray-600">Customer Rating</p>
                                </div>

                                {/* Feedback */}
                                {selectedReview.feedback && (
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-2">Customer Feedback</h4>
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <p className="text-gray-700 italic">"{selectedReview.feedback}"</p>
                                        </div>
                                    </div>
                                )}

                                {/* Collection Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-3">Collector Information</h4>
                                        <div className="space-y-2 text-sm">
                                            <p><span className="text-gray-600">Name:</span> {selectedReview.collectorName}</p>
                                            <p><span className="text-gray-600">Email:</span> {selectedReview.collectorEmail}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-3">Customer Information</h4>
                                        <div className="space-y-2 text-sm">
                                            <p><span className="text-gray-600">Name:</span> {selectedReview.userName}</p>
                                            <p><span className="text-gray-600">Email:</span> {selectedReview.userEmail}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Request Details */}
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-3">Collection Details</h4>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                                            <div>
                                                <span className="text-gray-600">Request ID:</span>
                                                <span className="ml-2 font-medium">#{selectedReview.collectionRequestId}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Value:</span>
                                                <span className="ml-2 font-medium text-green-600">Rs. {selectedReview.requestValue}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Date:</span>
                                                <span className="ml-2 font-medium">{formatDate(selectedReview.requestDate)}</span>
                                            </div>
                                        </div>
                                        {selectedReview.items && selectedReview.items.length > 0 && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-700 mb-2">Items Collected:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedReview.items.map((item, index) => (
                                                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                                            {item.name} ({item.quantity})
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Review History */}
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-3">Review Information</h4>
                                    <div className="text-sm space-y-1">
                                        <p><span className="text-gray-600">Review Date:</span> {formatDate(selectedReview.ratingDate)}</p>
                                        {selectedReview.editedDate && (
                                            <p><span className="text-gray-600">Last Edited:</span> {formatDate(selectedReview.editedDate)}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewManagement;
