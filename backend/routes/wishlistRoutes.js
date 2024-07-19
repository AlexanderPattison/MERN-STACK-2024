const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Item = require('../models/Item');
const { isAuthenticated } = require('../middleware/authMiddleware');

// Get user's wishlist
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId).populate('wishlist');
        res.json(user.wishlist);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching wishlist' });
    }
});

// Add item to wishlist
router.post('/add/:itemId', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        const item = await Item.findById(req.params.itemId);

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        if (!user.wishlist.includes(item._id)) {
            user.wishlist.push(item._id);
            await user.save();
        }

        res.json({ message: 'Item added to wishlist' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding item to wishlist' });
    }
});

// Remove item from wishlist
router.delete('/remove/:itemId', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.itemId);
        await user.save();
        res.json({ message: 'Item removed from wishlist' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing item from wishlist' });
    }
});

module.exports = router;