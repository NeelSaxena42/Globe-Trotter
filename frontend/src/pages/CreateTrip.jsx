import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useTrips } from '../context/TripContext';
import { useLanguage } from '../context/LanguageContext';
import { MapPinIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { mockCities, mockActivities } from '../data/mockData';

import { placesData } from '../data/placesData';

// Images mapped to places
const placeImages = {
    // Continents
    'europe': 'https://images.unsplash.com/photo-1493707553966-283afac8c358?auto=format&fit=crop&w=1200&q=80',
    'asia': 'https://images.unsplash.com/photo-1535139262971-c51845709a48?auto=format&fit=crop&w=1200&q=80',
    'north-america': 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&w=1200&q=80',
    'south-america': 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1200&q=80',
    'africa': 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=80',
    'oceania': 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=1200&q=80',
    // Countries
    'france': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    'italy': 'https://images.unsplash.com/photo-1515859005217-8a1f08870f59?auto=format&fit=crop&w=1200&q=80',
    'spain': 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=1200&q=80',
    'germany': 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1200&q=80',
    'uk': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
    'greece': 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
    'switzerland': 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
    'netherlands': 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=1200&q=80',
    'portugal': 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1200&q=80',
    'japan': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    'india': 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80',
    'thailand': 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1200&q=80',
    'china': 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1200&q=80',
    'indonesia': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    'vietnam': 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    'singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80',
    'uae': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    'maldives': 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80',
    'usa': 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&w=1200&q=80',
    'canada': 'https://images.unsplash.com/photo-1517935706615-2717063c2225?auto=format&fit=crop&w=1200&q=80',
    'mexico': 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&w=1200&q=80',
    'brazil': 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1200&q=80',
    'argentina': 'https://images.unsplash.com/photo-1612294037637-ec328d0e075e?auto=format&fit=crop&w=1200&q=80',
    'peru': 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1200&q=80',
    'chile': 'https://images.unsplash.com/photo-1478827536114-da961b7f86d2?auto=format&fit=crop&w=1200&q=80',
    'egypt': 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1200&q=80',
    'south-africa': 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=1200&q=80',
    'morocco': 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=1200&q=80',
    'kenya': 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?auto=format&fit=crop&w=1200&q=80',
    'australia': 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=1200&q=80',
    'new-zealand': 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=1200&q=80',
    'fiji': 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?auto=format&fit=crop&w=1200&q=80',
};

// Suggestions based on place
const placeSuggestions = {
    'europe': ['Visit historic castles', 'Try local cuisines', 'Explore museums', 'Take a river cruise'],
    'asia': ['Visit ancient temples', 'Try street food', 'Explore night markets', 'Take a cooking class'],
    'north-america': ['Visit national parks', 'Road trip adventures', 'City exploration', 'Beach getaways'],
    'south-america': ['Explore rainforests', 'Visit ancient ruins', 'Dance salsa', 'Try local coffee'],
    'africa': ['Safari adventures', 'Visit pyramids', 'Desert tours', 'Beach relaxation'],
    'oceania': ['Great Barrier Reef', 'Hiking adventures', 'Beach hopping', 'Wildlife encounters'],
    'france': ['Visit Eiffel Tower', 'Wine tasting in Bordeaux', 'Explore Louvre Museum', 'French Riviera beaches'],
    'italy': ['Visit Colosseum', 'Venice gondola ride', 'Tuscan wine tour', 'Pizza making class'],
    'spain': ['La Sagrada Familia', 'Flamenco show', 'Tapas tour', 'Beach in Barcelona'],
    'germany': ['Visit Brandenburg Gate', 'Oktoberfest experience', 'Castle tours', 'Black Forest hiking'],
    'uk': ['Tower of London', 'Stonehenge visit', 'Scottish Highlands', 'Afternoon tea'],
    'greece': ['Santorini sunset', 'Acropolis tour', 'Island hopping', 'Greek food tour'],
    'japan': ['Visit Mt. Fuji', 'Tokyo exploration', 'Kyoto temples', 'Cherry blossom viewing'],
    'india': ['Taj Mahal visit', 'Kerala backwaters', 'Rajasthan palaces', 'Street food tour'],
    'thailand': ['Bangkok temples', 'Phuket beaches', 'Thai cooking class', 'Elephant sanctuary'],
    'usa': ['Grand Canyon', 'New York City tour', 'Las Vegas experience', 'California road trip'],
    'australia': ['Sydney Opera House', 'Great Barrier Reef', 'Uluru visit', 'Wildlife safari'],
};

const CreateTrip = () => {
    const [selectedPlace, setSelectedPlace] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const { addTrip } = useTrips();
    const { t } = useLanguage();
    const navigate = useNavigate();

    // Get all places (continents + countries)
    const allPlaces = useMemo(() => {
        return [
            ...placesData.continents,
            ...placesData.countries
        ];
    }, []);

    // Get selected place details
    const selectedPlaceDetails = useMemo(() => {
        return allPlaces.find(p => p.id === selectedPlace);
    }, [selectedPlace, allPlaces]);

    // Get image based on selected place
    const coverImage = useMemo(() => {
        if (selectedPlace && placeImages[selectedPlace]) {
            return placeImages[selectedPlace];
        }
        return 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80';
    }, [selectedPlace]);

    // Get suggestions based on selected place
    const suggestions = useMemo(() => {
        if (selectedPlace && placeSuggestions[selectedPlace]) {
            return placeSuggestions[selectedPlace];
        }
        // If country selected, also check continent suggestions
        if (selectedPlaceDetails?.continent && placeSuggestions[selectedPlaceDetails.continent]) {
            return placeSuggestions[selectedPlaceDetails.continent];
        }
        return [];
    }, [selectedPlace, selectedPlaceDetails]);

    // Handle place selection - auto save trip
    const handlePlaceSelect = (placeId) => {
        setSelectedPlace(placeId);
        setShowSuggestions(true);
    };

    // Format dates as YYYY-MM-DD
    const formatDate = (date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };



    // Create trip when clicking on a suggestion or create button
    const handleCreateTrip = () => {
        if (!selectedPlace) return;

        setLoading(true);
        const placeName = selectedPlaceDetails?.name || 'New Trip';

        // 1. Identify target countries based on selection
        let targetCountries = [];
        if (selectedPlaceDetails?.type === 'country') {
            targetCountries = [selectedPlaceDetails.name];
        } else if (selectedPlaceDetails?.type === 'continent') {
            targetCountries = placesData.countries
                .filter(c => c.continent === selectedPlace)
                .map(c => c.name);
        }

        // 2. Find cities in those countries
        const relevantCities = mockCities.filter(city => targetCountries.includes(city.country));

        // 3. Create trip cities with activities
        const tripCities = relevantCities.map((city, index) => {
            // Simple date distribution (all same dates for now, or sequential if we want to be fancy)
            // For MVP, let's just set them to the trip start/end to avoid gaps, 
            // or maybe split the duration. Let's keep it simple: full duration for all (user can adjust)
            // OR: Split duration equally.
            const start = new Date(startDate);
            const end = new Date(endDate);
            const totalDays = (end - start) / (1000 * 60 * 60 * 24);
            const daysPerCity = Math.max(1, Math.floor(totalDays / relevantCities.length));

            const cityStart = new Date(start);
            cityStart.setDate(start.getDate() + (index * daysPerCity));

            const cityEnd = new Date(cityStart);
            cityEnd.setDate(cityStart.getDate() + daysPerCity - 1); // -1 to not overlap too much? or just daysPerCity

            // Clamp to trip end date
            const finalCityEnd = cityEnd > end ? end : cityEnd;
            const finalCityStart = cityStart > end ? end : cityStart;

            // Find activities for this city
            const cityActivities = mockActivities.filter(a => a.cityId === city.id).map(a => ({
                ...a,
                uniqueId: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                date: formatDate(finalCityStart), // Default to arrival date
                category: a.type // Map type to category
            }));

            return {
                id: Date.now().toString() + index,
                cityId: city.id,
                cityName: city.name,
                country: city.country,
                image: city.image,
                arrivalDate: formatDate(finalCityStart),
                departureDate: formatDate(finalCityEnd),
                activities: cityActivities
            };
        });

        const newTrip = {
            name: `Trip to ${placeName}`,
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
            description: `Exploring ${placeName}`,
            coverImage: coverImage,
            place: selectedPlace,
            placeType: selectedPlaceDetails?.type,
            cities: tripCities
        };

        addTrip(newTrip);

        setTimeout(() => {
            setLoading(false);
            navigate('/trips');
        }, 500);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="md:flex md:items-center md:justify-between mb-8">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        {t('planYourTrip')}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        {t('whereToGo')}
                    </p>
                </div>
            </div>

            <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <div className="space-y-6">
                        {/* Place Selection Dropdown */}
                        <div>
                            <label htmlFor="place" className="block text-sm font-medium text-gray-700">
                                <GlobeAltIcon className="inline h-5 w-5 mr-1 text-blue-600" />
                                {t('selectDestination')}
                            </label>
                            <div className="mt-1">
                                <select
                                    id="place"
                                    name="place"
                                    required
                                    value={selectedPlace}
                                    onChange={(e) => handlePlaceSelect(e.target.value)}
                                    className="shadow-sm focus:ring-blue-600 focus:border-blue-600 block w-full sm:text-sm border-gray-300 rounded-md border p-2"
                                >
                                    <option value="">-- {t('selectDestination')} --</option>
                                    <optgroup label={`🌍 ${t('continents')}`}>
                                        {placesData.continents.map((continent) => (
                                            <option key={continent.id} value={continent.id}>
                                                {continent.name}
                                            </option>
                                        ))}
                                    </optgroup>
                                    <optgroup label="🇪🇺 Europe">
                                        {placesData.countries.filter(c => c.continent === 'europe').map((country) => (
                                            <option key={country.id} value={country.id}>
                                                {country.name}
                                            </option>
                                        ))}
                                    </optgroup>
                                    <optgroup label="🌏 Asia">
                                        {placesData.countries.filter(c => c.continent === 'asia').map((country) => (
                                            <option key={country.id} value={country.id}>
                                                {country.name}
                                            </option>
                                        ))}
                                    </optgroup>
                                    <optgroup label="🌎 North America">
                                        {placesData.countries.filter(c => c.continent === 'north-america').map((country) => (
                                            <option key={country.id} value={country.id}>
                                                {country.name}
                                            </option>
                                        ))}
                                    </optgroup>
                                    <optgroup label="🌎 South America">
                                        {placesData.countries.filter(c => c.continent === 'south-america').map((country) => (
                                            <option key={country.id} value={country.id}>
                                                {country.name}
                                            </option>
                                        ))}
                                    </optgroup>
                                    <optgroup label="🌍 Africa">
                                        {placesData.countries.filter(c => c.continent === 'africa').map((country) => (
                                            <option key={country.id} value={country.id}>
                                                {country.name}
                                            </option>
                                        ))}
                                    </optgroup>
                                    <optgroup label="🌏 Oceania">
                                        {placesData.countries.filter(c => c.continent === 'oceania').map((country) => (
                                            <option key={country.id} value={country.id}>
                                                {country.name}
                                            </option>
                                        ))}
                                    </optgroup>
                                </select>
                            </div>
                        </div>

                        {/* Cover Image Preview */}
                        {selectedPlace && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Cover Image (Auto-selected based on destination)
                                </label>
                                <div className="relative rounded-lg overflow-hidden h-48">
                                    <img
                                        src={coverImage}
                                        alt={selectedPlaceDetails?.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                                        <p className="text-white font-semibold flex items-center">
                                            <MapPinIcon className="h-5 w-5 mr-1" />
                                            {selectedPlaceDetails?.name}
                                            <span className="ml-2 text-xs bg-blue-600 px-2 py-1 rounded-full">
                                                {selectedPlaceDetails?.type}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Date Selection */}
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                                    {t('startDate')}
                                </label>
                                <div className="mt-1">
                                    <DatePicker
                                        selected={startDate}
                                        onChange={(date) => setStartDate(date)}
                                        selectsStart
                                        startDate={startDate}
                                        endDate={endDate}
                                        className="shadow-sm focus:ring-blue-600 focus:border-blue-600 block w-full sm:text-sm border-gray-300 rounded-md border p-2"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                                    {t('endDate')}
                                </label>
                                <div className="mt-1">
                                    <DatePicker
                                        selected={endDate}
                                        onChange={(date) => setEndDate(date)}
                                        selectsEnd
                                        startDate={startDate}
                                        endDate={endDate}
                                        minDate={startDate}
                                        className="shadow-sm focus:ring-blue-600 focus:border-blue-600 block w-full sm:text-sm border-gray-300 rounded-md border p-2"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Suggestions based on place */}
                        {showSuggestions && suggestions.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    ✨ {t('tripSuggestions')} - {selectedPlaceDetails?.name}
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {suggestions.map((suggestion, index) => (
                                        <div
                                            key={index}
                                            className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800 cursor-pointer hover:bg-blue-100 transition-colors"
                                            onClick={handleCreateTrip}
                                        >
                                            {suggestion}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {!selectedPlace && (
                            <p className="text-sm text-gray-500 text-center py-4">
                                {t('selectPlaceFirst')}
                            </p>
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-end pt-4 border-t">
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 mr-3"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleCreateTrip}
                                disabled={loading || !selectedPlace}
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-50"
                            >
                                {loading ? t('creating') : t('createTripBtn')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateTrip;
