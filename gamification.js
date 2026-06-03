/**
 * VisorUp Gamification — Rider levels, badges, ride log, and scratch map.
 * All data stored in Supabase user_achievements and ride_log tables,
 * with local fallback to localStorage for offline/demo use.
 */

// ── Rider Level System ──────────────────────────────────────

const RIDER_LEVELS = [
  { level: 1, name: 'Learner',          xpRequired: 0,    icon: 'fa-graduation-cap', colour: '#7a8a85' },
  { level: 2, name: 'Weekend Warrior',  xpRequired: 100,  icon: 'fa-sun',            colour: '#6BCB77' },
  { level: 3, name: 'Road Tripper',     xpRequired: 300,  icon: 'fa-suitcase',       colour: '#4D96FF' },
  { level: 4, name: 'Tourer',           xpRequired: 600,  icon: 'fa-route',          colour: '#D68A2D' },
  { level: 5, name: 'Explorer',         xpRequired: 1000, icon: 'fa-compass',        colour: '#9B59B6' },
  { level: 6, name: 'Adventurer',       xpRequired: 1500, icon: 'fa-mountain',       colour: '#E17055' },
  { level: 7, name: 'Iron Butt',        xpRequired: 2500, icon: 'fa-shield-alt',     colour: '#FF6B6B' },
  { level: 8, name: 'Legend',           xpRequired: 4000, icon: 'fa-crown',          colour: '#FFD93D' }
];

// ── Badge Definitions ───────────────────────────────────────

const BADGES = [
  // Routes
  { id: 'first-route',       name: 'First Route',         desc: 'Save your first route',                    icon: 'fa-flag-checkered', category: 'routes' },
  { id: 'five-routes',       name: 'Route Collector',     desc: 'Save 5 routes',                            icon: 'fa-layer-group',    category: 'routes' },
  { id: 'ten-routes',        name: 'Route Master',        desc: 'Save 10 routes',                           icon: 'fa-trophy',         category: 'routes' },

  // Rides
  { id: 'first-ride',        name: 'First Ride',          desc: 'Log your first ride',                      icon: 'fa-motorcycle',     category: 'rides' },
  { id: 'five-rides',        name: 'Regular Rider',       desc: 'Log 5 rides',                              icon: 'fa-calendar-check', category: 'rides' },
  { id: 'twenty-rides',      name: 'Road Warrior',        desc: 'Log 20 rides',                             icon: 'fa-fire',           category: 'rides' },
  { id: 'century',           name: 'Century Rider',       desc: 'Log a ride over 100 miles',                icon: 'fa-road',           category: 'rides' },
  { id: 'iron-butt',         name: 'Iron Butt',           desc: 'Log a ride over 300 miles in one day',     icon: 'fa-shield-alt',     category: 'rides' },

  // Destinations
  { id: 'first-dest',        name: 'First Destination',   desc: 'Visit your first destination',             icon: 'fa-map-pin',        category: 'destinations' },
  { id: 'all-scotland',      name: 'Highland Conqueror',  desc: 'Visit all Scottish destinations',          icon: 'fa-flag',           category: 'destinations' },
  { id: 'all-england',       name: 'English Explorer',    desc: 'Visit all English destinations',           icon: 'fa-flag',           category: 'destinations' },
  { id: 'all-wales',         name: 'Welsh Dragon',        desc: 'Visit all Welsh destinations',             icon: 'fa-flag',           category: 'destinations' },
  { id: 'all-islands',       name: 'Island Hopper',       desc: 'Visit all island destinations',            icon: 'fa-ship',           category: 'destinations' },
  { id: 'all-destinations',  name: 'Britain Complete',    desc: 'Visit every destination',                  icon: 'fa-star',           category: 'destinations' },

  // Garage
  { id: 'first-bike',        name: 'First Bike',          desc: 'Add a bike to your garage',                icon: 'fa-motorcycle',     category: 'garage' },
  { id: 'three-bikes',       name: 'Collector',           desc: 'Have 3 bikes in your garage',              icon: 'fa-warehouse',      category: 'garage' },
  { id: 'photo-upload',      name: 'Show Off',            desc: 'Upload a photo of your bike',              icon: 'fa-camera',         category: 'garage' },

  // Community
  { id: 'first-share',       name: 'Sharing is Caring',   desc: 'Share a route publicly',                   icon: 'fa-share-alt',      category: 'community' },
  { id: 'first-fav',         name: 'Heart on Sleeve',     desc: 'Favourite a destination or route',         icon: 'fa-heart',          category: 'community' },
  { id: 'ten-favs',          name: 'Enthusiast',          desc: 'Favourite 10 items',                       icon: 'fa-heart',          category: 'community' },

  // Special
  { id: 'nc500',             name: 'NC500 Completer',     desc: 'Log a ride on the NC500',                  icon: 'fa-map',            category: 'special' },
  { id: 'all-weather',       name: 'All-Weather Rider',   desc: 'Log rides in every season',                icon: 'fa-cloud-sun-rain', category: 'special' },
  { id: 'night-rider',       name: 'Night Rider',         desc: 'Start a ride before 6am',                  icon: 'fa-moon',           category: 'special' },
  { id: 'ferry-master',      name: 'Ferry Master',        desc: 'Include a ferry in a logged ride',         icon: 'fa-ship',           category: 'special' }
];

