import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to attach JWT token
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('globeTrotterToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for handling common errors
instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Handle unauthorized (clear token, redirect to login, etc.)
            localStorage.removeItem('globeTrotterToken');
            localStorage.removeItem('globeTrotterUser');
            // Optimization: Avoid window.location reload in a SPA if possible, 
            // but for now this ensures consistency.
        }
        return Promise.reject(error);
    }
);

export default instance;
