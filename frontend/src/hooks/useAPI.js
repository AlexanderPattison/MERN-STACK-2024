// src/hooks/useAPI.js

import { useState, useCallback } from 'react';
import api from '../utils/api';

const useAPI = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleError = (error) => {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            setError({
                message: error.response.data.message || 'An error occurred',
                status: error.response.status,
                statusText: error.response.statusText,
            });
        } else if (error.request) {
            // The request was made but no response was received
            setError({
                message: 'No response received from server',
                status: 'Network Error',
            });
        } else {
            // Something happened in setting up the request that triggered an Error
            setError({
                message: error.message,
                status: 'Request Error',
            });
        }
    };

    const request = useCallback(async (method, url, data = null, options = {}) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await api[method](url, data, options);
            setIsLoading(false);
            return response.data;
        } catch (err) {
            setIsLoading(false);
            handleError(err);
            throw err;
        }
    }, []);

    const get = useCallback((url, options) => request('get', url, null, options), [request]);
    const post = useCallback((url, data, options) => request('post', url, data, options), [request]);
    const put = useCallback((url, data, options) => request('put', url, data, options), [request]);
    const del = useCallback((url, options) => request('delete', url, null, options), [request]);

    return {
        isLoading,
        error,
        get,
        post,
        put,
        delete: del,
        setError,
    };
};

export default useAPI;