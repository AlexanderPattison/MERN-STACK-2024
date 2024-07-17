import React from 'react';
import ItemList from './ItemList';

function HomePage({ fetchCounts }) {
    return (
        <div className="content-card">
            <h1>Welcome to Our App</h1>
            <ItemList fetchCounts={fetchCounts} />
        </div>
    );
}

export default HomePage;