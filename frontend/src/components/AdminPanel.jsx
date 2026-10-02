import { useState } from 'react';

function AdminPanel({ parkingSpots }) {
  const [selectedZone, setSelectedZone] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const zones = ['all', 'A', 'B', 'C', 'D'];

  const filteredSpots = parkingSpots.filter(spot => {
    const matchesZone = selectedZone === 'all' || spot.zone === selectedZone;
    const matchesSearch = spot.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesZone && matchesSearch;
  });

  const updateSpotStatus = async (spotId, isOccupied) => {
    try {
      await fetch(`http://localhost:5000/api/admin/spots/${spotId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isOccupied })
      });
    } catch (error) {
      console.error('Error updating spot:', error);
    }
  };

  const updateSensorStatus = async (spotId, sensorStatus) => {
    try {
      await fetch(`http://localhost:5000/api/admin/spots/${spotId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sensorStatus })
      });
    } catch (error) {
      console.error('Error updating sensor:', error);
    }
  };

  return (
    <div className="admin-panel">
      <h2>Admin Panel - Parking Management</h2>
      
      <div className="admin-controls">
        <div className="filter-group">
          <label>Filter by Zone:</label>
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
          >
            {zones.map(zone => (
              <option key={zone} value={zone}>
                {zone === 'all' ? 'All Zones' : `Zone ${zone}`}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Search Spot:</label>
          <input
            type="text"
            placeholder="e.g., A-5"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="spots-table">
        <table>
          <thead>
            <tr>
              <th>Spot ID</th>
              <th>Zone</th>
              <th>Status</th>
              <th>Sensor Status</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSpots.map(spot => (
              <tr key={spot.id}>
                <td>{spot.id}</td>
                <td>{spot.zone}</td>
                <td>
                  <span className={`status-badge ${spot.isOccupied ? 'occupied' : 'available'}`}>
                    {spot.isOccupied ? 'Occupied' : 'Available'}
                  </span>
                </td>
                <td>
                  <span className={`sensor-badge ${spot.sensorStatus}`}>
                    {spot.sensorStatus}
                  </span>
                </td>
                <td>{new Date(spot.lastUpdated).toLocaleString()}</td>
                <td>
                  <button
                    className="action-btn"
                    onClick={() => updateSpotStatus(spot.id, !spot.isOccupied)}
                  >
                    Toggle
                  </button>
                  <select
                    className="sensor-select"
                    value={spot.sensorStatus}
                    onChange={(e) => updateSensorStatus(spot.id, e.target.value)}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-summary">
        <h3>Summary</h3>
        <div className="summary-cards">
          <div className="summary-card">
            <h4>Total Spots</h4>
            <p>{parkingSpots.length}</p>
          </div>
          <div className="summary-card">
            <h4>Active Sensors</h4>
            <p>{parkingSpots.filter(s => s.sensorStatus === 'active').length}</p>
          </div>
          <div className="summary-card">
            <h4>Inactive Sensors</h4>
            <p>{parkingSpots.filter(s => s.sensorStatus === 'inactive').length}</p>
          </div>
          <div className="summary-card">
            <h4>Maintenance</h4>
            <p>{parkingSpots.filter(s => s.sensorStatus === 'maintenance').length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
