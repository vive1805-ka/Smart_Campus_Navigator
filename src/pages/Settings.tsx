import { motion } from "framer-motion";
import { Moon, Sun, Trash2, RotateCcw, ShieldCheck, Palette } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAppContext } from "../context/AppContext";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { clearRecentSearches, clearSavedPlaces } = useAppContext();

  return (
    <motion.div
      className="mx-auto max-w-4xl p-4 lg:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <div className="mb-6">
        <p className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <Palette size={12} />
          Preferences
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">
          Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage appearance and reset local demo data.
        </p>
      </div>

      <div className="space-y-4">
        <section className="rounded-[28px] border border-white/60 bg-white/70 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.12)] backdrop-blur-2xl dark:border-slate-700 dark:bg-slate-900/80">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Appearance
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Switch between light and dark campus modes.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                  theme === "light"
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-200"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                <Sun size={16} />
                Light
              </button>
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                  theme === "dark"
                    ? "bg-slate-900 text-white dark:bg-slate-700"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                <Moon size={16} />
                Dark
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-white/60 bg-white/70 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.12)] backdrop-blur-2xl dark:border-slate-700 dark:bg-slate-900/80">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Local data</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <button
              type="button"
              onClick={clearRecentSearches}
              className="flex items-center justify-between rounded-3xl border border-red-200 bg-red-50 px-4 py-4 text-left transition hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/20 dark:hover:bg-red-950/35"
            >
              <div>
                <p className="text-sm font-semibold text-red-700 dark:text-red-200">
                  Clear History
                </p>
                <p className="mt-1 text-xs text-red-600/70 dark:text-red-200/70">
                  Remove recent searches stored in localStorage.
                </p>
              </div>
              <Trash2 size={18} className="text-red-500" />
            </button>

            <button
              type="button"
              onClick={clearSavedPlaces}
              className="flex items-center justify-between rounded-3xl border border-red-200 bg-red-50 px-4 py-4 text-left transition hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/20 dark:hover:bg-red-950/35"
            >
              <div>
                <p className="text-sm font-semibold text-red-700 dark:text-red-200">
                  Reset Saved Places
                </p>
                <p className="mt-1 text-xs text-red-600/70 dark:text-red-200/70">
                  Clear bookmarked locations and favorites.
                </p>
              </div>
              <RotateCcw size={18} className="text-red-500" />
            </button>
          </div>
        </section>

        <section className="rounded-[28px] border border-white/60 bg-white/70 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.12)] backdrop-blur-2xl dark:border-slate-700 dark:bg-slate-900/80">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-200">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                About this prototype
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Built for campus ideathon demos with local JSON data, Leaflet maps, and Three.js.
              </p>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
