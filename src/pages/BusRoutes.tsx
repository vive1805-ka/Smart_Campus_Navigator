import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Clock, Bell } from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import busRoutes from "../data/busRoutes.json";
import busStops from "../data/busStops.json";
import busSchedule from "../data/busSchedule.json";
import type { BusRoute, BusStop, BusSchedule, TimeSlot } from "../types";

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
    map.flyTo(position, 15, { duration: 1 });
  }
  return null;
}

function BusMap({ route }: { route: BusRoute | null }) {
  const stops = useMemo(() => {
    if (!route) return [];
    return route.stops
      .map((name) => busStops.find((s) => s.name === name))
      .filter((s): s is BusStop => Boolean(s));
  }, [route]);

  const center = useMemo(() => {
    if (stops.length === 0) return [13.0012, 80.0005];
    const lat = stops.reduce((sum, s) => sum + s.lat, 0) / stops.length;
    const lng = stops.reduce((sum, s) => sum + s.lng, 0) / stops.length;
    return [lat, lng];
  }, [stops]);

  return (
    <MapContainer
      center={center as [number, number]}
      zoom={14}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {route && (
        <FlyTo position={[route.stops.length > 0 ? busStops.find((s) => s.name === route.stops[0])?.lat || 13.0012 : 13.0012, route.stops.length > 0 ? busStops.find((s) => s.name === route.stops[0])?.lng || 80.0005 : 80.0005]} />
      )}
      {stops.map((stop) => (
        <Marker key={stop.id} position={[stop.lat, stop.lng]}>
          <Popup>{stop.name}</Popup>
        </Marker>
      ))}
      {stops.length > 1 && (
        <Polyline positions={stops.map((s) => [s.lat, s.lng])} color={route?.color || "#3b82f6"} />
      )}
    </MapContainer>
  );
}

export default function BusRoutes() {
  const [query, setQuery] = useState("");
  const [selectedRoute, setSelectedRoute] = useState<BusRoute | null>(null);
  const [showTimetable, setShowTimetable] = useState<string | null>(null);

  const typedRoutes = busRoutes as BusRoute[];
  const typedSchedule = busSchedule as BusSchedule[];

  const filteredRoutes = useMemo(() => {
    if (!query.trim()) return typedRoutes;
    const q = query.toLowerCase();
    return typedRoutes.filter(
      (r) =>
        r.busNumber.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.stops.some((s) => s.toLowerCase().includes(q))
    );
  }, [query, typedRoutes]);

  const getSchedule = (routeId: string): BusSchedule | undefined => {
    return typedSchedule.find((s) => s.routeId === routeId);
  };

  const arrivingSoon = useMemo(() => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    for (const schedule of typedSchedule) {
      for (const slot of schedule.morning) {
        const [time, modifier] = slot.time.split(" ");
        const [hours, minutes] = time.split(":").map(Number);
        const slotMinutes = (modifier === "PM" && hours !== 12 ? hours + 12 : hours) * 60 + minutes;
        if (slotMinutes >= currentMinutes && slotMinutes - currentMinutes <= 10) {
          return { ...slot, routeId: schedule.routeId };
        }
      }
    }
    return null;
  }, [typedSchedule]);

  return (
    <motion.div
      className="p-6 max-w-6xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Bus Routes</h1>
        <p className="text-gray-500 mt-1">Explore campus bus routes and schedules</p>
      </div>

      {arrivingSoon && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl border border-emerald-200 bg-emerald-50/80 backdrop-blur flex items-center gap-3"
        >
          <Bell size={20} className="text-emerald-600" />
          <div>
            <p className="text-sm font-semibold text-gray-900">Bus arriving soon</p>
            <p className="text-xs text-gray-500">
              Bus at {arrivingSoon.stop} around {arrivingSoon.time}
            </p>
          </div>
        </motion.div>
      )}

      <div className="relative mb-6">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search bus number or stop..."
          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white/80 backdrop-blur focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            variants={CONTAINER_VARIANTS}
            initial="hidden"
            animate="show"
          >
            {filteredRoutes.map((route) => {
              const schedule = getSchedule(route.id);
              const nextBus = schedule?.morning.find((slot: TimeSlot) => {
                const now = new Date();
                const current = now.getHours() * 60 + now.getMinutes();
                const [time, modifier] = slot.time.split(" ");
                const [hours, minutes] = time.split(":").map(Number);
                const slotMins = (modifier === "PM" && hours !== 12 ? hours + 12 : hours) * 60 + minutes;
                return slotMins > current;
              });

              return (
                <motion.div
                  key={route.id}
                  variants={ITEM_VARIANTS}
                  onClick={() => setSelectedRoute(route)}
                  className={`rounded-2xl border p-4 cursor-pointer transition-all ${
                    selectedRoute?.id === route.id
                      ? "border-blue-400 bg-blue-50/80 shadow-lg shadow-blue-100"
                      : "border-white/40 bg-white/70 backdrop-blur-xl shadow-md hover:shadow-xl"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: route.color }}
                    />
                    <h3 className="text-sm font-semibold text-gray-900">{route.name}</h3>
                  </div>
                  <p className="text-xs text-gray-500 font-mono mb-2">{route.busNumber}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <MapPin size={12} />
                    <span className="truncate">{route.stops.length} stops</span>
                  </div>
                  {nextBus && (
                    <p className="text-xs text-blue-600 mt-2 font-medium">Next: {nextBus.time}</p>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowTimetable(showTimetable === route.id ? null : route.id);
                    }}
                    className="mt-3 text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                  >
                    <Clock size={12} />
                    Timetable
                  </button>
                  {showTimetable === route.id && schedule && (
                    <div className="mt-3 space-y-2">
                      {["morning", "afternoon", "evening"].map((period) => {
                        const slots = schedule[period as "morning" | "afternoon" | "evening"];
                        return (
                          <div key={period}>
                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                              {period}
                            </p>
                            <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                              {slots.map((slot: TimeSlot, idx: number) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between text-xs py-1 px-2 rounded bg-gray-50"
                                >
                                  <span className="text-gray-700">{slot.stop}</span>
                                  <span className="text-gray-400 font-mono">{slot.time}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              );
            })}
            {filteredRoutes.length === 0 && (
              <p className="col-span-full text-center text-gray-400 py-12">No routes found</p>
            )}
          </motion.div>
        </div>

        <div className="h-[500px] rounded-2xl overflow-hidden border border-white/40 bg-white/70 backdrop-blur-xl shadow-lg">
          <BusMap route={selectedRoute} />
        </div>
      </div>
    </motion.div>
  );
}
