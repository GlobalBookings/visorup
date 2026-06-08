/**
 * VisorUp Tyre Pressure & Chain Maintenance Guide
 * Interactive calculator for tyre pressures and step-by-step chain maintenance guide.
 */

const TYRE_PRESSURE_DATA = {
  sport: { label: 'Sport', front: [33, 36], rear: [36, 42] },
  touring: { label: 'Touring', front: [33, 36], rear: [36, 42] },
  adventure: { label: 'Adventure', front: [29, 33], rear: [33, 36] },
  naked: { label: 'Naked', front: [33, 36], rear: [36, 42] },
  cruiser: { label: 'Cruiser', front: [30, 36], rear: [36, 40] },
  scooter: { label: 'Scooter', front: [26, 30], rear: [29, 33] },
};

const LOAD_ADJUSTMENTS = {
  solo: { label: 'Solo', front: 0, rear: 0 },
  soloLuggage: { label: 'Solo + Luggage', front: 0, rear: 2 },
  twoUp: { label: 'Two-up', front: 2, rear: 3 },
  twoUpLuggage: { label: 'Two-up + Luggage', front: 2, rear: 4 },
};

const CONDITION_ADJUSTMENTS = {
  normal: { label: 'Normal', front: 0, rear: 0, note: 'Standard riding conditions — no adjustment needed.' },
  wetCold: { label: 'Wet / Cold', front: -2, rear: -3, note: 'Lower pressure increases contact patch for better grip in wet/cold. Ride cautiously.' },
  trackDay: { label: 'Track Day', front: 2, rear: 2, note: 'Higher pressures for sustained high-speed stability. Warm tyres on sighting laps first.' },
};

