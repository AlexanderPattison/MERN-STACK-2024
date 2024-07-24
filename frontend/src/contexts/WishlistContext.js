import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../utils/api';
import { AuthContext } from './AuthContext';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated } = useContext(AuthContext);

    const fetchWishlist = useCallback(async () => {
        if (!isAuthenticated) {
            setWishlist([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await api.get('/wishlist');
            if (Array.isArray(response.data)) {
                setWishlist(response.data);
            } else if (response.data && response.data.data && Array.isArray(response.data.data.wishlist)) {
                setWishlist(response.data.data.wishlist);
            } else {
                console.error('Unexpected response format:', response.data);
                setWishlist([]);
            }
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            setError('Failed to fetch wishlist. Please try again.');
            setWishlist([]);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    const addToWishlist = async (itemId) => {
        try {
            await api.post('/wishlist/add', { itemId });
            await fetchWishlist();
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            setError('Failed to add item to wishlist. Please try again.');
            throw error;
        }
    };

    const removeFromWishlist = async (itemId) => {
        try {
            await api.delete(`/wishlist/${itemId}`);
            await fetchWishlist();
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            setError('Failed to remove item from wishlist. Please try again.');
            throw error;
        }
    };

    const clearError = () => setError(null);

    return (
        <WishlistContext.Provider value={{
            wishlist,
            loading,
            error,
            addToWishlist,
            removeFromWishlist,
            fetchWishlist,
            clearError
        }}>
            {children}
        </WishlistContext.Provider>
    );
};