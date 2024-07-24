// frontend/src/components/HomePage.js
import React, { useContext } from 'react';
import ItemList from './ItemList';
import { AuthContext } from '../contexts/AuthContext';

function HomePage({ fetchCounts }) {
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <div className="content-card">
            <h1>Welcome to Our App</h1>
            <ItemList fetchCounts={fetchCounts} isAuthenticated={isAuthenticated} />
        </div>
    );
}

export default HomePage;