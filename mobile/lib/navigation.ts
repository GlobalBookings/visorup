export type NavStep = {
  instruction: string;
  distance: number; // meters
  duration: number; // seconds
  maneuverType: string;
  modifier: string;
  roadName: string;
  location: { latitude: number; longitude: number };
};

type OSRMStep = {
  maneuver: { type: string; modifier?: string; location: [number, number] };
  name: string;
  distance: number;
  duration: number;
};

const MANEUVER_ICONS: Record<string, string> = {
  'turn-left': '↰',
  'turn-right': '↱',
  'turn-slight left': '↖',
  'turn-slight right': '↗',
  'turn-sharp left': '⤺',
  'turn-sharp right': '⤻',
  'roundabout-exit': '⟳',
  'rotary-exit': '⟳',
  'fork-slight left': '⑂',
  'fork-slight right': '⑂',
  'depart-': '▶',
  'arrive-': '⬤',
  'continue-straight': '↑',
};

export function getManeuverIcon(type: string, modifier: string): string {
  return MANEUVER_ICONS[`${type}-${modifier}`] || MANEUVER_ICONS[`${type}-`] || '↑';
}

function formatInstruction(type: string, modifier: string, roadName: string): string {
  const road = roadName && roadName !== '' ? ` onto ${roadName}` : '';

  switch (type) {
    case 'turn':
      if (modifier === 'left') return `Turn left${road}`;
      if (modifier === 'right') return `Turn right${road}`;
      if (modifier === 'slight left') return `Bear left${road}`;
      if (modifier === 'slight right') return `Bear right${road}`;
      if (modifier === 'sharp left') return `Sharp left${road}`;
      if (modifier === 'sharp right') return `Sharp right${road}`;
      if (modifier === 'uturn') return `Make a U-turn`;
      return `Continue${road}`;
    case 'new name':
    case 'continue':
      return `Continue${road}`;
    case 'merge':
      return `Merge${road}`;
    case 'fork':
      if (modifier?.includes('left')) return `Keep left${road}`;
      if (modifier?.includes('right')) return `Keep right${road}`;
      return `Continue at fork${road}`;
    case 'roundabout':
    case 'rotary':
      return `At the roundabout, take the exit${road}`;
    case 'exit roundabout':
    case 'exit rotary':
      return `Exit the roundabout${road}`;
    case 'depart':
      return `Head ${modifier || 'forward'}${road}`;
    case 'arrive':
      return `You have arrived`;
    case 'end of road':
      if (modifier === 'left') return `At the end, turn left${road}`;
      if (modifier === 'right') return `At the end, turn right${road}`;
      return `At the end of the road${road}`;
    default:
      return `Continue${road}`;
  }
}

export function parseSteps(steps: OSRMStep[]): NavStep[] {
  return steps
    .filter((s) => s.distance > 0 || s.maneuver.type === 'arrive')
    .map((s) => ({
      instruction: formatInstruction(s.maneuver.type, s.maneuver.modifier || '', s.name),
      distance: s.distance,
      duration: s.duration,
      maneuverType: s.maneuver.type,
      modifier: s.maneuver.modifier || '',
      roadName: s.name,
      location: { latitude: s.maneuver.location[1], longitude: s.maneuver.location[0] },
    }));
}

export async function fetchRouteWithSteps(
  waypoints: { lat: number; lng: number }[]
): Promise<{ coords: { latitude: number; longitude: number }[]; steps: NavStep[] }> {
  if (waypoints.length < 2) return { coords: [], steps: [] };

  const coordStr = waypoints.map((w) => `${w.lng},${w.lat}`).join(';');
  const url = `https://router.project-osrm.org/route/v1/driving/${coordStr}?overview=full&geometries=geojson&steps=true`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.code === 'Ok' && data.routes?.[0]) {
      const route = data.routes[0];
      const coords = route.geometry.coordinates.map((c: [number, number]) => ({
        latitude: c[1],
        longitude: c[0],
      }));

      // Flatten steps from all legs
      const allSteps: OSRMStep[] = [];
      for (const leg of route.legs) {
        allSteps.push(...leg.steps);
      }

      return { coords, steps: parseSteps(allSteps) };
    }
  } catch (e) {
    console.warn('[Navigation] Failed to fetch steps:', e);
  }

  return { coords: waypoints.map((w) => ({ latitude: w.lat, longitude: w.lng })), steps: [] };
}

/**
 * Find the route back to the original route from current position.
 * Returns waypoints that go back to the nearest point on the original route.
 */
export async function fetchRerouteToRoute(
  currentPos: { lat: number; lng: number },
  originalRoute: { latitude: number; longitude: number }[]
): Promise<{ coords: { latitude: number; longitude: number }[]; steps: NavStep[] }> {
  if (originalRoute.length === 0) return { coords: [], steps: [] };

  // Find nearest point on original route ahead (skip points behind user)
  // Sample every 20th point for performance
  let nearestIdx = 0;
  let nearestDist = Infinity;
  const step = Math.max(1, Math.floor(originalRoute.length / 50));

  for (let i = 0; i < originalRoute.length; i += step) {
    const dx = originalRoute[i].latitude - currentPos.lat;
    const dy = originalRoute[i].longitude - currentPos.lng;
    const d = dx * dx + dy * dy;
    if (d < nearestDist) { nearestDist = d; nearestIdx = i; }
  }

  // Target a point slightly ahead on the route (not the nearest, but ~500m ahead)
  const targetIdx = Math.min(nearestIdx + Math.floor(originalRoute.length * 0.02), originalRoute.length - 1);
  const target = originalRoute[targetIdx];

  return fetchRouteWithSteps([
    currentPos,
    { lat: target.latitude, lng: target.longitude },
  ]);
}
