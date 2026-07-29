import { useState } from "react";
import Navbar from "../components/Navbar";
import MapView from "../components/MapView";
import buildings from "../data/buildings";

function Home() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");

  return (
    <>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h2>Smart Campus Navigator</h2>

        {/* Source Dropdown */}
        <select
          value={source}
          onChange={(e) => setSource(e.target.value)}
        >
          <option>Select Current Location</option>
          {buildings.map((building) => (
            <option key={building.id}>{building.name}</option>
          ))}
        </select>

        {/* Destination Dropdown */}
        <select
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          style={{ marginLeft: "10px" }}
        >
          <option>Select Destination</option>
          {buildings.map((building) => (
            <option key={building.id}>{building.name}</option>
          ))}
        </select>

        {/* Navigate Button */}
        <button
          style={{ marginLeft: "10px" }}
          onClick={() => alert(`Navigating from ${source} to ${destination}`)}
        >
          Navigate
        </button>

        <br />
        <br />

        {/* Map */}
        <MapView source={source} destination={destination} />

        {/* Add Route Information HERE */}
        <div
          style={{
            padding: "15px",
            background: "#f0f0f0",
            marginTop: "20px",
            borderRadius: "8px",
          }}
        >
          <h3>Route Information</h3>

          <p><b>Distance:</b> 350 meters</p>

          <p><b>Estimated Walking Time:</b> 5 minutes</p>
        </div>

      </div>
    </>
  );
}

export default Home;