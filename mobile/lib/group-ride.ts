/**
 * Real-time group ride system using Supabase Realtime.
 *
 * Architecture:
 * - Presence: Live rider positions (track/untrack, sync events)
 * - Broadcast: Leader commands (rally_point, route_update, end_ride)
 * - DB table `group_rides`: Ride session metadata + join codes
 *
 * Position broadcasts are throttled to every 2 seconds.
 * Max 20 riders per group ride.
 */
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from './supabase';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type RiderPosition = {
  userId: string;
  displayName: string;
  latitude: number;
  longitude: number;
  heading: number;
  speedMph: number;
  timestamp: number;
  isLeader?: boolean;
};

export type GroupRide = {
  id: string;
  name: string;
  leaderId: string;
  leaderName: string;
  routeId: string | null;
  status: 'waiting' | 'active' | 'finished';
  createdAt: string;
  joinCode: string;
};

export type RallyPoint = {
  latitude: number;
  longitude: number;
  name: string;
  timestamp: number;
};

export type GroupRideState = {
  ride: GroupRide | null;
  riders: RiderPosition[];
  rallyPoint: RallyPoint | null;
  isLeader: boolean;
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MAX_RIDERS = 20;
const POSITION_THROTTLE_MS = 2000;
const JOIN_CODE_LENGTH = 6;
const JOIN_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no ambiguous chars

// ---------------------------------------------------------------------------
// Internal state
// ---------------------------------------------------------------------------

let state: GroupRideState = {
  ride: null,
  riders: [],
  rallyPoint: null,
  isLeader: false,
};

let channel: RealtimeChannel | null = null;
let lastBroadcastTs = 0;
const listeners = new Set<(s: GroupRideState) => void>();

function emit() {
  for (const cb of listeners) {
    try {
      cb({ ...state });
    } catch (_) {}
  }
}

function setState(patch: Partial<GroupRideState>) {
  state = { ...state, ...patch };
  emit();
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateJoinCode(): string {
  let code = '';
  for (let i = 0; i < JOIN_CODE_LENGTH; i++) {
    code += JOIN_CODE_CHARS[Math.floor(Math.random() * JOIN_CODE_CHARS.length)];
  }
  return code;
}

async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data?.user ?? null;
}

async function getDisplayName(userId: string): Promise<string> {
  const { data } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', userId)
    .single();
  return data?.display_name ?? 'Rider';
}

function mapDbRow(row: any): GroupRide {
  return {
    id: row.id,
    name: row.name,
    leaderId: row.leader_id,
    leaderName: row.leader_name,
    routeId: row.route_id ?? null,
    status: row.status,
    createdAt: row.created_at,
    joinCode: row.join_code,
  };
}

// ---------------------------------------------------------------------------
// Channel setup
// ---------------------------------------------------------------------------

let currentUserId = '';
let currentDisplayName = 'Rider';
let lastKnownPosition: { latitude: number; longitude: number; heading: number; speedMph: number } | null = null;

// The channel is keyed by the join code (not the DB id) so two devices with the
// same code always connect, even when the `group_rides` table is unavailable.
function setupChannel(channelKey: string, userId: string, displayName: string, isLeader: boolean) {
  if (channel) {
    supabase.removeChannel(channel);
    channel = null;
  }

  currentUserId = userId;
  currentDisplayName = displayName;

  channel = supabase.channel(`group-ride:${channelKey}`, {
    config: { presence: { key: userId } },
  });

  // Presence sync — rebuild rider list from presence state
  channel.on('presence', { event: 'sync' }, () => {
    const presenceState = channel!.presenceState<RiderPosition>();
    const riders: RiderPosition[] = [];

    for (const key of Object.keys(presenceState)) {
      const entries = presenceState[key];
      if (entries && entries.length > 0) {
        riders.push(entries[0] as unknown as RiderPosition);
      }
    }

    // Resolve the leader from presence so joiners can highlight them even when
    // no DB row exists (leaderId unknown at join time).
    const leaderRider = riders.find((r) => r.isLeader);
    if (leaderRider && state.ride && state.ride.leaderId !== leaderRider.userId) {
      setState({
        riders,
        ride: { ...state.ride, leaderId: leaderRider.userId, leaderName: leaderRider.displayName },
      });
    } else {
      setState({ riders });
    }
  });

  // Broadcast: rally_point
  channel.on('broadcast', { event: 'rally_point' }, ({ payload }) => {
    if (payload) {
      setState({ rallyPoint: payload as RallyPoint });
      // TODO: Voice alert — "Rally point set at {name}"
    }
  });

  // Broadcast: end_ride
  channel.on('broadcast', { event: 'end_ride' }, () => {
    // TODO: Voice alert — "Group ride ended by leader"
    cleanup();
    setState({ ride: null, riders: [], rallyPoint: null, isLeader: false });
  });

  // Broadcast: ride_started
  channel.on('broadcast', { event: 'ride_started' }, () => {
    if (state.ride) {
      setState({ ride: { ...state.ride, status: 'active' } });
      // TODO: Voice alert — "Group ride is now active, let's roll!"
    }
  });

  channel.subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      // Track initial presence (use last known position if we have one)
      await channel!.track({
        userId,
        displayName,
        latitude: lastKnownPosition?.latitude ?? 0,
        longitude: lastKnownPosition?.longitude ?? 0,
        heading: lastKnownPosition?.heading ?? 0,
        speedMph: lastKnownPosition?.speedMph ?? 0,
        timestamp: Date.now(),
        isLeader,
      } satisfies RiderPosition);
    }
  });
}

