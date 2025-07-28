import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import ConfirmDialog from '../ui/ConfirmDialog';

const Wishlist = () => {
    const navigate = useNavigate();
    const [wishlistItems, setWishlistItems] = useLocalStorage('wishlistItems', []);
    const [recyclingQueue, setRecyclingQueue] = useLocalStorage('recyclingQueue', []);
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, itemId: null });

    const removeFromWishlist = (itemId) => {
        setWishlistItems(prev => prev.filter(item => item.id !== itemId));
        setConfirmDialog({ isOpen: false, itemId: null });
    };

    const handleRemoveClick = (itemId) => {
        setConfirmDialog({ isOpen: true, itemId });
    };

    const addToRecyclingQueue = (item) => {
        const isAlreadyInQueue = recyclingQueue.some(queueItem => queueItem.id === item.id);
        
        if (isAlreadyInQueue) {
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2';
            notification.innerHTML = `
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                <span>Already in recycling queue!</span>
            `;
            document.body.appendChild(notification);
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 3000);
            return;
        }

        const queueItem = {
            ...item,
            quantity: 1, // Default quantity
            pricePerUnit: parseFloat(item.price.replace(/[^\d.]/g, '')) || 0,
            estimatedValue: (parseFloat(item.price.replace(/[^\d.]/g, '')) || 0).toFixed(2),
            addedDate: new Date().toISOString()
        };
        
        setRecyclingQueue(prev => [queueItem, ...prev]);
        
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2';
        notification.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Added to recycling queue!</span>
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 3000);
    };

    const navigateToItems = () => {
        navigate('/user/dashboard/items');
    };

    const navigateToRecyclingQueue = () => {
        navigate('/user/dashboard/recycling-queue');
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">My Wishlist</h2>
                    <button
                        onClick={navigateToItems}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                        <span>+</span>
                        Add Items
                    </button>
                </div>

                {wishlistItems.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">❤️</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
                        <p className="text-gray-600 mb-4">Add items you want to recycle later!</p>
                        <button
                            onClick={navigateToItems}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Browse Items
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wishlistItems.map((item) => {
                            const isInQueue = recyclingQueue.some(queueItem => queueItem.id === item.id);
                            
                            return (
                                <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="aspect-w-16 aspect-h-12">
                                        <img 
                                            src={item.image} 
                                            alt={item.name}
                                            className="w-full h-48 object-cover"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                                            <button
                                                onClick={() => handleRemoveClick(item.id)}
                                                className="text-red-500 hover:text-red-700 text-xl"
                                                title="Remove from wishlist"
                                            >
                                                ×
                                            </button>
                                        </div>
                                        <p className="text-green-600 font-medium mb-2">{item.price}</p>
                                        <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                                        
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                {item.category}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                Added {new Date(item.addedDate).toLocaleDateString()}
                                            </span>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => addToRecyclingQueue(item)}
                                                disabled={isInQueue}
                                                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
                                                    isInQueue
                                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                                }`}
                                                title={isInQueue ? 'Already in queue' : 'Add to recycling queue'}
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                                </svg>
                                                {isInQueue ? 'In Queue' : 'Add to Queue'}
                                            </button>
                                            
                                            {isInQueue && (
                                                <button
                                                    onClick={navigateToRecyclingQueue}
                                                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                                    title="View recycling queue"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Confirm Remove Dialog */}
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                onClose={() => setConfirmDialog({ isOpen: false, itemId: null })}
                onConfirm={() => removeFromWishlist(confirmDialog.itemId)}
                title="Remove from Wishlist"
                message="Are you sure you want to remove this item from your wishlist?"
            />
        </div>
    );
};

export default Wishlist;
