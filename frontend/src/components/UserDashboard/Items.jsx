import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { recycleItems, getAllItems } from '../../data/recycleItems';

const Items = () => {
    const [wishlistItems, setWishlistItems] = useLocalStorage('wishlistItems', []);
    const [recyclingQueue, setRecyclingQueue] = useLocalStorage('recyclingQueue', []);
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');

    const categories = ['All', ...Object.keys(recycleItems)];
    const allItems = getAllItems();

    // Filter and sort items
    const filteredItems = allItems.filter(item => {
        const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const sortedItems = [...filteredItems].sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'category':
                return a.category.localeCompare(b.category);
            case 'price':
                // Extract numeric value from price string for sorting
                const priceA = parseFloat(a.price.replace(/[^\d.]/g, '')) || 0;
                const priceB = parseFloat(b.price.replace(/[^\d.]/g, '')) || 0;
                return priceB - priceA; // Higher price first
            default:
                return 0;
        }
    });

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

    const removeFromRecyclingQueue = (itemId) => {
        setRecyclingQueue(prev => prev.filter(item => item.id !== itemId));
        
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2';
        notification.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
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

    const isInRecyclingQueue = (itemId) => {
        return recyclingQueue.some(item => item.id === itemId);
    };

    // Keep wishlist functionality for saving items for later
    const addToWishlist = (item) => {
        const isAlreadyInWishlist = wishlistItems.some(wishlistItem => wishlistItem.id === item.id);
        
        if (isAlreadyInWishlist) {
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2';
            notification.innerHTML = `
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                <span>Already saved for later!</span>
            `;
            document.body.appendChild(notification);
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 3000);
            return;
        }

        const wishlistItem = {
            ...item,
            addedDate: new Date().toISOString()
        };
        
        setWishlistItems(prev => [wishlistItem, ...prev]);
        
        const successMessage = document.createElement('div');
        successMessage.className = 'fixed top-4 right-4 bg-pink-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2';
        successMessage.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
            <span>Saved for later recycling!</span>
        `;
        document.body.appendChild(successMessage);
        
        setTimeout(() => {
            if (document.body.contains(successMessage)) {
                document.body.removeChild(successMessage);
            }
        }, 3000);
    };

    const removeFromWishlist = (itemId) => {
        setWishlistItems(prev => prev.filter(item => item.id !== itemId));
    };

    const isInWishlist = (itemId) => {
        return wishlistItems.some(item => item.id === itemId);
    };

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
        <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white mb-6">
                    <h1 className="text-3xl font-bold mb-2">Browse Recyclable Items</h1>
                    <p className="text-green-100 text-lg">
                        Discover recyclable items and add them to your recycling queue or save for later
                    </p>
                </div>

                {/* Search and Filter Controls */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search Bar */}
                        <div className="flex-1">
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search recyclable items..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-full"
                                />
                            </div>
                        </div>

                        {/* Sort Dropdown */}
                        <div className="lg:w-48">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                                <option value="name">Sort by Name</option>
                                <option value="category">Sort by Category</option>
                                <option value="price">Sort by Value</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Tabs */}
            <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                activeCategory === category
                                    ? 'bg-green-500 text-white shadow-lg'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            {category}
                            {category !== 'All' && (
                                <span className="ml-2 text-sm opacity-75">
                                    ({recycleItems[category]?.length || 0})
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results Summary */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <p className="text-gray-600">
                        Showing <span className="font-semibold">{sortedItems.length}</span> recyclable items
                        {searchTerm && (
                            <span> for "<span className="font-semibold">{searchTerm}</span>"</span>
                        )}
                    </p>
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="text-green-600 hover:text-green-700 font-medium"
                        >
                            Clear search
                        </button>
                    )}
                </div>
            </div>

            {/* Items Grid */}
            {sortedItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {sortedItems.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            <div className="relative aspect-w-16 aspect-h-12">
                                <img 
                                    src={item.image} 
                                    alt={item.name}
                                    className="w-full h-48 object-cover"
                                />
                                {/* Save for Later Heart Button */}
                                <button
                                    onClick={() => isInWishlist(item.id) ? removeFromWishlist(item.id) : addToWishlist(item)}
                                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-colors duration-200 ${
                                        isInWishlist(item.id)
                                            ? 'bg-pink-500 text-white hover:bg-pink-600'
                                            : 'bg-white bg-opacity-80 text-gray-600 hover:text-pink-500 hover:bg-white'
                                    }`}
                                    title={isInWishlist(item.id) ? 'Remove from saved items' : 'Save for later'}
                                >
                                    <svg className="w-4 h-4" fill={isInWishlist(item.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-5">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">{item.name}</h3>
                                
                                <div className="mb-3">
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                                        {item.category}
                                    </span>
                                </div>
                                
                                <p className="text-green-600 font-bold text-lg mb-2">
                                    Recycling Value: {item.price}
                                </p>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                                
                                <div className="flex gap-2">
                                    {/* Primary Action Button - Add to Recycling Queue */}
                                    <button
                                        onClick={() => isInRecyclingQueue(item.id) ? removeFromRecyclingQueue(item.id) : addToRecyclingQueue(item)}
                                        className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                                            isInRecyclingQueue(item.id)
                                                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-200'
                                                : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm hover:shadow-md'
                                        }`}
                                    >
                                        {isInRecyclingQueue(item.id) ? (
                                            <>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                                <span>In Queue</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16l-1 14H5L4 6zM4 6L2 4m18 2l2-2M9 10v4m6-4v4" />
                                                </svg>
                                                <span>Add to Queue</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
                    <p className="text-gray-600 mb-6">
                        {searchTerm 
                            ? `No recyclable items match your search "${searchTerm}"`
                            : `No recyclable items available in ${activeCategory === 'All' ? 'any category' : activeCategory}`
                        }
                    </p>
                    <div className="flex gap-3 justify-center">
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                            >
                                Clear Search
                            </button>
                        )}
                        <button
                            onClick={() => setActiveCategory('All')}
                            className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            View All Items
                        </button>
                    </div>
                </div>
            )}

            {/* Summary Sections */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recycling Queue Summary */}
                {recyclingQueue.length > 0 && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-emerald-900 flex items-center space-x-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16l-1 14H5L4 6zM4 6L2 4m18 2l2-2M9 10v4m6-4v4"></path>
                                    </svg>
                                    <span>Recycling Queue ({recyclingQueue.length})</span>
                                </h3>
                                <p className="text-emerald-700 text-sm">
                                    Items ready for collection request
                                </p>
                            </div>
                            <button 
                                onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-recycling-queue'))}
                                className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors text-sm"
                            >
                                View Queue
                            </button>
                        </div>
                    </div>
                )}

                {/* Saved Items Summary */}
                {wishlistItems.length > 0 && (
                    <div className="bg-pink-50 border border-pink-200 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-pink-900 flex items-center space-x-2">
                                    <svg className="w-5 h-5" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                    </svg>
                                    <span>Saved Items ({wishlistItems.length})</span>
                                </h3>
                                <p className="text-pink-700 text-sm">
                                    Items saved for later consideration
                                </p>
                            </div>
                            <button
                                onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-wishlist'))}
                                className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors text-sm"
                            >
                                View Saved
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Items;
