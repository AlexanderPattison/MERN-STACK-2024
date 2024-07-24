import React, { useState, useEffect, useContext } from 'react';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';
import api from '../utils/api';
import { ThemeContext } from '../contexts/ThemeContext';

function Wishlist({ fetchCounts }) {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { darkMode } = useContext(ThemeContext);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const response = await api.get('/wishlist');
            setWishlistItems(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            setError('Failed to fetch wishlist. Please try again later.');
            setIsLoading(false);
        }
    };

    const removeFromWishlist = async (itemId) => {
        try {
            await api.delete(`/wishlist/${itemId}`);
            setWishlistItems(wishlistItems.filter(item => item._id !== itemId));
            if (fetchCounts) fetchCounts();
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            alert('Failed to remove item from wishlist');
        }
    };

    const addToCart = async (itemId) => {
        try {
            await api.post('/cart/add', { itemId, quantity: 1 });
            alert('Item added to cart');
            if (fetchCounts) fetchCounts();
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Failed to add item to cart');
        }
    };

    if (isLoading) return <div>Loading wishlist...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className={`wishlist ${darkMode ? 'dark-mode' : ''}`}>
            <h2>Your Wishlist</h2>
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