import { motion } from "framer-motion";
import { Bookmark, MapPin, Navigation, Clock3, Layers3 } from "lucide-react";
import { Popup } from "react-leaflet";
import type { Building } from "../types";

interface BuildingPopupProps {
  building: Building;
  isSaved?: boolean;
  onNavigate?: (building: Building) => void;
  onViewDetails?: (building: Building) => void;
  onToggleSave?: (building: Building) => void;
}

export default function BuildingPopup({
  building,
  isSaved = false,
  onNavigate,
  onViewDetails,
  onToggleSave,
}: BuildingPopupProps) {
  return (
    <Popup className="campus-popup">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-72 overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_rgba(15,23,42,0.18)] dark:bg-slate-900"
      >
        <div className="relative h-36 overflow-hidden">
          <img
            src={building.image}
            alt={building.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-white/80">
              <MapPin size={12} />
              Campus landmark
            </div>
            <h3 className="mt-1 text-lg font-semibold text-white">{building.name}</h3>
          </div>
        </div>

        <div className="space-y-3 p-4">
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {building.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {building.departments.map((department) => (
              <span
                key={department}
                className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 dark:bg-blue-950/70 dark:text-blue-200"
              >
                {department}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-50 p-3 text-xs text-slate-500 dark:bg-slate-800/80 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <Clock3 size={14} />
              <span>{building.workingHours}</span>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <Layers3 size={14} />
              <span>{building.floors} floors</span>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => onNavigate?.(building)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Navigation size={16} />
              Navigate
            </button>
            <button
              type="button"
              onClick={() => onViewDetails?.(building)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              View Details
            </button>
            <button
              type="button"
              onClick={() => onToggleSave?.(building)}
              className={`inline-flex items-center justify-center rounded-2xl border px-3 py-2.5 text-sm font-semibold transition ${
                isSaved
                  ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/50 dark:text-amber-200"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
              aria-label={isSaved ? "Remove bookmark" : "Save bookmark"}
            >
              <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
      </motion.div>
    </Popup>
  );
}
