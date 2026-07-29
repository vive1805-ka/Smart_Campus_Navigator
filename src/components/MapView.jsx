import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import buildings from "../data/buildings";

/**
 * Full-area map view.
 * - `showMarkers` controls whether campus markers are rendered (default: false for clean state).
 */
function MapView({ source, destination, showMarkers = false }) {
  const sourceBuilding = buildings.find((b) => b.name === source);
  const destinationBuilding = buildings.find((b) => b.name === destination);

  return (
    <MapContainer
      center={[11.2735, 77.6062]}
      zoom={14}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Only show markers when explicitly triggered */}
      {showMarkers &&
        buildings.map((building) => (
          <Marker key={building.id} position={building.position}>
            <Popup>{building.name}</Popup>
          </Marker>
        ))}

      {sourceBuilding && destinationBuilding && (
        <Polyline
          positions={[sourceBuilding.position, destinationBuilding.position]}
          color="blue"
        />
      )}
    </MapContainer>
  );
}

export default MapView;