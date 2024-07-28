'use client'

import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const { isAuthenticated } = useContext(AuthContext);

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        } else {
            setCart([]);
        }
    }, [isAuthenticated]);

    const fetchCart = async () => {
        try {
            const response = await api.get('/cart');
            if (Array.isArray(response.data)) {
                setCart(response.data);
            } else if (response.data && response.data.data && Array.isArray(response.data.data.cart)) {
                setCart(response.data.data.cart);
            } else {
                console.error('Unexpected response format:', response.data);
                setCart([]);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
            setCart([]);
        }
    };

    const addToCart = async (itemId) => {
        try {
            await api.post('/cart/add', { itemId });
            await fetchCart();
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            await api.delete(`/cart/${itemId}`);
            await fetchCart();
        } catch (error) {
            console.error('Error removing from cart:', error);
            throw error;
        }
    };

    const updateQuantity = async (itemId, quantity) => {
        try {
            await api.put(`/cart/update/${itemId}`, { quantity });
            await fetchCart();
        } catch (error) {
            console.error('Error updating quantity:', error);
            throw error;
        }
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};