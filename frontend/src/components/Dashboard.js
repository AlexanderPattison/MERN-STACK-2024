import React, { useState } from 'react';
import axios from 'axios';

function Dashboard({ onDeleteAccount }) {
    const [deleteError, setDeleteError] = useState('');

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete('http://localhost:5000/api/auth/delete-account', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                localStorage.removeItem('token');
                localStorage.removeItem('user');
                onDeleteAccount(); // Call the function passed from App.js
            } catch (error) {
                setDeleteError(error.response?.data?.message || 'An error occurred while deleting the account.');
            }
        }
    };

    return (
        <div className="content-card">
            <h1>Dashboard</h1>
            {/* Add your dashboard content here */}

            <div className="dashboard-actions">
                <button className="delete-account" onClick={handleDeleteAccount}>Delete Account</button>
            </div>
            {deleteError && <p className="error-message">{deleteError}</p>}
        </div>
    );
}

export default Dashboard;