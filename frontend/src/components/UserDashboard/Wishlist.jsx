import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { recycleItems, getAllItems } from '../../data/recycleItems';
import Modal from '../ui/Model';
import ConfirmDialog from '../ui/ConfirmDialog';

const Wishlist = () => {
    const [wishlistItems, setWishlistItems] = useLocalStorage('wishlistItems', []);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState('Paper');
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, itemId: null });

    const categories = Object.keys(recycleItems);
    const allItems = getAllItems();

    const addToWishlist = (item) => {
        const isAlreadyInWishlist = wishlistItems.some(wishlistItem => wishlistItem.id === item.id);
        
        if (isAlreadyInWishlist) {
            alert('Item is already in your wishlist!');
            return;
        }

        const wishlistItem = {
            ...item,
            addedDate: new Date().toISOString()
        };
        
        setWishlistItems(prev => [wishlistItem, ...prev]);
        alert('Item added to wishlist!');
        setIsAddModalOpen(false);
    };

    const removeFromWishlist = (itemId) => {
        setWishlistItems(prev => prev.filter(item => item.id !== itemId));
        setConfirmDialog({ isOpen: false, itemId: null });
    };

    const handleRemoveClick = (itemId) => {
        setConfirmDialog({ isOpen: true, itemId });
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">My Wishlist</h2>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
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
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Browse Items
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wishlistItems.map((item) => (
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
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                            {item.category}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            Added {new Date(item.addedDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Items Modal */}
            <Modal 
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Add Items to Wishlist"
            >
                <div className="space-y-4">
                    {/* Category Tabs */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                    activeCategory === category
                                        ? 'bg-green-100 text-green-700 border border-green-300'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Items Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                        {recycleItems[activeCategory]?.map((item) => {
                            const isInWishlist = wishlistItems.some(wishlistItem => wishlistItem.id === item.id);
                            return (
                                <div key={item.id} className="border border-gray-200 rounded-lg p-3">
                                    <img 
                                        src={item.image} 
                                        alt={item.name}
                                        className="w-full h-24 object-cover rounded mb-2"
                                    />
                                    <h4 className="font-medium text-gray-900 text-sm mb-1">{item.name}</h4>
                                    <p className="text-green-600 text-sm font-medium mb-2">{item.price}</p>
                                    <button
                                        onClick={() => addToWishlist(item)}
                                        disabled={isInWishlist}
                                        className={`w-full py-1 px-2 rounded text-sm font-medium transition-colors ${
                                            isInWishlist
                                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                : 'bg-green-600 text-white hover:bg-green-700'
                                        }`}
                                    >
                                        {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Modal>

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
