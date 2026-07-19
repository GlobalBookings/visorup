import { Linking, Platform, Share } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Coord, distanceM } from './safety';
import { getCrashContacts, EmergencyContact } from './crash-detection';

// ---------------------------------------------------------------------------
// Emergency & breakdown numbers (UK)
// ---------------------------------------------------------------------------

export type PhoneEntry = {
  name: string;
  phone: string;
  note?: string;
};

export const EMERGENCY_NUMBERS: PhoneEntry[] = [
  { name: 'Emergency services', phone: '999', note: 'Police, ambulance, fire' },
  { name: 'Emergency (mobile/EU)', phone: '112', note: 'Works across Europe' },
];

// The UK has no single breakdown number, so the main providers are listed.
export const BREAKDOWN_PROVIDERS: PhoneEntry[] = [
  { name: 'AA', phone: '0800 887 766', note: 'Breakdown assistance' },
  { name: 'RAC', phone: '0333 2000 999', note: 'Breakdown assistance' },
  { name: 'Green Flag', phone: '0800 051 0636', note: 'Breakdown assistance' },
  { name: 'National Highways', phone: '0300 123 5000', note: 'Motorway / major roads' },
];

// ---------------------------------------------------------------------------
// Personal breakdown cover (saved by the rider)
// ---------------------------------------------------------------------------

export type PersonalBreakdown = {
  provider: string;
  phone: string;
  membership?: string;
};

const PERSONAL_BREAKDOWN_KEY = 'personal_breakdown';

export async function getPersonalBreakdown(): Promise<PersonalBreakdown | null> {
  try {
    const raw = await SecureStore.getItemAsync(PERSONAL_BREAKDOWN_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersonalBreakdown;
  } catch {
    return null;
  }
}

export async function setPersonalBreakdown(value: PersonalBreakdown | null): Promise<void> {
  try {
    if (!value) {
      await SecureStore.deleteItemAsync(PERSONAL_BREAKDOWN_KEY);
    } else {
      await SecureStore.setItemAsync(PERSONAL_BREAKDOWN_KEY, JSON.stringify(value));
    }
  } catch {
    // best effort
  }
}

// ---------------------------------------------------------------------------
// Roadside first aid (concise, biker-focused checklist)
// ---------------------------------------------------------------------------

export type FirstAidStep = {
  icon: string;
  title: string;
  detail: string;
};

export const FIRST_AID_STEPS: FirstAidStep[] = [
  {
    icon: 'warning-outline',
    title: 'Protect the scene',
    detail: 'Park safely, put on hazard lights and warn oncoming traffic. Do not become a casualty yourself.',
  },
  {
    icon: 'call-outline',
    title: 'Call 999 / 112',
    detail: 'Give your location (GPS or what3words), how many are hurt, and hazards like fuel or fast traffic.',
  },
  {
    icon: 'shield-outline',
    title: 'Leave the helmet ON',
    detail: 'Only remove it if the rider is not breathing and you must open the airway. Removing it risks worsening a spinal injury.',
  },
  {
    icon: 'pulse-outline',
    title: 'Check response (DR ABC)',
    detail: 'Danger, Response, Airway, Breathing. If not breathing, start CPR: 30 chest compressions, 2 breaths, repeat.',
  },
  {
    icon: 'body-outline',
    title: 'Do not move them',
    detail: 'Unless in immediate danger. Support the head and neck and keep the rider as still as possible (spinal risk).',
  },
  {
    icon: 'water-outline',
    title: 'Control bleeding',
    detail: 'Apply firm, direct pressure to wounds with a clean cloth or dressing. Keep pressure on until help arrives.',
  },
  {
    icon: 'thermometer-outline',
    title: 'Keep warm & calm',
    detail: 'Treat for shock: reassure them, keep them warm, and do not give food or drink.',
  },
];

export const FIRST_AID_DISCLAIMER =
  'This is a quick refresher, not a substitute for professional first aid training. In doubt, call 999 and follow the operator.';

// ---------------------------------------------------------------------------
// Calling / maps helpers
// ---------------------------------------------------------------------------

export async function callNumber(phone: string): Promise<void> {
  const clean = phone.replace(/[^0-9+]/g, '');
  const url = `tel:${clean}`;
  try {
    await Linking.openURL(url);
  } catch {
    // dialer unavailable (e.g. simulator)
  }
}

export async function openMapsSearch(query: string): Promise<void> {
  const q = encodeURIComponent(query);
  const url =
    Platform.OS === 'ios' ? `http://maps.apple.com/?q=${q}` : `geo:0,0?q=${q}`;
  try {
    await Linking.openURL(url);
  } catch {
    // ignore
  }
}

export async function openMapsDirections(lat: number, lng: number, label?: string): Promise<void> {
  const name = label ? encodeURIComponent(label) : '';
  const url =
    Platform.OS === 'ios'
      ? `http://maps.apple.com/?daddr=${lat},${lng}${name ? `&q=${name}` : ''}`
      : `google.navigation:q=${lat},${lng}`;
  try {
    await Linking.openURL(url);
  } catch {
    // ignore
  }
}

// ---------------------------------------------------------------------------
// Nearest garage finder (OpenStreetMap Overpass, best-effort)
// ---------------------------------------------------------------------------

export type Garage = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distanceM: number;
  phone?: string;
  kind: 'motorcycle' | 'car';
};

// ---------------------------------------------------------------------------
// Location sharing (what3words + "I'm OK / send my location")
// ---------------------------------------------------------------------------

