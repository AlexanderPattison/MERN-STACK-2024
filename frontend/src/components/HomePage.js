import React from 'react';
import ItemList from './ItemList';

function HomePage() {
    return (
        <div className="content-card">
            <h1>Welcome to Our App</h1>
            <ItemList />
        </div>
    );
}

export default HomePage;