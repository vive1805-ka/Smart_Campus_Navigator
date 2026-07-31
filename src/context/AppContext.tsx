import React, { createContext, useContext, useState, useCallback } from "react";
import { SavedPlace, SearchResult } from "../types";

interface AppContextType {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  recentSearches: SearchResult[];
  addRecentSearch: (search: SearchResult) => void;
  savedPlaces: SavedPlace[];
  addSavedPlace: (place: SavedPlace) => void;
  removeSavedPlace: (id: string) => void;
  isSplashScreenVisible: boolean;
  setIsSplashScreenVisible: (visible: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<SearchResult[]>(() => {
    const stored = localStorage.getItem("recentSearches");
    return stored ? JSON.parse(stored) : [];
  });
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>(() => {
    const stored = localStorage.getItem("savedPlaces");
    return stored ? JSON.parse(stored) : [];
  });
  const [isSplashScreenVisible, setIsSplashScreenVisible] = useState(true);

  const addRecentSearch = useCallback((search: SearchResult) => {
    setRecentSearches((prev) => {
      const updated = [search, ...prev.filter((s) => s.id !== search.id)].slice(0, 10);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const addSavedPlace = useCallback((place: SavedPlace) => {
    setSavedPlaces((prev) => {
      const updated = [...prev, place];
      localStorage.setItem("savedPlaces", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeSavedPlace = useCallback((id: string) => {
    setSavedPlaces((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      localStorage.setItem("savedPlaces", JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        isSidebarOpen,
        setIsSidebarOpen,
        recentSearches,
        addRecentSearch,
        savedPlaces,
        addSavedPlace,
        removeSavedPlace,
        isSplashScreenVisible,
        setIsSplashScreenVisible,
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