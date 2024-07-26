// src/components/ItemList.js
import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { FaHeart, FaShoppingCart, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { ThemeContext } from '../contexts/ThemeContext';
import SearchBar from './SearchBar';
import ErrorMessage from './ErrorMessage';
import SkeletonLoader from './SkeletonLoader';
import useAPI from '../hooks/useApi';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

function ItemList({ fetchCounts, isAuthenticated }) {
    const [items, setItems] = useState([]);
    const [currentSearchTerm, setCurrentSearchTerm] = useState('');
    const [wishlist, setWishlist] = useState([]);
    const [cart, setCart] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage] = useState(10);
    const { darkMode } = useContext(ThemeContext);
    const { isLoading, error, get, post, delete: deleteRequest } = useAPI();
    const quantityInputRefs = useRef({});

    const fetchItems = useCallback(async (searchTerm = '', page = 1) => {
        try {
            const response = await get(`/items?search=${searchTerm}&page=${page}&limit=${itemsPerPage}`);
            setItems(response.items);
            setTotalPages(response.totalPages);
            setCurrentPage(Number(response.currentPage));
            setCurrentSearchTerm(searchTerm);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    }, [get, itemsPerPage]);

    const fetchWishlistAndCart = useCallback(async () => {
        if (!isAuthenticated) {
            setWishlist([]);
            setCart({});
            return;
        }

        try {
            const [wishlistResponse, cartResponse] = await Promise.all([
                get('/wishlist'),
                get('/cart')
            ]);

            setWishlist(wishlistResponse.map(item => item._id));

            const cartData = cartResponse.reduce((acc, item) => {
                acc[item.item._id] = item.quantity;
                return acc;
            }, {});
            setCart(cartData);
        } catch (error) {
            console.error('Error fetching wishlist and cart:', error);
        }
    }, [get, isAuthenticated]);

    useEffect(() => {
        fetchItems(currentSearchTerm, currentPage);
        fetchWishlistAndCart();
    }, [fetchItems, fetchWishlistAndCart, isAuthenticated, currentPage, currentSearchTerm]);

    const handleSearch = (searchTerm) => {
        setCurrentPage(1);
        fetchItems(searchTerm, 1);
    };

    const addToWishlist = async (itemId) => {
        try {
            await post('/wishlist/add', { itemId });
            setWishlist([...wishlist, itemId]);
            if (fetchCounts) fetchCounts();
        } catch (error) {
            console.error('Error adding to wishlist:', error);
        }
    };

    const removeFromWishlist = async (itemId) => {
        try {
            await deleteRequest(`/wishlist/${itemId}`);
            setWishlist(wishlist.filter(id => id !== itemId));
            if (fetchCounts) fetchCounts();
        } catch (error) {
            console.error('Error removing from wishlist:', error);
        }
    };

    const addToCart = async (itemId, quantity = 1) => {
        try {
            await post('/cart/add', { itemId, quantity });
            setCart(prevCart => ({
                ...prevCart,
                [itemId]: (prevCart[itemId] || 0) + quantity
            }));
            if (fetchCounts) fetchCounts();
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleAddToCart = (itemId) => {
        const inputElement = quantityInputRefs.current[itemId];
        if (inputElement) {
            const quantity = parseInt(inputElement.value);
            if (quantity > 0) {
                addToCart(itemId, quantity);
            } else {
                alert("Please enter a quantity greater than 0");
            }
        } else {
            console.error('Quantity input element not found');
        }
    };

    return (
        <div className={`item-list ${darkMode ? 'dark-mode' : ''}`}>
            <h2>Items for Sale</h2>
            <SearchBar onSearch={handleSearch} initialSearchTerm={currentSearchTerm} />
            <ErrorMessage message={error?.message} />
            {currentSearchTerm && (
                <p className="search-info">
                    Showing results for: "{currentSearchTerm}"
                    <button onClick={() => handleSearch('')} className="clear-search">Clear search</button>
                </p>
            )}
            <div className="items-grid" role="list">
                {isLoading ? (
                    Array.from({ length: itemsPerPage }).map((_, index) => (
                        <SkeletonLoader key={index} />
                    ))
                ) : items.length > 0 ? (
                    items.map((item) => (
                        <div key={item._id} className="item-card" role="listitem">
                            <LazyLoadImage
                                src={item.imageUrl}
                                alt={item.name}
                                effect="blur"
                                width="100%"
                                height="200px"
                                placeholderSrc="/images/placeholder.png"
                            />
                            <h3>{item.name}</h3>
                            <p>{item.description}</p>
                            <p>Price: ${item.price.toFixed(2)}</p>
                            <div className="item-actions">
                                <button
                                    onClick={() => wishlist.includes(item._id) ? removeFromWishlist(item._id) : addToWishlist(item._id)}
                                    className={`icon-btn wishlist-btn ${wishlist.includes(item._id) ? 'active' : ''}`}
                                    aria-label={wishlist.includes(item._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                                >
                                    <FaHeart />
                                </button>
                                <div className="cart-action">
                                    <input
                                        ref={el => quantityInputRefs.current[item._id] = el}
                                        type="number"
                                        min="1"
                                        defaultValue="1"
                                        className="quantity-input"
                                        aria-label={`Quantity for ${item.name}`}
                                    />
                                    <button
                                        onClick={() => handleAddToCart(item._id)}
                                        className="icon-btn cart-btn"
                                        aria-label={`Add ${item.name} to Cart`}
                                    >
                                        <FaShoppingCart />
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
            <div className="pagination">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-btn"
                    aria-label="Previous page"
                >
                    <FaChevronLeft />
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="pagination-btn"
                    aria-label="Next page"
                >
                    <FaChevronRight />
                </button>
            </div>
        </div>
    );
}

ItemList.propTypes = {
    fetchCounts: PropTypes.func,
    isAuthenticated: PropTypes.bool.isRequired
};

export default ItemList;