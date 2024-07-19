const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { isAuthenticated } = require('../middleware/authMiddleware');
const router = express.Router();

function validateEmail(email) {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);
}

router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!validateEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = new User({ email, password });
        await user.save();
        req.session.userId = user._id;
        res.status(201).json({
            message: 'Signup successful',
            user: { id: user._id, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Authentication failed' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            req.session.userId = user._id;
            res.json({
                message: 'Authentication successful',
                user: { id: user._id, email: user.email }
            });
        } else {
            res.status(400).json({ message: 'Authentication failed' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Logout successful' });
    });
});

router.delete('/delete-account', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.session.userId);
        if (!user) {
            return res.status(404).json({ message: 'Not found' });
        }
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: 'Internal server error' });
            }
            res.clearCookie('connect.sid');
            res.json({ message: 'Account deleted' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/me', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/wishlist', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        const { itemId } = req.body;
        if (!user.wishlist.includes(itemId)) {
            user.wishlist.push(itemId);
            await user.save();
        }
        res.json({ message: 'Item added to wishlist' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding item to wishlist' });
    }
});

router.post('/cart', isAuthenticated, async (req, res) => {
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
});

router.get('/wishlist', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId).populate('wishlist');
        res.json(user.wishlist);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching wishlist' });
    }
});

router.delete('/wishlist/:itemId', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        const { itemId } = req.params;
        user.wishlist = user.wishlist.filter(id => id.toString() !== itemId);
        await user.save();
        res.json({ message: 'Item removed from wishlist' });
    } catch (error) {
        console.error('Error removing item from wishlist:', error);
        res.status(500).json({ message: 'Error removing item from wishlist' });
    }
});

router.get('/cart', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId).populate('cart.item');
        res.json(user.cart);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart' });
    }
});

router.put('/cart/:itemId', isAuthenticated, async (req, res) => {
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
});

router.delete('/cart/:itemId', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        const { itemId } = req.params;

        user.cart = user.cart.filter(item => item.item.toString() !== itemId);

        await user.save();
        res.json({ message: 'Item removed from cart' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing item from cart' });
    }
});

module.exports = router;