function renderTyreChainGuide() {
  return `
    <div class="tyre-chain-guide">
      <div class="content-hero" style="background:linear-gradient(135deg, var(--bg-primary), var(--bg-secondary))">
        <div class="hero-content">
          <span class="hero-badge"><i class="fas fa-gauge-high"></i> Maintenance Guide</span>
          <h1>Tyre Pressure & Chain Guide</h1>
          <p class="hero-subtitle">Keep your bike safe and performing at its best. Use our interactive calculators to find the right tyre pressures and stay on top of chain maintenance.</p>
        </div>
      </div>

      <div class="tcg-container" style="max-width:900px;margin:0 auto;padding:24px">

        <!-- Navigation Tabs -->
        <div class="tcg-tabs" style="display:flex;gap:8px;margin-bottom:24px;flex-wrap:wrap">
          <button class="tcg-tab active" onclick="tyrePressureCalc.switchTab('tyres')" id="tcgTabTyres" style="flex:1;min-width:200px;padding:14px 20px;border-radius:var(--radius, 8px);border:2px solid var(--accent, #e85d04);background:var(--accent, #e85d04);color:#fff;font-weight:600;font-size:15px;cursor:pointer;transition:all .2s">
            <i class="fas fa-gauge-high"></i> Tyre Pressure Calculator
          </button>
          <button class="tcg-tab" onclick="chainGuide.switchTab('chain')" id="tcgTabChain" style="flex:1;min-width:200px;padding:14px 20px;border-radius:var(--radius, 8px);border:2px solid var(--border, #ddd);background:var(--bg-card, #fff);color:var(--text, #333);font-weight:600;font-size:15px;cursor:pointer;transition:all .2s">
            <i class="fas fa-link"></i> Chain Maintenance Guide
          </button>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 1: TYRE PRESSURE CALCULATOR         -->
        <!-- ============================================ -->
        <div class="tcg-section" id="tcgTyreSection">

          <!-- Bike Type Selection -->
          <div class="tcg-card" style="background:var(--bg-card, #fff);border:1px solid var(--border, #e0e0e0);border-radius:var(--radius, 8px);padding:24px;margin-bottom:16px">
            <div class="tcg-step-header" style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
              <span style="width:32px;height:32px;background:var(--accent, #e85d04);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px">1</span>
              <div>
                <h3 style="margin:0;font-size:18px;color:var(--text, #333)">Select Your Bike Type</h3>
                <p style="margin:4px 0 0;font-size:13px;color:var(--text-muted, #666)">Pressure ranges vary by motorcycle category</p>
              </div>
            </div>
            <div class="tcg-options" style="display:grid;grid-template-columns:repeat(auto-fill, minmax(140px, 1fr));gap:8px" id="tcgBikeOptions">
              <button class="tcg-opt-btn" onclick="tyrePressureCalc.setBikeType('sport')" data-value="sport" style="padding:12px;border-radius:var(--radius, 8px);border:2px solid var(--border, #e0e0e0);background:var(--bg-card, #fff);cursor:pointer;transition:all .2s;text-align:center">
                <i class="fas fa-motorcycle" style="font-size:20px;display:block;margin-bottom:6px;color:var(--accent, #e85d04)"></i>
                <strong style="font-size:13px">Sport</strong>
              </button>
              <button class="tcg-opt-btn" onclick="tyrePressureCalc.setBikeType('touring')" data-value="touring" style="padding:12px;border-radius:var(--radius, 8px);border:2px solid var(--border, #e0e0e0);background:var(--bg-card, #fff);cursor:pointer;transition:all .2s;text-align:center">
                <i class="fas fa-road" style="font-size:20px;display:block;margin-bottom:6px;color:var(--accent, #e85d04)"></i>
                <strong style="font-size:13px">Touring</strong>
              </button>
              <button class="tcg-opt-btn" onclick="tyrePressureCalc.setBikeType('adventure')" data-value="adventure" style="padding:12px;border-radius:var(--radius, 8px);border:2px solid var(--border, #e0e0e0);background:var(--bg-card, #fff);cursor:pointer;transition:all .2s;text-align:center">
                <i class="fas fa-compass" style="font-size:20px;display:block;margin-bottom:6px;color:var(--accent, #e85d04)"></i>
                <strong style="font-size:13px">Adventure</strong>
              </button>
              <button class="tcg-opt-btn" onclick="tyrePressureCalc.setBikeType('naked')" data-value="naked" style="padding:12px;border-radius:var(--radius, 8px);border:2px solid var(--border, #e0e0e0);background:var(--bg-card, #fff);cursor:pointer;transition:all .2s;text-align:center">
                <i class="fas fa-bolt" style="font-size:20px;display:block;margin-bottom:6px;color:var(--accent, #e85d04)"></i>
                <strong style="font-size:13px">Naked</strong>
              </button>
              <button class="tcg-opt-btn" onclick="tyrePressureCalc.setBikeType('cruiser')" data-value="cruiser" style="padding:12px;border-radius:var(--radius, 8px);border:2px solid var(--border, #e0e0e0);background:var(--bg-card, #fff);cursor:pointer;transition:all .2s;text-align:center">
                <i class="fas fa-wind" style="font-size:20px;display:block;margin-bottom:6px;color:var(--accent, #e85d04)"></i>
                <strong style="font-size:13px">Cruiser</strong>
              </button>
              <button class="tcg-opt-btn" onclick="tyrePressureCalc.setBikeType('scooter')" data-value="scooter" style="padding:12px;border-radius:var(--radius, 8px);border:2px solid var(--border, #e0e0e0);background:var(--bg-card, #fff);cursor:pointer;transition:all .2s;text-align:center">
                <i class="fas fa-moped" style="font-size:20px;display:block;margin-bottom:6px;color:var(--accent, #e85d04)"></i>
                <strong style="font-size:13px">Scooter</strong>
              </button>
            </div>
          </div>

          <!-- Load Selection -->
          <div class="tcg-card" style="background:var(--bg-card, #fff);border:1px solid var(--border, #e0e0e0);border-radius:var(--radius, 8px);padding:24px;margin-bottom:16px">
            <div class="tcg-step-header" style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
              <span style="width:32px;height:32px;background:var(--accent, #e85d04);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px">2</span>
              <div>
                <h3 style="margin:0;font-size:18px;color:var(--text, #333)">Select Your Load</h3>
                <p style="margin:4px 0 0;font-size:13px;color:var(--text-muted, #666)">Heavier loads need higher pressures for safety</p>
              </div>
            </div>
            <div class="tcg-options" style="display:grid;grid-template-columns:repeat(auto-fill, minmax(150px, 1fr));gap:8px" id="tcgLoadOptions">
              <button class="tcg-opt-btn" onclick="tyrePressureCalc.setLoad('solo')" data-value="solo" style="padding:12px;border-radius:var(--radius, 8px);border:2px solid var(--border, #e0e0e0);background:var(--bg-card, #fff);cursor:pointer;transition:all .2s;text-align:center">
                <i class="fas fa-person" style="font-size:20px;display:block;margin-bottom:6px;color:var(--accent, #e85d04)"></i>
                <strong style="font-size:13px">Solo</strong>
              </button>
              <button class="tcg-opt-btn" onclick="tyrePressureCalc.setLoad('soloLuggage')" data-value="soloLuggage" style="padding:12px;border-radius:var(--radius, 8px);border:2px solid var(--border, #e0e0e0);background:var(--bg-card, #fff);cursor:pointer;transition:all .2s;text-align:center">
                <i class="fas fa-suitcase" style="font-size:20px;display:block;margin-bottom:6px;color:var(--accent, #e85d04)"></i>
                <strong style="font-size:13px">Solo + Luggage</strong>
              </button>
              <button class="tcg-opt-btn" onclick="tyrePressureCalc.setLoad('twoUp')" data-value="twoUp" style="padding:12px;border-radius:var(--radius, 8px);border:2px solid var(--border, #e0e0e0);background:var(--bg-card, #fff);cursor:pointer;transition:all .2s;text-align:center">
                <i class="fas fa-people-arrows" style="font-size:20px;display:block;margin-bottom:6px;color:var(--accent, #e85d04)"></i>
                <strong style="font-size:13px">Two-up</strong>
              </button>
              <button class="tcg-opt-btn" onclick="tyrePressureCalc.setLoad('twoUpLuggage')" data-value="twoUpLuggage" style="padding:12px;border-radius:var(--radius, 8px);border:2px solid var(--border, #e0e0e0);background:var(--bg-card, #fff);cursor:pointer;transition:all .2s;text-align:center">
                <i class="fas fa-truck-loading" style="font-size:20px;display:block;margin-bottom:6px;color:var(--accent, #e85d04)"></i>
                <strong style="font-size:13px">Two-up + Luggage</strong>
              </button>
            </div>
          </div>

          <!-- Conditions Selection -->
          <div class="tcg-card" style="background:var(--bg-card, #fff);border:1px solid var(--border, #e0e0e0);border-radius:var(--radius, 8px);padding:24px;margin-bottom:16px">
            <div class="tcg-step-header" style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
              <span style="width:32px;height:32px;background:var(--accent, #e85d04);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px">3</span>
              <div>
                <h3 style="margin:0;font-size:18px;color:var(--text, #333)">Riding Conditions</h3>
                <p style="margin:4px 0 0;font-size:13px;color:var(--text-muted, #666)">Conditions affect optimal grip vs stability trade-off</p>
              </div>
            </div>
            <div class="tcg-options" style="display:grid;grid-template-columns:repeat(auto-fill, minmax(150px, 1fr));gap:8px" id="tcgConditionOptions">
              <button class="tcg-opt-btn" onclick="tyrePressureCalc.setCondition('normal')" data-value="normal" style="padding:12px;border-radius:var(--radius, 8px);border:2px solid var(--border, #e0e0e0);background:var(--bg-card, #fff);cursor:pointer;transition:all .2s;text-align:center">
                <i class="fas fa-sun" style="font-size:20px;display:block;margin-bottom:6px;color:var(--accent, #e85d04)"></i>
                <strong style="font-size:13px">Normal</strong>
              </button>
              <button class="tcg-opt-btn" onclick="tyrePressureCalc.setCondition('wetCold')" data-value="wetCold" style="padding:12px;border-radius:var(--radius, 8px);border:2px solid var(--border, #e0e0e0);background:var(--bg-card, #fff);cursor:pointer;transition:all .2s;text-align:center">
                <i class="fas fa-cloud-rain" style="font-size:20px;display:block;margin-bottom:6px;color:var(--accent, #e85d04)"></i>
                <strong style="font-size:13px">Wet / Cold</strong>
              </button>
              <button class="tcg-opt-btn" onclick="tyrePressureCalc.setCondition('trackDay')" data-value="trackDay" style="padding:12px;border-radius:var(--radius, 8px);border:2px solid var(--border, #e0e0e0);background:var(--bg-card, #fff);cursor:pointer;transition:all .2s;text-align:center">
                <i class="fas fa-flag-checkered" style="font-size:20px;display:block;margin-bottom:6px;color:var(--accent, #e85d04)"></i>
                <strong style="font-size:13px">Track Day</strong>
              </button>
            </div>
          </div>

          <!-- Calculate Button -->
          <div style="text-align:center;margin-bottom:24px">
            <button onclick="tyrePressureCalc.calculate()" style="padding:14px 32px;background:var(--accent, #e85d04);color:#fff;border:none;border-radius:var(--radius, 8px);font-size:16px;font-weight:600;cursor:pointer;transition:all .2s">
              <i class="fas fa-calculator"></i> Calculate Pressures
            </button>
          </div>

          <!-- Results -->
          <div id="tcgPressureResults"></div>

          <!-- Tyre Wear Patterns -->
          <div class="tcg-card" style="background:var(--bg-card, #fff);border:1px solid var(--border, #e0e0e0);border-radius:var(--radius, 8px);padding:24px;margin-bottom:16px">
            <h3 style="margin:0 0 16px;font-size:18px;color:var(--text, #333)"><i class="fas fa-eye"></i> Tyre Wear Pattern Guide</h3>
            <p style="font-size:14px;color:var(--text-muted, #666);margin-bottom:16px">Read your tyre wear to diagnose pressure issues:</p>
            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:16px;font-family:monospace;font-size:13px">
              <div style="background:var(--bg-primary, #f8f9fa);border-radius:var(--radius, 8px);padding:16px;text-align:center">
                <div style="font-size:16px;margin-bottom:8px">
                  ▓▓░░░░░░▓▓<br>
                  ▓▓░░░░░░▓▓<br>
                  <span style="color:var(--accent, #e85d04)">Edges worn</span>
                </div>
                <strong style="color:#d32f2f">⚠️ UNDER-INFLATED</strong>
                <p style="font-size:12px;margin:8px 0 0;font-family:sans-serif">Too-low pressure causes edges to bear the load. Increases fuel consumption and heat buildup.</p>
              </div>
              <div style="background:var(--bg-primary, #f8f9fa);border-radius:var(--radius, 8px);padding:16px;text-align:center">
                <div style="font-size:16px;margin-bottom:8px">
                  ░░▓▓▓▓▓▓░░<br>
                  ░░▓▓▓▓▓▓░░<br>
                  <span style="color:var(--accent, #e85d04)">Centre worn</span>
                </div>
                <strong style="color:#d32f2f">⚠️ OVER-INFLATED</strong>
                <p style="font-size:12px;margin:8px 0 0;font-family:sans-serif">Too-high pressure makes only the centre contact the road. Reduces grip area.</p>
              </div>
              <div style="background:var(--bg-primary, #f8f9fa);border-radius:var(--radius, 8px);padding:16px;text-align:center">
                <div style="font-size:16px;margin-bottom:8px">
                  ▓▓▓▓▓▓▓▓▓▓<br>
                  ▓▓▓▓▓▓▓▓▓▓<br>
                  <span style="color:var(--accent, #e85d04)">Even wear</span>
                </div>
                <strong style="color:#2e7d32">✅ CORRECT PRESSURE</strong>
                <p style="font-size:12px;margin:8px 0 0;font-family:sans-serif">Even wear across the tread indicates proper inflation. Well done!</p>
              </div>
            </div>
          </div>

          <!-- When to Check -->
          <div class="tcg-card" style="background:var(--bg-card, #fff);border:1px solid var(--border, #e0e0e0);border-radius:var(--radius, 8px);padding:24px;margin-bottom:16px">
            <h3 style="margin:0 0 16px;font-size:18px;color:var(--text, #333)"><i class="fas fa-clock"></i> When to Check Tyre Pressure</h3>
            <ul style="list-style:none;padding:0;margin:0;font-size:14px;color:var(--text, #333)">
              <li style="padding:10px 0;border-bottom:1px solid var(--border, #e0e0e0);display:flex;align-items:center;gap:10px">
                <span style="color:var(--accent, #e85d04);font-size:18px"><i class="fas fa-thermometer-empty"></i></span>
                <div><strong>Always check cold tyres</strong> — ride less than 2 miles or wait 3+ hours after riding. Hot tyres read 4-6 PSI higher.</div>
              </li>
              <li style="padding:10px 0;border-bottom:1px solid var(--border, #e0e0e0);display:flex;align-items:center;gap:10px">
                <span style="color:var(--accent, #e85d04);font-size:18px"><i class="fas fa-calendar-week"></i></span>
                <div><strong>Every 2 weeks</strong> minimum, or weekly if riding daily. Tyres naturally lose 1-2 PSI per month.</div>
              </li>
              <li style="padding:10px 0;border-bottom:1px solid var(--border, #e0e0e0);display:flex;align-items:center;gap:10px">
                <span style="color:var(--accent, #e85d04);font-size:18px"><i class="fas fa-route"></i></span>
                <div><strong>Before every long trip</strong> — check the morning before departure with cold tyres.</div>
              </li>
              <li style="padding:10px 0;border-bottom:1px solid var(--border, #e0e0e0);display:flex;align-items:center;gap:10px">
                <span style="color:var(--accent, #e85d04);font-size:18px"><i class="fas fa-temperature-arrow-down"></i></span>
                <div><strong>When temperature drops significantly</strong> — every 10°C drop = ~2 PSI loss.</div>
              </li>
              <li style="padding:10px 0;display:flex;align-items:center;gap:10px">
                <span style="color:var(--accent, #e85d04);font-size:18px"><i class="fas fa-weight-hanging"></i></span>
                <div><strong>When changing load</strong> — adding a pillion or heavy luggage? Re-check and adjust.</div>
              </li>
            </ul>
          </div>

          <!-- Tyre Age / DOT Code -->
          <div class="tcg-card" style="background:var(--bg-card, #fff);border:1px solid var(--border, #e0e0e0);border-radius:var(--radius, 8px);padding:24px;margin-bottom:16px">
            <h3 style="margin:0 0 16px;font-size:18px;color:var(--text, #333)"><i class="fas fa-hourglass-half"></i> Tyre Age Check (DOT Date Code)</h3>
            <p style="font-size:14px;color:var(--text, #333);margin-bottom:12px">Every tyre has a DOT code on the sidewall. The last 4 digits tell you when it was made:</p>
            <div style="background:var(--bg-primary, #f8f9fa);border-radius:var(--radius, 8px);padding:20px;text-align:center;margin-bottom:16px">
              <div style="font-family:monospace;font-size:24px;font-weight:700;color:var(--text, #333);letter-spacing:2px">
                DOT XXXX XXXX <span style="color:var(--accent, #e85d04);border:2px solid var(--accent, #e85d04);padding:2px 8px;border-radius:4px">2523</span>
              </div>
              <p style="margin:12px 0 0;font-size:14px;color:var(--text-muted, #666)">
                <strong>25</strong> = Week 25 &nbsp;|&nbsp; <strong>23</strong> = Year 2023<br>
                This tyre was manufactured in June 2023
              </p>
            </div>
            <div style="background:#fff3cd;border:1px solid #ffc107;border-radius:var(--radius, 8px);padding:16px;font-size:14px">
              <strong>⚠️ Replace tyres older than 5 years</strong> regardless of tread depth. Rubber compounds harden over time, reducing grip dramatically — especially in wet conditions. If the DOT code shows 3 digits only, the tyre is pre-2000 and must be replaced immediately.
            </div>
          </div>

          <!-- Disclaimer -->
          <div style="background:#e3f2fd;border:1px solid #90caf9;border-radius:var(--radius, 8px);padding:16px;font-size:13px;color:#1565c0;margin-bottom:24px">
            <strong><i class="fas fa-info-circle"></i> Important:</strong> These are general guidelines only. <strong>Always check your owner's manual</strong> for the manufacturer's recommended pressures specific to your motorcycle. Pressures may also be found on a sticker on the swingarm or under the seat.
          </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 2: CHAIN MAINTENANCE GUIDE          -->
        <!-- ============================================ -->
        <div class="tcg-section" id="tcgChainSection" style="display:none">

          <!-- Chain Tension Check -->
          <div class="tcg-card" style="background:var(--bg-card, #fff);border:1px solid var(--border, #e0e0e0);border-radius:var(--radius, 8px);padding:24px;margin-bottom:16px">
            <div class="tcg-step-header" style="display:flex;align-items:center;gap:12px;margin-bottom:16px;cursor:pointer" onclick="chainGuide.toggleStep('tension')">
              <span style="width:32px;height:32px;background:var(--accent, #e85d04);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px">1</span>
              <div style="flex:1">
                <h3 style="margin:0;font-size:18px;color:var(--text, #333)">Chain Tension Check</h3>
                <p style="margin:4px 0 0;font-size:13px;color:var(--text-muted, #666)">How to measure slack correctly</p>
              </div>
              <i class="fas fa-chevron-down" id="tcgArrowTension" style="color:var(--text-muted, #666);transition:transform .2s"></i>
            </div>
            <div id="tcgStepTension" style="display:none">
              <div style="font-size:14px;color:var(--text, #333);line-height:1.7">
                <p><strong>Target slack:</strong> 25–35mm (1"–1.4") measured at the midpoint of the lower chain run. Always check your manual — some bikes (e.g. single-sided swingarms) require different values.</p>
                <h4 style="margin:16px 0 8px;color:var(--accent, #e85d04)">Method by Stand Type:</h4>
                <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:12px;margin-bottom:16px">
                  <div style="background:var(--bg-primary, #f8f9fa);border-radius:var(--radius, 8px);padding:14px">
                    <strong>🏍️ Centre Stand</strong>
                    <p style="margin:8px 0 0;font-size:13px">Ideal method. Rear wheel off the ground, gearbox in neutral. Push chain up and down at the midpoint between sprockets — measure total vertical movement.</p>
                  </div>
                  <div style="background:var(--bg-primary, #f8f9fa);border-radius:var(--radius, 8px);padding:14px">
                    <strong>🔧 Paddock Stand</strong>
                    <p style="margin:8px 0 0;font-size:13px">Same as centre stand — rear wheel lifted. Rotate wheel slowly and check tension at multiple points (tight spots indicate wear).</p>
                  </div>
                  <div style="background:var(--bg-primary, #f8f9fa);border-radius:var(--radius, 8px);padding:14px">
                    <strong>📐 Side Stand</strong>
                    <p style="margin:8px 0 0;font-size:13px">Bike on side stand with a rider sitting on it (compresses suspension). Measure at the tightest point. Add 5mm to your reading vs the manual spec to compensate.</p>
                  </div>
                </div>
                <p style="background:#fff3cd;border:1px solid #ffc107;border-radius:var(--radius, 8px);padding:12px;font-size:13px"><strong>💡 Tip:</strong> Always rotate the rear wheel and check at several points. If tension varies significantly around the chain, you may have a tight spot — a sign the chain needs replacing.</p>
              </div>
            </div>
          </div>

          <!-- Chain Adjustment -->
          <div class="tcg-card" style="background:var(--bg-card, #fff);border:1px solid var(--border, #e0e0e0);border-radius:var(--radius, 8px);padding:24px;margin-bottom:16px">
            <div class="tcg-step-header" style="display:flex;align-items:center;gap:12px;margin-bottom:16px;cursor:pointer" onclick="chainGuide.toggleStep('adjustment')">
              <span style="width:32px;height:32px;background:var(--accent, #e85d04);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px">2</span>
              <div style="flex:1">
                <h3 style="margin:0;font-size:18px;color:var(--text, #333)">Chain Adjustment</h3>
                <p style="margin:4px 0 0;font-size:13px;color:var(--text-muted, #666)">Step-by-step tensioning guide</p>
              </div>
              <i class="fas fa-chevron-down" id="tcgArrowAdjustment" style="color:var(--text-muted, #666);transition:transform .2s"></i>
            </div>
            <div id="tcgStepAdjustment" style="display:none">
              <div style="font-size:14px;color:var(--text, #333);line-height:1.7">
                <ol style="padding-left:20px;margin:0">
                  <li style="margin-bottom:12px"><strong>Loosen the rear axle nut</strong> — just enough to allow the wheel to move. Do NOT remove it.</li>
                  <li style="margin-bottom:12px"><strong>Locate the chain adjuster bolts</strong> — one on each side of the swingarm (or an eccentric cam on single-sided swingarms).</li>
                  <li style="margin-bottom:12px"><strong>Turn both adjusters equally</strong> — tighten (clockwise) to increase tension. Quarter-turns at a time.</li>
                  <li style="margin-bottom:12px"><strong>Check alignment</strong> — ensure both swingarm markers are on the same graduation. Misalignment causes uneven tyre wear and handling issues.</li>
                  <li style="margin-bottom:12px"><strong>Re-check tension</strong> — push the chain up/down at midpoint. Within spec? Good.</li>
                  <li style="margin-bottom:12px"><strong>Torque the axle nut</strong> — to your bike's specification (typically 80–130 Nm). Use a torque wrench, not guesswork.</li>
                  <li><strong>Spin the wheel</strong> — check for smooth rotation and no binding. Check tension at the tightest point once more.</li>
                </ol>
                <p style="background:#e8f5e9;border:1px solid #81c784;border-radius:var(--radius, 8px);padding:12px;font-size:13px;margin-top:16px"><strong>✅ Pro tip:</strong> If you've run out of adjuster range (bolts fully extended), the chain is stretched beyond use and needs replacing along with the sprockets.</p>
              </div>
            </div>
          </div>

          <!-- Chain Cleaning -->
          <div class="tcg-card" style="background:var(--bg-card, #fff);border:1px solid var(--border, #e0e0e0);border-radius:var(--radius, 8px);padding:24px;margin-bottom:16px">
            <div class="tcg-step-header" style="display:flex;align-items:center;gap:12px;margin-bottom:16px;cursor:pointer" onclick="chainGuide.toggleStep('cleaning')">
              <span style="width:32px;height:32px;background:var(--accent, #e85d04);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px">3</span>
              <div style="flex:1">
                <h3 style="margin:0;font-size:18px;color:var(--text, #333)">Chain Cleaning</h3>
                <p style="margin:4px 0 0;font-size:13px;color:var(--text-muted, #666)">Every 300–500 miles or after riding in rain</p>
              </div>
              <i class="fas fa-chevron-down" id="tcgArrowCleaning" style="color:var(--text-muted, #666);transition:transform .2s"></i>
            </div>
            <div id="tcgStepCleaning" style="display:none">
              <div style="font-size:14px;color:var(--text, #333);line-height:1.7">
                <h4 style="margin:0 0 12px;color:var(--accent, #e85d04)">What You'll Need:</h4>
                <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:8px;margin-bottom:16px">
                  <div style="background:var(--bg-primary, #f8f9fa);border-radius:var(--radius, 8px);padding:10px;font-size:13px">✅ Chain cleaner spray (e.g. Motul, Muc-Off)</div>
                  <div style="background:var(--bg-primary, #f8f9fa);border-radius:var(--radius, 8px);padding:10px;font-size:13px">✅ Soft bristle brush or chain brush</div>
                  <div style="background:var(--bg-primary, #f8f9fa);border-radius:var(--radius, 8px);padding:10px;font-size:13px">✅ Clean rags or old towels</div>
                  <div style="background:var(--bg-primary, #f8f9fa);border-radius:var(--radius, 8px);padding:10px;font-size:13px">✅ Rear stand (or centre stand)</div>
                  <div style="background:var(--bg-primary, #f8f9fa);border-radius:var(--radius, 8px);padding:10px;font-size:13px">❌ Never use WD-40 (displaces O-ring grease)</div>
                  <div style="background:var(--bg-primary, #f8f9fa);border-radius:var(--radius, 8px);padding:10px;font-size:13px">❌ Never use a pressure washer directly</div>
                </div>
                <h4 style="margin:0 0 12px;color:var(--accent, #e85d04)">Method:</h4>
                <ol style="padding-left:20px;margin:0">
                  <li style="margin-bottom:10px">Place bike on stand with rear wheel free to spin.</li>
                  <li style="margin-bottom:10px">Spray chain cleaner generously along the entire chain, targeting the inner links and rollers.</li>
                  <li style="margin-bottom:10px">Let it soak for 2–3 minutes to dissolve built-up grime.</li>
                  <li style="margin-bottom:10px">Scrub with the brush — rotate the wheel slowly and brush in sections. Focus on the side plates and rollers.</li>
                  <li style="margin-bottom:10px">Wipe down with a clean rag. Rotate and repeat until the rag comes away mostly clean.</li>
                  <li>Let the chain dry completely before lubricating (5–10 minutes).</li>
                </ol>
                <p style="background:#fff3cd;border:1px solid #ffc107;border-radius:var(--radius, 8px);padding:12px;font-size:13px;margin-top:16px"><strong>⚠️ Safety:</strong> Never spin the wheel with the engine in gear while your hands are near the chain. Always rotate by hand.</p>
              </div>
            </div>
          </div>

          <!-- Chain Lubrication -->
          <div class="tcg-card" style="background:var(--bg-card, #fff);border:1px solid var(--border, #e0e0e0);border-radius:var(--radius, 8px);padding:24px;margin-bottom:16px">
            <div class="tcg-step-header" style="display:flex;align-items:center;gap:12px;margin-bottom:16px;cursor:pointer" onclick="chainGuide.toggleStep('lubrication')">
              <span style="width:32px;height:32px;background:var(--accent, #e85d04);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px">4</span>
              <div style="flex:1">
                <h3 style="margin:0;font-size:18px;color:var(--text, #333)">Chain Lubrication</h3>
                <p style="margin:4px 0 0;font-size:13px;color:var(--text-muted, #666)">After cleaning or every 300 miles</p>
              </div>
              <i class="fas fa-chevron-down" id="tcgArrowLubrication" style="color:var(--text-muted, #666);transition:transform .2s"></i>
            </div>
            <div id="tcgStepLubrication" style="display:none">
              <div style="font-size:14px;color:var(--text, #333);line-height:1.7">
                <h4 style="margin:0 0 12px;color:var(--accent, #e85d04)">Lube Types Compared:</h4>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
                  <div style="background:var(--bg-primary, #f8f9fa);border-radius:var(--radius, 8px);padding:14px">
                    <strong>🧴 Wet Lube (e.g. Motul Chain Lube Road)</strong>
                    <ul style="margin:8px 0 0;padding-left:16px;font-size:13px">
                      <li>Better for wet/winter riding</li>
                      <li>Stickier — stays on longer in rain</li>
                      <li>Attracts more dirt — clean more often</li>
                      <li>Good for commuters and tourers</li>
                    </ul>
                  </div>
                  <div style="background:var(--bg-primary, #f8f9fa);border-radius:var(--radius, 8px);padding:14px">
                    <strong>🕯️ Wax Lube (e.g. Motul Chain Lube Off-Road)</strong>
                    <ul style="margin:8px 0 0;padding-left:16px;font-size:13px">
                      <li>Cleaner — doesn't fling or attract grime</li>
                      <li>Better for dry/summer conditions</li>
                      <li>Washes off in heavy rain</li>
                      <li>Good for fair-weather riders</li>
                    </ul>
                  </div>
                </div>
                <h4 style="margin:0 0 12px;color:var(--accent, #e85d04)">How to Lubricate:</h4>
                <ol style="padding-left:20px;margin:0">
                  <li style="margin-bottom:10px">Ensure chain is clean and dry.</li>
                  <li style="margin-bottom:10px">Apply lube to the <strong>inner side of the chain</strong> (between the inner plates) while slowly rotating the wheel.</li>
                  <li style="margin-bottom:10px">Target the rollers and pins — that's where the wear happens.</li>
                  <li style="margin-bottom:10px">Complete one full rotation, then let it sit for 10–15 minutes to penetrate.</li>
                  <li>Wipe off excess from the outside of the chain. Excess lube just flings onto your wheel and tyre.</li>
                </ol>
                <p style="background:#e8f5e9;border:1px solid #81c784;border-radius:var(--radius, 8px);padding:12px;font-size:13px;margin-top:16px"><strong>✅ Best time:</strong> Lubricate after a ride while the chain is slightly warm — the lube penetrates better into the rollers. Or after cleaning.</p>
              </div>
            </div>
          </div>

          <!-- Chain Replacement Signs -->
          <div class="tcg-card" style="background:var(--bg-card, #fff);border:1px solid var(--border, #e0e0e0);border-radius:var(--radius, 8px);padding:24px;margin-bottom:16px">
            <div class="tcg-step-header" style="display:flex;align-items:center;gap:12px;margin-bottom:16px;cursor:pointer" onclick="chainGuide.toggleStep('replacement')">
              <span style="width:32px;height:32px;background:var(--accent, #e85d04);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px">5</span>
              <div style="flex:1">
                <h3 style="margin:0;font-size:18px;color:var(--text, #333)">Chain Replacement Signs</h3>
                <p style="margin:4px 0 0;font-size:13px;color:var(--text-muted, #666)">When it's time for a new chain and sprockets</p>
              </div>
              <i class="fas fa-chevron-down" id="tcgArrowReplacement" style="color:var(--text-muted, #666);transition:transform .2s"></i>
            </div>
            <div id="tcgStepReplacement" style="display:none">
              <div style="font-size:14px;color:var(--text, #333);line-height:1.7">
                <p style="margin:0 0 12px">Replace your chain if you notice <strong>any</strong> of these signs:</p>
                <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(250px, 1fr));gap:10px;margin-bottom:16px">
                  <div style="background:#ffebee;border:1px solid #ef9a9a;border-radius:var(--radius, 8px);padding:12px;font-size:13px">
                    <strong>🔗 Tight spots</strong> — Chain tension varies as you rotate the wheel. Some links don't flex freely.
                  </div>
                  <div style="background:#ffebee;border:1px solid #ef9a9a;border-radius:var(--radius, 8px);padding:12px;font-size:13px">
                    <strong>🦀 Rust / corrosion</strong> — Deep rust on rollers and pins means the seals have failed and lubrication can't reach inside.
                  </div>
                  <div style="background:#ffebee;border:1px solid #ef9a9a;border-radius:var(--radius, 8px);padding:12px;font-size:13px">
                    <strong>🔀 Kinked links</strong> — Links that don't move smoothly or sit at an angle are permanently damaged.
                  </div>
                  <div style="background:#ffebee;border:1px solid #ef9a9a;border-radius:var(--radius, 8px);padding:12px;font-size:13px">
                    <strong>📏 Stretch beyond adjustment</strong> — Adjusters at maximum range means the chain has elongated past safe limits.
                  </div>
                  <div style="background:#ffebee;border:1px solid #ef9a9a;border-radius:var(--radius, 8px);padding:12px;font-size:13px">
                    <strong>⚙️ Sprocket wear</strong> — Hooked, pointed, or shark-fin shaped teeth. Always replace chain AND sprockets together.
                  </div>
                  <div style="background:#ffebee;border:1px solid #ef9a9a;border-radius:var(--radius, 8px);padding:12px;font-size:13px">
                    <strong>📐 Pull-away test</strong> — Pull the chain away from the rear sprocket. If it lifts more than half a tooth height, it's worn.
                  </div>
                </div>
                <p style="background:#e3f2fd;border:1px solid #90caf9;border-radius:var(--radius, 8px);padding:12px;font-size:13px"><strong>💡 Always replace chain and sprockets as a set.</strong> A new chain on worn sprockets will wear out rapidly, and vice versa. Budget £100–£250 for a quality kit depending on your bike.</p>
              </div>
            </div>
          </div>

          <!-- Chain Life -->
          <div class="tcg-card" style="background:var(--bg-card, #fff);border:1px solid var(--border, #e0e0e0);border-radius:var(--radius, 8px);padding:24px;margin-bottom:16px">
            <div class="tcg-step-header" style="display:flex;align-items:center;gap:12px;margin-bottom:16px;cursor:pointer" onclick="chainGuide.toggleStep('life')">
              <span style="width:32px;height:32px;background:var(--accent, #e85d04);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px">6</span>
              <div style="flex:1">
                <h3 style="margin:0;font-size:18px;color:var(--text, #333)">Chain Life Expectancy</h3>
                <p style="margin:4px 0 0;font-size:13px;color:var(--text-muted, #666)">Typical 15,000–25,000 miles with good maintenance</p>
              </div>
              <i class="fas fa-chevron-down" id="tcgArrowLife" style="color:var(--text-muted, #666);transition:transform .2s"></i>
            </div>
            <div id="tcgStepLife" style="display:none">
              <div style="font-size:14px;color:var(--text, #333);line-height:1.7">
                <p style="margin:0 0 16px">A well-maintained chain typically lasts <strong>15,000–25,000 miles</strong>. Factors that affect lifespan:</p>
                <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:10px;margin-bottom:16px">
                  <div style="background:var(--bg-primary, #f8f9fa);border-radius:var(--radius, 8px);padding:12px;font-size:13px">
                    <strong style="color:#2e7d32">↑ Increases life:</strong>
                    <ul style="margin:6px 0 0;padding-left:16px">
                      <li>Regular cleaning & lubing</li>
                      <li>Correct tension</li>
                      <li>Smooth riding style</li>
                      <li>Quality O-ring/X-ring chain</li>
                      <li>Proper wheel alignment</li>
                    </ul>
                  </div>
                  <div style="background:var(--bg-primary, #f8f9fa);border-radius:var(--radius, 8px);padding:12px;font-size:13px">
                    <strong style="color:#d32f2f">↓ Decreases life:</strong>
                    <ul style="margin:6px 0 0;padding-left:16px">
                      <li>Neglected maintenance</li>
                      <li>Riding in rain/mud</li>
                      <li>Aggressive acceleration</li>
                      <li>Too tight or too loose</li>
                      <li>High-power bikes (600cc+)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Chain Maintenance Schedule Calculator -->
          <div class="tcg-card" style="background:var(--bg-card, #fff);border:1px solid var(--border, #e0e0e0);border-radius:var(--radius, 8px);padding:24px;margin-bottom:16px">
            <h3 style="margin:0 0 16px;font-size:18px;color:var(--text, #333)"><i class="fas fa-calendar-check"></i> Chain Maintenance Schedule Calculator</h3>
            <p style="font-size:14px;color:var(--text-muted, #666);margin-bottom:16px">Enter your riding habits and we'll calculate your maintenance intervals:</p>

            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:16px;margin-bottom:20px">
              <div>
                <label style="font-size:13px;font-weight:600;color:var(--text, #333);display:block;margin-bottom:6px">Miles Per Week</label>
                <input type="number" id="tcgMilesPerWeek" value="100" min="10" max="2000" style="width:100%;padding:10px 12px;border:2px solid var(--border, #e0e0e0);border-radius:var(--radius, 8px);font-size:15px;box-sizing:border-box">
              </div>
              <div>
                <label style="font-size:13px;font-weight:600;color:var(--text, #333);display:block;margin-bottom:6px">Riding Conditions</label>
                <select id="tcgRidingConditions" style="width:100%;padding:10px 12px;border:2px solid var(--border, #e0e0e0);border-radius:var(--radius, 8px);font-size:15px;box-sizing:border-box;background:var(--bg-card, #fff)">
                  <option value="dry">Mostly Dry</option>
                  <option value="mixed" selected>Mixed (UK typical)</option>
                  <option value="wet">Mostly Wet / Winter</option>
                </select>
              </div>
            </div>

            <button onclick="chainGuide.calculateSchedule()" style="padding:12px 24px;background:var(--accent, #e85d04);color:#fff;border:none;border-radius:var(--radius, 8px);font-size:15px;font-weight:600;cursor:pointer;transition:all .2s">
              <i class="fas fa-calculator"></i> Calculate My Schedule
            </button>

            <div id="tcgScheduleResults" style="margin-top:20px"></div>
          </div>

        </div>
      </div>
    </div>
  `;
}

