import { useState } from "react";
import { motion } from "framer-motion";
import { Search, X, Navigation } from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import buildings from "../data/buildings.json";
import type { Building } from "../types";

const CONTAINER_VARIANTS = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

function FlyTo({ position }: { position: [number, number] | null }) {
  const map = useMap();
  if (position) {
    map.flyTo(position, 16, { duration: 1.2 });
  }
  return null;
}

function CustomMarker({ building }: { building: Building }) {
  return (
    <Marker position={[building.lat, building.lng]}>
      <Popup>
        <div className="p-1">
          <h3 className="font-semibold text-gray-900">{building.name}</h3>
          <p className="text-xs text-gray-500 mt-1">{building.description}</p>
          <p className="text-xs text-blue-600 mt-1 font-medium">{building.workingHours}</p>
        </div>
      </Popup>
    </Marker>
  );
}

export default function CampusMap() {
  const [query, setQuery] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);

  const filteredBuildings = buildings.filter((b) =>
    b.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (building: Building) => {
    setSelectedBuilding(building);
  };

  return (
    <motion.div
      className="flex h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-80 flex-shrink-0 border-r border-gray-200 bg-white/80 backdrop-blur-sm flex flex-col z-10">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Campus Map</h2>
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search buildings..."
              className="w-full pl-9 pr-8 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <motion.ul
            className="space-y-1"
            variants={CONTAINER_VARIANTS}
            initial="hidden"
            animate="show"
          >
            {filteredBuildings.map((b) => (
              <motion.li
                key={b.id}
                variants={ITEM_VARIANTS}
                onClick={() => handleSelect(b)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                  selectedBuilding?.id === b.id
                    ? "bg-blue-50 border border-blue-200"
                    : "hover:bg-gray-50 border border-transparent"
                }`}
              >
                <span className="text-xl">{b.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{b.name}</p>
                  <p className="text-xs text-gray-400 truncate">{b.category}</p>
                </div>
                {selectedBuilding?.id === b.id && (
                  <Navigation size={14} className="text-blue-600 flex-shrink-0" />
                )}
              </motion.li>
            ))}
            {filteredBuildings.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-8">No buildings found</p>
            )}
          </motion.ul>
        </div>
      </div>

      <div className="flex-1 relative">
        <MapContainer
          center={[13.0005, 80.0015]}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FlyTo position={selectedBuilding ? [selectedBuilding.lat, selectedBuilding.lng] : null} />
          {buildings.map((b) => (
            <CustomMarker key={b.id} building={b} />
          ))}
        </MapContainer>
      </div>
    </motion.div>
  );
}
