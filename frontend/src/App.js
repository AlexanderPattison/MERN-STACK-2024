import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { ThemeProvider, ThemeContext } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './components/Login';
import Signup from './components/Signup';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import Wishlist from './components/Wishlist';
import Cart from './components/Cart';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import './App.css';

function AppContent() {
    const { isAuthenticated, user, logout, loading } = useContext(AuthContext);
    const { darkMode, toggleDarkMode } = useContext(ThemeContext);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <ErrorBoundary>
                <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
                    <nav>
                        <Link to="/">Home</Link>
                        <div className="nav-links">
                            {isAuthenticated ? (
                                <>
                                    <span>Hello {user?.email}!</span>
                                    <Link to="/dashboard">Dashboard</Link>
                                    <Link to="/wishlist" className="icon-link">
                                        <FaHeart />
                                    </Link>
                                    <Link to="/cart" className="icon-link">
                                        <FaShoppingCart />
                                    </Link>
                                    <button onClick={logout}>Logout</button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login">Login</Link>
                                    <Link to="/signup">Signup</Link>
                                </>
                            )}
                            <button onClick={toggleDarkMode} className="theme-toggle">
                                {darkMode ? 'Light Mode' : 'Dark Mode'}
                            </button>
                        </div>
                    </nav>

                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route
                            path="/login"
                            element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
                        />
                        <Route
                            path="/signup"
                            element={!isAuthenticated ? <Signup /> : <Navigate to="/" />}
                        />
                        <Route
                            path="/dashboard"
                            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
                        />
                        <Route
                            path="/wishlist"
                            element={isAuthenticated ? <Wishlist /> : <Navigate to="/login" />}
                        />
                        <Route
                            path="/cart"
                            element={isAuthenticated ? <Cart /> : <Navigate to="/login" />}
                        />
                    </Routes>
                </div>
            </ErrorBoundary>
        </Router>
    );
}

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <WishlistProvider>
                    <CartProvider>
                        <AppContent />
                    </CartProvider>
                </WishlistProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;