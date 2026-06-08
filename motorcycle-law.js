/**
 * VisorUp UK Motorcycle Law Quick Reference
 * Interactive reference page covering all key UK motorcycle legislation.
 * Uses collapsible sections with search/filter functionality.
 */

function renderMotorcycleLaw() {
  return `
    <div class="law-reference">
      <div class="content-hero" style="background:linear-gradient(135deg, var(--bg-primary), var(--bg-secondary))">
        <div class="hero-content">
          <span class="hero-badge"><i class="fas fa-scale-balanced"></i> Law Reference</span>
          <h1>UK Motorcycle Law Quick Reference</h1>
          <p class="hero-subtitle">Everything you need to know about riding legally in the UK — licence categories, speed limits, filtering, equipment requirements and more.</p>
          <p style="margin-top:8px;font-size:0.85rem;color:var(--text-muted)"><i class="fas fa-clock"></i> Last updated: 2026</p>
        </div>
      </div>

      <div class="law-container" style="max-width:900px;margin:0 auto;padding:24px">
        <!-- Search/Filter -->
        <div class="law-search-box" style="margin-bottom:24px;position:sticky;top:0;z-index:10;background:var(--bg-card);padding:12px 16px;border-radius:var(--radius);border:1px solid var(--border)">
          <div style="display:flex;align-items:center;gap:8px">
            <i class="fas fa-search" style="color:var(--text-muted)"></i>
            <input type="text" id="lawSearchInput" placeholder="Search laws... e.g. 'bus lane', 'pillion', 'MOT'" 
              oninput="motorcycleLaw.filterSections(this.value)"
              style="flex:1;background:transparent;border:none;outline:none;color:var(--text);font-size:1rem">
            <button onclick="motorcycleLaw.clearSearch()" style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:0.85rem">
              <i class="fas fa-xmark"></i> Clear
            </button>
          </div>
        </div>

        <!-- Section: Licence Categories -->
        <details class="law-section" data-keywords="licence license category am a1 a2 full progressive access age restriction cbt compulsory basic training das direct access" open>
          <summary class="law-summary">
            <i class="fas fa-id-card"></i>
            <span>Licence Categories</span>
            <i class="fas fa-chevron-down law-chevron"></i>
          </summary>
          <div class="law-content">
            <table class="law-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Min. Age</th>
                  <th>Vehicles</th>
                  <th>Restrictions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>AM</strong></td>
                  <td>16</td>
                  <td>Mopeds up to 50cc, max 45 km/h</td>
                  <td>CBT required. No motorways. No pillion.</td>
                </tr>
                <tr>
                  <td><strong>A1</strong></td>
                  <td>17</td>
                  <td>Up to 125cc, max 11 kW (14.6 bhp)</td>
                  <td>Power-to-weight max 0.1 kW/kg. No motorways on CBT only.</td>
                </tr>
                <tr>
                  <td><strong>A2</strong></td>
                  <td>19</td>
                  <td>Up to 35 kW (46.6 bhp)</td>
                  <td>Power-to-weight max 0.2 kW/kg. Must not be derived from a bike over 70 kW.</td>
                </tr>
                <tr>
                  <td><strong>A</strong></td>
                  <td>24 (or 21 via progressive access)</td>
                  <td>Any motorcycle, no power limit</td>
                  <td>None. Direct access (DAS) at 24, or progressive from A2 after 2 years (age 21+).</td>
                </tr>
              </tbody>
            </table>
            <div class="law-note">
              <i class="fas fa-info-circle"></i>
              <p><strong>CBT (Compulsory Basic Training)</strong> is required before riding on the road. It lasts 2 years and must be renewed if you haven't passed your full test. A full licence holder does not need to renew CBT.</p>
            </div>
            <div class="law-note">
              <i class="fas fa-info-circle"></i>
              <p><strong>Progressive Access:</strong> If you hold an A2 licence for at least 2 years, you can take a further practical test to upgrade to category A from age 21 (instead of waiting until 24 for DAS).</p>
            </div>
          </div>
        </details>

        <!-- Section: Speed Limits -->
        <details class="law-section" data-keywords="speed limit mph national built-up area single carriageway dual carriageway motorway 30 60 70 temporary">
          <summary class="law-summary">
            <i class="fas fa-gauge-high"></i>
            <span>Speed Limits</span>
            <i class="fas fa-chevron-down law-chevron"></i>
          </summary>
          <div class="law-content">
            <table class="law-table">
              <thead>
                <tr>
                  <th>Road Type</th>
                  <th>Motorcycles</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Built-up areas (street lights)</td>
                  <td><strong>30 mph</strong></td>
                  <td>Default where street lights are present unless signed otherwise</td>
                </tr>
                <tr>
                  <td>Single carriageway</td>
                  <td><strong>60 mph</strong></td>
                  <td>National speed limit applies (white circle with diagonal black stripe)</td>
                </tr>
                <tr>
                  <td>Dual carriageway</td>
                  <td><strong>70 mph</strong></td>
                  <td>Same as motorway limit for motorcycles</td>
                </tr>
                <tr>
                  <td>Motorway</td>
                  <td><strong>70 mph</strong></td>
                  <td>Unless variable limit signs indicate lower (smart motorways)</td>
                </tr>
              </tbody>
            </table>
            <div class="law-note">
              <i class="fas fa-triangle-exclamation"></i>
              <p><strong>Temporary limits</strong> (roadworks, smart motorways) are displayed on electronic signs and are legally enforceable. Average speed cameras (SPECS) are common in these zones.</p>
            </div>
            <div class="law-note">
              <i class="fas fa-info-circle"></i>
              <p>Unlike cars towing trailers, motorcycles have the <strong>same speed limits as cars</strong> on all road types. However, a motorcycle towing a trailer is limited to 60 mph on motorways and dual carriageways.</p>
            </div>
          </div>
        </details>

        <!-- Section: Motorway Rules -->
        <details class="law-section" data-keywords="motorway hard shoulder smart motorway learner 50cc prohibited breakdown refuge emergency">
          <summary class="law-summary">
            <i class="fas fa-road"></i>
            <span>Motorway Rules</span>
            <i class="fas fa-chevron-down law-chevron"></i>
          </summary>
          <div class="law-content">
            <h4>Who CAN'T use motorways:</h4>
            <ul>
              <li><i class="fas fa-ban" style="color:#e74c3c"></i> Learner riders (CBT only, no full licence)</li>
              <li><i class="fas fa-ban" style="color:#e74c3c"></i> Motorcycles under 50cc</li>
              <li><i class="fas fa-ban" style="color:#e74c3c"></i> Pedestrians, cyclists, horse riders</li>
            </ul>
            <h4>Hard Shoulder &amp; Smart Motorways:</h4>
            <ul>
              <li>On traditional motorways, the hard shoulder is for <strong>emergencies only</strong>.</li>
              <li>On <strong>All Lane Running (ALR) smart motorways</strong>, there is no hard shoulder — use Emergency Refuge Areas (ERAs) every 1–1.5 miles.</li>
              <li>A red X above a lane means it is <strong>closed</strong> — using it is an offence (£100 fine, 3 points).</li>
              <li>If you break down on a smart motorway with no ERA nearby, pull as far left as possible, switch on hazards, and exit the vehicle behind the barrier if safe.</li>
            </ul>
            <div class="law-note">
              <i class="fas fa-info-circle"></i>
              <p><strong>Full A1 licence holders</strong> (125cc) CAN use motorways as of 2022 rule clarification. Only CBT-only riders and sub-50cc machines are prohibited.</p>
            </div>
          </div>
        </details>

        <!-- Section: Filtering -->
        <details class="law-section" data-keywords="filtering lane splitting traffic stationary slow moving legal highway code">
          <summary class="law-summary">
            <i class="fas fa-arrows-left-right"></i>
            <span>Filtering</span>
            <i class="fas fa-chevron-down law-chevron"></i>
          </summary>
          <div class="law-content">
            <div class="law-highlight" style="background:rgba(46,204,113,0.1);border-left:4px solid #2ecc71;padding:12px 16px;border-radius:var(--radius);margin-bottom:16px">
              <strong><i class="fas fa-check-circle" style="color:#2ecc71"></i> Filtering is LEGAL in the UK</strong>
              <p style="margin-top:4px">There is no specific law against filtering. It is accepted practice and referenced in the Highway Code (Rule 88 for motorcyclists, Rule 211 for drivers).</p>
            </div>
            <h4>Legal Position:</h4>
            <ul>
              <li>Filtering (passing between stationary or slow-moving traffic) is <strong>not illegal</strong>.</li>
              <li>The Highway Code advises riders to "look out for pedestrians crossing between vehicles" and to be cautious.</li>
              <li>If you filter carelessly and cause an accident, you may be held <strong>partly or fully liable</strong>.</li>
            </ul>
            <h4>Best Practice:</h4>
            <ul>
              <li>Only filter when traffic is stationary or moving very slowly (under ~10 mph).</li>
              <li>Keep speed differential low — no more than 10–15 mph faster than surrounding traffic.</li>
              <li>Avoid filtering near junctions, roundabouts, or where vehicles may turn.</li>
              <li>Do not cross solid white centre lines to filter.</li>
              <li>Be aware of vehicles changing lanes without indicating.</li>
              <li>Do not filter on the left unless traffic in the right lane is turning right.</li>
            </ul>
          </div>
        </details>

        <!-- Section: Bus Lanes -->
        <details class="law-section" data-keywords="bus lane council motorcycle permitted sign times hours local authority tfl london">
          <summary class="law-summary">
            <i class="fas fa-bus"></i>
            <span>Bus Lanes</span>
            <i class="fas fa-chevron-down law-chevron"></i>
          </summary>
          <div class="law-content">
            <div class="law-highlight" style="background:rgba(241,196,15,0.1);border-left:4px solid #f1c40f;padding:12px 16px;border-radius:var(--radius);margin-bottom:16px">
              <strong><i class="fas fa-exclamation-triangle" style="color:#f1c40f"></i> Rules vary by local authority</strong>
              <p style="margin-top:4px">There is NO national rule allowing or banning motorcycles from bus lanes. Each council decides individually.</p>
            </div>
            <h4>Key Points:</h4>
            <ul>
              <li><strong>London (TfL):</strong> Motorcycles are permitted in most TfL-controlled bus lanes (but not all — check signs).</li>
              <li><strong>Other cities:</strong> Rules vary. Some allow motorcycles (e.g., Bristol, Edinburgh trials), many do not.</li>
              <li><strong>Always check the blue sign</strong> at the start of the bus lane — it lists which vehicles may use it and during which hours.</li>
              <li>If a motorcycle symbol is shown on the sign, you may use that bus lane during the hours indicated.</li>
              <li>Fines for illegal use are typically <strong>£60–£130</strong> (council-issued PCN).</li>
            </ul>
            <h4>How to Check:</h4>
            <ul>
              <li>Look at the entry sign — permitted vehicles are listed with symbols.</li>
              <li>Check operating hours — many bus lanes are only active at peak times (e.g., 7–10am, 4–7pm).</li>
              <li>Outside operating hours, anyone can use the lane.</li>
            </ul>
          </div>
        </details>

        <!-- Section: Pillion Passengers -->
        <details class="law-section" data-keywords="pillion passenger seat footpeg full licence learner child age rear">
          <summary class="law-summary">
            <i class="fas fa-user-group"></i>
            <span>Pillion Passengers</span>
            <i class="fas fa-chevron-down law-chevron"></i>
          </summary>
          <div class="law-content">
            <h4>Requirements to carry a pillion:</h4>
            <ul>
              <li>You must hold a <strong>full motorcycle licence</strong> (not just a CBT certificate).</li>
              <li>The bike must have a <strong>proper pillion seat</strong> and <strong>footpegs</strong> for the passenger.</li>
              <li>The passenger must be able to <strong>reach the footpegs</strong> and sit securely.</li>
            </ul>
            <h4>Important Restrictions:</h4>
            <ul>
              <li><i class="fas fa-ban" style="color:#e74c3c"></i> <strong>Learner riders (CBT only) CANNOT carry passengers.</strong></li>
              <li>There is <strong>no minimum age</strong> for a pillion passenger in law, but they must physically be able to reach the footpegs and wear an appropriate helmet.</li>
              <li>The rider is responsible for ensuring the passenger wears a legal helmet (unless the passenger is over 16, in which case the responsibility shifts to them).</li>
              <li>Carrying a pillion affects your stopping distance and handling — ensure your tyre pressures and suspension are adjusted.</li>
            </ul>
            <div class="law-note">
              <i class="fas fa-info-circle"></i>
              <p><strong>Sidecars:</strong> If your bike has a sidecar, different licence rules apply. A full car licence (category B) issued before 01/02/2001 includes motorcycle with sidecar entitlement.</p>
            </div>
          </div>
        </details>

        <!-- Section: Helmets -->
        <details class="law-section" data-keywords="helmet legal requirement bs ece standard visor sikh exception tinted dark">
          <summary class="law-summary">
            <i class="fas fa-helmet-safety"></i>
            <span>Helmets</span>
            <i class="fas fa-chevron-down law-chevron"></i>
          </summary>
          <div class="law-content">
            <h4>Legal Requirements:</h4>
            <ul>
              <li>All motorcycle riders and passengers on public roads <strong>must</strong> wear a protective helmet (Road Traffic Act 1988, s.16).</li>
              <li>Helmets must meet one of these standards:
                <ul>
                  <li><strong>BS 6658:1985</strong> (with BSI Kitemark)</li>
                  <li><strong>UNECE Regulation 22.05</strong> or <strong>22.06</strong> (ECE mark)</li>
                </ul>
              </li>
              <li>The helmet must be <strong>fastened securely</strong> with the chin strap.</li>
            </ul>
            <h4>Visor Rules:</h4>
            <ul>
              <li>Visors must allow at least <strong>50% light transmission</strong> during the day and <strong>80% at night</strong>.</li>
              <li>Tinted visors that don't meet the transmission standard are illegal for road use after dark.</li>
              <li>Visors should meet BS 4110 (Grade X or higher) or ECE 22.05 standard.</li>
            </ul>
            <h4>Exceptions:</h4>
            <ul>
              <li><strong>Followers of the Sikh religion</strong> wearing a turban are exempt from the helmet requirement (Motor-Cycle Crash Helmets (Religious Exemption) Act 1976).</li>
              <li>This applies to riders AND passengers.</li>
            </ul>
            <div class="law-note">
              <i class="fas fa-triangle-exclamation"></i>
              <p><strong>Penalty:</strong> Riding without a helmet is a <strong>non-endorsable fixed penalty of £500</strong>. Police can issue an immediate prohibition notice stopping you from riding.</p>
            </div>
          </div>
        </details>

        <!-- Section: Lights & Visibility -->
        <details class="law-section" data-keywords="lights drl daytime running light hi-vis visibility reflector headlight dipped beam fog">
          <summary class="law-summary">
            <i class="fas fa-lightbulb"></i>
            <span>Lights &amp; Visibility</span>
            <i class="fas fa-chevron-down law-chevron"></i>
          </summary>
          <div class="law-content">
            <h4>Headlights:</h4>
            <ul>
              <li>Motorcycles must use a <strong>dipped headlight at all times</strong> (daytime running light).</li>
              <li>This has been a legal requirement for motorcycles first used on or after 1 April 1986.</li>
              <li>Older bikes are not legally required to use DRL but it is strongly recommended.</li>
            </ul>
            <h4>Other Lighting:</h4>
            <ul>
              <li>Rear red light and number plate light must be working.</li>
              <li>Rear red reflector is required.</li>
              <li>Indicators are not legally required on bikes first registered before 1 April 1986 (hand signals suffice), but must work if fitted.</li>
              <li>Fog lights (if fitted) should only be used when visibility is below 100 metres.</li>
            </ul>
            <h4>Hi-Vis &amp; Reflective Clothing:</h4>
            <ul>
              <li><strong>Not legally required</strong>, but the Highway Code recommends wearing fluorescent/reflective clothing.</li>
              <li>Particularly recommended in poor visibility, at night, and in winter.</li>
            </ul>
          </div>
        </details>

        <!-- Section: Parking -->
        <details class="law-section" data-keywords="parking pavement meter bay disabled free motorcycle solo permit">
          <summary class="law-summary">
            <i class="fas fa-square-parking"></i>
            <span>Parking</span>
            <i class="fas fa-chevron-down law-chevron"></i>
          </summary>
          <div class="law-content">
            <h4>General Rules:</h4>
            <ul>
              <li>Motorcycles <strong>can park on the pavement</strong> in most areas (unlike cars), provided they don't cause an obstruction. However, in London boroughs this may be enforced against.</li>
              <li>Yellow line restrictions apply to motorcycles the same as cars.</li>
              <li>Many councils provide <strong>free motorcycle parking</strong> in designated solo motorcycle bays (marked with a motorcycle symbol).</li>
            </ul>
            <h4>Metered/Pay &amp; Display:</h4>
            <ul>
              <li>In many areas, motorcycles can park <strong>free in pay-and-display bays</strong> — but this varies by council. Check local signs.</li>
              <li>Westminster (London) charges motorcycles in pay-and-display bays.</li>
              <li>Some councils allow multiple motorcycles to share one car-sized bay.</li>
            </ul>
            <h4>Restrictions:</h4>
            <ul>
              <li><i class="fas fa-ban" style="color:#e74c3c"></i> <strong>Never</strong> park in disabled bays without a valid Blue Badge.</li>
              <li><i class="fas fa-ban" style="color:#e74c3c"></i> Do not park on dropped kerbs, pedestrian crossings, or cycle lanes.</li>
              <li>Motorcycles are subject to the same red route (London) and clearway restrictions as cars.</li>
            </ul>
          </div>
        </details>

        <!-- Section: Insurance & MOT -->
        <details class="law-section" data-keywords="insurance mot test road tax sorn vehicle excise duty ved class 3 years roadworthy">
          <summary class="law-summary">
            <i class="fas fa-shield-halved"></i>
            <span>Insurance &amp; MOT</span>
            <i class="fas fa-chevron-down law-chevron"></i>
          </summary>
          <div class="law-content">
            <h4>MOT Requirements:</h4>
            <ul>
              <li>Motorcycles need an MOT when they are <strong>3 years old</strong> (from the date of first registration).</li>
              <li>An MOT tests brakes, lights, steering, suspension, wheels/tyres, exhaust emissions, and frame condition.</li>
              <li>You can get an MOT up to <strong>1 month (minus a day)</strong> before the current one expires without losing the renewal date.</li>
              <li><strong>Historic vehicles:</strong> Motorcycles registered before 1 January 1977 are exempt from MOT (but must still be roadworthy).</li>
            </ul>
            <h4>Insurance:</h4>
            <ul>
              <li>Third-party insurance is the <strong>legal minimum</strong>. Options are:
                <ul>
                  <li><strong>Third Party Only (TPO)</strong> — covers damage to others only</li>
                  <li><strong>Third Party, Fire &amp; Theft (TPFT)</strong> — adds cover for your bike being stolen or set on fire</li>
                  <li><strong>Comprehensive</strong> — covers everything including damage to your own bike</li>
                </ul>
              </li>
              <li>Riding without insurance is a <strong>6–8 penalty points offence</strong> (or disqualification) plus an unlimited fine.</li>
              <li>Police can <strong>seize and destroy</strong> an uninsured vehicle.</li>
            </ul>
            <h4>SORN (Statutory Off Road Notification):</h4>
            <ul>
              <li>If your motorcycle is not taxed and not on a public road, you <strong>must</strong> declare a SORN.</li>
              <li>SORN lasts until the vehicle is taxed again or sold.</li>
              <li>Riding a SORN'd bike on public roads is an offence (fixed penalty £1,000).</li>
            </ul>
          </div>
        </details>

        <!-- Section: Noise & Exhaust -->
        <details class="law-section" data-keywords="noise exhaust decibel db aftermarket pipe baffle silencer police power section 59">
          <summary class="law-summary">
            <i class="fas fa-volume-high"></i>
            <span>Noise &amp; Exhaust</span>
            <i class="fas fa-chevron-down law-chevron"></i>
          </summary>
          <div class="law-content">
            <h4>Legal Limits:</h4>
            <ul>
              <li>UK noise limits for motorcycles (at manufacture):
                <ul>
                  <li>Up to 80cc: <strong>75 dB(A)</strong></li>
                  <li>80–175cc: <strong>77 dB(A)</strong></li>
                  <li>Over 175cc: <strong>80 dB(A)</strong></li>
                </ul>
              </li>
              <li>These are measured under specific test conditions (not just riding past).</li>
            </ul>
            <h4>Aftermarket Exhausts:</h4>
            <ul>
              <li>Replacement exhausts must be marked with either a <strong>BS AU 193</strong> stamp or carry an <strong>E-mark</strong> (European type approval).</li>
              <li>Removing baffles or using a "de-cat" pipe that increases noise beyond legal limits is illegal.</li>
              <li>A bike with an illegal exhaust can <strong>fail its MOT</strong>.</li>
            </ul>
            <h4>Police Powers:</h4>
            <ul>
              <li>Police can issue a <strong>Section 59 warning</strong> for antisocial use of a vehicle (including excessive noise).</li>
              <li>A second offence after a S59 warning allows police to <strong>seize the vehicle</strong>.</li>
              <li>Officers can also issue a <strong>vehicle defect rectification notice</strong> requiring you to fix the exhaust within 14 days.</li>
            </ul>
          </div>
        </details>

        <!-- Section: Drink/Drug Riding -->
        <details class="law-section" data-keywords="drink drive drug alcohol limit blood breath zero tolerance ban disqualification dui">
          <summary class="law-summary">
            <i class="fas fa-wine-glass"></i>
            <span>Drink &amp; Drug Riding</span>
            <i class="fas fa-chevron-down law-chevron"></i>
          </summary>
          <div class="law-content">
            <h4>Alcohol Limits (England &amp; Wales):</h4>
            <table class="law-table">
              <thead>
                <tr>
                  <th>Measure</th>
                  <th>Limit</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Blood alcohol</td>
                  <td><strong>80 mg per 100 ml of blood</strong></td>
                </tr>
                <tr>
                  <td>Breath alcohol</td>
                  <td><strong>35 micrograms per 100 ml of breath</strong></td>
                </tr>
                <tr>
                  <td>Urine alcohol</td>
                  <td><strong>107 mg per 100 ml of urine</strong></td>
                </tr>
              </tbody>
            </table>
            <div class="law-note" style="margin-top:12px">
              <i class="fas fa-triangle-exclamation"></i>
              <p><strong>Scotland has a lower limit:</strong> 50 mg per 100 ml of blood (22 micrograms breath).</p>
            </div>
            <h4>Drug Driving:</h4>
            <ul>
              <li>Specified limits exist for 17 legal and illegal drugs (Drug Driving (Specified Limits) Regulations 2014).</li>
              <li>For illegal drugs (cannabis, cocaine, MDMA etc.), the limits are set at effectively <strong>zero tolerance</strong> — any detectable amount above the very low threshold is an offence.</li>
              <li>Some prescription drugs (e.g., morphine, diazepam) have higher thresholds — you have a defence if taken as prescribed and you are not impaired.</li>
            </ul>
            <h4>Penalties:</h4>
            <ul>
              <li>Minimum <strong>12-month driving ban</strong></li>
              <li>Unlimited fine</li>
              <li>Up to <strong>6 months in prison</strong></li>
              <li>Criminal record</li>
              <li>Causing death by careless driving while over the limit: up to <strong>14 years in prison</strong></li>
            </ul>
          </div>
        </details>

        <!-- Section: Phone Use -->
        <details class="law-section" data-keywords="phone mobile handheld points fine sat nav gps mounted bluetooth hands-free">
          <summary class="law-summary">
            <i class="fas fa-mobile-screen"></i>
            <span>Phone Use</span>
            <i class="fas fa-chevron-down law-chevron"></i>
          </summary>
          <div class="law-content">
            <h4>The Law:</h4>
            <ul>
              <li>It is illegal to <strong>hold and use</strong> a phone, sat nav, tablet, or any interactive communication device while riding (even when stopped at traffic lights).</li>
              <li>This includes making calls, texting, checking social media, taking photos/video, or browsing the internet.</li>
              <li>Since 2022, the law also covers <strong>any interactive use</strong> — including scrolling playlists or using the camera.</li>
            </ul>
            <h4>Penalty:</h4>
            <ul>
              <li><strong>6 penalty points</strong> and a <strong>£200 fine</strong> (fixed penalty).</li>
              <li>If taken to court, the fine can be up to <strong>£1,000</strong> (£2,500 for goods vehicle drivers).</li>
              <li>New riders (within first 2 years of passing test): 6 points means <strong>automatic licence revocation</strong>.</li>
            </ul>
            <h4>What IS Allowed:</h4>
            <ul>
              <li><i class="fas fa-check" style="color:#2ecc71"></i> A <strong>mounted sat nav</strong> (set up before riding) — glancing at it is fine.</li>
              <li><i class="fas fa-check" style="color:#2ecc71"></i> <strong>Bluetooth intercom</strong> systems (Cardo, Sena) for calls/music via helmet speakers.</li>
              <li><i class="fas fa-check" style="color:#2ecc71"></i> Using a phone to <strong>call 999 in a genuine emergency</strong> when it is unsafe to stop.</li>
              <li><i class="fas fa-check" style="color:#2ecc71"></i> Using a phone while parked with the engine off.</li>
            </ul>
          </div>
        </details>

        <!-- Section: Towing -->
        <details class="law-section" data-keywords="towing trailer motorcycle width weight hitch maximum dimensions">
          <summary class="law-summary">
            <i class="fas fa-trailer"></i>
            <span>Towing</span>
            <i class="fas fa-chevron-down law-chevron"></i>
          </summary>
          <div class="law-content">
            <h4>Can Motorcycles Tow?</h4>
            <div class="law-highlight" style="background:rgba(46,204,113,0.1);border-left:4px solid #2ecc71;padding:12px 16px;border-radius:var(--radius);margin-bottom:16px">
              <strong><i class="fas fa-check-circle" style="color:#2ecc71"></i> Yes — motorcycles CAN tow trailers</strong>
              <p style="margin-top:4px">It's less common but perfectly legal, subject to specific rules.</p>
            </div>
            <h4>Rules &amp; Limits:</h4>
            <ul>
              <li>Maximum trailer width: <strong>1 metre</strong></li>
              <li>The trailer must not weigh more than <strong>150 kg</strong> when loaded, or two-thirds of the motorcycle's kerbweight (whichever is less).</li>
              <li>The trailer must display a <strong>number plate</strong> matching the motorcycle's registration.</li>
              <li>A <strong>suitable lighting board</strong> is required (brake lights, indicators, rear lights, reflectors).</li>
              <li>Speed limit on motorways and dual carriageways is reduced to <strong>60 mph</strong> when towing.</li>
              <li>You cannot use the outside lane of a three-lane motorway when towing.</li>
            </ul>
            <h4>Additional:</h4>
            <ul>
              <li>The trailer does not need a separate MOT if under 3,500 kg gross weight.</li>
              <li>Learner riders <strong>cannot tow</strong>.</li>
              <li>Ensure your insurance covers towing — many standard policies do not.</li>
            </ul>
          </div>
        </details>

        <!-- Section: Penalty Points -->
        <details class="law-section" data-keywords="penalty points fine offence totting up ban disqualification endorsement sp code">
          <summary class="law-summary">
            <i class="fas fa-triangle-exclamation"></i>
            <span>Penalty Points</span>
            <i class="fas fa-chevron-down law-chevron"></i>
          </summary>
          <div class="law-content">
            <h4>Common Motorcycle Offences:</h4>
            <table class="law-table">
              <thead>
                <tr>
                  <th>Offence</th>
                  <th>Points</th>
                  <th>Fine</th>
                  <th>Code</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Speeding</td>
                  <td>3–6</td>
                  <td>£100–£2,500</td>
                  <td>SP30</td>
                </tr>
                <tr>
                  <td>Using a mobile phone</td>
                  <td>6</td>
                  <td>£200</td>
                  <td>CU80</td>
                </tr>
                <tr>
                  <td>Running a red light</td>
                  <td>3</td>
                  <td>£100</td>
                  <td>TS10</td>
                </tr>
                <tr>
                  <td>No insurance</td>
                  <td>6–8</td>
                  <td>Unlimited</td>
                  <td>IN10</td>
                </tr>
                <tr>
                  <td>Careless riding</td>
                  <td>3–9</td>
                  <td>Unlimited</td>
                  <td>CD10</td>
                </tr>
                <tr>
                  <td>Dangerous riding</td>
                  <td>3–11</td>
                  <td>Unlimited</td>
                  <td>DD40</td>
                </tr>
                <tr>
                  <td>Drink/drug riding</td>
                  <td>3–11</td>
                  <td>Unlimited</td>
                  <td>DR10</td>
                </tr>
                <tr>
                  <td>Failing to stop after accident</td>
                  <td>5–10</td>
                  <td>Unlimited</td>
                  <td>AC10</td>
                </tr>
                <tr>
                  <td>No MOT</td>
                  <td>0</td>
                  <td>Up to £1,000</td>
                  <td>—</td>
                </tr>
                <tr>
                  <td>Defective tyres (per tyre)</td>
                  <td>3</td>
                  <td>£2,500</td>
                  <td>CU20</td>
                </tr>
              </tbody>
            </table>
            <h4>Totting Up:</h4>
            <ul>
              <li>Accumulating <strong>12 or more points</strong> within 3 years results in a <strong>minimum 6-month disqualification</strong>.</li>
              <li><strong>New riders</strong> (within 2 years of passing test): accumulating <strong>6 points</strong> means automatic licence revocation — you must retake both theory and practical tests.</li>
              <li>Points stay on your licence for <strong>4 years</strong> from the date of the offence (11 years for drink/drug offences).</li>
            </ul>
          </div>
        </details>

        <!-- FAQ Section -->
        <div class="law-faq" style="margin-top:32px">
          <h2 style="font-size:1.4rem;margin-bottom:16px"><i class="fas fa-circle-question"></i> Frequently Asked Questions</h2>
          
          <details class="law-section law-faq-item" data-keywords="bus lane motorcycle faq">
            <summary class="law-summary law-faq-summary">
              <i class="fas fa-q" style="font-size:0.8rem"></i>
              <span>Can motorcycles use bus lanes in the UK?</span>
              <i class="fas fa-chevron-down law-chevron"></i>
            </summary>
            <div class="law-content">
              <p><strong>It depends on the local authority.</strong> There is no national rule. In London, most TfL bus lanes allow motorcycles, but outside London each council sets its own policy. Always check the blue sign at the entry of the bus lane — if a motorcycle symbol is shown, you may use it during the hours indicated.</p>
            </div>
          </details>

          <details class="law-section law-faq-item" data-keywords="mot motorcycle faq three years">
            <summary class="law-summary law-faq-summary">
              <i class="fas fa-q" style="font-size:0.8rem"></i>
              <span>Do motorcycles need an MOT?</span>
              <i class="fas fa-chevron-down law-chevron"></i>
            </summary>
            <div class="law-content">
              <p><strong>Yes</strong>, all motorcycles over 3 years old need a valid MOT certificate. The first MOT is due on the third anniversary of the bike's registration. Bikes registered before 1 January 1977 are exempt, but must still be kept in a roadworthy condition.</p>
            </div>
          </details>

          <details class="law-section law-faq-item" data-keywords="learner pillion passenger faq">
            <summary class="law-summary law-faq-summary">
              <i class="fas fa-q" style="font-size:0.8rem"></i>
              <span>Can a learner carry a pillion passenger?</span>
              <i class="fas fa-chevron-down law-chevron"></i>
            </summary>
            <div class="law-content">
              <p><strong>No.</strong> You must hold a full motorcycle licence to carry a pillion passenger. Riders on a CBT certificate (provisional licence) are not permitted to carry passengers under any circumstances.</p>
            </div>
          </details>

          <details class="law-section law-faq-item" data-keywords="filtering legal uk lane splitting faq">
            <summary class="law-summary law-faq-summary">
              <i class="fas fa-q" style="font-size:0.8rem"></i>
              <span>Is filtering legal on a motorcycle in the UK?</span>
              <i class="fas fa-chevron-down law-chevron"></i>
            </summary>
            <div class="law-content">
              <p><strong>Yes.</strong> Filtering (passing between stationary or slow-moving traffic) is legal in the UK. There is no specific law against it. However, you can still be held liable if you filter carelessly and cause an accident. The Highway Code acknowledges filtering in Rules 88 and 211.</p>
            </div>
          </details>

          <details class="law-section law-faq-item" data-keywords="125cc motorway a1 licence faq">
            <summary class="law-summary law-faq-summary">
              <i class="fas fa-q" style="font-size:0.8rem"></i>
              <span>Can I ride a 125cc on the motorway?</span>
              <i class="fas fa-chevron-down law-chevron"></i>
            </summary>
            <div class="law-content">
              <p><strong>Only if you hold a full A1 licence.</strong> If you only have a CBT certificate (provisional licence), you cannot use motorways regardless of your bike's engine size. With a full A1 licence, you can ride your 125cc on motorways — though it's worth considering whether a 125 is practical at sustained motorway speeds.</p>
            </div>
          </details>

          <details class="law-section law-faq-item" data-keywords="helmet law required fine faq">
            <summary class="law-summary law-faq-summary">
              <i class="fas fa-q" style="font-size:0.8rem"></i>
              <span>What happens if I ride without a helmet?</span>
              <i class="fas fa-chevron-down law-chevron"></i>
            </summary>
            <div class="law-content">
              <p>You face a <strong>non-endorsable fixed penalty of up to £500</strong>. Police can also issue an immediate prohibition notice preventing you from riding further. The only exemption is for followers of the Sikh religion wearing a turban.</p>
            </div>
          </details>

          <details class="law-section law-faq-item" data-keywords="speed camera limit fine points faq">
            <summary class="law-summary law-faq-summary">
              <i class="fas fa-q" style="font-size:0.8rem"></i>
              <span>Can motorcycles be caught by speed cameras?</span>
              <i class="fas fa-chevron-down law-chevron"></i>
            </summary>
            <div class="law-content">
              <p><strong>Yes.</strong> While rear-facing cameras (Gatso) may struggle as motorcycles don't have front plates, forward-facing cameras, average speed cameras (SPECS/VECTOR), and police with handheld devices can all catch motorcycles. Mobile speed vans and police intercepts are increasingly targeting motorcyclists. Penalty: minimum 3 points and £100 fine, scaling up with speed.</p>
            </div>
          </details>

          <details class="law-section law-faq-item" data-keywords="tow trailer motorcycle faq legal">
            <summary class="law-summary law-faq-summary">
              <i class="fas fa-q" style="font-size:0.8rem"></i>
              <span>Can a motorcycle tow a trailer?</span>
              <i class="fas fa-chevron-down law-chevron"></i>
            </summary>
            <div class="law-content">
              <p><strong>Yes.</strong> Motorcycles can legally tow a trailer up to 1 metre wide. The trailer must weigh no more than 150 kg when loaded or two-thirds of the motorcycle's kerbweight (whichever is less). You'll need proper lighting, a matching number plate, and your speed limit drops to 60 mph on motorways and dual carriageways.</p>
            </div>
          </details>
        </div>

        <!-- Disclaimer -->
        <div class="law-disclaimer" style="margin-top:32px;padding:16px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);font-size:0.85rem;color:var(--text-muted)">
          <p><i class="fas fa-info-circle"></i> <strong>Disclaimer:</strong> This page provides general guidance on UK motorcycle law and is intended as a quick reference only. Laws can change — always check <a href="https://www.legislation.gov.uk" target="_blank" rel="noopener" style="color:var(--accent)">legislation.gov.uk</a> and the <a href="https://www.gov.uk/highway-code" target="_blank" rel="noopener" style="color:var(--accent)">Highway Code</a> for the latest official rules. This is not legal advice.</p>
        </div>
      </div>
    </div>

    <style>
      .law-reference {
        color: var(--text);
      }
      .law-container {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .law-section {
        background: var(--bg-card);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        overflow: hidden;
        transition: box-shadow 0.2s;
      }
      .law-section[open] {
        box-shadow: 0 2px 12px rgba(0,0,0,0.1);
      }
      .law-summary {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px 20px;
        cursor: pointer;
        font-weight: 600;
        font-size: 1.05rem;
        list-style: none;
        color: var(--text);
        user-select: none;
      }
      .law-summary::-webkit-details-marker { display: none; }
      .law-summary::marker { display: none; content: ''; }
      .law-summary i:first-child {
        color: var(--accent);
        width: 24px;
        text-align: center;
      }
      .law-summary span {
        flex: 1;
      }
      .law-chevron {
        font-size: 0.75rem;
        color: var(--text-muted);
        transition: transform 0.2s;
      }
      .law-section[open] .law-chevron {
        transform: rotate(180deg);
      }
      .law-content {
        padding: 0 20px 20px;
        color: var(--text-secondary);
        line-height: 1.6;
      }
      .law-content h4 {
        color: var(--text);
        margin: 16px 0 8px;
        font-size: 0.95rem;
      }
      .law-content h4:first-child {
        margin-top: 0;
      }
      .law-content ul {
        padding-left: 20px;
        margin: 8px 0;
      }
      .law-content li {
        margin-bottom: 6px;
      }
      .law-content li ul {
        margin-top: 4px;
      }
      .law-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.9rem;
        margin: 12px 0;
      }
      .law-table th {
        background: rgba(255,255,255,0.03);
        text-align: left;
        padding: 10px 12px;
        border-bottom: 2px solid var(--border);
        color: var(--text);
        font-weight: 600;
      }
      .law-table td {
        padding: 10px 12px;
        border-bottom: 1px solid var(--border);
      }
      .law-table tr:last-child td {
        border-bottom: none;
      }
      .law-note {
        display: flex;
        gap: 10px;
        padding: 12px 16px;
        background: rgba(255,255,255,0.02);
        border-radius: var(--radius);
        margin-top: 12px;
        border: 1px solid var(--border);
        font-size: 0.9rem;
      }
      .law-note i {
        color: var(--accent);
        margin-top: 2px;
      }
      .law-note p {
        margin: 0;
      }
      .law-faq-summary {
        font-size: 0.95rem;
      }
      .law-section.law-hidden {
        display: none;
      }
      .law-search-box input::placeholder {
        color: var(--text-muted);
      }
      @media (max-width: 600px) {
        .law-summary {
          padding: 12px 14px;
          font-size: 0.95rem;
          gap: 10px;
        }
        .law-content {
          padding: 0 14px 14px;
        }
        .law-table {
          font-size: 0.8rem;
        }
        .law-table th, .law-table td {
          padding: 8px 6px;
        }
      }
    </style>
  `;
}

// Global controller for search/filter functionality
const motorcycleLaw = {
  filterSections(query) {
    var q = query.toLowerCase().trim();
    var sections = document.querySelectorAll('.law-section');
    sections.forEach(function(section) {
      if (!q) {
        section.classList.remove('law-hidden');
        return;
      }
      var keywords = (section.getAttribute('data-keywords') || '').toLowerCase();
      var text = section.textContent.toLowerCase();
      if (keywords.indexOf(q) !== -1 || text.indexOf(q) !== -1) {
        section.classList.remove('law-hidden');
      } else {
        section.classList.add('law-hidden');
      }
    });
  },

  clearSearch() {
    var input = document.getElementById('lawSearchInput');
    if (input) {
      input.value = '';
      this.filterSections('');
    }
  }
};
