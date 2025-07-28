// components/admin/RequestHistory.jsx
import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const RequestHistory = () => {
    const [collectionRequests] = useLocalStorage('collectionRequests', []);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Filter requests
    const filteredRequests = collectionRequests.filter(request => {
        const matchesSearch = 
            request.userInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.id.toString().includes(searchTerm) ||
            request.userInfo?.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || request.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // Sort by date (most recent first)
    const sortedRequests = [...filteredRequests].sort((a, b) => 
        new Date(b.requestDate) - new Date(a.requestDate)
    );

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'Accepted':
                return 'bg-blue-100 text-blue-800';
            case 'In Progress':
                return 'bg-purple-100 text-purple-800';
            case 'Completed':
                return 'bg-green-100 text-green-800';
            case 'Rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const statusCounts = {
        All: collectionRequests.length,
        Pending: collectionRequests.filter(r => r.status === 'Pending').length,
        Accepted: collectionRequests.filter(r => r.status === 'Accepted').length,
        'In Progress': collectionRequests.filter(r => r.status === 'In Progress').length,
        Completed: collectionRequests.filter(r => r.status === 'Completed').length,
        Rejected: collectionRequests.filter(r => r.status === 'Rejected').length,
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 sm:p-6 text-white">
                <h1 className="text-xl sm:text-2xl font-bold">Request History</h1>
                <p className="text-purple-100 text-sm sm:text-base mt-1">Monitor all collection requests and their status</p>
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
                                placeholder="Search by user, email, or request ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
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
                                        ? 'bg-purple-500 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {status.replace('_', ' ')} ({count})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Mobile Card View (< md) */}
                <div className="block md:hidden space-y-4">
                    {sortedRequests.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-500">
                                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                                </svg>
                                <p className="text-sm">No requests found</p>
                            </div>
                        </div>
                    ) : (
                        sortedRequests.map((request) => (
                            <div key={request.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                {/* Request Header */}
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-2">
                                        <span className="font-mono text-sm font-medium">#{request.id}</span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                            {request.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500">{formatDate(request.requestDate)}</p>
                                </div>

                                {/* User Info */}
                                <div className="mb-3">
                                    <p className="font-medium text-gray-900 text-sm truncate">{request.userInfo?.name || 'Unknown'}</p>
                                    <p className="text-xs text-gray-500 truncate">{request.userInfo?.email || 'N/A'}</p>
                                </div>

                                {/* Request Details */}
                                <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                                    <div>
                                        <p className="text-gray-600">Items</p>
                                        <p className="font-medium">{request.items?.length || 0} items</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Value</p>
                                        <p className="font-medium text-green-600">Rs. {request.totalEstimatedValue}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-gray-600">Collector</p>
                                        {request.collectorInfo ? (
                                            <div>
                                                <p className="font-medium text-sm">{request.collectorInfo.name}</p>
                                                <p className="text-xs text-gray-500">⭐ {request.collectorInfo.rating}/5</p>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500">Not assigned</p>
                                        )}
                                    </div>
                                </div>

                                {/* Action Button */}
                                <button
                                    onClick={() => {
                                        setSelectedRequest(request);
                                        setIsModalOpen(true);
                                    }}
                                    className="w-full text-purple-600 hover:text-purple-800 text-sm font-medium px-3 py-2 bg-purple-50 rounded-lg transition-colors"
                                >
                                    View Details
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Desktop Table View (md+) */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Request ID</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">User</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Items</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Value</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Date</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Status</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Collector</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedRequests.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="text-center py-12">
                                        <div className="text-gray-500">
                                            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                                            </svg>
                                            No requests found
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                sortedRequests.map((request) => (
                                    <tr key={request.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4">
                                            <span className="font-mono text-sm">#{request.id}</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="min-w-0">
                                                <p className="font-medium text-gray-900 text-sm truncate">{request.userInfo?.name || 'Unknown'}</p>
                                                <p className="text-sm text-gray-500 truncate">{request.userInfo?.email || 'N/A'}</p>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className="text-sm text-gray-900">{request.items?.length || 0} items</p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className="text-sm font-medium text-green-600">Rs. {request.totalEstimatedValue}</p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className="text-sm text-gray-600">{formatDate(request.requestDate)}</p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                                {request.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            {request.collectorInfo ? (
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">{request.collectorInfo.name}</p>
                                                    <p className="text-sm text-gray-500">⭐ {request.collectorInfo.rating}/5</p>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-500">Not assigned</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">
                                            <button
                                                onClick={() => {
                                                    setSelectedRequest(request);
                                                    setIsModalOpen(true);
                                                }}
                                                className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Request Detail Modal - Enhanced Responsive */}
            {isModalOpen && selectedRequest && (
                <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="p-4 sm:p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Request Details - #{selectedRequest.id}
                                </h3>
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
                                {/* User Information */}
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-3">User Information</h4>
                                    <div className="space-y-2 text-sm">
                                        <p><span className="text-gray-600 font-medium">Name:</span> {selectedRequest.userInfo?.name}</p>
                                        <p><span className="text-gray-600 font-medium">Email:</span> <span className="break-all">{selectedRequest.userInfo?.email}</span></p>
                                        <p><span className="text-gray-600 font-medium">Phone:</span> {selectedRequest.userInfo?.phone}</p>
                                        <p><span className="text-gray-600 font-medium">Address:</span> {selectedRequest.userInfo?.address}</p>
                                    </div>
                                </div>

                                {/* Request Information */}
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-3">Request Information</h4>
                                    <div className="space-y-2 text-sm">
                                        <p><span className="text-gray-600 font-medium">Status:</span> 
                                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedRequest.status)}`}>
                                                {selectedRequest.status}
                                            </span>
                                        </p>
                                        <p><span className="text-gray-600 font-medium">Total Value:</span> Rs. {selectedRequest.totalEstimatedValue}</p>
                                        <p><span className="text-gray-600 font-medium">Request Date:</span> {formatDate(selectedRequest.requestDate)}</p>
                                        {selectedRequest.estimatedCollectionDate && (
                                            <p><span className="text-gray-600 font-medium">Collection Date:</span> {formatDate(selectedRequest.estimatedCollectionDate)}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Items List */}
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-3">Items ({selectedRequest.items?.length || 0})</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {selectedRequest.items?.map((item, index) => (
                                            <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                                <p className="font-medium text-gray-900">{item.name}</p>
                                                <p className="text-sm text-gray-600">Category: {item.category}</p>
                                                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                                <p className="text-sm text-green-600">Value: Rs. {item.estimatedValue}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Collector Information */}
                                {selectedRequest.collectorInfo && (
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-3">Collector Information</h4>
                                        <div className="p-4 bg-green-50 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                                    </svg>
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-gray-900">{selectedRequest.collectorInfo.name}</p>
                                                    <p className="text-sm text-gray-600 break-all">{selectedRequest.collectorInfo.phone} • ⭐ {selectedRequest.collectorInfo.rating}/5</p>
                                                </div>
                                            </div>
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

export default RequestHistory;
