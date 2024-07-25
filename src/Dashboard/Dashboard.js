import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAccountDetails, getResourcesPerRegion } from '../api';
import ResourceDetails from './components/ResourceDetails/ResourceDetails';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [accountDetails, setAccountDetails] = useState(null);
  const [regions, setRegions] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState(['Global']);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAccountDetails();
    fetchRegions();
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

  const fetchRegions = async () => {
    try {
      const data = await getResourcesPerRegion();
      const filteredRegions = data.filter(region => region.total_resources > 0);
      setRegions(filteredRegions);
    } catch (error) {
      console.error('Failed to fetch regions:', error);
      setError('Failed to load regions. Please try again later.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  const handleRegionChange = (regionName) => {
    setSelectedRegions(prevSelected => {
      if (regionName === 'Global') {
        return ['Global'];
      }
      const newSelected = prevSelected.includes(regionName)
        ? prevSelected.filter(r => r !== regionName)
        : [...prevSelected.filter(r => r !== 'Global'), regionName];
      return newSelected.length ? newSelected : ['Global'];
    });
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

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
            <h2>{accountDetails.account_id} &gt; {accountDetails.project_name}</h2>
            <div className="region-selector">
              <button onClick={toggleDropdown} className="region-dropdown-toggle">
                Select Regions ({selectedRegions.length})
              </button>
              {isDropdownOpen && (
                <div className="region-dropdown">
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedRegions.includes('Global')}
                      onChange={() => handleRegionChange('Global')}
                    />
                    Global
                  </label>
                  {regions.map(region => (
                    <label key={region.name}>
                      <input
                        type="checkbox"
                        checked={selectedRegions.includes(region.name)}
                        onChange={() => handleRegionChange(region.name)}
                      />
                      {region.name} ({region.total_resources})
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        <div className="selected-regions-box">
          <h4>Selected Regions:</h4>
          <div className="region-tags">
            {selectedRegions.map(region => (
              <span key={region} className="region-tag">{region}</span>
            ))}
          </div>
        </div>
        <ResourceDetails selectedRegions={selectedRegions} />
      </main>
    </div>
  );
}

export default Dashboard;