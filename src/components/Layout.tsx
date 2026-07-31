import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import EmergencyButton from "./EmergencyButton";
import BottomNavCard from "./BottomNavCard";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (item: string) => {
    setActiveNav(item);
    const routes: Record<string, string> = {
      dashboard: "/",
      map: "/map",
      faculty: "/faculty",
      bus: "/bus",
      saved: "/saved",
      emergency: "/emergency",
      "3d": "/3d",
      ask: "/ask",
      settings: "/settings",
    };
    if (routes[item]) {
      navigate(routes[item]);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900 overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeItem={activeNav}
        onNavigate={handleNavigate}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto relative">
          <Outlet />
        </main>
      </div>

      <EmergencyButton
        onClick={() => navigate("/emergency")}
      />

      {location.pathname === "/map" && (
        <BottomNavCard
          source="Current Location"
          destination="Select destination"
          onStart={() => {}}
          onClear={() => {}}
        />
      )}
    </div>
  );
}
