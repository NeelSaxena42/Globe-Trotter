import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTrips } from '../context/TripContext';
import { mockCities } from '../data/mockData';
import { PlusIcon, CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
    const { user } = useAuth();
    const { trips } = useTrips();

    // Get upcoming trips (mock logic: just take the first few)
    const upcomingTrips = trips.slice(0, 3);

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
                        <p className="text-gray-500 mt-1">Ready to plan your next adventure?</p>
                    </div>
                    <Link
                        to="/create-trip"
                        className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        Plan New Trip
                    </Link>
                </div>
            </div>

            {/* Stats / Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
                    <h3 className="text-lg font-semibold opacity-90">Total Trips</h3>
                    <p className="text-3xl font-bold mt-2">{trips.length}</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-6 text-white">
                    <h3 className="text-lg font-semibold opacity-90">Countries Visited</h3>
                    <p className="text-3xl font-bold mt-2">5</p> {/* Mock data */}
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
                    <h3 className="text-lg font-semibold opacity-90">Bucket List</h3>
                    <p className="text-3xl font-bold mt-2">12</p> {/* Mock data */}
                </div>
            </div>

            {/* Recent Trips */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Your Upcoming Trips</h2>
                    <Link to="/trips" className="text-primary hover:text-blue-700 font-medium text-sm">View all</Link>
                </div>
                {upcomingTrips.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {upcomingTrips.map((trip) => (
                            <Link key={trip.id} to={`/trips/${trip.id}`} className="group block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100">
                                <div className="h-48 bg-gray-200 relative">
                                    <img src={trip.coverImage} alt={trip.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-gray-700">
                                        {Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24))} Days
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">{trip.name}</h3>
                                    <div className="flex items-center text-gray-500 text-sm mt-2">
                                        <CalendarIcon className="h-4 w-4 mr-1" />
                                        {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                                    </div>
                                    <p className="text-gray-600 text-sm mt-3 line-clamp-2">{trip.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500">You don't have any upcoming trips.</p>
                        <Link to="/create-trip" className="text-primary font-medium mt-2 inline-block">Start planning now</Link>
                    </div>
                )}
            </div>

            {/* Recommended Destinations */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Popular Destinations</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockCities.map((city) => (
                        <div key={city.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                            <div className="h-40 bg-gray-200 relative">
                                <img src={city.image} alt={city.name} className="w-full h-full object-cover" />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                    <h3 className="text-white font-bold text-lg">{city.name}</h3>
                                    <p className="text-white/80 text-sm">{city.country}</p>
                                </div>
                            </div>
                            <div className="p-4">
                                <p className="text-gray-600 text-sm mb-3">{city.description}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full text-gray-600">Cost: {city.costIndex}</span>
                                    <button className="text-primary hover:text-blue-700 text-sm font-medium">Explore</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
