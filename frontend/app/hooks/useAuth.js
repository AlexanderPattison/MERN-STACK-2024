'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '../utils/api';

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const checkAuthStatus = useCallback(async () => {
        if (typeof window !== 'undefined') {
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
            router.push('/dashboard'); // Redirect after successful login
            return response.data;
        } catch (error) {
            console.error('Login error:', error.message);
            throw error;
        }
    }, [router]);

    const logout = useCallback(async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error.message);
        } finally {
            setIsAuthenticated(false);
            setUser(null);
            localStorage.removeItem('authToken');
            router.push('/'); // Redirect to home page after logout
        }
    }, [router]);

    return { isAuthenticated, user, isLoading, login, logout, checkAuthStatus };
}