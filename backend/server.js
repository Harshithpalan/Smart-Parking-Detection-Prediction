const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Simulated IoT sensor data storage
let parkingSpots = [];
let predictionData = [];

// Initialize parking spots
function initializeParkingSpots() {
  const zones = ['A', 'B', 'C', 'D'];
  zones.forEach(zone => {
    for (let i = 1; i <= 20; i++) {
      parkingSpots.push({
        id: `${zone}-${i}`,
        zone: zone,
        spotNumber: i,
        isOccupied: Math.random() > 0.5,
        lastUpdated: new Date(),
        sensorStatus: 'active'
      });
    }
  });
}

initializeParkingSpots();

// IoT Sensor Simulation
function simulateSensorData() {
  parkingSpots = parkingSpots.map(spot => {
    // Randomly change occupancy status (10% chance)
    if (Math.random() < 0.1) {
      spot.isOccupied = !spot.isOccupied;
      spot.lastUpdated = new Date();
    }
    return spot;
  });

  // Emit real-time updates
  io.emit('parking-update', parkingSpots);
}

// Prediction Analytics
function generatePredictions() {
  const hourlyPredictions = [];
  const now = new Date();
  
  for (let i = 0; i < 24; i++) {
    const hour = new Date(now.getTime() + i * 60 * 60 * 1000);
    const baseOccupancy = 0.5 + 0.3 * Math.sin((i - 6) * Math.PI / 12);
    const randomVariation = (Math.random() - 0.5) * 0.2;
    const predictedOccupancy = Math.max(0, Math.min(1, baseOccupancy + randomVariation));
    
    hourlyPredictions.push({
      time: hour.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      occupancyRate: predictedOccupancy,
      availableSpots: Math.floor(80 * (1 - predictedOccupancy))
    });
  }
  
  predictionData = hourlyPredictions;
}

// API Routes
app.get('/api/parking/spots', (req, res) => {
  res.json(parkingSpots);
});

app.get('/api/parking/stats', (req, res) => {
  const totalSpots = parkingSpots.length;
  const occupiedSpots = parkingSpots.filter(s => s.isOccupied).length;
  const availableSpots = totalSpots - occupiedSpots;
  const occupancyRate = occupiedSpots / totalSpots;
  
  const zoneStats = {};
  parkingSpots.forEach(spot => {
    if (!zoneStats[spot.zone]) {
      zoneStats[spot.zone] = { total: 0, occupied: 0 };
    }
    zoneStats[spot.zone].total++;
    if (spot.isOccupied) {
      zoneStats[spot.zone].occupied++;
    }
  });
  
  res.json({
    totalSpots,
    occupiedSpots,
    availableSpots,
    occupancyRate,
    zoneStats
  });
});

app.get('/api/predictions', (req, res) => {
  res.json(predictionData);
});

app.post('/api/parking/spots/:id/toggle', (req, res) => {
  const { id } = req.params;
  const spot = parkingSpots.find(s => s.id === id);
  
  if (spot) {
    spot.isOccupied = !spot.isOccupied;
    spot.lastUpdated = new Date();
    io.emit('parking-update', parkingSpots);
    res.json(spot);
  } else {
    res.status(404).json({ error: 'Spot not found' });
  }
});

// Admin Routes
app.get('/api/admin/spots', (req, res) => {
  res.json(parkingSpots);
});

app.put('/api/admin/spots/:id', (req, res) => {
  const { id } = req.params;
  const { isOccupied, sensorStatus } = req.body;
  const spot = parkingSpots.find(s => s.id === id);
  
  if (spot) {
    if (isOccupied !== undefined) spot.isOccupied = isOccupied;
    if (sensorStatus !== undefined) spot.sensorStatus = sensorStatus;
    spot.lastUpdated = new Date();
    io.emit('parking-update', parkingSpots);
    res.json(spot);
  } else {
    res.status(404).json({ error: 'Spot not found' });
  }
});

// WebSocket connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.emit('parking-update', parkingSpots);
  socket.emit('prediction-update', predictionData);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start simulation intervals
setInterval(simulateSensorData, 5000); // Update every 5 seconds
setInterval(generatePredictions, 60000); // Update predictions every minute
generatePredictions(); // Initial prediction

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
