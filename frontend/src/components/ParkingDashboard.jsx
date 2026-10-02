import { useEffect } from 'react';

function ParkingDashboard({ parkingSpots, stats, onToggleSpot }) {
  useEffect(() => {
    console.log('Parking spots updated:', parkingSpots.length);
  }, [parkingSpots]);

  const zones = ['A', 'B', 'C', 'D'];

  return (
    <div className="dashboard">
      <div className="stats-cards">
        {stats && (
          <>
            <div className="stat-card">
              <h3>Total Spots</h3>
              <p className="stat-value">{stats.totalSpots}</p>
            </div>
            <div className="stat-card">
              <h3>Available</h3>
              <p className="stat-value available">{stats.availableSpots}</p>
            </div>
            <div className="stat-card">
              <h3>Occupied</h3>
              <p className="stat-value occupied">{stats.occupiedSpots}</p>
            </div>
            <div className="stat-card">
              <h3>Occupancy Rate</h3>
              <p className="stat-value">{(stats.occupancyRate * 100).toFixed(1)}%</p>
            </div>
          </>
        )}
      </div>

      <div className="parking-zones">
        {zones.map(zone => (
          <div key={zone} className="zone">
            <h2>Zone {zone}</h2>
            <div className="parking-grid">
              {parkingSpots
                .filter(spot => spot.zone === zone)
                .map(spot => (
                  <div
                    key={spot.id}
                    className={`parking-spot ${spot.isOccupied ? 'occupied' : 'available'}`}
                    onClick={() => onToggleSpot(spot.id)}
                    title={`Spot ${spot.id} - ${spot.isOccupied ? 'Occupied' : 'Available'}`}
                  >
                    <span className="spot-number">{spot.spotNumber}</span>
                    <span className="spot-status">
                      {spot.isOccupied ? '🚗' : '✓'}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <div className="zone-stats">
        {stats && Object.entries(stats.zoneStats).map(([zone, data]) => (
          <div key={zone} className="zone-stat">
            <h4>Zone {zone}</h4>
            <p>Available: {data.total - data.occupied} / {data.total}</p>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${((data.total - data.occupied) / data.total) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ParkingDashboard;