// ── XP Awards ───────────────────────────────────────────────

const XP_AWARDS = {
  routeSaved:       10,
  rideLogged:       25,
  destinationVisited: 20,
  bikeAdded:        10,
  photoUploaded:    5,
  routeShared:      15,
  favouriteAdded:   5,
  badgeEarned:      50,
  centuryRide:      100,
  ironButtRide:     250
};

// ── UK Regions for Scratch Map ──────────────────────────────

const UK_SCRATCH_REGIONS = [
  { id: 'scotland-highlands', name: 'Scottish Highlands',  destinations: ['isle-of-skye', 'glencoe', 'nc500'] },
  { id: 'scotland-borders',   name: 'Scottish Borders',    destinations: ['scottish-borders'] },
  { id: 'scotland-islands',   name: 'Scottish Islands',    destinations: ['outer-hebrides'] },
  { id: 'north-england',      name: 'North England',       destinations: ['northumberland', 'lake-district', 'yorkshire-dales'] },
  { id: 'wales',              name: 'Wales',               destinations: ['snowdonia', 'brecon-beacons'] },
  { id: 'south-west',         name: 'South West England',  destinations: [] },
  { id: 'south-east',         name: 'South East England',  destinations: [] },
  { id: 'midlands',           name: 'Midlands',            destinations: [] },
  { id: 'channel-islands',    name: 'Channel Islands',     destinations: ['jersey', 'guernsey'] },
  { id: 'isle-of-man',        name: 'Isle of Man',         destinations: ['isle-of-man'] }
];

// ── Gamification Engine ─────────────────────────────────────

