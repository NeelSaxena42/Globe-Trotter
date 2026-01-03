import axios from './axios';

const tripApi = {
    // Get all personal trips
    getAllTrips: async () => {
        const response = await axios.get('/trips');
        return response.data;
    },

    // Get a single trip
    getTrip: async (id) => {
        const response = await axios.get(`/trips/${id}`);
        return response.data;
    },

    // Create a new trip
    createTrip: async (tripData) => {
        const response = await axios.post('/trips', tripData);
        return response.data;
    },

    // Update a trip
    updateTrip: async (id, tripData) => {
        const response = await axios.put(`/trips/${id}`, tripData);
        return response.data;
    },

    // Delete a trip
    deleteTrip: async (id) => {
        const response = await axios.delete(`/trips/${id}`);
        return response.data;
    },

    // Share trip to community
    shareTrip: async (id) => {
        const response = await axios.post(`/trips/${id}/share`);
        return response.data;
    }
};

export default tripApi;
