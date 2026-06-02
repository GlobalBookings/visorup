/* trip-planner.js — AI Trip Planner */
/* global L, RouteBuilder */

class AITripPlanner {
  static POI_CONFIG = {
    campsites:    { color: '#27ae60', faIcon: 'fa-campground',     label: 'Campsites' },
    bridges:      { color: '#2d98da', faIcon: 'fa-bridge',         label: 'Bridges' },
    wildlife:     { color: '#f39c12', faIcon: 'fa-paw',            label: 'Wildlife' },
    roads:        { color: '#e74c3c', faIcon: 'fa-road',           label: 'Great Roads' },
    fuel:         { color: '#fdcb6e', faIcon: 'fa-gas-pump',       label: 'Fuel Stations' },
    viewpoints:   { color: '#e8713a', faIcon: 'fa-binoculars',     label: 'Viewpoints' },
    pubs:         { color: '#c0392b', faIcon: 'fa-beer-mug-empty', label: 'Pubs & Cafes' },
    castles:      { color: '#6c5ce7', faIcon: 'fa-chess-rook',     label: 'Castles' },
    waterfalls:   { color: '#00cec9', faIcon: 'fa-water',          label: 'Waterfalls' },
    beaches:      { color: '#e17055', faIcon: 'fa-umbrella-beach', label: 'Beaches' },
    distilleries: { color: '#d35400', faIcon: 'fa-flask',          label: 'Distilleries' },
    landmarks:    { color: '#9b59b6', faIcon: 'fa-monument',       label: 'Landmarks' },
    fossils:      { color: '#cd853f', faIcon: 'fa-bone',           label: 'Fossils' },
    ferries:      { color: '#3498db', faIcon: 'fa-ship',           label: 'Ferries' }
  };

  static PRESETS = {
    scenic:  { label: 'Scenic', icon: 'fa-mountain-sun', types: ['viewpoints','waterfalls','beaches','roads'] },
    history: { label: 'History & Heritage', icon: 'fa-landmark', types: ['castles','landmarks','fossils','bridges'] },
    social:  { label: 'Food & Drink', icon: 'fa-utensils', types: ['pubs','distilleries','campsites'] },
    nature:  { label: 'Nature & Wildlife', icon: 'fa-leaf', types: ['wildlife','waterfalls','beaches','viewpoints'] },
    all:     { label: 'Everything', icon: 'fa-globe', types: ['campsites','bridges','wildlife','roads','viewpoints','pubs','castles','waterfalls','beaches','distilleries','landmarks','fossils','ferries'] }
  };

