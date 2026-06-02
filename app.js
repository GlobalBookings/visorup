const MARKER_ICONS = {
  ferry: 'fa-ship',
  landmark: 'fa-monument',
  viewpoint: 'fa-binoculars',
  waterfall: 'fa-water',
  road: 'fa-road',
  camp: 'fa-campground',
  wildlife: 'fa-paw',
  fuel: 'fa-gas-pump',
  beach: 'fa-umbrella-beach',
  castle: 'fa-chess-rook',
  distillery: 'fa-flask',
  pub: 'fa-beer-mug-empty',
  bridge: 'fa-bridge',
  fossil: 'fa-bone'
};

const MARKER_SIZES = {
  ferry: 32, landmark: 28, viewpoint: 28, waterfall: 28,
  road: 28, camp: 30, wildlife: 26, fuel: 24,
  beach: 28, castle: 28, distillery: 26, pub: 26, bridge: 30,
  fossil: 28
};

class TripPlanner {
  constructor() {
    this.map = null;
    this.markers = [];
    this.dayRouteLines = {};
    this.ferryLines = {};
    this.activeDay = 0;
    this.calculatedRoutes = {};
    this.routeCalcDone = 0;
  }

  init() {
    this.initMap();
    this.renderAllRoutes();
    this.renderAllMarkers();
    this.buildNav();
    this.showOverview();
    this.buildLegend();
    this.bindSidebarToggle();
    this.startRouteCalculation();
  }

