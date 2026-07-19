import { Linking } from 'react-native';
import { getCrashContacts, EmergencyContact } from './crash-detection';
import { warningHaptic, heavyHaptic } from './haptics';
import { speak } from './voice-nav';

// --- Types ---

export type SOSState = 'idle' | 'countdown' | 'alerting' | 'sent';

export type SOSStatus = {
  state: SOSState;
  secondsRemaining: number;
  contacts: EmergencyContact[];
  location: { latitude: number; longitude: number } | null;
};

type SOSSubscriber = (status: SOSStatus) => void;

// --- Constants ---

const COUNTDOWN_SECONDS = 30;
const UK_EMERGENCY = '999';

// --- State ---

let currentState: SOSState = 'idle';
let secondsRemaining = 0;
let countdownInterval: ReturnType<typeof setInterval> | null = null;
let sosLocation: { latitude: number; longitude: number } | null = null;
let contactsList: EmergencyContact[] = [];
let subscribers: SOSSubscriber[] = [];

// --- Helpers ---

function notifySubscribers() {
  const status = getSOSState();
  for (const sub of subscribers) {
    sub(status);
  }
}

function setState(state: SOSState) {
  currentState = state;
  notifySubscribers();
}

function formatLocationMessage(location: { latitude: number; longitude: number } | null): string {
  if (!location) return 'Location unavailable.';
  const lat = location.latitude.toFixed(6);
  const lng = location.longitude.toFixed(6);
  const mapsUrl = `https://maps.google.com/maps?q=${lat},${lng}`;
  return `GPS: ${lat}, ${lng}\n${mapsUrl}`;
}

async function sendSMSToContact(contact: EmergencyContact, message: string): Promise<void> {
  const encodedMessage = encodeURIComponent(message);
  const url = `sms:${contact.phone}?body=${encodedMessage}`;
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  } catch {
    // SMS send failed, continue with other contacts
  }
}

async function callEmergency(): Promise<void> {
  const url = `tel:${UK_EMERGENCY}`;
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  } catch {
    // Call failed
  }
}

async function executeAlerts(): Promise<void> {
  setState('alerting');

  const contacts = await getCrashContacts();
  contactsList = contacts;

  const locationText = formatLocationMessage(sosLocation);
  const message = `EMERGENCY SOS: A motorcycle crash has been detected. Rider may need immediate help.\n\n${locationText}\n\nThis is an automated message from VisorUp.`;

  // Send SMS to all emergency contacts
  for (const contact of contacts) {
    await sendSMSToContact(contact, message);
  }

  // Attempt to call emergency services
  await callEmergency();

  speak('Emergency contacts have been notified. Help is on the way.', true);
  heavyHaptic();

  setState('sent');
}

// --- Public API ---

export function triggerSOS(location: { latitude: number; longitude: number } | null): void {
  if (currentState !== 'idle') return;

  sosLocation = location;
  secondsRemaining = COUNTDOWN_SECONDS;
  setState('countdown');

  speak('Crash detected. Emergency services will be contacted in 30 seconds. Tap screen to cancel.', true);
  heavyHaptic();

  countdownInterval = setInterval(() => {
    secondsRemaining -= 1;
    warningHaptic();

    if (secondsRemaining <= 10 && secondsRemaining > 0 && secondsRemaining % 5 === 0) {
      speak(`${secondsRemaining} seconds remaining.`, true);
    }

    if (secondsRemaining <= 0) {
      if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
      }
      executeAlerts();
    }

    notifySubscribers();
  }, 1000);
}

export function cancelSOS(): void {
  if (currentState !== 'countdown') return;

  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }

  secondsRemaining = 0;
  sosLocation = null;
  setState('idle');

  speak('SOS cancelled. Ride safe.', true);
}

export function getSOSState(): SOSStatus {
  return {
    state: currentState,
    secondsRemaining,
    contacts: contactsList,
    location: sosLocation,
  };
}

export function subscribeSOSState(callback: SOSSubscriber): () => void {
  subscribers.push(callback);
  return () => {
    subscribers = subscribers.filter((sub) => sub !== callback);
  };
}

/** Reset SOS to idle state (e.g., when navigating away or ending ride). */
export function resetSOS(): void {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
  currentState = 'idle';
  secondsRemaining = 0;
  sosLocation = null;
  contactsList = [];
}
