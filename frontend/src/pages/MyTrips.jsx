import React from 'react';
import { Link } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import { useLanguage } from '../context/LanguageContext';
import { CalendarIcon, MapPinIcon, TrashIcon, ShareIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const MyTrips = () => {
    const { trips, deleteTrip, shareToCommuity, unshareFromCommunity } = useTrips();
    const { t } = useLanguage();

    const handleDelete = (e, id) => {
        e.preventDefault(); // Prevent navigation
        if (window.confirm(t('deleteConfirm'))) {
            deleteTrip(id);
        }
    };

    const handleShare = (e, trip) => {
        e.preventDefault();
        e.stopPropagation();

        if (trip.isSharedToCommunity) {
            if (window.confirm(t('removeSharedTrip'))) {
                unshareFromCommunity(trip.id);
            }
        } else {
            const success = shareToCommuity(trip.id);
            if (success) {
                alert(t('tripShared'));
            } else {
                alert(t('tripAlreadyShared'));
            }
        }
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to start of day

    const ongoingTrips = trips.filter(trip => {
        const start = new Date(trip.startDate);
        const end = new Date(trip.endDate);
        return start <= today && end >= today;
    });

    const upcomingTrips = trips.filter(trip => {
        const start = new Date(trip.startDate);
        return start > today;
    });

    const completedTrips = trips.filter(trip => {
        const end = new Date(trip.endDate);
        return end < today;
    });

    const TripCard = ({ trip }) => (
        <Link key={trip.id} to={`/trips/${trip.id}`} className="group block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100 flex flex-col h-full">
            <div className="h-48 bg-gray-200 relative shrink-0">
                <img src={trip.coverImage} alt={trip.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-gray-700">
                    {Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24))} {t('days')}
                </div>
                {trip.isSharedToCommunity && (
                    <div className="absolute top-2 left-2 bg-green-500/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium text-white flex items-center">
                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                        {t('shared')}
                    </div>
                )}
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">{trip.name}</h3>
                    <div className="flex items-center space-x-1">
                        <button
                            onClick={(e) => handleShare(e, trip)}
                            className={`p-1 transition-colors ${trip.isSharedToCommunity ? 'text-green-500 hover:text-green-600' : 'text-gray-400 hover:text-primary'}`}
                            title={trip.isSharedToCommunity ? t('removeFromCommunity') : t('shareToCommunity')}
                        >
                            <ShareIcon className="h-5 w-5" />
                        </button>
                        <button
                            onClick={(e) => handleDelete(e, trip.id)}
                            className="text-gray-400 hover:text-red-500 p-1"
                        >
                            <TrashIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
                <div className="flex items-center text-gray-500 text-sm mt-2">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                </div>
                <p className="text-gray-600 text-sm mt-3 line-clamp-2 flex-grow">{trip.description}</p>
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        {trip.cities?.length || 0} {t('stops')}
                    </div>
                    {trip.savedFromCommunity && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            {t('fromCommunity')}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );

    const TripSection = ({ title, trips, emptyMessage }) => (
        <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                {title}
                <span className="ml-2 text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{trips.length}</span>
            </h2>
            {trips.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trips.map(trip => <TripCard key={trip.id} trip={trip} />)}
                </div>
            ) : (
                <p className="text-gray-500 text-sm italic">{emptyMessage}</p>
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">{t('myTrips')}</h1>
                <Link
                    to="/create-trip"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                    {t('planNewTrip')}
                </Link>
            </div>

            {trips.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                    <MapPinIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">{t('noTripsYet')}</h3>
                    <p className="mt-1 text-sm text-gray-500">{t('getStarted')}</p>
                    <div className="mt-6">
                        <Link
                            to="/create-trip"
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            {t('planNewTrip')}
                        </Link>
                    </div>
                </div>
            ) : (
                <>
                    {ongoingTrips.length > 0 && (
                        <TripSection title="Ongoing Trips" trips={ongoingTrips} emptyMessage="No ongoing trips." />
                    )}
                    <TripSection title="Upcoming Trips" trips={upcomingTrips} emptyMessage="No upcoming trips planned." />
                    <TripSection title="Completed Trips" trips={completedTrips} emptyMessage="No completed trips yet." />
                </>
            )}
        </div>
    );
};

export default MyTrips;
