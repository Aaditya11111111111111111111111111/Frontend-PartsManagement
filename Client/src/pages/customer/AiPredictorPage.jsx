import React, { useState, useEffect } from 'react';
import { customersApi, aiApi } from "../../services/api";

export default function AiPredictorPage() {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const data = await customersApi.getMe();
        const vehicles = data.Vehicles || data.vehicles || [];
        setVehicles(vehicles);
      } catch (err) {
        console.error("Failed to load vehicles:", err);
        setError("Failed to load your vehicles. Please contact support.");
      }
    };
    
    loadVehicles();
  }, []);

  const analyze = async () => {
    if (!selectedVehicle) { setError("Select a vehicle first."); return; }
    setLoading(true); setError("");
    try {
      const result = await aiApi.predict(selectedVehicle);
      setPredictions(result);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="ai-predictor-page">
      <h1>AI Vehicle Parts Predictor</h1>
      
      <div className="vehicle-selector">
        <label>Select Your Vehicle:</label>
        <select 
          value={selectedVehicle} 
          onChange={(e) => setSelectedVehicle(e.target.value)}
        >
          <option value="">Choose a vehicle...</option>
          {vehicles.map(vehicle => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.make} {vehicle.model} ({vehicle.year})
            </option>
          ))}
        </select>
      </div>

      <button 
        onClick={analyze} 
        disabled={!selectedVehicle || loading}
        className="analyze-btn"
      >
        {loading ? "Analyzing..." : "Predict Parts"}
      </button>

      {error && <div className="error">{error}</div>}

      {predictions && (
        <div className="predictions">
          <h2>Predicted Parts:</h2>
          <div className="parts-list">
            {predictions.map((part, index) => (
              <div key={index} className="part-item">
                <h3>{part.name}</h3>
                <p>Probability: {part.probability}%</p>
                <p>Price: ${part.price}</p>
                <p>Description: {part.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
