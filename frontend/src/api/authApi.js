import axios from './axios';

const authApi = {
    // Register a new user
    register: async (username, email, password) => {
        const response = await axios.post('/auth/register', { username, email, password });
        return response.data;
    },

    // Login user
    login: async (email, password) => {
        const response = await axios.post('/auth/login', { email, password });
        return response.data;
    }
};

export default authApi;
