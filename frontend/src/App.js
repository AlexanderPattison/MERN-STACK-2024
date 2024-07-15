import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import api from './utils/api';
import Login from './components/Login';
import Signup from './components/Signup';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import { ThemeContext } from './ThemeContext';
import './App.css';

function AppContent() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const { darkMode, toggleDarkMode } = useContext(ThemeContext);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await api.get('/auth/me');
                setIsAuthenticated(true);
                setUser(response.data);
            } catch (error) {
                setIsAuthenticated(false);
                setUser(null);
            }
        };
        checkAuthStatus();
    }, []);

    useEffect(() => {
        document.body.classList.toggle('dark-mode', darkMode);
    }, [darkMode]);

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
            setIsAuthenticated(false);
            setUser(null);
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
            <nav>
                <Link to="/">Home</Link>
                <div className="nav-links">
                    {isAuthenticated ? (
                        <>
                            <span title={user?.email}>Hello {user?.email}!</span>
                            <Link to="/dashboard">Dashboard</Link>
                            <button onClick={handleLogout}>Logout</button>
                        </>
                    ) : (
                        <Link to="/login">Login</Link>
                    )}
                    <button onClick={toggleDarkMode} className="theme-toggle">
                        {darkMode ? 'Light Mode' : 'Dark Mode'}
                    </button>
                </div>
            </nav>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUser={setUser} />} />
                <Route path="/signup" element={<Signup setIsAuthenticated={setIsAuthenticated} setUser={setUser} />} />
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute isAuthenticated={isAuthenticated}>
                            <Dashboard setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </div>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;