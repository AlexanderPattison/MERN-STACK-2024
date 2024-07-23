// src/hooks/useAuth.js

import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuthStatus = useCallback(async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            setIsAuthenticated(false);
            setUser(null);
            setIsLoading(false);
            return;
        }

        try {
            const response = await api.get('/auth/me');
            setIsAuthenticated(true);
            setUser(response.data);
        } catch (error) {
            console.error('Auth check failed:', error.message);
            setIsAuthenticated(false);
            setUser(null);
            localStorage.removeItem('authToken');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    const login = useCallback(async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            setIsAuthenticated(true);
            setUser(response.data.user);
            localStorage.setItem('authToken', response.data.token);
            return response.data;
        } catch (error) {
            console.error('Login error:', error.message);
            throw error;
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error.message);
        } finally {
            setIsAuthenticated(false);
            setUser(null);
            localStorage.removeItem('authToken');
        }
    }, []);

    return { isAuthenticated, user, isLoading, login, logout, checkAuthStatus };
}