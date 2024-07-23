// api.js
import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NODE_ENV === 'production'
        ? 'https://yourdomain.com/api'
        : 'https://localhost:5000/api',
    withCredentials: true,
});

api.interceptors.request.use(async (config) => {
    // Add auth token to request headers
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Handle CSRF token
    if (!api.defaults.headers.common['X-CSRF-Token']) {
        try {
            const response = await axios.get(
                `${api.defaults.baseURL}/csrf-token`,
                { withCredentials: true }
            );
            api.defaults.headers.common['X-CSRF-Token'] = response.data.csrfToken;
        } catch (error) {
            console.error('Error fetching CSRF token:', error);
        }
    }
    return config;
});

api.interceptors.response.use(
    response => response,
    async error => {
        // Handle CSRF token refresh
        if (error.response && error.response.status === 403 && error.response.data.message === 'CSRF token validation failed') {
            try {
                const response = await axios.get(
                    `${api.defaults.baseURL}/csrf-token`,
                    { withCredentials: true }
                );
                api.defaults.headers.common['X-CSRF-Token'] = response.data.csrfToken;
                return api(error.config);
            } catch (refreshError) {
                console.error('Error refreshing CSRF token:', refreshError);
            }
        }

        // Handle authentication errors
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('authToken');
            // You might want to redirect to login page here
            // or dispatch an action to update your auth state
        }

        return Promise.reject(error);
    }
);

export default api;