// backend/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isAuthenticated } = require('../middleware/authMiddleware');
const { validateSignup, validateLogin } = require('../middleware/validateMiddleware');
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many login attempts, please try again later.'
});

router.post('/signup', authLimiter, validateSignup, authController.signup);
router.post('/login', authLimiter, validateLogin, authController.login);
router.post('/logout', authController.logout);
router.delete('/delete-account', isAuthenticated, authController.deleteAccount);
router.get('/me', isAuthenticated, authController.getMe);
router.get('/check', authController.checkAuth);

module.exports = router;