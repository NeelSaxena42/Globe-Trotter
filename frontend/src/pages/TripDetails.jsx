import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import CitySearch from '../components/CitySearch';
import ActivitySearch from '../components/ActivitySearch';
import { CalendarIcon, MapPinIcon, CurrencyDollarIcon, ClockIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { formatDate } from '../utils/dateUtils';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useSettings } from '../context/SettingsContext';

const TripDetails = () => {
    const { tripId } = useParams();
    const { getTrip, updateTrip } = useTrips();
    const { currency, setCurrency, availableCurrencies, formatCurrency } = useSettings();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [activeTab, setActiveTab] = useState('itinerary');
    const [showCitySearch, setShowCitySearch] = useState(false);
    const [showActivityModal, setShowActivityModal] = useState(null); // cityId
    const [showCustomAddModal, setShowCustomAddModal] = useState(null); // cityId
    const [customItemForm, setCustomItemForm] = useState({
        name: '',
        date: '',
        duration: '',
        description: '',
        category: 'Activity',
        cost: ''
    });

    const [showCityDateModal, setShowCityDateModal] = useState(false);
    const [selectedCityToAdd, setSelectedCityToAdd] = useState(null);
    const [cityDateForm, setCityDateForm] = useState({
        arrivalDate: '',
        departureDate: ''
    });

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
        setSelectedCityToAdd(city);
        setCityDateForm({
            arrivalDate: trip.startDate,
            departureDate: trip.endDate
        });
        setShowCityDateModal(true);
        setShowCitySearch(false);
    };

    const confirmAddCity = () => {
        if (!selectedCityToAdd || !cityDateForm.arrivalDate || !cityDateForm.departureDate) return;

        const newCityStop = {
            id: Date.now().toString(),
            cityId: selectedCityToAdd.id,
            cityName: selectedCityToAdd.name,
            country: selectedCityToAdd.country,
            image: selectedCityToAdd.image,
            arrivalDate: cityDateForm.arrivalDate,
            departureDate: cityDateForm.departureDate,
            activities: []
        };

        const updatedTrip = {
            ...trip,
            cities: [...(trip.cities || []), newCityStop]
        };

        setTrip(updatedTrip);
        updateTrip(updatedTrip);
        setShowCityDateModal(false);
        setSelectedCityToAdd(null);
    };

    const handleAddActivity = (cityId, activity) => {
        const updatedCities = trip.cities.map(city => {
            if (city.id === cityId) {
                return {
                    ...city,
                    activities: [...(city.activities || []), { ...activity, uniqueId: Date.now().toString(), type: 'activity', category: 'Activity' }]
                };
            }
            return city;
        });

        const updatedTrip = { ...trip, cities: updatedCities };
        setTrip(updatedTrip);
        updateTrip(updatedTrip);
        setShowActivityModal(null);
    };

    const handleAddCustomItem = (cityId) => {
        if (!customItemForm.name) return;

        const newItem = {
            uniqueId: Date.now().toString(),
            type: 'custom',
            name: customItemForm.name,
            date: customItemForm.date,
            duration: customItemForm.duration,
            description: customItemForm.description,
            category: customItemForm.category,
            cost: parseFloat(customItemForm.cost) || 0
        };

        const updatedCities = trip.cities.map(city => {
            if (city.id === cityId) {
                return {
                    ...city,
                    activities: [...(city.activities || []), newItem]
                };
            }
            return city;
        });

        const updatedTrip = { ...trip, cities: updatedCities };
        setTrip(updatedTrip);
        updateTrip(updatedTrip);
        setShowCustomAddModal(null);
        setCustomItemForm({ name: '', date: '', duration: '', description: '', category: 'Activity', cost: '' });
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

    const handleRemoveActivity = (cityId, uniqueId) => {
        const updatedCities = trip.cities.map(city => {
            if (city.id === cityId) {
                return {
                    ...city,
                    activities: city.activities.filter(a => a.uniqueId !== uniqueId)
                };
            }
            return city;
        });
        const updatedTrip = { ...trip, cities: updatedCities };
        setTrip(updatedTrip);
        updateTrip(updatedTrip);
    };

    const handleOnDragEnd = (result) => {
        if (!result.destination) return;

        const { source, destination, type } = result;

        if (type === 'city') {
            const items = Array.from(trip.cities);
            const [reorderedItem] = items.splice(source.index, 1);
            items.splice(destination.index, 0, reorderedItem);

            const updatedTrip = { ...trip, cities: items };
            setTrip(updatedTrip);
            updateTrip(updatedTrip);
        } else if (type === 'activity') {
            // Extract cityId from droppableId "activities-{cityId}"
            const sourceCityId = source.droppableId.replace('activities-', '');
            const destCityId = destination.droppableId.replace('activities-', '');

            // For now, only support reordering within the same city
            if (sourceCityId !== destCityId) return;

            const cityIndex = trip.cities.findIndex(c => c.id === sourceCityId);
            const city = trip.cities[cityIndex];
            const activities = Array.from(city.activities || []);
            const [reorderedItem] = activities.splice(source.index, 1);
            activities.splice(destination.index, 0, reorderedItem);

            const updatedCities = [...trip.cities];
            updatedCities[cityIndex] = { ...city, activities };

            const updatedTrip = { ...trip, cities: updatedCities };
            setTrip(updatedTrip);
            updateTrip(updatedTrip);
        }
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
                            <CitySearch
                                onAddCity={handleAddCity}
                                tripPlace={trip.place}
                                tripType={trip.placeType}
                            />
                        </div>
                    )}

                    {/* City Date Selection Modal */}
                    {showCityDateModal && selectedCityToAdd && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-xl">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">When will you be in {selectedCityToAdd.name}?</h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Arrival Date</label>
                                            <input
                                                type="date"
                                                min={trip.startDate}
                                                max={trip.endDate}
                                                value={cityDateForm.arrivalDate}
                                                onChange={(e) => setCityDateForm({ ...cityDateForm, arrivalDate: e.target.value })}
                                                className="w-full p-2 border border-gray-300 rounded focus:ring-primary focus:border-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date</label>
                                            <input
                                                type="date"
                                                min={cityDateForm.arrivalDate || trip.startDate}
                                                max={trip.endDate}
                                                value={cityDateForm.departureDate}
                                                onChange={(e) => setCityDateForm({ ...cityDateForm, departureDate: e.target.value })}
                                                className="w-full p-2 border border-gray-300 rounded focus:ring-primary focus:border-primary"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end space-x-3 mt-6">
                                        <button
                                            onClick={() => {
                                                setShowCityDateModal(false);
                                                setSelectedCityToAdd(null);
                                            }}
                                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={confirmAddCity}
                                            className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-700"
                                        >
                                            Add City
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Custom Add Modal (Popup) */}
                    {showCustomAddModal && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-lg font-bold text-gray-900">Add Custom Item</h4>
                                    <button onClick={() => setShowCustomAddModal(null)} className="text-gray-500 hover:text-gray-700">
                                        <span className="sr-only">Close</span>
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                                        <input
                                            type="text"
                                            value={customItemForm.name}
                                            onChange={(e) => setCustomItemForm({ ...customItemForm, name: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-primary focus:border-primary"
                                            placeholder="e.g., Lunch at Cafe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                        <select
                                            value={customItemForm.category}
                                            onChange={(e) => setCustomItemForm({ ...customItemForm, category: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-primary focus:border-primary"
                                        >
                                            <option value="Activity">Activity</option>
                                            <option value="Transport">Transport</option>
                                            <option value="Food">Food</option>
                                            <option value="Accommodation">Accommodation</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                        <input
                                            type="date"
                                            value={customItemForm.date}
                                            onChange={(e) => setCustomItemForm({ ...customItemForm, date: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-primary focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration (hours)</label>
                                        <input
                                            type="number"
                                            step="0.5"
                                            value={customItemForm.duration}
                                            onChange={(e) => setCustomItemForm({ ...customItemForm, duration: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-primary focus:border-primary"
                                            placeholder="2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Cost ($)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={customItemForm.cost}
                                            onChange={(e) => setCustomItemForm({ ...customItemForm, cost: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-primary focus:border-primary"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description / Notes</label>
                                        <textarea
                                            value={customItemForm.description}
                                            onChange={(e) => setCustomItemForm({ ...customItemForm, description: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-primary focus:border-primary"
                                            rows="3"
                                            placeholder="Add details..."
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end space-x-3">
                                    <button
                                        onClick={() => setShowCustomAddModal(null)}
                                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleAddCustomItem(showCustomAddModal)}
                                        className="px-4 py-2 bg-primary text-white text-sm font-medium rounded hover:bg-blue-700"
                                    >
                                        Add Item
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <DragDropContext onDragEnd={handleOnDragEnd}>
                        <Droppable droppableId="cities" type="city">
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
                                                            <Droppable droppableId={`activities-${city.id}`} type="activity">
                                                                {(provided) => (
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.droppableProps}
                                                                        className="mt-4 space-y-2"
                                                                    >
                                                                        {city.activities?.map((activity, idx) => (
                                                                            <Draggable key={activity.uniqueId || idx} draggableId={activity.uniqueId || `${city.id}-activity-${idx}`} index={idx}>
                                                                                {(provided) => (
                                                                                    <div
                                                                                        ref={provided.innerRef}
                                                                                        {...provided.draggableProps}
                                                                                        {...provided.dragHandleProps}
                                                                                        className={`flex items-center justify-between p-3 rounded text-sm border ${activity.type === 'custom' ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-100'}`}
                                                                                    >
                                                                                        <div className="flex items-center">
                                                                                            {activity.type === 'custom' && (
                                                                                                <span className="mr-2 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-200 rounded">Custom</span>
                                                                                            )}
                                                                                            <span className="font-medium text-gray-900 mr-2">{activity.name}</span>
                                                                                            {activity.category && (
                                                                                                <span className="text-gray-500 text-xs px-2 py-0.5 bg-gray-200 rounded-full mr-2">{activity.category}</span>
                                                                                            )}
                                                                                            {activity.type !== 'custom' && !activity.category && (
                                                                                                <span className="text-gray-500 text-xs px-2 py-0.5 bg-gray-200 rounded-full">{activity.type}</span>
                                                                                            )}
                                                                                        </div>
                                                                                        <div className="flex items-center text-gray-500 space-x-3">
                                                                                            {activity.date && <span className="text-xs">{new Date(activity.date).toLocaleDateString()}</span>}
                                                                                            <span className="flex items-center"><ClockIcon className="h-3 w-3 mr-1" /> {activity.duration}h</span>
                                                                                            {activity.cost > 0 && <span className="flex items-center"><CurrencyDollarIcon className="h-3 w-3 mr-1" /> {activity.cost}</span>}
                                                                                            <button onClick={() => handleRemoveActivity(city.id, activity.uniqueId)} className="text-gray-400 hover:text-red-500 ml-2">
                                                                                                <TrashIcon className="h-4 w-4" />
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                )}
                                                                            </Draggable>
                                                                        ))}
                                                                        {provided.placeholder}
                                                                    </div>
                                                                )}
                                                            </Droppable>

                                                            <div className="flex space-x-3 mt-3">
                                                                <button
                                                                    onClick={() => setShowActivityModal(city.id)}
                                                                    className="text-sm text-primary hover:text-blue-700 font-medium flex items-center"
                                                                >
                                                                    <PlusIcon className="h-4 w-4 mr-1" />
                                                                    Add Activity
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setShowCustomAddModal(city.id);
                                                                        setCustomItemForm({ ...customItemForm, date: city.arrivalDate }); // Default date
                                                                    }}
                                                                    className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center"
                                                                >
                                                                    <PlusIcon className="h-4 w-4 mr-1" />
                                                                    Custom Add
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Activity Search Modal */}
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
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Cost Breakdown</h3>
                            <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className="block w-24 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                            >
                                {availableCurrencies.map((curr) => (
                                    <option key={curr} value={curr}>{curr}</option>
                                ))}
                            </select>
                        </div>
                        {(() => {
                            const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
                            const categories = ['Activity', 'Accommodation', 'Transport', 'Food'];

                            const pieData = categories.map((category, index) => {
                                const value = trip.cities?.reduce((total, city) => {
                                    return total + (city.activities?.filter(a => (a.category || 'Activity') === category)
                                        .reduce((sum, a) => sum + (parseFloat(a.cost) || 0), 0) || 0);
                                }, 0) || 0;
                                return { name: category, value, color: COLORS[index] };
                            }).filter(item => item.value > 0);

                            const totalCost = pieData.reduce((sum, item) => sum + item.value, 0);

                            if (totalCost === 0) {
                                return (
                                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                                        <div className="text-center">
                                            <div className="inline-block p-4 rounded-full bg-blue-100 text-primary mb-2">
                                                <CurrencyDollarIcon className="h-8 w-8" />
                                            </div>
                                            <p className="text-gray-500 text-sm">No expenses yet</p>
                                            <p className="text-3xl font-bold text-gray-900 mt-1">{formatCurrency(0)}</p>
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <div className="h-72">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={90}
                                                paddingAngle={2}
                                                dataKey="value"
                                                labelLine={false}
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                formatter={(value) => [formatCurrency(value), '']}
                                                contentStyle={{
                                                    backgroundColor: 'white',
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                                }}
                                            />
                                            <Legend
                                                verticalAlign="bottom"
                                                height={36}
                                                formatter={(value) => (
                                                    <span className="text-sm text-gray-600">{value}</span>
                                                )}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="text-center -mt-4">
                                        <p className="text-gray-500 text-sm">Total Trip Cost</p>
                                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalCost)}</p>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Estimated Expenses</h3>
                        <div className="space-y-4">
                            {['Activity', 'Accommodation', 'Transport', 'Food'].map(category => {
                                const categoryCost = trip.cities?.reduce((total, city) => {
                                    return total + (city.activities?.filter(a => (a.category || 'Activity') === category)
                                        .reduce((sum, a) => sum + (parseFloat(a.cost) || 0), 0) || 0);
                                }, 0);

                                return (
                                    <div key={category} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-600">{category}</span>
                                        <span className="font-bold text-gray-900">{formatCurrency(categoryCost || 0)}</span>
                                    </div>
                                );
                            })}

                            <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                                <span className="text-lg font-bold text-gray-900">Total</span>
                                <span className="text-xl font-bold text-primary">
                                    {formatCurrency(trip.cities?.reduce((total, city) => total + (city.activities?.reduce((sum, a) => sum + (parseFloat(a.cost) || 0), 0) || 0), 0))}
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
                        {trip.cities?.map((city) => (
                            <div key={city.id} className="relative pl-8">
                                <div className="absolute -left-2.5 top-0 h-5 w-5 rounded-full border-4 border-white bg-primary"></div>
                                <div className="mb-1 text-sm text-primary font-bold">
                                    {formatDate(city.arrivalDate)} - {formatDate(city.departureDate)}
                                </div>
                                <h4 className="text-lg font-bold text-gray-900">{city.cityName}, {city.country}</h4>
                                <div className="mt-2 space-y-2">
                                    {city.activities?.map((activity, idx) => (
                                        <div key={idx} className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 p-2 rounded border border-gray-100">
                                            <div className="flex items-center">
                                                <ClockIcon className="h-4 w-4 mr-2 text-gray-400" />
                                                <span className="font-medium">{activity.name}</span>
                                                <span className="ml-2 text-xs text-gray-400">({activity.duration}h)</span>
                                            </div>
                                            {activity.cost > 0 && (
                                                <span className="font-medium text-gray-900">{formatCurrency(activity.cost)}</span>
                                            )}
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
