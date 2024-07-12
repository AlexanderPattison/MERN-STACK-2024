const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

router.get('/', async (req, res) => {
    try {
        const items = await Item.find().limit(10);
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;