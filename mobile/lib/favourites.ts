import { supabase, SavedTrip } from './supabase';
import { sampleRoutes } from './sample-routes';

const ITEM_TYPE = 'route';

export async function getFavouriteRouteIds(): Promise<Set<string>> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Set();
  const { data } = await supabase
    .from('favourites')
    .select('item_slug')
    .eq('user_id', user.id)
    .eq('item_type', ITEM_TYPE);
  return new Set((data || []).map((r: { item_slug: string }) => r.item_slug));
}

export async function addFavourite(routeId: string): Promise<{ error?: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Sign in to save favourites.' };
  const { error } = await supabase
    .from('favourites')
    .insert({ user_id: user.id, item_type: ITEM_TYPE, item_slug: routeId });
  return { error: error?.message };
}

export async function removeFavourite(routeId: string): Promise<{ error?: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Sign in to manage favourites.' };
  const { error } = await supabase
    .from('favourites')
    .delete()
    .eq('user_id', user.id)
    .eq('item_type', ITEM_TYPE)
    .eq('item_slug', routeId);
  return { error: error?.message };
}

export async function toggleFavourite(routeId: string, currentlyFav: boolean) {
  return currentlyFav ? removeFavourite(routeId) : addFavourite(routeId);
}

export async function fetchFavouriteRoutes(): Promise<SavedTrip[]> {
  const ids = await getFavouriteRouteIds();
  if (ids.size === 0) return [];
  const realIds = [...ids].filter((id) => !id.startsWith('demo-'));
  let saved: SavedTrip[] = [];
  if (realIds.length > 0) {
    const { data } = await supabase.from('saved_trips').select('*').in('id', realIds);
    if (data) saved = data;
  }
  const demoFavs = sampleRoutes.filter((r) => ids.has(r.id));
  return [...saved, ...demoFavs];
}
