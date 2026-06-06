/**
 * VisorUp Community — Activity feed, ride reports, likes, and comments.
 * Uses Supabase via VisorUpPosts (supabase-client.js) with localStorage fallback.
 */

const VisorUpCommunity = {

  _storageKey: 'vu_community',

  _getData() {
    try {
      var raw = localStorage.getItem(this._storageKey);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return { posts: [], likes: {}, comments: {} };
  },

  _saveData(data) {
    try { localStorage.setItem(this._storageKey, JSON.stringify(data)); } catch (e) {}
  },

  _hasSupabase() {
    return typeof VisorUpPosts !== 'undefined' && typeof getSupabase === 'function' && !!getSupabase();
  },

  async _getUser() {
    if (typeof VisorUpAuth !== 'undefined') {
      try { return await VisorUpAuth.getUser(); } catch (e) {}
    }
    return null;
  },

  async _getProfile() {
    if (typeof VisorUpAuth !== 'undefined') {
      try {
        var user = await VisorUpAuth.getUser();
        return user ? await VisorUpAuth.getProfile() : null;
      } catch (e) {}
    }
    return null;
  },

  // ── Posts (Ride Reports) ──────────────────────────────────

  async createPost(post) {
    var user = await this._getUser();
    var profile = await this._getProfile();

    // Try Supabase first
    if (this._hasSupabase() && user) {
      try {
        var sbPost = await VisorUpPosts.create(post);
        if (sbPost) {
          if (typeof VisorUpGamification !== 'undefined') {
            VisorUpGamification.addXP(30, 'Posted ride report');
          }
          return this._normalisePost(sbPost);
        }
      } catch (e) { console.warn('Community: Supabase create failed, using local', e); }
    }

    // Fallback to localStorage
    var newPost = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 6),
      userId: user ? user.id : 'local',
      userName: (profile && profile.display_name) || 'Anonymous Rider',
      userAvatar: (profile && profile.avatar_url) || null,
      type: post.type || 'ride-report',
      title: post.title || '',
      body: post.body || '',
      photos: post.photos || [],
      routeSlug: post.routeSlug || null,
      destinationSlug: post.destinationSlug || null,
      miles: post.miles || 0,
      rating: post.rating || 0,
      bike: post.bike || '',
      tags: post.tags || [],
      createdAt: new Date().toISOString(),
      likeCount: 0,
      commentCount: 0
    };

    var local = this._getData();
    local.posts.unshift(newPost);
    if (local.posts.length > 200) local.posts = local.posts.slice(0, 200);
    this._saveData(local);

    if (typeof VisorUpGamification !== 'undefined') {
      VisorUpGamification.addXP(30, 'Posted ride report');
    }
    return newPost;
  },

  _normalisePost(sbRow) {
    var profile = sbRow.profiles || {};
    return {
      id: sbRow.id,
      userId: sbRow.user_id,
      userName: profile.display_name || 'Rider',
      userAvatar: profile.avatar_url || null,
      type: sbRow.type || 'ride-report',
      title: sbRow.title || '',
      body: sbRow.body || '',
      photos: sbRow.photos || [],
      routeSlug: sbRow.route_slug,
      destinationSlug: sbRow.destination_slug,
      miles: sbRow.miles || 0,
      rating: sbRow.rating || 0,
      bike: sbRow.bike || '',
      tags: sbRow.tags || [],
      createdAt: sbRow.created_at,
      likeCount: sbRow.likes_count || 0,
      commentCount: sbRow.comments_count || 0
    };
  },

  async getPosts(opts) {
    opts = opts || {};
    var self = this;

    // Try Supabase
    if (this._hasSupabase()) {
      try {
        var rows;
        if (opts.followingOnly) {
          var followingIds = await VisorUpPosts.getFollowing();
          rows = await VisorUpPosts.listByFollowing(followingIds, opts.limit || 50);
        } else if (opts.sort === 'top') {
          rows = await VisorUpPosts.listTop(opts.limit || 50);
        } else {
          rows = await VisorUpPosts.list(opts);
        }
        return rows.map(function(r) { return self._normalisePost(r); });
      } catch (e) { console.warn('Community: Supabase list failed, using local', e); }
    }

    // Fallback to localStorage
    var data = this._getData();
    var posts = data.posts || [];

    if (opts.type) posts = posts.filter(function(p) { return p.type === opts.type; });
    if (opts.userId) posts = posts.filter(function(p) { return p.userId === opts.userId; });

    if (opts.followingOnly) {
      var following = this.getFollowing();
      posts = posts.filter(function(p) { return following.indexOf(p.userId) !== -1; });
    }

    if (opts.sort === 'top') {
      posts.sort(function(a, b) {
        var scoreA = (a.likeCount || 0) + (a.commentCount || 0);
        var scoreB = (b.likeCount || 0) + (b.commentCount || 0);
        return scoreB - scoreA;
      });
    } else {
      posts.sort(function(a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
    }

    var limit = opts.limit || 50;
    var offset = opts.offset || 0;
    return posts.slice(offset, offset + limit);
  },

  async getFeed(tab) {
    tab = tab || 'new';
    if (tab === 'following') {
      return this.getPosts({ followingOnly: true });
    } else if (tab === 'top') {
      return this.getPosts({ sort: 'top' });
    }
    return this.getPosts();
  },

  async deletePost(id) {
    // Try Supabase
    if (this._hasSupabase()) {
      try {
        await VisorUpPosts.remove(id);
        return;
      } catch (e) { console.warn('Community: Supabase delete failed, trying local', e); }
    }

    // Fallback
    var data = this._getData();
    data.posts = (data.posts || []).filter(function(p) { return p.id !== id; });
    delete data.likes[id];
    delete data.comments[id];
    this._saveData(data);
  },

  // ── Likes ─────────────────────────────────────────────────

  async toggleLike(postId) {
    // Try Supabase
    if (this._hasSupabase()) {
      try {
        var liked = await VisorUpPosts.toggleLike(postId);
        if (liked && typeof VisorUpNotifications !== 'undefined') {
          VisorUpNotifications.notify('like', 'Your post was liked', 'fa-heart', '/community');
        }
        return liked;
      } catch (e) { console.warn('Community: Supabase like failed, using local', e); }
    }

    // Fallback
    var data = this._getData();
    data.likes = data.likes || {};
    var wasLiked = data.likes[postId] || false;
    data.likes[postId] = !wasLiked;

    var post = (data.posts || []).find(function(p) { return p.id === postId; });
    if (post) {
      post.likeCount = (post.likeCount || 0) + (wasLiked ? -1 : 1);
      if (post.likeCount < 0) post.likeCount = 0;
    }
    this._saveData(data);

    if (!wasLiked && typeof VisorUpNotifications !== 'undefined') {
      VisorUpNotifications.notify('like', 'Your post was liked', 'fa-heart', '/community');
    }
    return !wasLiked;
  },

  async isLiked(postId) {
    if (this._hasSupabase()) {
      try { return await VisorUpPosts.isLiked(postId); } catch (e) {}
    }
    return !!(this._getData().likes || {})[postId];
  },

  async getLikedMap(postIds) {
    if (this._hasSupabase()) {
      try { return await VisorUpPosts.getLikedPostIds(postIds); } catch (e) {}
    }
    var likes = this._getData().likes || {};
    var map = {};
    postIds.forEach(function(id) { if (likes[id]) map[id] = true; });
    return map;
  },

  // ── Comments ──────────────────────────────────────────────

  async addComment(postId, text) {
    var user = await this._getUser();
    var profile = await this._getProfile();

    // Try Supabase
    if (this._hasSupabase() && user) {
      try {
        var sbComment = await VisorUpPosts.addComment(postId, text);
        if (sbComment) {
          if (typeof VisorUpNotifications !== 'undefined') {
            VisorUpNotifications.notify('comment', 'New comment on your post', 'fa-comment', '/community');
          }
          var cp = sbComment.profiles || {};
          return {
            id: sbComment.id,
            userId: sbComment.user_id,
            userName: cp.display_name || 'Rider',
            userAvatar: cp.avatar_url || null,
            text: sbComment.content,
            createdAt: sbComment.created_at
          };
        }
      } catch (e) { console.warn('Community: Supabase comment failed, using local', e); }
    }

    // Fallback
    var comment = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
      userId: user ? user.id : 'local',
      userName: (profile && profile.display_name) || 'Anonymous Rider',
      userAvatar: (profile && profile.avatar_url) || null,
      text: text,
      createdAt: new Date().toISOString()
    };

    var data = this._getData();
    data.comments = data.comments || {};
    if (!data.comments[postId]) data.comments[postId] = [];
    data.comments[postId].push(comment);

    var post = (data.posts || []).find(function(p) { return p.id === postId; });
    if (post) post.commentCount = (post.commentCount || 0) + 1;

    this._saveData(data);

    if (typeof VisorUpNotifications !== 'undefined') {
      VisorUpNotifications.notify('comment', 'New comment on your post', 'fa-comment', '/community');
    }
    return comment;
  },

  async getComments(postId) {
    if (this._hasSupabase()) {
      try {
        var rows = await VisorUpPosts.getComments(postId);
        return rows.map(function(c) {
          var cp = c.profiles || {};
          return {
            id: c.id,
            userId: c.user_id,
            userName: cp.display_name || 'Rider',
            userAvatar: cp.avatar_url || null,
            text: c.content,
            createdAt: c.created_at
          };
        });
      } catch (e) { console.warn('Community: Supabase comments failed, using local', e); }
    }
    return (this._getData().comments || {})[postId] || [];
  },

  async deleteComment(postId, commentId) {
    if (this._hasSupabase()) {
      try { await VisorUpPosts.deleteComment(commentId); return; } catch (e) {}
    }

    var data = this._getData();
    if (data.comments && data.comments[postId]) {
      data.comments[postId] = data.comments[postId].filter(function(c) { return c.id !== commentId; });
      var post = (data.posts || []).find(function(p) { return p.id === postId; });
      if (post) post.commentCount = Math.max(0, (post.commentCount || 0) - 1);
    }
    this._saveData(data);
  },

  // ── Follows ───────────────────────────────────────────────

  _followsKey: 'vu_follows',

  _getFollows() {
    try {
      var raw = localStorage.getItem(this._followsKey);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [];
  },

  _saveFollows(list) {
    try { localStorage.setItem(this._followsKey, JSON.stringify(list)); } catch (e) {}
  },

  async followUser(userId) {
    var list = this._getFollows();
    if (list.indexOf(userId) === -1) {
      list.push(userId);
      this._saveFollows(list);
    }
    if (typeof VisorUpNotifications !== 'undefined') {
      VisorUpNotifications.notify('follow', 'You have a new follower', 'fa-user-plus', '/community');
    }
    if (this._hasSupabase()) {
      try {
        var user = await this._getUser();
        var sb = getSupabase();
        if (sb && user) {
          await sb.from('follows').upsert({ follower_id: user.id, following_id: userId });
        }
      } catch (e) { console.warn('Community: Supabase follow failed', e); }
    }
  },

  async unfollowUser(userId) {
    var list = this._getFollows();
    var idx = list.indexOf(userId);
    if (idx !== -1) {
      list.splice(idx, 1);
      this._saveFollows(list);
    }
    if (this._hasSupabase()) {
      try {
        var user = await this._getUser();
        var sb = getSupabase();
        if (sb && user) {
          await sb.from('follows').delete().match({ follower_id: user.id, following_id: userId });
        }
      } catch (e) { console.warn('Community: Supabase unfollow failed', e); }
    }
  },

  isFollowing(userId) {
    return this._getFollows().indexOf(userId) !== -1;
  },

  getFollowing() {
    return this._getFollows();
  },

  getFollowerCount(userId) {
    return this._getFollows().indexOf(userId) !== -1 ? 1 : 0;
  },

  // ── Activity Feed (auto-generated from gamification) ──────

  async generateActivityFeed() {
    var activities = [];

    if (typeof VisorUpGamification !== 'undefined') {
      var rides = VisorUpGamification.getRideLog();
      rides.forEach(function(r) {
        activities.push({
          id: 'ride-' + r.id,
          type: 'activity',
          activityType: 'ride',
          icon: 'fa-motorcycle',
          text: 'Logged a ride: <strong>' + (r.name || 'Ride') + '</strong>' + (r.miles ? ' (' + r.miles + ' miles)' : ''),
          rating: r.rating,
          createdAt: r.date || r.loggedAt
        });
      });

      var badges = VisorUpGamification.getEarnedBadges();
      badges.forEach(function(b) {
        var badge = typeof BADGES !== 'undefined' ? BADGES.find(function(bd) { return bd.id === b.id; }) : null;
        if (badge) {
          activities.push({
            id: 'badge-' + b.id,
            type: 'activity',
            activityType: 'badge',
            icon: badge.icon,
            text: 'Earned badge: <strong>' + badge.name + '</strong> — ' + badge.desc,
            createdAt: b.earnedAt
          });
        }
      });

      var visited = VisorUpGamification.getVisitedDestinations();
      visited.forEach(function(slug) {
        var dest = typeof DESTINATIONS !== 'undefined' ? DESTINATIONS.find(function(d) { return d.slug === slug; }) : null;
        activities.push({
          id: 'dest-' + slug,
          type: 'activity',
          activityType: 'destination',
          icon: 'fa-map-pin',
          text: 'Visited <strong>' + (dest ? dest.name : slug.replace(/-/g, ' ')) + '</strong>',
          image: dest ? dest.image : null,
          createdAt: new Date().toISOString()
        });
      });
    }

    var posts = await this.getPosts();
    var all = activities.concat(posts);
    all.sort(function(a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
    return all;
  },

  // ── Photo Upload ─────────────────────────────────────────

  async uploadPostPhotos(files) {
    var validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    var maxSize = 5 * 1024 * 1024;
    var maxPhotos = 4;
    var results = [];
    var validated = [];
    for (var i = 0; i < files.length && validated.length < maxPhotos; i++) {
      if (validTypes.indexOf(files[i].type) === -1) continue;
      if (files[i].size > maxSize) continue;
      validated.push(files[i]);
    }
    if (validated.length === 0) return results;

    var user = await this._getUser();
    var sb = user ? getSupabase() : null;

    for (var j = 0; j < validated.length; j++) {
      var file = validated[j];
      if (sb && user) {
        try {
          var ext = file.name.split('.').pop().toLowerCase();
          var path = user.id + '/' + Date.now() + '-' + j + '.' + ext;
          var { data, error } = await sb.storage.from('community-photos').upload(path, file, { contentType: file.type });
          if (!error && data) {
            var { data: urlData } = sb.storage.from('community-photos').getPublicUrl(data.path);
            if (urlData && urlData.publicUrl) {
              results.push(urlData.publicUrl);
              continue;
            }
          }
        } catch (e) { console.warn('Community: photo upload failed, using data URL', e); }
      }
      var dataUrl = await new Promise(function(resolve) {
        var reader = new FileReader();
        reader.onload = function() { resolve(reader.result); };
        reader.readAsDataURL(file);
      });
      results.push(dataUrl);
    }
    return results;
  },

  // ── Search & Tags ──────────────────────────────────────────

  async searchPosts(query) {
    var q = (query || '').toLowerCase().trim();
    if (!q) return this.getPosts();
    var posts = await this.getPosts();
    return posts.filter(function(p) {
      return (p.title && p.title.toLowerCase().indexOf(q) !== -1) ||
        (p.body && p.body.toLowerCase().indexOf(q) !== -1) ||
        (p.bike && p.bike.toLowerCase().indexOf(q) !== -1) ||
        (p.userName && p.userName.toLowerCase().indexOf(q) !== -1) ||
        (p.tags && p.tags.some(function(t) { return t.toLowerCase().indexOf(q) !== -1; }));
    });
  },

  async getPostsByTag(tag) {
    var t = (tag || '').toLowerCase().trim();
    if (!t) return this.getPosts();
    var posts = await this.getPosts();
    return posts.filter(function(p) {
      return p.tags && p.tags.some(function(pt) { return pt.toLowerCase() === t; });
    });
  },

  async getTrendingTags(limit) {
    limit = limit || 10;
    var posts = await this.getPosts({ limit: 200 });
    var counts = {};
    posts.forEach(function(p) {
      (p.tags || []).forEach(function(t) {
        var key = t.toLowerCase().trim();
        if (key) counts[key] = (counts[key] || 0) + 1;
      });
    });
    return Object.keys(counts).sort(function(a, b) { return counts[b] - counts[a]; }).slice(0, limit).map(function(tag) {
      return { tag: tag, count: counts[tag] };
    });
  },

  // ── Render Helpers ────────────────────────────────────────

  _isCurrentUser(userId) {
    if (!userId || userId === 'local') return true;
    try {
      if (typeof VisorUpAuth !== 'undefined' && window._supabase) {
        var session = window._supabase.auth.session && window._supabase.auth.session();
        if (session && session.user) return session.user.id === userId;
      }
    } catch (e) {}
    return false;
  },

  _esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; },

  _timeAgo(dateStr) {
    var now = Date.now();
    var then = new Date(dateStr).getTime();
    var diff = now - then;
    var mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return mins + 'm ago';
    var hours = Math.floor(mins / 60);
    if (hours < 24) return hours + 'h ago';
    var days = Math.floor(hours / 24);
    if (days < 7) return days + 'd ago';
    return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  },

  renderPostCard(post, likedMap) {
    var self = this;
    var isPost = post.type === 'ride-report' || post.type === 'post';
    var isActivity = post.type === 'activity';

    if (isActivity) {
      return '<div class="feed-activity-item">' +
        '<div class="feed-activity-icon"><i class="fas ' + post.icon + '"></i></div>' +
        '<div class="feed-activity-body">' +
          '<div class="feed-activity-text">' + post.text + '</div>' +
          '<div class="feed-activity-time">' + this._timeAgo(post.createdAt) + '</div>' +
        '</div>' +
        (post.image ? '<div class="feed-activity-img" data-bg="' + post.image + '"></div>' : '') +
      '</div>';
    }

    var avatarHTML = post.userAvatar
      ? '<img src="' + post.userAvatar + '" class="feed-avatar" alt="">'
      : '<div class="feed-avatar-placeholder">' + (post.userName || 'A').charAt(0).toUpperCase() + '</div>';

    var photosHTML = '';
    if (post.photos && post.photos.length > 0) {
      photosHTML = '<div class="feed-photos">' + post.photos.map(function(url) {
        return '<div class="feed-photo" data-bg="' + url + '"></div>';
      }).join('') + '</div>';
    }

    var metaHTML = '';
    if (post.miles || post.bike || post.rating) {
      var parts = [];
      if (post.miles) parts.push('<span><i class="fas fa-road"></i> ' + post.miles + ' miles</span>');
      if (post.bike) parts.push('<span><i class="fas fa-motorcycle"></i> ' + this._esc(post.bike) + '</span>');
      if (post.rating) parts.push('<span>' + '\u2605'.repeat(post.rating) + '\u2606'.repeat(5 - post.rating) + '</span>');
      metaHTML = '<div class="feed-post-meta">' + parts.join('') + '</div>';
    }

    var tagsHTML = '';
    if (post.tags && post.tags.length > 0) {
      tagsHTML = '<div class="feed-tags">' + post.tags.map(function(t) {
        return '<span class="feed-tag" data-tag="' + self._esc(t) + '" style="cursor:pointer">#' + self._esc(t) + '</span>';
      }).join('') + '</div>';
    }

    var liked = likedMap ? !!likedMap[post.id] : false;

    var followBtnHTML = '';
    if (post.userId && post.userId !== 'local') {
      var following = this.isFollowing(post.userId);
      followBtnHTML = '<button class="feed-follow-btn' + (following ? ' feed-following' : '') + '" data-follow-user="' + post.userId + '">' + (following ? 'Following' : 'Follow') + '</button>';
    }

    return '<div class="feed-post" data-post-id="' + post.id + '" data-user-id="' + (post.userId || '') + '">' +
      '<div class="feed-post-header">' +
        avatarHTML +
        '<div class="feed-post-author">' +
          '<span class="feed-author-name">' + this._esc(post.userName) + '</span>' +
          '<span class="feed-post-time">' + this._timeAgo(post.createdAt) + '</span>' +
        '</div>' +
        followBtnHTML +
      '</div>' +
      (post.title ? '<h3 class="feed-post-title">' + this._esc(post.title) + '</h3>' : '') +
      (post.body ? '<div class="feed-post-body">' + this._esc(post.body) + '</div>' : '') +
      metaHTML +
      photosHTML +
      tagsHTML +
      '<div class="feed-post-actions">' +
        '<button class="feed-action-btn feed-like-btn' + (liked ? ' feed-liked' : '') + '" data-post-id="' + post.id + '"><i class="fas fa-heart"></i> ' + (post.likeCount || 0) + '</button>' +
        '<button class="feed-action-btn feed-comment-toggle" data-post-id="' + post.id + '"><i class="fas fa-comment"></i> ' + (post.commentCount || 0) + '</button>' +
        '<button class="feed-action-btn feed-share-btn" data-post-id="' + post.id + '" data-post-title="' + this._esc(post.title || '') + '" title="Share"><i class="fas fa-share-nodes"></i></button>' +
        (post.userId === 'local' || this._isCurrentUser(post.userId) ? '<button class="feed-action-btn feed-delete-btn" data-post-id="' + post.id + '" title="Delete post"><i class="fas fa-trash"></i></button>' : '') +
      '</div>' +
      '<div class="feed-comments" id="comments-' + post.id + '" style="display:none"></div>' +
    '</div>';
  },

  renderCommentSection(postId) {
    var comments = [];
    // Sync version for initial render -- caller should use getComments() async and re-render
    if (!this._hasSupabase()) {
      comments = (this._getData().comments || {})[postId] || [];
    }
    var html = '';
    if (comments.length > 0) {
      html += comments.map(function(c) {
        var avatar = c.userAvatar
          ? '<img src="' + c.userAvatar + '" class="feed-comment-avatar" alt="">'
          : '<div class="feed-comment-avatar-ph">' + (c.userName || 'A').charAt(0).toUpperCase() + '</div>';
        return '<div class="feed-comment">' +
          avatar +
          '<div class="feed-comment-body">' +
            '<span class="feed-comment-author">' + (c.userName || 'Rider') + '</span> ' +
            '<span class="feed-comment-text">' + c.text + '</span>' +
            '<div class="feed-comment-time">' + VisorUpCommunity._timeAgo(c.createdAt) + '</div>' +
          '</div>' +
        '</div>';
      }).join('');
    }
    html += '<div class="feed-comment-form">' +
      '<input type="text" class="feed-comment-input" data-post-id="' + postId + '" placeholder="Write a comment...">' +
      '<button class="feed-comment-send" data-post-id="' + postId + '"><i class="fas fa-paper-plane"></i></button>' +
    '</div>';
    return html;
  }
};
