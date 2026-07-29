import { ChevronRight, CloudSun, Car } from "lucide-react";
import { useState } from "react";

/**
 * Bottom info card overlapping the search panel — shows area info,
 * weather, and traffic alerts.
 */
export default function AreaInfoCard() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex-shrink-0 border-t border-gray-100">
      {/* ── "This area" header with weather ── */}
      <div className="px-4 py-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-800">This area</span>
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <CloudSun size={18} className="text-amber-500" />
          <span className="font-medium">31°</span>
        </div>
      </div>

      {/* ── Traffic alert row ── */}
      <button
        onClick={() => setExpanded((p) => !p)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50
                   transition-colors cursor-pointer text-left"
      >
        {/* Red car icon */}
        <span className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
          <Car size={18} className="text-red-600" />
        </span>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 leading-tight">
            Heavy traffic in this area
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            Slower than usual with delays up to 11 min
          </p>
        </div>

        {/* Chevron */}
        <ChevronRight
          size={16}
          className={`text-gray-400 transition-transform duration-200 flex-shrink-0
            ${expanded ? "rotate-90" : ""}`}
        />
      </button>

      {/* ── Expanded traffic details ── */}
      {expanded && (
        <div className="px-4 pb-3 pt-1 space-y-2 animate-in slide-in-from-top-1">
          <TrafficRow color="red" road="Anna Salai" delay="7 min" />
          <TrafficRow color="amber" road="Mount Road" delay="4 min" />
          <TrafficRow color="green" road="OMR Expressway" delay="Normal" />
        </div>
      )}
    </div>
  );
}

function TrafficRow({ color, road, delay }) {
  const dotColor = {
    red: "bg-red-500",
    amber: "bg-amber-500",
    green: "bg-emerald-500",
  }[color];

  return (
    <div className="flex items-center gap-3 pl-16">
      <span className={`w-2 h-2 rounded-full ${dotColor} flex-shrink-0`} />
      <span className="text-xs text-gray-600 flex-1">{road}</span>
      <span className="text-xs text-gray-400">{delay}</span>
    </div>
  );
}
