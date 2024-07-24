// frontend/src/components/ItemList.js
import React, { useState, useEffect, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import api from '../utils/api';
import { ThemeContext } from '../contexts/ThemeContext';
import SearchBar from './SearchBar';

function ItemList({ fetchCounts, isAuthenticated }) {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentSearchTerm, setCurrentSearchTerm] = useState('');
    const [wishlist, setWishlist] = useState([]);
    const [cart, setCart] = useState({});
    const { darkMode } = useContext(ThemeContext);

    const fetchItems = useCallback(async (searchTerm = '') => {
        setIsLoading(true);
        try {
            const response = await api.get(`/items?search=${searchTerm}`);
            setItems(response.data);
            setCurrentSearchTerm(searchTerm);
            setError(null);
        } catch (error) {
            console.error('Error fetching items:', error);
            setError('Failed to fetch items. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchWishlistAndCart = useCallback(async () => {
        if (!isAuthenticated) {
            setWishlist([]);
            setCart({});
            return;
        }

        try {
            const [wishlistResponse, cartResponse] = await Promise.all([
                api.get('/wishlist'),
                api.get('/cart')
            ]);

            setWishlist(wishlistResponse.data.map(item => item._id));

            const cartData = cartResponse.data.reduce((acc, item) => {
                acc[item.item._id] = item.quantity;
                return acc;
            }, {});
            setCart(cartData);
        } catch (error) {
            console.error('Error fetching wishlist and cart:', error);
            // Handle error appropriately, maybe set an error state
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchItems();
        fetchWishlistAndCart();
    }, [fetchItems, fetchWishlistAndCart, isAuthenticated]);

    const handleSearch = (searchTerm) => {
        fetchItems(searchTerm);
    };

    const addToWishlist = async (itemId) => {
        try {
            await api.post('/wishlist/add', { itemId });
            setWishlist([...wishlist, itemId]);
            if (fetchCounts) fetchCounts();
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            alert('Failed to add item to wishlist');
        }
    };

    const removeFromWishlist = async (itemId) => {
        try {
            await api.delete(`/wishlist/${itemId}`);
            setWishlist(wishlist.filter(id => id !== itemId));
            if (fetchCounts) fetchCounts();
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            alert('Failed to remove item from wishlist');
        }
    };

    const addToCart = async (itemId, quantity = 1) => {
        try {
            await api.post('/cart/add', { itemId, quantity });
            setCart(prevCart => ({
                ...prevCart,
                [itemId]: (prevCart[itemId] || 0) + quantity
            }));
            if (fetchCounts) fetchCounts();
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Failed to add item to cart');
        }
    };

    if (isLoading) return <div aria-live="polite">Loading items...</div>;
    if (error) return <div aria-live="assertive">{error}</div>;

    return (
        <div className={`item-list ${darkMode ? 'dark-mode' : ''}`}>
            <h2>Items for Sale</h2>
            <SearchBar onSearch={handleSearch} initialSearchTerm={currentSearchTerm} />
            {currentSearchTerm && (
                <p className="search-info">
                    Showing results for: "{currentSearchTerm}"
                    <button onClick={() => handleSearch('')} className="clear-search">Clear search</button>
                </p>
            )}
            <div className="items-grid" role="list">
                {items.length > 0 ? (
                    items.map((item) => (
                        <div key={item._id} className="item-card" role="listitem">
                            <img src={item.imageUrl} alt={item.name} />
                            <h3>{item.name}</h3>
                            <p>{item.description}</p>
                            <p>Price: ${item.price.toFixed(2)}</p>
                            <div className="item-actions">
                                <button
                                    onClick={() => wishlist.includes(item._id) ? removeFromWishlist(item._id) : addToWishlist(item._id)}
                                    className={`wishlist-btn ${wishlist.includes(item._id) ? 'active' : ''}`}
                                    aria-label={wishlist.includes(item._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                                >
                                    <FaHeart /> {wishlist.includes(item._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                                </button>
                                <div className="cart-action">
                                    <label htmlFor={`quantity-${item._id}`} className="visually-hidden">Quantity</label>
                                    <input
                                        id={`quantity-${item._id}`}
                                        type="number"
                                        min="1"
                                        defaultValue="1"
                                        className="quantity-input"
                                    />
                                    <button
                                        onClick={(e) => {
                                            const quantity = parseInt(e.target.previousSibling.value);
                                            addToCart(item._id, quantity);
                                        }}
                                        className="cart-btn"
                                        aria-label={`Add ${item.name} to Cart`}
                                    >
                                        <FaShoppingCart /> Add to Cart
                                    </button>
                                </div>
                                {cart[item._id] > 0 && <p>In cart: {cart[item._id]}</p>}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No items found. Try a different search term.</p>
                )}
            </div>
        </div>
    );
}

ItemList.propTypes = {
    fetchCounts: PropTypes.func,
    isAuthenticated: PropTypes.bool.isRequired
};

export default ItemList;