// frontend/src/utils/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NODE_ENV === 'production'
        ? 'https://yourdomain.com/api'
        : 'https://localhost:5000/api',
    withCredentials: true,
    withCredentials: true,
});

let csrfToken = null;

const fetchCSRFToken = async () => {
    if (!csrfToken) {
        try {
            const response = await axios.get(
                `${api.defaults.baseURL}/csrf-token`,
                { withCredentials: true }
            );
            csrfToken = response.data.csrfToken;
            api.defaults.headers.common['X-CSRF-Token'] = csrfToken;
        } catch (error) {
            console.error('Error fetching CSRF token:', error);
        }
    }
};

api.interceptors.request.use(async (config) => {
    if (!csrfToken) {
        await fetchCSRFToken();
    }

    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    response => response,
    async error => {
        if (error.response && error.response.status === 403 && error.response.data.message === 'CSRF token validation failed') {
            csrfToken = null;
            await fetchCSRFToken();
            return api(error.config);
        }

        if (error.response && error.response.status === 401) {
            localStorage.removeItem('authToken');
            // You might want to redirect to login page here
            // or dispatch an action to update your auth state
        }

        return Promise.reject(error);
    }
);

export default api;