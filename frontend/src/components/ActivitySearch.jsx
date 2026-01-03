import React, { useState } from 'react';
import { mockActivities } from '../data/mockData';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';

const ActivitySearch = ({ cityId, onAddActivity }) => {
    const [query, setQuery] = useState('');

    // Filter activities by city and query
    const filteredActivities = mockActivities.filter(activity =>
        (activity.cityId === cityId || !cityId) &&
        activity.name.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="space-y-4">
            <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                    type="text"
                    className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md border p-2"
                    placeholder="Search activities..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
                {filteredActivities.map((activity) => (
                    <div key={activity.id} className="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50">
                        <div>
                            <h4 className="font-medium text-gray-900">{activity.name}</h4>
                            <div className="text-sm text-gray-500 flex space-x-2">
                                <span>{activity.type}</span>
                                <span>•</span>
                                <span>${activity.cost}</span>
                                <span>•</span>
                                <span>{activity.duration}h</span>
                            </div>
                        </div>
                        <button
                            onClick={() => onAddActivity(activity)}
                            className="p-2 rounded-full text-primary hover:bg-blue-50"
                        >
                            <PlusIcon className="h-5 w-5" />
                        </button>
                    </div>
                ))}
                {filteredActivities.length === 0 && (
                    <p className="text-center text-gray-500 py-4">No activities found.</p>
                )}
            </div>
        </div>
    );
};

export default ActivitySearch;