/** Opens the what3words map centred on the coordinate so the rider can read
 * their 3-word address to the 999 operator. */
export function what3wordsUrl(lat: number, lng: number): string {
  return `https://map.what3words.com/?maptype=roadmap&zoom=19&center=${lat},${lng}`;
}

export function buildLocationMessage(coord: Coord, prefix?: string): string {
  const lat = coord.latitude.toFixed(5);
  const lng = coord.longitude.toFixed(5);
  const maps = `https://maps.google.com/?q=${lat},${lng}`;
  const w3w = what3wordsUrl(coord.latitude, coord.longitude);
  const head = prefix ? `${prefix}\n\n` : '';
  return `${head}My location: ${lat}, ${lng}\n${maps}\nwhat3words: ${w3w}`;
}

/**
 * Sends the rider's current location to their saved emergency contacts via a
 * pre-filled SMS. Falls back to the system share sheet when no contacts are
 * saved (or SMS is unavailable, e.g. the simulator).
 */
export async function sendLocationToContacts(coord: Coord, prefix?: string): Promise<'sms' | 'share' | 'none'> {
  const message = buildLocationMessage(coord, prefix);
  let contacts: EmergencyContact[] = [];
  try {
    contacts = await getCrashContacts();
  } catch {
    contacts = [];
  }
  if (contacts.length > 0) {
    const recipients = contacts.map((c) => c.phone.replace(/[^0-9+]/g, '')).filter(Boolean).join(',');
    if (recipients) {
      const sep = Platform.OS === 'ios' ? '&' : '?';
      const url = `sms:${recipients}${sep}body=${encodeURIComponent(message)}`;
      try {
        await Linking.openURL(url);
        return 'sms';
      } catch {
        // fall through to share sheet
      }
    }
  }
  try {
    await Share.share({ message });
    return 'share';
  } catch {
    return 'none';
  }
}

// ---------------------------------------------------------------------------
// Nearest hospital / A&E finder (Overpass, best-effort)
// ---------------------------------------------------------------------------

export type NearbyPlace = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distanceM: number;
  phone?: string;
};

/** Finds nearby hospitals (A&E where tagged) sorted by distance. Best-effort. */
export async function findNearbyHospitals(origin: Coord, radiusM = 30000): Promise<NearbyPlace[]> {
  const { latitude: lat, longitude: lng } = origin;
  const query = `[out:json][timeout:20];(
    node["amenity"="hospital"](around:${radiusM},${lat},${lng});
    way["amenity"="hospital"](around:${radiusM},${lat},${lng});
  );out center;`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(query)}`,
      signal: controller.signal,
    });
    const data = await res.json();
    const elements: any[] = data?.elements || [];
    const places: NearbyPlace[] = [];
    for (const el of elements) {
      const elat = el.lat ?? el.center?.lat;
      const elng = el.lon ?? el.center?.lon;
      if (typeof elat !== 'number' || typeof elng !== 'number') continue;
      const tags: Record<string, string> = el.tags || {};
      const coord = { latitude: elat, longitude: elng };
      places.push({
        id: `${el.type}/${el.id}`,
        name: tags.name || 'Hospital',
        latitude: elat,
        longitude: elng,
        distanceM: distanceM(origin, coord),
        phone: tags.phone || tags['contact:phone'] || undefined,
      });
    }
    places.sort((a, b) => a.distanceM - b.distanceM);
    return places.slice(0, 10);
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

function kindFromTags(tags: Record<string, string>): 'motorcycle' | 'car' {
  const shop = tags.shop || '';
  if (shop.includes('motorcycle')) return 'motorcycle';
  return 'car';
}

/**
 * Finds nearby motorcycle/car repair garages via the Overpass API and returns
 * them sorted by distance. Time-boxed and best-effort — returns [] on failure
 * so the caller can fall back to a maps search.
 */
export async function findNearbyGarages(origin: Coord, radiusM = 20000): Promise<Garage[]> {
  const { latitude: lat, longitude: lng } = origin;
  const query = `[out:json][timeout:20];(
    node["shop"="motorcycle_repair"](around:${radiusM},${lat},${lng});
    way["shop"="motorcycle_repair"](around:${radiusM},${lat},${lng});
    node["shop"="motorcycle"](around:${radiusM},${lat},${lng});
    node["shop"="car_repair"](around:${radiusM},${lat},${lng});
    way["shop"="car_repair"](around:${radiusM},${lat},${lng});
  );out center;`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(query)}`,
      signal: controller.signal,
    });
    const data = await res.json();
    const elements: any[] = data?.elements || [];

    const garages: Garage[] = [];
    for (const el of elements) {
      const elat = el.lat ?? el.center?.lat;
      const elng = el.lon ?? el.center?.lon;
      if (typeof elat !== 'number' || typeof elng !== 'number') continue;
      const tags: Record<string, string> = el.tags || {};
      const name = tags.name || (kindFromTags(tags) === 'motorcycle' ? 'Motorcycle garage' : 'Car garage');
      const phone = tags.phone || tags['contact:phone'] || undefined;
      const coord = { latitude: elat, longitude: elng };
      garages.push({
        id: `${el.type}/${el.id}`,
        name,
        latitude: elat,
        longitude: elng,
        distanceM: distanceM(origin, coord),
        phone,
        kind: kindFromTags(tags),
      });
    }

    // Motorcycle garages first at equal-ish distance, then by distance.
    garages.sort((a, b) => a.distanceM - b.distanceM);
    return garages.slice(0, 15);
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}
