# Smart Parking Detection & Prediction

A full-stack web application for real-time parking spot detection and prediction analytics using IoT sensor simulation.

## Features

- **Real-time Detection**: Live parking spot status updates via IoT sensor simulation
- **Prediction Analytics**: ML-based predictions for parking availability over the next 24 hours
- **User Dashboard**: Interactive visualization of parking spots across multiple zones
- **Admin Panel**: Management interface for parking lot operators
- **Real-time Updates**: WebSocket integration for instant data synchronization

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Real-time Communication**: Socket.io
- **Data Visualization**: Recharts
- **Styling**: CSS3 with modern gradients and animations

## Project Structure

```
Smart Parking Detection & Prediction/
├── backend/
│   ├── server.js          # Express server with Socket.io
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ParkingDashboard.jsx
│   │   │   ├── PredictionChart.jsx
│   │   │   └── AdminPanel.jsx
│   │   ├── App.jsx
│   │   └── App.css
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Backend Setup**:
```bash
cd backend
npm install
```

2. **Frontend Setup**:
```bash
cd frontend
npm install
```

### Running the Application

1. **Start the Backend Server**:
```bash
cd backend
npm start
```
The backend will run on `http://localhost:5000`

2. **Start the Frontend Development Server**:
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:5173`

3. **Access the Application**:
Open your browser and navigate to `http://localhost:5173`

## API Endpoints

### Parking Data
- `GET /api/parking/spots` - Get all parking spots
- `GET /api/parking/stats` - Get parking statistics
- `POST /api/parking/spots/:id/toggle` - Toggle spot occupancy

### Predictions
- `GET /api/predictions` - Get 24-hour parking predictions

### Admin
- `GET /api/admin/spots` - Get all spots for admin
- `PUT /api/admin/spots/:id` - Update spot configuration

## WebSocket Events

### Client → Server
- Connection established automatically

### Server → Client
- `parking-update` - Real-time parking spot updates
- `prediction-update` - Updated prediction data

## Features Overview

### Dashboard Tab
- Visual grid of parking spots across 4 zones (A, B, C, D)
- Real-time occupancy status (green = available, red = occupied)
- Statistics cards showing total, available, and occupied spots
- Zone-wise availability progress bars
- Click on spots to toggle occupancy

### Predictions Tab
- Line chart showing occupancy rate over 24 hours
- Bar chart showing available spots prediction
- Key insights including peak/lowest occupancy times
- Average availability statistics

### Admin Panel Tab
- Filter spots by zone
- Search functionality for specific spots
- Toggle spot occupancy status
- Manage sensor status (active/inactive/maintenance)
- Summary statistics for sensor health

## IoT Sensor Simulation

The backend simulates IoT sensor data with:
- 80 parking spots across 4 zones (20 per zone)
- Random occupancy changes every 5 seconds
- Prediction updates every minute
- Sensor status tracking

## Future Enhancements

- Connect to real IoT sensors
- Integrate with actual camera feeds for computer vision
- Add user authentication
- Implement database persistence (MongoDB/PostgreSQL)
- Add mobile app support
- Implement advanced ML models for predictions
- Add payment integration for paid parking

## License

ISC
