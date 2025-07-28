// components/admin/CollectorManagement.jsx
import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const CollectorManagement = () => {
    const [collectorProfiles, setCollectorProfiles] = useLocalStorage('collectorProfiles', []);
    const [collectionRequests] = useLocalStorage('collectionRequests', []);
    const [collectorRatings] = useLocalStorage('collectorRatings', []);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedCollector, setSelectedCollector] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Generate collector data with statistics
    const collectorsWithStats = collectorProfiles.map(collector => {
        const collectorRequests = collectionRequests.filter(req => 
            req.collectorInfo?.id === collector.id || req.collectorInfo?.name === collector.fullName
        );
        const completedRequests = collectorRequests.filter(req => req.status === 'Completed');
        const totalEarnings = completedRequests.reduce((sum, req) => sum + parseFloat(req.totalEstimatedValue || 0), 0);
        const collectorReviews = collectorRatings.filter(rating => rating.collectorId === collector.id);
        const averageRating = collectorReviews.length > 0 
            ? (collectorReviews.reduce((sum, rating) => sum + rating.rating, 0) / collectorReviews.length).toFixed(1)
            : 0;
        
        return {
            ...collector,
            totalRequests: collectorRequests.length,
            completedRequests: completedRequests.length,
            totalEarnings: totalEarnings,
            averageRating: parseFloat(averageRating),
            totalReviews: collectorReviews.length,
            lastActivity: collectorRequests.length > 0 
                ? new Date(Math.max(...collectorRequests.map(req => new Date(req.requestDate)))).toISOString()
                : collector.createdAt || new Date().toISOString(),
            status: collector.isActive !== false ? 'Active' : 'Inactive'
        };
    });

    // Filter collectors
    const filteredCollectors = collectorsWithStats.filter(collector => {
        const matchesSearch = collector.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            collector.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            collector.phone?.includes(searchTerm);
        const matchesStatus = filterStatus === 'All' || collector.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleCollectorAction = (collectorId, action) => {
        const updatedCollectors = collectorProfiles.map(collector => {
            if (collector.id === collectorId) {
                switch (action) {
                    case 'activate':
                        return { ...collector, isActive: true };
                    case 'deactivate':
                        return { ...collector, isActive: false };
                    case 'verify':
                        return { ...collector, isVerified: true };
                    case 'unverify':
                        return { ...collector, isVerified: false };
                    case 'delete':
                        return null;
                    default:
                        return collector;
                }
            }
            return collector;
        }).filter(Boolean);

        setCollectorProfiles(updatedCollectors);
        
        // Show notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2';
        notification.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Collector ${action}d successfully!</span>
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 3000);
    };

    const statusCounts = {
        All: collectorsWithStats.length,
        Active: collectorsWithStats.filter(c => c.status === 'Active').length,
        Inactive: collectorsWithStats.filter(c => c.status === 'Inactive').length,
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 sm:p-6 text-white">
                <h1 className="text-xl sm:text-2xl font-bold">Collector Management</h1>
                <p className="text-green-100 text-sm sm:text-base mt-1">Manage all registered collectors and their performance</p>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex flex-col space-y-4 mb-6">
                    {/* Search Bar */}
                    <div className="w-full">
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                            <input
                                type="text"
                                placeholder="Search collectors by name, email, or phone..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                            />
                        </div>
                    </div>
                    
                    {/* Filter Buttons */}
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(statusCounts).map(([status, count]) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex-shrink-0 ${
                                    filterStatus === status
                                        ? 'bg-green-500 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {status} ({count})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Mobile Card View (< md) */}
                <div className="block md:hidden space-y-4">
                    {filteredCollectors.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-500">
                                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                </svg>
                                <p className="text-sm">No collectors found</p>
                            </div>
                        </div>
                    ) : (
                        filteredCollectors.map((collector) => (
                            <div key={collector.id || collector.email} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                {/* Collector Info */}
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        {collector.profileImage ? (
                                            <img src={collector.profileImage} alt="" className="w-12 h-12 rounded-full object-cover" />
                                        ) : (
                                            <span className="text-green-600 font-medium text-lg">
                                                {collector.fullName?.charAt(0)?.toUpperCase() || 'C'}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 text-sm truncate">{collector.fullName || 'Unknown Collector'}</p>
                                        <p className="text-xs text-gray-500 truncate">{collector.email}</p>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                                collector.status === 'Active' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {collector.status}
                                            </span>
                                            <span className="text-xs">
                                                {collector.isVerified ? '✅ Verified' : '❌ Not Verified'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                                    <div>
                                        <p className="text-gray-600">Performance</p>
                                        <p className="font-medium">{collector.completedRequests}/{collector.totalRequests}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Earnings</p>
                                        <p className="font-medium text-green-600">Rs. {collector.totalEarnings.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Rating</p>
                                        <div className="flex items-center space-x-1">
                                            <span className="font-medium">{collector.averageRating}</span>
                                            <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                            </svg>
                                            <span className="text-xs text-gray-500">({collector.totalReviews})</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Last Activity</p>
                                        <p className="font-medium text-xs">{formatDate(collector.lastActivity)}</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => {
                                            setSelectedCollector(collector);
                                            setIsModalOpen(true);
                                        }}
                                        className="text-green-600 hover:text-green-800 text-sm font-medium px-3 py-1 bg-green-50 rounded-lg"
                                    >
                                        View
                                    </button>
                                    {collector.status === 'Active' ? (
                                        <button
                                            onClick={() => handleCollectorAction(collector.id, 'deactivate')}
                                            className="text-yellow-600 hover:text-yellow-800 text-sm font-medium px-3 py-1 bg-yellow-50 rounded-lg"
                                        >
                                            Deactivate
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleCollectorAction(collector.id, 'activate')}
                                            className="text-green-600 hover:text-green-800 text-sm font-medium px-3 py-1 bg-green-50 rounded-lg"
                                        >
                                            Activate
                                        </button>
                                    )}
                                    {collector.isVerified ? (
                                        <button
                                            onClick={() => handleCollectorAction(collector.id, 'unverify')}
                                            className="text-orange-600 hover:text-orange-800 text-sm font-medium px-3 py-1 bg-orange-50 rounded-lg"
                                        >
                                            Unverify
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleCollectorAction(collector.id, 'verify')}
                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 bg-blue-50 rounded-lg"
                                        >
                                            Verify
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Desktop Table View (md+) */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Collector</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Contact</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Performance</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Rating</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Last Activity</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Status</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCollectors.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-12">
                                        <div className="text-gray-500">
                                            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                            </svg>
                                            No collectors found
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredCollectors.map((collector) => (
                                    <tr key={collector.id || collector.email} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                    {collector.profileImage ? (
                                                        <img src={collector.profileImage} alt="" className="w-10 h-10 rounded-full object-cover" />
                                                    ) : (
                                                        <span className="text-green-600 font-medium">
                                                            {collector.fullName?.charAt(0)?.toUpperCase() || 'C'}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-gray-900 text-sm truncate">{collector.fullName || 'Unknown Collector'}</p>
                                                    <p className="text-sm text-gray-500 truncate">
                                                        {collector.isVerified ? '✅ Verified' : '❌ Not Verified'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="min-w-0">
                                                <p className="text-sm text-gray-900 truncate">{collector.email}</p>
                                                <p className="text-sm text-gray-500 truncate">{collector.phone || 'No phone'}</p>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="text-sm">
                                                <p className="text-gray-900">{collector.completedRequests}/{collector.totalRequests} completed</p>
                                                <p className="text-green-600">Rs. {collector.totalEarnings.toFixed(2)} earned</p>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center space-x-1">
                                                <span className="text-sm font-medium">{collector.averageRating}</span>
                                                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                                </svg>
                                                <span className="text-xs text-gray-500">({collector.totalReviews})</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className="text-sm text-gray-600">{formatDate(collector.lastActivity)}</p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                collector.status === 'Active' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {collector.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedCollector(collector);
                                                        setIsModalOpen(true);
                                                    }}
                                                    className="text-green-600 hover:text-green-800 text-sm font-medium"
                                                >
                                                    View
                                                </button>
                                                {collector.status === 'Active' ? (
                                                    <button
                                                        onClick={() => handleCollectorAction(collector.id, 'deactivate')}
                                                        className="text-yellow-600 hover:text-yellow-800 text-sm font-medium"
                                                    >
                                                        Deactivate
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleCollectorAction(collector.id, 'activate')}
                                                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                                                    >
                                                        Activate
                                                    </button>
                                                )}
                                                {collector.isVerified ? (
                                                    <button
                                                        onClick={() => handleCollectorAction(collector.id, 'unverify')}
                                                        className="text-orange-600 hover:text-orange-800 text-sm font-medium"
                                                    >
                                                        Unverify
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleCollectorAction(collector.id, 'verify')}
                                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                    >
                                                        Verify
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Collector Detail Modal - Enhanced Responsive */}
            {isModalOpen && selectedCollector && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="p-4 sm:p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">Collector Details</h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 p-1"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="p-4 sm:p-6">
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-3">Personal Information</h4>
                                    <div className="space-y-2 text-sm">
                                        <p><span className="text-gray-600 font-medium">Name:</span> {selectedCollector.fullName}</p>
                                        <p><span className="text-gray-600 font-medium">Email:</span> <span className="break-all">{selectedCollector.email}</span></p>
                                        <p><span className="text-gray-600 font-medium">Phone:</span> {selectedCollector.phone || 'N/A'}</p>
                                        <p><span className="text-gray-600 font-medium">Address:</span> {selectedCollector.address || 'N/A'}</p>
                                        <p><span className="text-gray-600 font-medium">City:</span> {selectedCollector.city || 'N/A'}</p>
                                        <p><span className="text-gray-600 font-medium">Experience:</span> {selectedCollector.experience || 'N/A'} years</p>
                                        <p><span className="text-gray-600 font-medium">Vehicle:</span> {selectedCollector.vehicleType || 'N/A'}</p>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-3">Performance Statistics</h4>
                                    <div className="space-y-2 text-sm">
                                        <p><span className="text-gray-600 font-medium">Total Requests:</span> {selectedCollector.totalRequests}</p>
                                        <p><span className="text-gray-600 font-medium">Completed:</span> {selectedCollector.completedRequests}</p>
                                        <p><span className="text-gray-600 font-medium">Completion Rate:</span> {selectedCollector.totalRequests > 0 ? Math.round((selectedCollector.completedRequests / selectedCollector.totalRequests) * 100) : 0}%</p>
                                        <p><span className="text-gray-600 font-medium">Total Earnings:</span> Rs. {selectedCollector.totalEarnings.toFixed(2)}</p>
                                        <p><span className="text-gray-600 font-medium">Average Rating:</span> {selectedCollector.averageRating}/5 ({selectedCollector.totalReviews} reviews)</p>
                                        <p><span className="text-gray-600 font-medium">Last Activity:</span> {formatDate(selectedCollector.lastActivity)}</p>
                                        <p><span className="text-gray-600 font-medium">Status:</span> 
                                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                                selectedCollector.status === 'Active' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {selectedCollector.status}
                                            </span>
                                        </p>
                                        <p><span className="text-gray-600 font-medium">Verification:</span> 
                                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                                selectedCollector.isVerified 
                                                    ? 'bg-blue-100 text-blue-800' 
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {selectedCollector.isVerified ? 'Verified' : 'Not Verified'}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                {selectedCollector.specializations && selectedCollector.specializations.length > 0 && (
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-3">Specializations</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedCollector.specializations.map((spec, index) => (
                                                <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                                                    {spec}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {selectedCollector.serviceAreas && selectedCollector.serviceAreas.length > 0 && (
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-3">Service Areas</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedCollector.serviceAreas.map((area, index) => (
                                                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                                                    {area}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CollectorManagement;
