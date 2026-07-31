import { Marker, Popup } from "react-leaflet";
import { motion } from "framer-motion";
import type { Building } from "../types";

const CATEGORY_COLORS: Record<string, string> = {
  academic: "#3b82f6",
  facility: "#10b981",
  admin: "#8b5cf6",
  hostel: "#f97316",
  sports: "#ef4444",
  food: "#f59e0b",
};

interface CustomMarkerProps {
  building: Building;
  onClick: () => void;
}

export default function CustomMarker({ building, onClick }: CustomMarkerProps) {
  const color = CATEGORY_COLORS[building.category] || "#6b7280";

  const iconHtml = `
    <div style="
      width: 36px;
      height: 36px;
      background: ${color};
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 3px solid white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <span style="
        transform: rotate(45deg);
        font-size: 16px;
        line-height: 1;
      ">${building.icon}</span>
    </div>
  `;

  const icon = new window.L.DivIcon({
    html: iconHtml,
    className: "custom-marker",
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });

  return (
    <Marker
      position={[building.lat, building.lng]}
      icon={icon}
      eventHandlers={{ click: onClick }}
    >
      <Popup>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-1 min-w-[220px]"
        >
          <img
            src={building.image}
            alt={building.name}
            className="w-full h-32 object-cover rounded-lg mb-2"
          />
          <h3 className="font-semibold text-gray-900 text-base">{building.name}</h3>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{building.description}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {building.departments.map((dept) => (
              <span
                key={dept}
                className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600"
              >
                {dept}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
            <span>🕐</span> {building.workingHours}
          </p>
          <div className="flex gap-2 mt-3">
            <button className="flex-1 bg-blue-600 text-white text-xs font-medium py-1.5 rounded-lg hover:bg-blue-700 transition-colors">
              Navigate
            </button>
            <button className="flex-1 border border-gray-200 text-gray-700 text-xs font-medium py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
              View Details
            </button>
          </div>
        </motion.div>
      </Popup>
    </Marker>
  );
}
