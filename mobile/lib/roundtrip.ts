import { fetchRoadRoute } from './routing';

export type LoopPoint = { lat: number; lng: number };
export type Direction = 'auto' | 'N' | 'E' | 'S' | 'W';

const R_EARTH_KM = 6371;
const MILES_PER_KM = 0.621371;
const KM_PER_MILE = 1 / MILES_PER_KM;

const toRad = (d: number) => (d * Math.PI) / 180;
const toDeg = (r: number) => (r * 180) / Math.PI;

export const DIRECTION_BEARINGS: Record<Exclude<Direction, 'auto'>, number> = {
  N: 0,
  E: 90,
  S: 180,
  W: 270,
};

export function destination(start: LoopPoint, bearingDeg: number, distKm: number): LoopPoint {
  const br = toRad(bearingDeg);
  const dr = distKm / R_EARTH_KM;
  const lat1 = toRad(start.lat);
  const lng1 = toRad(start.lng);
  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(dr) + Math.cos(lat1) * Math.sin(dr) * Math.cos(br)
  );
  const lng2 =
    lng1 +
    Math.atan2(
      Math.sin(br) * Math.sin(dr) * Math.cos(lat1),
      Math.cos(dr) - Math.sin(lat1) * Math.sin(lat2)
    );
  return { lat: toDeg(lat2), lng: ((toDeg(lng2) + 540) % 360) - 180 };
}

async function snapToRoad(p: LoopPoint): Promise<LoopPoint> {
  const url = `https://router.project-osrm.org/nearest/v1/driving/${p.lng},${p.lat}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.code === 'Ok' && data.waypoints?.[0]?.location) {
      const [lng, lat] = data.waypoints[0].location;
      return { lat, lng };
    }
  } catch (_) {}
  return p;
}

function loopWaypoints(
  start: LoopPoint,
  baseBearing: number,
  radiusKm: number,
  n: number
): LoopPoint[] {
  // Circle centre is offset from the start along the base bearing, so start lies on the circle.
  const centre = destination(start, baseBearing, radiusKm);
  // Bearing from centre back to start.
  const startAngle = (baseBearing + 180) % 360;
  const points: LoopPoint[] = [start];
  for (let k = 1; k < n; k++) {
    const angle = (startAngle + (360 / n) * k) % 360;
    points.push(destination(centre, angle, radiusKm));
  }
  points.push(start);
  return points;
}

function routeDistanceMiles(coords: { latitude: number; longitude: number }[]): number {
  if (coords.length < 2) return 0;
  let dist = 0;
  for (let i = 1; i < coords.length; i++) {
    const prev = coords[i - 1];
    const curr = coords[i];
    const dLat = toRad(curr.latitude - prev.latitude);
    const dLon = toRad(curr.longitude - prev.longitude);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(prev.latitude)) * Math.cos(toRad(curr.latitude)) * Math.sin(dLon / 2) ** 2;
    dist += R_EARTH_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
  return dist * MILES_PER_KM;
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export async function buildRoundTrip(
  start: LoopPoint,
  targetMiles: number,
  bearingDeg: number,
  pref: 'fast' | 'curvy' | 'twisty',
  n = 4
): Promise<{ waypoints: LoopPoint[]; distanceMiles: number } | null> {
  const targetKm = targetMiles * KM_PER_MILE;
  // Regular n-gon road distance ~= 7.6 * radius(km); solve for an initial radius guess.
  let radiusKm = targetKm / 7.6;

  let best: { waypoints: LoopPoint[]; distanceMiles: number } | null = null;

  for (let iter = 0; iter < 3; iter++) {
    const raw = loopWaypoints(start, bearingDeg, radiusKm, n);
    // Snap only the generated outer points (keep the real start/finish untouched).
    const snapped: LoopPoint[] = [raw[0]];
    for (let i = 1; i < raw.length - 1; i++) {
      snapped.push(await snapToRoad(raw[i]));
    }
    snapped.push(raw[raw.length - 1]);

    const coords = await fetchRoadRoute(
      snapped.map((p) => ({ lat: p.lat, lng: p.lng })),
      pref
    );
    const distanceMiles = routeDistanceMiles(coords);
    if (distanceMiles <= 0) return best;

    if (
      !best ||
      Math.abs(distanceMiles - targetMiles) < Math.abs(best.distanceMiles - targetMiles)
    ) {
      best = { waypoints: snapped, distanceMiles };
    }

    if (Math.abs(distanceMiles - targetMiles) / targetMiles <= 0.1) break;

    const ratio = clamp(targetMiles / distanceMiles, 0.5, 2);
    radiusKm *= ratio;
  }

  return best;
}
