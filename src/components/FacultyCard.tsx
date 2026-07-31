import { motion } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";
import type { Faculty } from "../types";

interface FacultyCardProps {
  faculty: Faculty;
  onNavigate: (id: string) => void;
  isSelected?: boolean;
}

const AVAILABILITY_STYLES: Record<string, string> = {
  available: "bg-emerald-100 text-emerald-700 border-emerald-200",
  "in-class": "bg-amber-100 text-amber-700 border-amber-200",
  meeting: "bg-purple-100 text-purple-700 border-purple-200",
  "not-in-campus": "bg-gray-100 text-gray-500 border-gray-200",
};

export default function FacultyCard({
  faculty,
  onNavigate,
  isSelected,
}: FacultyCardProps) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`rounded-2xl border p-4 transition-all duration-300 ${
        isSelected
          ? "border-blue-400 shadow-xl shadow-blue-100 bg-blue-50/50"
          : "border-gray-100 dark:border-slate-600 bg-white/80 dark:bg-slate-800/80 shadow-lg hover:shadow-xl"
      }`}
    >
      <div className="flex items-start gap-3">
        <img
          src={faculty.image}
          alt={faculty.name}
          className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-slate-600 shadow-sm flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {faculty.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {faculty.department} · {faculty.block}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${AVAILABILITY_STYLES[faculty.availability]}`}
            >
              {faculty.availability.replace(/-/g, " ")}
            </span>
            {faculty.expectedAvailable && (
              <span className="text-[11px] text-gray-400">
                Free by {faculty.expectedAvailable}
              </span>
            )}
          </div>
          <p className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-1">
            <MapPin size={12} />
            Floor {faculty.floor}, Room {faculty.room}
          </p>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onNavigate(faculty.id)}
        className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
      >
        <Navigation size={14} />
        Navigate to Cabin
      </motion.button>
    </motion.div>
  );
}
