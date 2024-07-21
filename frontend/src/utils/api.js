// frontend/src/utils/api.js

import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NODE_ENV === 'production'
        ? 'https://yourdomain.com/api'
        : 'https://localhost:5000/api',
    withCredentials: true,
});

api.interceptors.request.use(async (config) => {
    if (!api.defaults.headers.common['X-CSRF-Token']) {
        try {
            const response = await axios.get(
                process.env.NODE_ENV === 'production'
                    ? 'https://yourdomain.com/api/csrf-token'
                    : 'https://localhost:5000/api/csrf-token',
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
        if (error.response && error.response.status === 403 && error.response.data.message === 'CSRF token validation failed') {
            try {
                const response = await axios.get(
                    process.env.NODE_ENV === 'production'
                        ? 'https://yourdomain.com/api/csrf-token'
                        : 'https://localhost:5000/api/csrf-token',
                    { withCredentials: true }
                );
                api.defaults.headers.common['X-CSRF-Token'] = response.data.csrfToken;
                return api(error.config);
            } catch (error) {
                console.error('Error refreshing CSRF token:', error);
            }
        }
        return Promise.reject(error);
    }
);

export default api;