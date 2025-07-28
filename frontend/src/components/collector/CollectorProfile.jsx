// components/CollectorProfile.jsx
import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const CollectorProfile = () => {
    const [collectorProfile, setCollectorProfile] = useLocalStorage('collectorProfile', {
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        experience: '',
        vehicleType: '',
        workingHours: '',
        serviceAreas: [],
        profileImage: '',
        bio: '',
        specializations: []
    });

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(collectorProfile);
    const [collectorRatings] = useLocalStorage('collectorRatings', []);
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleArrayInputChange = (e, field) => {
        const { value } = e.target;
        const arrayValue = value.split(',').map(item => item.trim()).filter(item => item);
        setFormData(prev => ({
            ...prev,
            [field]: arrayValue
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFormData(prev => ({
                    ...prev,
                    profileImage: e.target.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        setCollectorProfile(formData);
        setIsEditing(false);
        
        // Show success notification
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
        setFormData(collectorProfile);
        setIsEditing(false);
    };

    const averageRating = collectorRatings.length > 0 
        ? (collectorRatings.reduce((sum, rating) => sum + rating.rating, 0) / collectorRatings.length).toFixed(1)
        : 0;

    const getUserInitials = () => {
        if (collectorProfile.fullName) {
            const names = collectorProfile.fullName.trim().split(' ');
            if (names.length >= 2) {
                return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
            }
            return names[0].charAt(0).toUpperCase();
        }
        return 'C';
    };

    return (
        <div className="max-w-4xl mx-auto my-5 space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                <h1 className="text-2xl font-bold">My Profile</h1>
                <p className="text-purple-100">Manage your collector profile and information</p>
            </div>

            {/* Profile Overview Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                    {/* Profile Image */}
                    <div className="relative">
                        {collectorProfile.profileImage ? (
                            <img
                                src={collectorProfile.profileImage}
                                alt="Profile"
                                className="w-24 h-24 rounded-full object-cover shadow-lg"
                            />
                        ) : (
                            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                {getUserInitials()}
                            </div>
                        )}
                        {isEditing && (
                            <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>
                        )}
                    </div>

                    {/* Profile Info */}
                    <div className="flex-1 text-center sm:text-left">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {collectorProfile.fullName || 'Collector Name'}
                        </h2>
                        <p className="text-gray-600 mb-2">EcoSajha Verified Collector</p>
                        <div className="flex items-center justify-center sm:justify-start space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                </svg>
                                <span>{averageRating} Rating</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                                <span>{collectorProfile.city || 'Location'}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>{collectorRatings.length} Reviews</span>
                            </div>
                        </div>
                    </div>

                    {/* Edit Button */}
                    <div className="flex space-x-2">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleSave}
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                    <span>Save</span>
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                    <span>Cancel</span>
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                                <span>Edit Profile</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Profile Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            ) : (
                                <p className="text-gray-900">{collectorProfile.fullName || 'Not provided'}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            {isEditing ? (
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            ) : (
                                <p className="text-gray-900">{collectorProfile.email || 'Not provided'}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            ) : (
                                <p className="text-gray-900">{collectorProfile.phone || 'Not provided'}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            {isEditing ? (
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    rows="2"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            ) : (
                                <p className="text-gray-900">{collectorProfile.address || 'Not provided'}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            ) : (
                                <p className="text-gray-900">{collectorProfile.city || 'Not provided'}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                            {isEditing ? (
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleInputChange}
                                    rows="3"
                                    placeholder="Tell customers about yourself..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            ) : (
                                <p className="text-gray-900">{collectorProfile.bio || 'No bio provided'}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Service Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Information</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
                            {isEditing ? (
                                <input
                                    type="number"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleInputChange}
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            ) : (
                                <p className="text-gray-900">{collectorProfile.experience ? `${collectorProfile.experience} years` : 'Not provided'}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                            {isEditing ? (
                                <select
                                    name="vehicleType"
                                    value={formData.vehicleType}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                    <option value="">Select vehicle type</option>
                                    <option value="Motorcycle">Motorcycle</option>
                                    <option value="Van">Van</option>
                                    <option value="Truck">Truck</option>
                                    <option value="Car">Car</option>
                                    <option value="Bicycle">Bicycle</option>
                                </select>
                            ) : (
                                <p className="text-gray-900">{collectorProfile.vehicleType || 'Not provided'}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Working Hours</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="workingHours"
                                    value={formData.workingHours}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 9 AM - 6 PM, Monday to Saturday"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            ) : (
                                <p className="text-gray-900">{collectorProfile.workingHours || 'Not provided'}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Service Areas</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData.serviceAreas.join(', ')}
                                    onChange={(e) => handleArrayInputChange(e, 'serviceAreas')}
                                    placeholder="Enter areas separated by commas"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {collectorProfile.serviceAreas?.length > 0 ? (
                                        collectorProfile.serviceAreas.map((area, index) => (
                                            <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded">
                                                {area}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-gray-900">No service areas specified</p>
                                    )}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Specializations</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData.specializations.join(', ')}
                                    onChange={(e) => handleArrayInputChange(e, 'specializations')}
                                    placeholder="e.g., E-waste, Metal, Paper"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {collectorProfile.specializations?.length > 0 ? (
                                        collectorProfile.specializations.map((spec, index) => (
                                            <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                                                {spec}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-gray-900">No specializations specified</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollectorProfile;
