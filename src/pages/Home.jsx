import { useState, useCallback } from "react";
import NavRail from "../components/NavRail";
import SearchPanel from "../components/SearchPanel";
import AskMapsPanel from "../components/AskMapsPanel";
import CategoryBar from "../components/CategoryBar";
import AreaInfoCard from "../components/AreaInfoCard";
import MapView from "../components/MapView";
import buildings from "../data/buildings";

/* ── Demo data ── */
const recentSearches = [
  { id: "1", text: "Things to do", type: "recent" },
  { id: "2", text: "Chennai — Tamil Nadu", type: "place" },
  { id: "3", text: "Zoho Corporation, Chennai, Tamil Nadu", type: "recent" },
  { id: "4", text: "Marina Beach, Chennai", type: "place" },
  { id: "5", text: "Central Library", type: "recent" },
  { id: "6", text: "CSE Department", type: "recent" },
  { id: "7", text: "Canteen", type: "recent" },
];

const savedPlaces = [
  { type: "home", label: "Home", address: null, isSet: false },
  { type: "work", label: "Work", address: null, isSet: false },
];

export default function Home() {
  const [activeNav, setActiveNav] = useState("search"); // default is search
  const [activeCategory, setActiveCategory] = useState(null);
  const [destination, setDestination] = useState("");
  const [showMarkers, setShowMarkers] = useState(false); // no markers in default

  /* ── Handlers ── */
  const handleSearch = useCallback((query) => {
    const match = buildings.find(
      (b) => b.name.toLowerCase() === query.toLowerCase()
    );
    if (match) {
      setDestination(match.name);
      setShowMarkers(true);
    }
  }, []);

  const handleSelectRecent = useCallback((item) => {
    const match = buildings.find(
      (b) => b.name.toLowerCase() === item.text.toLowerCase()
    );
    if (match) {
      setDestination(match.name);
      setShowMarkers(true);
    }
  }, []);

  const handleCategoryClick = useCallback((cat) => {
    setActiveCategory((prev) => (prev === cat.id ? null : cat.id));
    setShowMarkers(true);
  }, []);

  const handleSetLocation = useCallback((type) => {
    alert(`Set your ${type} location`);
  }, []);

  const handleNavSelect = useCallback((id) => {
    // "menu" and "more" don't switch panels
    if (id === "menu" || id === "more" || id === "app") return;
    setActiveNav(id);
  }, []);

  /* ── Determine which panel to show ── */
  const renderPanel = () => {
    switch (activeNav) {
      case "ask":
        return <AskMapsPanel />;
      case "search":
      default:
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-hidden">
              <SearchPanel
                recentSearches={recentSearches}
                savedPlaces={savedPlaces}
                onSearch={handleSearch}
                onSelectRecent={handleSelectRecent}
                onSetLocation={handleSetLocation}
              />
            </div>
            {/* Bottom area info card — overlaps panel bottom */}
            <AreaInfoCard />
          </div>
        );
    }
  };

  return (
    <div className="flex w-screen h-screen overflow-hidden font-sans bg-gray-100">
      {/* ═══ 1. Persistent Nav Rail ═══ */}
      <NavRail activeId={activeNav} onSelect={handleNavSelect} />

      {/* ═══ 2. Side Panel ═══ */}
      <div
        className="flex-shrink-0 h-full flex flex-col rounded-r-2xl shadow-2xl overflow-hidden z-10"
        style={{
          width: 400,
          background: "linear-gradient(180deg, #f0f7fa 0%, #f6fafe 40%, #ffffff 100%)",
        }}
      >
        {renderPanel()}
      </div>

      {/* ═══ 3. Map Area (remaining space) ═══ */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Category chips — full width above the map */}
        <div className="flex-shrink-0 bg-white/80 backdrop-blur-sm border-b border-gray-100 z-10">
          <CategoryBar
            activeCategory={activeCategory}
            onCategoryClick={handleCategoryClick}
          />
        </div>

        {/* Map fills remaining space */}
        <div className="flex-1 relative">
          <MapView
            source=""
            destination={destination}
            showMarkers={showMarkers}
          />
        </div>
      </div>
    </div>
  );
}