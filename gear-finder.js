/**
 * VisorUp Gear Finder
 * Interactive quiz that recommends motorcycle gear based on rider profile.
 * Products link to SportsBikeShop with affiliate tracking.
 */

const GEAR_RECOMMENDATIONS = {
  // Helmets
  helmets: {
    beginner: {
      budget: [
        { name: 'HJC i70', price: '£130', why: 'Great entry-level full-face with Pinlock-ready visor', search: 'HJC i70' },
        { name: 'LS2 Stream II', price: '£90', why: 'Lightweight polycarbonate, excellent vents', search: 'LS2 Stream II' },
      ],
      mid: [
        { name: 'Shoei NXR2', price: '£380', why: 'Premium fit and finish, superb ventilation', search: 'Shoei NXR2' },
        { name: 'HJC RPHA 71', price: '£350', why: 'Carbon-glass shell, built-in sun visor', search: 'HJC RPHA 71' },
      ],
      premium: [
        { name: 'Shoei GT-Air 3', price: '£500', why: 'Touring king — quiet, comfortable, integrated sun visor', search: 'Shoei GT-Air 3' },
        { name: 'Arai Profile-V', price: '£480', why: 'Exceptional comfort on long rides, legendary quality', search: 'Arai Profile-V' },
      ],
    },
    touring: {
      budget: [
        { name: 'HJC C91', price: '£150', why: 'Flip-up with sun visor — practical for touring', search: 'HJC C91' },
        { name: 'LS2 Advant X', price: '£180', why: 'Modular helmet with Pinlock included', search: 'LS2 Advant' },
      ],
      mid: [
        { name: 'Schuberth C5', price: '£450', why: 'Ultra-quiet modular, perfect for long days', search: 'Schuberth C5' },
        { name: 'Shoei Neotec 3', price: '£530', why: 'Premium flip-up, integrated comms-ready', search: 'Shoei Neotec 3' },
      ],
      premium: [
        { name: 'Schuberth C5 Carbon', price: '£580', why: 'Lightest modular on the market, whisper-quiet', search: 'Schuberth C5' },
        { name: 'Shoei Neotec 3', price: '£530', why: 'Best flip-up ever made — touring benchmark', search: 'Shoei Neotec 3' },
      ],
    },
    adventure: {
      budget: [
        { name: 'LS2 Explorer Carbon', price: '£200', why: 'ADV-style with peak and visor', search: 'LS2 Explorer' },
        { name: 'HJC i50', price: '£130', why: 'Off-road style, works with goggles', search: 'HJC i50' },
      ],
      mid: [
        { name: 'Shoei Hornet ADV', price: '£420', why: 'Dual-sport legend — road and trail', search: 'Shoei Hornet ADV' },
        { name: 'Arai Tour-X5', price: '£450', why: 'Adventure touring benchmark', search: 'Arai Tour-X5' },
      ],
      premium: [
        { name: 'Arai Tour-X5', price: '£520', why: 'Unmatched comfort and protection for ADV riding', search: 'Arai Tour-X5' },
        { name: 'Shoei Hornet ADV', price: '£420', why: 'World-class dual-sport helmet', search: 'Shoei Hornet ADV' },
      ],
    },
  },

  // Jackets
  jackets: {
    fairWeather: {
      budget: [
        { name: 'RST S1 Mesh Textile Jacket', price: '£130', why: 'Maximum airflow for summer, CE armour included', search: 'RST S1 Mesh' },
        { name: 'Oxford Delta 1.0 Air Jacket', price: '£100', why: 'Lightweight mesh with back protector pocket', search: 'Oxford Delta Air' },
      ],
      mid: [
        { name: 'Rev\'it Eclipse 2 Jacket', price: '£220', why: 'Premium ventilated jacket, excellent fit', search: "Rev'it Eclipse" },
        { name: 'Dainese Air Fast Textile Jacket', price: '£200', why: 'Italian style, great summer airflow', search: 'Dainese Air Fast' },
      ],
      premium: [
        { name: 'Klim Marrakesh Jacket', price: '£380', why: 'Adventure-touring mesh, D3O armour', search: 'Klim Marrakesh' },
        { name: 'Rev\'it Tornado 4 Jacket', price: '£350', why: 'Full mesh panels, touring-ready features', search: "Rev'it Tornado" },
      ],
    },
    allWeather: {
      budget: [
        { name: 'RST Maverick Evo Textile Jacket', price: '£180', why: 'Waterproof membrane, thermal liner, CE armour', search: 'RST Maverick' },
        { name: 'Oxford Continental Jacket', price: '£200', why: '3-layer system — waterproof, thermal, mesh', search: 'Oxford Continental' },
      ],
      mid: [
        { name: 'Rev\'it Defender 3 GTX Jacket', price: '£500', why: 'Gore-Tex, adventure-touring benchmark', search: "Rev'it Defender" },
        { name: 'Rukka ROR Jacket', price: '£600', why: 'Finnish engineering, Gore-Tex, lifetime waterproofing', search: 'Rukka ROR' },
      ],
      premium: [
        { name: 'Klim Badlands Pro A3 Jacket', price: '£900', why: 'The ultimate all-weather touring jacket', search: 'Klim Badlands Pro' },
        { name: 'Rukka Ecuado-R Jacket', price: '£750', why: 'Gore-Tex Pro, unlimited mileage guarantee', search: 'Rukka Ecuado' },
      ],
    },
    winter: {
      budget: [
        { name: 'RST Atlas Textile Jacket', price: '£200', why: 'Waterproof, heavy thermal liner for winter', search: 'RST Atlas' },
        { name: 'Oxford Mondial Jacket', price: '£250', why: 'Laminated waterproof, warm and protective', search: 'Oxford Mondial' },
      ],
      mid: [
        { name: 'Dainese Carve Master 3 GTX Jacket', price: '£450', why: 'Gore-Tex, detachable thermal, winter touring', search: 'Dainese Carve Master' },
        { name: 'Held Carese Evo GTX Jacket', price: '£500', why: 'German-built Gore-Tex touring jacket', search: 'Held Carese' },
      ],
      premium: [
        { name: 'Rukka Nivala 2.0 Jacket', price: '£800', why: 'Legendary Finnish winter touring jacket', search: 'Rukka Nivala' },
        { name: 'Klim Kodiak Jacket', price: '£750', why: 'Extreme cold-weather touring', search: 'Klim Kodiak' },
      ],
    },
  },

  // Gloves
  gloves: {
    fairWeather: {
      budget: [
        { name: 'RST Freestyle 2 CE Gloves', price: '£45', why: 'Short cuff, touchscreen, great value', search: 'RST Freestyle 2' },
        { name: 'Oxford RP-6S Gloves', price: '£45', why: 'Sport-touring, palm slider, CE rated', search: 'Oxford RP-6S' },
      ],
      mid: [
        { name: 'Alpinestars Mustang V3 Gloves', price: '£85', why: 'Classic leather, Plasma knuckle, touchscreen', search: 'Alpinestars Mustang V3' },
        { name: 'Rev\'it Fly 4 Gloves', price: '£90', why: 'Ventilated summer touring, CE Level 1', search: "Rev'it Fly" },
      ],
      premium: [
        { name: 'Knox Orsa Leather OR4', price: '£120', why: 'BOA closure, scaphoid protection, premium feel', search: 'Knox Orsa' },
        { name: 'Held Air N Dry II GTX', price: '£130', why: 'Convertible waterproof/summer in one', search: 'Held Air N Dry' },
      ],
    },
    allWeather: {
      budget: [
        { name: 'Richa Invader GTX Gloves', price: '£70', why: 'Gore-Tex waterproof, thermal liner', search: 'Richa Invader' },
        { name: 'Oxford Montreal 4.0 Gloves', price: '£60', why: 'Waterproof with Hipora membrane', search: 'Oxford Montreal' },
      ],
      mid: [
        { name: 'Rev\'it Stratos 3 GTX Gloves', price: '£130', why: 'Gore-Tex, touring-ready, touchscreen', search: "Rev'it Stratos" },
        { name: 'Held Madoc Max GTX', price: '£120', why: 'Gore-Tex, kangaroo leather palm', search: 'Held Madoc' },
      ],
      premium: [
        { name: 'Rukka Virium 2.0 GTX', price: '£170', why: 'Gore-Tex + Gore Grip, best wet-weather grip', search: 'Rukka Virium' },
        { name: 'Alpinestars WR-X GTX Gloves', price: '£160', why: 'Premium Gore-Tex touring glove', search: 'Alpinestars WR-X' },
      ],
    },
  },

  // Boots
  boots: {
    touring: {
      budget: [
        { name: 'RST Axiom CE Boots', price: '£100', why: 'Waterproof, ankle protection, walkable', search: 'RST Axiom' },
        { name: 'Spada Braker WP Boots', price: '£80', why: 'Short touring boot, waterproof, comfortable', search: 'Spada Braker' },
      ],
      mid: [
        { name: 'Alpinestars RT-8 GTX Boots', price: '£250', why: 'Gore-Tex, premium comfort for all-day rides', search: 'Alpinestars RT-8' },
        { name: 'Rev\'it Pioneer GTX Boots', price: '£280', why: 'ADV touring, Gore-Tex, ankle pivot', search: "Rev'it Pioneer" },
      ],
      premium: [
        { name: 'Sidi Adventure 2 GTX', price: '£300', why: 'Legendary touring boot — lasts years', search: 'Sidi Adventure' },
        { name: 'Klim Havoc GTX BOA Boots', price: '£350', why: 'BOA closure, ultimate touring comfort', search: 'Klim Havoc' },
      ],
    },
  },

  // Luggage
  luggage: {
    touring: {
      budget: [
        { name: 'Oxford Aqua T-50 Roll Bag', price: '£60', why: 'Waterproof 50L tail bag — no rack needed', search: 'Oxford Aqua T-50' },
        { name: 'Kriega US-20 Drypack', price: '£70', why: 'Bulletproof 20L drybag, universal fit', search: 'Kriega US-20' },
      ],
      mid: [
        { name: 'Givi Trekker Outback 48L', price: '£260', why: 'Aluminium panniers, expedition-grade', search: 'Givi Trekker Outback' },
        { name: 'Kriega OS-32 Panniers', price: '£300', why: 'Soft panniers, no rack needed, 100% waterproof', search: 'Kriega OS-32' },
      ],
      premium: [
        { name: 'SW-Motech TRAX ADV System', price: '£600', why: 'Full aluminium pannier system, lockable', search: 'SW-Motech TRAX' },
        { name: 'Kriega Overlander-S System', price: '£550', why: 'Modular soft luggage, works on any bike', search: 'Kriega Overlander' },
      ],
    },
  },

  // Electronics
  electronics: {
    all: {
      budget: [
        { name: 'Oxford USB Dual Charger', price: '£25', why: 'Keep devices charged on the move', search: 'Oxford USB Charger' },
        { name: 'Quad Lock Motorcycle Mount', price: '£70', why: 'Vibration-dampened phone mount', search: 'Quad Lock Motorcycle' },
      ],
      mid: [
        { name: 'Cardo Packtalk Edge', price: '£280', why: 'Premium mesh intercom, 15+ riders', search: 'Cardo Packtalk' },
        { name: 'Sena 50S', price: '£300', why: 'Mesh 2.0, Harman Kardon speakers', search: 'Sena 50S' },
      ],
      premium: [
        { name: 'Cardo Packtalk Neo', price: '£350', why: 'Latest mesh tech, natural voice operation', search: 'Cardo Packtalk Neo' },
        { name: 'GoPro Hero 13 Black', price: '£350', why: 'Capture every ride in stunning detail', search: 'GoPro Hero' },
      ],
    },
  },
};

