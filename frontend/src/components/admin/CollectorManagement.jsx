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
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                <h1 className="text-2xl font-bold">Collector Management</h1>
                <p className="text-green-100">Manage all registered collectors and their performance</p>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-6">
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                            <input
                                type="text"
                                placeholder="Search collectors by name, email, or phone..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(statusCounts).map(([status, count]) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
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

                {/* Collectors Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 font-medium text-gray-600">Collector</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600">Contact</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600">Performance</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600">Rating</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600">Last Activity</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCollectors.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-8">
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
                                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                    {collector.profileImage ? (
                                                        <img src={collector.profileImage} alt="" className="w-10 h-10 rounded-full object-cover" />
                                                    ) : (
                                                        <span className="text-green-600 font-medium">
                                                            {collector.fullName?.charAt(0)?.toUpperCase() || 'C'}
                                                        </span>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{collector.fullName || 'Unknown Collector'}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {collector.isVerified ? '✅ Verified' : '❌ Not Verified'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div>
                                                <p className="text-sm text-gray-900">{collector.email}</p>
                                                <p className="text-sm text-gray-500">{collector.phone || 'No phone'}</p>
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

            {/* Collector Detail Modal */}
            {isModalOpen && selectedCollector && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">Collector Details</h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-3">Personal Information</h4>
                                    <div className="space-y-2 text-sm">
                                        <p><span className="text-gray-600">Name:</span> {selectedCollector.fullName}</p>
                                        <p><span className="text-gray-600">Email:</span> {selectedCollector.email}</p>
                                        <p><span className="text-gray-600">Phone:</span> {selectedCollector.phone || 'N/A'}</p>
                                        <p><span className="text-gray-600">Address:</span> {selectedCollector.address || 'N/A'}</p>
                                        <p><span className="text-gray-600">City:</span> {selectedCollector.city || 'N/A'}</p>
                                        <p><span className="text-gray-600">Experience:</span> {selectedCollector.experience || 'N/A'} years</p>
                                        <p><span className="text-gray-600">Vehicle:</span> {selectedCollector.vehicleType || 'N/A'}</p>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-3">Performance Statistics</h4>
                                    <div className="space-y-2 text-sm">
                                        <p><span className="text-gray-600">Total Requests:</span> {selectedCollector.totalRequests}</p>
                                        <p><span className="text-gray-600">Completed:</span> {selectedCollector.completedRequests}</p>
                                        <p><span className="text-gray-600">Completion Rate:</span> {selectedCollector.totalRequests > 0 ? Math.round((selectedCollector.completedRequests / selectedCollector.totalRequests) * 100) : 0}%</p>
                                        <p><span className="text-gray-600">Total Earnings:</span> Rs. {selectedCollector.totalEarnings.toFixed(2)}</p>
                                        <p><span className="text-gray-600">Average Rating:</span> {selectedCollector.averageRating}/5 ({selectedCollector.totalReviews} reviews)</p>
                                        <p><span className="text-gray-600">Last Activity:</span> {formatDate(selectedCollector.lastActivity)}</p>
                                        <p><span className="text-gray-600">Status:</span> 
                                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                                selectedCollector.status === 'Active' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {selectedCollector.status}
                                            </span>
                                        </p>
                                        <p><span className="text-gray-600">Verification:</span> 
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
                                    <div className="md:col-span-2">
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
                                    <div className="md:col-span-2">
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
