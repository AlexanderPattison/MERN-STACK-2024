// src/hooks/useApi.js

import { useState, useCallback } from 'react';
import api from '../utils/api';

const useApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (method, url, data = null, options = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api[method](url, data, options);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      setIsLoading(false);
      let errorMessage = 'An unexpected error occurred';

      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage = err.response.data.message || `Error: ${err.response.status}`;
      } else if (err.request) {
        // The request was made but no response was received
        errorMessage = 'No response received from server';
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage = err.message;
      }

      setError(errorMessage);
      throw new Error(errorMessage);
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
    setError, // Expose setError to allow manual error setting if needed
  };
};

export default useApi;