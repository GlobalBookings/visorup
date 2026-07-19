import { Accelerometer } from 'expo-sensors';
import * as SecureStore from 'expo-secure-store';
import * as Location from 'expo-location';

// --- Types ---

export type EmergencyContact = {
  id: string;
  name: string;
  phone: string;
  relationship: 'Partner' | 'Family' | 'Friend' | 'Other';
};

export type CrashEvent = {
  timestamp: number;
  location: { latitude: number; longitude: number } | null;
  peakG: number;
};

type AccelReading = {
  x: number;
  y: number;
  z: number;
  timestamp: number;
};

type CrashCallback = (event: CrashEvent) => void;

// --- Constants ---

const CONTACTS_KEY = 'emergency_contacts';
const G_THRESHOLD = 4.0; // G-force magnitude threshold for crash detection
const STILLNESS_THRESHOLD = 0.3; // Near-zero movement threshold (G)
const WINDOW_MS = 2000; // Rolling window duration
const STILLNESS_WINDOW_MS = 1000; // Duration of stillness after impact to confirm crash
const COOLDOWN_MS = 60000; // Prevent repeated triggers within 60s

// --- State ---

let subscription: ReturnType<typeof Accelerometer.addListener> | null = null;
let readings: AccelReading[] = [];
let callbacks: CrashCallback[] = [];
let lastCrashTime = 0;
let impactDetectedAt: number | null = null;
let peakG = 0;

// --- Accelerometer magnitude ---

function magnitude(x: number, y: number, z: number): number {
  return Math.sqrt(x * x + y * y + z * z);
}

// --- Crash detection logic ---

function processReading(reading: { x: number; y: number; z: number }) {
  const now = Date.now();
  const entry: AccelReading = { ...reading, timestamp: now };
  readings.push(entry);

  // Trim window to last 2 seconds
  const cutoff = now - WINDOW_MS;
  readings = readings.filter((r) => r.timestamp > cutoff);

  const g = magnitude(reading.x, reading.y, reading.z);

  // Phase 1: Detect high G-force impact
  if (!impactDetectedAt && g >= G_THRESHOLD) {
    impactDetectedAt = now;
    peakG = g;
    return;
  }

  // Track peak during impact
  if (impactDetectedAt && g > peakG) {
    peakG = g;
  }

  // Phase 2: After impact, check for sudden stillness (rider incapacitated)
  if (impactDetectedAt) {
    const timeSinceImpact = now - impactDetectedAt;

    // Check if enough time has passed to look for stillness
    if (timeSinceImpact > 500) {
      // Get readings from the last stillness window
      const recentCutoff = now - STILLNESS_WINDOW_MS;
      const recentReadings = readings.filter((r) => r.timestamp > recentCutoff);

      if (recentReadings.length >= 5) {
        const avgG =
          recentReadings.reduce((sum, r) => sum + magnitude(r.x, r.y, r.z), 0) /
          recentReadings.length;

        // Near-zero movement confirms crash (rider not moving)
        if (avgG < STILLNESS_THRESHOLD) {
          triggerCrash();
          return;
        }
      }
    }

    // Reset if no stillness detected within the full window
    if (timeSinceImpact > WINDOW_MS) {
      impactDetectedAt = null;
      peakG = 0;
    }
  }
}

async function triggerCrash() {
  const now = Date.now();
  if (now - lastCrashTime < COOLDOWN_MS) return;
  lastCrashTime = now;
  impactDetectedAt = null;

  // Get current location
  let location: { latitude: number; longitude: number } | null = null;
  try {
    const loc = await Location.getLastKnownPositionAsync();
    if (loc) {
      location = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
    }
  } catch {
    // Location unavailable, proceed without it
  }

  const event: CrashEvent = { timestamp: now, location, peakG };
  for (const cb of callbacks) {
    cb(event);
  }

  peakG = 0;
}

// --- Public API ---

export function startCrashMonitoring(): void {
  if (subscription) return;

  Accelerometer.setUpdateInterval(50); // 20Hz sampling
  subscription = Accelerometer.addListener(processReading);
}

export function stopCrashMonitoring(): void {
  if (subscription) {
    subscription.remove();
    subscription = null;
  }
  readings = [];
  impactDetectedAt = null;
  peakG = 0;
}

export function onCrashDetected(callback: CrashCallback): () => void {
  callbacks.push(callback);
  return () => {
    callbacks = callbacks.filter((cb) => cb !== callback);
  };
}

export async function setCrashContacts(contacts: EmergencyContact[]): Promise<void> {
  await SecureStore.setItemAsync(CONTACTS_KEY, JSON.stringify(contacts));
}

export async function getCrashContacts(): Promise<EmergencyContact[]> {
  const raw = await SecureStore.getItemAsync(CONTACTS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as EmergencyContact[];
  } catch {
    return [];
  }
}
