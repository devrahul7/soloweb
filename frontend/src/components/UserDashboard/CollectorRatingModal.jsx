import React, { useState, useEffect } from 'react';

const CollectorRatingModal = ({ isOpen, onClose, collectionRequest, onSubmitRating, existingRating }) => {
    const [rating, setRating] = useState(existingRating?.rating || 0);
    const [feedback, setFeedback] = useState(existingRating?.feedback || '');
    const [hoveredRating, setHoveredRating] = useState(0);

    // Update state when existingRating changes
    useEffect(() => {
        if (existingRating) {
            setRating(existingRating.rating);
            setFeedback(existingRating.feedback || '');
        } else {
            setRating(0);
            setFeedback('');
        }
    }, [existingRating]);

    const handleSubmit = () => {
        const ratingData = {
            collectionRequestId: collectionRequest.id,
            collectorId: collectionRequest.collectorInfo?.id,
            rating: rating,
            feedback: feedback.trim(),
            ratingDate: existingRating?.ratingDate || new Date().toISOString(),
            aspects: {
                punctuality: rating,
                professionalism: rating,
                fairPricing: rating,
                communication: rating
            }
        };
        
        onSubmitRating(ratingData);
        setRating(0);
        setFeedback('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
            }}
        >
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {existingRating ? 'Edit Your Review' : 'Rate Your Experience'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Collector Info */}
                <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">{collectionRequest?.collectorInfo?.name || 'Collector'}</p>
                        <p className="text-sm text-gray-600">
                            {existingRating ? 'Update your review' : 'Collection completed'}
                        </p>
                    </div>
                </div>

                {/* Star Rating */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Overall Rating
                    </label>
                    <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(0)}
                                onClick={() => setRating(star)}
                                className="p-1 transition-colors duration-200 focus:outline-none"
                            >
                                <svg
                                    className={`w-8 h-8 transition-colors duration-200 ${
                                        star <= (hoveredRating || rating)
                                            ? 'text-yellow-400'
                                            : 'text-gray-300'
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                            </button>
                        ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                        {rating === 0 ? 'Select a rating' : 
                         rating === 1 ? 'Poor' :
                         rating === 2 ? 'Fair' :
                         rating === 3 ? 'Good' :
                         rating === 4 ? 'Very Good' : 'Excellent'}
                    </p>
                </div>

                {/* Feedback Text Area */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Comments (Optional)
                    </label>
                    <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder={existingRating ? "Update your feedback..." : "Share your experience with this collector..."}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition-all duration-200"
                        rows="3"
                        maxLength="500"
                    />
                    <div className="flex justify-between items-center mt-1">
                        <p className="text-sm text-gray-500">{feedback.length}/500 characters</p>
                        {existingRating && (
                            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                Editing existing review
                            </span>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={rating === 0}
                        className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                            rating === 0
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                    >
                        {existingRating ? 'Update Review' : 'Submit Rating'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CollectorRatingModal;
