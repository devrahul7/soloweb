import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const UserProfile = () => {
    const [userProfile, setUserProfile] = useLocalStorage('userProfile', {
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        joinDate: new Date().toISOString().split('T')[0]
    });

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(userProfile);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        setUserProfile(formData);
        setIsEditing(false);
        
        // Better success notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2';
        notification.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Profile updated successfully!</span>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 3000);
    };

    const handleCancel = () => {
        setFormData(userProfile);
        setIsEditing(false);
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
                        <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-white border-opacity-30">
                            {getInitials()}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">{userProfile.fullName || 'User Profile'}</h1>
                            <p className="text-green-100">EcoSajha Member</p>
                        </div>
                    </div>
                    
                    {/* Edit/Save/Cancel Buttons - Now more visible */}
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
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Postal Code
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="postalCode"
                                            value={formData.postalCode}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                            placeholder="Enter postal code"
                                        />
                                    ) : (
                                        <p className="text-gray-900 py-3 px-4 bg-gray-50 rounded-lg">
                                            {userProfile.postalCode || 'Not provided'}
                                        </p>
                                    )}
                                </div>
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
