import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import CitySearch from '../components/CitySearch';
import ActivitySearch from '../components/ActivitySearch';
import { CalendarIcon, MapPinIcon, CurrencyDollarIcon, ClockIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

const TripDetails = () => {
    const { tripId } = useParams();
    const { getTrip, updateTrip } = useTrips();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [activeTab, setActiveTab] = useState('itinerary');
    const [showCitySearch, setShowCitySearch] = useState(false);
    const [showActivityModal, setShowActivityModal] = useState(null); // cityId

    useEffect(() => {
        const foundTrip = getTrip(tripId);
        if (foundTrip) {
            setTrip(foundTrip);
        } else {
            // navigate('/dashboard'); 
        }
    }, [tripId, getTrip, navigate]);

    if (!trip) return <div className="p-8 text-center">Loading trip...</div>;

    const handleAddCity = (city) => {
        const newCityStop = {
            id: Date.now().toString(),
            cityId: city.id,
            cityName: city.name,
            country: city.country,
            image: city.image,
            arrivalDate: trip.startDate, // Default to trip start
            departureDate: trip.endDate, // Default to trip end
            activities: []
        };

        const updatedTrip = {
            ...trip,
            cities: [...(trip.cities || []), newCityStop]
        };

        setTrip(updatedTrip);
        updateTrip(updatedTrip);
        setShowCitySearch(false);
    };

    const handleAddActivity = (cityId, activity) => {
        const updatedCities = trip.cities.map(city => {
            if (city.id === cityId) {
                return {
                    ...city,
                    activities: [...(city.activities || []), { ...activity, uniqueId: Date.now().toString() }]
                };
            }
            return city;
        });

        const updatedTrip = { ...trip, cities: updatedCities };
        setTrip(updatedTrip);
        updateTrip(updatedTrip);
        setShowActivityModal(null);
    };

    const handleRemoveCity = (cityId) => {
        if (window.confirm('Remove this city from your trip?')) {
            const updatedTrip = {
                ...trip,
                cities: trip.cities.filter(c => c.id !== cityId)
            };
            setTrip(updatedTrip);
            updateTrip(updatedTrip);
        }
    };

    const handleOnDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(trip.cities);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        const updatedTrip = { ...trip, cities: items };
        setTrip(updatedTrip);
        updateTrip(updatedTrip);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="relative h-64 rounded-xl overflow-hidden shadow-md">
                <img src={trip.coverImage} alt={trip.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6 text-white">
                    <h1 className="text-4xl font-bold">{trip.name}</h1>
                    <div className="flex items-center mt-2 space-x-4">
                        <div className="flex items-center">
                            <CalendarIcon className="h-5 w-5 mr-2" />
                            {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                            <MapPinIcon className="h-5 w-5 mr-2" />
                            {trip.cities?.length || 0} Stops
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    {['itinerary', 'budget', 'calendar'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`${activeTab === tab
                                ? 'border-primary text-primary'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content */}
            {activeTab === 'itinerary' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900">Itinerary</h2>
                        <button
                            onClick={() => setShowCitySearch(!showCitySearch)}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700"
                        >
                            <PlusIcon className="h-5 w-5 mr-2" />
                            Add Stop
                        </button>
                    </div>

                    {showCitySearch && (
                        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Search for a city to add</h3>
                            <CitySearch onAddCity={handleAddCity} />
                        </div>
                    )}

                    <DragDropContext onDragEnd={handleOnDragEnd}>
                        <Droppable droppableId="cities">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                                    {trip.cities?.map((city, index) => (
                                        <Draggable key={city.id} draggableId={city.id} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                                                >
                                                    <div className="p-4 flex items-start space-x-4">
                                                        <div className="flex-shrink-0">
                                                            <img src={city.image} alt={city.cityName} className="h-20 w-20 rounded-lg object-cover" />
                                                        </div>
                                                        <div className="flex-grow">
                                                            <div className="flex justify-between">
                                                                <h3 className="text-lg font-bold text-gray-900">{city.cityName}, {city.country}</h3>
                                                                <button onClick={() => handleRemoveCity(city.id)} className="text-gray-400 hover:text-red-500">
                                                                    <TrashIcon className="h-5 w-5" />
                                                                </button>
                                                            </div>
                                                            <div className="text-sm text-gray-500 mt-1">
                                                                {new Date(city.arrivalDate).toLocaleDateString()} - {new Date(city.departureDate).toLocaleDateString()}
                                                            </div>

                                                            {/* Activities */}
                                                            <div className="mt-4 space-y-2">
                                                                {city.activities?.map((activity, idx) => (
                                                                    <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm">
                                                                        <div className="flex items-center">
                                                                            <span className="font-medium text-gray-900 mr-2">{activity.name}</span>
                                                                            <span className="text-gray-500 text-xs px-2 py-0.5 bg-gray-200 rounded-full">{activity.type}</span>
                                                                        </div>
                                                                        <div className="flex items-center text-gray-500 space-x-3">
                                                                            <span className="flex items-center"><ClockIcon className="h-3 w-3 mr-1" /> {activity.duration}h</span>
                                                                            <span className="flex items-center"><CurrencyDollarIcon className="h-3 w-3 mr-1" /> {activity.cost}</span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                <button
                                                                    onClick={() => setShowActivityModal(city.id)}
                                                                    className="text-sm text-primary hover:text-blue-700 font-medium flex items-center mt-2"
                                                                >
                                                                    <PlusIcon className="h-4 w-4 mr-1" />
                                                                    Add Activity
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Activity Search Modal (Inline for simplicity) */}
                                                    {showActivityModal === city.id && (
                                                        <div className="p-4 border-t border-gray-100 bg-gray-50">
                                                            <div className="flex justify-between items-center mb-2">
                                                                <h4 className="font-medium text-gray-900">Add Activity in {city.cityName}</h4>
                                                                <button onClick={() => setShowActivityModal(null)} className="text-gray-500 hover:text-gray-700">Close</button>
                                                            </div>
                                                            <ActivitySearch cityId={city.cityId} onAddActivity={(activity) => handleAddActivity(city.id, activity)} />
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>

                    {(!trip.cities || trip.cities.length === 0) && (
                        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                            <p className="text-gray-500">Your itinerary is empty.</p>
                            <button onClick={() => setShowCitySearch(true)} className="text-primary font-medium mt-2">Add your first stop</button>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'budget' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Cost Breakdown</h3>
                        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                            <div className="text-center">
                                <div className="inline-block p-4 rounded-full bg-blue-100 text-primary mb-2">
                                    <CurrencyDollarIcon className="h-8 w-8" />
                                </div>
                                <p className="text-gray-500 text-sm">Chart visualization would go here.</p>
                                <p className="text-xs text-gray-400">(Requires Recharts implementation)</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Estimated Expenses</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-600">Activities</span>
                                <span className="font-bold text-gray-900">
                                    ${trip.cities?.reduce((total, city) => total + (city.activities?.reduce((sum, a) => sum + a.cost, 0) || 0), 0)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-600">Accommodation (Est.)</span>
                                <span className="font-bold text-gray-900">$1,200</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-600">Transport (Est.)</span>
                                <span className="font-bold text-gray-900">$800</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-600">Food (Est.)</span>
                                <span className="font-bold text-gray-900">$600</span>
                            </div>
                            <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                                <span className="text-lg font-bold text-gray-900">Total</span>
                                <span className="text-xl font-bold text-primary">
                                    ${trip.cities?.reduce((total, city) => total + (city.activities?.reduce((sum, a) => sum + a.cost, 0) || 0), 0) + 2600}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'calendar' && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Trip Timeline</h3>
                    <div className="relative border-l-2 border-gray-200 ml-3 space-y-8">
                        {trip.cities?.map((city, index) => (
                            <div key={city.id} className="relative pl-8">
                                <div className="absolute -left-2.5 top-0 h-5 w-5 rounded-full border-4 border-white bg-primary"></div>
                                <div className="mb-1 text-sm text-primary font-bold">
                                    {new Date(city.arrivalDate).toLocaleDateString()} - {new Date(city.departureDate).toLocaleDateString()}
                                </div>
                                <h4 className="text-lg font-bold text-gray-900">{city.cityName}, {city.country}</h4>
                                <div className="mt-2 space-y-2">
                                    {city.activities?.map((activity, idx) => (
                                        <div key={idx} className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded border border-gray-100">
                                            <ClockIcon className="h-4 w-4 mr-2 text-gray-400" />
                                            {activity.name} ({activity.duration}h)
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {(!trip.cities || trip.cities.length === 0) && (
                            <p className="pl-8 text-gray-500 italic">Add stops to see your timeline.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TripDetails;
