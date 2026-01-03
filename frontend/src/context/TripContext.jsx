import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockTrips } from '../data/mockData';

const TripContext = createContext();

export const useTrips = () => useContext(TripContext);

export const TripProvider = ({ children }) => {
    const [trips, setTrips] = useState([]);
    const [communityTrips, setCommunityTrips] = useState([]);
    const [likedTripIds, setLikedTripIds] = useState([]);
    const [savedTripIds, setSavedTripIds] = useState([]);

    useEffect(() => {
        // Load trips from local storage or use mock data
        const storedTrips = localStorage.getItem('globeTrotterTrips');
        if (storedTrips) {
            setTrips(JSON.parse(storedTrips));
        } else {
            setTrips(mockTrips);
        }

        // Load community trips from local storage
        const storedCommunityTrips = localStorage.getItem('globeTrotterCommunityTrips');
        if (storedCommunityTrips) {
            setCommunityTrips(JSON.parse(storedCommunityTrips));
        }

        // Load liked trips from local storage
        const storedLikedTrips = localStorage.getItem('globeTrotterLikedTrips');
        if (storedLikedTrips) {
            setLikedTripIds(JSON.parse(storedLikedTrips));
        }

        // Load saved trip IDs from local storage
        const storedSavedTrips = localStorage.getItem('globeTrotterSavedTripIds');
        if (storedSavedTrips) {
            setSavedTripIds(JSON.parse(storedSavedTrips));
        }
    }, []);

    useEffect(() => {
        // Save trips to local storage whenever they change
        if (trips.length > 0) {
            localStorage.setItem('globeTrotterTrips', JSON.stringify(trips));
        }
    }, [trips]);

    useEffect(() => {
        // Save community trips to local storage whenever they change
        localStorage.setItem('globeTrotterCommunityTrips', JSON.stringify(communityTrips));
    }, [communityTrips]);

    useEffect(() => {
        // Save liked trips to local storage
        localStorage.setItem('globeTrotterLikedTrips', JSON.stringify(likedTripIds));
    }, [likedTripIds]);

    useEffect(() => {
        // Save saved trip IDs to local storage
        localStorage.setItem('globeTrotterSavedTripIds', JSON.stringify(savedTripIds));
    }, [savedTripIds]);

    const addTrip = (trip) => {
        setTrips(prev => [...prev, { ...trip, id: Date.now().toString() }]);
    };

    const updateTrip = (updatedTrip) => {
        setTrips(prev => prev.map(t => t.id === updatedTrip.id ? updatedTrip : t));
    };

    const deleteTrip = (id) => {
        setTrips(prev => prev.filter(t => t.id !== id));
        // Also remove from saved if it was saved from community
        setSavedTripIds(prev => prev.filter(sid => sid !== id));
    };

    const getTrip = (id) => {
        return trips.find(t => t.id === id);
    };

    // Share trip to community
    const shareToCommuity = (tripId) => {
        const trip = trips.find(t => t.id === tripId);
        if (trip) {
            const alreadyShared = communityTrips.some(ct => ct.originalId === tripId);
            if (!alreadyShared) {
                const communityTrip = {
                    ...trip,
                    id: 'community_' + Date.now().toString(),
                    originalId: tripId,
                    sharedAt: new Date().toISOString(),
                    sharedBy: 'You',
                    likes: 0,
                    saves: 0,
                    isShared: true
                };
                setCommunityTrips(prev => [...prev, communityTrip]);
                // Mark original trip as shared
                updateTrip({ ...trip, isSharedToCommunity: true });
                return true;
            }
        }
        return false;
    };

    // Unshare trip from community
    const unshareFromCommunity = (tripId) => {
        const trip = trips.find(t => t.id === tripId);
        setCommunityTrips(prev => prev.filter(ct => ct.originalId !== tripId));
        if (trip) {
            updateTrip({ ...trip, isSharedToCommunity: false });
        }
    };

    // Save a community trip to my trips
    const saveFromCommunity = (communityTripId) => {
        const communityTrip = communityTrips.find(ct => ct.id === communityTripId);
        if (communityTrip && !savedTripIds.includes(communityTripId)) {
            const newTrip = {
                ...communityTrip,
                id: Date.now().toString(),
                name: communityTrip.name + ' (Saved)',
                savedFromCommunity: true,
                originalCommunityId: communityTripId
            };
            delete newTrip.originalId;
            delete newTrip.sharedAt;
            delete newTrip.sharedBy;
            delete newTrip.likes;
            delete newTrip.saves;
            delete newTrip.isShared;
            setTrips(prev => [...prev, newTrip]);
            setSavedTripIds(prev => [...prev, communityTripId]);
            // Increment saves count
            setCommunityTrips(prev => prev.map(ct =>
                ct.id === communityTripId ? { ...ct, saves: (ct.saves || 0) + 1 } : ct
            ));
            return true;
        }
        return false;
    };

    // Unsave a community trip (remove from my trips)
    const unsaveFromCommunity = (communityTripId) => {
        // Find and remove the saved trip
        const savedTrip = trips.find(t => t.originalCommunityId === communityTripId);
        if (savedTrip) {
            setTrips(prev => prev.filter(t => t.originalCommunityId !== communityTripId));
            setSavedTripIds(prev => prev.filter(id => id !== communityTripId));
            // Decrement saves count
            setCommunityTrips(prev => prev.map(ct =>
                ct.id === communityTripId ? { ...ct, saves: Math.max((ct.saves || 0) - 1, 0) } : ct
            ));
            return true;
        }
        return false;
    };

    // Check if a community trip is saved
    const isTripSaved = (communityTripId) => {
        return savedTripIds.includes(communityTripId) ||
            trips.some(t => t.originalCommunityId === communityTripId);
    };

    // Toggle like on a community trip
    const toggleLikeCommunityTrip = (communityTripId) => {
        const isLiked = likedTripIds.includes(communityTripId);
        if (isLiked) {
            // Unlike
            setLikedTripIds(prev => prev.filter(id => id !== communityTripId));
            setCommunityTrips(prev => prev.map(ct =>
                ct.id === communityTripId ? { ...ct, likes: Math.max((ct.likes || 0) - 1, 0) } : ct
            ));
        } else {
            // Like
            setLikedTripIds(prev => [...prev, communityTripId]);
            setCommunityTrips(prev => prev.map(ct =>
                ct.id === communityTripId ? { ...ct, likes: (ct.likes || 0) + 1 } : ct
            ));
        }
    };

    // Check if a trip is liked
    const isTripLiked = (communityTripId) => {
        return likedTripIds.includes(communityTripId);
    };

    // Get a community trip by ID
    const getCommunityTrip = (id) => {
        return communityTrips.find(t => t.id === id);
    };

    return (
        <TripContext.Provider value={{
            trips,
            addTrip,
            updateTrip,
            deleteTrip,
            getTrip,
            communityTrips,
            shareToCommuity,
            unshareFromCommunity,
            saveFromCommunity,
            unsaveFromCommunity,
            isTripSaved,
            toggleLikeCommunityTrip,
            isTripLiked,
            getCommunityTrip,
            likedTripIds,
            savedTripIds
        }}>
            {children}
        </TripContext.Provider>
    );
};
