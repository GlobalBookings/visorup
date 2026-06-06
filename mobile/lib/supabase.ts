import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export type SavedTrip = {
  id: string;
  user_id: string;
  name: string;
  description: string;
  waypoints: Array<{ lat: number; lng: number; name?: string }>;
  settings: Record<string, any>;
  route_stats: { distance?: number; duration?: number; waypoints?: number };
  route_coords: number[][];
  gpx_data: string | null;
  day_segments: any[];
  is_public: boolean;
  share_slug: string | null;
  created_at: string;
  updated_at: string;
};

export type Profile = {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
  bike_slug: string | null;
  created_at: string;
};

export type UserBike = {
  id: string;
  user_id: string;
  make: string;
  model: string;
  year: number | null;
  nickname: string | null;
  photo_url: string | null;
  notes: string | null;
  is_primary: boolean;
  tank_litres: number | null;
  mpg: number | null;
};
