// trip-builder.js — Trip Builder Wizard and Route Generation Engine

class TripBuilder {
  constructor(sidebarEl, map) {
    this.sidebarEl = sidebarEl;
    this.map = map;
    this.currentStep = 1;
    this.config = {
      startPoint: null,
      endPoint: null,
      days: 7,
      pace: 'moderate',
      restDayEvery: 0,
      bikes: [],
      roadSurface: 'paved',
      interests: [],
      regions: [],
      tripName: ''
    };

    // Store global reference for onclick handlers (matches planner pattern in app.js)
    window._tripBuilder = this;
  }

  // ── Start Point Presets ──

  static get START_PRESETS() {
    return [
      { name: 'Guernsey (St Peter Port)', lat: 49.4566, lng: -2.5356 },
      { name: 'Jersey (St Helier)', lat: 49.1805, lng: -2.1120 },
      { name: 'London', lat: 51.5074, lng: -0.1278 },
      { name: 'Bristol', lat: 51.4545, lng: -2.5879 },
      { name: 'Birmingham', lat: 52.4862, lng: -1.8904 },
      { name: 'Manchester', lat: 53.4808, lng: -2.2426 },
      { name: 'Edinburgh', lat: 55.9533, lng: -3.1883 },
      { name: 'Glasgow', lat: 55.8642, lng: -4.2518 },
      { name: 'Cardiff', lat: 51.4816, lng: -3.1791 },
      { name: 'Newcastle', lat: 54.9783, lng: -1.6178 },
      { name: 'Inverness', lat: 57.4778, lng: -4.2247 },
      { name: 'Fort William', lat: 56.8198, lng: -5.1052 },
      { name: 'Poole', lat: 50.7109, lng: -1.9882 },
      { name: 'Portsmouth', lat: 50.7984, lng: -1.0984 }
    ];
  }

  // ── Helpers ──

