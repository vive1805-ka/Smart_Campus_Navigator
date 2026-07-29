import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  Search,
  ArrowUpRight,
  Clock,
  Home,
  Briefcase,
  X,
  ChevronRight,
  MapPin,
} from "lucide-react";

/* ─── Default demo data ─── */
const DEFAULT_RECENT = [
  { id: "1", text: "Things to do", type: "recent" },
  { id: "2", text: "Chennai — Tamil Nadu", type: "place" },
  { id: "3", text: "Zoho Corporation, Chennai, Tamil Nadu", type: "recent" },
  { id: "4", text: "Marina Beach, Chennai", type: "place" },
  { id: "5", text: "Central Library", type: "recent" },
  { id: "6", text: "CSE Department", type: "recent" },
  { id: "7", text: "Canteen", type: "recent" },
];

const DEFAULT_SAVED = [
  { type: "home", label: "Home", address: null, isSet: false },
  { type: "work", label: "Work", address: null, isSet: false },
];

/**
 * Search panel — the default sidebar panel content.
 * Shows search bar, saved places, recent searches, and "More from recent history".
 */
export default function SearchPanel({
  recentSearches = DEFAULT_RECENT,
  savedPlaces = DEFAULT_SAVED,
  maxRecentVisible = 5,
  onSearch,
  onSelectRecent,
  onSelectSaved,
  onDirectionsToggle,
  onSetLocation,
}) {
  const [query, setQuery] = useState("");
  const [isDirections, setIsDirections] = useState(false);
  const [showAllRecent, setShowAllRecent] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const inputRef = useRef(null);
  const listRef = useRef(null);

  /* ── Derived ── */
  const homeSaved = savedPlaces.find((p) => p.type === "home") ?? DEFAULT_SAVED[0];
  const workSaved = savedPlaces.find((p) => p.type === "work");

  const filteredRecent = useMemo(() => {
    if (!query.trim()) return recentSearches;
    const q = query.toLowerCase();
    return recentSearches.filter((r) => r.text.toLowerCase().includes(q));
  }, [query, recentSearches]);

  const visibleRecent = showAllRecent
    ? filteredRecent
    : filteredRecent.slice(0, maxRecentVisible);

  /* All navigable items */
  const navigableItems = useMemo(() => {
    const items = [];
    items.push({ kind: "saved", data: homeSaved });
    if (workSaved) items.push({ kind: "saved", data: workSaved });
    visibleRecent.forEach((r) => items.push({ kind: "recent", data: r }));
    if (!showAllRecent && filteredRecent.length > maxRecentVisible) {
      items.push({ kind: "more" });
    }
    return items;
  }, [homeSaved, workSaved, visibleRecent, showAllRecent, filteredRecent, maxRecentVisible]);

  /* ── Keyboard navigation ── */
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((p) => (p < navigableItems.length - 1 ? p + 1 : 0));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((p) => (p > 0 ? p - 1 : navigableItems.length - 1));
      }
      if (e.key === "Enter" && activeIndex >= 0) {
        e.preventDefault();
        const item = navigableItems[activeIndex];
        if (item.kind === "recent") handleSelectRecent(item.data);
        else if (item.kind === "saved") handleSelectSaved(item.data);
        else if (item.kind === "more") setShowAllRecent(true);
      }
    },
    [activeIndex, navigableItems]
  );

  /* ── Scroll active item into view ── */
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll("[data-nav-item]");
      items[activeIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  /* ── Handlers ── */
  const handleSelectRecent = (item) => {
    setQuery(item.text);
    setActiveIndex(-1);
    onSelectRecent?.(item);
  };

  const handleSelectSaved = (place) => {
    if (place.isSet && place.address) setQuery(place.address);
    setActiveIndex(-1);
    onSelectSaved?.(place);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) onSearch?.(query.trim());
  };

  const handleDirectionsToggle = () => {
    setIsDirections((p) => !p);
    onDirectionsToggle?.(!isDirections);
  };

  const clearQuery = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full">
      {/* ═══ Search Bar ═══ */}
      <div className="flex-shrink-0 px-3 pt-3 pb-2">
        <form onSubmit={handleSearch}>
          <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2.5
                          shadow-sm border border-gray-200/80">
            {/* Search icon */}
            <button
              type="submit"
              className="flex-shrink-0 text-blue-600 hover:text-blue-700 transition-colors p-0.5 cursor-pointer"
              aria-label="Search"
            >
              <Search size={20} strokeWidth={2.2} />
            </button>

            {/* Input */}
            <input
              ref={inputRef}
              type="text"
              value={query}
              placeholder="Search Google Maps"
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(-1);
              }}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400
                         outline-none border-none py-0.5"
              autoComplete="off"
              spellCheck={false}
            />

            {/* Clear */}
            {query && (
              <button
                type="button"
                onClick={clearQuery}
                className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                aria-label="Clear"
              >
                <X size={16} />
              </button>
            )}

            {/* Directions toggle */}
            <button
              type="button"
              onClick={handleDirectionsToggle}
              className={`
                flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center
                transition-all duration-200 cursor-pointer
                ${
                  isDirections
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200 scale-105"
                    : "bg-blue-500 text-white hover:bg-blue-600 hover:shadow-md"
                }
              `}
              aria-label="Directions"
              title="Directions"
            >
              <ArrowUpRight size={18} strokeWidth={2.5} />
            </button>
          </div>
        </form>
      </div>

      {/* ═══ Results List ═══ */}
      <div ref={listRef} className="flex-1 overflow-y-auto" role="listbox" aria-label="Search suggestions">
        {/* ── Separator ── */}
        <div className="mx-3 border-t border-gray-100" />

        {/* ── Saved: Home ── */}
        <SavedRow
          place={homeSaved}
          icon={<Home size={18} />}
          index={0}
          activeIndex={activeIndex}
          onSelect={handleSelectSaved}
          onSetLocation={onSetLocation}
        />

        {/* ── Saved: Work ── */}
        {workSaved && (
          <SavedRow
            place={workSaved}
            icon={<Briefcase size={18} />}
            index={1}
            activeIndex={activeIndex}
            onSelect={handleSelectSaved}
            onSetLocation={onSetLocation}
          />
        )}

        {/* ── Separator ── */}
        <div className="mx-3 border-t border-gray-100" />

        {/* ── Recent Searches ── */}
        {visibleRecent.map((item, i) => {
          const navIdx = i + (workSaved ? 2 : 1);
          return (
            <RecentRow
              key={item.id}
              item={item}
              index={navIdx}
              activeIndex={activeIndex}
              onSelect={handleSelectRecent}
            />
          );
        })}

        {visibleRecent.length === 0 && query.trim() && (
          <div className="px-4 py-8 text-center text-sm text-gray-400">
            No results for "{query}"
          </div>
        )}

        {/* ── More from recent history ── */}
        {!showAllRecent && filteredRecent.length > maxRecentVisible && (
          <button
            data-nav-item
            onClick={() => setShowAllRecent(true)}
            className={`
              w-full flex items-center gap-3 px-4 py-3 text-sm text-blue-600
              hover:bg-blue-50/60 transition-colors cursor-pointer
              ${activeIndex === navigableItems.length - 1 ? "bg-blue-50/80" : ""}
            `}
          >
            <span className="w-9 h-9 rounded-full flex items-center justify-center">
              <ChevronRight size={16} className="text-blue-500" />
            </span>
            <span className="font-medium">More from recent history</span>
          </button>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Sub-components
   ═══════════════════════════════════════════ */

function SavedRow({ place, icon, index, activeIndex, onSelect, onSetLocation }) {
  const isActive = index === activeIndex;
  const isConfigured = place.isSet && place.address;

  return (
    <div
      data-nav-item
      role="option"
      aria-selected={isActive}
      onClick={() => onSelect(place)}
      className={`
        flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors duration-100
        ${isActive ? "bg-gray-100" : "hover:bg-gray-50"}
      `}
    >
      <span
        className={`
          w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0
          ${place.type === "home" ? "bg-teal-100 text-teal-600" : "bg-amber-100 text-amber-600"}
        `}
      >
        {icon}
      </span>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 leading-tight">
          {place.label || (place.type === "home" ? "Home" : "Work")}
        </p>
        {isConfigured && (
          <p className="text-xs text-gray-400 truncate mt-0.5">{place.address}</p>
        )}
      </div>

      {!isConfigured && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSetLocation?.(place.type);
          }}
          className="text-xs text-blue-500 hover:text-blue-700 font-medium whitespace-nowrap
                     transition-colors cursor-pointer"
        >
          Set location
        </button>
      )}
    </div>
  );
}

function RecentRow({ item, index, activeIndex, onSelect }) {
  const isActive = index === activeIndex;

  return (
    <div
      data-nav-item
      role="option"
      aria-selected={isActive}
      onClick={() => onSelect(item)}
      className={`
        flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors duration-100 group
        ${isActive ? "bg-gray-100" : "hover:bg-gray-50"}
      `}
    >
      <span className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0
                       group-hover:bg-gray-200 transition-colors">
        {item.type === "place" ? (
          <MapPin size={16} className="text-gray-500" />
        ) : (
          <Clock size={16} className="text-gray-500" />
        )}
      </span>
      <span className="flex-1 text-sm text-gray-700 truncate">{item.text}</span>
      <ChevronRight
        size={14}
        className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
      />
    </div>
  );
}
