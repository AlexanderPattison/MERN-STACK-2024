'use client';

import { useState, useCallback } from 'react';
import axios from 'axios';
import https from 'https';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
    withCredentials: true,
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});

const useAPI = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleError = (error) => {
        if (error.response) {
            setError({
                message: error.response.data.message || 'An error occurred',
                status: error.response.status,
                statusText: error.response.statusText,
            });
        } else if (error.request) {
            setError({
                message: 'No response received from server',
                status: 'Network Error',
            });
        } else {
            setError({
                message: error.message,
                status: 'Request Error',
            });
        }
        console.error('Full error object:', error);
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