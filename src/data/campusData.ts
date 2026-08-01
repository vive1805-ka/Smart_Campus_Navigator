import buildingsJson from "./buildings.json";
import type { Building } from "../types";
import { closestCampusMatch, normalizeCampusText } from "../utils/helpers";

const EXTRA_BUILDINGS: Building[] = [
  {
    id: "b20",
    name: "Hostels",
    lat: 13.0038,
    lng: 80.0041,
    image:
      "https://images.unsplash.com/photo-1562774053-701939374585?w=800",
    description:
      "The student hostel complex with access-controlled entry, dining hall, and study spaces.",
    workingHours: "24/7",
    departments: ["Boys Hostel", "Girls Hostel"],
    floors: 4,
    category: "facility",
    icon: "🏠",
    aliases: ["hostel", "boys hostel", "girls hostel"],
  },
  {
    id: "b21",
    name: "Security Office",
    lat: 13.0007,
    lng: 80.0018,
    image:
      "https://images.unsplash.com/photo-1582131503261-fca1d1c0589f?w=800",
    description:
      "24/7 campus security control center with visitor management and emergency response.",
    workingHours: "24/7",
    departments: ["Security"],
    floors: 1,
    category: "admin",
    icon: "🛡️",
    aliases: ["security", "security office", "campus security"],
  },
];

const campusBuildings = [...(buildingsJson as Building[]), ...EXTRA_BUILDINGS];

export const campusBuildingsById = new Map(
  campusBuildings.map((building) => [building.id, building])
);

export function getCampusBuildingByName(name: string): Building | undefined {
  const exactMatch = campusBuildings.find((building) => {
    const names = [building.name, ...(building.aliases ?? [])].map((value) =>
      value.toLowerCase().trim()
    );
    return names.includes(name.toLowerCase().trim());
  });

  if (exactMatch) {
    return exactMatch;
  }

  const fuzzyMatch = closestCampusMatch(name, campusBuildings);
  if (fuzzyMatch) {
    return fuzzyMatch;
  }

  const normalized = normalizeCampusText(name);
  return campusBuildings.find((building) =>
    normalizeCampusText(building.name).includes(normalized)
  );
}

export { campusBuildings };
