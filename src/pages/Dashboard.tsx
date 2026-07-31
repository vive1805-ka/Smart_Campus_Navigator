import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Building2,
  Landmark,
  Home,
  Dumbbell,
  UtensilsCrossed,
  Clock,
  Bookmark,
  MapPin,
  Search,
} from "lucide-react";
import buildings from "../data/buildings.json";
import type { Building } from "../types";

const CATEGORIES = [
  { id: "academic", label: "Academic", icon: GraduationCap },
  { id: "facilities", label: "Facilities", icon: Building2 },
  { id: "admin", label: "Admin", icon: Landmark },
  { id: "hostels", label: "Hostels", icon: Home },
  { id: "sports", label: "Sports", icon: Dumbbell },
  { id: "food", label: "Food", icon: UtensilsCrossed },
] as const;

type CategoryId = (typeof CATEGORIES)[number]["id"];

const CATEGORY_MAP: Record<string, CategoryId> = {
  academic: "academic",
  admin: "admin",
  facility: "facilities",
  hostel: "hostels",
  sport: "sports",
  food: "food",
};

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
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

const RECENT_KEY = "campus_recent_searches";
const SAVED_KEY = "campus_saved_places";

export default function Dashboard() {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [savedPlaces, setSavedPlaces] = useState<{ name: string; buildingId: string; createdAt: string }[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SAVED_KEY);
      if (saved) setSavedPlaces(JSON.parse(saved));
    } catch {}
    try {
      const recent = localStorage.getItem(RECENT_KEY);
      if (recent) setRecentSearches(JSON.parse(recent));
    } catch {}
  }, []);

  const categoryCounts = useMemo(() => {
    const counts: Record<CategoryId, number> = {
      academic: 0,
      facilities: 0,
      admin: 0,
      hostels: 0,
      sports: 0,
      food: 0,
    };
    const typedBuildings = buildings as Building[];
    typedBuildings.forEach((b) => {
      const mapped = CATEGORY_MAP[b.category];
      if (mapped) counts[mapped] += 1;
    });
    return counts;
  }, []);

  return (
    <motion.div
      className="p-6 space-y-8 max-w-6xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Explore campus categories and quick access</p>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        variants={CONTAINER_VARIANTS}
        initial="hidden"
        animate="show"
      >
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={cat.id}
              variants={ITEM_VARIANTS}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative overflow-hidden rounded-2xl border border-white/40 bg-white/70 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              <div className="p-5 flex items-start gap-4">
                <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <Icon size={24} strokeWidth={2} />
                </span>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{cat.label}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {categoryCounts[cat.id]} place{categoryCounts[cat.id] !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Clock size={18} className="text-gray-400" />
            Recent Searches
          </h2>
          <div className="rounded-2xl border border-white/40 bg-white/70 backdrop-blur-xl shadow-lg overflow-hidden">
            {recentSearches.length === 0 ? (
              <p className="p-4 text-sm text-gray-400">No recent searches yet</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {recentSearches.slice(0, 5).map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <Search size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-700 truncate">{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Bookmark size={18} className="text-gray-400" />
            Saved Places
          </h2>
          <div className="rounded-2xl border border-white/40 bg-white/70 backdrop-blur-xl shadow-lg overflow-hidden">
            {savedPlaces.length === 0 ? (
              <p className="p-4 text-sm text-gray-400">No saved places yet</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {savedPlaces.slice(0, 5).map((place) => (
                  <li
                    key={place.buildingId}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <MapPin size={16} className="text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 truncate">{place.name}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(place.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </motion.div>
  );
}
