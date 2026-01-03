import axios from './axios';

const communityApi = {
    // Get all shared trips
    getCommunityTrips: async () => {
        const response = await axios.get('/community');
        return response.data;
    },

    // Toggle like on a trip
    toggleLike: async (tripId) => {
        const response = await axios.post(`/community/like/${tripId}`);
        return response.data;
    },

    // Save a trip to personal collection
    saveTrip: async (tripId) => {
        const response = await axios.post(`/community/save/${tripId}`);
        return response.data;
    }
};

export default communityApi;
