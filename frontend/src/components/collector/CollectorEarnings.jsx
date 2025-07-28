// components/CollectorEarnings.jsx
import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const CollectorEarnings = () => {
    const [collectionRequests] = useLocalStorage('collectionRequests', []);
    const [selectedPeriod, setSelectedPeriod] = useState('This Month');

    // Calculate earnings data
    const completedRequests = collectionRequests.filter(req => req.status === 'Completed');
    
    const totalEarnings = completedRequests.reduce((sum, req) => 
        sum + parseFloat(req.totalEstimatedValue || 0), 0
    );

    const thisMonthRequests = completedRequests.filter(req => {
        const requestDate = new Date(req.requestDate);
        const now = new Date();
        return requestDate.getMonth() === now.getMonth() && 
               requestDate.getFullYear() === now.getFullYear();
    });

    const thisMonthEarnings = thisMonthRequests.reduce((sum, req) => 
        sum + parseFloat(req.totalEstimatedValue || 0), 0
    );

    const lastMonthRequests = completedRequests.filter(req => {
        const requestDate = new Date(req.requestDate);
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        return requestDate.getMonth() === lastMonth.getMonth() && 
               requestDate.getFullYear() === lastMonth.getFullYear();
    });

    const lastMonthEarnings = lastMonthRequests.reduce((sum, req) => 
        sum + parseFloat(req.totalEstimatedValue || 0), 0
    );

    const averagePerCollection = completedRequests.length > 0 
        ? totalEarnings / completedRequests.length 
        : 0;

    // Calculate category-wise earnings
    const categoryEarnings = {};
    completedRequests.forEach(request => {
        request.items?.forEach(item => {
            const category = item.category || 'Others';
            const itemValue = parseFloat(item.estimatedValue || 0);
            categoryEarnings[category] = (categoryEarnings[category] || 0) + itemValue;
        });
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getFilteredEarnings = () => {
        const now = new Date();
        switch (selectedPeriod) {
            case 'This Week':
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                return completedRequests.filter(req => new Date(req.requestDate) >= weekAgo);
            case 'This Month':
                return thisMonthRequests;
            case 'Last Month':
                return lastMonthRequests;
            case 'This Year':
                return completedRequests.filter(req => {
                    const requestDate = new Date(req.requestDate);
                    return requestDate.getFullYear() === now.getFullYear();
                });
            default:
                return completedRequests;
        }
    };

    const filteredRequests = getFilteredEarnings();
    const periodEarnings = filteredRequests.reduce((sum, req) => 
        sum + parseFloat(req.totalEstimatedValue || 0), 0
    );

    return (
        <div className="max-w-6xl mx-auto my-5 space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
                <h1 className="text-2xl font-bold">Earnings Dashboard</h1>
                <p className="text-emerald-100">Track your collection earnings and performance</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Earnings */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Earnings</p>
                            <p className="text-2xl font-bold text-emerald-600">Rs. {totalEarnings.toFixed(2)}</p>
                        </div>
                        <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* This Month */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">This Month</p>
                            <p className="text-2xl font-bold text-blue-600">Rs. {thisMonthEarnings.toFixed(2)}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z"></path>
                            </svg>
                        </div>
                    </div>
                    <div className="mt-2">
                        <p className="text-xs text-gray-500">
                            {thisMonthRequests.length} collection{thisMonthRequests.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>

                {/* Average per Collection */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Avg per Collection</p>
                            <p className="text-2xl font-bold text-purple-600">Rs. {averagePerCollection.toFixed(2)}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Growth Rate */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Monthly Growth</p>
                            <p className={`text-2xl font-bold ${
                                thisMonthEarnings >= lastMonthEarnings ? 'text-green-600' : 'text-red-600'
                            }`}>
                                {lastMonthEarnings > 0 
                                    ? (((thisMonthEarnings - lastMonthEarnings) / lastMonthEarnings) * 100).toFixed(1)
                                    : 0
                                }%
                            </p>
                        </div>
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            thisMonthEarnings >= lastMonthEarnings ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                            <svg className={`w-6 h-6 ${
                                thisMonthEarnings >= lastMonthEarnings ? 'text-green-600' : 'text-red-600'
                            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={
                                    thisMonthEarnings >= lastMonthEarnings 
                                        ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                        : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                                }></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Earnings Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Category Breakdown */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings by Category</h3>
                    <div className="space-y-3">
                        {Object.entries(categoryEarnings)
                            .sort(([,a], [,b]) => b - a)
                            .map(([category, amount]) => {
                                const percentage = totalEarnings > 0 ? (amount / totalEarnings) * 100 : 0;
                                return (
                                    <div key={category} className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm font-medium text-gray-900">{category}</span>
                                                <span className="text-sm text-gray-600">Rs. {amount.toFixed(2)}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className="bg-emerald-500 h-2 rounded-full" 
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        {Object.keys(categoryEarnings).length === 0 && (
                            <p className="text-gray-500 text-center py-8">No earnings data available</p>
                        )}
                    </div>
                </div>

                {/* Period Filter & Recent Collections */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Collections</h3>
                        <select
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        >
                            <option>This Week</option>
                            <option>This Month</option>
                            <option>Last Month</option>
                            <option>This Year</option>
                            <option>All Time</option>
                        </select>
                    </div>

                    <div className="mb-4 p-3 bg-emerald-50 rounded-lg">
                        <p className="text-sm text-emerald-600">Period Earnings</p>
                        <p className="text-xl font-bold text-emerald-700">Rs. {periodEarnings.toFixed(2)}</p>
                        <p className="text-xs text-emerald-600">{filteredRequests.length} collections</p>
                    </div>

                    <div className="space-y-3 max-h-64 overflow-y-auto">
                        {filteredRequests.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No collections in this period</p>
                        ) : (
                            filteredRequests
                                .sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate))
                                .slice(0, 10)
                                .map((request) => (
                                    <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">
                                                {request.userInfo?.name || 'Anonymous'}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                {request.items?.length || 0} items • {formatDate(request.requestDate)}
                                            </p>
                                        </div>
                                        <p className="text-sm font-medium text-emerald-600">
                                            +Rs. {request.totalEstimatedValue}
                                        </p>
                                    </div>
                                ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollectorEarnings;
