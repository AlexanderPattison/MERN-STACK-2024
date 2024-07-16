import React from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

function Dashboard({ setIsAuthenticated, setUser }) {
    const navigate = useNavigate();

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            try {
                await api.delete('/auth/delete-account');
                setIsAuthenticated(false);
                setUser(null);
                navigate('/');
            } catch (error) {
                alert('Failed to delete account. Please try again.');
            }
        }
    };

    return (
        <div className="content-card">
            <h1>Dashboard</h1>
            {/* Add your dashboard content here */}
            <div>
                <button className="delete-account-btn" onClick={handleDeleteAccount}>Delete Account</button>
            </div>
        </div>
    );
}

export default Dashboard;