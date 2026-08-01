import { useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import EmergencyButton from "./EmergencyButton";
import { useAppContext } from "../context/AppContext";
import EmergencyModal from "./EmergencyModal";
import { getCampusBuildingByName } from "../data/campusData";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSidebarOpen, setIsSidebarOpen, toggleSidebar } = useAppContext();
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);

  const activeNav = useMemo(() => {
    const pathname = location.pathname;
    if (pathname.startsWith("/map")) return "map";
    if (pathname.startsWith("/faculty")) return "faculty";
    if (pathname.startsWith("/bus")) return "bus";
    if (pathname.startsWith("/saved")) return "saved";
    if (pathname.startsWith("/emergency")) return "emergency";
    if (pathname.startsWith("/3d")) return "3d";
    if (pathname.startsWith("/ask")) return "ask";
    if (pathname.startsWith("/settings")) return "settings";
    return "dashboard";
  }, [location.pathname]);

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, setIsSidebarOpen]);

  const handleNavigate = (item: string) => {
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
    <div className="flex h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.14),_transparent_30%),linear-gradient(180deg,_#f8fbff_0%,_#eef4ff_100%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.2),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(15,23,42,0.45),_transparent_32%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)]">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeItem={activeNav}
        onNavigate={handleNavigate}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={toggleSidebar} />

        <main className="flex-1 overflow-y-auto relative">
          <Outlet />
        </main>
      </div>

      <EmergencyButton
        onClick={() => setIsEmergencyOpen(true)}
      />

      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        onNavigate={(building) => {
          setIsEmergencyOpen(false);
          const destination = getCampusBuildingByName(building.name)?.name ?? building.name;
          navigate("/map", {
            state: {
              destination,
              highlight: destination,
            },
          });
        }}
      />
    </div>
  );
}
