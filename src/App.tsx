import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import CampusMap from "./pages/CampusMap";
import FacultyFinder from "./pages/FacultyFinder";
import BusRoutes from "./pages/BusRoutes";
import SavedPlaces from "./pages/SavedPlaces";
import Emergency from "./pages/Emergency";
import View3D from "./pages/View3D";
import Settings from "./pages/Settings";
import AskCampus from "./pages/AskCampus";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="map" element={<CampusMap />} />
        <Route path="faculty" element={<FacultyFinder />} />
        <Route path="bus" element={<BusRoutes />} />
        <Route path="saved" element={<SavedPlaces />} />
        <Route path="emergency" element={<Emergency />} />
        <Route path="3d" element={<View3D />} />
        <Route path="ask" element={<AskCampus />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