  static DAY_COLORS = ['#D68A2D','#2d98da','#27ae60','#e74c3c','#9b59b6','#00cec9','#e17055','#f39c12','#6c5ce7','#d35400','#c0392b','#cd853f','#3498db','#e8713a'];

  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    this.allPOIs = [];
    this._loadAllPOIs();
    this.step = 1;
    this.config = {
      startLat: null, startLng: null, startName: '',
      endLat: null, endLng: null, endName: '',
      isLoop: true,
      days: 5,
      maxHoursPerDay: 4,
      selectedTypes: ['viewpoints','waterfalls','castles','roads','pubs','bridges']
    };
    this.generatedTrip = null;
    this.map = null;
    this.mapLayers = [];
    this._render();
  }

  _loadAllPOIs() {
    var sources = [];
    if (typeof POI_SCOTLAND !== 'undefined') sources.push(POI_SCOTLAND);
    if (typeof POI_ENGLAND !== 'undefined') sources.push(POI_ENGLAND);
    if (typeof POI_WALES_ISLANDS !== 'undefined') sources.push(POI_WALES_ISLANDS);
    for (var s = 0; s < sources.length; s++) {
      var src = sources[s];
      for (var cat in src) {
        if (!Array.isArray(src[cat])) continue;
        for (var i = 0; i < src[cat].length; i++) {
          var p = src[cat][i];
          this.allPOIs.push({ name: p.name, lat: p.lat, lng: p.lng, type: cat, desc: p.desc || '', surface: p.surface || '', season: p.season || '', hazard: p.hazard || '', website: p.website || '' });
        }
      }
    }
  }

  _render() {
    this.container.innerHTML =
      '<div class="tp-layout">' +
        '<div class="tp-sidebar" id="tpSidebar"></div>' +
        '<div class="tp-map" id="tpMap"></div>' +
      '</div>';
    this._initMap();
    this._renderStep();
  }

  _initMap() {
    this.map = L.map('tpMap', { zoomControl: true });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OSM &copy; CARTO', maxZoom: 19
    }).addTo(this.map);
    this.map.setView([54.5, -3.5], 6);
  }

  _clearMapLayers() {
    for (var i = 0; i < this.mapLayers.length; i++) {
      this.map.removeLayer(this.mapLayers[i]);
    }
    this.mapLayers = [];
  }

  _renderStep() {
    var sb = document.getElementById('tpSidebar');
    if (!sb) return;
    if (this.step === 1) this._renderStep1(sb);
    else if (this.step === 2) this._renderStep2(sb);
    else if (this.step === 3) this._renderStep3(sb);
    else if (this.step === 4) this._renderStep4(sb);
  }

  // ── Step 1: Where & When ──────────────────────────────────────
  _renderStep1(sb) {
    var cfg = this.config;
    sb.innerHTML =
      '<div class="tp-header">' +
        '<div class="tp-logo"><i class="fas fa-wand-magic-sparkles"></i> Trip Planner</div>' +
        '<div class="tp-steps"><span class="tp-step active">1</span><span class="tp-step">2</span><span class="tp-step">3</span><span class="tp-step">4</span></div>' +
      '</div>' +
      '<div class="tp-body">' +
        '<h2 class="tp-title">Where & When</h2>' +
        '<p class="tp-subtitle">Tell us your starting point and how long you\'ve got.</p>' +

        '<label class="tp-label">Start Location</label>' +
        '<div class="tp-search-wrap">' +
          '<input type="text" id="tpStartInput" class="tp-input" placeholder="e.g. Birmingham, London, Edinburgh..." value="' + (cfg.startName || '') + '">' +
          '<button class="tp-search-btn" id="tpStartSearch"><i class="fas fa-search"></i></button>' +
        '</div>' +
        '<div id="tpStartResult" class="tp-result">' + (cfg.startName ? '<i class="fas fa-check" style="color:#27ae60"></i> ' + cfg.startName : '') + '</div>' +

        '<div class="tp-loop-toggle">' +
          '<label class="tp-toggle-label">' +
            '<input type="checkbox" id="tpLoopToggle" ' + (cfg.isLoop ? 'checked' : '') + '>' +
            '<span class="tp-toggle-text">Return to start (loop)</span>' +
          '</label>' +
        '</div>' +

        '<div id="tpEndWrap" style="' + (cfg.isLoop ? 'display:none' : '') + '">' +
          '<label class="tp-label">End Location</label>' +
          '<div class="tp-search-wrap">' +
            '<input type="text" id="tpEndInput" class="tp-input" placeholder="e.g. Edinburgh, Glasgow..." value="' + (cfg.endName || '') + '">' +
            '<button class="tp-search-btn" id="tpEndSearch"><i class="fas fa-search"></i></button>' +
          '</div>' +
          '<div id="tpEndResult" class="tp-result">' + (cfg.endName && !cfg.isLoop ? '<i class="fas fa-check" style="color:#27ae60"></i> ' + cfg.endName : '') + '</div>' +
        '</div>' +

        '<label class="tp-label">Trip Duration: <strong id="tpDaysVal">' + cfg.days + ' days</strong></label>' +
        '<input type="range" id="tpDaysSlider" class="tp-slider" min="1" max="14" value="' + cfg.days + '">' +
        '<div class="tp-slider-labels"><span>1 day</span><span>14 days</span></div>' +

        '<label class="tp-label">Max Daily Riding: <strong id="tpHoursVal">' + cfg.maxHoursPerDay + ' hours</strong></label>' +
        '<input type="range" id="tpHoursSlider" class="tp-slider" min="2" max="8" step="0.5" value="' + cfg.maxHoursPerDay + '">' +
        '<div class="tp-slider-labels"><span>2h (relaxed)</span><span>8h (endurance)</span></div>' +
      '</div>' +
      '<div class="tp-footer">' +
        '<button class="tp-btn tp-btn-primary" id="tpNext1">Next: Choose Interests <i class="fas fa-arrow-right"></i></button>' +
      '</div>';

    var self = this;
    document.getElementById('tpDaysSlider').addEventListener('input', function() {
      cfg.days = parseInt(this.value);
      document.getElementById('tpDaysVal').textContent = cfg.days + ' day' + (cfg.days > 1 ? 's' : '');
    });
    document.getElementById('tpHoursSlider').addEventListener('input', function() {
      cfg.maxHoursPerDay = parseFloat(this.value);
      document.getElementById('tpHoursVal').textContent = cfg.maxHoursPerDay + ' hours';
    });
    document.getElementById('tpLoopToggle').addEventListener('change', function() {
      cfg.isLoop = this.checked;
      document.getElementById('tpEndWrap').style.display = cfg.isLoop ? 'none' : '';
    });
    document.getElementById('tpStartSearch').addEventListener('click', function() { self._geocode('start'); });
    document.getElementById('tpStartInput').addEventListener('keydown', function(e) { if (e.key === 'Enter') self._geocode('start'); });
    document.getElementById('tpEndSearch').addEventListener('click', function() { self._geocode('end'); });
    document.getElementById('tpEndInput').addEventListener('keydown', function(e) { if (e.key === 'Enter') self._geocode('end'); });
    document.getElementById('tpNext1').addEventListener('click', function() {
      if (!cfg.startLat) { self._geocode('start', function() { self._validateStep1(); }); return; }
      if (!cfg.isLoop && !cfg.endLat) { self._geocode('end', function() { self._validateStep1(); }); return; }
      self._validateStep1();
    });
  }

  _validateStep1() {
    if (!this.config.startLat) {
      document.getElementById('tpStartResult').innerHTML = '<span style="color:#e74c3c"><i class="fas fa-exclamation-circle"></i> Please set a start location</span>';
      return;
    }
    if (!this.config.isLoop && !this.config.endLat) {
      document.getElementById('tpEndResult').innerHTML = '<span style="color:#e74c3c"><i class="fas fa-exclamation-circle"></i> Please set an end location</span>';
      return;
    }
    this.step = 2;
    this._renderStep();
  }

  _geocode(which, callback) {
    var inputId = which === 'start' ? 'tpStartInput' : 'tpEndInput';
    var resultId = which === 'start' ? 'tpStartResult' : 'tpEndResult';
    var val = document.getElementById(inputId).value.trim();
    if (!val) return;
    var self = this;
    document.getElementById(resultId).innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
    fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(val) + '&countrycodes=gb,je,gg,im&limit=1')
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.length > 0) {
          var loc = data[0];
          if (which === 'start') {
            self.config.startLat = parseFloat(loc.lat);
            self.config.startLng = parseFloat(loc.lon);
            self.config.startName = loc.display_name.split(',').slice(0, 2).join(',');
          } else {
            self.config.endLat = parseFloat(loc.lat);
            self.config.endLng = parseFloat(loc.lon);
            self.config.endName = loc.display_name.split(',').slice(0, 2).join(',');
          }
          document.getElementById(resultId).innerHTML = '<i class="fas fa-check" style="color:#27ae60"></i> ' + loc.display_name.split(',').slice(0, 3).join(',');
          self._updateMapPreview();
          if (callback) callback();
        } else {
          document.getElementById(resultId).innerHTML = '<span style="color:#e74c3c"><i class="fas fa-times"></i> Location not found. Try a city name.</span>';
        }
      })
      .catch(function() {
        document.getElementById(resultId).innerHTML = '<span style="color:#e74c3c"><i class="fas fa-times"></i> Search failed. Try again.</span>';
      });
  }

  _updateMapPreview() {
    this._clearMapLayers();
    var cfg = this.config;
    if (cfg.startLat) {
      var startIcon = L.divIcon({
        className: '',
        html: '<div class="custom-marker" style="width:32px;height:32px;background:#27ae60;font-size:14px;"><i class="fas fa-flag"></i></div>',
        iconSize: [32, 32], iconAnchor: [16, 16]
      });
      var sm = L.marker([cfg.startLat, cfg.startLng], { icon: startIcon }).addTo(this.map).bindPopup('<b>Start:</b> ' + cfg.startName);
      this.mapLayers.push(sm);
    }
    if (!cfg.isLoop && cfg.endLat) {
      var endIcon = L.divIcon({
        className: '',
        html: '<div class="custom-marker" style="width:32px;height:32px;background:#e74c3c;font-size:14px;"><i class="fas fa-flag-checkered"></i></div>',
        iconSize: [32, 32], iconAnchor: [16, 16]
      });
      var em = L.marker([cfg.endLat, cfg.endLng], { icon: endIcon }).addTo(this.map).bindPopup('<b>End:</b> ' + cfg.endName);
      this.mapLayers.push(em);
    }
    var pts = [];
    if (cfg.startLat) pts.push([cfg.startLat, cfg.startLng]);
    if (!cfg.isLoop && cfg.endLat) pts.push([cfg.endLat, cfg.endLng]);
    if (pts.length > 0) this.map.fitBounds(L.latLngBounds(pts).pad(0.5));
  }

  // ── Step 2: Interests ─────────────────────────────────────────
  _renderStep2(sb) {
    var self = this;
    var cfg = this.config;

    var presetsHtml = '';
    for (var pk in AITripPlanner.PRESETS) {
      var pr = AITripPlanner.PRESETS[pk];
      presetsHtml += '<button class="tp-preset-btn" data-preset="' + pk + '"><i class="fas ' + pr.icon + '"></i> ' + pr.label + '</button>';
    }

    var typesHtml = '';
    for (var type in AITripPlanner.POI_CONFIG) {
      if (type === 'fuel') continue;
      var c = AITripPlanner.POI_CONFIG[type];
      var checked = cfg.selectedTypes.indexOf(type) >= 0;
      typesHtml += '<label class="tp-poi-card' + (checked ? ' selected' : '') + '" data-type="' + type + '">' +
        '<input type="checkbox" ' + (checked ? 'checked' : '') + ' style="display:none" data-poitype="' + type + '">' +
        '<div class="tp-poi-icon" style="background:' + c.color + '"><i class="fas ' + c.faIcon + '"></i></div>' +
        '<span class="tp-poi-label">' + c.label + '</span>' +
      '</label>';
    }

    sb.innerHTML =
      '<div class="tp-header">' +
        '<div class="tp-logo"><i class="fas fa-wand-magic-sparkles"></i> Trip Planner</div>' +
        '<div class="tp-steps"><span class="tp-step done">1</span><span class="tp-step active">2</span><span class="tp-step">3</span><span class="tp-step">4</span></div>' +
      '</div>' +
      '<div class="tp-body">' +
        '<h2 class="tp-title">What Do You Want To See?</h2>' +
        '<p class="tp-subtitle">Pick your interests or choose a preset. We\'ll find the best stops within range.</p>' +
        '<div class="tp-presets">' + presetsHtml + '</div>' +
        '<div class="tp-poi-grid">' + typesHtml + '</div>' +
        '<div class="tp-count" id="tpPoiCount"></div>' +
      '</div>' +
      '<div class="tp-footer">' +
        '<button class="tp-btn tp-btn-secondary" id="tpBack2"><i class="fas fa-arrow-left"></i> Back</button>' +
        '<button class="tp-btn tp-btn-primary" id="tpNext2">Generate Trip <i class="fas fa-wand-magic-sparkles"></i></button>' +
      '</div>';

    this._updatePoiCount();

    document.querySelectorAll('.tp-poi-card').forEach(function(card) {
      card.addEventListener('click', function() {
        var type = card.dataset.type;
        var cb = card.querySelector('input');
        cb.checked = !cb.checked;
        card.classList.toggle('selected', cb.checked);
        self._syncSelectedTypes();
        self._updatePoiCount();
      });
    });

    document.querySelectorAll('.tp-preset-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var preset = AITripPlanner.PRESETS[btn.dataset.preset];
        if (!preset) return;
        cfg.selectedTypes = preset.types.slice();
        document.querySelectorAll('.tp-poi-card').forEach(function(card) {
          var t = card.dataset.type;
          var checked = cfg.selectedTypes.indexOf(t) >= 0;
          card.classList.toggle('selected', checked);
          card.querySelector('input').checked = checked;
        });
        self._updatePoiCount();
      });
    });

    document.getElementById('tpBack2').addEventListener('click', function() { self.step = 1; self._renderStep(); });
    document.getElementById('tpNext2').addEventListener('click', function() {
      self._syncSelectedTypes();
      if (cfg.selectedTypes.length === 0) {
        document.getElementById('tpPoiCount').innerHTML = '<span style="color:#e74c3c"><i class="fas fa-exclamation-circle"></i> Select at least one interest</span>';
        return;
      }
      self.step = 3;
      self._renderStep();
    });
  }

  _syncSelectedTypes() {
    var types = [];
    document.querySelectorAll('.tp-poi-card input:checked').forEach(function(cb) {
      types.push(cb.dataset.poitype);
    });
    this.config.selectedTypes = types;
  }

  _updatePoiCount() {
    var el = document.getElementById('tpPoiCount');
    if (!el) return;
    var cfg = this.config;
    var maxDist = (cfg.maxHoursPerDay * cfg.days * 35) / 1.4 * 0.5;
    var count = 0;
    for (var i = 0; i < this.allPOIs.length; i++) {
      var p = this.allPOIs[i];
      if (cfg.selectedTypes.indexOf(p.type) < 0) continue;
      var d = this._haversine(cfg.startLat, cfg.startLng, p.lat, p.lng);
      if (d < maxDist) count++;
    }
    el.innerHTML = '<i class="fas fa-map-pin" style="color:var(--accent)"></i> <strong>' + count + '</strong> matching POIs within your trip range';
  }

  // ── Step 3: Generating ────────────────────────────────────────
  _renderStep3(sb) {
    sb.innerHTML =
      '<div class="tp-header">' +
        '<div class="tp-logo"><i class="fas fa-wand-magic-sparkles"></i> Trip Planner</div>' +
        '<div class="tp-steps"><span class="tp-step done">1</span><span class="tp-step done">2</span><span class="tp-step active">3</span><span class="tp-step">4</span></div>' +
      '</div>' +
      '<div class="tp-body" style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:60vh;text-align:center;">' +
        '<div class="tp-generating">' +
          '<i class="fas fa-route fa-3x" style="color:var(--accent);margin-bottom:16px;"></i>' +
          '<h2 class="tp-title">Building Your Trip...</h2>' +
          '<p class="tp-subtitle" id="tpGenStatus">Analysing ' + this.allPOIs.length + ' POIs across the UK</p>' +
          '<div class="tp-progress"><div class="tp-progress-bar" id="tpProgressBar"></div></div>' +
        '</div>' +
      '</div>';

    var self = this;
    setTimeout(function() { self._generateTrip(); }, 200);
  }

  _setGenStatus(text, pct) {
    var el = document.getElementById('tpGenStatus');
    var bar = document.getElementById('tpProgressBar');
    if (el) el.textContent = text;
    if (bar) bar.style.width = pct + '%';
  }

  async _generateTrip() {
    var cfg = this.config;
    // Road distance is ~1.4x haversine on UK roads
    var ROAD_FACTOR = 1.4;
    var avgSpeedMph = 35;
    var maxMilesPerDay = cfg.maxHoursPerDay * avgSpeedMph;
    // Use corrected haversine limit to stay under real road budget
    var haversineLimit = maxMilesPerDay / ROAD_FACTOR;
    var totalMaxMiles = maxMilesPerDay * cfg.days;
    var maxDurationPerDay = cfg.maxHoursPerDay * 60; // minutes

    this._setGenStatus('Filtering POIs by your interests...', 10);

    // 1. Gather candidate POIs within reachable range
    var candidates = [];
    var maxRange = (totalMaxMiles / ROAD_FACTOR) * 0.5;
    var endLat = cfg.isLoop ? cfg.startLat : cfg.endLat;
    var endLng = cfg.isLoop ? cfg.startLng : cfg.endLng;

    for (var i = 0; i < this.allPOIs.length; i++) {
      var p = this.allPOIs[i];
      if (cfg.selectedTypes.indexOf(p.type) < 0) continue;
      var distFromStart = this._haversine(cfg.startLat, cfg.startLng, p.lat, p.lng);
      if (distFromStart > maxRange) continue;
      if (!cfg.isLoop && cfg.endLat) {
        var distFromEnd = this._haversine(cfg.endLat, cfg.endLng, p.lat, p.lng);
        if (Math.min(distFromStart, distFromEnd) > maxRange) continue;
      }
      candidates.push(Object.assign({}, p, { distFromStart: distFromStart }));
    }

    this._setGenStatus('Found ' + candidates.length + ' candidate POIs. Scoring...', 25);
    await this._sleep(150);

    // 2. Score candidates
    var typeCount = {};
    for (var j = 0; j < candidates.length; j++) {
      var t = candidates[j].type;
      typeCount[t] = (typeCount[t] || 0) + 1;
    }
    for (var k = 0; k < candidates.length; k++) {
      var c = candidates[k];
      var rarity = 1 / Math.sqrt(typeCount[c.type] || 1);
      var distScore = 1 - (c.distFromStart / (maxRange + 1));
      c.score = rarity * 0.4 + distScore * 0.6;
    }
    candidates.sort(function(a, b) { return b.score - a.score; });

    // 3. Select top POIs: ~3 per day, well-spaced
    var targetStops = Math.min(cfg.days * 3, candidates.length);
    var selected = [];
    var minSpacing = 8;
    for (var m = 0; m < candidates.length && selected.length < targetStops; m++) {
      var cand = candidates[m];
      var tooClose = false;
      for (var n = 0; n < selected.length; n++) {
        if (this._haversine(cand.lat, cand.lng, selected[n].lat, selected[n].lng) < minSpacing) {
          tooClose = true;
          break;
        }
      }
      if (!tooClose) selected.push(cand);
    }

    this._setGenStatus('Selected ' + selected.length + ' stops. Optimising route...', 40);
    await this._sleep(150);

    // 4. Build route using nearest-neighbour with end-bias
    var route = [];
    var currentLat = cfg.startLat, currentLng = cfg.startLng;
    var remaining = selected.slice();

    while (remaining.length > 0) {
      var progressRatio = route.length / (route.length + remaining.length);
      var best = -1, bestScore = Infinity;
      for (var r = 0; r < remaining.length; r++) {
        var dToCurrent = this._haversine(currentLat, currentLng, remaining[r].lat, remaining[r].lng);
        var dToEnd = this._haversine(remaining[r].lat, remaining[r].lng, endLat, endLng);
        var combinedScore = dToCurrent * (1 - progressRatio * 0.3) + dToEnd * progressRatio * 0.15;
        if (combinedScore < bestScore) {
          bestScore = combinedScore;
          best = r;
        }
      }
      if (best >= 0) {
        route.push(remaining[best]);
        currentLat = remaining[best].lat;
        currentLng = remaining[best].lng;
        remaining.splice(best, 1);
      }
    }

    this._setGenStatus('Splitting into ' + cfg.days + ' days...', 55);
    await this._sleep(150);

    // 5. Split route into days using corrected haversine limit
    var days = [];
    var dayStops = [];
    var dayMiles = 0;
    var prevLat = cfg.startLat, prevLng = cfg.startLng;

    for (var q = 0; q < route.length; q++) {
      var legDist = this._haversine(prevLat, prevLng, route[q].lat, route[q].lng);
      if (dayMiles + legDist > haversineLimit && dayStops.length > 0 && days.length < cfg.days - 1) {
        days.push({ stops: dayStops, miles: Math.round(dayMiles * ROAD_FACTOR) });
        dayStops = [];
        dayMiles = 0;
      }
      dayMiles += legDist;
      dayStops.push(route[q]);
      prevLat = route[q].lat;
      prevLng = route[q].lng;
    }
    if (dayStops.length > 0 || days.length === 0) {
      days.push({ stops: dayStops, miles: Math.round(dayMiles * ROAD_FACTOR) });
    }

    // Rebalance: fill remaining days by splitting the longest
    while (days.length < cfg.days && days.length < route.length) {
      var longestIdx = 0;
      for (var li = 1; li < days.length; li++) {
        if (days[li].stops.length > days[longestIdx].stops.length) longestIdx = li;
      }
      if (days[longestIdx].stops.length < 2) break;
      var half = Math.ceil(days[longestIdx].stops.length / 2);
      days.splice(longestIdx, 1,
        { stops: days[longestIdx].stops.slice(0, half), miles: 0 },
        { stops: days[longestIdx].stops.slice(half), miles: 0 }
      );
    }

    this._setGenStatus('Fetching real road routes from OSRM...', 65);
    await this._sleep(100);

    // 6. Get OSRM routes for each day
    for (var oi = 0; oi < days.length; oi++) {
      var waypoints = [];
      if (oi === 0) {
        waypoints.push([cfg.startLat, cfg.startLng]);
      } else {
        var prevDay = days[oi - 1];
        var prevLast = prevDay.stops[prevDay.stops.length - 1];
        waypoints.push([prevLast.lat, prevLast.lng]);
      }
      for (var wi = 0; wi < days[oi].stops.length; wi++) {
        waypoints.push([days[oi].stops[wi].lat, days[oi].stops[wi].lng]);
      }
      if (oi === days.length - 1) {
        waypoints.push([endLat, endLng]);
      }
      if (waypoints.length >= 2) {
        days[oi].routeGeom = await this._fetchOSRM(waypoints);
        if (days[oi].routeGeom && days[oi].routeGeom.distance) {
          days[oi].miles = Math.round(days[oi].routeGeom.distance / 1609.34);
          days[oi].duration = Math.round(days[oi].routeGeom.duration / 60);
        }
      }
      this._setGenStatus('Routing day ' + (oi + 1) + ' of ' + days.length + '...', 65 + Math.round(20 * (oi + 1) / days.length));
    }

    // 7. Enforce duration limit: re-split any day that exceeds maxHoursPerDay
    this._setGenStatus('Enforcing daily time limits...', 88);
    await this._sleep(100);
    var enforced = true;
    var passes = 0;
    while (enforced && passes < 5) {
      enforced = false;
      passes++;
      for (var ei = 0; ei < days.length; ei++) {
        if (days[ei].duration && days[ei].duration > maxDurationPerDay && days[ei].stops.length >= 2) {
          // Drop the stop furthest from its neighbours to shorten this day
          var worstIdx = -1, worstDetour = -1;
          for (var si = 0; si < days[ei].stops.length; si++) {
            var prevPt = si === 0 ? (ei === 0 ? [cfg.startLat, cfg.startLng] : [days[ei - 1].stops[days[ei - 1].stops.length - 1].lat, days[ei - 1].stops[days[ei - 1].stops.length - 1].lng]) : [days[ei].stops[si - 1].lat, days[ei].stops[si - 1].lng];
            var nextPt = si === days[ei].stops.length - 1 ? (ei === days.length - 1 ? [endLat, endLng] : [days[ei].stops[si].lat, days[ei].stops[si].lng]) : [days[ei].stops[si + 1].lat, days[ei].stops[si + 1].lng];
            var detour = this._haversine(prevPt[0], prevPt[1], days[ei].stops[si].lat, days[ei].stops[si].lng) +
                         this._haversine(days[ei].stops[si].lat, days[ei].stops[si].lng, nextPt[0], nextPt[1]) -
                         this._haversine(prevPt[0], prevPt[1], nextPt[0], nextPt[1]);
            if (detour > worstDetour) { worstDetour = detour; worstIdx = si; }
          }
          if (worstIdx >= 0) {
            days[ei].stops.splice(worstIdx, 1);
            // Re-route this day
            var reWps = [];
            if (ei === 0) { reWps.push([cfg.startLat, cfg.startLng]); }
            else { var pl = days[ei - 1].stops[days[ei - 1].stops.length - 1]; reWps.push([pl.lat, pl.lng]); }
            for (var ri = 0; ri < days[ei].stops.length; ri++) {
              reWps.push([days[ei].stops[ri].lat, days[ei].stops[ri].lng]);
            }
            if (ei === days.length - 1) { reWps.push([endLat, endLng]); }
            if (reWps.length >= 2) {
              days[ei].routeGeom = await this._fetchOSRM(reWps);
              if (days[ei].routeGeom && days[ei].routeGeom.distance) {
                days[ei].miles = Math.round(days[ei].routeGeom.distance / 1609.34);
                days[ei].duration = Math.round(days[ei].routeGeom.duration / 60);
              }
            }
            enforced = true;
          }
        }
      }
    }

    // 8. Find overnight accommodation
    this._setGenStatus('Finding overnight stops...', 95);
    await this._sleep(100);
    for (var di = 0; di < days.length; di++) {
      if (di < days.length - 1 && days[di].stops.length > 0) {
        var lastStop = days[di].stops[days[di].stops.length - 1];
        days[di].overnight = this._findNearestAccommodation(lastStop.lat, lastStop.lng);
      }
    }

    this.generatedTrip = { days: days, config: cfg };
    this.step = 4;
    this._renderStep();
  }

  _findNearestAccommodation(lat, lng) {
    var best = null, bestDist = Infinity;
    for (var i = 0; i < this.allPOIs.length; i++) {
      var p = this.allPOIs[i];
      if (p.type !== 'campsites' && p.type !== 'pubs') continue;
      var d = this._haversine(lat, lng, p.lat, p.lng);
      if (d < bestDist) { bestDist = d; best = p; }
    }
    if (bestDist < 30) return best;
    return null;
  }

  async _fetchOSRM(waypoints) {
    var coords = waypoints.map(function(w) { return w[1].toFixed(6) + ',' + w[0].toFixed(6); }).join(';');
    try {
      var resp = await fetch('https://router.project-osrm.org/route/v1/driving/' + coords + '?overview=full&geometries=geojson');
      var data = await resp.json();
      if (data.code === 'Ok' && data.routes && data.routes[0]) {
        return data.routes[0];
      }
    } catch (e) { /* ignore */ }
    return null;
  }

  _sleep(ms) { return new Promise(function(r) { setTimeout(r, ms); }); }

  // ── Step 4: Results ───────────────────────────────────────────
  _renderStep4(sb) {
    var trip = this.generatedTrip;
    if (!trip) return;
    var cfg = trip.config;
    var days = trip.days;

    var totalMiles = 0, totalStops = 0, totalMins = 0;
    for (var i = 0; i < days.length; i++) {
      totalMiles += days[i].miles || 0;
      totalStops += days[i].stops.length;
      totalMins += days[i].duration || 0;
    }

    var daysHtml = '';
    for (var d = 0; d < days.length; d++) {
      var day = days[d];
      var color = AITripPlanner.DAY_COLORS[d % AITripPlanner.DAY_COLORS.length];
      var stopsHtml = '';
      for (var s = 0; s < day.stops.length; s++) {
        var stop = day.stops[s];
        var poiCfg = AITripPlanner.POI_CONFIG[stop.type] || {};
        stopsHtml += '<div class="tp-stop">' +
          '<div class="tp-stop-icon" style="background:' + (poiCfg.color || '#888') + '"><i class="fas ' + (poiCfg.faIcon || 'fa-map-pin') + '"></i></div>' +
          '<div class="tp-stop-info"><span class="tp-stop-name">' + stop.name + '</span><span class="tp-stop-type">' + (poiCfg.label || stop.type) + '</span></div>' +
        '</div>';
      }
      if (day.overnight) {
        var overnightCfg = AITripPlanner.POI_CONFIG[day.overnight.type] || {};
        stopsHtml += '<div class="tp-stop tp-stop-overnight">' +
          '<div class="tp-stop-icon" style="background:#f39c12"><i class="fas fa-bed"></i></div>' +
          '<div class="tp-stop-info"><span class="tp-stop-name">' + day.overnight.name + '</span><span class="tp-stop-type">Overnight · ' + (overnightCfg.label || '') + '</span></div>' +
        '</div>';
      }

      daysHtml += '<div class="tp-day-card">' +
        '<div class="tp-day-header" data-day="' + d + '" style="border-left:4px solid ' + color + '">' +
          '<div class="tp-day-num" style="background:' + color + '">Day ' + (d + 1) + '</div>' +
          '<div class="tp-day-stats">' + (day.miles || '?') + ' mi · ' + (day.duration ? Math.round(day.duration / 60 * 10) / 10 + 'h' : '?') + ' · ' + day.stops.length + ' stops</div>' +
          '<i class="fas fa-chevron-down tp-day-toggle"></i>' +
        '</div>' +
        '<div class="tp-day-body" id="tpDayBody' + d + '" style="display:none;">' + stopsHtml + '</div>' +
      '</div>';
    }

    sb.innerHTML =
      '<div class="tp-header">' +
        '<div class="tp-logo"><i class="fas fa-wand-magic-sparkles"></i> Trip Planner</div>' +
        '<div class="tp-steps"><span class="tp-step done">1</span><span class="tp-step done">2</span><span class="tp-step done">3</span><span class="tp-step active">4</span></div>' +
      '</div>' +
      '<div class="tp-body">' +
        '<h2 class="tp-title">Your Trip is Ready</h2>' +
        '<div class="tp-summary">' +
          '<div class="tp-stat"><i class="fas fa-road"></i> <strong>' + totalMiles + '</strong> miles</div>' +
          '<div class="tp-stat"><i class="fas fa-calendar-day"></i> <strong>' + days.length + '</strong> days</div>' +
          '<div class="tp-stat"><i class="fas fa-map-pin"></i> <strong>' + totalStops + '</strong> stops</div>' +
          '<div class="tp-stat"><i class="fas fa-clock"></i> <strong>' + (totalMins > 0 ? Math.round(totalMins / 60) + 'h' : '?') + '</strong> riding</div>' +
        '</div>' +
        '<div class="tp-days-list">' + daysHtml + '</div>' +
      '</div>' +
      '<div class="tp-footer tp-footer-actions">' +
        '<button class="tp-btn tp-btn-secondary" id="tpRestart"><i class="fas fa-redo"></i> Start Over</button>' +
        '<button class="tp-btn tp-btn-accent" id="tpExportGpx"><i class="fas fa-download"></i> GPX</button>' +
        '<button class="tp-btn tp-btn-primary" id="tpEditRoute"><i class="fas fa-pencil-ruler"></i> Edit in Builder</button>' +
      '</div>';

    this._plotTrip();

    var self = this;
    document.querySelectorAll('.tp-day-header').forEach(function(hdr) {
      hdr.addEventListener('click', function() {
        var dayIdx = parseInt(hdr.dataset.day);
        var body = document.getElementById('tpDayBody' + dayIdx);
        var icon = hdr.querySelector('.tp-day-toggle');
        if (body.style.display === 'none') {
          body.style.display = '';
          icon.classList.replace('fa-chevron-down', 'fa-chevron-up');
        } else {
          body.style.display = 'none';
          icon.classList.replace('fa-chevron-up', 'fa-chevron-down');
        }
      });
    });

    document.getElementById('tpRestart').addEventListener('click', function() {
      self.generatedTrip = null;
      self.step = 1;
      self._clearMapLayers();
      self.map.setView([54.5, -3.5], 6);
      self._renderStep();
    });
    document.getElementById('tpExportGpx').addEventListener('click', function() { self._exportGPX(); });
    document.getElementById('tpEditRoute').addEventListener('click', function() { self._loadIntoBuilder(); });
  }

  _plotTrip() {
    this._clearMapLayers();
    var trip = this.generatedTrip;
    var cfg = trip.config;
    var days = trip.days;
    var bounds = [];

    // Start marker
    var startIcon = L.divIcon({
      className: '',
      html: '<div class="custom-marker" style="width:32px;height:32px;background:#27ae60;font-size:13px;font-weight:700;">S</div>',
      iconSize: [32, 32], iconAnchor: [16, 16]
    });
    var sm = L.marker([cfg.startLat, cfg.startLng], { icon: startIcon }).addTo(this.map).bindPopup('<b>Start:</b> ' + cfg.startName);
    this.mapLayers.push(sm);
    bounds.push([cfg.startLat, cfg.startLng]);

    // End marker (if not loop)
    if (!cfg.isLoop && cfg.endLat) {
      var endIcon = L.divIcon({
        className: '',
        html: '<div class="custom-marker" style="width:32px;height:32px;background:#e74c3c;font-size:12px;"><i class="fas fa-flag-checkered"></i></div>',
        iconSize: [32, 32], iconAnchor: [16, 16]
      });
      var em = L.marker([cfg.endLat, cfg.endLng], { icon: endIcon }).addTo(this.map).bindPopup('<b>End:</b> ' + cfg.endName);
      this.mapLayers.push(em);
      bounds.push([cfg.endLat, cfg.endLng]);
    }

    for (var d = 0; d < days.length; d++) {
      var day = days[d];
      var color = AITripPlanner.DAY_COLORS[d % AITripPlanner.DAY_COLORS.length];

      // Route line
      if (day.routeGeom && day.routeGeom.geometry) {
        var coords = day.routeGeom.geometry.coordinates.map(function(c) { return [c[1], c[0]]; });
        var line = L.polyline(coords, { color: color, weight: 4, opacity: 0.85 }).addTo(this.map);
        line.bindPopup('<b>Day ' + (d + 1) + '</b><br>' + (day.miles || '?') + ' miles');
        this.mapLayers.push(line);
        for (var ci = 0; ci < coords.length; ci++) bounds.push(coords[ci]);
      }

      // POI markers
      for (var s = 0; s < day.stops.length; s++) {
        var stop = day.stops[s];
        var poiCfg = AITripPlanner.POI_CONFIG[stop.type] || {};
        var mIcon = L.divIcon({
          className: '',
          html: '<div class="custom-marker" style="width:24px;height:24px;background:' + (poiCfg.color || '#888') + '"><i class="fas ' + (poiCfg.faIcon || 'fa-map-pin') + '" style="font-size:10px"></i></div>',
          iconSize: [24, 24], iconAnchor: [12, 12], popupAnchor: [0, -14]
        });
        var marker = L.marker([stop.lat, stop.lng], { icon: mIcon }).addTo(this.map)
          .bindPopup('<div style="font-size:12px"><b>' + stop.name + '</b><br><span style="color:' + (poiCfg.color || '#888') + '">' + (poiCfg.label || stop.type) + '</span> · Day ' + (d + 1) + (stop.desc ? '<br><span style="color:#aaa">' + stop.desc.substring(0, 100) + '</span>' : '') + '</div>');
        this.mapLayers.push(marker);
        bounds.push([stop.lat, stop.lng]);
      }

      // Overnight marker
      if (day.overnight) {
        var oIcon = L.divIcon({
          className: '',
          html: '<div class="custom-marker" style="width:26px;height:26px;background:#f39c12"><i class="fas fa-bed" style="font-size:11px"></i></div>',
          iconSize: [26, 26], iconAnchor: [13, 13], popupAnchor: [0, -16]
        });
        var om = L.marker([day.overnight.lat, day.overnight.lng], { icon: oIcon }).addTo(this.map)
          .bindPopup('<div style="font-size:12px"><b>' + day.overnight.name + '</b><br><span style="color:#f39c12">Overnight Stop</span> · Day ' + (d + 1) + '</div>');
        this.mapLayers.push(om);
        bounds.push([day.overnight.lat, day.overnight.lng]);
      }
    }

    if (bounds.length > 0) {
      this.map.fitBounds(L.latLngBounds(bounds), { padding: [30, 30] });
    }
  }

  // ── GPX Export ────────────────────────────────────────────────
  _exportGPX() {
    var trip = this.generatedTrip;
    if (!trip) return;
    var gpx = '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<gpx version="1.1" creator="VisorUp Trip Planner" xmlns="http://www.topografix.com/GPX/1/1">\n' +
      '<metadata><name>VisorUp Trip — ' + trip.config.days + ' Days</name><time>' + new Date().toISOString() + '</time></metadata>\n';

    for (var d = 0; d < trip.days.length; d++) {
      var day = trip.days[d];
      // Waypoints
      for (var s = 0; s < day.stops.length; s++) {
        var stop = day.stops[s];
        gpx += '<wpt lat="' + stop.lat + '" lon="' + stop.lng + '"><name>Day ' + (d + 1) + ': ' + stop.name + '</name><desc>' + (stop.desc || '') + '</desc></wpt>\n';
      }
      // Track
      if (day.routeGeom && day.routeGeom.geometry) {
        gpx += '<trk><name>Day ' + (d + 1) + '</name><trkseg>\n';
        var coords = day.routeGeom.geometry.coordinates;
        for (var c = 0; c < coords.length; c++) {
          gpx += '<trkpt lat="' + coords[c][1] + '" lon="' + coords[c][0] + '"></trkpt>\n';
        }
        gpx += '</trkseg></trk>\n';
      }
    }

    gpx += '</gpx>';
    var blob = new Blob([gpx], { type: 'application/gpx+xml' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'visorup-trip-' + trip.config.days + 'day.gpx';
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── Load into Route Builder ───────────────────────────────────
  _loadIntoBuilder() {
    var trip = this.generatedTrip;
    if (!trip) return;
    var waypoints = [];
    waypoints.push({ lat: trip.config.startLat, lng: trip.config.startLng, name: 'Start: ' + trip.config.startName });
    for (var d = 0; d < trip.days.length; d++) {
      for (var s = 0; s < trip.days[d].stops.length; s++) {
        var stop = trip.days[d].stops[s];
        waypoints.push({ lat: stop.lat, lng: stop.lng, name: stop.name });
      }
    }
    if (!trip.config.isLoop && trip.config.endLat) {
      waypoints.push({ lat: trip.config.endLat, lng: trip.config.endLng, name: 'End: ' + trip.config.endName });
    }
    sessionStorage.setItem('tp_waypoints', JSON.stringify(waypoints));
    location.hash = '#/build-route?from=planner';
  }

  // ── Utilities ─────────────────────────────────────────────────
  _haversine(lat1, lng1, lat2, lng2) {
    var R = 3958.8;
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLng = (lng2 - lng1) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
}