function cleanup() {
  if (channel) {
    channel.untrack();
    supabase.removeChannel(channel);
    channel = null;
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Create a new group ride. The current user becomes the leader.
 */
export async function createGroupRide(
  name: string,
  routeId?: string
): Promise<GroupRide> {
  const user = await getCurrentUser();
  if (!user) throw new Error('Must be signed in to create a group ride');

  const displayName = await getDisplayName(user.id);
  const joinCode = generateJoinCode();

  // Best-effort persistence: if the `group_rides` table exists the ride is
  // discoverable by code across sessions; if not, we fall back to a purely
  // realtime ride keyed by the join code so it still works.
  let ride: GroupRide = {
    id: joinCode,
    name,
    leaderId: user.id,
    leaderName: displayName,
    routeId: routeId ?? null,
    status: 'waiting',
    createdAt: new Date().toISOString(),
    joinCode,
  };

  try {
    const { data, error } = await supabase
      .from('group_rides')
      .insert({
        name,
        leader_id: user.id,
        leader_name: displayName,
        route_id: routeId ?? null,
        join_code: joinCode,
        status: 'waiting',
      })
      .select()
      .single();
    if (!error && data) ride = mapDbRow(data);
  } catch (_) {}

  setState({ ride, riders: [], rallyPoint: null, isLeader: true });
  setupChannel(joinCode, user.id, displayName, true);

  return ride;
}

/**
 * Join an existing group ride via 6-character code.
 */
export async function joinGroupRide(joinCode: string): Promise<GroupRide> {
  const user = await getCurrentUser();
  if (!user) throw new Error('Must be signed in to join a group ride');

  const normalizedCode = joinCode.toUpperCase().trim();
  const displayName = await getDisplayName(user.id);

  // Try to look up ride metadata by code. If the table is unavailable, fall
  // back to a realtime-only ride so joining still works via the shared code.
  let ride: GroupRide | null = null;
  try {
    const { data, error } = await supabase
      .from('group_rides')
      .select('*')
      .eq('join_code', normalizedCode)
      .neq('status', 'finished')
      .single();
    if (!error && data) ride = mapDbRow(data);
  } catch (_) {}

  if (!ride) {
    ride = {
      id: normalizedCode,
      name: 'Group Ride',
      leaderId: '',
      leaderName: 'Leader',
      routeId: null,
      status: 'active',
      createdAt: new Date().toISOString(),
      joinCode: normalizedCode,
    };
  }

  const isLeader = ride.leaderId === user.id;

  setState({ ride, riders: [], rallyPoint: null, isLeader });
  setupChannel(normalizedCode, user.id, displayName, isLeader);

  return ride;
}

/**
 * Leave the current group ride.
 */
export function leaveGroupRide(): void {
  cleanup();
  setState({ ride: null, riders: [], rallyPoint: null, isLeader: false });
}

/**
 * Start the group ride (leader only). Changes status to 'active'.
 */
export async function startGroupRide(): Promise<void> {
  if (!state.ride || !state.isLeader) return;

  try {
    await supabase.from('group_rides').update({ status: 'active' }).eq('id', state.ride.id);
  } catch (_) {}

  setState({ ride: { ...state.ride, status: 'active' } });

  // Notify all riders
  channel?.send({
    type: 'broadcast',
    event: 'ride_started',
    payload: {},
  });
}

/**
 * End the group ride (leader only). Changes status to 'finished'.
 */
export async function endGroupRide(): Promise<void> {
  if (!state.ride || !state.isLeader) return;

  try {
    await supabase.from('group_rides').update({ status: 'finished' }).eq('id', state.ride.id);
  } catch (_) {}

  // Notify all riders before cleaning up
  channel?.send({
    type: 'broadcast',
    event: 'end_ride',
    payload: {},
  });

  // Short delay to let broadcast propagate
  setTimeout(() => {
    cleanup();
    setState({ ride: null, riders: [], rallyPoint: null, isLeader: false });
  }, 500);
}

/**
 * Broadcast own position via Presence. Throttled to every 2 seconds.
 */
export function broadcastPosition(pos: RiderPosition): void {
  lastKnownPosition = {
    latitude: pos.latitude,
    longitude: pos.longitude,
    heading: pos.heading,
    speedMph: pos.speedMph,
  };

  const now = Date.now();
  if (now - lastBroadcastTs < POSITION_THROTTLE_MS) return;
  lastBroadcastTs = now;

  if (!channel) return;

  channel.track({
    userId: pos.userId || currentUserId,
    displayName: pos.displayName || currentDisplayName,
    latitude: pos.latitude,
    longitude: pos.longitude,
    heading: pos.heading,
    speedMph: pos.speedMph,
    timestamp: now,
    isLeader: state.isLeader,
  } satisfies RiderPosition);
}

/**
 * Set a rally point (leader only). Broadcasts to all riders.
 */
export function setRallyPoint(point: RallyPoint): void {
  if (!state.isLeader || !channel) return;

  setState({ rallyPoint: point });

  channel.send({
    type: 'broadcast',
    event: 'rally_point',
    payload: point,
  });
}

/**
 * Get current group ride state (snapshot).
 */
export function getGroupRideState(): GroupRideState {
  return { ...state };
}

/**
 * Subscribe to group ride state changes. Returns unsubscribe function.
 */
export function subscribeGroupRide(
  cb: (state: GroupRideState) => void
): () => void {
  listeners.add(cb);
  // Emit current state immediately
  cb({ ...state });
  return () => {
    listeners.delete(cb);
  };
}
