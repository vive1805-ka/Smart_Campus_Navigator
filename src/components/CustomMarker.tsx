import { DivIcon } from "leaflet";
import { Marker } from "react-leaflet";
import type { Building } from "../types";
import BuildingPopup from "./BuildingPopup";

const CATEGORY_COLORS: Record<string, string> = {
  academic: "#2563eb",
  facility: "#0f766e",
  admin: "#7c3aed",
  hostel: "#ea580c",
  sports: "#dc2626",
  food: "#ca8a04",
};

interface CustomMarkerProps {
  building: Building;
  isSelected?: boolean;
  isSaved?: boolean;
  onSelect: (building: Building) => void;
  onNavigate?: (building: Building) => void;
  onViewDetails?: (building: Building) => void;
  onToggleSave?: (building: Building) => void;
}

export default function CustomMarker({
  building,
  isSelected = false,
  isSaved = false,
  onSelect,
  onNavigate,
  onViewDetails,
  onToggleSave,
}: CustomMarkerProps) {
  const color = CATEGORY_COLORS[building.category] || "#475569";
  const size = isSelected ? 42 : 36;

  const icon = new DivIcon({
    className: "custom-marker",
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
    html: `
      <div style="
        width:${size}px;
        height:${size}px;
        background:${color};
        border:3px solid white;
        box-shadow:0 16px 30px rgba(15,23,42,0.24);
        border-radius:9999px 9999px 9999px 0;
        transform: rotate(-45deg) scale(${isSelected ? 1.06 : 1});
        display:flex;
        align-items:center;
        justify-content:center;
        transition:transform 180ms ease;
      ">
        <span style="
          transform:rotate(45deg);
          color:white;
          font-size:${isSelected ? "18px" : "16px"};
          line-height:1;
        ">${building.icon}</span>
      </div>
    `,
  });

  return (
    <Marker
      position={[building.lat, building.lng]}
      icon={icon}
      eventHandlers={{
        click: () => onSelect(building),
      }}
    >
      <BuildingPopup
        building={building}
        isSaved={isSaved}
        onNavigate={onNavigate}
        onViewDetails={onViewDetails}
        onToggleSave={onToggleSave}
      />
    </Marker>
  );
}
