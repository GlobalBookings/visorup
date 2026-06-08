/**
 * Fuel Range Planner
 * Enter bike tank size + MPG, see range on map with fuel stations.
 */

const COMMON_BIKES = [
  { name: 'BMW R1250GS', tank: 20, mpg: 48 },
  { name: 'BMW R1250GS Adventure', tank: 30, mpg: 46 },
  { name: 'Triumph Tiger 1200', tank: 20, mpg: 45 },
  { name: 'Triumph Tiger 900', tank: 20, mpg: 55 },
  { name: 'Honda Africa Twin', tank: 24.8, mpg: 50 },
  { name: 'Yamaha Tenere 700', tank: 16, mpg: 60 },
  { name: 'KTM 1290 Super Adventure', tank: 23, mpg: 42 },
  { name: 'Ducati Multistrada V4', tank: 22, mpg: 44 },
  { name: 'Kawasaki Versys 1000', tank: 21, mpg: 48 },
  { name: 'Suzuki V-Strom 1050', tank: 20, mpg: 50 },
  { name: 'Honda CB500X', tank: 17.7, mpg: 70 },
  { name: 'Kawasaki Z650', tank: 15, mpg: 58 },
  { name: 'Yamaha MT-07', tank: 14, mpg: 62 },
  { name: 'Royal Enfield Himalayan', tank: 15, mpg: 65 },
  { name: 'Harley-Davidson Pan America', tank: 21.2, mpg: 42 },
  { name: 'BMW F900XR', tank: 15.5, mpg: 55 },
  { name: 'Triumph Speed Triple', tank: 15.5, mpg: 42 },
  { name: 'Honda CBR650R', tank: 15.4, mpg: 52 },
  { name: 'Custom / Other', tank: 0, mpg: 0 },
];

