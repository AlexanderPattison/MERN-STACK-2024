'use client'

import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

function SearchBar({ onSearch, initialSearchTerm = '' }) {
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
    const { darkMode } = useContext(ThemeContext);

    useEffect(() => {
        setSearchTerm(initialSearchTerm);
    }, [initialSearchTerm]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(searchTerm);
    };

    return (
        <form onSubmit={handleSubmit} className={`search-bar ${darkMode ? 'dark-mode' : ''}`}>
            <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">Search</button>
        </form>
    );
}

export default SearchBar;