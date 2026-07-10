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

// A turn-by-turn step, used to drive CarPlay's native maneuver cards.
export type RideStep = {
  instruction: string;
  maneuverType: string; // OSRM maneuver type e.g. 'turn', 'roundabout'
  modifier: string; // OSRM modifier e.g. 'left', 'slight right'
  roadName: string;
  distance: number; // segment length in meters
  location: RideCoord;
};

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
  steps: RideStep[];
  currentStepIdx: number;
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
    steps: init.steps ?? [],
    currentStepIdx: init.currentStepIdx ?? 0,
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