function renderGearFinder() {
  return `
    <div class="gear-finder">
      <div class="content-hero" style="background:linear-gradient(135deg, var(--bg-primary), var(--bg-secondary))">
        <div class="hero-content">
          <span class="hero-badge"><i class="fas fa-hat-wizard"></i> Gear Finder</span>
          <h1>Find Your Perfect Gear</h1>
          <p class="hero-subtitle">Answer a few questions and we'll recommend the best motorcycle gear for your riding style, budget, and conditions.</p>
        </div>
      </div>

      <div class="gear-finder-container" style="max-width:800px;margin:0 auto;padding:24px">
        <!-- Step 1: Experience -->
        <div class="gf-step active" id="gfStep1">
          <div class="gf-step-header">
            <span class="gf-step-num">1</span>
            <div>
              <h3>What's your experience level?</h3>
              <p class="gf-step-sub">This helps us recommend appropriate protection levels</p>
            </div>
          </div>
          <div class="gf-options">
            <button class="gf-option" onclick="gearFinder.setAnswer('experience','beginner')">
              <i class="fas fa-seedling"></i>
              <strong>Beginner</strong>
              <span>New rider or just passed your test</span>
            </button>
            <button class="gf-option" onclick="gearFinder.setAnswer('experience','intermediate')">
              <i class="fas fa-road"></i>
              <strong>Intermediate</strong>
              <span>A few years riding, done some trips</span>
            </button>
            <button class="gf-option" onclick="gearFinder.setAnswer('experience','advanced')">
              <i class="fas fa-mountain"></i>
              <strong>Advanced</strong>
              <span>Seasoned rider, thousands of miles</span>
            </button>
          </div>
        </div>

        <!-- Step 2: Riding Style -->
        <div class="gf-step" id="gfStep2">
          <div class="gf-step-header">
            <span class="gf-step-num">2</span>
            <div>
              <h3>How do you mainly ride?</h3>
              <p class="gf-step-sub">Different styles need different gear features</p>
            </div>
          </div>
          <div class="gf-options">
            <button class="gf-option" onclick="gearFinder.setAnswer('style','touring')">
              <i class="fas fa-route"></i>
              <strong>Touring</strong>
              <span>Long-distance trips, multi-day rides</span>
            </button>
            <button class="gf-option" onclick="gearFinder.setAnswer('style','commuting')">
              <i class="fas fa-city"></i>
              <strong>Commuting</strong>
              <span>Daily rides to work, mostly urban</span>
            </button>
            <button class="gf-option" onclick="gearFinder.setAnswer('style','sport')">
              <i class="fas fa-flag-checkered"></i>
              <strong>Sport / Weekend</strong>
              <span>Spirited riding, twisty roads</span>
            </button>
            <button class="gf-option" onclick="gearFinder.setAnswer('style','adventure')">
              <i class="fas fa-compass"></i>
              <strong>Adventure</strong>
              <span>Mix of road and trail, explore everywhere</span>
            </button>
          </div>
        </div>

        <!-- Step 3: Weather -->
        <div class="gf-step" id="gfStep3">
          <div class="gf-step-header">
            <span class="gf-step-num">3</span>
            <div>
              <h3>What weather do you ride in?</h3>
              <p class="gf-step-sub">This is Britain — be honest!</p>
            </div>
          </div>
          <div class="gf-options">
            <button class="gf-option" onclick="gearFinder.setAnswer('weather','fairWeather')">
              <i class="fas fa-sun"></i>
              <strong>Fair Weather</strong>
              <span>I only ride when it's dry and warm</span>
            </button>
            <button class="gf-option" onclick="gearFinder.setAnswer('weather','allWeather')">
              <i class="fas fa-cloud-sun-rain"></i>
              <strong>All Weather</strong>
              <span>Rain or shine, I'm out there</span>
            </button>
            <button class="gf-option" onclick="gearFinder.setAnswer('weather','winter')">
              <i class="fas fa-snowflake"></i>
              <strong>Year-Round / Winter</strong>
              <span>I ride 12 months, including cold and dark</span>
            </button>
          </div>
        </div>

        <!-- Step 4: Budget -->
        <div class="gf-step" id="gfStep4">
          <div class="gf-step-header">
            <span class="gf-step-num">4</span>
            <div>
              <h3>What's your budget per item?</h3>
              <p class="gf-step-sub">Good gear exists at every price point</p>
            </div>
          </div>
          <div class="gf-options">
            <button class="gf-option" onclick="gearFinder.setAnswer('budget','budget')">
              <i class="fas fa-coins"></i>
              <strong>Budget-Friendly</strong>
              <span>Best value, under £150 per item</span>
            </button>
            <button class="gf-option" onclick="gearFinder.setAnswer('budget','mid')">
              <i class="fas fa-wallet"></i>
              <strong>Mid-Range</strong>
              <span>£150–400 per item, great quality</span>
            </button>
            <button class="gf-option" onclick="gearFinder.setAnswer('budget','premium')">
              <i class="fas fa-gem"></i>
              <strong>Premium</strong>
              <span>£400+, the best money can buy</span>
            </button>
          </div>
        </div>

        <!-- Step 5: What gear -->
        <div class="gf-step" id="gfStep5">
          <div class="gf-step-header">
            <span class="gf-step-num">5</span>
            <div>
              <h3>What gear are you looking for?</h3>
              <p class="gf-step-sub">Select all that apply</p>
            </div>
          </div>
          <div class="gf-options gf-multi">
            <button class="gf-option gf-toggle" data-gear="helmet" onclick="gearFinder.toggleGear(this,'helmet')">
              <i class="fas fa-helmet-safety"></i>
              <strong>Helmet</strong>
            </button>
            <button class="gf-option gf-toggle" data-gear="jacket" onclick="gearFinder.toggleGear(this,'jacket')">
              <i class="fas fa-vest"></i>
              <strong>Jacket</strong>
            </button>
            <button class="gf-option gf-toggle" data-gear="gloves" onclick="gearFinder.toggleGear(this,'gloves')">
              <i class="fas fa-mitten"></i>
              <strong>Gloves</strong>
            </button>
            <button class="gf-option gf-toggle" data-gear="boots" onclick="gearFinder.toggleGear(this,'boots')">
              <i class="fas fa-shoe-prints"></i>
              <strong>Boots</strong>
            </button>
            <button class="gf-option gf-toggle" data-gear="luggage" onclick="gearFinder.toggleGear(this,'luggage')">
              <i class="fas fa-suitcase-rolling"></i>
              <strong>Luggage</strong>
            </button>
            <button class="gf-option gf-toggle" data-gear="electronics" onclick="gearFinder.toggleGear(this,'electronics')">
              <i class="fas fa-headset"></i>
              <strong>Electronics</strong>
            </button>
          </div>
          <button class="gf-submit" onclick="gearFinder.showResults()" style="margin-top:16px">
            <i class="fas fa-wand-magic-sparkles"></i> Show My Recommendations
          </button>
        </div>

        <!-- Results -->
        <div class="gf-step" id="gfResults"></div>
      </div>
    </div>
  `;
}

