import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { mockTrips } from '../data/mockData';
import { CalendarIcon, MapPinIcon, ClockIcon, ShareIcon } from '@heroicons/react/24/outline';

const PublicTrip = () => {
    const { tripId } = useParams();
    const [trip, setTrip] = useState(null);

    useEffect(() => {
        // In a real app, fetch from API without auth
        // For now, find in mockTrips or localStorage
        const storedTrips = JSON.parse(localStorage.getItem('globeTrotterTrips') || '[]');
        const allTrips = [...mockTrips, ...storedTrips];
        const found = allTrips.find(t => t.id === tripId);
        setTrip(found);
    }, [tripId]);

    if (!trip) return <div className="p-8 text-center">Loading trip...</div>;

    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            {/* Header */}
            <div className="relative h-80 rounded-xl overflow-hidden shadow-xl">
                <img src={trip.coverImage} alt={trip.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8 text-white">
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-5xl font-bold mb-2">{trip.name}</h1>
                            <p className="text-lg text-gray-200 max-w-2xl">{trip.description}</p>
                        </div>
                        <button
                            onClick={handleCopy}
                            className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                        >
                            <ShareIcon className="h-5 w-5 mr-2" />
                            Share
                        </button>
                    </div>
                    <div className="flex items-center mt-6 space-x-6 text-sm font-medium">
                        <div className="flex items-center bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                            <MapPinIcon className="h-4 w-4 mr-2" />
                            {trip.cities?.length || 0} Stops
                        </div>
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Itinerary</h2>
                <div className="relative border-l-2 border-gray-200 ml-3 space-y-12">
                    {trip.cities?.map((city, index) => (
                        <div key={city.id} className="relative pl-8">
                            <div className="absolute -left-2.5 top-0 h-5 w-5 rounded-full border-4 border-white bg-primary"></div>

                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                <div className="flex-grow">
                                    <div className="mb-1 text-sm text-primary font-bold uppercase tracking-wide">
                                        {new Date(city.arrivalDate).toLocaleDateString()} - {new Date(city.departureDate).toLocaleDateString()}
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">{city.cityName}, {city.country}</h3>

                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {city.activities?.map((activity, idx) => (
                                            <div key={idx} className="flex items-start p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                <div className="bg-white p-2 rounded-md shadow-sm mr-3 text-primary">
                                                    <ClockIcon className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900">{activity.name}</h4>
                                                    <p className="text-sm text-gray-500">{activity.type} • {activity.duration}h</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex-shrink-0">
                                    <img src={city.image} alt={city.cityName} className="w-full md:w-48 h-32 object-cover rounded-lg shadow-md" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PublicTrip;
