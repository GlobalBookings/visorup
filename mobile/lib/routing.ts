type Coord = { latitude: number; longitude: number };
type RoadPreference = 'fast' | 'curvy' | 'twisty';

export type RoutingAvoidance = {
  avoidMotorways?: boolean;
  avoidAroads?: boolean;
  avoidTollRoads?: boolean;
  avoidUnpaved?: boolean;
  avoidNarrowLanes?: boolean;
  avoidFerries?: boolean;
};

/** Build OSRM exclude query param from avoidance toggles. */
function buildOSRMExclude(avoidance?: RoutingAvoidance): string {
  if (!avoidance) return '';
  const excludes: string[] = [];
  if (avoidance.avoidMotorways) excludes.push('motorway');
  if (avoidance.avoidTollRoads) excludes.push('toll');
  if (avoidance.avoidFerries) excludes.push('ferry');
  return excludes.length > 0 ? `&exclude=${excludes.join(',')}` : '';
}

/** Select BRouter profile based on avoidance preferences. */
function selectBRouterProfile(avoidance?: RoutingAvoidance): string {
  if (!avoidance) return 'car-eco';
  if (avoidance.avoidMotorways && avoidance.avoidAroads) return 'safety';
  if (avoidance.avoidMotorways) return 'car-eco';
  return 'car-eco';
}

/** Maps the road preference to a default curviness intensity (0 = efficient, 100 = max twisties). */
export function defaultIntensity(preference: RoadPreference): number {
  if (preference === 'fast') return 0;
  if (preference === 'twisty') return 100;
  return 55;
}

export async function fetchRoadRoute(
  waypoints: { lat: number; lng: number }[],
  preference: RoadPreference = 'curvy',
  avoidance?: RoutingAvoidance,
  intensity?: number
): Promise<Coord[]> {
  if (waypoints.length < 2) return [];

  const exclude = buildOSRMExclude(avoidance);
  const level = Math.max(0, Math.min(100, intensity ?? defaultIntensity(preference)));

  // Efficient routing: shortest sensible line (respecting avoidance excludes).
  if (preference === 'fast' || level <= 5) {
    return fetchOSRM(waypoints, exclude);
  }

  // Curvy/twisty: build several candidate routes and pick the one that genuinely
  // maximises turning within a distance cap that grows with the chosen intensity.
  // Candidates: the direct line, shaping variants nudged onto smaller roads, and
  // (when motorways are allowed) a BRouter back-roads profile.
  const variants = buildShapingVariants(waypoints, level);
  const fetches: Promise<Coord[]>[] = [
    fetchOSRM(waypoints, exclude),
    ...variants.map((v) => fetchOSRM(v, exclude)),
  ];
  // BRouter can route onto motorways, so skip it when the rider excludes them
  // to keep motorway avoidance reliable.
  if (!avoidance?.avoidMotorways) {
    fetches.push(fetchBRouter(waypoints, selectBRouterProfile(avoidance)));
  }

  const results = await Promise.all(fetches);
  const candidates = results.filter((c) => c.length > 1);
  if (candidates.length === 0) return fetchOSRM(waypoints, exclude);

  const picked = pickCurviest(candidates, level);
  return picked.length > 1 ? picked : fetchOSRM(waypoints, exclude);
}

/** Sum of absolute heading changes along the polyline, in radians. */
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

function pickCurviest(candidates: Coord[][], level: number): Coord[] {
  const scored = candidates.map((c) => ({ c, len: lengthKm(c), turn: totalTurning(c) }));
  const shortest = Math.min(...scored.map((s) => s.len));
  // Higher intensity tolerates longer detours: 1.2x (light) up to 2.2x (max).
  const maxFactor = 1.2 + (level / 100) * 1.0;
  const eligible = scored.filter((s) => s.len <= shortest * maxFactor);
  const pool = eligible.length > 0 ? eligible : scored;
  // High intensity maximises absolute turning; lower intensity favours turning per km
  // so the ride stays efficient. Blend the two by intensity.
  const w = level / 100;
  const key = (s: { len: number; turn: number }) =>
    w * s.turn + (1 - w) * (s.turn / Math.max(s.len, 0.1));
  return pool.reduce((best, s) => (key(s) > key(best) ? s : best)).c;
}

