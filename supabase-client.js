/* ═══════════════════════════════════════════════════════════════════
   VisorUp — Supabase Client
   Auth, saved trips, and favourites
   ═══════════════════════════════════════════════════════════════════ */

let _supabase = null;

function getSupabase() {
  if (!_supabase && window.supabase && window.VISORUP_SUPABASE) {
    _supabase = window.supabase.createClient(
      window.VISORUP_SUPABASE.url,
      window.VISORUP_SUPABASE.anonKey
    );
  }
  return _supabase;
}

// ── Auth ─────────────────────────────────────────────────────────

const VisorUpAuth = {

  async getUser() {
    const sb = getSupabase();
    if (!sb) return null;
    const { data: { user } } = await sb.auth.getUser();
    return user;
  },

  async getSession() {
    const sb = getSupabase();
    if (!sb) return null;
    const { data: { session } } = await sb.auth.getSession();
    return session;
  },

  async getProfile() {
    const user = await this.getUser();
    if (!user) return null;
    const sb = getSupabase();
    const { data } = await sb.from('profiles').select('*').eq('id', user.id).single();
    return data;
  },

  async signUpEmail(email, password, displayName) {
    const sb = getSupabase();
    const { data, error } = await sb.auth.signUp({
      email: email,
      password: password,
      options: { data: { full_name: displayName } }
    });
    if (error) throw error;
    return data;
  },

  async signInEmail(email, password) {
    const sb = getSupabase();
    const { data, error } = await sb.auth.signInWithPassword({ email: email, password: password });
    if (error) throw error;
    return data;
  },

  async signInGoogle() {
    const sb = getSupabase();
    const { data, error } = await sb.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/' }
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const sb = getSupabase();
    const { error } = await sb.auth.signOut();
    if (error) throw error;
  },

  async resetPassword(email) {
    const sb = getSupabase();
    const { error } = await sb.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password'
    });
    if (error) throw error;
  },

  async updateProfile(updates) {
    const user = await this.getUser();
    if (!user) throw new Error('Not logged in');
    const sb = getSupabase();
    const { data, error } = await sb.from('profiles').update(updates).eq('id', user.id).select().single();
    if (error) throw error;
    return data;
  },

  onAuthChange(callback) {
    const sb = getSupabase();
    if (!sb) return;
    sb.auth.onAuthStateChange(function(event, session) {
      callback(event, session);
    });
  }
};

// ── Saved Trips ──────────────────────────────────────────────────

const VisorUpTrips = {

  async list() {
    const user = await VisorUpAuth.getUser();
    if (!user) return [];
    const sb = getSupabase();
    const { data, error } = await sb.from('saved_trips')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async get(id) {
    const sb = getSupabase();
    const { data, error } = await sb.from('saved_trips')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async getByShareSlug(slug) {
    const sb = getSupabase();
    const { data, error } = await sb.from('saved_trips')
      .select('*')
      .eq('share_slug', slug)
      .eq('is_public', true)
      .single();
    if (error) throw error;
    return data;
  },

  async save(trip) {
    const user = await VisorUpAuth.getUser();
    if (!user) throw new Error('Not logged in');
    const sb = getSupabase();

    var record = {
      user_id: user.id,
      name: trip.name,
      description: trip.description || '',
      waypoints: trip.waypoints,
      settings: trip.settings || {},
      route_stats: trip.routeStats || {},
      is_public: trip.isPublic || false
    };

    if (trip.id) {
      const { data, error } = await sb.from('saved_trips')
        .update(record)
        .eq('id', trip.id)
        .eq('user_id', user.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await sb.from('saved_trips')
        .insert(record)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  },

  async delete(id) {
    const user = await VisorUpAuth.getUser();
    if (!user) throw new Error('Not logged in');
    const sb = getSupabase();
    const { error } = await sb.from('saved_trips').delete().eq('id', id).eq('user_id', user.id);
    if (error) throw error;
  },

  async togglePublic(id) {
    const user = await VisorUpAuth.getUser();
    if (!user) throw new Error('Not logged in');
    const sb = getSupabase();
    const { data: trip } = await sb.from('saved_trips').select('is_public, share_slug').eq('id', id).single();
    var newPublic = !trip.is_public;
    var shareSlug = trip.share_slug;
    if (newPublic && !shareSlug) {
      shareSlug = id.substring(0, 8) + '-' + Date.now().toString(36);
    }
    const { data, error } = await sb.from('saved_trips')
      .update({ is_public: newPublic, share_slug: newPublic ? shareSlug : trip.share_slug })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};

// ── Favourites ───────────────────────────────────────────────────

const VisorUpFavourites = {

  async list() {
    const user = await VisorUpAuth.getUser();
    if (!user) return [];
    const sb = getSupabase();
    const { data, error } = await sb.from('favourites')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async toggle(itemType, itemSlug) {
    const user = await VisorUpAuth.getUser();
    if (!user) throw new Error('Not logged in');
    const sb = getSupabase();

    const { data: existing } = await sb.from('favourites')
      .select('id')
      .eq('user_id', user.id)
      .eq('item_type', itemType)
      .eq('item_slug', itemSlug)
      .single();

    if (existing) {
      await sb.from('favourites').delete().eq('id', existing.id);
      return false;
    } else {
      await sb.from('favourites').insert({
        user_id: user.id,
        item_type: itemType,
        item_slug: itemSlug
      });
      return true;
    }
  },

  async isFavourited(itemType, itemSlug) {
    const user = await VisorUpAuth.getUser();
    if (!user) return false;
    const sb = getSupabase();
    const { data } = await sb.from('favourites')
      .select('id')
      .eq('user_id', user.id)
      .eq('item_type', itemType)
      .eq('item_slug', itemSlug)
      .single();
    return !!data;
  }
};
