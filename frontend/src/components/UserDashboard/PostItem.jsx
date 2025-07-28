import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const PostItem = () => {
    const [postedItems, setPostedItems] = useLocalStorage('postedItems', []);
    const [recyclingQueue, setRecyclingQueue] = useLocalStorage('recyclingQueue', []);
    const [collectionRequests, setCollectionRequests] = useLocalStorage('collectionRequests', []);
    const [userProfile] = useLocalStorage('userProfile', {});
    
    const [formData, setFormData] = useState({
        itemName: '',
        category: '',
        description: '',
        quantity: '',
        condition: '',
        location: '',
        contactNumber: '',
        preferredPickupDate: '',
        notes: '',
        estimatedValue: ''
    });

    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const categories = [
        { value: 'Paper', icon: '📄', color: 'bg-blue-50 border-blue-200 text-blue-800' },
        { value: 'Glass and Plastic', icon: '🍶', color: 'bg-purple-50 border-purple-200 text-purple-800' },
        { value: 'Metal & Steel', icon: '🔩', color: 'bg-orange-50 border-orange-200 text-orange-800' },
        { value: 'E-waste', icon: '💻', color: 'bg-red-50 border-red-200 text-red-800' },
        { value: 'Brass', icon: '🥉', color: 'bg-yellow-50 border-yellow-200 text-yellow-800' },
        { value: 'Others', icon: '📦', color: 'bg-gray-50 border-gray-200 text-gray-800' }
    ];
    
    const conditions = [
        { value: 'Excellent', description: 'Like new, minimal wear', color: 'text-green-600' },
        { value: 'Good', description: 'Some wear but fully functional', color: 'text-blue-600' },
        { value: 'Fair', description: 'Noticeable wear but usable', color: 'text-yellow-600' },
        { value: 'Poor', description: 'Heavy wear, may need repair', color: 'text-red-600' }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + selectedImages.length > 5) {
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2';
            notification.innerHTML = `
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                <span>Maximum 5 images allowed</span>
            `;
            document.body.appendChild(notification);
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 3000);
            return;
        }

        const newImages = files.slice(0, 5 - selectedImages.length);
        setSelectedImages(prev => [...prev, ...newImages]);

        // Create preview URLs
        newImages.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreviewUrls(prev => [...prev, e.target.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!userProfile.fullName || !userProfile.address) {
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2';
            notification.innerHTML = `
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                <span>Please complete your profile first</span>
            `;
            document.body.appendChild(notification);
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 4000);
            return;
        }

        setIsSubmitting(true);

        // Create new item for posting
        const newPostedItem = {
            ...formData,
            id: Date.now().toString(),
            datePosted: new Date().toISOString(),
            status: 'Posted',
            images: imagePreviewUrls,
            postedBy: userProfile.fullName,
            userContact: userProfile.phone || formData.contactNumber
        };

        // Add to posted items
        setPostedItems(prev => [newPostedItem, ...prev]);

        // Create recycling queue item
        const recyclingQueueItem = {
            ...newPostedItem,
            quantity: parseFloat(formData.quantity) || 1,
            pricePerUnit: parseFloat(formData.estimatedValue) || 0,
            estimatedValue: (parseFloat(formData.estimatedValue) || 0).toFixed(2),
            addedDate: new Date().toISOString(),
            source: 'posted' // To distinguish from browsed items
        };

        // Add to recycling queue
        setRecyclingQueue(prev => [recyclingQueueItem, ...prev]);

        // Create collection request
        const collectionRequest = {
            id: Date.now(),
            items: [recyclingQueueItem],
            totalEstimatedValue: (parseFloat(formData.estimatedValue) || 0).toFixed(2),
            userInfo: {
                name: userProfile.fullName,
                address: formData.location || userProfile.address,
                city: userProfile.city,
                phone: formData.contactNumber || userProfile.phone
            },
            requestDate: new Date().toISOString(),
            preferredPickupDate: formData.preferredPickupDate,
            status: 'Pending',
            type: 'user_posted',
            estimatedCollectionDate: formData.preferredPickupDate || 
                new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
        };

        // Add to collection requests
        setCollectionRequests(prev => [collectionRequest, ...prev]);

        // Simulate submission delay
        setTimeout(() => {
            setIsSubmitting(false);
            
            // Reset form
            setFormData({
                itemName: '',
                category: '',
                description: '',
                quantity: '',
                condition: '',
                location: '',
                contactNumber: '',
                preferredPickupDate: '',
                notes: '',
                estimatedValue: ''
            });
            setSelectedImages([]);
            setImagePreviewUrls([]);
            
            // Success notification
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2';
            notification.innerHTML = `
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Recycling request submitted successfully!</span>
            `;
            document.body.appendChild(notification);
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 4000);
        }, 2000);
    };

    const selectedCategory = categories.find(cat => cat.value === formData.category);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
                <div className="flex items-center space-x-4">
                    <div>
                        <h1 className="text-2xl font-bold">Post Recycling Item</h1>
                        <p className="text-blue-100">Share items you want to recycle and request collection</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Item Information Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span>Item Information</span>
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Item Name *
                                </label>
                                <input
                                    type="text"
                                    name="itemName"
                                    value={formData.itemName}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="e.g., Old Newspapers, Plastic Bottles"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category *
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.value} value={cat.value}>
                                            {cat.icon} {cat.value}
                                        </option>
                                    ))}
                                </select>
                                {selectedCategory && (
                                    <div className={`mt-2 p-2 rounded-lg border ${selectedCategory.color}`}>
                                        <span className="text-sm font-medium">{selectedCategory.icon} {selectedCategory.value}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                rows="4"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="Describe the item, its current state, and any relevant details..."
                            />
                        </div>
                    </div>

                    {/* Image Upload Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            <span>Item Images</span>
                            <span className="text-sm text-gray-500 font-normal">(Optional, max 5 images)</span>
                        </h3>
                        
                        <div className="space-y-4">
                            {/* Upload Button */}
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-500">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB each)</p>
                                    </div>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        disabled={selectedImages.length >= 5}
                                    />
                                </label>
                            </div>

                            {/* Image Previews */}
                            {imagePreviewUrls.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                    {imagePreviewUrls.map((url, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={url}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Details Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                            </svg>
                            <span>Item Details</span>
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Quantity/Weight *
                                </label>
                                <input
                                    type="text"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="e.g., 5 kg, 10 pieces"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Condition *
                                </label>
                                <select
                                    name="condition"
                                    value={formData.condition}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                >
                                    <option value="">Select Condition</option>
                                    {conditions.map(condition => (
                                        <option key={condition.value} value={condition.value}>
                                            {condition.value}
                                        </option>
                                    ))}
                                </select>
                                {formData.condition && (
                                    <p className={`text-xs mt-1 ${conditions.find(c => c.value === formData.condition)?.color}`}>
                                        {conditions.find(c => c.value === formData.condition)?.description}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Estimated Value (Rs.)
                                </label>
                                <input
                                    type="number"
                                    name="estimatedValue"
                                    value={formData.estimatedValue}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Expected value"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pickup Information Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            <span>Pickup Information</span>
                        </h3>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Pickup Location *
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder={userProfile.address || "Enter your address or area"}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Contact Number *
                                    </label>
                                    <input
                                        type="tel"
                                        name="contactNumber"
                                        value={formData.contactNumber}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder={userProfile.phone || "Your phone number"}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Preferred Pickup Date
                                    </label>
                                    <input
                                        type="date"
                                        name="preferredPickupDate"
                                        value={formData.preferredPickupDate}
                                        onChange={handleInputChange}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Additional Notes
                                </label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Any special instructions for pickup, access details, or additional information..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6 border-t border-gray-200">
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`px-8 py-4 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                                    isSubmitting
                                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                                }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Submitting Request...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                                        </svg>
                                        <span>Submit Recycling Request</span>
                                    </>
                                )}
                            </button>
                        </div>
                        <p className="text-sm text-gray-500 mt-3 text-right">
                            Your request will be added to the recycling queue and sent to collectors
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostItem;
