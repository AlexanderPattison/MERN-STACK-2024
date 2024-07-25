// backend/controllers/itemController.js

const Item = require('../models/Item');

exports.getAllItems = async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;
        let query = {};

        if (search) {
            query = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const totalItems = await Item.countDocuments(query);
        const totalPages = Math.ceil(totalItems / limit);

        const items = await Item.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        res.json({
            items,
            totalPages,
            currentPage: page,
            totalItems
        });
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getItemById = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json(item);
    } catch (error) {
        console.error('Error fetching item by ID:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// You can add more item-related controller functions here as needed
// For example:

exports.createItem = async (req, res) => {
    try {
        const newItem = new Item(req.body);
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        console.error('Error creating item:', error);
        res.status(400).json({ message: 'Error creating item' });
    }
};

exports.updateItem = async (req, res) => {
    try {
        const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json(updatedItem);
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(400).json({ message: 'Error updating item' });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const deletedItem = await Item.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ message: 'Error deleting item' });
    }
};