import React, { useState, useEffect } from 'react';

function SearchBar({ onSearch, initialSearchTerm = '' }) {
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

    useEffect(() => {
        setSearchTerm(initialSearchTerm);
    }, [initialSearchTerm]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(searchTerm);
    };

    return (
        <form onSubmit={handleSubmit} className="search-bar">
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