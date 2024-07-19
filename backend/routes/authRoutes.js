// backend/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.delete('/delete-account', isAuthenticated, authController.deleteAccount);
router.get('/me', isAuthenticated, authController.getMe);

module.exports = router;