import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, Search, Bell, User } from "lucide-react";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 h-16 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-gray-200 dark:border-slate-700 px-4 flex items-center gap-4"
    >
      <button
        onClick={onMenuClick}
        className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
      >
        <Menu size={22} className="text-gray-700 dark:text-gray-200" />
      </button>

      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">SC</span>
        </div>
        <span className="font-semibold text-gray-900 dark:text-white hidden sm:block">
          Smart Campus
        </span>
      </div>

      <div className="flex-1 max-w-xl mx-4 hidden md:block">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search buildings, faculty, routes..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-600 bg-white/80 dark:bg-slate-800/80 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <button className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors relative">
          <Bell size={20} className="text-gray-600 dark:text-gray-300" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center cursor-pointer hover:shadow-lg transition-shadow">
          <User size={18} className="text-white" />
        </div>
      </div>
    </motion.nav>
  );
}
