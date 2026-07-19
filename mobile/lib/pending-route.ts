export type PendingRoute = {
  name: string;
  waypoints: { lat: number; lng: number; name?: string }[];
  roadPreference?: 'fast' | 'curvy' | 'twisty';
};

let pending: PendingRoute | null = null;

export function setPendingRoute(route: PendingRoute) {
  pending = route;
}

export function takePendingRoute(): PendingRoute | null {
  const r = pending;
  pending = null;
  return r;
}

export function hasPendingRoute(): boolean {
  return pending !== null;
}
