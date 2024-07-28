// frontend/src/contexts/AuthContext.js
'use client'

import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const checkAuthStatus = useCallback(async () => {
        try {
            const response = await api.get('/auth/check');
            if (response.data.isAuthenticated) {
                setIsAuthenticated(true);
                const userResponse = await api.get('/auth/me');
                setUser(userResponse.data.data.user);
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
        } catch (error) {
            console.error('Auth check error:', error);
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    const login = async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            if (response.data.status === 'success') {
                setIsAuthenticated(true);
                setUser(response.data.data.user);
                await checkAuthStatus();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            setError(error.response?.data?.message || 'An error occurred during login');
            return false;
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
            setIsAuthenticated(false);
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
            setError('An error occurred during logout');
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, loading, error, login, logout, checkAuthStatus }}>
            {children}
        </AuthContext.Provider>
    );
};