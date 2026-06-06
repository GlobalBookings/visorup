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

  async uploadAvatar(file) {
    const user = await this.getUser();
    if (!user) throw new Error('Not logged in');
    const sb = getSupabase();
    var ext = file.name.split('.').pop().toLowerCase();
    if (!['jpg', 'jpeg', 'png', 'webp'].includes(ext)) throw new Error('Only JPG, PNG, and WebP images are allowed');
    if (file.size > 2 * 1024 * 1024) throw new Error('Image must be under 2MB');
    var path = user.id + '/avatar.' + ext;
    const { error: uploadErr } = await sb.storage.from('avatars').upload(path, file, { upsert: true, contentType: file.type });
    if (uploadErr) throw uploadErr;
    const { data: urlData } = sb.storage.from('avatars').getPublicUrl(path);
    var avatarUrl = urlData.publicUrl + '?t=' + Date.now();
    await this.updateProfile({ avatar_url: avatarUrl });
    return avatarUrl;
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

// ── User Garage (Bikes) ──────────────────────────────────────────

const VisorUpGarage = {

  async list() {
    const user = await VisorUpAuth.getUser();
    if (!user) return [];
    const sb = getSupabase();
    const { data, error } = await sb.from('user_bikes')
      .select('*')
      .eq('user_id', user.id)
      .order('is_primary', { ascending: false })
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async add(bike) {
    const user = await VisorUpAuth.getUser();
    if (!user) throw new Error('Not logged in');
    const sb = getSupabase();
    const { data, error } = await sb.from('user_bikes')
      .insert({
        user_id: user.id,
        make: bike.make,
        model: bike.model,
        year: bike.year || null,
        nickname: bike.nickname || null,
        notes: bike.notes || null,
        is_primary: bike.isPrimary || false,
        tank_litres: bike.tankLitres || null,
        mpg: bike.mpg || null
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const user = await VisorUpAuth.getUser();
    if (!user) throw new Error('Not logged in');
    const sb = getSupabase();
    const { data, error } = await sb.from('user_bikes')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async remove(id) {
    const user = await VisorUpAuth.getUser();
    if (!user) throw new Error('Not logged in');
    const sb = getSupabase();
    const { error } = await sb.from('user_bikes').delete().eq('id', id).eq('user_id', user.id);
    if (error) throw error;
  },

  async setPrimary(id) {
    const user = await VisorUpAuth.getUser();
    if (!user) throw new Error('Not logged in');
    const sb = getSupabase();
    await sb.from('user_bikes').update({ is_primary: false }).eq('user_id', user.id);
    const { data, error } = await sb.from('user_bikes')
      .update({ is_primary: true })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async uploadPhoto(bikeId, file) {
    const user = await VisorUpAuth.getUser();
    if (!user) throw new Error('Not logged in');
    const sb = getSupabase();
    var ext = file.name.split('.').pop().toLowerCase();
    if (!['jpg', 'jpeg', 'png', 'webp'].includes(ext)) throw new Error('Only JPG, PNG, and WebP allowed');
    if (file.size > 5 * 1024 * 1024) throw new Error('Image must be under 5MB');
    var path = user.id + '/' + bikeId + '.' + ext;
    const { error: uploadErr } = await sb.storage.from('bike-photos').upload(path, file, { upsert: true, contentType: file.type });
    if (uploadErr) throw uploadErr;
    const { data: urlData } = sb.storage.from('bike-photos').getPublicUrl(path);
    var photoUrl = urlData.publicUrl + '?t=' + Date.now();
    await this.update(bikeId, { photo_url: photoUrl });
    return photoUrl;
  },

  async listByUser(userId) {
    const sb = getSupabase();
    if (!sb) return [];
    const { data, error } = await sb.from('user_bikes')
      .select('*')
      .eq('user_id', userId)
      .order('is_primary', { ascending: false });
    if (error) return [];
    return data || [];
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

// ── Community Posts ──────────────────────────────────────────────

const VisorUpPosts = {

  async create(post) {
    const user = await VisorUpAuth.getUser();
    if (!user) throw new Error('Not logged in');
    const sb = getSupabase();
    const { data, error } = await sb.from('community_posts')
      .insert({
        user_id: user.id,
        type: post.type || 'ride-report',
        title: post.title || '',
        body: post.body || '',
        photos: post.photos || [],
        route_slug: post.routeSlug || null,
        destination_slug: post.destinationSlug || null,
        miles: post.miles || 0,
        rating: post.rating || 0,
        bike: post.bike || '',
        tags: post.tags || []
      })
      .select('*, profiles!inner(display_name, avatar_url)')
      .single();
    if (error) throw error;
    return data;
  },

  async list(opts) {
    opts = opts || {};
    const sb = getSupabase();
    if (!sb) return [];
    var query = sb.from('community_posts')
      .select('*, profiles!inner(display_name, avatar_url)')
      .order('created_at', { ascending: false })
      .limit(opts.limit || 50);

    if (opts.userId) query = query.eq('user_id', opts.userId);
    if (opts.type) query = query.eq('type', opts.type);
    if (opts.offset) query = query.range(opts.offset, opts.offset + (opts.limit || 50) - 1);

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async listByFollowing(followingIds, limit) {
    const sb = getSupabase();
    if (!sb || !followingIds.length) return [];
    const { data, error } = await sb.from('community_posts')
      .select('*, profiles!inner(display_name, avatar_url)')
      .in('user_id', followingIds)
      .order('created_at', { ascending: false })
      .limit(limit || 50);
    if (error) throw error;
    return data || [];
  },

  async listTop(limit) {
    const sb = getSupabase();
    if (!sb) return [];
    const { data, error } = await sb.from('community_posts')
      .select('*, profiles!inner(display_name, avatar_url)')
      .order('likes_count', { ascending: false })
      .order('comments_count', { ascending: false })
      .limit(limit || 50);
    if (error) throw error;
    return data || [];
  },

  async remove(id) {
    const user = await VisorUpAuth.getUser();
    if (!user) throw new Error('Not logged in');
    const sb = getSupabase();
    const { error } = await sb.from('community_posts').delete().eq('id', id).eq('user_id', user.id);
    if (error) throw error;
  },

  async toggleLike(postId) {
    const user = await VisorUpAuth.getUser();
    if (!user) throw new Error('Not logged in');
    const sb = getSupabase();

    const { data: existing } = await sb.from('community_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .single();

    if (existing) {
      await sb.from('community_likes').delete().eq('id', existing.id);
      return false;
    } else {
      await sb.from('community_likes').insert({ post_id: postId, user_id: user.id });
      return true;
    }
  },

  async isLiked(postId) {
    const user = await VisorUpAuth.getUser();
    if (!user) return false;
    const sb = getSupabase();
    const { data } = await sb.from('community_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .single();
    return !!data;
  },

  async getLikedPostIds(postIds) {
    const user = await VisorUpAuth.getUser();
    if (!user || !postIds.length) return {};
    const sb = getSupabase();
    const { data } = await sb.from('community_likes')
      .select('post_id')
      .eq('user_id', user.id)
      .in('post_id', postIds);
    var map = {};
    (data || []).forEach(function(r) { map[r.post_id] = true; });
    return map;
  },

  async addComment(postId, content) {
    const user = await VisorUpAuth.getUser();
    if (!user) throw new Error('Not logged in');
    const sb = getSupabase();
    const { data, error } = await sb.from('community_comments')
      .insert({ post_id: postId, user_id: user.id, content: content })
      .select('*, profiles!inner(display_name, avatar_url)')
      .single();
    if (error) throw error;
    return data;
  },

  async getComments(postId) {
    const sb = getSupabase();
    if (!sb) return [];
    const { data, error } = await sb.from('community_comments')
      .select('*, profiles!inner(display_name, avatar_url)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async deleteComment(commentId) {
    const user = await VisorUpAuth.getUser();
    if (!user) throw new Error('Not logged in');
    const sb = getSupabase();
    const { error } = await sb.from('community_comments').delete().eq('id', commentId).eq('user_id', user.id);
    if (error) throw error;
  },

  async getFollowing() {
    const user = await VisorUpAuth.getUser();
    if (!user) return [];
    const sb = getSupabase();
    const { data, error } = await sb.from('follows')
      .select('following_id')
      .eq('follower_id', user.id);
    if (error) return [];
    return (data || []).map(function(r) { return r.following_id; });
  }
};
