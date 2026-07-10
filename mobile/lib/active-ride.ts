/**
 * Shared "active ride" store.
 *
 * The phone ride screen (app/ride/[id].tsx) and the CarPlay experience
 * (src/carplay/AutoPlay.tsx) run in the same JS runtime, so this tiny
 * dependency-free store lets the phone drive what CarPlay shows: when a ride
 * starts on the phone, CarPlay mirrors the route and follows the rider live.
 */
export type RideCoord = { latitude: number; longitude: number };

export type ActiveManeuver = { instruction: string; distanceMeters: number } | null;

export type ActiveRide = {
  name: string;
  coords: RideCoord[];
  waypoints: RideCoord[];
  position: RideCoord | null;
  heading: number;
  speedMph: number;
  distanceTravelledMi: number;
  maneuver: ActiveManeuver;
  nextWaypointName: string | null;
};

type Listener = (ride: ActiveRide | null) => void;

let active: ActiveRide | null = null;
const listeners = new Set<Listener>();

function emit() {
  for (const l of listeners) {
    try {
      l(active);
    } catch (_) {}
  }
}

export function getActiveRide(): ActiveRide | null {
  return active;
}

export function startActiveRide(
  init: Pick<ActiveRide, 'name' | 'coords' | 'waypoints'> & Partial<ActiveRide>
) {
  active = {
    name: init.name,
    coords: init.coords,
    waypoints: init.waypoints,
    position: init.position ?? null,
    heading: init.heading ?? 0,
    speedMph: init.speedMph ?? 0,
    distanceTravelledMi: init.distanceTravelledMi ?? 0,
    maneuver: init.maneuver ?? null,
    nextWaypointName: init.nextWaypointName ?? null,
  };
  emit();
}

export function updateActiveRide(patch: Partial<ActiveRide>) {
  if (!active) return;
  active = { ...active, ...patch };
  emit();
}

export function endActiveRide() {
  if (!active) return;
  active = null;
  emit();
}

export function subscribeActiveRide(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
