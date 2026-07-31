import { useState } from "react";
import { motion } from "framer-motion";
import { Moon, Sun, Trash2, RotateCcw, Info } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const VERSION = "1.0.0";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [isDark, setIsDark] = useState(theme === "dark");

  const handleLightMode = () => {
    setTheme("light");
    setIsDark(false);
  };

  const handleDarkMode = () => {
    setTheme("dark");
    setIsDark(true);
  };

  const clearHistory = () => {
    try {
      localStorage.removeItem("campus_recent_searches");
    } catch {}
    alert("Recent searches cleared");
  };

  const resetSavedPlaces = () => {
    try {
      localStorage.removeItem("campus_saved_places");
    } catch {}
    alert("Saved places reset");
  };

  return (
    <motion.div
      className="p-6 max-w-3xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your preferences and data</p>
      </div>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Appearance</h2>
        <div className="rounded-2xl border border-white/40 bg-white/70 backdrop-blur-xl shadow-lg overflow-hidden divide-y divide-gray-100">
          <div className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Dark Mode</p>
              <p className="text-xs text-gray-400 mt-0.5">Switch between light and dark themes</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleLightMode}
                className={`p-2 rounded-lg transition-colors ${
                  !isDark
                    ? "bg-amber-100 text-amber-700"
                    : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                }`}
                aria-label="Light mode"
              >
                <Sun size={18} />
              </button>
              <button
                onClick={handleDarkMode}
                className={`p-2 rounded-lg transition-colors ${
                  isDark
                    ? "bg-slate-800 text-slate-100"
                    : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                }`}
                aria-label="Dark mode"
              >
                <Moon size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Data</h2>
        <div className="rounded-2xl border border-white/40 bg-white/70 backdrop-blur-xl shadow-lg overflow-hidden divide-y divide-gray-100">
          <div className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Clear History</p>
              <p className="text-xs text-gray-400 mt-0.5">Remove all recent searches</p>
            </div>
            <button
              onClick={clearHistory}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
            >
              <Trash2 size={14} />
              Clear
            </button>
          </div>
          <div className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Reset Saved Places</p>
              <p className="text-xs text-gray-400 mt-0.5">Remove all bookmarked locations</p>
            </div>
            <button
              onClick={resetSavedPlaces}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
            >
              <RotateCcw size={14} />
              Reset
            </button>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
        <div className="rounded-2xl border border-white/40 bg-white/70 backdrop-blur-xl shadow-lg overflow-hidden">
          <div className="p-5 flex items-center gap-4">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600">
              <Info size={20} />
            </span>
            <div>
              <p className="text-sm font-medium text-gray-900">Smart Campus Navigator</p>
              <p className="text-xs text-gray-400 mt-0.5">Version {VERSION}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Built with React, Tailwind CSS, and Three.js
              </p>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
