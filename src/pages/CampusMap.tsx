import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Bookmark,
  Clock3,
  Layers3,
  MapPinned,
  Navigation,
  Route,
  Search,
} from "lucide-react";
import {
  MapContainer as LeafletMap,
  Polyline,
  TileLayer,
  useMap,
} from "react-leaflet";
import { useLocation } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import BottomNavCard from "../components/BottomNavCard";
import CustomMarker from "../components/CustomMarker";
import TurnByTurnCard from "../components/TurnByTurnCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { useAppContext } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";
import { campusBuildings, getCampusBuildingByName } from "../data/campusData";
import { calculateRoute } from "../services/navigationService";
import type { Building } from "../types";
import { generateId } from "../utils/helpers";

const DEFAULT_CENTER: [number, number] = [13.0018, 80.0021];
const DEFAULT_SOURCE = "Main Gate";

function FlyTo({ position }: { position: [number, number] | null }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, Math.max(map.getZoom(), 16), { duration: 1.1 });
    }
  }, [map, position]);

  return null;
}

function formatDepartmentList(building: Building) {
  if (building.departments.length === 0) {
    return "General campus facility";
  }
  return building.departments.join(" • ");
}

export default function CampusMap() {
  const { theme } = useTheme();
  const { recentSearches, addRecentSearch, savedPlaces, addSavedPlace, removeSavedPlace } =
    useAppContext();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [sourceName, setSourceName] = useState(DEFAULT_SOURCE);
  const [destinationName, setDestinationName] = useState<string>("Library");
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [routeInfo, setRouteInfo] = useState<{
    distance: string;
    duration: string;
    instructions: string[];
    coordinates: [number, number][];
  } | null>(null);
  const [isRouteLoading, setIsRouteLoading] = useState(false);
  const [focusedPoint, setFocusedPoint] = useState<[number, number] | null>(DEFAULT_CENTER);
  const [currentStep, setCurrentStep] = useState(0);

  const recentLabels = useMemo(
    () => recentSearches.map((item) => item.text),
    [recentSearches]
  );

  const sourceBuilding = useMemo(
    () => getCampusBuildingByName(sourceName) ?? campusBuildings[0],
    [sourceName]
  );

  const destinationBuilding = useMemo(
    () => getCampusBuildingByName(destinationName) ?? selectedBuilding,
    [destinationName, selectedBuilding]
  );

  const mapBuildings = useMemo(() => {
    const filtered = campusBuildings.filter((building) => {
      if (!query.trim()) {
        return true;
      }

      const needle = query.toLowerCase();
      const haystack = [
        building.name,
        building.description,
        building.category,
        ...(building.aliases ?? []),
        ...building.departments,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(needle);
    });

    return filtered;
  }, [query]);

  useEffect(() => {
    let active = true;

    async function runRouteLookup() {
      if (!sourceBuilding || !destinationBuilding) {
        setRouteInfo(null);
        return;
      }

      setIsRouteLoading(true);
      const result = await calculateRoute(sourceBuilding.name, destinationBuilding.name);

      if (!active) {
        return;
      }

      setRouteInfo(result);
      setCurrentStep(0);
      setIsRouteLoading(false);

      if (result?.coordinates?.length) {
        setFocusedPoint(result.coordinates[0]);
      }
    }

    runRouteLookup();

    return () => {
      active = false;
    };
  }, [sourceBuilding, destinationBuilding]);

  const isSaved = selectedBuilding
    ? savedPlaces.some((place) => place.buildingId === selectedBuilding.id)
    : false;

  const handleSelectBuilding = (building: Building) => {
    setSelectedBuilding(building);
    setDestinationName(building.name);
    setFocusedPoint([building.lat, building.lng]);
    addRecentSearch({
      id: generateId(),
      text: building.name,
      type: "place",
      buildingId: building.id,
    });
  };

  const handleBookmark = (building: Building) => {
    const existing = savedPlaces.find((place) => place.buildingId === building.id);
    if (existing) {
      removeSavedPlace(existing.id);
      return;
    }

    addSavedPlace({
      id: generateId(),
      name: building.name,
      buildingId: building.id,
      createdAt: new Date().toISOString(),
    });
  };

  const handleNavigate = (building: Building) => {
    handleSelectBuilding(building);
    setFocusedPoint([building.lat, building.lng]);
  };

  const tileUrl =
    theme === "dark"
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  useEffect(() => {
    const state = location.state as { destination?: string; highlight?: string } | null;
    if (state?.destination) {
      const building = getCampusBuildingByName(state.destination);
      if (building) {
        setSelectedBuilding(building);
        setDestinationName(building.name);
        setFocusedPoint([building.lat, building.lng]);
      }
    }
  }, [location.state]);

  return (
    <motion.div
      className="flex h-full flex-col gap-4 p-4 lg:h-[calc(100vh-64px)] lg:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <div className="grid flex-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)_320px]">
        <aside className="space-y-4 overflow-hidden rounded-[28px] border border-white/60 bg-white/70 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.14)] backdrop-blur-2xl dark:border-slate-700 dark:bg-slate-900/80">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700 dark:bg-blue-950/60 dark:text-blue-200">
              <MapPinned size={12} />
              Campus map
            </p>
            <h1 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">
              Find any building in seconds
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Search, route, bookmark, and jump between locations with live campus data.
            </p>
          </div>

          <SearchBar
            query={query}
            onQueryChange={setQuery}
            buildings={campusBuildings}
            recentSearches={recentLabels}
            onSelectBuilding={handleSelectBuilding}
            onSelectRecent={(value) => {
              const building = getCampusBuildingByName(value);
              setQuery(value);
              if (building) {
                handleSelectBuilding(building);
              }
            }}
          />

          <div className="grid grid-cols-1 gap-3">
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Source
              </span>
              <select
                value={sourceName}
                onChange={(event) => setSourceName(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-900/40"
              >
                {campusBuildings.map((building) => (
                  <option key={building.id} value={building.name}>
                    {building.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Destination
              </span>
              <select
                value={destinationName}
                onChange={(event) => {
                  setDestinationName(event.target.value);
                  const building = getCampusBuildingByName(event.target.value);
                  if (building) {
                    setSelectedBuilding(building);
                    setFocusedPoint([building.lat, building.lng]);
                  }
                }}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-900/40"
              >
                {campusBuildings.map((building) => (
                  <option key={building.id} value={building.name}>
                    {building.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/80">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Route status</p>
              <Route size={16} className="text-blue-600" />
            </div>
            {isRouteLoading ? (
              <div className="mt-4 space-y-3">
                <LoadingSkeleton height="h-4" />
                <LoadingSkeleton height="h-4" width="w-4/5" />
                <LoadingSkeleton height="h-4" width="w-3/5" />
              </div>
            ) : routeInfo ? (
              <div className="mt-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white p-3 shadow-sm dark:bg-slate-900/70">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                      Distance
                    </p>
                    <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                      {routeInfo.distance}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white p-3 shadow-sm dark:bg-slate-900/70">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                      Walking time
                    </p>
                    <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                      {routeInfo.duration}
                    </p>
                  </div>
                </div>
                <TurnByTurnCard steps={routeInfo.instructions} currentStep={currentStep} />
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                Choose a destination to generate a campus path.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Quick picks
            </p>
            <div className="flex flex-wrap gap-2">
              {["Library", "Canteen", "Medical Center", "Security Office", "Hostels"].map(
                (name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => {
                      const building = getCampusBuildingByName(name);
                      if (building) {
                        handleSelectBuilding(building);
                      }
                    }}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300"
                  >
                    {name}
                  </button>
                )
              )}
            </div>
          </div>
        </aside>

        <section className="relative overflow-hidden rounded-[32px] border border-white/60 bg-white/40 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur-2xl dark:border-slate-700 dark:bg-slate-900/50">
          <LeafletMap
            center={DEFAULT_CENTER}
            zoom={16}
            zoomControl={false}
            className="h-full min-h-[520px] w-full"
          >
            <TileLayer url={tileUrl} />
            <FlyTo position={focusedPoint} />
            {routeInfo?.coordinates && routeInfo.coordinates.length > 1 && (
              <Polyline
                positions={routeInfo.coordinates}
                pathOptions={{
                  color: "#2563eb",
                  weight: 5,
                  opacity: 0.95,
                  lineCap: "round",
                  dashArray: "10 12",
                }}
              />
            )}
            {mapBuildings.map((building) => (
              <CustomMarker
                key={building.id}
                building={building}
                isSelected={selectedBuilding?.id === building.id}
                isSaved={savedPlaces.some((item) => item.buildingId === building.id)}
                onSelect={(item) => {
                  setSelectedBuilding(item);
                  setDestinationName(item.name);
                  setFocusedPoint([item.lat, item.lng]);
                }}
                onNavigate={handleNavigate}
                onViewDetails={handleSelectBuilding}
                onToggleSave={handleBookmark}
              />
            ))}
          </LeafletMap>

          {selectedBuilding && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="pointer-events-none absolute left-4 top-4 rounded-2xl border border-white/60 bg-white/85 px-4 py-3 shadow-xl backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/90"
            >
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Selected landmark
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                {selectedBuilding.name}
              </p>
            </motion.div>
          )}
        </section>

        <aside className="space-y-4 overflow-hidden rounded-[28px] border border-white/60 bg-white/70 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.14)] backdrop-blur-2xl dark:border-slate-700 dark:bg-slate-900/80">
          {selectedBuilding ? (
            <>
              <div className="overflow-hidden rounded-[24px] bg-slate-950 shadow-lg">
                <img
                  src={selectedBuilding.image}
                  alt={selectedBuilding.name}
                  className="h-44 w-full object-cover opacity-90"
                />
              </div>

              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
                      {selectedBuilding.category}
                    </p>
                    <h2 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
                      {selectedBuilding.name}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleBookmark(selectedBuilding)}
                    className="rounded-2xl border border-slate-200 p-3 text-slate-500 transition hover:border-amber-300 hover:text-amber-600 dark:border-slate-700 dark:text-slate-300"
                  >
                    <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
                  </button>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {selectedBuilding.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/80">
                  <p className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                    <Clock3 size={14} />
                    Hours
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                    {selectedBuilding.workingHours}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/80">
                  <p className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                    <Layers3 size={14} />
                    Floors
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                    {selectedBuilding.floors}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Departments
                </p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {formatDepartmentList(selectedBuilding)}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleNavigate(selectedBuilding)}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  <Navigation size={16} />
                  Navigate
                </button>
                <button
                  type="button"
                  onClick={() => setFocusedPoint([selectedBuilding.lat, selectedBuilding.lng])}
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Focus
                </button>
              </div>
            </>
          ) : (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-200 bg-slate-50/70 text-center dark:border-slate-700 dark:bg-slate-800/40">
              <Search size={28} className="text-slate-400" />
              <p className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                Pick a landmark
              </p>
              <p className="mt-2 max-w-xs text-sm text-slate-500 dark:text-slate-400">
                Use search or quick picks to inspect a location, save it, and generate a route.
              </p>
            </div>
          )}
        </aside>
      </div>

      <BottomNavCard
        source={sourceBuilding?.name}
        destination={destinationBuilding?.name}
        distance={routeInfo?.distance}
        duration={routeInfo?.duration}
        onStart={() => {
          if (destinationBuilding) {
            handleNavigate(destinationBuilding);
          }
        }}
        onClear={() => {
          setSelectedBuilding(null);
          setDestinationName("");
          setFocusedPoint(DEFAULT_CENTER);
          setRouteInfo(null);
        }}
      />
    </motion.div>
  );
}