/* =============================================
   TYRE PRESSURE CALCULATOR OBJECT
   ============================================= */
const tyrePressureCalc = {
  selections: { bikeType: '', load: '', condition: '' },

  switchTab: function(tab) {
    document.getElementById('tcgTyreSection').style.display = tab === 'tyres' ? 'block' : 'none';
    document.getElementById('tcgChainSection').style.display = tab === 'tyres' ? 'none' : 'block';
    var tyreTab = document.getElementById('tcgTabTyres');
    var chainTab = document.getElementById('tcgTabChain');
    if (tab === 'tyres') {
      tyreTab.style.background = 'var(--accent, #e85d04)';
      tyreTab.style.borderColor = 'var(--accent, #e85d04)';
      tyreTab.style.color = '#fff';
      chainTab.style.background = 'var(--bg-card, #fff)';
      chainTab.style.borderColor = 'var(--border, #ddd)';
      chainTab.style.color = 'var(--text, #333)';
    }
  },

  setBikeType: function(type) {
    this.selections.bikeType = type;
    this._highlightOption('tcgBikeOptions', type);
  },

  setLoad: function(load) {
    this.selections.load = load;
    this._highlightOption('tcgLoadOptions', load);
  },

  setCondition: function(condition) {
    this.selections.condition = condition;
    this._highlightOption('tcgConditionOptions', condition);
  },

  _highlightOption: function(containerId, value) {
    var container = document.getElementById(containerId);
    if (!container) return;
    container.querySelectorAll('.tcg-opt-btn').forEach(function(btn) {
      if (btn.getAttribute('data-value') === value) {
        btn.style.borderColor = 'var(--accent, #e85d04)';
        btn.style.background = 'rgba(232, 93, 4, 0.08)';
      } else {
        btn.style.borderColor = 'var(--border, #e0e0e0)';
        btn.style.background = 'var(--bg-card, #fff)';
      }
    });
  },

  calculate: function() {
    var s = this.selections;
    if (!s.bikeType || !s.load || !s.condition) {
      alert('Please select a bike type, load, and riding conditions first.');
      return;
    }

    var base = TYRE_PRESSURE_DATA[s.bikeType];
    var loadAdj = LOAD_ADJUSTMENTS[s.load];
    var condAdj = CONDITION_ADJUSTMENTS[s.condition];

    var frontMin = base.front[0] + loadAdj.front + condAdj.front;
    var frontMax = base.front[1] + loadAdj.front + condAdj.front;
    var rearMin = base.rear[0] + loadAdj.rear + condAdj.rear;
    var rearMax = base.rear[1] + loadAdj.rear + condAdj.rear;

    // Convert to BAR (1 PSI = 0.0689476 BAR)
    var frontMinBar = (frontMin * 0.0689476).toFixed(2);
    var frontMaxBar = (frontMax * 0.0689476).toFixed(2);
    var rearMinBar = (rearMin * 0.0689476).toFixed(2);
    var rearMaxBar = (rearMax * 0.0689476).toFixed(2);

    var html = '<div style="background:linear-gradient(135deg, #1a1a2e, #16213e);border-radius:var(--radius, 8px);padding:24px;color:#fff">' +
      '<h3 style="margin:0 0 4px;font-size:18px"><i class="fas fa-gauge-high"></i> Recommended Tyre Pressures</h3>' +
      '<p style="margin:0 0 20px;font-size:13px;opacity:0.8">' + base.label + ' — ' + loadAdj.label + ' — ' + condAdj.label + '</p>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px">' +
      '<div style="background:rgba(255,255,255,0.1);border-radius:var(--radius, 8px);padding:20px;text-align:center">' +
      '<div style="font-size:12px;text-transform:uppercase;letter-spacing:1px;opacity:0.7;margin-bottom:8px">Front Tyre</div>' +
      '<div style="font-size:28px;font-weight:700">' + frontMin + '–' + frontMax + ' <span style="font-size:14px;font-weight:400">PSI</span></div>' +
      '<div style="font-size:16px;opacity:0.8;margin-top:4px">' + frontMinBar + '–' + frontMaxBar + ' BAR</div>' +
      '</div>' +
      '<div style="background:rgba(255,255,255,0.1);border-radius:var(--radius, 8px);padding:20px;text-align:center">' +
      '<div style="font-size:12px;text-transform:uppercase;letter-spacing:1px;opacity:0.7;margin-bottom:8px">Rear Tyre</div>' +
      '<div style="font-size:28px;font-weight:700">' + rearMin + '–' + rearMax + ' <span style="font-size:14px;font-weight:400">PSI</span></div>' +
      '<div style="font-size:16px;opacity:0.8;margin-top:4px">' + rearMinBar + '–' + rearMaxBar + ' BAR</div>' +
      '</div>' +
      '</div>';

    // Condition note
    if (condAdj.note) {
      html += '<div style="background:rgba(255,255,255,0.08);border-radius:var(--radius, 8px);padding:12px;font-size:13px;border-left:3px solid var(--accent, #e85d04)">' +
        '<strong>Condition note:</strong> ' + condAdj.note + '</div>';
    }

    html += '<p style="margin:16px 0 0;font-size:12px;opacity:0.6;text-align:center"><i class="fas fa-info-circle"></i> These are guidelines. Always refer to your owner\'s manual for exact specifications.</p>';
    html += '</div>';

    var resultsEl = document.getElementById('tcgPressureResults');
    resultsEl.innerHTML = html;
    resultsEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

    if (typeof VisorUpAnalytics !== 'undefined') {
      VisorUpAnalytics.trackToolUsage('tyre-pressure-calc', {
        bikeType: s.bikeType, load: s.load, condition: s.condition
      });
    }
  }
};

