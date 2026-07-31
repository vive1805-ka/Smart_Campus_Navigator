import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { SavedPlace, SearchResult } from "../types";

const RECENT_SEARCHES_KEY = "campus_recent_searches";
const SAVED_PLACES_KEY = "campus_saved_places";

interface AppContextType {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  recentSearches: SearchResult[];
  addRecentSearch: (search: SearchResult) => void;
  clearRecentSearches: () => void;
  savedPlaces: SavedPlace[];
  addSavedPlace: (place: SavedPlace) => void;
  removeSavedPlace: (id: string) => void;
  clearSavedPlaces: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function readStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth >= 1024;
  });
  const [recentSearches, setRecentSearches] = useState<SearchResult[]>(() => {
    return readStorage<SearchResult[]>(RECENT_SEARCHES_KEY, []);
  });
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>(() => {
    return readStorage<SavedPlace[]>(SAVED_PLACES_KEY, []);
  });

  const addRecentSearch = useCallback((search: SearchResult) => {
    setRecentSearches((prev) => {
      const updated = [search, ...prev.filter((item) => item.text !== search.text)].slice(0, 10);
      writeStorage(RECENT_SEARCHES_KEY, updated);
      return updated;
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {}
  }, []);

  const addSavedPlace = useCallback((place: SavedPlace) => {
    setSavedPlaces((prev) => {
      const updated = [...prev, place];
      writeStorage(SAVED_PLACES_KEY, updated);
      return updated;
    });
  }, []);

  const removeSavedPlace = useCallback((id: string) => {
    setSavedPlaces((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      writeStorage(SAVED_PLACES_KEY, updated);
      return updated;
    });
  }, []);

  const clearSavedPlaces = useCallback(() => {
    setSavedPlaces([]);
    try {
      localStorage.removeItem(SAVED_PLACES_KEY);
    } catch {}
  }, []);

  return (
    <AppContext.Provider
      value={{
        isSidebarOpen,
        setIsSidebarOpen,
        toggleSidebar: () => setIsSidebarOpen((prev) => !prev),
        recentSearches,
        addRecentSearch,
        clearRecentSearches,
        savedPlaces,
        addSavedPlace,
        removeSavedPlace,
        clearSavedPlaces,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
