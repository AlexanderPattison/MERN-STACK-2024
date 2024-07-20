const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const csrf = require('csurf');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.use(express.json());

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        httpOnly: true,
    }
}));

// CSRF protection
const csrfProtection = csrf({
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    }
});

// Apply CSRF protection to all routes except the CSRF token route and auth routes
app.use((req, res, next) => {
    if (req.path === '/api/csrf-token' || req.path.startsWith('/api/auth/')) {
        next();
    } else {
        csrfProtection(req, res, next);
    }
});

// CSRF error handler
app.use(function (err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') return next(err);
    res.status(403).json({ message: 'CSRF token validation failed' });
});

// Add a route to get the CSRF token
app.get('/api/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// Routes
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});