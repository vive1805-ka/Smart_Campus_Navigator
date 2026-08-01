import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import type { BusRoute } from "../types";

interface BusCardProps {
  route: BusRoute;
  onSelect: (id: string) => void;
  isSelected?: boolean;
}

export default function BusCard({ route, onSelect, isSelected }: BusCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(route.id)}
      className={`relative overflow-hidden rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
        isSelected
          ? "border-blue-400 shadow-xl shadow-blue-100 dark:shadow-blue-900/20"
          : "border-gray-100 dark:border-slate-600 bg-white/80 dark:bg-slate-800/80 shadow-lg hover:shadow-xl"
      }`}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-1.5"
        style={{ backgroundColor: route.color }}
      />

      <div className="p-5 pl-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-lg text-white"
              style={{ backgroundColor: route.color }}
            >
              {route.busNumber}
            </span>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-2">
              {route.name}
            </h3>
          </div>
          <MapPin size={18} className="text-gray-400 flex-shrink-0" />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {route.stops.map((stop, idx) => (
            <span
              key={idx}
              className="text-[11px] font-medium px-2 py-1 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300"
            >
              {stop}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span className="font-medium">{route.stops.length} stops</span>
          <span>•</span>
          <span>Click to view schedule</span>
        </div>
      </div>
    </motion.div>
  );
}