  haversine(lat1, lng1, lat2, lng2) {
    const R = 3959;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  generateDayColors(n) {
    const colors = [];
    for (let i = 0; i < n; i++) {
      const hue = (i * 360 / n) % 360;
      colors.push(`hsl(${hue}, 70%, 55%)`);
    }
    return colors;
  }

  bearing(lat1, lng1, lat2, lng2) {
    const toRad = (d) => d * Math.PI / 180;
    const dLng = toRad(lng2 - lng1);
    const y = Math.sin(dLng) * Math.cos(toRad(lat2));
    const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
      Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLng);
    const brng = Math.atan2(y, x) * 180 / Math.PI;
    return (brng + 360) % 360;
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ── Database Access ──

  getDB() {
    return typeof POI_DATABASE !== 'undefined' ? POI_DATABASE : { pois: [], regions: [], ferries: [], bikePresets: [] };
  }

  getMarkerIcons() {
    return typeof MARKER_ICONS !== 'undefined' ? MARKER_ICONS : {
      ferry: 'fa-ship', landmark: 'fa-monument', viewpoint: 'fa-binoculars',
      waterfall: 'fa-water', road: 'fa-road', camp: 'fa-campground',
      wildlife: 'fa-paw', fuel: 'fa-gas-pump', beach: 'fa-umbrella-beach',
      castle: 'fa-chess-rook', distillery: 'fa-flask', pub: 'fa-beer-mug-empty',
      bridge: 'fa-bridge', fossil: 'fa-bone'
    };
  }

  // ── Entry Point ──

  show() {
    this.currentStep = 1;
    this.config = {
      startPoint: null,
      endPoint: null,
      days: 7,
      pace: 'moderate',
      restDayEvery: 0,
      bikes: [],
      roadSurface: 'paved',
      interests: [],
      regions: [],
      tripName: ''
    };
    this.renderStep(1);
  }

  // ── Step Dispatcher ──

  renderStep(n) {
    this.currentStep = n;
    switch (n) {
      case 1: this.renderStep1(); break;
      case 2: this.renderStep2(); break;
      case 3: this.renderStep3(); break;
      case 4: this.renderStep4(); break;
      case 5: this.renderStep5(); break;
      case 6: this.renderStep6(); break;
      default: this.renderStep1();
    }
  }

  nextStep() {
    if (!this.validateCurrentStep()) return;
    this.collectCurrentStep();
    if (this.currentStep < 6) {
      this.renderStep(this.currentStep + 1);
    }
  }

  prevStep() {
    this.collectCurrentStep();
    if (this.currentStep > 1) {
      this.renderStep(this.currentStep - 1);
    }
  }

  // ── Validation ──

  validateCurrentStep() {
    switch (this.currentStep) {
      case 1: {
        const sel = this.sidebarEl.querySelector('#builder-start');
        if (!sel || sel.value === '') {
          this.showValidationError('Please select a start point.');
          return false;
        }
        return true;
      }
      case 2:
      case 3:
      case 4:
      case 5:
        return true;
      case 6:
        return true;
      default:
        return true;
    }
  }

  showValidationError(msg) {
    const errEl = this.sidebarEl.querySelector('#builder-error');
    if (errEl) {
      errEl.textContent = msg;
      errEl.style.display = 'block';
      setTimeout(() => { errEl.style.display = 'none'; }, 3000);
    }
  }

  // ── Data Collection ──

  collectCurrentStep() {
    switch (this.currentStep) {
      case 1: {
        const startSel = this.sidebarEl.querySelector('#builder-start');
        const endSel = this.sidebarEl.querySelector('#builder-end');
        const loopChk = this.sidebarEl.querySelector('#builder-loop');

        if (startSel && startSel.value !== '') {
          const idx = parseInt(startSel.value);
          this.config.startPoint = TripBuilder.START_PRESETS[idx];
        }

        if (loopChk && loopChk.checked) {
          this.config.endPoint = null;
        } else if (endSel && endSel.value !== '') {
          const idx = parseInt(endSel.value);
          this.config.endPoint = TripBuilder.START_PRESETS[idx];
        } else {
          this.config.endPoint = null;
        }
        break;
      }
      case 2: {
        const slider = this.sidebarEl.querySelector('#builder-days');
        if (slider) this.config.days = parseInt(slider.value);

        const paceRadio = this.sidebarEl.querySelector('input[name="builder-pace"]:checked');
        if (paceRadio) this.config.pace = paceRadio.value;

        const restSel = this.sidebarEl.querySelector('#builder-rest');
        if (restSel) this.config.restDayEvery = parseInt(restSel.value);
        break;
      }
      case 3: {
        const surfaceRadio = this.sidebarEl.querySelector('input[name="builder-surface"]:checked');
        if (surfaceRadio) this.config.roadSurface = surfaceRadio.value;
        // bikes collected via addBike/removeBike
        break;
      }
      case 4:
        // interests collected via toggle handlers
        break;
      case 5:
        // regions collected via toggle handlers
        break;
      case 6: {
        const nameInput = this.sidebarEl.querySelector('#builder-trip-name');
        if (nameInput) this.config.tripName = nameInput.value.trim();
        break;
      }
    }
  }

  // ── UI Components ──

  renderProgressIndicator(step) {
    const stepLabels = [
      'Start & End', 'Duration & Pace', 'Bike Profile',
      'Interests', 'Regions', 'Review & Generate'
    ];
    let dots = '';
    for (let i = 1; i <= 6; i++) {
      const active = i === step ? 'background:var(--accent);border-color:var(--accent);' : '';
      const completed = i < step ? 'background:var(--green);border-color:var(--green);' : '';
      dots += `<span style="width:10px;height:10px;border-radius:50%;border:2px solid var(--border);display:inline-block;margin:0 3px;transition:all 0.2s;${active}${completed}"></span>`;
    }
    return `
      <div style="text-align:center;padding:16px 0 12px;border-bottom:1px solid var(--border);margin:-16px -16px 16px -16px;padding:16px;">
        <div style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--text-dim);font-weight:700;margin-bottom:4px;">Step ${step} of 6</div>
        <div style="font-size:13px;font-weight:600;color:var(--text);margin-bottom:8px;">${this.escapeHtml(stepLabels[step - 1])}</div>
        <div>${dots}</div>
      </div>`;
  }

  renderNavButtons(showBack, nextLabel) {
    const backBtn = showBack
      ? `<button onclick="window._tripBuilder.prevStep()" style="padding:10px 20px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);color:var(--text-muted);font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;transition:all 0.2s;"><i class="fas fa-arrow-left" style="margin-right:6px;"></i>Back</button>`
      : '<div></div>';
    const nextBtn = `<button onclick="window._tripBuilder.nextStep()" style="padding:10px 24px;background:var(--accent);border:none;border-radius:var(--radius);color:#fff;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;transition:all 0.2s;">${nextLabel || 'Next'}<i class="fas fa-arrow-right" style="margin-left:6px;"></i></button>`;
    return `
      <div id="builder-error" style="display:none;padding:8px 12px;background:rgba(231,76,60,0.12);border:1px solid rgba(231,76,60,0.3);border-radius:var(--radius);color:var(--red);font-size:12px;margin-top:12px;text-align:center;"></div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:20px;padding-top:16px;border-top:1px solid var(--border);">
        ${backBtn}
        ${nextBtn}
      </div>`;
  }

  // ── Step 1: Start & End ──

  renderStep1() {
    const presets = TripBuilder.START_PRESETS;
    const startIdx = this.config.startPoint
      ? presets.findIndex(p => p.lat === this.config.startPoint.lat && p.lng === this.config.startPoint.lng)
      : -1;
    const endIdx = this.config.endPoint
      ? presets.findIndex(p => p.lat === this.config.endPoint.lat && p.lng === this.config.endPoint.lng)
      : -1;
    const isLoop = !this.config.endPoint;

    let startOptions = '<option value="">— Select start point —</option>';
    let endOptions = '<option value="">— Select end point —</option>';
    presets.forEach((p, i) => {
      const sSel = i === startIdx ? ' selected' : '';
      const eSel = i === endIdx ? ' selected' : '';
      startOptions += `<option value="${i}"${sSel}>${this.escapeHtml(p.name)}</option>`;
      endOptions += `<option value="${i}"${eSel}>${this.escapeHtml(p.name)}</option>`;
    });

    const selectStyle = 'width:100%;padding:10px 12px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);color:var(--text);font-size:13px;font-family:inherit;appearance:auto;cursor:pointer;';

    let html = this.renderProgressIndicator(1);

    html += `
      <div class="section-title"><i class="fas fa-map-marker-alt" style="margin-right:6px;"></i> Start Location</div>
      <div class="stop-card" style="cursor:default;">
        <select id="builder-start" style="${selectStyle}" onchange="window._tripBuilder.onStartChange(this.value)">
          ${startOptions}
        </select>
      </div>

      <div style="margin:16px 0;">
        <label style="display:flex;align-items:center;gap:10px;cursor:pointer;font-size:13px;color:var(--text-muted);">
          <input type="checkbox" id="builder-loop" ${isLoop ? 'checked' : ''} onchange="window._tripBuilder.onLoopChange(this.checked)" style="width:18px;height:18px;accent-color:var(--accent);cursor:pointer;">
          <span><i class="fas fa-sync-alt" style="margin-right:6px;color:var(--accent);"></i>Loop back to start</span>
        </label>
      </div>

      <div id="builder-end-wrap" style="${isLoop ? 'opacity:0.4;pointer-events:none;' : ''}">
        <div class="section-title"><i class="fas fa-flag-checkered" style="margin-right:6px;"></i> End Location</div>
        <div class="stop-card" style="cursor:default;">
          <select id="builder-end" style="${selectStyle}">
            ${endOptions}
          </select>
        </div>
      </div>`;

    // Preview card
    if (this.config.startPoint) {
      html += `
        <div class="tips-box" style="margin-top:16px;">
          <div class="tips-title"><i class="fas fa-route"></i> Route Preview</div>
          <div class="tips-text">
            <strong>From:</strong> ${this.escapeHtml(this.config.startPoint.name)}<br>
            <strong>To:</strong> ${isLoop ? this.escapeHtml(this.config.startPoint.name) + ' (loop)' : (this.config.endPoint ? this.escapeHtml(this.config.endPoint.name) : 'Not set')}
          </div>
        </div>`;
    }

    html += this.renderNavButtons(false, 'Next');
    this.sidebarEl.innerHTML = html;
    this.sidebarEl.scrollTop = 0;
  }

  onStartChange(value) {
    if (value !== '') {
      const preset = TripBuilder.START_PRESETS[parseInt(value)];
      this.config.startPoint = preset;
      if (this.map) {
        this.map.flyTo([preset.lat, preset.lng], 8, { duration: 0.6 });
      }
    } else {
      this.config.startPoint = null;
    }
  }

  onLoopChange(checked) {
    const endWrap = this.sidebarEl.querySelector('#builder-end-wrap');
    if (endWrap) {
      endWrap.style.opacity = checked ? '0.4' : '1';
      endWrap.style.pointerEvents = checked ? 'none' : 'auto';
    }
    if (checked) {
      this.config.endPoint = null;
    }
  }

  // ── Step 2: Duration & Pace ──

  renderStep2() {
    const { days, pace, restDayEvery } = this.config;

    const paceOptions = [
      { value: 'relaxed', label: 'Relaxed', desc: '~80 miles/day — lots of stops, short rides', icon: 'fa-couch' },
      { value: 'moderate', label: 'Moderate', desc: '~130 miles/day — balanced riding and exploring', icon: 'fa-road' },
      { value: 'aggressive', label: 'Aggressive', desc: '~180 miles/day — big miles, less stops', icon: 'fa-bolt' }
    ];

    let html = this.renderProgressIndicator(2);

    html += `
      <div class="section-title"><i class="fas fa-calendar-alt" style="margin-right:6px;"></i> Trip Duration</div>
      <div class="stop-card" style="cursor:default;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <span style="font-size:13px;font-weight:600;color:var(--text);">Days</span>
          <span id="builder-days-value" style="font-size:18px;font-weight:700;color:var(--accent);">${days}</span>
        </div>
        <input type="range" id="builder-days" class="trip-slider" min="3" max="21" value="${days}"
          oninput="document.getElementById('builder-days-value').textContent=this.value"
          style="width:100%;height:6px;appearance:none;background:var(--border);border-radius:3px;outline:none;cursor:pointer;accent-color:var(--accent);">
        <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--text-dim);margin-top:4px;">
          <span>3 days</span><span>21 days</span>
        </div>
      </div>

      <div class="section-title" style="margin-top:20px;"><i class="fas fa-tachometer-alt" style="margin-right:6px;"></i> Riding Pace</div>`;

    paceOptions.forEach(opt => {
      const checked = pace === opt.value ? ' checked' : '';
      const borderColor = pace === opt.value ? 'border-color:var(--accent);' : '';
      html += `
        <label class="stop-card" style="cursor:pointer;display:block;${borderColor}" onclick="this.querySelector('input').checked=true;document.querySelectorAll('[name=builder-pace]').forEach(r=>{r.closest('.stop-card').style.borderColor=(r.checked?'var(--accent)':'var(--border)')});">
          <div style="display:flex;align-items:center;gap:10px;">
            <input type="radio" name="builder-pace" value="${opt.value}"${checked} style="width:16px;height:16px;accent-color:var(--accent);cursor:pointer;">
            <div class="stop-icon" style="background:var(--bg-dark);width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;">
              <i class="fas ${opt.icon}" style="color:var(--accent);font-size:13px;"></i>
            </div>
            <div>
              <div style="font-size:13px;font-weight:600;color:var(--text);">${opt.label}</div>
              <div style="font-size:11px;color:var(--text-muted);">${opt.desc}</div>
            </div>
          </div>
        </label>`;
    });

    html += `
      <div class="section-title" style="margin-top:20px;"><i class="fas fa-bed" style="margin-right:6px;"></i> Rest Days</div>
      <div class="stop-card" style="cursor:default;">
        <div style="display:flex;align-items:center;gap:10px;">
          <select id="builder-rest" style="padding:8px 12px;background:var(--bg-dark);border:1px solid var(--border);border-radius:var(--radius);color:var(--text);font-size:13px;font-family:inherit;cursor:pointer;">
            <option value="0"${restDayEvery === 0 ? ' selected' : ''}>No rest days</option>
            <option value="3"${restDayEvery === 3 ? ' selected' : ''}>Every 3 days</option>
            <option value="4"${restDayEvery === 4 ? ' selected' : ''}>Every 4 days</option>
            <option value="5"${restDayEvery === 5 ? ' selected' : ''}>Every 5 days</option>
          </select>
          <span style="font-size:12px;color:var(--text-muted);">Take a day off to rest and explore on foot</span>
        </div>
      </div>`;

    html += this.renderNavButtons(true, 'Next');
    this.sidebarEl.innerHTML = html;
    this.sidebarEl.scrollTop = 0;
  }

  // ── Step 3: Bike Profile ──

  renderStep3() {
    const db = this.getDB();
    const bikePresets = db.bikePresets || [];
    const { bikes, roadSurface } = this.config;

    let html = this.renderProgressIndicator(3);

    html += `<div class="section-title"><i class="fas fa-motorcycle" style="margin-right:6px;"></i> Bike Selection</div>`;

    if (bikePresets.length > 0) {
      let bikeOptions = '<option value="">— Select a bike preset —</option>';
      bikePresets.forEach((bp, i) => {
        bikeOptions += `<option value="${i}">${this.escapeHtml(bp.name)} ${bp.range ? '(' + this.escapeHtml(bp.range) + ')' : ''}</option>`;
      });
      html += `
        <div class="stop-card" style="cursor:default;">
          <div style="display:flex;gap:8px;align-items:center;">
            <select id="builder-bike-select" style="flex:1;padding:10px 12px;background:var(--bg-dark);border:1px solid var(--border);border-radius:var(--radius);color:var(--text);font-size:13px;font-family:inherit;cursor:pointer;">
              ${bikeOptions}
            </select>
            <button onclick="window._tripBuilder.addBike()" style="padding:10px 14px;background:var(--accent);border:none;border-radius:var(--radius);color:#fff;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;white-space:nowrap;">
              <i class="fas fa-plus" style="margin-right:4px;"></i>Add
            </button>
          </div>
        </div>`;
    } else {
      html += `
        <div class="stop-card" style="cursor:default;">
          <div style="display:flex;gap:8px;align-items:center;">
            <input type="text" id="builder-bike-custom" placeholder="Enter bike name (e.g. Suzuki GSX-R1000)" style="flex:1;padding:10px 12px;background:var(--bg-dark);border:1px solid var(--border);border-radius:var(--radius);color:var(--text);font-size:13px;font-family:inherit;">
            <button onclick="window._tripBuilder.addCustomBike()" style="padding:10px 14px;background:var(--accent);border:none;border-radius:var(--radius);color:#fff;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;white-space:nowrap;">
              <i class="fas fa-plus" style="margin-right:4px;"></i>Add
            </button>
          </div>
        </div>`;
    }

    // Added bikes list
    html += '<div id="builder-bikes-list">';
    html += this.renderBikesList();
    html += '</div>';

    // Road surface
    const surfaceOptions = [
      { value: 'paved', label: 'Paved Only', desc: 'Stick to tarmac roads', icon: 'fa-road' },
      { value: 'single-track-ok', label: 'Single-Track OK', desc: 'Include narrow single-track roads', icon: 'fa-compress-arrows-alt' },
      { value: 'gravel-ok', label: 'Gravel OK', desc: 'Include gravel and unsealed roads', icon: 'fa-mountain' }
    ];

    html += `<div class="section-title" style="margin-top:20px;"><i class="fas fa-road" style="margin-right:6px;"></i> Road Surface Preference</div>`;

    surfaceOptions.forEach(opt => {
      const checked = roadSurface === opt.value ? ' checked' : '';
      const borderColor = roadSurface === opt.value ? 'border-color:var(--accent);' : '';
      html += `
        <label class="stop-card" style="cursor:pointer;display:block;${borderColor}" onclick="this.querySelector('input').checked=true;document.querySelectorAll('[name=builder-surface]').forEach(r=>{r.closest('.stop-card').style.borderColor=(r.checked?'var(--accent)':'var(--border)')});">
          <div style="display:flex;align-items:center;gap:10px;">
            <input type="radio" name="builder-surface" value="${opt.value}"${checked} style="width:16px;height:16px;accent-color:var(--accent);cursor:pointer;">
            <i class="fas ${opt.icon}" style="color:var(--accent);font-size:14px;width:20px;text-align:center;"></i>
            <div>
              <div style="font-size:13px;font-weight:600;color:var(--text);">${opt.label}</div>
              <div style="font-size:11px;color:var(--text-muted);">${opt.desc}</div>
            </div>
          </div>
        </label>`;
    });

    html += this.renderNavButtons(true, 'Next');
    this.sidebarEl.innerHTML = html;
    this.sidebarEl.scrollTop = 0;
  }

  renderBikesList() {
    if (this.config.bikes.length === 0) {
      return '<div style="font-size:12px;color:var(--text-dim);padding:8px 0;">No bikes added yet.</div>';
    }
    let html = '';
    this.config.bikes.forEach((bike, i) => {
      html += `
        <div class="stop-card" style="border-left:3px solid var(--accent);display:flex;align-items:center;justify-content:space-between;">
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:16px;">${bike.icon || '🏍'}</span>
            <div>
              <div style="font-size:13px;font-weight:600;">${this.escapeHtml(bike.name)}</div>
              ${bike.range ? `<div style="font-size:11px;color:var(--text-muted);">Range: ${this.escapeHtml(bike.range)} | Tank: ${this.escapeHtml(bike.tank || 'N/A')}</div>` : ''}
            </div>
          </div>
          <button onclick="window._tripBuilder.removeBike(${i})" style="background:none;border:none;color:var(--red);cursor:pointer;font-size:14px;padding:4px 8px;">
            <i class="fas fa-times"></i>
          </button>
        </div>`;
    });
    return html;
  }

  addBike() {
    const db = this.getDB();
    const sel = this.sidebarEl.querySelector('#builder-bike-select');
    if (!sel || sel.value === '') return;
    const preset = (db.bikePresets || [])[parseInt(sel.value)];
    if (preset) {
      this.config.bikes.push({ ...preset });
      sel.value = '';
      const listEl = this.sidebarEl.querySelector('#builder-bikes-list');
      if (listEl) listEl.innerHTML = this.renderBikesList();
    }
  }

  addCustomBike() {
    const input = this.sidebarEl.querySelector('#builder-bike-custom');
    if (!input || !input.value.trim()) return;
    this.config.bikes.push({ name: input.value.trim(), icon: '🏍', range: '', tank: '' });
    input.value = '';
    const listEl = this.sidebarEl.querySelector('#builder-bikes-list');
    if (listEl) listEl.innerHTML = this.renderBikesList();
  }

  removeBike(index) {
    this.config.bikes.splice(index, 1);
    const listEl = this.sidebarEl.querySelector('#builder-bikes-list');
    if (listEl) listEl.innerHTML = this.renderBikesList();
  }

  // ── Step 4: Interests ──

  renderStep4() {
    const icons = this.getMarkerIcons();
    const { interests } = this.config;

    let html = this.renderProgressIndicator(4);
    html += `
      <div class="section-title"><i class="fas fa-heart" style="margin-right:6px;"></i> What interests you?</div>
      <div style="font-size:12px;color:var(--text-muted);margin-bottom:12px;">Select the types of places you want to include in your trip.</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">`;

    const typeLabels = {
      ferry: 'Ferries', landmark: 'Landmarks', viewpoint: 'Viewpoints',
      waterfall: 'Waterfalls', road: 'Key Roads', camp: 'Camping',
      wildlife: 'Wildlife', fuel: 'Fuel Stops', beach: 'Beaches',
      castle: 'Castles', distillery: 'Distilleries', pub: 'Pubs & Inns',
      bridge: 'Bridges', fossil: 'Fossils'
    };

    Object.entries(icons).forEach(([type, iconClass]) => {
      const active = interests.includes(type);
      const bgColor = active ? 'background:rgba(232,113,58,0.15);border-color:var(--accent);' : '';
      const textColor = active ? 'color:var(--accent);' : 'color:var(--text-muted);';
      const label = typeLabels[type] || type.charAt(0).toUpperCase() + type.slice(1);
      html += `
        <div class="stop-card" onclick="window._tripBuilder.toggleInterest('${type}', this)"
          style="cursor:pointer;text-align:center;padding:14px 8px;${bgColor}" data-type="${type}">
          <i class="fas ${iconClass}" style="font-size:20px;${textColor}display:block;margin-bottom:6px;"></i>
          <div style="font-size:11px;font-weight:600;${textColor}">${label}</div>
        </div>`;
    });

    html += '</div>';

    if (interests.length > 0) {
      html += `
        <div style="margin-top:12px;font-size:12px;color:var(--text-muted);">
          <strong style="color:var(--accent);">${interests.length}</strong> interest${interests.length !== 1 ? 's' : ''} selected
        </div>`;
    }

    html += this.renderNavButtons(true, 'Next');
    this.sidebarEl.innerHTML = html;
    this.sidebarEl.scrollTop = 0;
  }

  toggleInterest(type, el) {
    const idx = this.config.interests.indexOf(type);
    if (idx >= 0) {
      this.config.interests.splice(idx, 1);
      el.style.background = '';
      el.style.borderColor = '';
      el.querySelector('i').style.color = 'var(--text-muted)';
      el.querySelector('div').style.color = 'var(--text-muted)';
    } else {
      this.config.interests.push(type);
      el.style.background = 'rgba(232,113,58,0.15)';
      el.style.borderColor = 'var(--accent)';
      el.querySelector('i').style.color = 'var(--accent)';
      el.querySelector('div').style.color = 'var(--accent)';
    }
  }

  // ── Step 5: Regions ──

  renderStep5() {
    const db = this.getDB();
    const allRegions = db.regions || [];
    const { regions } = this.config;

    let html = this.renderProgressIndicator(5);
    html += `
      <div class="section-title"><i class="fas fa-map" style="margin-right:6px;"></i> Select Regions</div>
      <div style="font-size:12px;color:var(--text-muted);margin-bottom:12px;">Choose the regions your trip should pass through. Click to highlight on the map.</div>`;

    if (allRegions.length > 0) {
      html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">';
      allRegions.forEach(region => {
        const active = regions.includes(region.id);
        const bgColor = active ? 'background:rgba(232,113,58,0.15);border-color:var(--accent);' : '';
        const textColor = active ? 'color:var(--accent);' : 'color:var(--text-muted);';
        html += `
          <div class="stop-card" onclick="window._tripBuilder.toggleRegion('${this.escapeHtml(region.id)}', this, ${region.center ? region.center[0] : 54.5}, ${region.center ? region.center[1] : -3.5}, ${region.zoom || 8})"
            style="cursor:pointer;text-align:center;padding:14px 10px;${bgColor}" data-region="${this.escapeHtml(region.id)}">
            <i class="fas fa-map-marker-alt" style="font-size:16px;${textColor}display:block;margin-bottom:6px;"></i>
            <div style="font-size:12px;font-weight:600;${textColor}">${this.escapeHtml(region.label || region.id)}</div>
          </div>`;
      });
      html += '</div>';
    } else {
      html += `
        <div class="tips-box">
          <div class="tips-title"><i class="fas fa-info-circle"></i> No regions available</div>
          <div class="tips-text">The POI database has no region data loaded. Your trip will include all available points of interest regardless of region.</div>
        </div>`;
    }

    if (regions.length > 0) {
      html += `
        <div style="margin-top:12px;font-size:12px;color:var(--text-muted);">
          <strong style="color:var(--accent);">${regions.length}</strong> region${regions.length !== 1 ? 's' : ''} selected
        </div>`;
    }

    html += this.renderNavButtons(true, 'Next');
    this.sidebarEl.innerHTML = html;
    this.sidebarEl.scrollTop = 0;
  }

  toggleRegion(regionId, el, lat, lng, zoom) {
    const idx = this.config.regions.indexOf(regionId);
    if (idx >= 0) {
      this.config.regions.splice(idx, 1);
      el.style.background = '';
      el.style.borderColor = '';
      el.querySelector('i').style.color = 'var(--text-muted)';
      el.querySelector('div').style.color = 'var(--text-muted)';
    } else {
      this.config.regions.push(regionId);
      el.style.background = 'rgba(232,113,58,0.15)';
      el.style.borderColor = 'var(--accent)';
      el.querySelector('i').style.color = 'var(--accent)';
      el.querySelector('div').style.color = 'var(--accent)';
      // Zoom map to region
      if (this.map && lat && lng) {
        this.map.flyTo([lat, lng], zoom || 8, { duration: 0.6 });
      }
    }
  }

  // ── Step 6: Review & Generate ──

  renderStep6() {
    const { startPoint, endPoint, days, pace, restDayEvery, bikes, roadSurface, interests, regions } = this.config;
    const isLoop = !endPoint;
    const dailyMiles = { relaxed: 80, moderate: 130, aggressive: 180 }[pace] || 130;
    const ridingDays = restDayEvery > 0 ? days - Math.floor((days - 1) / restDayEvery) : days;
    const estTotal = ridingDays * dailyMiles;

    let html = this.renderProgressIndicator(6);

    // Summary stats
    html += `
      <div class="overview-stats">
        <div class="stat-card">
          <div class="stat-value">${days}</div>
          <div class="stat-label">Total Days</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">~${estTotal}</div>
          <div class="stat-label">Est. Miles</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${ridingDays}</div>
          <div class="stat-label">Riding Days</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${dailyMiles}</div>
          <div class="stat-label">Mi/Day</div>
        </div>
      </div>`;

    // Route summary
    html += `
      <div class="section-title"><i class="fas fa-route" style="margin-right:6px;"></i> Route</div>
      <div class="stop-card" style="cursor:default;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
          <div class="stop-icon" style="background:var(--green);width:24px;height:24px;">
            <i class="fas fa-play" style="font-size:10px;"></i>
          </div>
          <div style="font-size:13px;font-weight:600;">${startPoint ? this.escapeHtml(startPoint.name) : 'Not set'}</div>
        </div>
        <div style="border-left:2px dashed var(--border);margin-left:11px;padding:8px 0 8px 16px;font-size:12px;color:var(--text-dim);">
          ~${estTotal} miles over ${ridingDays} riding days
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <div class="stop-icon" style="background:var(--red);width:24px;height:24px;">
            <i class="fas ${isLoop ? 'fa-sync-alt' : 'fa-flag-checkered'}" style="font-size:10px;"></i>
          </div>
          <div style="font-size:13px;font-weight:600;">${isLoop ? this.escapeHtml((startPoint || {}).name || '') + ' (loop)' : (endPoint ? this.escapeHtml(endPoint.name) : 'Not set')}</div>
        </div>
      </div>`;

    // Bikes
    if (bikes.length > 0) {
      html += `<div class="section-title"><i class="fas fa-motorcycle" style="margin-right:6px;"></i> Bikes</div>`;
      bikes.forEach(bike => {
        html += `
          <div class="stop-card" style="cursor:default;border-left:3px solid var(--accent);">
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="font-size:16px;">${bike.icon || '🏍'}</span>
              <span style="font-size:13px;font-weight:600;">${this.escapeHtml(bike.name)}</span>
            </div>
          </div>`;
      });
    }

    // Config summary
    html += `
      <div class="section-title"><i class="fas fa-cog" style="margin-right:6px;"></i> Settings</div>
      <div class="stop-card" style="cursor:default;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:12px;">
          <div style="color:var(--text-dim);">Pace:</div>
          <div style="color:var(--text);font-weight:600;">${pace.charAt(0).toUpperCase() + pace.slice(1)}</div>
          <div style="color:var(--text-dim);">Surface:</div>
          <div style="color:var(--text);font-weight:600;">${roadSurface === 'paved' ? 'Paved Only' : roadSurface === 'single-track-ok' ? 'Single-Track OK' : 'Gravel OK'}</div>
          <div style="color:var(--text-dim);">Rest Days:</div>
          <div style="color:var(--text);font-weight:600;">${restDayEvery === 0 ? 'None' : 'Every ' + restDayEvery + ' days'}</div>
          <div style="color:var(--text-dim);">Interests:</div>
          <div style="color:var(--text);font-weight:600;">${interests.length > 0 ? interests.length + ' selected' : 'All types'}</div>
          <div style="color:var(--text-dim);">Regions:</div>
          <div style="color:var(--text);font-weight:600;">${regions.length > 0 ? regions.length + ' selected' : 'All regions'}</div>
        </div>
      </div>`;

    // Trip name input
    html += `
      <div class="section-title" style="margin-top:20px;"><i class="fas fa-tag" style="margin-right:6px;"></i> Trip Name</div>
      <div class="stop-card" style="cursor:default;">
        <input type="text" id="builder-trip-name" placeholder="My Motorbike Adventure" value="${this.escapeHtml(this.config.tripName)}"
          style="width:100%;padding:10px 12px;background:var(--bg-dark);border:1px solid var(--border);border-radius:var(--radius);color:var(--text);font-size:14px;font-family:inherit;font-weight:600;">
      </div>`;

    // Generate button
    html += `
      <div id="builder-error" style="display:none;padding:8px 12px;background:rgba(231,76,60,0.12);border:1px solid rgba(231,76,60,0.3);border-radius:var(--radius);color:var(--red);font-size:12px;margin-top:12px;text-align:center;"></div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:20px;padding-top:16px;border-top:1px solid var(--border);">
        <button onclick="window._tripBuilder.prevStep()" style="padding:10px 20px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);color:var(--text-muted);font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;">
          <i class="fas fa-arrow-left" style="margin-right:6px;"></i>Back
        </button>
        <button onclick="window._tripBuilder.onGenerate()" style="padding:12px 28px;background:linear-gradient(135deg, var(--accent), var(--accent-light, #f0955e));border:none;border-radius:var(--radius);color:#fff;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;box-shadow:0 4px 16px rgba(232,113,58,0.3);transition:all 0.2s;">
          <i class="fas fa-magic" style="margin-right:8px;"></i>Generate Trip
        </button>
      </div>`;

    this.sidebarEl.innerHTML = html;
    this.sidebarEl.scrollTop = 0;
  }

  onGenerate() {
    this.collectCurrentStep();
    const nameInput = this.sidebarEl.querySelector('#builder-trip-name');
    if (nameInput) this.config.tripName = nameInput.value.trim();
    if (!this.config.tripName) {
      this.config.tripName = 'Custom Trip — ' + new Date().toLocaleDateString();
    }
    this.generateTrip();
  }

  // ── Trip Generation Algorithm ──

  generateTrip() {
    const db = this.getDB();
    const {
      startPoint, endPoint, days, pace, restDayEvery,
      bikes, roadSurface, interests, regions, tripName
    } = this.config;

    if (!startPoint) return;

    const isLoop = !endPoint;
    const end = isLoop ? startPoint : endPoint;
    const dailyMiles = { relaxed: 80, moderate: 130, aggressive: 180 }[pace] || 130;

    // Calculate riding days (total minus rest days)
    const restDayCount = restDayEvery > 0 ? Math.floor((days - 1) / restDayEvery) : 0;
    const ridingDays = days - restDayCount;

    // 1. Filter POIs by regions, interests, and road surface compatibility
    let pois = (db.pois || []).filter(poi => {
      // Region filter
      if (regions.length > 0 && poi.region && !regions.includes(poi.region)) return false;
      // Interest / type filter
      if (interests.length > 0 && poi.type && !interests.includes(poi.type) && poi.type !== 'camp' && poi.type !== 'fuel') return false;
      // Road surface filter
      if (poi.surface) {
        if (roadSurface === 'paved' && poi.surface !== 'paved') return false;
        if (roadSurface === 'single-track-ok' && poi.surface === 'gravel') return false;
      }
      return true;
    });

    // 3. Sort filtered POIs geographically
    if (isLoop) {
      // For loop trips, sort by bearing from start (clockwise)
      pois.sort((a, b) => {
        return this.bearing(startPoint.lat, startPoint.lng, a.lat, a.lng) -
          this.bearing(startPoint.lat, startPoint.lng, b.lat, b.lng);
      });
    } else {
      // For point-to-point, sort by distance from start
      pois.sort((a, b) => {
        return this.haversine(startPoint.lat, startPoint.lng, a.lat, a.lng) -
          this.haversine(startPoint.lat, startPoint.lng, b.lat, b.lng);
      });
    }

    // 4. Divide POIs into day chunks based on daily mileage budget
    const dayChunks = this.dividePoisIntoDays(pois, startPoint, end, ridingDays, dailyMiles);

    // Insert rest days
    const allDayChunks = [];
    let ridingIdx = 0;
    for (let d = 0; d < days; d++) {
      const isRest = restDayEvery > 0 && d > 0 && d % restDayEvery === 0 && ridingIdx < dayChunks.length;
      if (isRest) {
        // Rest day — use location from previous day's last stop or chunk
        const prevChunk = allDayChunks.length > 0 ? allDayChunks[allDayChunks.length - 1] : null;
        allDayChunks.push({ stops: [], isRest: true, prevChunk });
      } else {
        allDayChunks.push({
          stops: ridingIdx < dayChunks.length ? dayChunks[ridingIdx] : [],
          isRest: false
        });
        ridingIdx++;
      }
    }

    // 5. For each day, find nearest camp POI
    const campPois = (db.pois || []).filter(p => p.type === 'camp');

    // 6. Build trip object
    const dayColors = this.generateDayColors(days);
    const markerColors = {
      ferry: '#3498db', landmark: '#9b59b6', viewpoint: '#e8713a',
      waterfall: '#00cec9', road: '#e74c3c', camp: '#27ae60',
      wildlife: '#f39c12', fuel: '#fdcb6e', beach: '#e17055',
      castle: '#6c5ce7', distillery: '#d35400', pub: '#c0392b',
      bridge: '#2d98da', fossil: '#cd853f'
    };

    const tripDays = [];
    const topRoads = [];
    let totalDistance = 0;

    for (let d = 0; d < allDayChunks.length; d++) {
      const chunk = allDayChunks[d];
      const dayNum = d + 1;

      if (chunk.isRest) {
        // Rest day
        const prevStops = chunk.prevChunk && chunk.prevChunk.stops ? chunk.prevChunk.stops : [];
        const restLoc = prevStops.length > 0
          ? prevStops[prevStops.length - 1]
          : startPoint;
        tripDays.push({
          day: dayNum,
          title: 'Rest Day',
          distance: '0 miles',
          duration: 'Rest day — no riding',
          summary: 'A well-earned rest day to explore on foot, relax, and recharge for the miles ahead.',
          center: [restLoc.lat, restLoc.lng],
          zoom: 12,
          region: restLoc.region || '',
          mergeable: false,
          stops: [],
          roads: [],
          route: [[restLoc.lat, restLoc.lng]],
          tips: 'Take the day off! Walk, eat, explore the local area, and give the bike a rest too.'
        });
        continue;
      }

      const stops = chunk.stops;
      if (stops.length === 0) {
        // Empty day — interpolate position
        const progress = days > 1 ? d / (days - 1) : 0;
        const interpLat = startPoint.lat + (end.lat - startPoint.lat) * progress;
        const interpLng = startPoint.lng + (end.lng - startPoint.lng) * progress;
        tripDays.push({
          day: dayNum,
          title: `Day ${dayNum} — Transit`,
          distance: `~${dailyMiles} miles`,
          duration: `~${Math.round(dailyMiles / 40)} hrs riding`,
          summary: 'Transit day covering ground between regions.',
          center: [interpLat, interpLng],
          zoom: 9,
          region: '',
          mergeable: true,
          stops: [],
          roads: [],
          route: [[interpLat, interpLng]],
          tips: 'Fill up on fuel whenever you see a station.'
        });
        totalDistance += dailyMiles;
        continue;
      }

      // Build day data from stops
      const dayStops = stops.map(s => ({
        name: s.name,
        lat: s.lat,
        lng: s.lng,
        type: s.type,
        description: s.description || '',
        url: s.url || undefined,
        park4night: s.park4night || undefined
      }));

      // Find nearest camp if last stop isn't already a camp
      const lastStop = stops[stops.length - 1];
      if (lastStop.type !== 'camp' && campPois.length > 0) {
        let nearestCamp = null;
        let nearestDist = Infinity;
        campPois.forEach(cp => {
          const d2 = this.haversine(lastStop.lat, lastStop.lng, cp.lat, cp.lng);
          if (d2 < nearestDist) {
            nearestDist = d2;
            nearestCamp = cp;
          }
        });
        if (nearestCamp && nearestDist < 50) {
          dayStops.push({
            name: nearestCamp.name,
            lat: nearestCamp.lat,
            lng: nearestCamp.lng,
            type: 'camp',
            description: nearestCamp.description || 'Nearby campsite.',
            url: nearestCamp.url || undefined,
            park4night: nearestCamp.park4night || undefined
          });
        }
      }

      // Calculate day distance
      let dayDist = 0;
      const prevLoc = d > 0 && tripDays[d - 1] && tripDays[d - 1].stops.length > 0
        ? tripDays[d - 1].stops[tripDays[d - 1].stops.length - 1]
        : startPoint;
      let prevPt = prevLoc;
      for (let s = 0; s < dayStops.length; s++) {
        dayDist += this.haversine(prevPt.lat, prevPt.lng, dayStops[s].lat, dayStops[s].lng);
        prevPt = dayStops[s];
      }
      totalDistance += dayDist;

      // Build route waypoints
      const route = dayStops.map(s => [s.lat, s.lng]);

      // Determine center and region
      const centerLat = dayStops.reduce((s, p) => s + p.lat, 0) / dayStops.length;
      const centerLng = dayStops.reduce((s, p) => s + p.lng, 0) / dayStops.length;
      const dayRegion = stops[0].region || '';

      // Extract roads
      const dayRoads = [];
      stops.filter(s => s.type === 'road').forEach(s => {
        const road = {
          name: s.name,
          rating: s.rating || 3,
          description: s.description || ''
        };
        dayRoads.push(road);
        topRoads.push({
          name: s.name,
          day: dayNum,
          rating: road.rating,
          region: s.region || dayRegion
        });
      });

      // Generate day title
      const regionNames = [...new Set(stops.map(s => s.region).filter(Boolean))];
      const title = regionNames.length >= 2
        ? regionNames[0] + ' to ' + regionNames[regionNames.length - 1]
        : regionNames.length === 1
          ? regionNames[0]
          : `Day ${dayNum}`;

      const ridingHours = Math.max(1, Math.round(dayDist / 35));

      tripDays.push({
        day: dayNum,
        title: title,
        distance: `~${Math.round(dayDist)} miles`,
        duration: `~${ridingHours} hrs riding`,
        summary: `Riding through ${regionNames.length > 0 ? regionNames.join(', ') : 'the route'} with ${dayStops.length} stops planned.`,
        center: [centerLat, centerLng],
        zoom: dayStops.length <= 3 ? 10 : 9,
        region: dayRegion,
        mergeable: dayStops.length <= 3,
        stops: dayStops,
        roads: dayRoads,
        route: route,
        tips: dayDist > 150 ? 'Long day ahead — start early and keep the tank topped up.' : 'Enjoy the ride and take your time at the stops.'
      });
    }

    // Sort top roads by rating
    topRoads.sort((a, b) => b.rating - a.rating);

    // Check for applicable ferries
    let ferryInfo = null;
    const ferries = db.ferries || [];
    if (ferries.length > 0) {
      // Find ferry closest to start point
      let nearestFerry = null;
      let nearestFerryDist = Infinity;
      ferries.forEach(f => {
        if (f.from) {
          const fd = this.haversine(startPoint.lat, startPoint.lng, f.from.lat, f.from.lng);
          if (fd < nearestFerryDist) {
            nearestFerryDist = fd;
            nearestFerry = f;
          }
        }
      });
      if (nearestFerry && nearestFerryDist < 30) {
        ferryInfo = {
          operator: nearestFerry.operator || 'Ferry Service',
          route: nearestFerry.route || 'Ferry crossing',
          duration: nearestFerry.duration || 'Varies',
          url: nearestFerry.url || '',
          note: nearestFerry.note || 'Book in advance for bike spaces.'
        };
      }
    }

    // Build fuel strategy
    const fuelStrategy = pace === 'aggressive'
      ? 'Aggressive pace — fill up at every opportunity. Never pass a fuel station below half tank, especially in rural areas.'
      : pace === 'relaxed'
        ? 'Relaxed pace gives more fuel flexibility, but still top up regularly in remote areas like the Scottish Highlands and rural Wales.'
        : 'Fill up every 100 miles. Rural areas can have sparse fuel stations — never pass one below half tank.';

    // Build the trip object
    const tripData = {
      id: 'custom-' + Date.now(),
      label: tripName,
      meta: {
        title: tripName,
        subtitle: `~${Math.round(totalDistance)} miles over ${days} days`,
        bikes: bikes.length > 0 ? bikes.map(b => ({
          name: b.name,
          icon: b.icon || '🏍',
          range: b.range || 'N/A',
          tank: b.tank || 'N/A'
        })) : [{ name: 'Your Bike', icon: '🏍', range: 'N/A', tank: 'N/A' }],
        totalDays: days,
        totalDistance: `~${Math.round(totalDistance)} miles / ~${Math.round(totalDistance * 1.609)} km`,
        fuelStrategy: fuelStrategy,
        packingEssentials: [
          'Waterproofs',
          'Tank bag or tail pack',
          'Chain lube + basic toolkit',
          'Tyre repair kit',
          'Phone mount + USB charger',
          'Offline maps',
          'First aid kit'
        ]
      },
      dayColors: dayColors,
      markerColors: markerColors,
      days: tripDays,
      topRoads: topRoads
    };

    // Add ferry info if applicable
    if (ferryInfo) {
      tripData.meta.ferry = ferryInfo;
    }

    // 7. Save and load the trip
    if (typeof tripManager !== 'undefined' && tripManager.saveAndLoadTrip) {
      tripManager.saveAndLoadTrip(tripData);
    }
  }

  // ── POI Day Division Algorithm ──

  dividePoisIntoDays(pois, start, end, ridingDays, dailyMiles) {
    if (ridingDays <= 0) return [];
    if (pois.length === 0) {
      // No POIs — create empty day chunks
      const chunks = [];
      for (let i = 0; i < ridingDays; i++) chunks.push([]);
      return chunks;
    }

    const dayChunks = [[]];
    let cumulativeDist = 0;
    let prevLat = start.lat;
    let prevLng = start.lng;
    let dayIdx = 0;

    for (let i = 0; i < pois.length; i++) {
      const poi = pois[i];
      const dist = this.haversine(prevLat, prevLng, poi.lat, poi.lng);
      cumulativeDist += dist;

      // Start a new day if over budget and not on last available day
      if (cumulativeDist > dailyMiles && dayChunks[dayIdx].length > 0 && dayIdx < ridingDays - 1) {
        dayIdx++;
        dayChunks[dayIdx] = [];
        cumulativeDist = dist;
      }

      dayChunks[dayIdx].push(poi);
      prevLat = poi.lat;
      prevLng = poi.lng;
    }

    // Pad with empty days if we have fewer chunks than riding days
    while (dayChunks.length < ridingDays) {
      dayChunks.push([]);
    }

    return dayChunks;
  }
}
