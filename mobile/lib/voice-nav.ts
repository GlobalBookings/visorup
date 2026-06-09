import * as Speech from 'expo-speech';

let voiceEnabled = true;

export function setVoiceEnabled(enabled: boolean) {
  voiceEnabled = enabled;
  if (!enabled) Speech.stop();
}

export function isVoiceEnabled(): boolean {
  return voiceEnabled;
}

export function speak(text: string, priority: boolean = false) {
  if (!voiceEnabled) return;
  if (priority) Speech.stop();
  Speech.speak(text, {
    language: 'en-GB',
    rate: 0.95,
    pitch: 1.0,
  });
}

export function speakDirection(instruction: string) {
  speak(instruction, true);
}

export function speakWaypointArrival(name: string) {
  speak(`Arriving at ${name}`);
}

export function speakOffRoute() {
  speak('You are off route. Recalculating.', true);
}

export function speakRideStart() {
  speak('Ride started. Stay safe.');
}

export function speakRideEnd(distanceMiles: number, timeMinutes: number) {
  const dist = Math.round(distanceMiles);
  const mins = Math.round(timeMinutes);
  speak(`Ride complete. ${dist} miles in ${mins} minutes.`);
}
