'use client'

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { ThemeContext } from '../contexts/ThemeContext';
import ErrorMessage from './ErrorMessage';
import LoadingSpinner from './LoadingSpinner';
import useAPI from '../hooks/useApi';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login, isAuthenticated } = useContext(AuthContext);
    const { darkMode } = useContext(ThemeContext);
    const { isLoading, error, setError } = useAPI();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const success = await login({ email, password });
            if (success) {
                navigate('/');
            } else {
                setError('Login failed. Please check your credentials and try again.');
            }
        } catch (err) {
            setError('An error occurred during login. Please try again.');
        }
    };

    if (isAuthenticated) {
        navigate('/');
        return null;
    }

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className={`content-card auth ${darkMode ? 'dark-mode' : ''}`}>
            <h2>Login</h2>
            <ErrorMessage message={error?.message} />
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