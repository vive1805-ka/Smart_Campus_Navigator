export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371e3;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function classNames(...args: (string | boolean | undefined | null)[]): string {
  return args.filter(Boolean).join(" ");
}

export function normalizeCampusText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\b(block|building|campus|department|dept)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function campusMatchScore(query: string, candidate: string, aliases: string[] = []): number {
  const normalizedQuery = normalizeCampusText(query);
  const sources = [candidate, ...aliases];

  if (!normalizedQuery) {
    return 0;
  }

  let bestScore = 0;

  for (const source of sources) {
    const normalizedSource = normalizeCampusText(source);

    if (!normalizedSource) {
      continue;
    }

    if (normalizedSource === normalizedQuery) {
      return 100;
    }

    if (
      normalizedSource.includes(normalizedQuery) ||
      normalizedQuery.includes(normalizedSource)
    ) {
      bestScore = Math.max(bestScore, 90);
      continue;
    }

    const queryParts = normalizedQuery.split(" ");
    const sourceParts = normalizedSource.split(" ");
    const overlap = queryParts.filter((part) =>
      sourceParts.some((candidatePart) =>
        candidatePart.startsWith(part) || part.startsWith(candidatePart)
      )
    ).length;

    if (overlap > 0) {
      const score = Math.round((overlap / queryParts.length) * 80);
      bestScore = Math.max(bestScore, score);
    }
  }

  return bestScore;
}

export function closestCampusMatch<T extends { name: string; aliases?: string[] }>(
  query: string,
  records: T[]
): T | null {
  let bestRecord: T | null = null;
  let bestScore = 0;

  for (const record of records) {
    const score = campusMatchScore(query, record.name, record.aliases);
    if (score > bestScore) {
      bestScore = score;
      bestRecord = record;
    }
  }

  return bestScore > 0 ? bestRecord : null;
}
