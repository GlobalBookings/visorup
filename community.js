/**
 * VisorUp Community — Activity feed, ride reports, likes, and comments.
 * Uses Supabase for persistence with localStorage fallback for demo/offline.
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

  // ── Posts (Ride Reports) ──────────────────────────────────

  async createPost(post) {
    var user = null;
    var profile = null;
    if (typeof VisorUpAuth !== 'undefined') {
      user = await VisorUpAuth.getUser();
      profile = user ? await VisorUpAuth.getProfile() : null;
    }

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

    // Try Supabase first
    if (typeof VisorUpAuth !== 'undefined' && user) {
      try {
        var sb = window._supabase || (window.supabase && window.VISORUP_SUPABASE ? window.supabase.createClient(window.VISORUP_SUPABASE.url, window.VISORUP_SUPABASE.anonKey) : null);
        if (sb) {
          var { data, error } = await sb.from('community_posts').insert({
            user_id: user.id,
            type: newPost.type,
            title: newPost.title,
            body: newPost.body,
            photos: newPost.photos,
            route_slug: newPost.routeSlug,
            destination_slug: newPost.destinationSlug,
            miles: newPost.miles,
            rating: newPost.rating,
            bike: newPost.bike,
            tags: newPost.tags
          }).select().single();
          if (!error && data) { newPost.id = data.id; }
        }
      } catch (e) { console.warn('Community: Supabase insert failed, using local', e); }
    }

    // Always save locally too
    var local = this._getData();
    local.posts.unshift(newPost);
    if (local.posts.length > 200) local.posts = local.posts.slice(0, 200);
    this._saveData(local);

    // Award XP
    if (typeof VisorUpGamification !== 'undefined') {
      VisorUpGamification.addXP(30, 'Posted ride report');
    }

    return newPost;
  },

  getPosts(opts) {
    opts = opts || {};
    var data = this._getData();
    var posts = data.posts || [];

    if (opts.type) posts = posts.filter(function(p) { return p.type === opts.type; });
    if (opts.userId) posts = posts.filter(function(p) { return p.userId === opts.userId; });

    posts.sort(function(a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });

    var limit = opts.limit || 50;
    var offset = opts.offset || 0;
    return posts.slice(offset, offset + limit);
  },

  deletePost(id) {
    var data = this._getData();
    data.posts = (data.posts || []).filter(function(p) { return p.id !== id; });
    delete data.likes[id];
    delete data.comments[id];
    this._saveData(data);
  },

  // ── Likes ─────────────────────────────────────────────────

  toggleLike(postId) {
    var data = this._getData();
    data.likes = data.likes || {};
    var liked = data.likes[postId] || false;
    data.likes[postId] = !liked;

    var post = (data.posts || []).find(function(p) { return p.id === postId; });
    if (post) {
      post.likeCount = (post.likeCount || 0) + (liked ? -1 : 1);
      if (post.likeCount < 0) post.likeCount = 0;
    }
    this._saveData(data);
    return !liked;
  },

  isLiked(postId) {
    return !!(this._getData().likes || {})[postId];
  },

  // ── Comments ──────────────────────────────────────────────

  async addComment(postId, text) {
    var user = null;
    var profile = null;
    if (typeof VisorUpAuth !== 'undefined') {
      user = await VisorUpAuth.getUser();
      profile = user ? await VisorUpAuth.getProfile() : null;
    }

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
    return comment;
  },

  getComments(postId) {
    return (this._getData().comments || {})[postId] || [];
  },

  deleteComment(postId, commentId) {
    var data = this._getData();
    if (data.comments && data.comments[postId]) {
      data.comments[postId] = data.comments[postId].filter(function(c) { return c.id !== commentId; });
      var post = (data.posts || []).find(function(p) { return p.id === postId; });
      if (post) post.commentCount = Math.max(0, (post.commentCount || 0) - 1);
    }
    this._saveData(data);
  },

  // ── Activity Feed (auto-generated from gamification) ──────

  generateActivityFeed() {
    var activities = [];

    // Pull from ride log
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

      // Badges
      var badges = VisorUpGamification.getEarnedBadges();
      badges.forEach(function(b) {
        var badge = BADGES.find(function(bd) { return bd.id === b.id; });
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

      // Destinations visited
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

    // Merge with posts
    var posts = this.getPosts();
    var all = activities.concat(posts);
    all.sort(function(a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
    return all;
  },

  // ── Render Helpers ────────────────────────────────────────

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

  renderPostCard(post) {
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
        return '<span class="feed-tag">#' + self._esc(t) + '</span>';
      }).join('') + '</div>';
    }

    var liked = this.isLiked(post.id);

    return '<div class="feed-post" data-post-id="' + post.id + '">' +
      '<div class="feed-post-header">' +
        avatarHTML +
        '<div class="feed-post-author">' +
          '<span class="feed-author-name">' + this._esc(post.userName) + '</span>' +
          '<span class="feed-post-time">' + this._timeAgo(post.createdAt) + '</span>' +
        '</div>' +
      '</div>' +
      (post.title ? '<h3 class="feed-post-title">' + this._esc(post.title) + '</h3>' : '') +
      (post.body ? '<div class="feed-post-body">' + this._esc(post.body) + '</div>' : '') +
      metaHTML +
      photosHTML +
      tagsHTML +
      '<div class="feed-post-actions">' +
        '<button class="feed-action-btn feed-like-btn' + (liked ? ' feed-liked' : '') + '" data-post-id="' + post.id + '"><i class="fas fa-heart"></i> ' + (post.likeCount || 0) + '</button>' +
        '<button class="feed-action-btn feed-comment-toggle" data-post-id="' + post.id + '"><i class="fas fa-comment"></i> ' + (post.commentCount || 0) + '</button>' +
      '</div>' +
      '<div class="feed-comments" id="comments-' + post.id + '" style="display:none"></div>' +
    '</div>';
  },

  renderCommentSection(postId) {
    var comments = this.getComments(postId);
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
