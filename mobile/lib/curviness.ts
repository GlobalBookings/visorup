type Coord = { latitude: number; longitude: number };

/**
 * Calculate curviness score (1-10) based on total heading change per km.
 * 1 = nearly straight (motorway), 10 = hairpin-heavy mountain pass.
 */
export function calculateCurvinessScore(coords: Coord[]): number {
  if (coords.length < 3) return 1;

  const turning = totalTurning(coords);
  const distance = lengthKm(coords);
  if (distance < 0.01) return 1;

  const radPerKm = turning / distance;

  // Threshold mapping: rad/km -> score 1-10
  if (radPerKm < 2) return 1;
  if (radPerKm < 5) return 2;
  if (radPerKm < 10) return 3;
  if (radPerKm < 15) return 4;
  if (radPerKm < 20) return 5;
  if (radPerKm < 30) return 6;
  if (radPerKm < 40) return 7;
  if (radPerKm < 50) return 8;
  if (radPerKm < 65) return 9;
  return 10;
}

/** Human-readable label for a curviness score. */
export function getCurvinessLabel(score: number): string {
  if (score <= 2) return 'Straight';
  if (score <= 4) return 'Mild';
  if (score <= 6) return 'Curvy';
  if (score <= 8) return 'Twisty';
  return 'Extreme';
}

/** Color for curviness visualization: blue (straight) -> amber -> red (extreme). */
export function getCurvinessColor(score: number): string {
  const colors: Record<number, string> = {
    1: '#3b82f6',
    2: '#60a5fa',
    3: '#34d399',
    4: '#6ee7b7',
    5: '#fbbf24',
    6: '#f59e0b',
    7: '#f97316',
    8: '#ef4444',
    9: '#dc2626',
    10: '#991b1b',
  };
  const clamped = Math.max(1, Math.min(10, Math.round(score)));
  return colors[clamped] ?? '#fbbf24';
}

/**
 * Placeholder elevation change estimate from coordinate patterns.
 * Real elevation data would require a DEM API (e.g. Open-Elevation).
 * This heuristic uses latitude variance as a rough proxy for hilly terrain.
 */
export function getElevationChange(coords: Coord[]): { gain: number; loss: number } {
  if (coords.length < 2) return { gain: 0, loss: 0 };

  // Rough heuristic: estimate elevation changes from latitude deltas
  // scaled by a terrain factor. Not accurate - placeholder only.
  let gain = 0;
  let loss = 0;
  for (let i = 1; i < coords.length; i++) {
    const dLat = (coords[i].latitude - coords[i - 1].latitude) * 111_000; // m per degree
    const change = dLat * 0.02; // rough slope factor
    if (change > 0) gain += change;
    else loss += Math.abs(change);
  }

  return { gain: Math.round(gain), loss: Math.round(loss) };
}

/** Aggregate route statistics. */
export function getRouteStats(coords: Coord[]): {
  distanceKm: number;
  curviness: number;
  label: string;
  color: string;
} {
  const distanceKm = lengthKm(coords);
  const curviness = calculateCurvinessScore(coords);
  const label = getCurvinessLabel(curviness);
  const color = getCurvinessColor(curviness);
  return { distanceKm, curviness, label, color };
}

// --- Internal helpers (mirrors routing.ts logic) ---

function totalTurning(coords: Coord[]): number {
  if (coords.length < 3) return 0;
  const bearing = (a: Coord, b: Coord) => {
    const y = b.longitude - a.longitude;
    const x = b.latitude - a.latitude;
    return Math.atan2(y, x);
  };
  let sum = 0;
  let prev = bearing(coords[0], coords[1]);
  for (let i = 1; i < coords.length - 1; i++) {
    const cur = bearing(coords[i], coords[i + 1]);
    let d = Math.abs(cur - prev);
    if (d > Math.PI) d = 2 * Math.PI - d;
    sum += d;
    prev = cur;
  }
  return sum;
}

function lengthKm(coords: Coord[]): number {
  let dist = 0;
  for (let i = 1; i < coords.length; i++) {
    const a = coords[i - 1], b = coords[i];
    const R = 6371;
    const dLat = (b.latitude - a.latitude) * Math.PI / 180;
    const dLon = (b.longitude - a.longitude) * Math.PI / 180;
    const h = Math.sin(dLat / 2) ** 2 +
      Math.cos(a.latitude * Math.PI / 180) * Math.cos(b.latitude * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    dist += R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  }
  return dist;
}
