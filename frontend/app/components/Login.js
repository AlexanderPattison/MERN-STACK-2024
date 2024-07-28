'use client'

import React, { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../contexts/AuthContext';
import { ThemeContext } from '../contexts/ThemeContext';
import ErrorMessage from './ErrorMessage';
import LoadingSpinner from './LoadingSpinner';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const { login, isAuthenticated } = useContext(AuthContext);
    const { darkMode } = useContext(ThemeContext);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const success = await login({ email, password });
            if (success) {
                router.push('/');
            } else {
                setError('Login failed. Please check your credentials and try again.');
            }
        } catch (err) {
            setError('An error occurred during login. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isAuthenticated) {
        router.push('/');
        return null;
    }

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className={`content-card auth ${darkMode ? 'dark-mode' : ''}`}>
            <h2>Login</h2>
            <ErrorMessage message={error} />
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
}

export default Login;