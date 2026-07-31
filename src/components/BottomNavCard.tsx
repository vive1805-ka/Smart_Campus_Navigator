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
      className="fixed bottom-6 left-1/2 z-40 w-[calc(100%-3rem)] max-w-lg -translate-x-1/2"
    >
      <div className="rounded-3xl border border-white/60 bg-white/90 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur-2xl dark:border-slate-700 dark:bg-slate-900/90">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex flex-col items-center">
            <div className="h-3 w-3 rounded-full bg-blue-600" />
            <div className="my-1 h-6 w-0.5 bg-slate-300 dark:bg-slate-500" />
            <div className="h-3 w-3 rounded-full bg-red-500" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
              {source || "Current Location"}
            </p>
            <p className="truncate text-sm text-slate-500 dark:text-slate-400">
              {destination || "Select destination"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClear}
            className="flex-shrink-0 rounded-lg p-1.5 transition hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={16} className="text-slate-400" />
          </button>
        </div>

        {distance && duration && (
          <div className="mb-3 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
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
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
        >
          <Navigation size={18} />
          Start Navigation
        </motion.button>
      </div>
    </motion.div>
  );
}