async function fetchBRouter(
  waypoints: { lat: number; lng: number }[],
  profile: string
): Promise<Coord[]> {
  const lonlats = waypoints.map((w) => `${w.lng},${w.lat}`).join('|');
  const url = `https://brouter.de/brouter?lonlats=${lonlats}&profile=${profile}&alternativeidx=0&format=geojson`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3500);
  try {
    const res = await fetch(url, { signal: controller.signal });
    const data = await res.json();
    const line = data?.features?.[0]?.geometry?.coordinates;
    if (Array.isArray(line) && line.length > 1) {
      return line.map((c: number[]) => ({ latitude: c[1], longitude: c[0] }));
    }
  } catch (e) {
    console.warn('[Routing] BRouter request failed:', e);
  } finally {
    clearTimeout(timeout);
  }
  return [];
}

/**
 * Builds several shaped-waypoint variants that nudge the route onto smaller
 * roads via perpendicular offsets. The offset magnitude and number of midpoints
 * scale with intensity (0-100). Returns multiple candidates (offset to each side,
 * plus an alternating double at higher intensity) so the picker can choose the
 * one that actually turns the most. Offsets are capped to avoid going off-road.
 */
function buildShapingVariants(
  waypoints: { lat: number; lng: number }[],
  level: number
): { lat: number; lng: number }[][] {
  const w = level / 100;
  const maxOffset = 0.02 + w * 0.06; // ~2km (light) up to ~8km (max)
  const useDouble = level >= 70;

  const shape = (sign: 1 | -1, alternate: boolean) => {
    const result: { lat: number; lng: number }[] = [waypoints[0]];
    for (let i = 0; i < waypoints.length - 1; i++) {
      const from = waypoints[i];
      const to = waypoints[i + 1];
      const dx = to.lng - from.lng;
      const dy = to.lat - from.lat;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 0.09) {
        const perpX = -dy / dist;
        const perpY = dx / dist;
        const offset = Math.min(dist * 0.1, maxOffset);
        if (alternate) {
          const t1 = 0.33, t2 = 0.66;
          result.push({ lat: from.lat + dy * t1 + perpX * offset * sign, lng: from.lng + dx * t1 + perpY * offset * sign });
          result.push({ lat: from.lat + dy * t2 - perpX * offset * sign, lng: from.lng + dx * t2 - perpY * offset * sign });
        } else {
          result.push({ lat: from.lat + dy * 0.5 + perpX * offset * sign, lng: from.lng + dx * 0.5 + perpY * offset * sign });
        }
      }
      result.push(to);
    }
    return result;
  };

  const variants = [shape(1, false), shape(-1, false)];
  if (useDouble) variants.push(shape(1, true));
  return variants;
}

async function fetchOSRM(
  waypoints: { lat: number; lng: number }[],
  exclude: string = ''
): Promise<Coord[]> {
  const maxWaypoints = 25;
  if (waypoints.length <= maxWaypoints) {
    return fetchOSRMBatch(waypoints, exclude);
  }

  const allCoords: Coord[] = [];
  for (let i = 0; i < waypoints.length - 1; i += maxWaypoints - 1) {
    const chunk = waypoints.slice(i, Math.min(i + maxWaypoints, waypoints.length));
    const coords = await fetchOSRMBatch(chunk, exclude);
    if (allCoords.length > 0 && coords.length > 0) coords.shift();
    allCoords.push(...coords);
  }
  return allCoords;
}

async function fetchOSRMBatch(
  waypoints: { lat: number; lng: number }[],
  exclude: string = ''
): Promise<Coord[]> {
  if (waypoints.length < 2) return [];

  const coords = waypoints.map((w) => `${w.lng},${w.lat}`).join(';');
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson${exclude}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.code === 'Ok' && data.routes?.[0]) {
      return data.routes[0].geometry.coordinates.map((c: [number, number]) => ({
        latitude: c[1],
        longitude: c[0],
      }));
    }
  } catch (e) {
    console.warn('[Routing] OSRM request failed:', e);
  }

  return waypoints.map((w) => ({ latitude: w.lat, longitude: w.lng }));
}

export async function getRouteDistance(
  waypoints: { lat: number; lng: number }[]
): Promise<number> {
  if (waypoints.length < 2) return 0;

  const coords = waypoints.map((w) => `${w.lng},${w.lat}`).join(';');
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=false`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.code === 'Ok' && data.routes?.[0]) {
      return data.routes[0].distance;
    }
  } catch (_) {}

  return 0;
}