function renderFuelRange() {
  var bikeOptions = COMMON_BIKES.map(function(b) {
    return '<option value="' + b.name + '" data-tank="' + b.tank + '" data-mpg="' + b.mpg + '">' + b.name + '</option>';
  }).join('');

  return '<div class="fuel-range">' +
    '<div class="tool-hero">' +
      '<div class="hero-content">' +
        '<span class="hero-badge"><i class="fas fa-gas-pump"></i> Fuel Range Planner</span>' +
        '<h1>How Far Can You Ride?</h1>' +
        '<p class="hero-subtitle">Enter your bike details to calculate your fuel range and find stations along your route. Uses 9,913 UK fuel stations.</p>' +
      '</div>' +
    '</div>' +
    '<div class="fuel-range-container" style="max-width:800px;margin:0 auto;padding:24px">' +

      '<div class="fr-input-section">' +
        '<h3><i class="fas fa-motorcycle"></i> Your Bike</h3>' +
        '<div class="fr-row">' +
          '<div class="fr-field">' +
            '<label>Select Bike</label>' +
            '<select id="frBikeSelect" onchange="fuelRange.selectBike(this.value)">' +
              '<option value="">-- Choose your bike --</option>' +
              bikeOptions +
            '</select>' +
          '</div>' +
        '</div>' +
        '<div class="fr-row">' +
          '<div class="fr-field">' +
            '<label>Tank Size (litres)</label>' +
            '<input type="number" id="frTank" placeholder="e.g. 20" step="0.1" oninput="fuelRange.calculate()">' +
          '</div>' +
          '<div class="fr-field">' +
            '<label>Fuel Economy (MPG)</label>' +
            '<input type="number" id="frMpg" placeholder="e.g. 50" step="1" oninput="fuelRange.calculate()">' +
          '</div>' +
        '</div>' +
        '<div class="fr-row">' +
          '<div class="fr-field">' +
            '<label>Riding Style</label>' +
            '<select id="frStyle" onchange="fuelRange.calculate()">' +
              '<option value="1.0">Normal touring</option>' +
              '<option value="0.85">Spirited / twisty roads</option>' +
              '<option value="1.1">Motorway cruising</option>' +
              '<option value="0.75">Two-up with luggage</option>' +
            '</select>' +
          '</div>' +
          '<div class="fr-field">' +
            '<label>Reserve Warning At</label>' +
            '<select id="frReserve" onchange="fuelRange.calculate()">' +
              '<option value="0.2">20% tank (recommended)</option>' +
              '<option value="0.15">15% tank</option>' +
              '<option value="0.25">25% tank (cautious)</option>' +
            '</select>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<div id="frResults" style="display:none">' +
        '<div class="fr-results-grid">' +
          '<div class="fr-stat">' +
            '<span class="fr-stat-label">Total Range</span>' +
            '<span class="fr-stat-value" id="frRangeTotal">--</span>' +
            '<span class="fr-stat-unit">miles</span>' +
          '</div>' +
          '<div class="fr-stat">' +
            '<span class="fr-stat-label">Comfortable Range</span>' +
            '<span class="fr-stat-value" id="frRangeComfort">--</span>' +
            '<span class="fr-stat-unit">miles (to reserve)</span>' +
          '</div>' +
          '<div class="fr-stat">' +
            '<span class="fr-stat-label">Litres per 100 Miles</span>' +
            '<span class="fr-stat-value" id="frLper100">--</span>' +
            '<span class="fr-stat-unit">L/100mi</span>' +
          '</div>' +
          '<div class="fr-stat">' +
            '<span class="fr-stat-label">Cost per Mile</span>' +
            '<span class="fr-stat-value" id="frCostPerMile">--</span>' +
            '<span class="fr-stat-unit">at £1.45/L</span>' +
          '</div>' +
        '</div>' +

        '<div class="fr-range-bar-container">' +
          '<div class="fr-range-bar">' +
            '<div class="fr-range-fill" id="frBarFill"></div>' +
            '<div class="fr-range-reserve" id="frBarReserve"></div>' +
          '</div>' +
          '<div class="fr-range-labels">' +
            '<span>0 mi</span>' +
            '<span id="frBarReserveLabel">Reserve</span>' +
            '<span id="frBarTotalLabel">Empty</span>' +
          '</div>' +
        '</div>' +

        '<div class="fr-tips" id="frTips"></div>' +
      '</div>' +

      '<div class="fr-info-section">' +
        '<h3><i class="fas fa-lightbulb"></i> Fuel Planning Tips for UK Touring</h3>' +
        '<div class="fr-tips-grid">' +
          '<div class="fr-tip-card">' +
            '<h4><i class="fas fa-map-marked-alt"></i> Scotland & Rural Wales</h4>' +
            '<p>Fuel stations can be 40-60 miles apart in the Highlands, parts of mid-Wales, and remote Northumberland. Never pass a station with less than half a tank.</p>' +
          '</div>' +
          '<div class="fr-tip-card">' +
            '<h4><i class="fas fa-clock"></i> Opening Hours</h4>' +
            '<p>Rural stations often close at 6pm and may not open on Sundays. Pay-at-pump is not universal in remote areas. Carry cash as backup.</p>' +
          '</div>' +
          '<div class="fr-tip-card">' +
            '<h4><i class="fas fa-mountain"></i> Terrain Impact</h4>' +
            '<p>Twisty mountain roads (Hardknott, Bealach na Ba) can increase fuel consumption by 20-30%. Headwinds on exposed roads have a similar effect.</p>' +
          '</div>' +
          '<div class="fr-tip-card">' +
            '<h4><i class="fas fa-route"></i> Route Builder Integration</h4>' +
            '<p>Our <a href="/build-route" style="color:var(--accent)">Route Builder</a> automatically adds fuel stops every 100 miles using 9,913 UK stations.</p>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<div class="fr-distances">' +
        '<h3><i class="fas fa-ruler"></i> Key UK Distances to Know</h3>' +
        '<table class="fr-table">' +
          '<tr><th>Route</th><th>Distance</th><th>Fuel Stops Needed*</th></tr>' +
          '<tr><td>London to Edinburgh</td><td>410 miles</td><td id="frDist1">--</td></tr>' +
          '<tr><td>London to Cornwall</td><td>290 miles</td><td id="frDist2">--</td></tr>' +
          '<tr><td>NC500 (full loop)</td><td>516 miles</td><td id="frDist3">--</td></tr>' +
          '<tr><td>Manchester to Lake District</td><td>90 miles</td><td id="frDist4">--</td></tr>' +
          '<tr><td>Edinburgh to Inverness</td><td>160 miles</td><td id="frDist5">--</td></tr>' +
          '<tr><td>Cardiff to Snowdonia</td><td>150 miles</td><td id="frDist6">--</td></tr>' +
        '</table>' +
        '<p class="fr-footnote">*Based on your bike\'s comfortable range. Always carry a margin in remote areas.</p>' +
      '</div>' +

    '</div>' +
  '</div>';
}