/* =============================================
   CHAIN MAINTENANCE GUIDE OBJECT
   ============================================= */
const chainGuide = {
  openSteps: {},

  switchTab: function(tab) {
    document.getElementById('tcgTyreSection').style.display = tab === 'chain' ? 'none' : 'block';
    document.getElementById('tcgChainSection').style.display = tab === 'chain' ? 'block' : 'none';
    var tyreTab = document.getElementById('tcgTabTyres');
    var chainTab = document.getElementById('tcgTabChain');
    if (tab === 'chain') {
      chainTab.style.background = 'var(--accent, #e85d04)';
      chainTab.style.borderColor = 'var(--accent, #e85d04)';
      chainTab.style.color = '#fff';
      tyreTab.style.background = 'var(--bg-card, #fff)';
      tyreTab.style.borderColor = 'var(--border, #ddd)';
      tyreTab.style.color = 'var(--text, #333)';
    }
  },

  toggleStep: function(stepId) {
    var el = document.getElementById('tcgStep' + stepId.charAt(0).toUpperCase() + stepId.slice(1));
    var arrow = document.getElementById('tcgArrow' + stepId.charAt(0).toUpperCase() + stepId.slice(1));
    if (!el) return;

    var isOpen = el.style.display !== 'none';
    el.style.display = isOpen ? 'none' : 'block';
    if (arrow) {
      arrow.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
    }
    this.openSteps[stepId] = !isOpen;
  },

  calculateSchedule: function() {
    var milesPerWeek = parseInt(document.getElementById('tcgMilesPerWeek').value, 10);
    var conditions = document.getElementById('tcgRidingConditions').value;

    if (!milesPerWeek || milesPerWeek < 10) {
      alert('Please enter a valid number of miles per week (minimum 10).');
      return;
    }

    // Calculate intervals based on conditions
    var cleanInterval, lubeInterval, replacementMiles;

    switch (conditions) {
      case 'dry':
        cleanInterval = 500; // miles between cleans
        lubeInterval = 400; // miles between lubes
        replacementMiles = 25000;
        break;
      case 'mixed':
        cleanInterval = 400;
        lubeInterval = 300;
        replacementMiles = 20000;
        break;
      case 'wet':
        cleanInterval = 300;
        lubeInterval = 200;
        replacementMiles = 15000;
        break;
      default:
        cleanInterval = 400;
        lubeInterval = 300;
        replacementMiles = 20000;
    }

    var weeksToClean = Math.round(cleanInterval / milesPerWeek * 10) / 10;
    var weeksToLube = Math.round(lubeInterval / milesPerWeek * 10) / 10;
    var weeksToReplace = Math.round(replacementMiles / milesPerWeek);
    var monthsToReplace = Math.round(weeksToReplace / 4.33);

    var cleanFreq = weeksToClean < 1 ? 'Every ' + Math.round(weeksToClean * 7) + ' days' : weeksToClean <= 2 ? 'Every ' + weeksToClean.toFixed(1) + ' weeks' : 'Every ' + Math.round(weeksToClean) + ' weeks';
    var lubeFreq = weeksToLube < 1 ? 'Every ' + Math.round(weeksToLube * 7) + ' days' : weeksToLube <= 2 ? 'Every ' + weeksToLube.toFixed(1) + ' weeks' : 'Every ' + Math.round(weeksToLube) + ' weeks';

    var html = '<div style="background:linear-gradient(135deg, #1a1a2e, #16213e);border-radius:var(--radius, 8px);padding:24px;color:#fff">' +
      '<h4 style="margin:0 0 4px;font-size:16px"><i class="fas fa-calendar-check"></i> Your Chain Maintenance Schedule</h4>' +
      '<p style="margin:0 0 20px;font-size:13px;opacity:0.8">' + milesPerWeek + ' miles/week — ' + conditions + ' conditions</p>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(150px, 1fr));gap:12px;margin-bottom:16px">' +
      '<div style="background:rgba(255,255,255,0.1);border-radius:var(--radius, 8px);padding:16px;text-align:center">' +
      '<div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;opacity:0.7;margin-bottom:6px">Clean Chain</div>' +
      '<div style="font-size:18px;font-weight:700">' + cleanFreq + '</div>' +
      '<div style="font-size:12px;opacity:0.7;margin-top:4px">Every ~' + cleanInterval + ' miles</div>' +
      '</div>' +
      '<div style="background:rgba(255,255,255,0.1);border-radius:var(--radius, 8px);padding:16px;text-align:center">' +
      '<div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;opacity:0.7;margin-bottom:6px">Lubricate</div>' +
      '<div style="font-size:18px;font-weight:700">' + lubeFreq + '</div>' +
      '<div style="font-size:12px;opacity:0.7;margin-top:4px">Every ~' + lubeInterval + ' miles</div>' +
      '</div>' +
      '<div style="background:rgba(255,255,255,0.1);border-radius:var(--radius, 8px);padding:16px;text-align:center">' +
      '<div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;opacity:0.7;margin-bottom:6px">Replacement</div>' +
      '<div style="font-size:18px;font-weight:700">~' + monthsToReplace + ' months</div>' +
      '<div style="font-size:12px;opacity:0.7;margin-top:4px">~' + replacementMiles.toLocaleString() + ' miles</div>' +
      '</div>' +
      '</div>' +
      '<p style="margin:0;font-size:12px;opacity:0.6;text-align:center"><i class="fas fa-info-circle"></i> Estimates based on average conditions. Inspect regularly and replace earlier if wear signs appear.</p>' +
      '</div>';

    var resultsEl = document.getElementById('tcgScheduleResults');
    resultsEl.innerHTML = html;
    resultsEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

    if (typeof VisorUpAnalytics !== 'undefined') {
      VisorUpAnalytics.trackToolUsage('chain-schedule-calc', {
        milesPerWeek: milesPerWeek, conditions: conditions
      });
    }
  }
};