  initMap() {
    this.map = L.map('map', {
      center: [54.5, -3.5],
      zoom: 6,
      zoomControl: false,
      attributionControl: true
    });
    L.control.zoom({ position: 'topright' }).addTo(this.map);

    const dark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd', maxZoom: 19
    });
    const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>', maxZoom: 19
    });
    const topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a>', maxZoom: 17
    });
    dark.addTo(this.map);
    L.control.layers({ 'Dark': dark, 'Street': osm, 'Terrain': topo }, null, { position: 'topright' }).addTo(this.map);
  }

  createMarkerIcon(type) {
    const color = TRIP_DATA.markerColors[type] || '#e8713a';
    const icon = MARKER_ICONS[type] || 'fa-map-pin';
    const size = MARKER_SIZES[type] || 28;
    return L.divIcon({
      className: '',
      html: `<div class="custom-marker" style="width:${size}px;height:${size}px;background:${color}"><i class="fas ${icon}" style="font-size:${size * 0.4}px"></i></div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      popupAnchor: [0, -size / 2 - 4]
    });
  }

  renderAllMarkers() {
    TRIP_DATA.days.forEach((day, di) => {
      day.stops.forEach(stop => {
        const marker = L.marker([stop.lat, stop.lng], { icon: this.createMarkerIcon(stop.type) });
        let html = `<h3>${stop.name}</h3>`;
        html += `<div class="popup-type" style="color:${TRIP_DATA.markerColors[stop.type]}">${stop.type} &middot; Day ${day.day}</div>`;
        html += `<p>${stop.description}</p>`;
        if (stop.url) html += `<a href="${stop.url}" target="_blank"><i class="fas fa-external-link-alt"></i> More info</a> `;
        if (stop.park4night) html += `<a href="${stop.park4night}" target="_blank"><i class="fas fa-campground"></i> Park4Night</a>`;
        marker.bindPopup(html, { maxWidth: 280 });
        marker.addTo(this.map);
        marker._dayIndex = di;
        marker._stopData = stop;
        this.markers.push(marker);
      });
    });
  }

  renderAllRoutes() {
    TRIP_DATA.days.forEach((day, di) => {
      if (day.ferryRoute) {
        this.ferryLines[di] = L.polyline(day.ferryRoute, {
          color: TRIP_DATA.dayColors[di], weight: 3, opacity: 0.6, dashArray: '8, 8'
        }).addTo(this.map);
      }
      if (day.route) {
        const line = L.polyline(day.route, {
          color: TRIP_DATA.dayColors[di], weight: 3, opacity: 0.4, dashArray: '6, 4'
        }).addTo(this.map);
        line._dayIndex = di;
        line._isRough = true;
        this.dayRouteLines[di] = line;
      }
    });
  }

  // ── OSRM Route Calculation ──

  async startRouteCalculation() {
    for (let i = 0; i < TRIP_DATA.days.length; i++) {
      try {
        const result = await this.calculateDayRoute(i);
        if (result) {
          this.calculatedRoutes[i] = result;
          this.replaceRouteOnMap(i, result.coords);
        }
      } catch (e) {
        console.warn(`Route calc failed day ${i + 1}:`, e);
      }
      this.routeCalcDone = i + 1;
      this.updateProgressUI();
      if (i < TRIP_DATA.days.length - 1) await this.sleep(300);
    }
    this.onRoutesReady();
  }

  async calculateDayRoute(dayIndex) {
    const day = TRIP_DATA.days[dayIndex];
    if (!day.route || day.route.length < 2) return null;

    if (day.ferryRoute) {
      const split = this.findFerrySplit(day.route, day.ferryRoute);
      if (split) {
        const [r1, r2] = await Promise.all([
          this.fetchOSRM(split.before),
          this.fetchOSRM(split.after)
        ]);
        if (r1 && r2) return { coords: [...r1.coords, ...r2.coords], distance: r1.distance + r2.distance, duration: r1.duration + r2.duration };
        return r1 || r2;
      }
    }
    return this.fetchOSRM(day.route);
  }

  findFerrySplit(route, ferryRoute) {
    const fS = ferryRoute[0], fE = ferryRoute[ferryRoute.length - 1];
    let si = -1, ei = -1, mds = 99, mde = 99;
    for (let i = 0; i < route.length; i++) {
      const ds = Math.abs(route[i][0] - fS[0]) + Math.abs(route[i][1] - fS[1]);
      const de = Math.abs(route[i][0] - fE[0]) + Math.abs(route[i][1] - fE[1]);
      if (ds < mds) { mds = ds; si = i; }
      if (de < mde) { mde = de; ei = i; }
    }
    if (si >= 0 && ei >= 0 && si < ei && si > 0 && mds < 0.05 && mde < 0.15) {
      return { before: route.slice(0, si + 1), after: route.slice(ei) };
    }
    return null;
  }

  async fetchOSRM(waypoints) {
    if (waypoints.length < 2) return null;
    const coords = waypoints.map(p => `${p[1].toFixed(6)},${p[0].toFixed(6)}`).join(';');
    const resp = await fetch(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`);
    if (!resp.ok) return null;
    const data = await resp.json();
    if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
      const r = data.routes[0];
      return {
        coords: r.geometry.coordinates.map(c => [c[1], c[0]]),
        distance: r.distance,
        duration: r.duration
      };
    }
    return null;
  }

  replaceRouteOnMap(dayIndex, coords) {
    const old = this.dayRouteLines[dayIndex];
    if (old) this.map.removeLayer(old);
    const poly = L.polyline(coords, {
      color: TRIP_DATA.dayColors[dayIndex], weight: 4, opacity: 0.85
    }).addTo(this.map);
    poly._dayIndex = dayIndex;
    poly._isRough = false;
    this.dayRouteLines[dayIndex] = poly;
    if (this.activeDay > 0) this.highlightDay(this.activeDay - 1);
  }

  updateProgressUI() {
    const el = document.getElementById('routeProgress');
    if (!el) return;
    const pct = (this.routeCalcDone / TRIP_DATA.days.length) * 100;
    el.querySelector('.rp-bar').style.width = `${pct}%`;
    el.querySelector('.rp-text').textContent = pct >= 100
      ? 'All routes calculated — GPX ready'
      : `Calculating road routes... ${this.routeCalcDone}/${TRIP_DATA.days.length}`;
    if (pct >= 100) el.classList.add('done');
  }

  onRoutesReady() {
    if (this.activeDay === 0) this.showOverview();
    else if (this.activeDay === 'info') this.showInfo();
    else this.showDay(this.activeDay - 1);
  }

  // ── GPX Export ──

  esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  gpxHeader(name, desc) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="VisorUp — visorup.co.uk"
  xmlns="http://www.topografix.com/GPX/1/1"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <name>${this.esc(name)}</name>
    <desc>${this.esc(desc)}</desc>
  </metadata>`;
  }

  gpxTrack(name, coords) {
    let s = `\n  <trk>\n    <name>${this.esc(name)}</name>\n    <trkseg>`;
    coords.forEach(c => { s += `\n      <trkpt lat="${c[0].toFixed(7)}" lon="${c[1].toFixed(7)}"></trkpt>`; });
    s += `\n    </trkseg>\n  </trk>`;
    return s;
  }

  gpxWaypoints(stops, prefix) {
    return stops.map(s =>
      `\n  <wpt lat="${s.lat}" lon="${s.lng}">\n    <name>${this.esc((prefix || '') + s.name)}</name>\n    <desc>${this.esc(s.description)}</desc>\n    <type>${s.type}</type>\n  </wpt>`
    ).join('');
  }

  generateDayGPX(di) {
    const r = this.calculatedRoutes[di];
    if (!r) return null;
    const d = TRIP_DATA.days[di];
    return this.gpxHeader(`Day ${d.day} - ${d.title}`, d.summary)
      + this.gpxTrack(`Day ${d.day} - ${d.title}`, r.coords)
      + this.gpxWaypoints(d.stops)
      + '\n</gpx>';
  }

  generateFullGPX() {
    let gpx = this.gpxHeader(TRIP_DATA.meta.title, `${TRIP_DATA.meta.totalDays}-day tour — ${TRIP_DATA.meta.totalDistance}`);
    TRIP_DATA.days.forEach((d, di) => {
      const r = this.calculatedRoutes[di];
      if (!r) return;
      gpx += this.gpxTrack(`Day ${d.day} - ${d.title}`, r.coords);
      gpx += this.gpxWaypoints(d.stops, `D${d.day}: `);
    });
    gpx += '\n</gpx>';
    return gpx;
  }

  downloadFile(content, filename) {
    const blob = new Blob([content], { type: 'application/gpx+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  downloadDayGPX(di) {
    const gpx = this.generateDayGPX(di);
    if (!gpx) return alert('Route still calculating — try again in a moment.');
    const slug = TRIP_DATA.days[di].title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    this.downloadFile(gpx, `day-${TRIP_DATA.days[di].day}-${slug}.gpx`);
  }

  downloadAllGPX() {
    const done = Object.keys(this.calculatedRoutes).length;
    if (done < TRIP_DATA.days.length) return alert(`Routes still calculating (${done}/${TRIP_DATA.days.length}). Try again shortly.`);
    const slug = TRIP_DATA.meta.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    this.downloadFile(this.generateFullGPX(), `${slug}-full-tour.gpx`);
  }

  sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  // ── Distance Formatting ──

  fmtMiles(m) { return Math.round(m / 1609.34); }
  fmtKm(m) { return Math.round(m / 1000); }
  fmtTime(s) { const h = Math.floor(s / 3600), m = Math.round((s % 3600) / 60); return h > 0 ? `${h}h ${m}m` : `${m}m`; }

  // ── Highlighting ──

  highlightDay(dayIndex) {
    this.markers.forEach(m => {
      const el = m.getElement();
      if (!el) return;
      const inner = el.querySelector('.custom-marker');
      if (!inner) return;
      if (dayIndex === null) inner.classList.remove('dimmed');
      else inner.classList.toggle('dimmed', m._dayIndex !== dayIndex);
    });

    Object.entries(this.dayRouteLines).forEach(([di, line]) => {
      di = parseInt(di);
      if (dayIndex === null) {
        line.setStyle({ opacity: line._isRough ? 0.4 : 0.8, weight: line._isRough ? 3 : 4 });
      } else {
        const on = di === dayIndex;
        line.setStyle({
          opacity: on ? (line._isRough ? 0.6 : 1) : 0.1,
          weight: on ? (line._isRough ? 4 : 5) : 2
        });
      }
    });

    Object.entries(this.ferryLines).forEach(([di, line]) => {
      di = parseInt(di);
      line.setStyle({ opacity: (dayIndex === null || di === dayIndex) ? 0.6 : 0.08 });
    });
  }

  // ── Navigation ──

  buildNav() {
    const nav = document.getElementById('dayNav');
    const ob = document.createElement('button');
    ob.textContent = 'Overview'; ob.dataset.day = '0';
    ob.addEventListener('click', () => this.showOverview());
    nav.appendChild(ob);

    TRIP_DATA.days.forEach(day => {
      const b = document.createElement('button');
      b.textContent = `D${day.day}`; b.dataset.day = day.day;
      b.addEventListener('click', () => this.showDay(day.day - 1));
      nav.appendChild(b);
    });

    const ib = document.createElement('button');
    ib.textContent = 'Info'; ib.dataset.day = 'info';
    ib.addEventListener('click', () => this.showInfo());
    nav.appendChild(ib);
  }

  setActiveNav(id) {
    document.querySelectorAll('.day-nav button').forEach(b => {
      b.classList.remove('active');
      if (b.dataset.day === String(id)) b.classList.add('active');
    });
  }

  // ── Sidebar Panels ──

  showOverview() {
    this.activeDay = 0;
    this.setActiveNav(0);
    this.highlightDay(null);
    this.map.flyTo([54.5, -3.5], 6, { duration: 0.8 });
    const c = document.getElementById('sidebarContent');
    const meta = TRIP_DATA.meta;

    const totalMiles = Object.values(this.calculatedRoutes).reduce((s, r) => s + r.distance, 0);
    const displayMiles = totalMiles > 0 ? `${this.fmtMiles(totalMiles)}` : '~1,880';
    const doneCount = Object.keys(this.calculatedRoutes).length;

    let html = `
      <div class="route-progress-wrap" id="routeProgress">
        <div class="rp-bar-track"><div class="rp-bar" style="width:${(this.routeCalcDone / TRIP_DATA.days.length) * 100}%"></div></div>
        <div class="rp-text">${this.routeCalcDone >= TRIP_DATA.days.length ? 'All routes calculated — GPX ready' : `Calculating road routes... ${this.routeCalcDone}/${TRIP_DATA.days.length}`}</div>
      </div>
      <div class="overview-stats">
        <div class="stat-card"><div class="stat-value">${meta.totalDays}</div><div class="stat-label">Days Riding</div></div>
        <div class="stat-card"><div class="stat-value">${displayMiles}</div><div class="stat-label">Total Miles</div></div>
        <div class="stat-card"><div class="stat-value">${TRIP_DATA.topRoads.filter(r => r.rating === 5).length}</div><div class="stat-label">5-Star Roads</div></div>
        <div class="stat-card"><div class="stat-value">${TRIP_DATA.days.reduce((n, d) => n + d.stops.length, 0)}</div><div class="stat-label">Points of Interest</div></div>
      </div>`;

    if (doneCount === TRIP_DATA.days.length) {
      html += `<button class="gpx-btn full-width" onclick="planner.downloadAllGPX()"><i class="fas fa-download"></i> Download Full Trip GPX (${this.fmtMiles(totalMiles)} miles)</button>`;
    }

    html += `
      <div class="ferry-card">
        <h3><i class="fas fa-ship"></i> Getting There</h3>
        <p><strong>${meta.ferry.route}</strong> (${meta.ferry.operator})<br>
        ${meta.ferry.duration}<br>${meta.ferry.note}<br>
        <a href="${meta.ferry.url}" target="_blank">Book ferry &rarr;</a></p>
      </div>
      <div class="section-title">Daily Route</div>`;

    TRIP_DATA.days.forEach((day, di) => {
      const r = this.calculatedRoutes[di];
      const distStr = r ? `${this.fmtMiles(r.distance)} mi` : day.distance;
      const durStr = r ? this.fmtTime(r.duration) + ' riding' : day.duration;
      html += `
        <div class="stop-card" onclick="planner.showDay(${di})" style="border-left:3px solid ${TRIP_DATA.dayColors[di]}">
          <div class="stop-header">
            <div class="stop-icon" style="background:${TRIP_DATA.dayColors[di]};width:24px;height:24px;font-size:11px;font-weight:700">${day.day}</div>
            <div>
              <div class="stop-name">${day.title}</div>
              <div style="font-size:11px;color:var(--text-muted)">${distStr} &middot; ${durStr}${r ? ' <span class="route-badge">GPX</span>' : ''}</div>
            </div>
          </div>
        </div>`;
    });

    html += `<div class="section-title">Top Roads (Twisty Rating)</div><div class="top-roads-list">`;
    TRIP_DATA.topRoads.forEach(road => {
      const stars = '<i class="fas fa-star"></i>'.repeat(road.rating) + '<i class="far fa-star"></i>'.repeat(5 - road.rating);
      html += `
        <div class="road-item" onclick="planner.showDay(${road.day - 1})">
          <div><div class="road-name">${road.name}</div><div class="road-region">${road.region} <span class="road-day">Day ${road.day}</span></div></div>
          <div class="stars">${stars}</div>
        </div>`;
    });
    html += '</div>';
    c.innerHTML = html;
  }

  showDay(dayIndex) {
    this.activeDay = dayIndex + 1;
    const day = TRIP_DATA.days[dayIndex];
    this.setActiveNav(day.day);
    this.highlightDay(dayIndex);
    this.map.flyTo(day.center, day.zoom, { duration: 0.8 });
    const c = document.getElementById('sidebarContent');
    const r = this.calculatedRoutes[dayIndex];

    let html = `
      <div class="day-header">
        <div class="day-label" style="color:${TRIP_DATA.dayColors[dayIndex]}">Day ${day.day}</div>
        <h2>${day.title}</h2>
        <div class="day-meta">
          <span><i class="fas fa-road"></i> ${r ? this.fmtMiles(r.distance) + ' miles' : day.distance}</span>
          <span><i class="fas fa-clock"></i> ${r ? this.fmtTime(r.duration) + ' riding' : day.duration}</span>
        </div>
        ${r ? `<button class="gpx-btn" onclick="planner.downloadDayGPX(${dayIndex})"><i class="fas fa-download"></i> Download Day ${day.day} GPX</button>` : '<div class="gpx-pending"><i class="fas fa-spinner fa-spin"></i> Calculating road route...</div>'}
      </div>
      <div class="day-summary">${day.summary}</div>`;

    if (day.roads.length > 0) {
      html += `<div class="section-title"><i class="fas fa-road"></i> Key Roads</div>`;
      day.roads.forEach(road => {
        const stars = '<i class="fas fa-star"></i>'.repeat(road.rating) + '<i class="far fa-star"></i>'.repeat(5 - road.rating);
        html += `<div class="road-card"><div class="road-header"><span class="road-title">${road.name}</span><span class="stars">${stars}</span></div><div class="road-desc">${road.description}</div></div>`;
      });
    }

    const groupOrder = [
      { type: 'fossil', label: 'Fossils & Dinosaurs' },
      { type: 'bridge', label: 'Bridges' },
      { type: 'viewpoint', label: 'Viewpoints' },
      { type: 'waterfall', label: 'Waterfalls' },
      { type: 'castle', label: 'Castles' },
      { type: 'landmark', label: 'Landmarks' },
      { type: 'beach', label: 'Beaches' },
      { type: 'wildlife', label: 'Wildlife' },
      { type: 'distillery', label: 'Distilleries' },
      { type: 'pub', label: 'Pubs & Inns' },
      { type: 'camp', label: 'Camping' },
      { type: 'road', label: 'Road Highlights' },
      { type: 'ferry', label: 'Ferry' }
    ];

    groupOrder.forEach(group => {
      const stops = day.stops.filter(s => s.type === group.type);
      if (!stops.length) return;
      html += `<div class="section-title"><i class="fas ${MARKER_ICONS[group.type]}"></i> ${group.label}</div>`;
      stops.forEach(stop => {
        const color = TRIP_DATA.markerColors[stop.type];
        let links = '';
        if (stop.url) links += `<a class="stop-link" href="${stop.url}" target="_blank"><i class="fas fa-external-link-alt"></i> Website</a>`;
        if (stop.park4night) links += `<a class="stop-link" href="${stop.park4night}" target="_blank" style="color:var(--green);background:rgba(39,174,96,0.1)"><i class="fas fa-campground"></i> Park4Night</a>`;
        html += `
          <div class="stop-card" onclick="planner.panToStop(${stop.lat},${stop.lng})">
            <div class="stop-header">
              <div class="stop-icon" style="background:${color}"><i class="fas ${MARKER_ICONS[stop.type]}"></i></div>
              <div class="stop-name">${stop.name}</div>
            </div>
            <div class="stop-desc">${stop.description}</div>
            ${links ? `<div class="stop-links">${links}</div>` : ''}
          </div>`;
      });
    });

    if (day.tips) {
      html += `<div class="tips-box"><div class="tips-title"><i class="fas fa-lightbulb"></i> Biker's Tips</div><div class="tips-text">${day.tips}</div></div>`;
    }

    c.innerHTML = html;
    c.scrollTop = 0;
  }

  showInfo() {
    this.activeDay = 'info';
    this.setActiveNav('info');
    this.highlightDay(null);
    const c = document.getElementById('sidebarContent');
    const meta = TRIP_DATA.meta;

    const totalMiles = Object.values(this.calculatedRoutes).reduce((s, r) => s + r.distance, 0);
    const doneCount = Object.keys(this.calculatedRoutes).length;

    let html = `<div class="day-header"><h2>Trip Info</h2></div>`;

    if (doneCount === TRIP_DATA.days.length) {
      html += `<button class="gpx-btn full-width" onclick="planner.downloadAllGPX()" style="margin-bottom:16px"><i class="fas fa-download"></i> Download Full Trip GPX (${this.fmtMiles(totalMiles)} miles)</button>`;
    }

    html += `
      <div class="section-title"><i class="fas fa-motorcycle"></i> The Bikes</div>
      <div class="overview-stats">
        ${meta.bikes.map(b => `<div class="stat-card"><div class="stat-value" style="font-size:14px">${b.name}</div><div class="stat-label">Tank: ${b.tank} &middot; Range: ${b.range}</div></div>`).join('')}
      </div>
      <div class="fuel-card"><h3><i class="fas fa-gas-pump"></i> Fuel Strategy</h3><p>${meta.fuelStrategy}</p></div>
      <div class="section-title"><i class="fas fa-suitcase"></i> Packing Essentials</div>
      <ul class="packing-list">${meta.packingEssentials.map(i => `<li><i class="fas fa-check"></i> ${i}</li>`).join('')}</ul>

      <div class="section-title" style="margin-top:20px"><i class="fas fa-download"></i> GPX Downloads by Day</div>`;

    TRIP_DATA.days.forEach((day, di) => {
      const r = this.calculatedRoutes[di];
      html += `<div class="road-item" style="cursor:${r ? 'pointer' : 'default'};opacity:${r ? 1 : 0.4}" onclick="${r ? `planner.downloadDayGPX(${di})` : ''}">
        <div><div class="road-name">Day ${day.day}: ${day.title}</div><div class="road-region">${r ? this.fmtMiles(r.distance) + ' mi &middot; ' + this.fmtTime(r.duration) : 'Calculating...'}</div></div>
        <div>${r ? '<i class="fas fa-download" style="color:var(--accent)"></i>' : '<i class="fas fa-spinner fa-spin" style="color:var(--text-dim)"></i>'}</div>
      </div>`;
    });

    html += `
      <div class="tips-box" style="margin-top:20px">
        <div class="tips-title"><i class="fas fa-route"></i> Return Options</div>
        <div class="tips-text">
          <strong>Option 1:</strong> Ride south via A82/M6/M5 to Poole for the Guernsey ferry (~600mi, 2 days).<br><br>
          <strong>Option 2:</strong> Caledonian Sleeper train from Fort William to London with bike. Book early.<br><br>
          <strong>Option 3:</strong> Extend — Outer Hebrides, Orkney, or a different return route through the Cairngorms.
        </div>
      </div>
      <div class="tips-box" style="margin-top:12px">
        <div class="tips-title"><i class="fas fa-exclamation-triangle"></i> Emergency Contacts</div>
        <div class="tips-text">
          <strong>Emergency:</strong> 999 / 112<br>
          <strong>Non-emergency police:</strong> 101<br>
          <strong>Breakdown (AA):</strong> 0800 88 77 66<br>
          <strong>Breakdown (RAC):</strong> 0330 159 1111<br>
          <strong>NHS non-emergency:</strong> 111
        </div>
      </div>`;

    c.innerHTML = html;
    c.scrollTop = 0;
  }

  panToStop(lat, lng) {
    this.map.flyTo([lat, lng], 14, { duration: 0.6 });
    this.markers.forEach(m => {
      if (m._stopData && m._stopData.lat === lat && m._stopData.lng === lng) m.openPopup();
    });
  }

  buildLegend() {
    const legend = document.createElement('div');
    legend.className = 'map-legend';
    legend.innerHTML = `
      <h4>Map Legend</h4>
      ${Object.entries(TRIP_DATA.markerColors).map(([t, c]) =>
        `<div class="legend-item"><div class="legend-dot" style="background:${c}"></div>${t.charAt(0).toUpperCase() + t.slice(1)}</div>`
      ).join('')}`;
    document.querySelector('.map-container').appendChild(legend);
  }

  bindSidebarToggle() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const menuBtn = document.getElementById('plannerMenuBtn');
    const closeSidebar = () => {
      if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
        overlay.classList.remove('visible');
      }
    };
    const openSidebar = () => {
      sidebar.classList.add('open');
      overlay.classList.add('visible');
    };
    if (menuBtn) menuBtn.addEventListener('click', () => {
      sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
    });
    if (overlay) overlay.addEventListener('click', closeSidebar);
    this.map.on('click', closeSidebar);
  }
}

let planner;
function initPlanner() {
  if (!planner) {
    planner = new TripPlanner();
    planner.init();
  } else {
    planner.map.invalidateSize();
  }
}
