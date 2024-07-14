import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';

function Signup({ setIsAuthenticated, setUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/signup', { email, password });
            setIsAuthenticated(true);
            setUser(response.data.user);
            navigate('/dashboard');
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred during signup');
        }
    };

    return (
        <div className="content-card auth">
            <h2>Sign Up</h2>
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
                <button type="submit">Sign Up</button>
            </form>
            {error && <p className="error-message">{error}</p>}
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
    );
}

export default Signup;