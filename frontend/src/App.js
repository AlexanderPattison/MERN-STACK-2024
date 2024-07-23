// App.js

import React, { useState, useEffect, useContext, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import { useAuth } from './hooks/useAuth';
import api from './utils/api';
import Login from './components/Login';
import Signup from './components/Signup';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import Wishlist from './components/Wishlist';
import Cart from './components/Cart';
import PrivateRoute from './components/PrivateRoute';
import { ThemeContext } from './ThemeContext';
import './App.css';

function AppContent() {
    const { isAuthenticated, user, isLoading, logout } = useAuth();
    const [wishlistCount, setWishlistCount] = useState(0);
    const [cartCount, setCartCount] = useState(0);
    const navigate = useNavigate();
    const { darkMode, toggleDarkMode } = useContext(ThemeContext);

    const fetchCounts = useCallback(async () => {
        if (isAuthenticated) {
            try {
                const wishlistResponse = await api.get('/wishlist');
                setWishlistCount(wishlistResponse.data.length);

                const cartResponse = await api.get('/cart');
                setCartCount(cartResponse.data.reduce((total, item) => total + item.quantity, 0));
            } catch (error) {
                console.error('Error fetching counts:', error);
            }
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchCounts();
        } else {
            setWishlistCount(0);
            setCartCount(0);
        }
    }, [isAuthenticated, fetchCounts]);

    useEffect(() => {
        document.body.classList.toggle('dark-mode', darkMode);
    }, [darkMode]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
            <nav>
                <Link to="/">Home</Link>
                <div className="nav-links">
                    {isAuthenticated ? (
                        <>
                            <span title={user?.email}>Hello {user?.email}!</span>
                            <Link to="/dashboard">Dashboard</Link>
                            <Link to="/wishlist" className="icon-link">
                                <FaHeart /> <span>{wishlistCount}</span>
                            </Link>
                            <Link to="/cart" className="icon-link">
                                <FaShoppingCart /> <span>{cartCount}</span>
                            </Link>
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
                <Route path="/" element={<HomePage fetchCounts={fetchCounts} isAuthenticated={isAuthenticated} />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute isAuthenticated={isAuthenticated}>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/wishlist"
                    element={
                        <PrivateRoute isAuthenticated={isAuthenticated}>
                            <Wishlist fetchCounts={fetchCounts} />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/cart"
                    element={
                        <PrivateRoute isAuthenticated={isAuthenticated}>
                            <Cart fetchCounts={fetchCounts} />
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