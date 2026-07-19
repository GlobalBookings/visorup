import { supabase } from './supabase';

export type LeaderboardScope = 'curvy_miles' | 'total_miles' | 'rides';

export type RiderStat = {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  curvy_miles: number;
  total_miles: number;
  rides: number;
  kudos: number;
};

const METRES_TO_MILES = 0.000621371;

export async function fetchLeaderboard(scope: LeaderboardScope): Promise<RiderStat[]> {
  try {
    const { data, error } = await supabase
      .from('rider_stats')
      .select('*')
      .order(scope, { ascending: false })
      .limit(50);
    if (error || !data) return [];
    return data as RiderStat[];
  } catch {
    return [];
  }
}

export async function fetchMyStat(): Promise<RiderStat | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('rider_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (!error && data) return data as RiderStat;
    } catch {}

    // No aggregate row yet: build a best-effort fallback from the rider's own data.
    let display_name: string | null = null;
    let avatar_url: string | null = null;
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name, avatar_url')
        .eq('id', user.id)
        .single();
      if (profile) {
        display_name = profile.display_name ?? null;
        avatar_url = profile.avatar_url ?? null;
      }
    } catch {}

    let total_miles = 0;
    let rides = 0;
    try {
      const { data: r } = await supabase
        .from('rides')
        .select('distance_m')
        .eq('user_id', user.id);
      if (r) {
        rides = r.length;
        total_miles = Math.round(
          r.reduce((s: number, x: { distance_m: number }) => s + (x.distance_m || 0), 0) * METRES_TO_MILES
        );
      }
    } catch {}

    return {
      user_id: user.id,
      display_name,
      avatar_url,
      curvy_miles: 0,
      total_miles,
      rides,
      kudos: 0,
    };
  } catch {
    return null;
  }
}

export async function upsertMyStat(): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let display_name: string | null = null;
    let avatar_url: string | null = null;
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name, avatar_url')
        .eq('id', user.id)
        .single();
      if (profile) {
        display_name = profile.display_name ?? null;
        avatar_url = profile.avatar_url ?? null;
      }
    } catch {}

    let total_miles = 0;
    let rides = 0;
    try {
      const { data: r } = await supabase
        .from('rides')
        .select('distance_m')
        .eq('user_id', user.id);
      if (r) {
        rides = r.length;
        total_miles = Math.round(
          r.reduce((s: number, x: { distance_m: number }) => s + (x.distance_m || 0), 0) * METRES_TO_MILES
        );
      }
    } catch {}

    try {
      await supabase.from('rider_stats').upsert(
        {
          user_id: user.id,
          display_name,
          avatar_url,
          total_miles,
          rides,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id', ignoreDuplicates: false }
      );
    } catch {}
  } catch {}
}

export async function giveKudos(rideId: string, toUserId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    const { error } = await supabase
      .from('ride_kudos')
      .insert({ from_user: user.id, ride_id: rideId, to_user: toUserId });
    return !error;
  } catch {
    return false;
  }
}

export async function getKudosCount(rideId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('ride_kudos')
      .select('*', { count: 'exact', head: true })
      .eq('ride_id', rideId);
    if (error || count == null) return 0;
    return count;
  } catch {
    return 0;
  }
}
