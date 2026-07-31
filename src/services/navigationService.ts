import campusPaths from "../data/campusPaths.json";
import type { CampusPath } from "../types";
import { haversineDistance } from "../utils/helpers";

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

  const path = typedPaths.find(
    (p) =>
      (p.from.toLowerCase() === from.toLowerCase() &&
        p.to.toLowerCase() === to.toLowerCase()) ||
      (p.from.toLowerCase() === to.toLowerCase() &&
        p.to.toLowerCase() === from.toLowerCase())
  );

  if (path) {
    return {
      distance: path.distance,
      duration: path.duration,
      instructions: path.instructions,
      coordinates: path.coordinates,
    };
  }

  const fromBuilding = typedPaths.find((p) => p.from.toLowerCase() === from.toLowerCase());
  const toBuilding = typedPaths.find((p) => p.to.toLowerCase() === to.toLowerCase());

  if (fromBuilding && toBuilding) {
    const distance = haversineDistance(
      fromBuilding.coordinates[0][0],
      fromBuilding.coordinates[0][1],
      toBuilding.coordinates[0][0],
      toBuilding.coordinates[0][1]
    );

    const minutes = Math.round((distance / 80) * 60);

    return {
      distance: `${Math.round(distance)} m`,
      duration: `${minutes} min`,
      instructions: [
        `Head towards ${to}`,
        "Continue straight on the main path",
        `Turn left towards ${to}`,
        "Continue for 100m",
        "Destination reached",
      ],
      coordinates: [
        fromBuilding.coordinates[0],
        [
          (fromBuilding.coordinates[0][0] + toBuilding.coordinates[0][0]) / 2,
          (fromBuilding.coordinates[0][1] + toBuilding.coordinates[0][1]) / 2,
        ],
        toBuilding.coordinates[0],
      ],
    };
  }

  return null;
}
