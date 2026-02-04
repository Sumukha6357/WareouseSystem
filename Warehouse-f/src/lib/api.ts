import axios from 'axios';

const api = axios.create({
    baseURL: '/api', // Proxy handles forwarding to localhost:8080
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for session cookies
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Determine user-friendly error message
        const message = error.response?.data?.message || 'Something went wrong';
        return Promise.reject(new Error(message));
    }
);

export default api;
