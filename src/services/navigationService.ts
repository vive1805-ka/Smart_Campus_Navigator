import campusPaths from "../data/campusPaths.json";
import type { CampusPath } from "../types";
import { campusBuildings, getCampusBuildingByName } from "../data/campusData";
import { haversineDistance } from "../utils/helpers";
import { closestCampusMatch, normalizeCampusText } from "../utils/helpers";

function resolveCampusName(name: string): string {
  const building = getCampusBuildingByName(name) ?? closestCampusMatch(name, campusBuildings);
  return building?.name ?? name;
}

function matchesName(left: string, right: string): boolean {
  return normalizeCampusText(left) === normalizeCampusText(right);
}

export async function calculateRoute(
  from: string,
  to: string
): Promise<{
  distance: string;
  duration: string;
  instructions: string[];
  coordinates: [number, number][];
} | null> {
  const typedPaths = campusPaths as CampusPath[];
  const resolvedFrom = resolveCampusName(from);
  const resolvedTo = resolveCampusName(to);

  const path = typedPaths.find(
    (p) =>
      (matchesName(p.from, resolvedFrom) && matchesName(p.to, resolvedTo)) ||
      (matchesName(p.from, resolvedTo) && matchesName(p.to, resolvedFrom))
  );

  if (path) {
    return {
      distance: path.distance,
      duration: path.duration,
      instructions: path.instructions,
      coordinates: path.coordinates,
    };
  }

  const fromBuilding = campusBuildings.find((building) =>
    matchesName(building.name, resolvedFrom)
  );
  const toBuilding = campusBuildings.find((building) =>
    matchesName(building.name, resolvedTo)
  );

  if (fromBuilding && toBuilding) {
    const distance = haversineDistance(
      fromBuilding.lat,
      fromBuilding.lng,
      toBuilding.lat,
      toBuilding.lng
    );

    const minutes = Math.round((distance / 80) * 60);

    return {
      distance: `${Math.round(distance)} m`,
      duration: `${minutes} min`,
      instructions: [
        `Head towards ${resolvedTo}`,
        "Continue straight on the main path",
        `Turn left towards ${resolvedTo}`,
        "Continue for 100m",
        "Destination reached",
      ],
      coordinates: [
        [fromBuilding.lat, fromBuilding.lng],
        [
          (fromBuilding.lat + toBuilding.lat) / 2,
          (fromBuilding.lng + toBuilding.lng) / 2,
        ],
        [toBuilding.lat, toBuilding.lng],
      ],
    };
  }

  return null;
}
