// backend/routes/wishlistRoutes.js

const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.get('/', isAuthenticated, wishlistController.getWishlist);
router.post('/add', isAuthenticated, wishlistController.addToWishlist);
router.delete('/:itemId', isAuthenticated, wishlistController.removeFromWishlist);

module.exports = router;