var fuelRange = {
  selectBike: function(name) {
    var bike = COMMON_BIKES.find(function(b) { return b.name === name; });
    if (bike && bike.tank > 0) {
      document.getElementById('frTank').value = bike.tank;
      document.getElementById('frMpg').value = bike.mpg;
      this.calculate();
    } else {
      document.getElementById('frTank').value = '';
      document.getElementById('frMpg').value = '';
    }
  },

  calculate: function() {
    var tank = parseFloat(document.getElementById('frTank').value);
    var mpg = parseFloat(document.getElementById('frMpg').value);
    var style = parseFloat(document.getElementById('frStyle').value);
    var reserve = parseFloat(document.getElementById('frReserve').value);

    if (!tank || !mpg || tank <= 0 || mpg <= 0) {
      document.getElementById('frResults').style.display = 'none';
      return;
    }

    var adjustedMpg = mpg * style;
    var tankGallons = tank / 4.546;
    var totalRange = Math.round(tankGallons * adjustedMpg);
    var comfortRange = Math.round(totalRange * (1 - reserve));
    var lPer100 = ((tank / totalRange) * 100).toFixed(1);
    var fuelPrice = 1.45;
    var costPerMile = ((tank * fuelPrice) / totalRange).toFixed(2);

    document.getElementById('frRangeTotal').textContent = totalRange;
    document.getElementById('frRangeComfort').textContent = comfortRange;
    document.getElementById('frLper100').textContent = lPer100;
    document.getElementById('frCostPerMile').textContent = '£' + costPerMile;

    // Range bar
    var fill = document.getElementById('frBarFill');
    var reserveBar = document.getElementById('frBarReserve');
    fill.style.width = ((1 - reserve) * 100) + '%';
    reserveBar.style.width = (reserve * 100) + '%';
    document.getElementById('frBarReserveLabel').textContent = comfortRange + ' mi';
    document.getElementById('frBarTotalLabel').textContent = totalRange + ' mi';

    // Distance table
    var distances = [410, 290, 516, 90, 160, 150];
    for (var i = 0; i < distances.length; i++) {
      var stops = Math.max(0, Math.ceil(distances[i] / comfortRange) - 1);
      var el = document.getElementById('frDist' + (i + 1));
      if (el) el.textContent = stops === 0 ? 'None needed' : stops + (stops === 1 ? ' stop' : ' stops');
    }

    // Tips
    var tips = '';
    if (comfortRange < 120) {
      tips += '<div class="fr-warning"><i class="fas fa-exclamation-triangle"></i> <strong>Short range warning:</strong> Your comfortable range of ' + comfortRange + ' miles may be tight for remote Highland touring where stations can be 40-60 miles apart. Plan fuel stops carefully.</div>';
    }
    if (comfortRange > 250) {
      tips += '<div class="fr-success"><i class="fas fa-check-circle"></i> <strong>Excellent range:</strong> At ' + comfortRange + ' miles, you can comfortably cover most UK touring routes without worrying about fuel.</div>';
    }
    if (style < 1) {
      tips += '<div class="fr-info"><i class="fas fa-info-circle"></i> Your riding style reduces effective MPG. Twisty roads and two-up riding use significantly more fuel than steady cruising.</div>';
    }
    document.getElementById('frTips').innerHTML = tips;

    document.getElementById('frResults').style.display = 'block';
  }
};
