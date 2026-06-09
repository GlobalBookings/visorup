import { AppStorage } from './storage';
import { SavedTrip } from './supabase';

const CACHE_KEY = 'offline_routes';

// In-memory cache for route data (can exceed SecureStore's 2KB limit)
let routeCache: (SavedTrip & { _cachedCoords?: { latitude: number; longitude: number }[]; _cachedAt?: number })[] = [];
let cacheLoaded = false;

async function loadCache() {
  if (cacheLoaded) return;
  try {
    const data = await AppStorage.getItem(CACHE_KEY);
    routeCache = data ? JSON.parse(data) : [];
  } catch {
    routeCache = [];
  }
  cacheLoaded = true;
}

async function saveCache() {
  try {
    // Route data can be large, so we store a summary in SecureStore
    // and keep full data in memory for the session
    const summary = routeCache.map(r => ({ id: r.id, name: r.name, _cachedAt: r._cachedAt }));
    await AppStorage.setItem(CACHE_KEY, JSON.stringify(summary));
  } catch {}
}

export async function cacheRoute(trip: SavedTrip, roadCoords: { latitude: number; longitude: number }[]): Promise<void> {
  await loadCache();
  const entry = { ...trip, _cachedCoords: roadCoords, _cachedAt: Date.now() };
  routeCache = routeCache.filter((r) => r.id !== trip.id);
  routeCache.push(entry);
  await saveCache();
}

export async function getCachedRoutes(): Promise<(SavedTrip & { _cachedCoords?: { latitude: number; longitude: number }[]; _cachedAt?: number })[]> {
  await loadCache();
  return routeCache;
}

export async function getCachedRoute(id: string): Promise<(SavedTrip & { _cachedCoords?: { latitude: number; longitude: number }[] }) | null> {
  await loadCache();
  return routeCache.find((r) => r.id === id) || null;
}

export async function removeCachedRoute(id: string): Promise<void> {
  await loadCache();
  routeCache = routeCache.filter((r) => r.id !== id);
  await saveCache();
}

export async function isCached(id: string): Promise<boolean> {
  await loadCache();
  return routeCache.some((r) => r.id === id);
}

export async function getCacheSize(): Promise<number> {
  await loadCache();
  return routeCache.length;
}
