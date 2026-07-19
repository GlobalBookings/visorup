import { File, Directory, Paths } from 'expo-file-system';
import { NavStep, fetchRouteWithSteps } from './navigation';
import { fetchRoadRoute } from './routing';
import { pois, POI } from './pois';
import { fuelStations } from './fuel-data';
import { SavedTrip } from './supabase';

export type OfflineRoute = {
  id: string;
  name: string;
  waypoints: { lat: number; lng: number; name?: string }[];
  coords: { latitude: number; longitude: number }[];
  steps: NavStep[];
  poisNearby: OfflinePOI[];
  fuelStopsNearby: { lat: number; lng: number; name: string }[];
  downloadedAt: number;
  sizeBytes: number;
  distanceMeters: number;
  settings?: { road_preference?: string };
};

export type OfflinePOI = {
  name: string;
  lat: number;
  lng: number;
  category: string;
};

export type DownloadProgress = {
  routeId: string;
  phase: 'routing' | 'steps' | 'pois' | 'saving' | 'done' | 'error';
  progress: number; // 0-1
  error?: string;
};

type DownloadListener = (progress: DownloadProgress) => void;

const OFFLINE_DIR_NAME = 'offline-routes';
const MANIFEST_NAME = 'manifest.json';
const MAX_OFFLINE_ROUTES = 20;
const POI_RADIUS_KM = 5;
const FUEL_RADIUS_KM = 10;

let manifest: { id: string; name: string; downloadedAt: number; sizeBytes: number }[] | null = null;
const downloadListeners = new Set<DownloadListener>();

function emit(progress: DownloadProgress) {
  for (const l of downloadListeners) {
    try { l(progress); } catch (_) {}
  }
}

function getOfflineDir(): Directory {
  const dir = new Directory(Paths.document, OFFLINE_DIR_NAME);
  if (!dir.exists) dir.create();
  return dir;
}

async function loadManifest() {
  if (manifest) return manifest;
  try {
    const dir = getOfflineDir();
    const file = new File(dir, MANIFEST_NAME);
    if (file.exists) {
      const raw = await file.text();
      manifest = JSON.parse(raw);
      return manifest!;
    }
  } catch (_) {}
  manifest = [];
  return manifest;
}

function saveManifest() {
  const dir = getOfflineDir();
  const file = new File(dir, MANIFEST_NAME);
  if (!file.exists) file.create();
  file.write(JSON.stringify(manifest ?? []));
}

function distKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLon = (b.lng - a.lng) * Math.PI / 180;
  const h = Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function findNearbyPOIs(coords: { latitude: number; longitude: number }[]): OfflinePOI[] {
  if (coords.length === 0) return [];
  const sampleStep = Math.max(1, Math.floor(coords.length / 30));
  const sampled = coords.filter((_, i) => i % sampleStep === 0);
  const seen = new Set<string>();
  const result: OfflinePOI[] = [];

  for (const poi of pois) {
    if (seen.has(poi.name)) continue;
    for (const c of sampled) {
      if (distKm({ lat: c.latitude, lng: c.longitude }, { lat: poi.lat, lng: poi.lng }) <= POI_RADIUS_KM) {
        seen.add(poi.name);
        result.push({ name: poi.name, lat: poi.lat, lng: poi.lng, category: poi.category });
        break;
      }
    }
  }
  return result;
}

function findNearbyFuel(coords: { latitude: number; longitude: number }[]): { lat: number; lng: number; name: string }[] {
  if (coords.length === 0) return [];
  const sampleStep = Math.max(1, Math.floor(coords.length / 20));
  const sampled = coords.filter((_, i) => i % sampleStep === 0);
  const seen = new Set<string>();
  const result: { lat: number; lng: number; name: string }[] = [];

  for (const station of fuelStations) {
    const key = `${station.lat},${station.lng}`;
    if (seen.has(key)) continue;
    for (const c of sampled) {
      if (distKm({ lat: c.latitude, lng: c.longitude }, { lat: station.lat, lng: station.lng }) <= FUEL_RADIUS_KM) {
        seen.add(key);
        result.push({ lat: station.lat, lng: station.lng, name: station.name || 'Fuel Station' });
        break;
      }
    }
  }
  return result;
}

function routeDistanceMeters(coords: { latitude: number; longitude: number }[]): number {
  let d = 0;
  for (let i = 1; i < coords.length; i++) {
    d += distKm(
      { lat: coords[i - 1].latitude, lng: coords[i - 1].longitude },
      { lat: coords[i].latitude, lng: coords[i].longitude }
    ) * 1000;
  }
  return d;
}

