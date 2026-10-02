import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

function PredictionChart({ predictions }) {
  return (
    <div className="predictions">
      <h2>Parking Availability Predictions (Next 24 Hours)</h2>
      
      <div className="chart-container">
        <h3>Occupancy Rate Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={predictions}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis label={{ value: 'Occupancy Rate', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="occupancyRate"
              stroke="#8884d8"
              strokeWidth={2}
              name="Occupancy Rate"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h3>Available Spots Prediction</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={predictions}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis label={{ value: 'Available Spots', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="availableSpots" fill="#82ca9d" name="Available Spots" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="prediction-insights">
        <h3>Key Insights</h3>
        {predictions.length > 0 && (
          <div className="insights-grid">
            <div className="insight-card">
              <h4>Peak Occupancy</h4>
              <p>
                {predictions.reduce((max, p) => p.occupancyRate > max.occupancyRate ? p : max).time}
              </p>
              <p className="insight-value">
                {(predictions.reduce((max, p) => p.occupancyRate > max.occupancyRate ? p : max).occupancyRate * 100).toFixed(1)}%
              </p>
            </div>
            <div className="insight-card">
              <h4>Lowest Occupancy</h4>
              <p>
                {predictions.reduce((min, p) => p.occupancyRate < min.occupancyRate ? p : min).time}
              </p>
              <p className="insight-value">
                {(predictions.reduce((min, p) => p.occupancyRate < min.occupancyRate ? p : min).occupancyRate * 100).toFixed(1)}%
              </p>
            </div>
            <div className="insight-card">
              <h4>Average Availability</h4>
              <p className="insight-value">
                {Math.round(predictions.reduce((sum, p) => sum + p.availableSpots, 0) / predictions.length)} spots
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PredictionChart;
