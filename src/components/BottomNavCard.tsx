import { motion } from "framer-motion";
import { Navigation, X, MapPin } from "lucide-react";

interface BottomNavCardProps {
  source?: string;
  destination?: string;
  distance?: string;
  duration?: string;
  onStart: () => void;
  onClear: () => void;
}

export default function BottomNavCard({
  source,
  destination,
  distance,
  duration,
  onStart,
  onClear,
}: BottomNavCardProps) {
  if (!source && !destination) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-3rem)] max-w-lg"
    >
      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-600 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-blue-600" />
            <div className="w-0.5 h-6 bg-gray-300 dark:bg-slate-500 my-1" />
            <div className="w-3 h-3 rounded-full bg-red-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {source || "Current Location"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {destination || "Select destination"}
            </p>
          </div>
          <button
            onClick={onClear}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors flex-shrink-0"
          >
            <X size={16} className="text-gray-400" />
          </button>
        </div>

        {distance && duration && (
          <div className="flex items-center gap-4 mb-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <MapPin size={14} />
              {distance}
            </span>
            <span>•</span>
            <span>{duration} walk</span>
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStart}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          <Navigation size={18} />
          Start Navigation
        </motion.button>
      </div>
    </motion.div>
  );
}
