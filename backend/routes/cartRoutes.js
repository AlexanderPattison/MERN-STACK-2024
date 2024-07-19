// backend/routes/cartRoutes.js

const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.get('/', isAuthenticated, cartController.getCart);
router.post('/add', isAuthenticated, cartController.addToCart);
router.put('/update/:itemId', isAuthenticated, cartController.updateCart);
router.delete('/:itemId', isAuthenticated, cartController.removeFromCart);

module.exports = router;