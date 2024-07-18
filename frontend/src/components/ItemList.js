import React, { useState, useEffect, useContext } from 'react';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import api from '../utils/api';
import { ThemeContext } from '../ThemeContext';
import SearchBar from './SearchBar';

function ItemList({ fetchCounts }) {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentSearchTerm, setCurrentSearchTerm] = useState('');
    const [wishlist, setWishlist] = useState([]);
    const [cart, setCart] = useState({});
    const { darkMode } = useContext(ThemeContext);

    const fetchItems = async (searchTerm = '') => {
        setIsLoading(true);
        try {
            const response = await api.get(`/items?search=${searchTerm}`);
            setItems(response.data);
            setIsLoading(false);
            setCurrentSearchTerm(searchTerm);
        } catch (error) {
            console.error('Error fetching items:', error);
            setError('Failed to fetch items. Please try again later.');
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
        fetchWishlistAndCart();
    }, []);

    const fetchWishlistAndCart = async () => {
        try {
            const wishlistResponse = await api.get('/auth/wishlist');
            setWishlist(wishlistResponse.data.map(item => item._id));

            const cartResponse = await api.get('/auth/cart');
            const cartData = cartResponse.data.reduce((acc, item) => {
                acc[item.item._id] = item.quantity;
                return acc;
            }, {});
            setCart(cartData);
        } catch (error) {
            console.error('Error fetching wishlist and cart:', error);
        }
    };

    const handleSearch = (searchTerm) => {
        fetchItems(searchTerm);
    };

    const addToWishlist = async (itemId) => {
        try {
            await api.post('/auth/wishlist', { itemId });
            setWishlist([...wishlist, itemId]);
            if (fetchCounts) fetchCounts();
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            alert('Failed to add item to wishlist');
        }
    };

    const removeFromWishlist = async (itemId) => {
        try {
            await api.delete(`/auth/wishlist/${itemId}`);
            setWishlist(wishlist.filter(id => id !== itemId));
            if (fetchCounts) fetchCounts();
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            alert('Failed to remove item from wishlist');
        }
    };

    const addToCart = async (itemId, quantity = 1) => {
        try {
            await api.post('/auth/cart', { itemId, quantity });
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

    if (isLoading) return <div>Loading items...</div>;
    if (error) return <div>{error}</div>;

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
            <div className="items-grid">
                {items.length > 0 ? (
                    items.map((item) => (
                        <div key={item._id} className="item-card">
                            <img src={item.imageUrl} alt={item.name} />
                            <h3>{item.name}</h3>
                            <p>{item.description}</p>
                            <p>Price: ${item.price.toFixed(2)}</p>
                            <div className="item-actions">
                                <button
                                    onClick={() => wishlist.includes(item._id) ? removeFromWishlist(item._id) : addToWishlist(item._id)}
                                    className={`wishlist-btn ${wishlist.includes(item._id) ? 'active' : ''}`}
                                >
                                    <FaHeart /> {wishlist.includes(item._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                                </button>
                                <div className="cart-action">
                                    <input
                                        type="number"
                                        min="1"
                                        defaultValue="1"
                                        className="quantity-input"
                                    />
                                    <button onClick={(e) => {
                                        const quantity = parseInt(e.target.previousSibling.value);
                                        addToCart(item._id, quantity);
                                    }} className="cart-btn">
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

export default ItemList;