import React, { useState, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import { useLanguage } from '../context/LanguageContext';
import {
    CalendarIcon,
    MapPinIcon,
    HeartIcon,
    BookmarkIcon,
    UserCircleIcon,
    MagnifyingGlassIcon,
    GlobeAltIcon,
    FunnelIcon,
    ArrowLeftIcon,
    CurrencyDollarIcon,
    ClockIcon,
    ChevronDownIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';

const Community = () => {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const {
        communityTrips,
        saveFromCommunity,
        unsaveFromCommunity,
        toggleLikeCommunityTrip,
        isTripLiked,
        isTripSaved,
        getCommunityTrip
    } = useTrips();
    const { t } = useLanguage();

    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [filterPlace, setFilterPlace] = useState('');
    const [filterBudget, setFilterBudget] = useState('all');
    const [filterDuration, setFilterDuration] = useState('all');
    const [showFilters, setShowFilters] = useState(false);

    // Get unique places from all community trips
    const allPlaces = useMemo(() => {
        const places = new Set();
        communityTrips.forEach(trip => {
            trip.cities?.forEach(city => {
                if (city.cityName) places.add(city.cityName);
                if (city.country) places.add(city.country);
            });
        });
        return Array.from(places).sort();
    }, [communityTrips]);

    // Calculate trip budget
    const getTripBudget = (trip) => {
        return trip.cities?.reduce((total, city) => {
            return total + (city.activities?.reduce((sum, a) => sum + (parseFloat(a.cost) || 0), 0) || 0);
        }, 0) || 0;
    };

    // Calculate trip duration in days
    const getTripDuration = (trip) => {
        return Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24));
    };

    // Filter and sort trips
    const filteredTrips = useMemo(() => {
        let result = [...communityTrips];

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(trip =>
                trip.name?.toLowerCase().includes(query) ||
                trip.description?.toLowerCase().includes(query) ||
                trip.cities?.some(city =>
                    city.cityName?.toLowerCase().includes(query) ||
                    city.country?.toLowerCase().includes(query)
                )
            );
        }

        // Place filter
        if (filterPlace) {
            result = result.filter(trip =>
                trip.cities?.some(city =>
                    city.cityName === filterPlace || city.country === filterPlace
                )
            );
        }

        // Budget filter
        if (filterBudget !== 'all') {
            result = result.filter(trip => {
                const budget = getTripBudget(trip);
                switch (filterBudget) {
                    case 'budget': return budget < 500;
                    case 'mid': return budget >= 500 && budget < 2000;
                    case 'luxury': return budget >= 2000;
                    default: return true;
                }
            });
        }

        // Duration filter
        if (filterDuration !== 'all') {
            result = result.filter(trip => {
                const duration = getTripDuration(trip);
                switch (filterDuration) {
                    case 'short': return duration <= 3;
                    case 'week': return duration > 3 && duration <= 7;
                    case 'long': return duration > 7;
                    default: return true;
                }
            });
        }

        // Sorting
        switch (sortBy) {
            case 'newest':
                result.sort((a, b) => new Date(b.sharedAt) - new Date(a.sharedAt));
                break;
            case 'oldest':
                result.sort((a, b) => new Date(a.sharedAt) - new Date(b.sharedAt));
                break;
            case 'mostLiked':
                result.sort((a, b) => (b.likes || 0) - (a.likes || 0));
                break;
            case 'mostSaved':
                result.sort((a, b) => (b.saves || 0) - (a.saves || 0));
                break;
            case 'budgetLow':
                result.sort((a, b) => getTripBudget(a) - getTripBudget(b));
                break;
            case 'budgetHigh':
                result.sort((a, b) => getTripBudget(b) - getTripBudget(a));
                break;
            default:
                break;
        }

        return result;
    }, [communityTrips, searchQuery, sortBy, filterPlace, filterBudget, filterDuration]);

    const clearFilters = () => {
        setSearchQuery('');
        setSortBy('newest');
        setFilterPlace('');
        setFilterBudget('all');
        setFilterDuration('all');
    };

    const hasActiveFilters = searchQuery || sortBy !== 'newest' || filterPlace || filterBudget !== 'all' || filterDuration !== 'all';

    const handleToggleLike = (e, tripId) => {
        e.preventDefault();
        e.stopPropagation();
        toggleLikeCommunityTrip(tripId);
    };

    const handleToggleSave = (e, tripId) => {
        e.preventDefault();
        e.stopPropagation();

        if (isTripSaved(tripId)) {
            unsaveFromCommunity(tripId);
        } else {
            saveFromCommunity(tripId);
        }
    };

    // If viewing a specific trip
    if (tripId) {
        const trip = getCommunityTrip(tripId);

        if (!trip) {
            return (
                <div className="text-center py-20">
                    <GlobeAltIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">{t('tripNotFound')}</h3>
                    <p className="mt-1 text-sm text-gray-500">{t('tripMayBeRemoved')}</p>
                    <button
                        onClick={() => navigate('/community')}
                        className="mt-4 inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
                    >
                        <ArrowLeftIcon className="h-4 w-4 mr-2" />
                        {t('backToCommunity')}
                    </button>
                </div>
            );
        }

        const isLiked = isTripLiked(trip.id);
        const isSaved = isTripSaved(trip.id);
        const tripBudget = getTripBudget(trip);

        return (
            <div className="space-y-6">
                {/* Back button and header */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate('/community')}
                        className="flex items-center text-gray-600 hover:text-primary transition-colors"
                    >
                        <ArrowLeftIcon className="h-5 w-5 mr-2" />
                        {t('backToCommunity')}
                    </button>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={(e) => handleToggleLike(e, trip.id)}
                            className={`flex items-center space-x-1 px-3 py-2 rounded-lg border ${isLiked ? 'border-red-200 bg-red-50 text-red-500' : 'border-gray-200 text-gray-500 hover:border-red-200 hover:bg-red-50 hover:text-red-500'} transition-colors`}
                        >
                            {isLiked ? <HeartSolidIcon className="h-5 w-5" /> : <HeartIcon className="h-5 w-5" />}
                            <span className="text-sm font-medium">{trip.likes || 0}</span>
                        </button>
                        <button
                            onClick={(e) => handleToggleSave(e, trip.id)}
                            className={`flex items-center space-x-1 px-3 py-2 rounded-lg border ${isSaved ? 'border-blue-200 bg-blue-50 text-primary' : 'border-gray-200 text-gray-500 hover:border-blue-200 hover:bg-blue-50 hover:text-primary'} transition-colors`}
                        >
                            {isSaved ? <BookmarkSolidIcon className="h-5 w-5" /> : <BookmarkIcon className="h-5 w-5" />}
                            <span className="text-sm font-medium">{isSaved ? t('saved') : t('save')}</span>
                        </button>
                    </div>
                </div>

                {/* Trip Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="h-64 relative">
                        <img src={trip.coverImage} alt={trip.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                            <div className="flex items-center text-sm mb-2">
                                <GlobeAltIcon className="h-4 w-4 mr-1" />
                                <span>{t('sharedBy')} {trip.sharedBy}</span>
                                <span className="mx-2">•</span>
                                <span>{new Date(trip.sharedAt).toLocaleDateString()}</span>
                            </div>
                            <h1 className="text-3xl font-bold">{trip.name}</h1>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="flex flex-wrap gap-4 mb-4">
                            <div className="flex items-center text-gray-600">
                                <CalendarIcon className="h-5 w-5 mr-2" />
                                <span>{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <ClockIcon className="h-5 w-5 mr-2" />
                                <span>{getTripDuration(trip)} {t('days')}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <MapPinIcon className="h-5 w-5 mr-2" />
                                <span>{trip.cities?.length || 0} {t('stops')}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                                <span>~${tripBudget.toFixed(0)} {t('total')}</span>
                            </div>
                        </div>
                        <p className="text-gray-700">{trip.description}</p>
                    </div>
                </div>

                {/* Itinerary */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">{t('itinerary')}</h2>

                    {trip.cities?.length > 0 ? (
                        <div className="space-y-6">
                            {trip.cities.map((city, index) => (
                                <div key={city.id || index} className="relative pl-8 border-l-2 border-primary pb-6 last:pb-0">
                                    <div className="absolute -left-2 top-0 h-4 w-4 rounded-full bg-primary border-4 border-white" />

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-start space-x-4">
                                            {city.image && (
                                                <img src={city.image} alt={city.cityName} className="h-16 w-16 rounded-lg object-cover" />
                                            )}
                                            <div className="flex-grow">
                                                <h3 className="font-bold text-gray-900">{city.cityName}, {city.country}</h3>
                                                <p className="text-sm text-gray-500">
                                                    {city.arrivalDate && new Date(city.arrivalDate).toLocaleDateString()}
                                                    {city.departureDate && ` - ${new Date(city.departureDate).toLocaleDateString()}`}
                                                </p>

                                                {city.activities?.length > 0 && (
                                                    <div className="mt-3 space-y-2">
                                                        {city.activities.map((activity, actIdx) => (
                                                            <div key={actIdx} className="flex items-center justify-between text-sm bg-white p-2 rounded border border-gray-100">
                                                                <div className="flex items-center">
                                                                    <span className="font-medium text-gray-900">{activity.name}</span>
                                                                    {activity.category && (
                                                                        <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                                                                            {activity.category}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                {activity.cost && (
                                                                    <span className="text-gray-600">${parseFloat(activity.cost).toFixed(2)}</span>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">{t('noItineraryDetails')}</p>
                    )}
                </div>
            </div>
        );
    }

    // Community listing view
    const CommunityTripCard = ({ trip }) => {
        const isLiked = isTripLiked(trip.id);
        const isSaved = isTripSaved(trip.id);
        const tripBudget = getTripBudget(trip);

        return (
            <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100 flex flex-col h-full">
                <div className="h-48 bg-gray-200 relative shrink-0">
                    <img
                        src={trip.coverImage}
                        alt={trip.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-gray-700">
                        {getTripDuration(trip)} {t('days')}
                    </div>
                    <div className="absolute top-2 left-2 bg-primary/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium text-white flex items-center">
                        <GlobeAltIcon className="h-3 w-3 mr-1" />
                        {t('shared')}
                    </div>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                    <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                            {trip.name}
                        </h3>
                    </div>

                    <div className="flex items-center text-gray-500 text-xs mt-1">
                        <UserCircleIcon className="h-4 w-4 mr-1" />
                        {t('sharedBy')} {trip.sharedBy}
                    </div>

                    <div className="flex items-center text-gray-500 text-sm mt-2">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                    </div>

                    <p className="text-gray-600 text-sm mt-3 line-clamp-2 flex-grow">
                        {trip.description}
                    </p>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                            <div className="flex items-center">
                                <MapPinIcon className="h-4 w-4 mr-1" />
                                {trip.cities?.length || 0}
                            </div>
                            <div className="flex items-center">
                                <CurrencyDollarIcon className="h-4 w-4 mr-0.5" />
                                {tripBudget > 0 ? `${tripBudget.toFixed(0)}` : '0'}
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <button
                                onClick={(e) => handleToggleLike(e, trip.id)}
                                className={`flex items-center space-x-1 p-1.5 rounded-md ${isLiked ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'} transition-colors`}
                                title={isLiked ? t('unlike') : t('like')}
                            >
                                {isLiked ? <HeartSolidIcon className="h-5 w-5" /> : <HeartIcon className="h-5 w-5" />}
                                <span className="text-xs font-medium">{trip.likes || 0}</span>
                            </button>

                            <button
                                onClick={(e) => handleToggleSave(e, trip.id)}
                                className={`flex items-center space-x-1 p-1.5 rounded-md ${isSaved ? 'text-primary bg-blue-50' : 'text-gray-400 hover:text-primary hover:bg-blue-50'} transition-colors`}
                                title={isSaved ? t('saved') : t('save')}
                            >
                                {isSaved ? <BookmarkSolidIcon className="h-5 w-5" /> : <BookmarkIcon className="h-5 w-5" />}
                                <span className="text-xs font-medium">{trip.saves || 0}</span>
                            </button>
                        </div>
                    </div>

                    <Link
                        to={`/community/${trip.id}`}
                        className="mt-3 w-full text-center py-2 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                    >
                        {t('viewItinerary')}
                    </Link>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                        <GlobeAltIcon className="h-7 w-7 mr-2 text-primary" />
                        {t('communityTrips')}
                    </h1>
                    <p className="text-gray-500 mt-1">{t('discoverTrips')}</p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Search bar */}
                    <div className="relative w-full md:w-64">
                        <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder={t('searchTrips')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
                        />
                    </div>

                    {/* Filter toggle button */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${showFilters || hasActiveFilters ? 'border-primary bg-blue-50 text-primary' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                    >
                        <FunnelIcon className="h-5 w-5 mr-1" />
                        {t('filters')}
                        {hasActiveFilters && (
                            <span className="ml-1 h-2 w-2 bg-primary rounded-full" />
                        )}
                    </button>
                </div>
            </div>

            {/* Filters panel */}
            {showFilters && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex flex-wrap gap-4 items-end">
                        {/* Sort by */}
                        <div className="flex-1 min-w-[150px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('sortBy')}</label>
                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:ring-primary focus:border-primary"
                                >
                                    <option value="newest">{t('newestFirst')}</option>
                                    <option value="oldest">{t('oldestFirst')}</option>
                                    <option value="mostLiked">{t('mostLiked')}</option>
                                    <option value="mostSaved">{t('mostSaved')}</option>
                                    <option value="budgetLow">{t('budgetLowHigh')}</option>
                                    <option value="budgetHigh">{t('budgetHighLow')}</option>
                                </select>
                                <ChevronDownIcon className="h-4 w-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                            </div>
                        </div>

                        {/* Place filter */}
                        <div className="flex-1 min-w-[150px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('destination')}</label>
                            <div className="relative">
                                <select
                                    value={filterPlace}
                                    onChange={(e) => setFilterPlace(e.target.value)}
                                    className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:ring-primary focus:border-primary"
                                >
                                    <option value="">{t('allPlaces')}</option>
                                    {allPlaces.map(place => (
                                        <option key={place} value={place}>{place}</option>
                                    ))}
                                </select>
                                <ChevronDownIcon className="h-4 w-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                            </div>
                        </div>

                        {/* Budget filter */}
                        <div className="flex-1 min-w-[150px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('budget')}</label>
                            <div className="relative">
                                <select
                                    value={filterBudget}
                                    onChange={(e) => setFilterBudget(e.target.value)}
                                    className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:ring-primary focus:border-primary"
                                >
                                    <option value="all">{t('allBudgets')}</option>
                                    <option value="budget">{t('budgetCategory')} (&lt; $500)</option>
                                    <option value="mid">{t('midRange')} ($500 - $2000)</option>
                                    <option value="luxury">{t('luxury')} ($2000+)</option>
                                </select>
                                <ChevronDownIcon className="h-4 w-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                            </div>
                        </div>

                        {/* Duration filter */}
                        <div className="flex-1 min-w-[150px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('duration')}</label>
                            <div className="relative">
                                <select
                                    value={filterDuration}
                                    onChange={(e) => setFilterDuration(e.target.value)}
                                    className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:ring-primary focus:border-primary"
                                >
                                    <option value="all">{t('anyDuration')}</option>
                                    <option value="short">{t('weekend')} (1-3 {t('days')})</option>
                                    <option value="week">{t('week')} (4-7 {t('days')})</option>
                                    <option value="long">{t('extended')} (8+ {t('days')})</option>
                                </select>
                                <ChevronDownIcon className="h-4 w-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                            </div>
                        </div>

                        {/* Clear filters */}
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <XMarkIcon className="h-4 w-4 mr-1" />
                                {t('clearAll')}
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Stats bar */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-primary">{communityTrips.length}</p>
                        <p className="text-xs text-gray-600">{t('sharedTrips')}</p>
                    </div>
                    <div className="h-8 w-px bg-gray-300"></div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-primary">
                            {allPlaces.filter(p => communityTrips.some(trip => trip.cities?.some(c => c.cityName === p))).length}
                        </p>
                        <p className="text-xs text-gray-600">{t('destinations')}</p>
                    </div>
                    {filteredTrips.length !== communityTrips.length && (
                        <>
                            <div className="h-8 w-px bg-gray-300"></div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-primary">{filteredTrips.length}</p>
                                <p className="text-xs text-gray-600">{t('matching')}</p>
                            </div>
                        </>
                    )}
                </div>
                <Link
                    to="/trips"
                    className="text-sm text-primary hover:text-blue-700 font-medium flex items-center"
                >
                    {t('shareYourTrip')} →
                </Link>
            </div>

            {/* Trips grid */}
            {filteredTrips.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                    <GlobeAltIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                        {communityTrips.length === 0 ? t('noTripsShared') : t('noTripsFound')}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {communityTrips.length === 0
                            ? t('beFirstToShare')
                            : t('adjustFilters')}
                    </p>
                    {communityTrips.length === 0 ? (
                        <div className="mt-6">
                            <Link
                                to="/trips"
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700"
                            >
                                {t('goToMyTrips')}
                            </Link>
                        </div>
                    ) : hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            {t('clearFilters')}
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTrips.map(trip => (
                        <CommunityTripCard key={trip.id} trip={trip} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Community;
