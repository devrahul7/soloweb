import React, { useState, useRef } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const UserProfile = () => {
    const [userProfile, setUserProfile] = useLocalStorage('userProfile', {
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        joinDate: new Date().toISOString().split('T')[0],
        profileImage: ''
    });

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(userProfile);
    const [imagePreview, setImagePreview] = useState(userProfile.profileImage || '');
    
    // Use useRef for better file input control
    const fileInputRef = useRef(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Enhanced image upload handler
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        
        if (!file) {
            return;
        }

        console.log('File selected:', file.name, file.type, file.size); // Debug log

        // Validate file type
        if (!file.type.startsWith('image/')) {
            showNotification('Please select a valid image file!', 'error');
            resetFileInput();
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showNotification('Image size must be less than 5MB!', 'error');
            resetFileInput();
            return;
        }

        // Create FileReader instance
        const reader = new FileReader();
        
        reader.onload = (event) => {
            const imageDataUrl = event.target.result;
            console.log('Image loaded successfully'); // Debug log
            
            setImagePreview(imageDataUrl);
            setFormData(prev => ({
                ...prev,
                profileImage: imageDataUrl
            }));
            
            showNotification('Image uploaded successfully!', 'success');
        };

        reader.onerror = (error) => {
            console.error('FileReader error:', error);
            showNotification('Error reading the image file!', 'error');
            resetFileInput();
        };

        // Read the file as data URL
        reader.readAsDataURL(file);
    };

    // Helper function to show notifications
    const showNotification = (message, type = 'info') => {
        const notification = document.createElement('div');
        const bgColor = type === 'error' ? 'bg-red-500' : type === 'success' ? 'bg-green-500' : 'bg-blue-500';
        const icon = type === 'error' ? 
            `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>` :
            `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>`;
        
        notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2`;
        notification.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                ${icon}
            </svg>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 3000);
    };

    // Helper function to reset file input
    const resetFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Trigger file input click
    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const removeImage = () => {
        setImagePreview('');
        setFormData(prev => ({
            ...prev,
            profileImage: ''
        }));
        resetFileInput();
        showNotification('Profile picture removed', 'info');
    };

    const handleSave = () => {
        setUserProfile(formData);
        setIsEditing(false);
        showNotification('Profile updated successfully!', 'success');
    };

    const handleCancel = () => {
        setFormData(userProfile);
        setImagePreview(userProfile.profileImage || '');
        setIsEditing(false);
        resetFileInput();
    };

    const getInitials = () => {
        if (formData.fullName) {
            const names = formData.fullName.trim().split(' ');
            if (names.length >= 2) {
                return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
            }
            return names[0].charAt(0).toUpperCase();
        }
        return 'U';
    };

    return (
        <div className="max-w-3xl mx-auto">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            {userProfile.profileImage || imagePreview ? (
                                <img
                                    src={imagePreview || userProfile.profileImage}
                                    alt="Profile"
                                    className="w-20 h-20 rounded-full object-cover border-4 border-white border-opacity-30"
                                />
                            ) : (
                                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-white border-opacity-30">
                                    {getInitials()}
                                </div>
                            )}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">{userProfile.fullName || 'User Profile'}</h1>
                            <p className="text-green-100">EcoSajha Member</p>
                        </div>
                    </div>
                    
                    {/* Edit/Save/Cancel Buttons */}
                    <div className="flex-shrink-0">
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-white text-green-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-all duration-200 flex items-center space-x-2 font-medium shadow-md"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                                <span>Edit Profile</span>
                            </button>
                        ) : (
                            <div className="flex gap-3">
                                <button
                                    onClick={handleSave}
                                    className="bg-white text-green-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-2 font-medium shadow-md"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                    <span>Save</span>
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2 font-medium shadow-md"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                    <span>Cancel</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Profile Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="space-y-8">
                    {/* Profile Picture Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Picture</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                            <div className="flex-shrink-0">
                                {imagePreview || userProfile.profileImage ? (
                                    <img
                                        src={imagePreview || userProfile.profileImage}
                                        alt="Profile Preview"
                                        className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                                    />
                                ) : (
                                    <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center border-4 border-gray-200">
                                        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                        </svg>
                                    </div>
                                )}
                            </div>
                            
                            {isEditing && (
                                <div className="flex-1">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Upload Profile Picture
                                            </label>
                                            
                                            {/* Hidden file input */}
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                multiple={false}
                                            />
                                            
                                            <div className="flex items-center space-x-4">
                                                {/* Custom upload button */}
                                                <button
                                                    type="button"
                                                    onClick={triggerFileInput}
                                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 font-medium cursor-pointer"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                                    </svg>
                                                    <span>Choose Image</span>
                                                </button>
                                                
                                                {(imagePreview || userProfile.profileImage) && (
                                                    <button
                                                        type="button"
                                                        onClick={removeImage}
                                                        className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 font-medium"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                        </svg>
                                                        <span>Remove</span>
                                                    </button>
                                                )}
                                            </div>
                                            
                                            <p className="text-sm text-gray-500 mt-2">
                                                Supported formats: JPG, PNG, GIF. Max size: 5MB
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Enter your full name"
                                    />
                                ) : (
                                    <p className="text-gray-900 py-3 px-4 bg-gray-50 rounded-lg">
                                        {userProfile.fullName || 'Not provided'}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Enter your email"
                                    />
                                ) : (
                                    <p className="text-gray-900 py-3 px-4 bg-gray-50 rounded-lg">
                                        {userProfile.email || 'Not provided'}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Enter your phone number"
                                    />
                                ) : (
                                    <p className="text-gray-900 py-3 px-4 bg-gray-50 rounded-lg">
                                        {userProfile.phone || 'Not provided'}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    City
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Enter your city"
                                    />
                                ) : (
                                    <p className="text-gray-900 py-3 px-4 bg-gray-50 rounded-lg">
                                        {userProfile.city || 'Not provided'}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Address Information */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Address Information</h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Address
                                </label>
                                {isEditing ? (
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Enter your full address"
                                    />
                                ) : (
                                    <p className="text-gray-900 py-3 px-4 bg-gray-50 rounded-lg">
                                        {userProfile.address || 'Not provided'}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  
                            </div>
                        </div>
                    </div>

                    {/* Account Information */}
                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                            <div className="flex items-center space-x-2 text-green-800">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z"></path>
                                </svg>
                                <p className="font-medium">
                                    Member Since: {new Date(userProfile.joinDate).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
