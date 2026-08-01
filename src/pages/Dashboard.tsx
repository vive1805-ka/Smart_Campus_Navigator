import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Clock3,
  Compass,
  MapPin,
  Bookmark,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Building2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { campusBuildings } from "../data/campusData";

const QUICK_ACTIONS = [
  { label: "Campus Map", to: "/map", icon: Compass },
  { label: "Faculty", to: "/faculty", icon: Building2 },
  { label: "Bus Routes", to: "/bus", icon: ArrowRight },
  { label: "Emergency", to: "/emergency", icon: ShieldAlert },
] as const;

export default function Dashboard() {
  const { recentSearches, savedPlaces } = useAppContext();

  const categorySummary = useMemo(() => {
    const counts = campusBuildings.reduce<Record<string, number>>((acc, building) => {
      acc[building.category] = (acc[building.category] || 0) + 1;
      return acc;
    }, {});

    return [
      { label: "Academic", value: counts.academic || 0 },
      { label: "Facilities", value: counts.facility || 0 },
      { label: "Administration", value: counts.admin || 0 },
      { label: "Support", value: counts.hostel || 0 },
    ];
  }, []);

  const featured = campusBuildings.slice(0, 4);

  return (
    <motion.div
      className="mx-auto flex max-w-7xl flex-col gap-6 p-4 lg:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <section className="overflow-hidden rounded-[32px] border border-white/60 bg-[linear-gradient(135deg,rgba(37,99,235,0.95),rgba(15,23,42,0.95))] p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.24)] lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-blue-100">
              <Sparkles size={12} />
              Ideathon ready campus navigation
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight lg:text-5xl">
              Smart Campus Navigator
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100 lg:text-base">
              A polished Google Maps style campus prototype for finding landmarks, faculty,
              bus routes, and emergency help without needing a backend.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:min-w-[320px]">
            {[
              { label: "Buildings", value: campusBuildings.length, icon: MapPin },
              { label: "Saved", value: savedPlaces.length, icon: Bookmark },
              { label: "Recent", value: recentSearches.length, icon: Clock3 },
              { label: "Support", value: categorySummary.length, icon: ShieldAlert },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl"
                >
                  <Icon size={18} className="text-blue-100" />
                  <p className="mt-3 text-2xl font-semibold">{item.value}</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-blue-100/80">
                    {item.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-white/60 bg-white/70 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.12)] backdrop-blur-2xl dark:border-slate-700 dark:bg-slate-900/80">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Quick actions
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Jump into the main demo flows.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.label}
                  to={action.to}
                  className="group rounded-3xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800/80"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-950/60 dark:text-blue-200">
                      <Icon size={18} />
                    </div>
                    <ArrowRight size={16} className="text-slate-300 transition group-hover:text-blue-500" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
                    {action.label}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Open the {action.label.toLowerCase()} experience.
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/60 bg-white/70 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.12)] backdrop-blur-2xl dark:border-slate-700 dark:bg-slate-900/80">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Campus snapshot</h2>
          <div className="mt-5 space-y-3">
            {categorySummary.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/80"
              >
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  {item.label}
                </span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[28px] border border-white/60 bg-white/70 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.12)] backdrop-blur-2xl dark:border-slate-700 dark:bg-slate-900/80">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Recent searches
          </h2>
          <div className="mt-4 divide-y divide-slate-100 overflow-hidden rounded-3xl border border-slate-100 dark:divide-slate-800 dark:border-slate-700">
            {recentSearches.length === 0 ? (
              <p className="px-4 py-6 text-sm text-slate-500 dark:text-slate-400">
                No recent searches yet. Use the map search to build history.
              </p>
            ) : (
              recentSearches.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/70"
                >
                  <Clock3 size={16} className="text-slate-400" />
                  <span className="text-sm text-slate-700 dark:text-slate-200">
                    {item.text}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/60 bg-white/70 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.12)] backdrop-blur-2xl dark:border-slate-700 dark:bg-slate-900/80">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Featured places
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {featured.map((building) => (
              <div
                key={building.id}
                className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/80"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-lg dark:bg-blue-950/60">
                    {building.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                      {building.name}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                      {building.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
