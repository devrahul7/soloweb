import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import ConfirmDialog from '../ui/ConfirmDialog';
import CollectorRatingModal from './CollectorRatingModal';

const RecyclingQueue = () => {
    const [recyclingQueue, setRecyclingQueue] = useLocalStorage('recyclingQueue', []);
    const [userProfile] = useLocalStorage('userProfile', {});
    const [collectionRequests] = useLocalStorage('collectionRequests', []);
    const [collectorRatings] = useLocalStorage('collectorRatings', []);
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, itemId: null });
    const [isRequestingCollection, setIsRequestingCollection] = useState(false);
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
    const [completedRequest, setCompletedRequest] = useState(null);

    // Get the latest collection request status
    const latestRequest = collectionRequests.length > 0 ? collectionRequests[0] : null;
    const hasActiveRequest = latestRequest && ['Pending', 'Accepted', 'In Progress'].includes(latestRequest.status);

    // Check if request is completed and needs rating
    const needsRating = latestRequest && 
        latestRequest.status === 'Completed' && 
        !collectorRatings.some(rating => rating.collectionRequestId === latestRequest.id);

    // Enhanced quantity update with better validation and units
    const updateQuantity = (itemId, newQuantity) => {
        if (newQuantity < 0.1) return; // Minimum quantity
        
        setRecyclingQueue(prev => prev.map(item => 
            item.id === itemId 
                ? { 
                    ...item, 
                    quantity: newQuantity, 
                    estimatedValue: (newQuantity * item.pricePerUnit).toFixed(2) 
                }
                : item
        ));
    };

    // Get appropriate unit and step for different item types
    const getQuantityConfig = (category, itemName) => {
        const itemLower = itemName.toLowerCase();
        const categoryLower = category.toLowerCase();

        // Weight-based items (kg)
        if (categoryLower.includes('paper') || 
            categoryLower.includes('metal') || 
            categoryLower.includes('brass') ||
            itemLower.includes('newspaper') ||
            itemLower.includes('cardboard') ||
            itemLower.includes('aluminum') ||
            itemLower.includes('steel') ||
            itemLower.includes('iron')) {
            return { unit: 'kg', step: 0.5, min: 0.5 };
        }
        
        // Piece-based items
        if (categoryLower.includes('e-waste') ||
            itemLower.includes('phone') ||
            itemLower.includes('laptop') ||
            itemLower.includes('computer') ||
            itemLower.includes('tv') ||
            itemLower.includes('monitor')) {
            return { unit: 'pcs', step: 1, min: 1 };
        }
        
        // Glass and plastic can be either weight or pieces
        if (categoryLower.includes('glass') || categoryLower.includes('plastic')) {
            if (itemLower.includes('bottle') || itemLower.includes('container') || itemLower.includes('jar')) {
                return { unit: 'pcs', step: 1, min: 1 };
            } else {
                return { unit: 'kg', step: 0.1, min: 0.1 };
            }
        }

        // Default to kg for others
        return { unit: 'kg', step: 0.1, min: 0.1 };
    };

    // Get status display function
    const getStatusDisplay = (status) => {
        switch (status) {
            case 'Pending':
                return {
                    color: 'text-yellow-600 bg-yellow-100',
                    icon: (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    ),
                    text: 'Pending Review'
                };
            case 'Accepted':
                return {
                    color: 'text-green-600 bg-green-100',
                    icon: (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    ),
                    text: 'Accepted by Collector'
                };
            case 'In Progress':
                return {
                    color: 'text-blue-600 bg-blue-100',
                    icon: (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                    ),
                    text: 'Collection in Progress'
                };
            case 'Completed':
                return {
                    color: 'text-emerald-600 bg-emerald-100',
                    icon: (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    ),
                    text: 'Collection Completed'
                };
            case 'Rejected':
                return {
                    color: 'text-red-600 bg-red-100',
                    icon: (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    ),
                    text: 'Request Rejected'
                };
            default:
                return {
                    color: 'text-gray-600 bg-gray-100',
                    icon: null,
                    text: 'Unknown Status'
                };
        }
    };

    // Handle rating submission
    const handleRatingSubmit = (ratingData) => {
        // Save rating to localStorage
        const existingRatings = JSON.parse(localStorage.getItem('collectorRatings') || '[]');
        localStorage.setItem('collectorRatings', JSON.stringify([ratingData, ...existingRatings]));

        // Update collector's overall rating
        updateCollectorRating(ratingData);

        // Show success notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2';
        notification.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Thank you for your feedback!</span>
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 3000);
    };

    // Update collector's overall rating
    const updateCollectorRating = (ratingData) => {
        const collectors = JSON.parse(localStorage.getItem('collectors') || '[]');
        const updatedCollectors = collectors.map(collector => {
            if (collector.id === ratingData.collectorId) {
                const existingRatings = collector.ratings || [];
                const newRatings = [...existingRatings, ratingData];
                const averageRating = newRatings.reduce((sum, r) => sum + r.rating, 0) / newRatings.length;
                
                return {
                    ...collector,
                    ratings: newRatings,
                    averageRating: Math.round(averageRating * 10) / 10,
                    totalRatings: newRatings.length
                };
            }
            return collector;
        });
        
        localStorage.setItem('collectors', JSON.stringify(updatedCollectors));
    };

    const removeFromQueue = (itemId) => {
        setRecyclingQueue(prev => prev.filter(item => item.id !== itemId));
        setConfirmDialog({ isOpen: false, itemId: null });
        
        // Show removal notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2';
        notification.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            <span>Removed from recycling queue</span>
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 3000);
    };

    const handleRemoveClick = (itemId) => {
        setConfirmDialog({ isOpen: true, itemId });
    };

    const requestCollection = async () => {
        if (!userProfile.address || !userProfile.phone) {
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2';
            notification.innerHTML = `
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                <span>Please complete your profile (address and phone) before requesting collection.</span>
            `;
            document.body.appendChild(notification);
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 4000);
            return;
        }

        if (recyclingQueue.length === 0) {
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2';
            notification.innerHTML = `
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                <span>Your recycling queue is empty. Add items before requesting collection.</span>
            `;
            document.body.appendChild(notification);
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 4000);
            return;
        }

        setIsRequestingCollection(true);

        // Simulate API call
        setTimeout(() => {
            const collectionRequest = {
                id: Date.now(),
                items: [...recyclingQueue],
                totalEstimatedValue: recyclingQueue.reduce((total, item) => total + parseFloat(item.estimatedValue), 0).toFixed(2),
                userInfo: {
                    name: userProfile.fullName,
                    address: userProfile.address,
                    city: userProfile.city,
                    phone: userProfile.phone
                },
                requestDate: new Date().toISOString(),
                status: 'Pending',
                estimatedCollectionDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
                collectorInfo: null,
                statusHistory: [
                    {
                        status: 'Pending',
                        timestamp: new Date().toISOString(),
                        message: 'Collection request submitted successfully'
                    }
                ]
            };

            // Save to collection history
            const existingRequests = JSON.parse(localStorage.getItem('collectionRequests') || '[]');
            localStorage.setItem('collectionRequests', JSON.stringify([collectionRequest, ...existingRequests]));

            // Clear the recycling queue
            setRecyclingQueue([]);
            setIsRequestingCollection(false);

            // Show success notification
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2';
            notification.innerHTML = `
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Collection request submitted successfully!</span>
            `;
            document.body.appendChild(notification);
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 4000);
        }, 2000);
    };

    const totalEstimatedValue = recyclingQueue.reduce((total, item) => total + parseFloat(item.estimatedValue), 0);

    const getCategoryColor = (category) => {
        const colors = {
            'Paper': 'bg-blue-100 text-blue-800',
            'Glass and Plastic': 'bg-purple-100 text-purple-800',
            'Metal & Steel': 'bg-orange-100 text-orange-800',
            'E-waste': 'bg-red-100 text-red-800',
            'Brass': 'bg-yellow-100 text-yellow-800',
            'Others': 'bg-gray-100 text-gray-800'
        };
        return colors[category] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center space-x-4">
                        <div>
                            <h1 className="text-2xl font-bold">Recycling Queue</h1>
                            <p className="text-emerald-100">
                                {recyclingQueue.length} {recyclingQueue.length === 1 ? 'item' : 'items'} ready for collection
                            </p>
                        </div>
                    </div>
                    {recyclingQueue.length > 0 && (
                        <div className="text-right">
                            <p className="text-emerald-100 text-sm">Total Estimated Value</p>
                            <p className="text-2xl font-bold">Rs. {totalEstimatedValue.toFixed(2)}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Rating Prompt for Completed Collections */}
            {needsRating && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Collection Completed!</h3>
                                <p className="text-sm text-gray-600">How was your experience with {latestRequest.collectorInfo?.name}?</p>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                setCompletedRequest(latestRequest);
                                setIsRatingModalOpen(true);
                            }}
                            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors flex items-center space-x-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                            <span>Rate Experience</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Active Request Status */}
            {latestRequest && hasActiveRequest && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Collection Request Status</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2 ${getStatusDisplay(latestRequest.status).color}`}>
                                    {getStatusDisplay(latestRequest.status).icon}
                                    <span>{getStatusDisplay(latestRequest.status).text}</span>
                                </div>
                                <span className="text-sm text-gray-500">
                                    Request #{latestRequest.id}
                                </span>
                            </div>
                            <span className="text-sm text-gray-500">
                                Submitted: {new Date(latestRequest.requestDate).toLocaleDateString()}
                            </span>
                        </div>

                        {/* Collector Information (if accepted) */}
                        {latestRequest.status === 'Accepted' && latestRequest.collectorInfo && (
                            <div className="bg-white rounded-lg p-4 mb-4">
                                <h4 className="font-medium text-gray-900 mb-2">Assigned Collector</h4>
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{latestRequest.collectorInfo.name}</p>
                                        <p className="text-sm text-gray-600">Phone: {latestRequest.collectorInfo.phone}</p>
                                        <p className="text-sm text-gray-600">Rating: ⭐ {latestRequest.collectorInfo.rating}/5</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Expected Collection Date */}
                        {latestRequest.estimatedCollectionDate && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z"></path>
                                </svg>
                                <span>
                                    Expected Collection: {new Date(latestRequest.estimatedCollectionDate).toLocaleDateString()} at {new Date(latestRequest.estimatedCollectionDate).toLocaleTimeString()}
                                </span>
                            </div>
                        )}

                        {/* Request Summary */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-600">Items:</span>
                                    <span className="ml-2 font-medium">{latestRequest.items.length}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Total Value:</span>
                                    <span className="ml-2 font-medium text-green-600">Rs. {latestRequest.totalEstimatedValue}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {recyclingQueue.length === 0 && !hasActiveRequest ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
                    <div className="text-center">
                        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16l-1 14H5L4 6zM4 6L2 4m18 2l2-2M9 10v4m6-4v4" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Your recycling queue is empty</h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            Browse items and mark them as "Interested in Recycling" to add them here. Then specify quantities and request collection.
                        </p>
                        <button
                            onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-items'))}
                            className="bg-emerald-500 text-white px-8 py-3 rounded-lg hover:bg-emerald-600 transition-colors font-medium"
                        >
                            Browse Recyclable Items
                        </button>
                    </div>
                </div>
            ) : recyclingQueue.length > 0 ? (
                <div className="space-y-6">
                    {/* Items List */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Items in Queue</h2>
                        <div className="space-y-4">
                            {recyclingQueue.map((item) => {
                                const quantityConfig = getQuantityConfig(item.category, item.name);
                                
                                return (
                                    <div key={item.id} className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        <img 
                                            src={item.image} 
                                            alt={item.name}
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900">{item.name}</h3>
                                            <div className="mt-1">
                                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                                                    {item.category}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">Rs. {item.pricePerUnit}/{quantityConfig.unit}</p>
                                        </div>
                                        
                                        {/* Enhanced Quantity Controls */}
                                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                                            <div className="flex flex-col items-center space-y-2">
                                                <label className="text-xs text-gray-600 font-medium">
                                                    Quantity ({quantityConfig.unit})
                                                </label>
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, Math.max(quantityConfig.min, item.quantity - quantityConfig.step))}
                                                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors text-sm font-medium"
                                                        disabled={item.quantity <= quantityConfig.min}
                                                    >
                                                        -
                                                    </button>
                                                    <input
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={(e) => {
                                                            const value = parseFloat(e.target.value);
                                                            if (value >= quantityConfig.min) {
                                                                updateQuantity(item.id, value);
                                                            }
                                                        }}
                                                        className="w-20 text-center border border-gray-300 rounded-lg py-1 text-sm"
                                                        min={quantityConfig.min}
                                                        step={quantityConfig.step}
                                                    />
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + quantityConfig.step)}
                                                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors text-sm font-medium"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                {/* Quick quantity buttons for common amounts */}
                                                <div className="flex space-x-1">
                                                    {quantityConfig.unit === 'kg' ? (
                                                        <>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, 1)}
                                                                className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
                                                            >
                                                                1kg
                                                            </button>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, 5)}
                                                                className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
                                                            >
                                                                5kg
                                                            </button>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, 10)}
                                                                className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
                                                            >
                                                                10kg
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, 5)}
                                                                className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
                                                            >
                                                                5pcs
                                                            </button>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, 10)}
                                                                className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
                                                            >
                                                                10pcs
                                                            </button>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, 20)}
                                                                className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
                                                            >
                                                                20pcs
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="text-center min-w-[100px]">
                                                <p className="font-semibold text-emerald-600 text-lg">Rs. {item.estimatedValue}</p>
                                                <p className="text-xs text-gray-500">estimated value</p>
                                            </div>
                                            
                                            <button
                                                onClick={() => handleRemoveClick(item.id)}
                                                className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition-colors"
                                                title="Remove from queue"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Collection Request Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Request Collection</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-medium text-gray-900 mb-2">Collection Summary</h3>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex justify-between">
                                        <span>Total Items:</span>
                                        <span className="font-medium">{recyclingQueue.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Total Weight/Pieces:</span>
                                        <span className="font-medium">
                                            {recyclingQueue.reduce((total, item) => total + item.quantity, 0)} units
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Estimated Value:</span>
                                        <span className="font-medium text-emerald-600">Rs. {totalEstimatedValue.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Collection Fee:</span>
                                        <span className="font-medium">Free</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900 mb-2">Collection Address</h3>
                                <div className="text-sm text-gray-600">
                                    {userProfile.fullName && <p className="font-medium">{userProfile.fullName}</p>}
                                    {userProfile.address && <p>{userProfile.address}</p>}
                                    {userProfile.city && <p>{userProfile.city}</p>}
                                    {userProfile.phone && <p>Phone: {userProfile.phone}</p>}
                                    {(!userProfile.address || !userProfile.phone) && (
                                        <p className="text-red-500 text-xs mt-2">
                                            Please complete your profile to request collection
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <button
                                onClick={requestCollection}
                                disabled={isRequestingCollection || !userProfile.address || !userProfile.phone}
                                className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                                    isRequestingCollection || !userProfile.address || !userProfile.phone
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-md hover:shadow-lg'
                                }`}
                            >
                                {isRequestingCollection ? (
                                    <>
                                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Requesting Collection...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                                        </svg>
                                        <span>Request Collection</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}

            {/* Rating Modal */}
            <CollectorRatingModal
                isOpen={isRatingModalOpen}
                onClose={() => setIsRatingModalOpen(false)}
                collectionRequest={completedRequest}
                onSubmitRating={handleRatingSubmit}
            />

            {/* Confirm Remove Dialog */}
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                onClose={() => setConfirmDialog({ isOpen: false, itemId: null })}
                onConfirm={() => removeFromQueue(confirmDialog.itemId)}
                title="Remove from Queue"
                message="Are you sure you want to remove this item from your recycling queue?"
            />
        </div>
    );
};

export default RecyclingQueue;
