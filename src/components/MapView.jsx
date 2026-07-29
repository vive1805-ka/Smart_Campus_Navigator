import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import buildings from "../data/buildings";

function MapView({ source, destination }) {

  const sourceBuilding = buildings.find(
    (b) => b.name === source
  );

  const destinationBuilding = buildings.find(
    (b) => b.name === destination
  );

  return (
    <MapContainer
      center={[11.2735,77.6062]}
      zoom={17}
      style={{height:"600px",width:"100%"}}
    >

      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {buildings.map((building)=>(
        <Marker
          key={building.id}
          position={building.position}
        >
          <Popup>{building.name}</Popup>
        </Marker>
      ))}

      {sourceBuilding && destinationBuilding && (
        <Polyline
          positions={[
            sourceBuilding.position,
            destinationBuilding.position
          ]}
          color="blue"
        />
      )}

    </MapContainer>
  );
}

export default MapView;