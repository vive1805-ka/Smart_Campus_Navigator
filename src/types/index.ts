export interface Building {
  id: string;
  name: string;
  lat: number;
  lng: number;
  image: string;
  description: string;
  workingHours: string;
  departments: string[];
  floors: number;
  category: string;
  icon: string;
}

export interface Faculty {
  id: string;
  name: string;
  department: string;
  block: string;
  floor: number;
  room: string;
  availability: 'available' | 'in-class' | 'meeting' | 'not-in-campus';
  expectedAvailable?: string;
  email: string;
  image: string;
}

export interface BusRoute {
  id: string;
  name: string;
  busNumber: string;
  stops: string[];
  color: string;
}

export interface BusStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  routes: string[];
}

export interface BusSchedule {
  routeId: string;
  morning: TimeSlot[];
  afternoon: TimeSlot[];
  evening: TimeSlot[];
}

export interface TimeSlot {
  time: string;
  stop: string;
}

export interface CampusPath {
  id: string;
  from: string;
  to: string;
  coordinates: [number, number][];
  distance: string;
  duration: string;
  instructions: string[];
}

export interface SearchResult {
  id: string;
  text: string;
  type: 'recent' | 'place' | 'category';
  buildingId?: string;
}

export interface SavedPlace {
  id: string;
  name: string;
  buildingId: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  number: string;
  type: 'medical' | 'security' | 'general';
  building: string;
}

export type ThemeMode = 'light' | 'dark';
export type NavItem = 'dashboard' | 'map' | 'faculty' | 'bus' | 'saved' | 'emergency' | 'settings';