var GEAR_PICKS = null;

const gearFinder = {
  answers: { experience: '', style: '', weather: '', budget: '', gear: [] },
  currentStep: 1,

  loadPicks: function() {
    if (GEAR_PICKS) return;
    fetch('public/data/shop/gear-picks.json')
      .then(function(r) { return r.json(); })
      .then(function(j) { GEAR_PICKS = j; })
      .catch(function() {});
  },

  setAnswer(key, value) {
    this.answers[key] = value;
    // Highlight selected
    var step = document.getElementById('gfStep' + this.currentStep);
    step.querySelectorAll('.gf-option').forEach(function(btn) { btn.classList.remove('selected'); });
    event.currentTarget.classList.add('selected');
    // Auto-advance after short delay
    var self = this;
    setTimeout(function() {
      self.currentStep++;
      self.showStep(self.currentStep);
    }, 300);
  },

  toggleGear(btn, gear) {
    btn.classList.toggle('selected');
    var idx = this.answers.gear.indexOf(gear);
    if (idx === -1) this.answers.gear.push(gear);
    else this.answers.gear.splice(idx, 1);
  },

  showStep(n) {
    document.querySelectorAll('.gf-step').forEach(function(s) { s.classList.remove('active'); });
    var step = document.getElementById('gfStep' + n);
    if (step) {
      step.classList.add('active');
      step.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  },

  showResults() {
    if (this.answers.gear.length === 0) {
      alert('Please select at least one type of gear.');
      return;
    }

    var a = this.answers;
    var html = '<div class="gf-results-header">' +
      '<h2><i class="fas fa-wand-magic-sparkles"></i> Your Gear Recommendations</h2>' +
      '<p>Based on your profile: <strong>' + a.experience + '</strong> rider, <strong>' + a.style + '</strong> style, ' +
      '<strong>' + a.weather.replace('fairWeather', 'fair weather').replace('allWeather', 'all-weather') + '</strong> conditions, ' +
      '<strong>' + a.budget + '</strong> budget</p>' +
      '<button class="gf-restart" onclick="gearFinder.restart()"><i class="fas fa-rotate-left"></i> Start Over</button>' +
      '</div>';

    var affiliate = '#/28914,3714,0';

    // Helmet recommendations
    if (a.gear.includes('helmet')) {
      var helmets = this.getRecommendations('helmets', a.style === 'adventure' ? 'adventure' : a.style === 'touring' ? 'touring' : 'beginner', a.budget);
      if (helmets) html += this.renderCategory('Helmet', 'fa-helmet-safety', helmets, affiliate);
    }

    // Jacket recommendations
    if (a.gear.includes('jacket')) {
      var jackets = this.getRecommendations('jackets', a.weather, a.budget);
      if (jackets) html += this.renderCategory('Jacket', 'fa-vest', jackets, affiliate);
    }

    // Gloves
    if (a.gear.includes('gloves')) {
      var weather = a.weather === 'winter' ? 'allWeather' : a.weather;
      var gloves = this.getRecommendations('gloves', weather, a.budget);
      if (gloves) html += this.renderCategory('Gloves', 'fa-mitten', gloves, affiliate);
    }

    // Boots
    if (a.gear.includes('boots')) {
      var boots = this.getRecommendations('boots', 'touring', a.budget);
      if (boots) html += this.renderCategory('Boots', 'fa-shoe-prints', boots, affiliate);
    }

    // Luggage
    if (a.gear.includes('luggage')) {
      var luggage = this.getRecommendations('luggage', 'touring', a.budget);
      if (luggage) html += this.renderCategory('Luggage', 'fa-suitcase-rolling', luggage, affiliate);
    }

    // Electronics
    if (a.gear.includes('electronics')) {
      var electronics = this.getRecommendations('electronics', 'all', a.budget);
      if (electronics) html += this.renderCategory('Electronics', 'fa-headset', electronics, affiliate);
    }

    // Pro tips based on answers
    html += '<div class="gf-tips">' +
      '<h3><i class="fas fa-lightbulb"></i> Pro Tips for Your Setup</h3>' +
      '<ul>';

    if (a.experience === 'beginner') {
      html += '<li><strong>Prioritise protection over style.</strong> CE Level 2 armour in your jacket and trousers is worth the investment.</li>';
      html += '<li><strong>Try before you buy.</strong> Helmet fit varies massively between brands — visit a shop to find your head shape.</li>';
    }
    if (a.weather === 'allWeather' || a.weather === 'winter') {
      html += '<li><strong>Layering beats one thick jacket.</strong> A base layer + mid layer + waterproof shell gives you flexibility.</li>';
      html += '<li><strong>Waterproof gloves are non-negotiable</strong> for UK touring. Cold wet hands are dangerous.</li>';
    }
    if (a.style === 'touring') {
      html += '<li><strong>Comfort trumps everything on long rides.</strong> A quiet helmet and well-fitted jacket will make or break a tour.</li>';
      html += '<li><strong>Invest in good luggage.</strong> Waterproof, secure, and easy to remove — you\'ll use it for years.</li>';
    }
    if (a.style === 'adventure') {
      html += '<li><strong>Get boots with ankle pivot.</strong> ADV boots need to let you stand on the pegs comfortably.</li>';
    }
    if (a.budget === 'budget') {
      html += '<li><strong>Last season\'s gear is fantastic value.</strong> Check the clearance section — same quality, 30-50% off.</li>';
    }

    html += '</ul></div>';

    // CTA
    html += '<div class="gf-cta">' +
      '<p>All products available from our partner <strong>SportsBikeShop</strong> with free UK delivery and 365-day returns.</p>' +
      '<a href="https://www.sportsbikeshop.co.uk' + affiliate + '" target="_blank" rel="noopener sponsored" class="gf-shop-btn">' +
      '<i class="fas fa-external-link-alt"></i> Browse All Gear at SportsBikeShop</a>' +
      '</div>';

    var results = document.getElementById('gfResults');
    results.innerHTML = html;
    results.classList.add('active');
    results.scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (typeof VisorUpAnalytics !== 'undefined') {
      VisorUpAnalytics.trackToolUsage('gear-finder', {
        experience: a.experience, style: a.style, weather: a.weather, budget: a.budget, gear: a.gear.join(',')
      });
    }
  },

  getRecommendations(category, subKey, budget) {
    var source = (GEAR_PICKS && GEAR_PICKS[category]) ? GEAR_PICKS : GEAR_RECOMMENDATIONS;
    var cat = source[category];
    if (!cat) return null;
    var sub = cat[subKey] || cat[Object.keys(cat)[0]];
    if (!sub) return null;
    var picks = sub[budget] || sub['mid'] || sub[Object.keys(sub)[0]];
    return (picks && picks.length) ? picks : null;
  },

  renderCategory(title, icon, items, affiliate) {
    var html = '<div class="gf-category">' +
      '<h3><i class="fas ' + icon + '"></i> ' + title + '</h3>' +
      '<div class="gf-product-grid">';

    items.forEach(function(item) {
      var url = item.url ? item.url
        : 'https://www.sportsbikeshop.co.uk/search/?search=' + encodeURIComponent(item.search) + affiliate;
      var img = item.thumb
        ? '<a href="' + url + '" target="_blank" rel="noopener sponsored" class="gf-product-img"><img src="' + item.thumb + '" alt="' + (item.name || '').replace(/"/g, '&quot;') + '" loading="lazy" onerror="var p=this.closest(\'.gf-product-img\'); if(p) p.style.display=\'none\';"></a>'
        : '';
      var brand = item.brand ? '<span class="gf-product-brand">' + item.brand + '</span>' : '';
      html += '<div class="gf-product-card">' + img +
        '<div class="gf-product-info">' +
        brand +
        '<strong>' + item.name + '</strong>' +
        '<span class="gf-product-price">' + item.price + '</span>' +
        '<p class="gf-product-why">' + item.why + '</p>' +
        '</div>' +
        '<a href="' + url + '" target="_blank" rel="noopener sponsored" class="gf-buy-btn">' +
        'View product <i class="fas fa-external-link-alt" style="font-size:10px"></i></a>' +
        '</div>';
    });

    html += '</div></div>';
    return html;
  },

  restart() {
    this.answers = { experience: '', style: '', weather: '', budget: '', gear: [] };
    this.currentStep = 1;
    document.querySelectorAll('.gf-step').forEach(function(s) { s.classList.remove('active'); });
    document.querySelectorAll('.gf-option').forEach(function(b) { b.classList.remove('selected'); });
    document.getElementById('gfStep1').classList.add('active');
    document.getElementById('gfStep1').scrollIntoView({ behavior: 'smooth' });
  }
};