const VisorUpGamification = {

  _storageKey: 'vu_gamification',

  _getData() {
    try {
      var raw = localStorage.getItem(this._storageKey);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return { xp: 0, badges: [], rideLog: [], visitedDestinations: [], seasons: [] };
  },

  _saveData(data) {
    try { localStorage.setItem(this._storageKey, JSON.stringify(data)); } catch (e) {}
  },

  getXP() { return this._getData().xp; },

  getLevel() {
    var xp = this.getXP();
    var level = RIDER_LEVELS[0];
    for (var i = RIDER_LEVELS.length - 1; i >= 0; i--) {
      if (xp >= RIDER_LEVELS[i].xpRequired) { level = RIDER_LEVELS[i]; break; }
    }
    return level;
  },

  getNextLevel() {
    var current = this.getLevel();
    var idx = RIDER_LEVELS.findIndex(function(l) { return l.level === current.level; });
    return idx < RIDER_LEVELS.length - 1 ? RIDER_LEVELS[idx + 1] : null;
  },

  getProgressToNext() {
    var xp = this.getXP();
    var current = this.getLevel();
    var next = this.getNextLevel();
    if (!next) return 100;
    var range = next.xpRequired - current.xpRequired;
    var progress = xp - current.xpRequired;
    return Math.min(100, Math.round((progress / range) * 100));
  },

  addXP(amount, reason) {
    var data = this._getData();
    data.xp = (data.xp || 0) + amount;
    this._saveData(data);
    return data.xp;
  },

  getEarnedBadges() { return this._getData().badges || []; },

  hasBadge(id) {
    return this.getEarnedBadges().some(function(b) { return b.id === id; });
  },

  earnBadge(id) {
    if (this.hasBadge(id)) return false;
    var badge = BADGES.find(function(b) { return b.id === id; });
    if (!badge) return false;
    var data = this._getData();
    data.badges = data.badges || [];
    data.badges.push({ id: id, earnedAt: new Date().toISOString() });
    this._saveData(data);
    this.addXP(XP_AWARDS.badgeEarned, 'Badge: ' + badge.name);
    return true;
  },

  // ── Ride Log ──────────────────────────────────────────────

  getRideLog() { return this._getData().rideLog || []; },

  logRide(ride) {
    var data = this._getData();
    data.rideLog = data.rideLog || [];
    ride.id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    ride.loggedAt = new Date().toISOString();
    data.rideLog.push(ride);
    this._saveData(data);

    this.addXP(XP_AWARDS.rideLogged, 'Ride logged');
    var rideCount = data.rideLog.length;
    if (rideCount === 1) this.earnBadge('first-ride');
    if (rideCount >= 5) this.earnBadge('five-rides');
    if (rideCount >= 20) this.earnBadge('twenty-rides');
    if (ride.miles && ride.miles >= 100) {
      this.earnBadge('century');
      this.addXP(XP_AWARDS.centuryRide, 'Century ride');
    }
    if (ride.miles && ride.miles >= 300) {
      this.earnBadge('iron-butt');
      this.addXP(XP_AWARDS.ironButtRide, 'Iron butt ride');
    }

    // Season tracking
    var month = new Date(ride.date || ride.loggedAt).getMonth();
    var season = month <= 1 || month === 11 ? 'winter' : month <= 4 ? 'spring' : month <= 7 ? 'summer' : 'autumn';
    data.seasons = data.seasons || [];
    if (data.seasons.indexOf(season) === -1) {
      data.seasons.push(season);
      this._saveData(data);
      if (data.seasons.length === 4) this.earnBadge('all-weather');
    }

    // NC500 check
    if (ride.routeSlug === 'nc500-complete' || ride.routeSlug === 'nc500') this.earnBadge('nc500');

    // Early morning check
    if (ride.startTime) {
      var hour = parseInt(ride.startTime.split(':')[0]);
      if (hour < 6) this.earnBadge('night-rider');
    }

    return ride;
  },

  deleteRide(id) {
    var data = this._getData();
    data.rideLog = (data.rideLog || []).filter(function(r) { return r.id !== id; });
    this._saveData(data);
  },

  // ── Destination Visits (Scratch Map) ──────────────────────

  getVisitedDestinations() { return this._getData().visitedDestinations || []; },

  visitDestination(slug) {
    var data = this._getData();
    data.visitedDestinations = data.visitedDestinations || [];
    if (data.visitedDestinations.indexOf(slug) !== -1) return false;
    data.visitedDestinations.push(slug);
    this._saveData(data);

    this.addXP(XP_AWARDS.destinationVisited, 'Visited ' + slug);
    var visited = data.visitedDestinations;
    if (visited.length === 1) this.earnBadge('first-dest');

    // Region completion checks
    this._checkRegionBadges(visited);

    return true;
  },

  unvisitDestination(slug) {
    var data = this._getData();
    data.visitedDestinations = (data.visitedDestinations || []).filter(function(s) { return s !== slug; });
    this._saveData(data);
  },

  _checkRegionBadges(visited) {
    if (typeof DESTINATIONS === 'undefined') return;
    var byRegion = { Scotland: [], England: [], Wales: [], Islands: [] };
    DESTINATIONS.forEach(function(d) {
      if (byRegion[d.region]) byRegion[d.region].push(d.slug);
    });

    var allScotland = byRegion.Scotland.every(function(s) { return visited.indexOf(s) !== -1; });
    var allEngland = byRegion.England.every(function(s) { return visited.indexOf(s) !== -1; });
    var allWales = byRegion.Wales.every(function(s) { return visited.indexOf(s) !== -1; });
    var allIslands = byRegion.Islands.every(function(s) { return visited.indexOf(s) !== -1; });

    if (allScotland && byRegion.Scotland.length > 0) this.earnBadge('all-scotland');
    if (allEngland && byRegion.England.length > 0) this.earnBadge('all-england');
    if (allWales && byRegion.Wales.length > 0) this.earnBadge('all-wales');
    if (allIslands && byRegion.Islands.length > 0) this.earnBadge('all-islands');
    if (allScotland && allEngland && allWales && allIslands) this.earnBadge('all-destinations');
  },

  // ── Activity-based badge checks ───────────────────────────

  checkActivityBadges(trips, favs, garageBikes) {
    if (trips.length >= 1) this.earnBadge('first-route');
    if (trips.length >= 5) this.earnBadge('five-routes');
    if (trips.length >= 10) this.earnBadge('ten-routes');
    if (favs.length >= 1) this.earnBadge('first-fav');
    if (favs.length >= 10) this.earnBadge('ten-favs');
    if (garageBikes.length >= 1) this.earnBadge('first-bike');
    if (garageBikes.length >= 3) this.earnBadge('three-bikes');
    if (garageBikes.some(function(b) { return b.photo_url; })) this.earnBadge('photo-upload');
    if (trips.some(function(t) { return t.is_public; })) this.earnBadge('first-share');

    // Add base XP for existing activity (idempotent via localStorage)
    var data = this._getData();
    if (!data._activityXpApplied) {
      data.xp = (data.xp || 0) + (trips.length * XP_AWARDS.routeSaved) + (favs.length * XP_AWARDS.favouriteAdded) + (garageBikes.length * XP_AWARDS.bikeAdded);
      data._activityXpApplied = true;
      this._saveData(data);
    }
  },

  // ── Stats summary ─────────────────────────────────────────

  getStats() {
    var data = this._getData();
    var rides = data.rideLog || [];
    var totalMiles = rides.reduce(function(sum, r) { return sum + (r.miles || 0); }, 0);
    return {
      xp: data.xp || 0,
      level: this.getLevel(),
      badgeCount: (data.badges || []).length,
      totalBadges: BADGES.length,
      rideCount: rides.length,
      totalMiles: totalMiles,
      destinationsVisited: (data.visitedDestinations || []).length,
      totalDestinations: typeof DESTINATIONS !== 'undefined' ? DESTINATIONS.length : 13
    };
  },

  // ── Render Helpers ────────────────────────────────────────

  renderLevelBadge() {
    var level = this.getLevel();
    var next = this.getNextLevel();
    var progress = this.getProgressToNext();
    var xp = this.getXP();

    return '<div class="rider-level-badge">' +
      '<div class="rider-level-icon" style="color:' + level.colour + '"><i class="fas ' + level.icon + '"></i></div>' +
      '<div class="rider-level-info">' +
        '<div class="rider-level-name" style="color:' + level.colour + '">Level ' + level.level + ' — ' + level.name + '</div>' +
        '<div class="rider-level-xp">' + xp + ' XP' + (next ? ' / ' + next.xpRequired + ' XP' : ' — Max Level!') + '</div>' +
        '<div class="rider-level-bar"><div class="rider-level-fill" style="width:' + progress + '%;background:' + level.colour + '"></div></div>' +
      '</div>' +
    '</div>';
  },

  renderBadgeGrid() {
    var earned = this.getEarnedBadges();
    var earnedIds = earned.map(function(b) { return b.id; });

    return '<div class="badge-grid">' + BADGES.map(function(b) {
      var isEarned = earnedIds.indexOf(b.id) !== -1;
      var earnedData = isEarned ? earned.find(function(e) { return e.id === b.id; }) : null;
      var earnedDate = earnedData ? new Date(earnedData.earnedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

      return '<div class="badge-card' + (isEarned ? ' badge-earned' : ' badge-locked') + '" title="' + b.desc + (earnedDate ? ' — Earned ' + earnedDate : '') + '">' +
        '<div class="badge-icon"><i class="fas ' + b.icon + '"></i></div>' +
        '<div class="badge-name">' + b.name + '</div>' +
        (isEarned ? '<div class="badge-date">' + earnedDate + '</div>' : '<div class="badge-locked-label"><i class="fas fa-lock"></i></div>') +
      '</div>';
    }).join('') + '</div>';
  },

  renderScratchMap() {
    var visited = this.getVisitedDestinations();
    var dests = typeof DESTINATIONS !== 'undefined' ? DESTINATIONS : [];
    var total = dests.length;
    var visitedCount = visited.length;
    var pct = total > 0 ? Math.round((visitedCount / total) * 100) : 0;

    var destCards = dests.map(function(d) {
      var isVisited = visited.indexOf(d.slug) !== -1;
      return '<div class="scratch-dest' + (isVisited ? ' scratch-visited' : '') + '" data-dest-slug="' + d.slug + '">' +
        '<div class="scratch-dest-img" style="background-image:url(' + d.image + ')">' +
          (isVisited ? '<div class="scratch-check"><i class="fas fa-check-circle"></i></div>' : '<div class="scratch-unvisited"><i class="fas fa-map-pin"></i></div>') +
        '</div>' +
        '<div class="scratch-dest-info">' +
          '<span class="scratch-dest-name">' + d.name + '</span>' +
          '<span class="scratch-dest-region">' + d.region + '</span>' +
        '</div>' +
      '</div>';
    }).join('');

    return '<div class="scratch-map-header">' +
      '<div class="scratch-progress">' +
        '<div class="scratch-progress-text">' + visitedCount + ' / ' + total + ' destinations visited (' + pct + '%)</div>' +
        '<div class="scratch-progress-bar"><div class="scratch-progress-fill" style="width:' + pct + '%"></div></div>' +
      '</div>' +
    '</div>' +
    '<div class="scratch-grid">' + destCards + '</div>';
  },

  renderRideLog() {
    var rides = this.getRideLog();
    if (rides.length === 0) {
      return '<div class="profile-empty"><i class="fas fa-motorcycle"></i><p>No rides logged yet. Mark a route as ridden to start tracking!</p></div>';
    }
    return '<div class="ride-log-list">' + rides.sort(function(a, b) {
      return new Date(b.date || b.loggedAt) - new Date(a.date || a.loggedAt);
    }).map(function(r) {
      var date = new Date(r.date || r.loggedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      return '<div class="ride-log-item" data-ride-id="' + r.id + '">' +
        '<div class="ride-log-icon"><i class="fas fa-motorcycle"></i></div>' +
        '<div class="ride-log-info">' +
          '<div class="ride-log-name">' + (r.name || 'Ride') + '</div>' +
          '<div class="ride-log-meta">' + date + (r.miles ? ' · ' + r.miles + ' miles' : '') + (r.rating ? ' · ' + '★'.repeat(r.rating) : '') + '</div>' +
        '</div>' +
        '<button class="ride-log-delete" data-ride-id="' + r.id + '" title="Delete"><i class="fas fa-trash"></i></button>' +
      '</div>';
    }).join('') + '</div>';
  }
};
