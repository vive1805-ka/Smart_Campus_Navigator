import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Clock, MapPin } from "lucide-react";
import type { Building } from "../types";

interface SearchBarProps {
  onSearch: (query: string) => void;
  suggestions: Building[];
  recentSearches: string[];
  onSelectRecent: (text: string) => void;
}

export default function SearchBar({
  onSearch,
  suggestions,
  recentSearches,
  onSelectRecent,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const allSuggestions = useMemo(() => {
    const combined: Array<{ text: string; type: "recent" } | { text: string; type: "place"; buildingId: string }> = [];
    recentSearches.forEach((s) => combined.push({ text: s, type: "recent" }));
    suggestions.forEach((b) => {
      if (!combined.some((s) => s.text === b.name)) {
        combined.push({ text: b.name, type: "place", buildingId: b.id });
      }
    });
    return combined;
  }, [suggestions, recentSearches]);

  useEffect(() => {
    onSearch(query);
  }, [query, onSearch]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, allSuggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && allSuggestions[activeIndex]) {
        const selected = allSuggestions[activeIndex];
        setQuery(selected.text);
        onSelectRecent(selected.text);
        setIsFocused(false);
      }
    } else if (e.key === "Escape") {
      setIsFocused(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(-1);
          }}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search buildings, places..."
          className="w-full pl-10 pr-10 py-3 text-sm rounded-2xl border border-gray-200 dark:border-slate-600 bg-white/90 dark:bg-slate-800/90 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X size={14} className="text-gray-400" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isFocused && allSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-600 overflow-hidden z-50 max-h-80 overflow-y-auto"
          >
            {allSuggestions.map((item, idx) => (
              <motion.div
                key={`${item.type}-${item.text}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.03 }}
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => {
                  setQuery(item.text);
                  if (item.type === "recent") {
                    onSelectRecent(item.text);
                  } else {
                    onSearch(item.text);
                  }
                  setIsFocused(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                  activeIndex === idx
                    ? "bg-blue-50 dark:bg-blue-900/20"
                    : "hover:bg-gray-50 dark:hover:bg-slate-700"
                }`}
              >
                {item.type === "recent" ? (
                  <Clock size={16} className="text-gray-400 flex-shrink-0" />
                ) : (
                  <MapPin size={16} className="text-blue-500 flex-shrink-0" />
                )}
                <span className="text-sm text-gray-700 dark:text-gray-200 truncate">
                  {item.text}
                </span>
                {item.type === "recent" && (
                  <span className="text-[10px] text-gray-400 ml-auto">Recent</span>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
