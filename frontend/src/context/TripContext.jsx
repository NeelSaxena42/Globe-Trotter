import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockTrips } from '../data/mockData';

const TripContext = createContext();

export const useTrips = () => useContext(TripContext);

export const TripProvider = ({ children }) => {
    const [trips, setTrips] = useState([]);

    useEffect(() => {
        // Load trips from local storage or use mock data
        const storedTrips = localStorage.getItem('globeTrotterTrips');
        if (storedTrips) {
            setTrips(JSON.parse(storedTrips));
        } else {
            setTrips(mockTrips);
        }
    }, []);

    useEffect(() => {
        // Save trips to local storage whenever they change
        if (trips.length > 0) {
            localStorage.setItem('globeTrotterTrips', JSON.stringify(trips));
        }
    }, [trips]);

    const addTrip = (trip) => {
        setTrips(prev => [...prev, { ...trip, id: Date.now().toString() }]);
    };

    const updateTrip = (updatedTrip) => {
        setTrips(prev => prev.map(t => t.id === updatedTrip.id ? updatedTrip : t));
    };

    const deleteTrip = (id) => {
        setTrips(prev => prev.filter(t => t.id !== id));
    };

    const getTrip = (id) => {
        return trips.find(t => t.id === id);
    };

    return (
        <TripContext.Provider value={{ trips, addTrip, updateTrip, deleteTrip, getTrip }}>
            {children}
        </TripContext.Provider>
    );
};
