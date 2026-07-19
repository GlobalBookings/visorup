import { supabase, SavedTrip } from './supabase';

function slugify(name: string): string {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
  const rand = Math.random().toString(36).slice(2, 7);
  return `${base || 'route'}-${rand}`;
}

/** Publishes a saved route to the community (is_public = true, ensures a share_slug). */
export async function publishRoute(trip: SavedTrip): Promise<{ error: string | null; slug: string | null }> {
  const slug = trip.share_slug || slugify(trip.name);
  try {
    const { error } = await supabase
      .from('saved_trips')
      .update({ is_public: true, share_slug: slug })
      .eq('id', trip.id);
    if (error) {
      // Older databases may lack share_slug — retry with just the flag.
      if (/share_slug/i.test(error.message)) {
        const { error: e2 } = await supabase.from('saved_trips').update({ is_public: true }).eq('id', trip.id);
        return { error: e2 ? e2.message : null, slug: null };
      }
      return { error: error.message, slug: null };
    }
    return { error: null, slug };
  } catch (e: any) {
    return { error: e?.message || 'Could not publish route.', slug: null };
  }
}

export async function unpublishRoute(tripId: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.from('saved_trips').update({ is_public: false }).eq('id', tripId);
    return { error: error ? error.message : null };
  } catch (e: any) {
    return { error: e?.message || 'Could not unpublish route.' };
  }
}

/** Copies a public/sample route into the signed-in user's own saved routes. */
export async function cloneRouteToMine(trip: SavedTrip): Promise<{ error: string | null }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Sign in to save this route to your account.' };
  const payload = {
    user_id: user.id,
    name: trip.name,
    description: trip.description || '',
    waypoints: trip.waypoints || [],
    route_coords: trip.route_coords || [],
    route_stats: trip.route_stats || {},
    settings: trip.settings || {},
    day_segments: trip.day_segments || [],
    is_public: false,
  };
  try {
    const { error } = await supabase.from('saved_trips').insert(payload);
    return { error: error ? error.message : null };
  } catch (e: any) {
    return { error: e?.message || 'Could not save route.' };
  }
}
