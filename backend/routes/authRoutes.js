const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { isAuthenticated } = require('../auth/middleware/authMiddleware');
const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Authentication failed' });
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

module.exports = router;