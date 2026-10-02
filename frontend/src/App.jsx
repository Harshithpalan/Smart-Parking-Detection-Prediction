import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import ParkingDashboard from './components/ParkingDashboard';
import AdminPanel from './components/AdminPanel';
import PredictionChart from './components/PredictionChart';
import './App.css';

const socket = io.connect('http://localhost:5000');

function App() {
  const [parkingSpots, setParkingSpots] = useState([]);
  const [stats, setStats] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    // Fetch initial data
    fetchParkingSpots();
    fetchStats();
    fetchPredictions();

    // Socket listeners for real-time updates
    socket.on('parking-update', (data) => {
      setParkingSpots(data);
    });

    socket.on('prediction-update', (data) => {
      setPredictions(data);
    });

    return () => {
      socket.off('parking-update');
      socket.off('prediction-update');
    };
  }, []);

  const fetchParkingSpots = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/parking/spots');
      const data = await response.json();
      setParkingSpots(data);
    } catch (error) {
      console.error('Error fetching parking spots:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/parking/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchPredictions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/predictions');
      const data = await response.json();
      setPredictions(data);
    } catch (error) {
      console.error('Error fetching predictions:', error);
    }
  };

  const toggleSpot = async (spotId) => {
    try {
      await fetch(`http://localhost:5000/api/parking/spots/${spotId}/toggle`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Error toggling spot:', error);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Smart Parking Detection & Prediction</h1>
        <nav className="nav-tabs">
          <button
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={activeTab === 'predictions' ? 'active' : ''}
            onClick={() => setActiveTab('predictions')}
          >
            Predictions
          </button>
          <button
            className={activeTab === 'admin' ? 'active' : ''}
            onClick={() => setActiveTab('admin')}
          >
            Admin Panel
          </button>
        </nav>
      </header>

      <main className="app-main">
        {activeTab === 'dashboard' && (
          <ParkingDashboard
            parkingSpots={parkingSpots}
            stats={stats}
            onToggleSpot={toggleSpot}
          />
        )}
        {activeTab === 'predictions' && (
          <PredictionChart predictions={predictions} />
        )}
        {activeTab === 'admin' && (
          <AdminPanel parkingSpots={parkingSpots} />
        )}
      </main>
    </div>
  );
}

export default App;
