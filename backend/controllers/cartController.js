// backend/controllers/cartController.js

const User = require('../models/User');

exports.getCart = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId).populate('cart.item');
        res.json(user.cart);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart' });
    }
};

exports.addToCart = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        const { itemId, quantity } = req.body;
        const existingItem = user.cart.find(item => item.item.toString() === itemId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            user.cart.push({ item: itemId, quantity });
        }
        await user.save();
        res.json({ message: 'Item added to cart' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding item to cart' });
    }
};

exports.updateCart = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        const { itemId } = req.params;
        const { quantity } = req.body;

        const cartItem = user.cart.find(item => item.item.toString() === itemId);
        if (cartItem) {
            cartItem.quantity = quantity;
            if (quantity <= 0) {
                user.cart = user.cart.filter(item => item.item.toString() !== itemId);
            }
        }

        await user.save();
        res.json({ message: 'Cart updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating cart' });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        const { itemId } = req.params;

        user.cart = user.cart.filter(item => item.item.toString() !== itemId);

        await user.save();
        res.json({ message: 'Item removed from cart' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing item from cart' });
    }
};