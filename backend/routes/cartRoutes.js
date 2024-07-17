const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Item = require('../models/Item');
const { isAuthenticated } = require('../auth/middleware/authMiddleware');

// Get user's cart
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId).populate('cart.item');
        res.json(user.cart);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart' });
    }
});

// Add item to cart
router.post('/add/:itemId', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        const item = await Item.findById(req.params.itemId);

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        const cartItemIndex = user.cart.findIndex(cartItem =>
            cartItem.item.toString() === req.params.itemId
        );

        if (cartItemIndex > -1) {
            // Item exists, increment quantity
            user.cart[cartItemIndex].quantity += 1;
        } else {
            // New item, add to cart
            user.cart.push({ item: item._id, quantity: 1 });
        }

        await user.save();
        res.json({ message: 'Item added to cart' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding item to cart' });
    }
});

// Remove item from cart
router.delete('/remove/:itemId', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        user.cart = user.cart.filter(item => item.item.toString() !== req.params.itemId);
        await user.save();
        res.json({ message: 'Item removed from cart' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing item from cart' });
    }
});

// Update item quantity in cart
router.put('/update/:itemId', isAuthenticated, async (req, res) => {
    try {
        const { quantity } = req.body;
        const user = await User.findById(req.session.userId);
        const cartItem = user.cart.find(item => item.item.toString() === req.params.itemId);

        if (cartItem) {
            cartItem.quantity = quantity;
            await user.save();
            res.json({ message: 'Cart updated' });
        } else {
            res.status(404).json({ message: 'Item not found in cart' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating cart' });
    }
});

module.exports = router;