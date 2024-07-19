// frontend/src/components/Cart.js

import React, { useState, useEffect } from 'react';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import api from '../utils/api';

function Cart({ fetchCounts }) {
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const response = await api.get('/cart');
            setCartItems(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching cart:', error);
            setError('Failed to fetch cart. Please try again later.');
            setIsLoading(false);
        }
    };

    const updateQuantity = async (itemId, newQuantity) => {
        try {
            await api.put(`/cart/${itemId}`, { quantity: newQuantity });
            setCartItems(cartItems.map(item =>
                item.item._id === itemId ? { ...item, quantity: newQuantity } : item
            ));
            if (fetchCounts) fetchCounts();
        } catch (error) {
            console.error('Error updating quantity:', error);
            alert('Failed to update quantity');
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            await api.delete(`/cart/${itemId}`);
            setCartItems(cartItems.filter(item => item.item._id !== itemId));
            if (fetchCounts) fetchCounts();
        } catch (error) {
            console.error('Error removing from cart:', error);
            alert('Failed to remove item from cart');
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.item.price * item.quantity, 0).toFixed(2);
    };

    if (isLoading) return <div>Loading cart...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="cart">
            <h2>Your Cart</h2>
            {cartItems.length > 0 ? (
                <>
                    <ul className="cart-items">
                        {cartItems.map(cartItem => (
                            <li key={cartItem.item._id} className="cart-item">
                                <img src={cartItem.item.imageUrl} alt={cartItem.item.name} />
                                <div className="item-info">
                                    <h3>{cartItem.item.name}</h3>
                                    <p>{cartItem.item.description}</p>
                                    <p>Price: ${cartItem.item.price.toFixed(2)}</p>
                                </div>
                                <div className="quantity-control">
                                    <button onClick={() => updateQuantity(cartItem.item._id, cartItem.quantity - 1)} disabled={cartItem.quantity <= 1}>
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