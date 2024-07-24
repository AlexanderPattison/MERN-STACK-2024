// backend/controllers/authController.js

const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { BadRequestError, UnauthorizedError, NotFoundError } = require('../utils/customErrors');
const asyncHandler = require('../utils/asyncHandler');

exports.signup = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new BadRequestError('User already exists');
    }

    const user = new User({ email, password });
    await user.save();

    req.session.userId = user._id;
    res.status(201).json({
        status: 'success',
        data: {
            user: { id: user._id, email: user.email }
        }
    });
});

exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new UnauthorizedError('Incorrect email or password');
    }

    req.session.userId = user._id;
    await new Promise((resolve, reject) => {
        req.session.save((err) => {
            if (err) reject(err);
            else resolve();
        });
    });

    res.json({
        status: 'success',
        data: {
            user: { id: user._id, email: user.email }
        }
    });
});

exports.checkAuth = asyncHandler(async (req, res) => {
    if (req.session && req.session.userId) {
        res.json({ isAuthenticated: true });
    } else {
        res.json({ isAuthenticated: false });
    }
});

exports.logout = asyncHandler(async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Session destruction error:', err);
            throw new Error('Could not log out, please try again');
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.json({ status: 'success', message: 'Logged out successfully' });
    });
});

exports.getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.session.userId).select('-password');
    if (!user) {
        throw new NotFoundError('User not found');
    }
    res.json({
        status: 'success',
        data: { user }
    });
});

exports.deleteAccount = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.session.userId);
    if (!user) {
        throw new NotFoundError('User not found');
    }

    req.session.destroy((err) => {
        if (err) {
            console.error('Error deleting session:', err);
            throw new Error('Could not complete account deletion, please try again');
        }
        res.clearCookie('connect.sid');
        res.json({ status: 'success', message: 'Account deleted successfully' });
    });
});