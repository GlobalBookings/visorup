type Coord = { latitude: number; longitude: number };
type RoadPreference = 'fast' | 'curvy' | 'twisty';

export async function fetchRoadRoute(
  waypoints: { lat: number; lng: number }[],
  preference: RoadPreference = 'curvy'
): Promise<Coord[]> {
  if (waypoints.length < 2) return [];

  if (preference === 'fast') {
    return fetchOSRM(waypoints);
  }

  // For curvy/twisty: build several candidate routes and pick the one that
  // genuinely maximises turning (per km), within a distance cap. Candidates:
  //  - OSRM with perpendicular shaping points (nudges onto smaller roads)
  //  - BRouter "car-eco" (avoids motorways, favours quieter/smaller roads)
  const shaped = addShapingPoints(waypoints, preference);
  const [shapedRoute, brouterRoute] = await Promise.all([
    fetchOSRM(shaped),
    fetchBRouter(waypoints, 'car-eco'),
  ]);

  const candidates = [shapedRoute, brouterRoute].filter((c) => c.length > 1);
  if (candidates.length === 0) return fetchOSRM(waypoints);

  const picked = pickCurviest(candidates, preference);
  return picked.length > 1 ? picked : fetchOSRM(waypoints);
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

function pickCurviest(candidates: Coord[][], preference: RoadPreference): Coord[] {
  const scored = candidates.map((c) => ({ c, len: lengthKm(c), turn: totalTurning(c) }));
  const shortest = Math.min(...scored.map((s) => s.len));
  const maxFactor = preference === 'twisty' ? 2.0 : 1.4;
  const eligible = scored.filter((s) => s.len <= shortest * maxFactor);
  const pool = eligible.length > 0 ? eligible : scored;
  // twisty: maximise absolute turning; curvy: maximise turning per km.
  const key = (s: { len: number; turn: number }) =>
    preference === 'twisty' ? s.turn : s.turn / Math.max(s.len, 0.1);
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
 * Adds small perpendicular offsets between waypoints to nudge the route
 * onto smaller roads. Offsets are capped to prevent going off-road/sea.
 * - curvy: 1 midpoint, offset ~3-5km sideways
 * - twisty: 2 midpoints, offset ~5-8km sideways in alternating directions
 */
function addShapingPoints(
  waypoints: { lat: number; lng: number }[],
  preference: RoadPreference
): { lat: number; lng: number }[] {
  const result: { lat: number; lng: number }[] = [waypoints[0]];

  for (let i = 0; i < waypoints.length - 1; i++) {
    const from = waypoints[i];
    const to = waypoints[i + 1];

    const dx = to.lng - from.lng;
    const dy = to.lat - from.lat;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Only shape legs longer than ~10km (0.09 degrees)
    if (dist > 0.09) {
      const perpX = -dy / dist;
      const perpY = dx / dist;

      // Cap offset: curvy ~0.03deg (~3km), twisty ~0.05deg (~5km)
      const maxOffset = preference === 'twisty' ? 0.05 : 0.03;
      const offset = Math.min(dist * 0.08, maxOffset);

      if (preference === 'twisty') {
        // Two shaping points in alternating directions
        const t1 = 0.33, t2 = 0.66;
        result.push({
          lat: from.lat + dy * t1 + perpX * offset,
          lng: from.lng + dx * t1 + perpY * offset,
        });
        result.push({
          lat: from.lat + dy * t2 - perpX * offset,
          lng: from.lng + dx * t2 - perpY * offset,
        });
      } else {
        // One shaping point offset to one side
        result.push({
          lat: from.lat + dy * 0.5 + perpX * offset,
          lng: from.lng + dx * 0.5 + perpY * offset,
        });
      }
    }

    result.push(to);
  }

  return result;
}

async function fetchOSRM(waypoints: { lat: number; lng: number }[]): Promise<Coord[]> {
  const maxWaypoints = 25;
  if (waypoints.length <= maxWaypoints) {
    return fetchOSRMBatch(waypoints);
  }

  const allCoords: Coord[] = [];
  for (let i = 0; i < waypoints.length - 1; i += maxWaypoints - 1) {
    const chunk = waypoints.slice(i, Math.min(i + maxWaypoints, waypoints.length));
    const coords = await fetchOSRMBatch(chunk);
    if (allCoords.length > 0 && coords.length > 0) coords.shift();
    allCoords.push(...coords);
  }
  return allCoords;
}

async function fetchOSRMBatch(waypoints: { lat: number; lng: number }[]): Promise<Coord[]> {
  if (waypoints.length < 2) return [];

  const coords = waypoints.map((w) => `${w.lng},${w.lat}`).join(';');
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;

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