export async function downloadRouteForOffline(
  trip: SavedTrip,
  roadPreference: 'fast' | 'curvy' | 'twisty' = 'curvy'
): Promise<OfflineRoute | null> {
  const routeId = trip.id;

  try {
    emit({ routeId, phase: 'routing', progress: 0.1 });

    const waypoints = (trip.waypoints || []).map(w => ({ lat: w.lat, lng: w.lng, name: (w as any).name }));
    if (waypoints.length < 2) {
      emit({ routeId, phase: 'error', progress: 0, error: 'Route needs at least 2 waypoints' });
      return null;
    }

    // Fetch full route with turn-by-turn steps
    emit({ routeId, phase: 'steps', progress: 0.3 });
    const { coords, steps } = await fetchRouteWithSteps(waypoints);

    if (coords.length === 0) {
      emit({ routeId, phase: 'error', progress: 0, error: 'Failed to calculate route' });
      return null;
    }

    // Find nearby POIs and fuel stations
    emit({ routeId, phase: 'pois', progress: 0.6 });
    const poisNearby = findNearbyPOIs(coords);
    const fuelStopsNearby = findNearbyFuel(coords);

    const offlineRoute: OfflineRoute = {
      id: routeId,
      name: trip.name,
      waypoints,
      coords,
      steps,
      poisNearby,
      fuelStopsNearby,
      downloadedAt: Date.now(),
      sizeBytes: 0,
      distanceMeters: routeDistanceMeters(coords),
      settings: trip.settings as { road_preference?: string },
    };

    // Save to filesystem
    emit({ routeId, phase: 'saving', progress: 0.85 });
    const dir = getOfflineDir();
    const json = JSON.stringify(offlineRoute);
    offlineRoute.sizeBytes = json.length;
    const file = new File(dir, `${routeId}.json`);
    if (!file.exists) file.create();
    file.write(JSON.stringify(offlineRoute));

    // Update manifest
    const m = await loadManifest();
    manifest = m.filter(e => e.id !== routeId);
    manifest.push({ id: routeId, name: trip.name, downloadedAt: Date.now(), sizeBytes: offlineRoute.sizeBytes });

    // Enforce max limit (remove oldest)
    if (manifest.length > MAX_OFFLINE_ROUTES) {
      const oldest = manifest.sort((a, b) => a.downloadedAt - b.downloadedAt)[0];
      await deleteOfflineRoute(oldest.id);
    }
    saveManifest();

    emit({ routeId, phase: 'done', progress: 1 });
    return offlineRoute;
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Download failed';
    emit({ routeId, phase: 'error', progress: 0, error: msg });
    return null;
  }
}

export async function getOfflineRoute(routeId: string): Promise<OfflineRoute | null> {
  try {
    const dir = getOfflineDir();
    const file = new File(dir, `${routeId}.json`);
    if (!file.exists) return null;
    const raw = await file.text();
    return JSON.parse(raw) as OfflineRoute;
  } catch (_) {
    return null;
  }
}

export async function getOfflineRouteList(): Promise<{ id: string; name: string; downloadedAt: number; sizeBytes: number }[]> {
  return loadManifest();
}

export async function isRouteOffline(routeId: string): Promise<boolean> {
  const m = await loadManifest();
  return m.some(e => e.id === routeId);
}

export async function deleteOfflineRoute(routeId: string): Promise<void> {
  try {
    const dir = getOfflineDir();
    const file = new File(dir, `${routeId}.json`);
    if (file.exists) file.delete();
    const m = await loadManifest();
    manifest = m.filter(e => e.id !== routeId);
    saveManifest();
  } catch (_) {}
}

export function deleteAllOfflineRoutes(): void {
  try {
    const dir = getOfflineDir();
    if (dir.exists) dir.delete();
    manifest = [];
  } catch (_) {}
}

export async function getOfflineStorageSize(): Promise<number> {
  const m = await loadManifest();
  return m.reduce((sum, e) => sum + e.sizeBytes, 0);
}

export function subscribeDownloadProgress(listener: DownloadListener): () => void {
  downloadListeners.add(listener);
  return () => { downloadListeners.delete(listener); };
}

// Offline navigation: find nearest step to current position
export function findCurrentStep(
  position: { latitude: number; longitude: number },
  steps: NavStep[]
): { stepIdx: number; distanceToStep: number } {
  let nearestIdx = 0;
  let nearestDist = Infinity;

  for (let i = 0; i < steps.length; i++) {
    const d = distKm(
      { lat: position.latitude, lng: position.longitude },
      { lat: steps[i].location.latitude, lng: steps[i].location.longitude }
    ) * 1000;
    if (d < nearestDist) {
      nearestDist = d;
      nearestIdx = i;
    }
  }

  return { stepIdx: nearestIdx, distanceToStep: nearestDist };
}

// Check if user is off the cached route
export function isOffCachedRoute(
  position: { latitude: number; longitude: number },
  coords: { latitude: number; longitude: number }[],
  thresholdMeters: number = 200
): boolean {
  const sampleStep = Math.max(1, Math.floor(coords.length / 100));
  let minDist = Infinity;

  for (let i = 0; i < coords.length; i += sampleStep) {
    const d = distKm(
      { lat: position.latitude, lng: position.longitude },
      { lat: coords[i].latitude, lng: coords[i].longitude }
    ) * 1000;
    if (d < minDist) minDist = d;
    if (d < thresholdMeters) return false;
  }

  return minDist > thresholdMeters;
}

// Get remaining distance from current position along cached route
export function remainingOfflineDistance(
  position: { latitude: number; longitude: number },
  coords: { latitude: number; longitude: number }[]
): number {
  let nearestIdx = 0;
  let nearestDist = Infinity;
  const step = Math.max(1, Math.floor(coords.length / 200));

  for (let i = 0; i < coords.length; i += step) {
    const d = distKm(
      { lat: position.latitude, lng: position.longitude },
      { lat: coords[i].latitude, lng: coords[i].longitude }
    );
    if (d < nearestDist) { nearestDist = d; nearestIdx = i; }
  }

  let remaining = 0;
  for (let i = nearestIdx; i < coords.length - 1; i++) {
    remaining += distKm(
      { lat: coords[i].latitude, lng: coords[i].longitude },
      { lat: coords[i + 1].latitude, lng: coords[i + 1].longitude }
    );
  }
  return remaining * 1000; // meters
}
