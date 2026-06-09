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

  // For curvy/twisty: add gentle shaping points to nudge route off motorways
  const shapedWaypoints = addShapingPoints(waypoints, preference);
  return fetchOSRM(shapedWaypoints);
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
