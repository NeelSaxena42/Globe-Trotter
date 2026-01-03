import React, { useState } from 'react';
import { mockActivities } from '../data/mockData';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';

const ActivitySearch = ({ cityId, onAddActivity }) => {
    const [query, setQuery] = useState('');
    const [sortBy, setSortBy] = useState('name'); // name, price_asc, price_desc, duration
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterPriceRange, setFilterPriceRange] = useState('all'); // all, under_50, 50_100, over_100
    const [groupBy, setGroupBy] = useState('none'); // none, type

    // Get unique categories for filter
    const categories = ['all', ...new Set(mockActivities.map(a => a.type))];

    // Process activities
    const getProcessedActivities = () => {
        let result = mockActivities.filter(activity =>
            (activity.cityId === cityId || !cityId) &&
            activity.name.toLowerCase().includes(query.toLowerCase())
        );

        // Filter by Category
        if (filterCategory !== 'all') {
            result = result.filter(a => a.type === filterCategory);
        }

        // Filter by Price Range
        if (filterPriceRange !== 'all') {
            result = result.filter(a => {
                if (filterPriceRange === 'under_50') return a.cost < 50;
                if (filterPriceRange === '50_100') return a.cost >= 50 && a.cost <= 100;
                if (filterPriceRange === 'over_100') return a.cost > 100;
                return true;
            });
        }

        // Sort
        result.sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'price_asc') return a.cost - b.cost;
            if (sortBy === 'price_desc') return b.cost - a.cost;
            if (sortBy === 'duration') return a.duration - b.duration;
            return 0;
        });

        return result;
    };

    const processedActivities = getProcessedActivities();

    // Grouping Logic
    const groupedActivities = groupBy === 'type'
        ? processedActivities.reduce((acc, activity) => {
            const key = activity.type;
            if (!acc[key]) acc[key] = [];
            acc[key].push(activity);
            return acc;
        }, {})
        : { 'All Activities': processedActivities };

    return (
        <div className="space-y-4">
            {/* Search Bar */}
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

            {/* Controls: Sort, Filter, Group */}
            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                {/* Sort By */}
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-xs border-gray-300 rounded focus:ring-primary focus:border-primary p-1.5"
                >
                    <option value="name">Sort by Name</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="duration">Duration</option>
                </select>

                {/* Filter Category */}
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="text-xs border-gray-300 rounded focus:ring-primary focus:border-primary p-1.5"
                >
                    <option value="all">All Categories</option>
                    {categories.filter(c => c !== 'all').map(c => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>

                {/* Filter Price */}
                <select
                    value={filterPriceRange}
                    onChange={(e) => setFilterPriceRange(e.target.value)}
                    className="text-xs border-gray-300 rounded focus:ring-primary focus:border-primary p-1.5"
                >
                    <option value="all">Any Price</option>
                    <option value="under_50">Under $50</option>
                    <option value="50_100">$50 - $100</option>
                    <option value="over_100">Over $100</option>
                </select>

                {/* Group By */}
                <select
                    value={groupBy}
                    onChange={(e) => setGroupBy(e.target.value)}
                    className="text-xs border-gray-300 rounded focus:ring-primary focus:border-primary p-1.5"
                >
                    <option value="none">No Grouping</option>
                    <option value="type">Group by Category</option>
                </select>
            </div>

            {/* Results List */}
            <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
                {Object.entries(groupedActivities).map(([groupName, activities]) => (
                    <div key={groupName}>
                        {groupBy !== 'none' && activities.length > 0 && (
                            <h5 className="font-bold text-gray-700 mb-2 sticky top-0 bg-white py-1 z-10 border-b">{groupName}</h5>
                        )}
                        <div className="space-y-3">
                            {activities.map((activity) => (
                                <div key={activity.id} className="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                    <div>
                                        <h4 className="font-medium text-gray-900">{activity.name}</h4>
                                        <div className="text-sm text-gray-500 flex space-x-2 items-center mt-1">
                                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">{activity.type}</span>
                                            <span>•</span>
                                            <span className="font-medium text-gray-700">${activity.cost}</span>
                                            <span>•</span>
                                            <span>{activity.duration}h</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onAddActivity(activity)}
                                        className="p-2 rounded-full text-primary hover:bg-blue-100 transition-colors"
                                        title="Add to Itinerary"
                                    >
                                        <PlusIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {processedActivities.length === 0 && (
                    <p className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg border border-dashed">
                        No activities match your filters.
                    </p>
                )}
            </div>
        </div>
    );
};

export default ActivitySearch;
