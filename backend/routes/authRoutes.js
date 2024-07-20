const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isAuthenticated } = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');

// Create a limiter for authentication routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many login attempts, please try again later.'
});

// Apply the rate limiter to login and signup routes
router.post('/signup', authLimiter, authController.signup);
router.post('/login', authLimiter, authController.login);
router.post('/logout', authController.logout);
router.delete('/delete-account', isAuthenticated, authController.deleteAccount);
router.get('/me', isAuthenticated, authController.getMe);

module.exports = router;