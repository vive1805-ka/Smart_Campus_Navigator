import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, Trash2, Plus } from "lucide-react";
import buildings from "../data/buildings.json";
import type { SavedPlace } from "../types";

const SAVED_KEY = "campus_saved_places";

const CONTAINER_VARIANTS = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export default function SavedPlaces() {
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SAVED_KEY);
      if (saved) setSavedPlaces(JSON.parse(saved));
    } catch {}
  }, []);

  const handleDelete = (id: string) => {
    setSavedPlaces((prev) => {
      const next = prev.filter((p) => p.id !== id);
      localStorage.setItem(SAVED_KEY, JSON.stringify(next));
      return next;
    });
  };

  const handleNavigate = (place: SavedPlace) => {
    alert(`Navigate to ${place.name}`);
  };

  const getBuilding = (buildingId: string) => {
    return buildings.find((b) => b.id === buildingId);
  };

  return (
    <motion.div
      className="p-6 max-w-6xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Saved Places</h1>
        <p className="text-gray-500 mt-1">Your bookmarked locations</p>
      </div>

      {savedPlaces.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <MapPin size={28} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No saved places</h3>
          <p className="text-sm text-gray-500 max-w-sm">
            Save your frequently visited places for quick access and navigation.
          </p>
          <button className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
            <Plus size={16} />
            Add Place
          </button>
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={CONTAINER_VARIANTS}
          initial="hidden"
          animate="show"
        >
          {savedPlaces.map((place) => {
            const building = getBuilding(place.buildingId);
            return (
              <motion.div
                key={place.id}
                variants={ITEM_VARIANTS}
                className="rounded-2xl border border-white/40 bg-white/70 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{building?.icon || "📍"}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 truncate">
                        {place.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Saved on {new Date(place.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <button
                      onClick={() => handleNavigate(place)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors"
                    >
                      <Navigation size={14} />
                      Navigate
                    </button>
                    <button
                      onClick={() => handleDelete(place.id)}
                      className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-red-200 text-red-600 text-xs font-medium hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
}
