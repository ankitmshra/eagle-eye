import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAccountDetails } from '../api';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [accountDetails, setAccountDetails] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAccountDetails();
  }, []);

  const fetchAccountDetails = async () => {
    try {
      const data = await getAccountDetails();
      setAccountDetails(data[0]);
    } catch (error) {
      console.error('Failed to fetch account details:', error);
      setError('Failed to load account details. Please try again later.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </header>
      <main className="dashboard-content">
        {error && <p className="error-message">{error}</p>}
        {accountDetails && (
          <div className="account-details">
            <h3>{accountDetails.account_id} &gt; {accountDetails.project_name}</h3>
          </div>
        )}
        <h2>Welcome to your dashboard!</h2>
        <p>This is where you can view and manage your content.</p>
      </main>
    </div>
  );
}

export default Dashboard;