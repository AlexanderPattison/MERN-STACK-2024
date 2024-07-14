import React, { useState, useEffect } from 'react';
import api from '../utils/api';

function ItemList() {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await api.get('/items');
                setItems(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching items:', error);
                setError('Failed to fetch items. Please try again later.');
                setIsLoading(false);
            }
        };

        fetchItems();
    }, []);

    if (isLoading) return <div>Loading items...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="item-list">
            <h2>Items for Sale</h2>
            <div className="items-grid">
                {items.map((item) => (
                    <div key={item._id} className="item-card">
                        <img src={item.imageUrl} alt={item.name} />
                        <h3>{item.name}</h3>
                        <p>{item.description}</p>
                        <p>Price: ${item.price.toFixed(2)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ItemList;