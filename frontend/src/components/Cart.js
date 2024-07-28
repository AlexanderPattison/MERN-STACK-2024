// src/components/Cart.js
'use client'

import React, { useState, useEffect, useContext, useCallback } from 'react';
import Image from 'next/image';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { ThemeContext } from '../contexts/ThemeContext';
import ErrorMessage from './ErrorMessage';
import LoadingSpinner from './LoadingSpinner';
import useAPI from '../hooks/useApi';

function Cart({ fetchCounts }) {
    const [cartItems, setCartItems] = useState([]);
    const { darkMode } = useContext(ThemeContext);
    const { isLoading, error, get, put, delete: deleteRequest } = useAPI();

    const fetchCart = useCallback(async () => {
        try {
            const response = await get('/cart');
            setCartItems(response);
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    }, [get]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const updateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return; // Prevent decreasing below 1
        try {
            const response = await put(`/cart/update/${itemId}`, { quantity: newQuantity });
            if (response.success) {
                setCartItems(cartItems.map(item =>
                    item.item._id === itemId ? { ...item, quantity: newQuantity } : item
                ));
                if (fetchCounts) fetchCounts();
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            await deleteRequest(`/cart/${itemId}`);
            setCartItems(cartItems.filter(item => item.item._id !== itemId));
            if (fetchCounts) fetchCounts();
        } catch (error) {
            console.error('Error removing from cart:', error);
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.item.price * item.quantity, 0).toFixed(2);
    };

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className={`cart ${darkMode ? 'dark-mode' : ''}`}>
            <h2>Your Cart</h2>
            <ErrorMessage message={error?.message} />
            {cartItems.length > 0 ? (
                <>
                    <ul className="cart-items">
                        {cartItems.map(cartItem => (
                            <li key={cartItem.item._id} className="cart-item">
                                <Image
                                    src={cartItem.item.imageUrl}
                                    alt={cartItem.item.name}
                                    width={80}
                                    height={80}
                                    layout="fixed"
                                />
                                <div className="item-info">
                                    <h3>{cartItem.item.name}</h3>
                                    <p>{cartItem.item.description}</p>
                                    <p>Price: ${cartItem.item.price.toFixed(2)}</p>
                                </div>
                                <div className="quantity-control">
                                    <button
                                        onClick={() => updateQuantity(cartItem.item._id, cartItem.quantity - 1)}
                                        disabled={cartItem.quantity <= 1}
                                    >
                                        <FaMinus />
                                    </button>
                                    <span>{cartItem.quantity}</span>
                                    <button onClick={() => updateQuantity(cartItem.item._id, cartItem.quantity + 1)}>
                                        <FaPlus />
                                    </button>
                                </div>
                                <button onClick={() => removeFromCart(cartItem.item._id)} className="remove-btn" title="Remove from cart">
                                    <FaTrash />
                                </button>
                            </li>
                        ))}
                    </ul>
                    <p className="cart-total">Total: ${calculateTotal()}</p>
                    <button className="checkout-btn">Proceed to Checkout</button>
                </>
            ) : (
                <p>Your cart is empty.</p>
            )}
        </div>
    );
}

export default Cart;