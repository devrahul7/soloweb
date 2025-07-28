// components/admin/UserManagement.jsx
import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const UserManagement = () => {
    const [userProfiles, setUserProfiles] = useLocalStorage('userProfiles', []);
    const [collectionRequests] = useLocalStorage('collectionRequests', []);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Generate user data with collection statistics
    const usersWithStats = userProfiles.map(user => {
        const userRequests = collectionRequests.filter(req => req.userInfo?.email === user.email);
        const completedRequests = userRequests.filter(req => req.status === 'Completed');
        const totalValue = completedRequests.reduce((sum, req) => sum + parseFloat(req.totalEstimatedValue || 0), 0);
        
        return {
            ...user,
            totalRequests: userRequests.length,
            completedRequests: completedRequests.length,
            totalValue: totalValue,
            lastActivity: userRequests.length > 0 
                ? new Date(Math.max(...userRequests.map(req => new Date(req.requestDate)))).toISOString()
                : user.createdAt || new Date().toISOString(),
            status: user.isActive !== false ? 'Active' : 'Inactive'
        };
    });

    // Filter users
    const filteredUsers = usersWithStats.filter(user => {
        const matchesSearch = user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || user.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleUserAction = (userId, action) => {
        const updatedUsers = userProfiles.map(user => {
            if (user.id === userId) {
                switch (action) {
                    case 'activate':
                        return { ...user, isActive: true };
                    case 'deactivate':
                        return { ...user, isActive: false };
                    case 'delete':
                        return null;
                    default:
                        return user;
                }
            }
            return user;
        }).filter(Boolean);

        setUserProfiles(updatedUsers);
        
        // Show notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2';
        notification.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>User ${action}d successfully!</span>
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 3000);
    };

    const statusCounts = {
        All: usersWithStats.length,
        Active: usersWithStats.filter(u => u.status === 'Active').length,
        Inactive: usersWithStats.filter(u => u.status === 'Inactive').length,
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 sm:p-6 text-white">
                <h1 className="text-xl sm:text-2xl font-bold">User Management</h1>
                <p className="text-blue-100 text-sm sm:text-base mt-1">Manage all registered users and their activities</p>
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
                                placeholder="Search users by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
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
                                        ? 'bg-blue-500 text-white shadow-md'
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
                    {filteredUsers.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-500">
                                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                                </svg>
                                <p className="text-sm">No users found</p>
                            </div>
                        </div>
                    ) : (
                        filteredUsers.map((user) => (
                            <div key={user.id || user.email} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                {/* User Info */}
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        {user.profileImage ? (
                                            <img src={user.profileImage} alt="" className="w-12 h-12 rounded-full object-cover" />
                                        ) : (
                                            <span className="text-blue-600 font-medium text-lg">
                                                {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 text-sm truncate">{user.fullName || 'Unknown User'}</p>
                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                                            user.status === 'Active' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {user.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                                    <div>
                                        <p className="text-gray-600">Requests</p>
                                        <p className="font-medium">{user.totalRequests}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Total Value</p>
                                        <p className="font-medium">Rs. {user.totalValue.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Phone</p>
                                        <p className="font-medium text-xs">{user.phone || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Last Activity</p>
                                        <p className="font-medium text-xs">{formatDate(user.lastActivity)}</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => {
                                            setSelectedUser(user);
                                            setIsModalOpen(true);
                                        }}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 bg-blue-50 rounded-lg"
                                    >
                                        View
                                    </button>
                                    {user.status === 'Active' ? (
                                        <button
                                            onClick={() => handleUserAction(user.id, 'deactivate')}
                                            className="text-yellow-600 hover:text-yellow-800 text-sm font-medium px-3 py-1 bg-yellow-50 rounded-lg"
                                        >
                                            Deactivate
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleUserAction(user.id, 'activate')}
                                            className="text-green-600 hover:text-green-800 text-sm font-medium px-3 py-1 bg-green-50 rounded-lg"
                                        >
                                            Activate
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            if (window.confirm('Are you sure you want to delete this user?')) {
                                                handleUserAction(user.id, 'delete');
                                            }
                                        }}
                                        className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 bg-red-50 rounded-lg"
                                    >
                                        Delete
                                    </button>
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
                                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">User</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Contact</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Statistics</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Last Activity</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Status</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-12">
                                        <div className="text-gray-500">
                                            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                                            </svg>
                                            No users found
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id || user.email} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                    {user.profileImage ? (
                                                        <img src={user.profileImage} alt="" className="w-10 h-10 rounded-full object-cover" />
                                                    ) : (
                                                        <span className="text-blue-600 font-medium">
                                                            {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-gray-900 text-sm truncate">{user.fullName || 'Unknown User'}</p>
                                                    <p className="text-sm text-gray-500 truncate">ID: {user.id || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="min-w-0">
                                                <p className="text-sm text-gray-900 truncate">{user.email}</p>
                                                <p className="text-sm text-gray-500 truncate">{user.phone || 'No phone'}</p>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="text-sm">
                                                <p className="text-gray-900">{user.totalRequests} requests</p>
                                                <p className="text-gray-500">Rs. {user.totalValue.toFixed(2)} total</p>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className="text-sm text-gray-600">{formatDate(user.lastActivity)}</p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                user.status === 'Active' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setIsModalOpen(true);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                >
                                                    View
                                                </button>
                                                {user.status === 'Active' ? (
                                                    <button
                                                        onClick={() => handleUserAction(user.id, 'deactivate')}
                                                        className="text-yellow-600 hover:text-yellow-800 text-sm font-medium"
                                                    >
                                                        Deactivate
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleUserAction(user.id, 'activate')}
                                                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                                                    >
                                                        Activate
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm('Are you sure you want to delete this user?')) {
                                                            handleUserAction(user.id, 'delete');
                                                        }
                                                    }}
                                                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* User Detail Modal - Enhanced Responsive */}
            {isModalOpen && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-4 sm:p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">User Details</h3>
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
                                        <p><span className="text-gray-600 font-medium">Name:</span> {selectedUser.fullName}</p>
                                        <p><span className="text-gray-600 font-medium">Email:</span> <span className="break-all">{selectedUser.email}</span></p>
                                        <p><span className="text-gray-600 font-medium">Phone:</span> {selectedUser.phone || 'N/A'}</p>
                                        <p><span className="text-gray-600 font-medium">Address:</span> {selectedUser.address || 'N/A'}</p>
                                        <p><span className="text-gray-600 font-medium">City:</span> {selectedUser.city || 'N/A'}</p>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-3">Activity Statistics</h4>
                                    <div className="space-y-2 text-sm">
                                        <p><span className="text-gray-600 font-medium">Total Requests:</span> {selectedUser.totalRequests}</p>
                                        <p><span className="text-gray-600 font-medium">Completed:</span> {selectedUser.completedRequests}</p>
                                        <p><span className="text-gray-600 font-medium">Total Value:</span> Rs. {selectedUser.totalValue.toFixed(2)}</p>
                                        <p><span className="text-gray-600 font-medium">Last Activity:</span> {formatDate(selectedUser.lastActivity)}</p>
                                        <p><span className="text-gray-600 font-medium">Status:</span> 
                                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                                selectedUser.status === 'Active' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {selectedUser.status}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
