import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock3, MapPin, Search, X } from "lucide-react";
import type { Building } from "../types";
import { campusMatchScore } from "../utils/helpers";

interface SearchBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  buildings: Building[];
  recentSearches: string[];
  onSelectBuilding: (building: Building) => void;
  onSelectRecent: (text: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  query,
  onQueryChange,
  buildings,
  recentSearches,
  onSelectBuilding,
  onSelectRecent,
  placeholder = "Search buildings, blocks, or facilities...",
  className = "",
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = useMemo(() => {
    const buildingMatches = buildings
      .map((building) => ({
        building,
        score: campusMatchScore(query, building.name, building.aliases),
      }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((entry) => ({
        id: entry.building.id,
        text: entry.building.name,
        type: "place" as const,
        building: entry.building,
      }));

    const recentMatches = recentSearches
      .filter(
        (item) =>
          !query ||
          item.toLowerCase().includes(query.toLowerCase()) ||
          query.toLowerCase().includes(item.toLowerCase())
      )
      .slice(0, 4)
      .map((item) => ({
        id: `recent-${item}`,
        text: item,
        type: "recent" as const,
      }));

    const combined = [...recentMatches, ...buildingMatches];
    return combined.filter(
      (item, index, array) =>
        array.findIndex((candidate) => candidate.text === item.text) === index
    );
  }, [buildings, query, recentSearches]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, -1));
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const selected = suggestions[activeIndex];
      if (!selected) {
        return;
      }

      if (selected.type === "recent") {
        onSelectRecent(selected.text);
      } else {
        onSelectBuilding(selected.building);
      }
      setIsFocused(false);
      setActiveIndex(-1);
      return;
    }

    if (event.key === "Escape") {
      setIsFocused(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            window.setTimeout(() => setIsFocused(false), 120);
          }}
          onChange={(event) => {
            setActiveIndex(-1);
            onQueryChange(event.target.value);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-white/50 bg-white/90 py-3 pl-11 pr-11 text-sm text-slate-900 shadow-[0_12px_40px_rgba(15,23,42,0.08)] outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900/80 dark:text-white dark:focus:ring-blue-900/30"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              onQueryChange("");
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isFocused && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-full left-0 right-0 z-50 mt-3 overflow-hidden rounded-3xl border border-white/60 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.2)] backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/95"
          >
            <div className="max-h-80 overflow-y-auto p-2">
              {suggestions.map((item, index) => (
                <motion.button
                  key={item.id}
                  type="button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => {
                    if (item.type === "recent") {
                      onSelectRecent(item.text);
                    } else {
                      onSelectBuilding(item.building);
                    }
                    setIsFocused(false);
                    setActiveIndex(-1);
                  }}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
                    activeIndex === index
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-200"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300">
                    {item.type === "recent" ? <Clock3 size={16} /> : <MapPin size={16} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{item.text}</span>
                    <span className="block text-xs text-slate-400">
                      {item.type === "recent" ? "Recent search" : "Campus location"}
                    </span>
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
