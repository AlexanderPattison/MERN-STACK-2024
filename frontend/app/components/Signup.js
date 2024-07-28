'use client'

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ThemeContext } from '../contexts/ThemeContext';
import ErrorMessage from './ErrorMessage';
import LoadingSpinner from './LoadingSpinner';
import useAPI from '../hooks/useApi';

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();
    const { darkMode } = useContext(ThemeContext);
    const { isLoading, error, setError, post } = useAPI();

    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return re.test(email);
    };

    const checkPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]+/)) strength++;
        if (password.match(/[A-Z]+/)) strength++;
        if (password.match(/[0-9]+/)) strength++;
        if (password.match(/[$@#&!]+/)) strength++;

        switch (strength) {
            case 0:
            case 1:
                return 'Very Weak';
            case 2:
                return 'Weak';
            case 3:
                return 'Medium';
            case 4:
                return 'Strong';
            case 5:
                return 'Very Strong';
            default:
                return '';
        }
    };

    useEffect(() => {
        setPasswordStrength(checkPasswordStrength(password));
    }, [password]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }
        if (passwordStrength === 'Very Weak' || passwordStrength === 'Weak') {
            setError('Please choose a stronger password');
            return;
        }
        try {
            await post('/auth/signup', { email, password });
            await login({ email, password });
            navigate('/dashboard');
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setError('This email is already registered. Please use a different email or try logging in.');
            } else {
                setError('An error occurred during signup. Please try again.');
            }
        }
    };

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className={`content-card auth ${darkMode ? 'dark-mode' : ''}`}>
            <h2>Sign Up</h2>
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
                {password && <div className={`password-strength ${passwordStrength.toLowerCase().replace(' ', '-')}`}>
                    Password Strength: {passwordStrength}
                </div>}
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Signing up...' : 'Sign Up'}
                </button>
            </form>
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
    );
}

export default Signup;