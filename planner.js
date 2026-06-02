/* planner.js -- MapLibre GL route planner (Phase 2)
   Replaces Leaflet route builder with GPU-accelerated vector map.
   Uses OSRM for now; designed for GraphHopper swap (Phase 1). */

class RoutePlanner {
  static TWISTINESS = {
    fast:   { label: 'Fast', icon: 'fa-bolt', desc: 'Shortest time, motorways allowed', color: '#2d98da' },
    curvy:  { label: 'Curvy', icon: 'fa-road', desc: 'Scenic roads, mild detours', color: '#D68A2D' },
    twisty: { label: 'Twisty', icon: 'fa-route', desc: 'Maximum curves, avoid main roads', color: '#e74c3c' }
  };

  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    this.waypoints = [];
    this.shapingPoints = [];
    this.routeGeometry = null;
    this.routeDistance = 0;
    this.routeDuration = 0;
    this.elevationData = [];
    this.twistiness = 'curvy';
    this.markers = {};
    this.markerIdCounter = 0;
    this.draggedMarker = null;
    this.sidebarOpen = true;
    this._render();
  }

  _render() {
    this.container.innerHTML =
      '<div class="pl-layout">' +
        '<div class="pl-sidebar" id="plSidebar">' +
          '<div class="pl-sidebar-header">' +
            '<div class="pl-title"><i class="fas fa-pencil-ruler"></i> Route Planner</div>' +
            '<button class="pl-sidebar-toggle" id="plSidebarToggle"><i class="fas fa-chevron-left"></i></button>' +
          '</div>' +
          '<div class="pl-sidebar-body" id="plSidebarBody">' +
            '<div class="pl-search-section">' +
              '<div class="pl-search-wrap">' +
                '<input type="text" id="plSearchInput" class="pl-input" placeholder="Search location...">' +
                '<button class="pl-search-btn" id="plSearchBtn"><i class="fas fa-search"></i></button>' +
              '</div>' +
              '<div id="plSearchResults" class="pl-search-results"></div>' +
            '</div>' +
            '<div class="pl-twist-section">' +
              '<label class="pl-label">Routing Style</label>' +
              '<div class="pl-twist-btns" id="plTwistBtns"></div>' +
            '</div>' +
            '<div class="pl-stats" id="plStats">' +
              '<div class="pl-stat"><i class="fas fa-road"></i> <span id="plDist">0</span> mi</div>' +
              '<div class="pl-stat"><i class="fas fa-clock"></i> <span id="plTime">0h</span></div>' +
              '<div class="pl-stat"><i class="fas fa-map-pin"></i> <span id="plWpCount">0</span> pts</div>' +
            '</div>' +
            '<div class="pl-waypoints" id="plWaypointList"></div>' +
            '<div class="pl-elevation" id="plElevation" style="display:none;">' +
              '<label class="pl-label"><i class="fas fa-mountain"></i> Elevation Profile</label>' +
              '<canvas id="plElevCanvas" width="350" height="120"></canvas>' +
            '</div>' +
          '</div>' +
          '<div class="pl-sidebar-footer">' +
            '<button class="pl-btn pl-btn-secondary" id="plClearBtn"><i class="fas fa-trash"></i> Clear</button>' +
            '<button class="pl-btn pl-btn-secondary" id="plReverseBtn"><i class="fas fa-right-left"></i></button>' +
            '<div class="pl-export-group">' +
              '<button class="pl-btn pl-btn-accent" id="plExportGpx"><i class="fas fa-download"></i> GPX</button>' +
              '<button class="pl-btn pl-btn-secondary" id="plExportKml">KML</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="pl-map-wrap">' +
          '<div id="plMap" class="pl-map"></div>' +
          '<div class="pl-map-hint" id="plMapHint"><i class="fas fa-mouse-pointer"></i> Click map to add waypoints</div>' +
          '<button class="pl-sidebar-open-btn" id="plSidebarOpenBtn" style="display:none;"><i class="fas fa-bars"></i></button>' +
        '</div>' +
      '</div>';

    this._initMap();
    this._initTwistButtons();
    this._bindEvents();
  }

  _initMap() {
    var isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    this.map = new maplibregl.Map({
      container: 'plMap',
      style: isDark
        ? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
        : 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [-3.5, 54.5],
      zoom: 5.5,
      attributionControl: true
    });
    this.map.addControl(new maplibregl.NavigationControl(), 'top-right');
    this.map.addControl(new maplibregl.GeolocateControl({ positionOptions: { enableHighAccuracy: true }, trackUserLocation: false }), 'top-right');

    var self = this;
    this.map.on('load', function () {
      // Route line source + layer
      self.map.addSource('route', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
      self.map.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#D68A2D', 'line-width': 5, 'line-opacity': 0.85 }
      });
      // Invisible wide line for drag interaction
      self.map.addLayer({
        id: 'route-hit',
        type: 'line',
        source: 'route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': 'transparent', 'line-width': 24, 'line-opacity': 0 }
      });

      self.map.on('click', function (e) {
        var features = self.map.queryRenderedFeatures(e.point, { layers: ['route-hit'] });
        if (features.length > 0) {
          self._insertShapingPoint(e.lngLat.lat, e.lngLat.lng);
        } else {
          self._addWaypoint(e.lngLat.lat, e.lngLat.lng);
        }
      });

      self.map.on('mouseenter', 'route-hit', function () { self.map.getCanvas().style.cursor = 'crosshair'; });
      self.map.on('mouseleave', 'route-hit', function () { self.map.getCanvas().style.cursor = ''; });
    });
  }

  _initTwistButtons() {
    var container = document.getElementById('plTwistBtns');
    if (!container) return;
    var html = '';
    var self = this;
    for (var key in RoutePlanner.TWISTINESS) {
      var t = RoutePlanner.TWISTINESS[key];
      html += '<button class="pl-twist-btn' + (key === this.twistiness ? ' active' : '') + '" data-twist="' + key + '" title="' + t.desc + '">' +
        '<i class="fas ' + t.icon + '"></i> ' + t.label + '</button>';
    }
    container.innerHTML = html;
    container.querySelectorAll('.pl-twist-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        container.querySelectorAll('.pl-twist-btn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        self.twistiness = btn.dataset.twist;
        var col = RoutePlanner.TWISTINESS[self.twistiness].color;
        if (self.map.getLayer('route-line')) {
          self.map.setPaintProperty('route-line', 'line-color', col);
        }
        if (self.waypoints.length >= 2) self._buildRoute();
      });
    });
  }

  _bindEvents() {
    var self = this;
    document.getElementById('plSearchBtn').addEventListener('click', function () { self._geocodeSearch(); });
    document.getElementById('plSearchInput').addEventListener('keydown', function (e) { if (e.key === 'Enter') self._geocodeSearch(); });
    document.getElementById('plClearBtn').addEventListener('click', function () { self._clearAll(); });
    document.getElementById('plReverseBtn').addEventListener('click', function () { self._reverseRoute(); });
    document.getElementById('plExportGpx').addEventListener('click', function () { self._exportGPX(); });
    document.getElementById('plExportKml').addEventListener('click', function () { self._exportKML(); });
    document.getElementById('plSidebarToggle').addEventListener('click', function () { self._toggleSidebar(); });
    document.getElementById('plSidebarOpenBtn').addEventListener('click', function () { self._toggleSidebar(); });
  }

  // -- Waypoint Management --

  _addWaypoint(lat, lng, name) {
    var id = 'wp_' + (this.markerIdCounter++);
    var idx = this.waypoints.length;
    var isStart = idx === 0;
    var wp = { id: id, lat: lat, lng: lng, name: name || '', isShaping: false };
    this.waypoints.push(wp);
    this._addMarkerToMap(wp, idx);
    this._updateWaypointList();
    this._updateStats();
    if (this.waypoints.length >= 2) this._buildRoute();
    if (this.waypoints.length === 1) {
      document.getElementById('plMapHint').textContent = 'Click to add more waypoints';
    } else {
      document.getElementById('plMapHint').style.display = 'none';
    }
    if (!name) this._reverseGeocode(wp);
  }

  _insertShapingPoint(lat, lng) {
    var best = this._findNearestSegment(lat, lng);
    if (best < 0) return;
    var id = 'sp_' + (this.markerIdCounter++);
    var wp = { id: id, lat: lat, lng: lng, name: '', isShaping: true };
    this.waypoints.splice(best + 1, 0, wp);
    this._rebuildMarkers();
    this._updateWaypointList();
    if (this.waypoints.length >= 2) this._buildRoute();
    this._reverseGeocode(wp);
  }

  _findNearestSegment(lat, lng) {
    if (this.waypoints.length < 2) return -1;
    var best = -1, bestDist = Infinity;
    for (var i = 0; i < this.waypoints.length - 1; i++) {
      var a = this.waypoints[i], b = this.waypoints[i + 1];
      var d = this._pointToSegDist(lat, lng, a.lat, a.lng, b.lat, b.lng);
      if (d < bestDist) { bestDist = d; best = i; }
    }
    return best;
  }

  _pointToSegDist(px, py, ax, ay, bx, by) {
    var dx = bx - ax, dy = by - ay;
    var t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
    var nx = ax + t * dx, ny = ay + t * dy;
    return Math.sqrt((px - nx) * (px - nx) + (py - ny) * (py - ny));
  }

  _removeWaypoint(id) {
    var idx = this.waypoints.findIndex(function (w) { return w.id === id; });
    if (idx < 0) return;
    if (this.markers[id]) { this.markers[id].remove(); delete this.markers[id]; }
    this.waypoints.splice(idx, 1);
    this._rebuildMarkers();
    this._updateWaypointList();
    this._updateStats();
    if (this.waypoints.length >= 2) this._buildRoute();
    else this._clearRoute();
    if (this.waypoints.length === 0) {
      document.getElementById('plMapHint').style.display = '';
      document.getElementById('plMapHint').innerHTML = '<i class="fas fa-mouse-pointer"></i> Click map to add waypoints';
    }
  }

  _reverseRoute() {
    this.waypoints.reverse();
    this._rebuildMarkers();
    this._updateWaypointList();
    if (this.waypoints.length >= 2) this._buildRoute();
  }

  _clearAll() {
    var self = this;
    Object.keys(this.markers).forEach(function (k) { self.markers[k].remove(); });
    this.markers = {};
    this.waypoints = [];
    this._clearRoute();
    this._updateWaypointList();
    this._updateStats();
    document.getElementById('plMapHint').style.display = '';
    document.getElementById('plMapHint').innerHTML = '<i class="fas fa-mouse-pointer"></i> Click map to add waypoints';
    document.getElementById('plElevation').style.display = 'none';
  }

  // -- Markers --

  _addMarkerToMap(wp, idx) {
    var isStart = idx === 0;
    var isEnd = idx === this.waypoints.length - 1 && this.waypoints.length > 1;
    var color = wp.isShaping ? '#888' : (isStart ? '#27ae60' : (isEnd ? '#e74c3c' : '#D68A2D'));
    var label = wp.isShaping ? '' : (isStart ? 'S' : (isEnd ? 'E' : String(idx)));
    var size = wp.isShaping ? 16 : 30;

    var el = document.createElement('div');
    el.className = 'pl-marker';
    el.style.cssText = 'width:' + size + 'px;height:' + size + 'px;background:' + color + ';border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:' + (wp.isShaping ? '8' : '13') + 'px;font-weight:700;cursor:grab;border:2px solid rgba(255,255,255,0.4);box-shadow:0 2px 8px rgba(0,0,0,0.4);';
    el.textContent = label;

    var marker = new maplibregl.Marker({ element: el, draggable: true })
      .setLngLat([wp.lng, wp.lat])
      .addTo(this.map);

    var self = this;
    marker.on('dragend', function () {
      var pos = marker.getLngLat();
      wp.lat = pos.lat;
      wp.lng = pos.lng;
      self._reverseGeocode(wp);
      if (self.waypoints.length >= 2) self._buildRoute();
    });

    this.markers[wp.id] = marker;
  }

  _rebuildMarkers() {
    var self = this;
    Object.keys(this.markers).forEach(function (k) { self.markers[k].remove(); });
    this.markers = {};
    for (var i = 0; i < this.waypoints.length; i++) {
      this._addMarkerToMap(this.waypoints[i], i);
    }
  }

  // -- Routing --

  async _buildRoute() {
    if (this.waypoints.length < 2) return;
    var coords = this.waypoints.map(function (w) { return w.lng.toFixed(6) + ',' + w.lat.toFixed(6); }).join(';');

    // OSRM for now; will swap to GraphHopper in Phase 1
    var alternatives = this.twistiness === 'fast' ? '' : '&alternatives=true';
    var url = 'https://router.project-osrm.org/route/v1/driving/' + coords + '?overview=full&geometries=geojson' + alternatives;

    try {
      var resp = await fetch(url);
      var data = await resp.json();
      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        // For twisty/curvy, pick the longest (most scenic) alternative
        var route = data.routes[0];
        if (this.twistiness !== 'fast' && data.routes.length > 1) {
          for (var i = 1; i < data.routes.length; i++) {
            if (data.routes[i].distance > route.distance) route = data.routes[i];
          }
        }
        this.routeGeometry = route.geometry;
        this.routeDistance = Math.round(route.distance / 1609.34);
        this.routeDuration = Math.round(route.duration / 60);
        this._renderRoute();
        this._updateStats();
        this._fetchElevation();
      }
    } catch (e) { /* routing failed silently */ }
  }

  _renderRoute() {
    if (!this.routeGeometry) return;
    var geojson = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: this.routeGeometry,
        properties: {}
      }]
    };
    var src = this.map.getSource('route');
    if (src) src.setData(geojson);
  }

  _clearRoute() {
    this.routeGeometry = null;
    this.routeDistance = 0;
    this.routeDuration = 0;
    var src = this.map.getSource('route');
    if (src) src.setData({ type: 'FeatureCollection', features: [] });
    this._updateStats();
  }

  // -- UI Updates --

  _updateStats() {
    var distEl = document.getElementById('plDist');
    var timeEl = document.getElementById('plTime');
    var countEl = document.getElementById('plWpCount');
    if (distEl) distEl.textContent = this.routeDistance || 0;
    if (timeEl) {
      var hrs = Math.floor(this.routeDuration / 60);
      var mins = this.routeDuration % 60;
      timeEl.textContent = hrs + 'h' + (mins > 0 ? ' ' + mins + 'm' : '');
    }
    if (countEl) countEl.textContent = this.waypoints.filter(function (w) { return !w.isShaping; }).length;
  }

  _updateWaypointList() {
    var list = document.getElementById('plWaypointList');
    if (!list) return;
    var self = this;
    if (this.waypoints.length === 0) {
      list.innerHTML = '<div class="pl-empty">No waypoints yet. Click the map or search a location.</div>';
      return;
    }
    var html = '';
    var mainIdx = 0;
    for (var i = 0; i < this.waypoints.length; i++) {
      var wp = this.waypoints[i];
      if (wp.isShaping) continue;
      var isStart = mainIdx === 0;
      var isEnd = i === this.waypoints.length - 1 && this.waypoints.length > 1;
      var color = isStart ? '#27ae60' : (isEnd ? '#e74c3c' : '#D68A2D');
      var label = isStart ? 'S' : (isEnd ? 'E' : String(mainIdx));
      var name = wp.name || ('Point ' + (mainIdx + 1));
      html += '<div class="pl-wp-item" data-id="' + wp.id + '" draggable="true">' +
        '<div class="pl-wp-badge" style="background:' + color + '">' + label + '</div>' +
        '<div class="pl-wp-info">' +
          '<span class="pl-wp-name">' + name + '</span>' +
          '<span class="pl-wp-coord">' + wp.lat.toFixed(4) + ', ' + wp.lng.toFixed(4) + '</span>' +
        '</div>' +
        '<button class="pl-wp-del" data-id="' + wp.id + '"><i class="fas fa-times"></i></button>' +
      '</div>';
      mainIdx++;
    }
    list.innerHTML = html;

    // Delete buttons
    list.querySelectorAll('.pl-wp-del').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        self._removeWaypoint(btn.dataset.id);
      });
    });

    // Drag reorder
    var items = list.querySelectorAll('.pl-wp-item');
    items.forEach(function (item) {
      item.addEventListener('dragstart', function (e) {
        e.dataTransfer.setData('text/plain', item.dataset.id);
        item.classList.add('dragging');
      });
      item.addEventListener('dragend', function () { item.classList.remove('dragging'); });
      item.addEventListener('dragover', function (e) { e.preventDefault(); item.classList.add('drag-over'); });
      item.addEventListener('dragleave', function () { item.classList.remove('drag-over'); });
      item.addEventListener('drop', function (e) {
        e.preventDefault();
        item.classList.remove('drag-over');
        var fromId = e.dataTransfer.getData('text/plain');
        var toId = item.dataset.id;
        self._reorderWaypoints(fromId, toId);
      });
    });

    // Click to fly to
    items.forEach(function (item) {
      item.addEventListener('click', function () {
        var wp = self.waypoints.find(function (w) { return w.id === item.dataset.id; });
        if (wp) self.map.flyTo({ center: [wp.lng, wp.lat], zoom: 12 });
      });
    });
  }

  _reorderWaypoints(fromId, toId) {
    var fromIdx = this.waypoints.findIndex(function (w) { return w.id === fromId; });
    var toIdx = this.waypoints.findIndex(function (w) { return w.id === toId; });
    if (fromIdx < 0 || toIdx < 0 || fromIdx === toIdx) return;
    var item = this.waypoints.splice(fromIdx, 1)[0];
    this.waypoints.splice(toIdx, 0, item);
    this._rebuildMarkers();
    this._updateWaypointList();
    if (this.waypoints.length >= 2) this._buildRoute();
  }

  // -- Geocoding --

  _geocodeSearch() {
    var input = document.getElementById('plSearchInput');
    var val = input.value.trim();
    if (!val) return;
    var self = this;
    var results = document.getElementById('plSearchResults');
    results.innerHTML = '<div class="pl-search-loading"><i class="fas fa-spinner fa-spin"></i></div>';

    fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(val) + '&countrycodes=gb,je,gg,im&limit=5')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.length === 0) {
          results.innerHTML = '<div class="pl-search-empty">No results found</div>';
          return;
        }
        var html = '';
        for (var i = 0; i < data.length; i++) {
          var loc = data[i];
          var shortName = loc.display_name.split(',').slice(0, 3).join(',');
          html += '<div class="pl-search-item" data-lat="' + loc.lat + '" data-lng="' + loc.lon + '" data-name="' + shortName.replace(/"/g, '&quot;') + '">' +
            '<i class="fas fa-map-marker-alt" style="color:var(--accent);margin-right:8px;"></i>' + shortName + '</div>';
        }
        results.innerHTML = html;
        results.querySelectorAll('.pl-search-item').forEach(function (item) {
          item.addEventListener('click', function () {
            var lat = parseFloat(item.dataset.lat);
            var lng = parseFloat(item.dataset.lng);
            self._addWaypoint(lat, lng, item.dataset.name);
            self.map.flyTo({ center: [lng, lat], zoom: 11 });
            results.innerHTML = '';
            input.value = '';
          });
        });
      })
      .catch(function () { results.innerHTML = '<div class="pl-search-empty">Search failed</div>'; });
  }

  _reverseGeocode(wp) {
    fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat=' + wp.lat + '&lon=' + wp.lng + '&zoom=14')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data && data.display_name) {
          wp.name = data.display_name.split(',').slice(0, 2).join(',').trim();
          var nameEl = document.querySelector('.pl-wp-item[data-id="' + wp.id + '"] .pl-wp-name');
          if (nameEl) nameEl.textContent = wp.name;
        }
      })
      .catch(function () {});
  }

  // -- Elevation --

  async _fetchElevation() {
    if (!this.routeGeometry || !this.routeGeometry.coordinates) return;
    var coords = this.routeGeometry.coordinates;
    var step = Math.max(1, Math.floor(coords.length / 100));
    var lats = [], lngs = [];
    for (var i = 0; i < coords.length; i += step) {
      lats.push(coords[i][1].toFixed(4));
      lngs.push(coords[i][0].toFixed(4));
    }
    try {
      var url = 'https://api.open-meteo.com/v1/elevation?latitude=' + lats.join(',') + '&longitude=' + lngs.join(',');
      var resp = await fetch(url);
      var data = await resp.json();
      if (data && data.elevation) {
        this.elevationData = data.elevation;
        this._renderElevation();
      }
    } catch (e) {}
  }

  _renderElevation() {
    var el = document.getElementById('plElevation');
    var canvas = document.getElementById('plElevCanvas');
    if (!el || !canvas || this.elevationData.length < 2) return;
    el.style.display = '';
    var ctx = canvas.getContext('2d');
    var W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    var elev = this.elevationData;
    var min = Math.min.apply(null, elev), max = Math.max.apply(null, elev);
    var range = max - min || 1;

    // Background
    ctx.fillStyle = 'rgba(13,59,46,0.3)';
    ctx.fillRect(0, 0, W, H);

    // Profile fill
    ctx.beginPath();
    ctx.moveTo(0, H);
    for (var i = 0; i < elev.length; i++) {
      var x = (i / (elev.length - 1)) * W;
      var y = H - ((elev[i] - min) / range) * (H - 20) - 10;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.lineTo(W, H);
    ctx.closePath();
    var grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, 'rgba(214,138,45,0.6)');
    grad.addColorStop(1, 'rgba(214,138,45,0.05)');
    ctx.fillStyle = grad;
    ctx.fill();

    // Profile line
    ctx.beginPath();
    for (var j = 0; j < elev.length; j++) {
      var x2 = (j / (elev.length - 1)) * W;
      var y2 = H - ((elev[j] - min) / range) * (H - 20) - 10;
      if (j === 0) ctx.moveTo(x2, y2);
      else ctx.lineTo(x2, y2);
    }
    ctx.strokeStyle = '#D68A2D';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Labels
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '10px Inter, sans-serif';
    ctx.fillText(Math.round(max) + 'm', 4, 14);
    ctx.fillText(Math.round(min) + 'm', 4, H - 4);
    var totalAscent = 0;
    for (var k = 1; k < elev.length; k++) {
      if (elev[k] > elev[k - 1]) totalAscent += elev[k] - elev[k - 1];
    }
    ctx.fillText('Ascent: ' + Math.round(totalAscent) + 'm', W - 90, 14);
  }

  // -- Sidebar --

  _toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    var sb = document.getElementById('plSidebar');
    var openBtn = document.getElementById('plSidebarOpenBtn');
    if (this.sidebarOpen) {
      sb.style.display = '';
      openBtn.style.display = 'none';
    } else {
      sb.style.display = 'none';
      openBtn.style.display = '';
    }
    setTimeout(function () { if (this.map) this.map.resize(); }.bind(this), 300);
  }

  // -- Export --

  _exportGPX() {
    if (this.waypoints.length < 2 || !this.routeGeometry) return;
    var gpx = '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<gpx version="1.1" creator="VisorUp Route Planner" xmlns="http://www.topografix.com/GPX/1/1">\n' +
      '<metadata><name>VisorUp Route</name><time>' + new Date().toISOString() + '</time></metadata>\n';

    // Via waypoints (not shaping points) for device fidelity
    for (var i = 0; i < this.waypoints.length; i++) {
      var wp = this.waypoints[i];
      if (wp.isShaping) continue;
      gpx += '<wpt lat="' + wp.lat.toFixed(6) + '" lon="' + wp.lng.toFixed(6) + '"><name>' + (wp.name || 'Point ' + (i + 1)).replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</name></wpt>\n';
    }

    // Track from route geometry with all shaping points embedded
    gpx += '<trk><name>VisorUp Route</name><trkseg>\n';
    var coords = this.routeGeometry.coordinates;
    for (var j = 0; j < coords.length; j++) {
      gpx += '<trkpt lat="' + coords[j][1].toFixed(6) + '" lon="' + coords[j][0].toFixed(6) + '"></trkpt>\n';
    }
    gpx += '</trkseg></trk>\n</gpx>';

    this._downloadFile(gpx, 'visorup-route.gpx', 'application/gpx+xml');
  }

  _exportKML() {
    if (this.waypoints.length < 2 || !this.routeGeometry) return;
    var coords = this.routeGeometry.coordinates.map(function (c) { return c[0].toFixed(6) + ',' + c[1].toFixed(6) + ',0'; }).join(' ');
    var kml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<kml xmlns="http://www.opengis.net/kml/2.2">\n<Document>\n<name>VisorUp Route</name>\n';

    for (var i = 0; i < this.waypoints.length; i++) {
      var wp = this.waypoints[i];
      if (wp.isShaping) continue;
      kml += '<Placemark><name>' + (wp.name || 'Point ' + (i + 1)).replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</name>' +
        '<Point><coordinates>' + wp.lng.toFixed(6) + ',' + wp.lat.toFixed(6) + ',0</coordinates></Point></Placemark>\n';
    }

    kml += '<Placemark><name>Route</name><Style><LineStyle><color>ff2d8ad6</color><width>4</width></LineStyle></Style>' +
      '<LineString><tessellate>1</tessellate><coordinates>' + coords + '</coordinates></LineString></Placemark>\n';
    kml += '</Document>\n</kml>';

    this._downloadFile(kml, 'visorup-route.kml', 'application/vnd.google-earth.kml+xml');
  }

  _downloadFile(content, filename, mime) {
    var blob = new Blob([content], { type: mime });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  // -- Utility --

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
