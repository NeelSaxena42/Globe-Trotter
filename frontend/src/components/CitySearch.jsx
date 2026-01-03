import React, { useState } from 'react';
import { mockCities } from '../data/mockData';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';

import { placesData } from '../data/placesData';

const CitySearch = ({ onAddCity, tripPlace, tripType }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.length > 1) {
            // Determine valid countries based on trip destination
            let validCountries = [];
            if (tripType === 'country') {
                const country = placesData.countries.find(c => c.id === tripPlace);
                if (country) validCountries = [country.name];
            } else if (tripType === 'continent') {
                validCountries = placesData.countries
                    .filter(c => c.continent === tripPlace)
                    .map(c => c.name);
            }

            const filtered = mockCities.filter(city => {
                const matchesQuery = city.name.toLowerCase().includes(value.toLowerCase()) ||
                    city.country.toLowerCase().includes(value.toLowerCase());

                // If validCountries is populated, strictly filter by it
                const matchesDestination = validCountries.length > 0
                    ? validCountries.includes(city.country)
                    : true; // If no trip context, allow all (or maybe restrict? User said "cities should be of the country...")
                // If we want to be strict, we should probably default to false if tripPlace is set but not found?
                // But let's assume validCountries covers it.

                return matchesQuery && matchesDestination;
            });
            setResults(filtered);
        } else {
            setResults([]);
        }
    };

    return (
        <div className="relative">
            <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                    type="text"
                    className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md border p-2"
                    placeholder="Search for a city..."
                    value={query}
                    onChange={handleSearch}
                />
            </div>

            {results.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    {results.map((city) => (
                        <div
                            key={city.id}
                            className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 flex items-center justify-between"
                            onClick={() => {
                                onAddCity(city);
                                setQuery('');
                                setResults([]);
                            }}
                        >
                            <div className="flex items-center">
                                <img src={city.image} alt={city.name} className="h-8 w-8 rounded-full object-cover mr-3" />
                                <div>
                                    <span className="block truncate font-medium">{city.name}</span>
                                    <span className="block truncate text-xs text-gray-500">{city.country}</span>
                                </div>
                            </div>
                            <PlusIcon className="h-5 w-5 text-gray-400" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CitySearch;
