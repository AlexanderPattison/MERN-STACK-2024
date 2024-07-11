const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// Routes
const authRoutes = require('./authRoutes');
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('MERN Auth API');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});