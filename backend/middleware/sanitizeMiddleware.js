// backend/middleware/sanitizeMiddleware.js

const xss = require('xss');

const sanitizeInput = (obj) => {
    if (Array.isArray(obj)) {
        return obj.map(v => sanitizeInput(v));
    } else if (typeof obj === 'object' && obj !== null) {
        for (let key in obj) {
            obj[key] = sanitizeInput(obj[key]);
        }
        return obj;
    } else if (typeof obj === 'string') {
        return xss(obj);
    } else {
        return obj;
    }
};

const sanitize = (req, res, next) => {
    req.body = sanitizeInput(req.body);
    req.query = sanitizeInput(req.query);
    req.params = sanitizeInput(req.params);
    next();
};

module.exports = sanitize;