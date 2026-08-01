import { motion } from "framer-motion";
import { Bookmark, MapPin, Navigation, Trash2, Sparkles } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { campusBuildings } from "../data/campusData";

export default function SavedPlaces() {
  const { savedPlaces, removeSavedPlace } = useAppContext();

  const getBuilding = (buildingId: string) =>
    campusBuildings.find((building) => building.id === buildingId);

  return (
    <motion.div
      className="mx-auto max-w-6xl p-4 lg:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 dark:bg-amber-950/40 dark:text-amber-200">
            <Bookmark size={12} />
            Bookmarks
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">
            Saved Places
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Keep frequently visited landmarks one tap away.
          </p>
        </div>
        <div className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300 lg:flex">
          <Sparkles size={16} className="text-amber-500" />
          {savedPlaces.length} saved place{savedPlaces.length === 1 ? "" : "s"}
        </div>
      </div>

      {savedPlaces.length === 0 ? (
        <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[32px] border border-dashed border-slate-200 bg-white/60 p-8 text-center shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl dark:border-slate-700 dark:bg-slate-900/60">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-200">
            <Bookmark size={28} />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">
            No saved places yet
          </h2>
          <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
            Bookmark any campus location from the map popup or details panel and it will appear
            here for quick access.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {savedPlaces.map((place) => {
            const building = getBuilding(place.buildingId);
            return (
              <motion.article
                key={place.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className="overflow-hidden rounded-[28px] border border-white/60 bg-white/75 shadow-[0_18px_60px_rgba(15,23,42,0.12)] backdrop-blur-2xl dark:border-slate-700 dark:bg-slate-900/80"
              >
                <div className="h-40 overflow-hidden bg-slate-950">
                  <img
                    src={building?.image}
                    alt={place.name}
                    className="h-full w-full object-cover opacity-90"
                  />
                </div>
                <div className="space-y-4 p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-xl dark:bg-blue-950/60">
                      {building?.icon || "📍"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-lg font-semibold text-slate-900 dark:text-white">
                        {place.name}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Saved on {new Date(place.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-800/80 dark:text-slate-300">
                    <p className="flex items-center gap-2">
                      <MapPin size={14} />
                      {building?.description || "Campus landmark"}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      <Navigation size={16} />
                      Navigate
                    </button>
                    <button
                      type="button"
                      onClick={() => removeSavedPlace(place.id)}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900/50 dark:text-red-300 dark:hover:bg-red-950/40"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
