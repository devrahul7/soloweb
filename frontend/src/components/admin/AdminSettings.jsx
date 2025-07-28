// components/admin/AdminSettings.jsx
import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const AdminSettings = () => {
    const [systemSettings, setSystemSettings] = useLocalStorage('systemSettings', {
        platform: {
            platformName: 'EcoSajha',
            platformDescription: 'Sustainable Recycling Platform',
            maintenanceMode: false,
            allowNewRegistrations: true
        },
        notifications: {
            emailNotifications: true,
            smsNotifications: false,
            pushNotifications: true,
            adminAlerts: true
        },
        security: {
            passwordMinLength: 8,
            requireSpecialChars: true,
            sessionTimeout: 30,
            maxLoginAttempts: 5
        },
        features: {
            userRatings: true,
            collectorVerification: true,
            autoRequestAssignment: false,
            dataExport: true
        }
    });

    const [activeTab, setActiveTab] = useState('platform');

    const updateSetting = (category, setting, value) => {
        setSystemSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [setting]: value
            }
        }));
        
        // Show success notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2';
        notification.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Setting updated successfully!</span>
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 3000);
    };

    const tabs = [
        { id: 'platform', label: 'Platform', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 3h1m4 0h1m-5.4 16L9 10l-1.4-3.6L6 3l1.4 3.6 1.4 3.6L10 14l-1.4 3.6L7 21z' },
        { id: 'notifications', label: 'Notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
        { id: 'security', label: 'Security', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
        { id: 'features', label: 'Features', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl p-6 text-white">
                <h1 className="text-2xl font-bold">System Settings</h1>
                <p className="text-gray-300">Configure platform settings and preferences</p>
            </div>

            {/* Settings Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                    activeTab === tab.id
                                        ? 'border-gray-700 text-gray-700'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <div className="flex items-center space-x-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon}></path>
                                    </svg>
                                    <span>{tab.label}</span>
                                </div>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {/* Platform Settings Tab */}
                    {activeTab === 'platform' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Configuration</h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Platform Name</label>
                                    <input
                                        type="text"
                                        value={systemSettings.platform.platformName}
                                        onChange={(e) => updateSetting('platform', 'platformName', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Platform Description</label>
                                    <textarea
                                        value={systemSettings.platform.platformDescription}
                                        onChange={(e) => updateSetting('platform', 'platformDescription', e.target.value)}
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                                    />
                                </div>

                                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                    <div>
                                        <h4 className="font-medium text-gray-900">Maintenance Mode</h4>
                                        <p className="text-sm text-gray-600">Temporarily disable platform access for maintenance</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={systemSettings.platform.maintenanceMode}
                                            onChange={(e) => updateSetting('platform', 'maintenanceMode', e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                                    <div>
                                        <h4 className="font-medium text-gray-900">Allow New Registrations</h4>
                                        <p className="text-sm text-gray-600">Allow new users to register on the platform</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={systemSettings.platform.allowNewRegistrations}
                                            onChange={(e) => updateSetting('platform', 'allowNewRegistrations', e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notifications Settings Tab */}
                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
                            
                            <div className="space-y-4">
                                {Object.entries({
                                    emailNotifications: 'Email Notifications',
                                    smsNotifications: 'SMS Notifications',
                                    pushNotifications: 'Push Notifications',
                                    adminAlerts: 'Admin Alerts'
                                }).map(([key, label]) => (
                                    <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <h4 className="font-medium text-gray-900">{label}</h4>
                                            <p className="text-sm text-gray-600">
                                                {key === 'emailNotifications' && 'Send notifications via email'}
                                                {key === 'smsNotifications' && 'Send notifications via SMS'}
                                                {key === 'pushNotifications' && 'Send push notifications to devices'}
                                                {key === 'adminAlerts' && 'Receive system alerts and warnings'}
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={systemSettings.notifications[key]}
                                                onChange={(e) => updateSetting('notifications', key, e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Security Settings Tab */}
                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Security Configuration</h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Password Minimum Length</label>
                                    <input
                                        type="number"
                                        value={systemSettings.security.passwordMinLength}
                                        onChange={(e) => updateSetting('security', 'passwordMinLength', parseInt(e.target.value))}
                                        min="6"
                                        max="20"
                                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                                    />
                                </div>

                                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <div>
                                        <h4 className="font-medium text-gray-900">Require Special Characters</h4>
                                        <p className="text-sm text-gray-600">Require special characters in passwords</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={systemSettings.security.requireSpecialChars}
                                            onChange={(e) => updateSetting('security', 'requireSpecialChars', e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                                    <input
                                        type="number"
                                        value={systemSettings.security.sessionTimeout}
                                        onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                                        min="5"
                                        max="120"
                                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Login Attempts</label>
                                    <input
                                        type="number"
                                        value={systemSettings.security.maxLoginAttempts}
                                        onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
                                        min="3"
                                        max="10"
                                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Features Settings Tab */}
                    {activeTab === 'features' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Features</h3>
                            
                            <div className="space-y-4">
                                {Object.entries({
                                    userRatings: 'User Ratings System',
                                    collectorVerification: 'Collector Verification',
                                    autoRequestAssignment: 'Automatic Request Assignment',
                                    dataExport: 'Data Export Feature'
                                }).map(([key, label]) => (
                                    <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <h4 className="font-medium text-gray-900">{label}</h4>
                                            <p className="text-sm text-gray-600">
                                                {key === 'userRatings' && 'Allow users to rate collectors'}
                                                {key === 'collectorVerification' && 'Enable collector verification process'}
                                                {key === 'autoRequestAssignment' && 'Automatically assign requests to collectors'}
                                                {key === 'dataExport' && 'Allow data export functionality'}
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={systemSettings.features[key]}
                                                onChange={(e) => updateSetting('features', key, e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
