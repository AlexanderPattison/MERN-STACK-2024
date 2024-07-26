const mongoose = require('mongoose');
const Item = require('./models/Item');
require('dotenv').config();

const sampleItems = [
    {
        name: "Laptop",
        description: "High-performance laptop with the latest specs",
        price: 999.99,
        imageUrl: "/images/laptop.png"
    },
    {
        name: "Smartphone",
        description: "Latest model with advanced camera features",
        price: 699.99,
        imageUrl: "/images/phone.png"
    },
    {
        name: "Headphones",
        description: "Noise-cancelling wireless headphones",
        price: 199.99,
        imageUrl: "/images/headphones.png"
    },
    {
        name: "Smartwatch",
        description: "Fitness tracker with heart rate monitor",
        price: 249.99,
        imageUrl: "/images/smartwatch.png"
    },
    {
        name: "Tablet",
        description: "Lightweight tablet with long battery life",
        price: 399.99,
        imageUrl: "/images/tablet.png"
    },
    {
        name: "Camera",
        description: "Digital camera with 4K video capability",
        price: 549.99,
        imageUrl: "/images/camera.png"
    },
    {
        name: "Gaming Console",
        description: "Next-gen gaming console for immersive gameplay",
        price: 499.99,
        imageUrl: "/images/console.png"
    },
    {
        name: "Bluetooth Speaker",
        description: "Portable speaker with rich, clear sound",
        price: 79.99,
        imageUrl: "/images/speaker.png"
    },
    {
        name: "E-reader",
        description: "Lightweight e-reader with backlight",
        price: 129.99,
        imageUrl: "/images/ereader.png"
    },
    {
        name: "Wireless Earbuds",
        description: "True wireless earbuds with charging case",
        price: 159.99,
        imageUrl: "/images/earbuds.png"
    },
    {
        name: "Classic Retro Radio",
        description: "This Classic Retro Radio by VintageSound brings you back to the golden age of radio with its nostalgic design and modern technology. It features AM/FM bands, a built-in speaker, and Bluetooth connectivity for streaming your favorite tunes.",
        price: 49.99,
        imageUrl: "/images/radio.png"
    }
];

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected for seeding...'))
    .catch(err => console.log(err));

const seedDB = async () => {
    try {
        await Item.deleteMany({});
        console.log('Deleted all items');

        await Item.insertMany(sampleItems);
        console.log('Sample items inserted');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        mongoose.disconnect();
        console.log('MongoDB disconnected');
    }
};

seedDB();