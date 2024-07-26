// src/components/Wishlist.js
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';
import { ThemeContext } from '../contexts/ThemeContext';
import ErrorMessage from './ErrorMessage';
import LoadingSpinner from './LoadingSpinner';
import useAPI from '../hooks/useApi';

function Wishlist({ fetchCounts }) {
    const [wishlistItems, setWishlistItems] = useState([]);
    const { darkMode } = useContext(ThemeContext);
    const { isLoading, error, get, post, delete: deleteRequest } = useAPI();

    const fetchWishlist = useCallback(async () => {
        try {
            const response = await get('/wishlist');
            setWishlistItems(response);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        }
    }, [get]);

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    const removeFromWishlist = async (itemId) => {
        try {
            await deleteRequest(`/wishlist/${itemId}`);
            setWishlistItems(wishlistItems.filter(item => item._id !== itemId));
            if (fetchCounts) fetchCounts();
        } catch (error) {
            console.error('Error removing from wishlist:', error);
        }
    };

    const addToCart = async (itemId) => {
        try {
            await post('/cart/add', { itemId, quantity: 1 });
            if (fetchCounts) fetchCounts();
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className={`wishlist ${darkMode ? 'dark-mode' : ''}`}>
            <h2>Your Wishlist</h2>
            <ErrorMessage message={error?.message} />
            {wishlistItems.length > 0 ? (
                <ul className="wishlist-items">
                    {wishlistItems.map(item => (
                        <li key={item._id} className="wishlist-item">
                            <img src={item.imageUrl} alt={item.name} />
                            <div className="item-info">
                                <h3>{item.name}</h3>
                                <p>{item.description}</p>
                                <p>Price: ${item.price.toFixed(2)}</p>
                            </div>
                            <div className="item-actions">
                                <button onClick={() => addToCart(item._id)} className="cart-btn">
                                    <FaShoppingCart /> Add to Cart
                                </button>
                                <button onClick={() => removeFromWishlist(item._id)} className="remove-btn" title="Remove from wishlist">
                                    <FaTrash />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Your wishlist is empty.</p>
            )}
        </div>
    );
}

export default Wishlist;