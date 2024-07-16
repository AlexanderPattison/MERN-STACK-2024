import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { ThemeContext } from '../ThemeContext';
import SearchBar from './SearchBar';

function ItemList() {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentSearchTerm, setCurrentSearchTerm] = useState('');
    const { darkMode } = useContext(ThemeContext);

    const fetchItems = async (searchTerm = '') => {
        setIsLoading(true);
        try {
            const response = await api.get(`/items?search=${searchTerm}`);
            setItems(response.data);
            setIsLoading(false);
            setCurrentSearchTerm(searchTerm);
        } catch (error) {
            console.error('Error fetching items:', error);
            setError('Failed to fetch items. Please try again later.');
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleSearch = (searchTerm) => {
        fetchItems(searchTerm);
    };

    if (isLoading) return <div>Loading items...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className={`item-list ${darkMode ? 'dark-mode' : ''}`}>
            <h2>Items for Sale</h2>
            <SearchBar onSearch={handleSearch} initialSearchTerm={currentSearchTerm} />
            {currentSearchTerm && (
                <p className="search-info">
                    Showing results for: "{currentSearchTerm}"
                    <button onClick={() => handleSearch('')} className="clear-search">Clear search</button>
                </p>
            )}
            <div className="items-grid">
                {items.length > 0 ? (
                    items.map((item) => (
                        <div key={item._id} className="item-card">
                            <img src={item.imageUrl} alt={item.name} />
                            <h3>{item.name}</h3>
                            <p>{item.description}</p>
                            <p>Price: ${item.price.toFixed(2)}</p>
                        </div>
                    ))
                ) : (
                    <p>No items found. Try a different search term.</p>
                )}
            </div>
        </div>
    );
}

export default ItemList;