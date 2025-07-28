import React from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const History = () => {
    const [postedItems] = useLocalStorage('postedItems', []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Posted':
                return 'bg-blue-100 text-blue-800';
            case 'Picked Up':
                return 'bg-green-100 text-green-800';
            case 'Cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Recycling History</h2>
                
                {postedItems.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📋</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No items posted yet</h3>
                        <p className="text-gray-600">Start by posting your first recycling item!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {postedItems.map((item) => (
                            <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                                <div className="flex flex-col md:flex-row md:items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900">{item.itemName}</h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                                                {item.status}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                                            <div>
                                                <span className="font-medium">Category:</span> {item.category}
                                            </div>
                                            <div>
                                                <span className="font-medium">Quantity:</span> {item.quantity}
                                            </div>
                                            <div>
                                                <span className="font-medium">Condition:</span> {item.condition}
                                            </div>
                                            <div>
                                                <span className="font-medium">Posted:</span> {formatDate(item.datePosted)}
                                            </div>
                                        </div>
                                        <div className="mt-2 text-sm text-gray-600">
                                            <span className="font-medium">Location:</span> {item.location}
                                        </div>
                                        {item.description && (
                                            <div className="mt-2 text-sm text-gray-600">
                                                <span className="font-medium">Description:</span> {item.description}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;
