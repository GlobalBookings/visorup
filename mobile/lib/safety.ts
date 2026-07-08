export type Coord = { latitude: number; longitude: number };
export type Hazard = {
  latitude: number;
  longitude: number;
  type: 'bend' | 'camera';
  label: string;
};

export function distanceM(a: Coord, b: Coord): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const h = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function bearingDeg(a: Coord, b: Coord): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;
  const y = Math.sin(toRad(b.longitude - a.longitude)) * Math.cos(toRad(b.latitude));
  const x = Math.cos(toRad(a.latitude)) * Math.sin(toRad(b.latitude)) -
    Math.sin(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.cos(toRad(b.longitude - a.longitude));
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

/** Index of the first point at least `d` metres from `coords[i]` in the given direction. */
function pointAtDistance(coords: Coord[], i: number, d: number, dir: 1 | -1): number | null {
  let acc = 0;
  let j = i;
  while (j + dir >= 0 && j + dir < coords.length) {
    acc += distanceM(coords[j], coords[j + dir]);
    j += dir;
    if (acc >= d) return j;
  }
  return null;
}

/**
 * Detects sharp bends from route geometry. Uses points spaced ~30m either side
 * of each vertex to reduce GPS noise, flags heading changes above the threshold,
 * and de-duplicates bends within ~90m of each other.
 */
export function findSharpBends(coords: Coord[], minAngleDeg = 50): Hazard[] {
  if (coords.length < 5) return [];
  const bends: Hazard[] = [];
  for (let i = 1; i < coords.length - 1; i++) {
    const before = pointAtDistance(coords, i, 30, -1);
    const after = pointAtDistance(coords, i, 30, 1);
    if (before === null || after === null) continue;
    const inB = bearingDeg(coords[before], coords[i]);
    const outB = bearingDeg(coords[i], coords[after]);
    let delta = Math.abs(outB - inB);
    if (delta > 180) delta = 360 - delta;
    if (delta >= minAngleDeg) {
      const last = bends[bends.length - 1];
      if (last && distanceM(last, coords[i]) < 90) continue;
      const label = delta >= 90 ? 'Sharp bend ahead' : 'Bend ahead';
      bends.push({ latitude: coords[i].latitude, longitude: coords[i].longitude, type: 'bend', label });
    }
  }
  return bends;
}

/**
 * Fetches UK speed cameras along the route from the OpenStreetMap Overpass API
 * and keeps only those within ~120m of the route line. Best-effort (time-boxed).
 */
export async function fetchSpeedCameras(coords: Coord[]): Promise<Hazard[]> {
  if (coords.length < 2) return [];
  const lats = coords.map((c) => c.latitude);
  const lngs = coords.map((c) => c.longitude);
  const pad = 0.02;
  const south = Math.min(...lats) - pad;
  const north = Math.max(...lats) + pad;
  const west = Math.min(...lngs) - pad;
  const east = Math.max(...lngs) + pad;

  const query = `[out:json][timeout:20];node["highway"="speed_camera"](${south},${west},${north},${east});out;`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(query)}`,
      signal: controller.signal,
    });
    const data = await res.json();
    const nodes: { lat: number; lon: number }[] = data?.elements || [];
    // Sample the route for a cheap proximity filter.
    const step = Math.max(1, Math.floor(coords.length / 300));
    const sampled: Coord[] = [];
    for (let i = 0; i < coords.length; i += step) sampled.push(coords[i]);

    const cams: Hazard[] = [];
    for (const n of nodes) {
      const p = { latitude: n.lat, longitude: n.lon };
      let near = false;
      for (const s of sampled) {
        if (distanceM(p, s) < 120) { near = true; break; }
      }
      if (near) cams.push({ latitude: n.lat, longitude: n.lon, type: 'camera', label: 'Speed camera ahead' });
    }
    return cams;
  } catch (e) {
    console.warn('[Safety] Overpass request failed:', e);
    return [];
  } finally {
    clearTimeout(timeout);
  }
}
