// backend/controllers/wishlistController.js

const User = require('../models/User');

exports.getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId).populate('wishlist');
        res.json(user.wishlist);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching wishlist' });
    }
};

exports.addToWishlist = async (req, res) => {
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
};

exports.removeFromWishlist = async (req, res) => {
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
};