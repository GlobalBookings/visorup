/**
 * Ride Weather Window Finder
 * Pick a region + date range, find the best riding window.
 * Uses Open-Meteo free API (same as existing weather dashboard).
 */

var UK_REGIONS = [
  { name: 'Scottish Highlands', lat: 57.48, lon: -4.22 },
  { name: 'Edinburgh & Borders', lat: 55.95, lon: -3.19 },
  { name: 'Lake District', lat: 54.45, lon: -3.07 },
  { name: 'Yorkshire Dales', lat: 54.23, lon: -2.16 },
  { name: 'Peak District', lat: 53.35, lon: -1.80 },
  { name: 'Snowdonia', lat: 52.92, lon: -3.89 },
  { name: 'Brecon Beacons', lat: 51.88, lon: -3.44 },
  { name: 'Dartmoor', lat: 50.57, lon: -3.92 },
  { name: 'Cornwall', lat: 50.27, lon: -5.05 },
  { name: 'South Downs', lat: 50.93, lon: -0.30 },
  { name: 'Cotswolds', lat: 51.83, lon: -1.68 },
  { name: 'North York Moors', lat: 54.37, lon: -0.97 },
  { name: 'Northumberland', lat: 55.30, lon: -1.93 },
  { name: 'Isle of Man', lat: 54.24, lon: -4.55 },
  { name: 'Isle of Skye', lat: 57.30, lon: -6.30 },
  { name: 'NC500 (North Coast)', lat: 58.44, lon: -5.03 },
];

function renderWeatherWindow() {
  var regionOptions = UK_REGIONS.map(function(r) {
    return '<option value="' + r.name + '">' + r.name + '</option>';
  }).join('');

  var today = new Date().toISOString().split('T')[0];
  var nextWeek = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];

  return '<div class="weather-window">' +
    '<div class="tool-hero">' +
      '<div class="hero-content">' +
        '<span class="hero-badge"><i class="fas fa-cloud-sun"></i> Weather Window Finder</span>' +
        '<h1>Find Your Riding Window</h1>' +
        '<p class="hero-subtitle">Pick a region and date range — we\'ll find the best dry days for riding. Powered by Open-Meteo forecast data.</p>' +
      '</div>' +
    '</div>' +
    '<div class="ww-container" style="max-width:900px;margin:0 auto;padding:24px">' +

      '<div class="ww-controls">' +
        '<div class="ww-row">' +
          '<div class="ww-field">' +
            '<label>Region</label>' +
            '<select id="wwRegion">' + regionOptions + '</select>' +
          '</div>' +
          '<div class="ww-field">' +
            '<label>From</label>' +
            '<input type="date" id="wwFrom" value="' + today + '">' +
          '</div>' +
          '<div class="ww-field">' +
            '<label>To</label>' +
            '<input type="date" id="wwTo" value="' + nextWeek + '">' +
          '</div>' +
          '<div class="ww-field" style="align-self:flex-end">' +
            '<button class="ww-btn" onclick="weatherWindow.fetch()"><i class="fas fa-search"></i> Find Best Days</button>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<div id="wwLoading" style="display:none;text-align:center;padding:40px">' +
        '<i class="fas fa-spinner fa-spin" style="font-size:24px;color:var(--accent)"></i>' +
        '<p style="color:var(--text-muted);margin-top:12px">Fetching forecast data...</p>' +
      '</div>' +

      '<div id="wwResults" style="display:none"></div>' +

      '<div class="ww-legend">' +
        '<h3><i class="fas fa-info-circle"></i> Riding Conditions Guide</h3>' +
        '<div class="ww-legend-grid">' +
          '<div class="ww-legend-item"><span class="ww-dot" style="background:#22c55e"></span> <strong>Excellent</strong> — Dry, mild, light wind. Perfect riding.</div>' +
          '<div class="ww-legend-item"><span class="ww-dot" style="background:#84cc16"></span> <strong>Good</strong> — Mostly dry, some cloud. Fine for touring.</div>' +
          '<div class="ww-legend-item"><span class="ww-dot" style="background:#eab308"></span> <strong>Fair</strong> — Chance of showers, breezy. Waterproofs ready.</div>' +
          '<div class="ww-legend-item"><span class="ww-dot" style="background:#f97316"></span> <strong>Poor</strong> — Rain likely, strong wind. Experienced riders only.</div>' +
          '<div class="ww-legend-item"><span class="ww-dot" style="background:#ef4444"></span> <strong>Avoid</strong> — Heavy rain, gales, or ice risk. Stay home.</div>' +
        '</div>' +
      '</div>' +

    '</div>' +
  '</div>';
}

var weatherWindow = {
  fetch: function() {
    var regionName = document.getElementById('wwRegion').value;
    var from = document.getElementById('wwFrom').value;
    var to = document.getElementById('wwTo').value;

    if (!from || !to) return;

    var region = UK_REGIONS.find(function(r) { return r.name === regionName; });
    if (!region) return;

    document.getElementById('wwLoading').style.display = 'block';
    document.getElementById('wwResults').style.display = 'none';

    var url = 'https://api.open-meteo.com/v1/forecast?' +
      'latitude=' + region.lat + '&longitude=' + region.lon +
      '&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,weather_code' +
      '&start_date=' + from + '&end_date=' + to +
      '&timezone=Europe/London';

    var self = this;
    fetch(url)
      .then(function(r) { return r.json(); })
      .then(function(data) { self.render(data, regionName); })
      .catch(function(err) {
        document.getElementById('wwLoading').style.display = 'none';
        document.getElementById('wwResults').style.display = 'block';
        document.getElementById('wwResults').innerHTML = '<div class="ww-error"><i class="fas fa-exclamation-triangle"></i> Failed to fetch forecast. Try a shorter date range (max 16 days).</div>';
      });
  },

  scoreDay: function(precip, precipProb, wind, tempMax, weatherCode) {
    var score = 100;
    if (precip > 0.5) score -= Math.min(40, precip * 8);
    if (precipProb > 30) score -= (precipProb - 30) * 0.5;
    if (wind > 30) score -= (wind - 30) * 2;
    if (wind > 50) score -= 30;
    if (tempMax < 5) score -= 30;
    else if (tempMax < 10) score -= 10;
    if (weatherCode >= 61 && weatherCode <= 67) score -= 25;
    if (weatherCode >= 71 && weatherCode <= 77) score -= 40;
    if (weatherCode >= 80 && weatherCode <= 82) score -= 20;
    if (weatherCode >= 95) score -= 50;
    return Math.max(0, Math.min(100, Math.round(score)));
  },

  ratingFromScore: function(score) {
    if (score >= 80) return { label: 'Excellent', color: '#22c55e', icon: 'fa-face-grin-stars' };
    if (score >= 60) return { label: 'Good', color: '#84cc16', icon: 'fa-face-smile' };
    if (score >= 40) return { label: 'Fair', color: '#eab308', icon: 'fa-face-meh' };
    if (score >= 20) return { label: 'Poor', color: '#f97316', icon: 'fa-face-frown' };
    return { label: 'Avoid', color: '#ef4444', icon: 'fa-skull-crossbones' };
  },

  weatherIcon: function(code) {
    if (code <= 3) return 'fa-sun';
    if (code <= 48) return 'fa-cloud';
    if (code <= 57) return 'fa-cloud-rain';
    if (code <= 67) return 'fa-cloud-showers-heavy';
    if (code <= 77) return 'fa-snowflake';
    if (code <= 82) return 'fa-cloud-showers-water';
    return 'fa-bolt';
  },

  dayName: function(dateStr) {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  },

  render: function(data, regionName) {
    document.getElementById('wwLoading').style.display = 'none';

    if (!data.daily || !data.daily.time || !data.daily.time.length) {
      document.getElementById('wwResults').innerHTML = '<div class="ww-error">No forecast data available for this date range.</div>';
      document.getElementById('wwResults').style.display = 'block';
      return;
    }

    var days = [];
    for (var i = 0; i < data.daily.time.length; i++) {
      var score = this.scoreDay(
        data.daily.precipitation_sum[i],
        data.daily.precipitation_probability_max[i],
        data.daily.wind_speed_10m_max[i],
        data.daily.temperature_2m_max[i],
        data.daily.weather_code[i]
      );
      days.push({
        date: data.daily.time[i],
        tempMax: Math.round(data.daily.temperature_2m_max[i]),
        tempMin: Math.round(data.daily.temperature_2m_min[i]),
        precip: data.daily.precipitation_sum[i],
        precipProb: data.daily.precipitation_probability_max[i],
        wind: Math.round(data.daily.wind_speed_10m_max[i]),
        weatherCode: data.daily.weather_code[i],
        score: score,
        rating: this.ratingFromScore(score),
      });
    }

    // Find best window (best consecutive 2-3 days)
    var bestWindow = null;
    var bestAvg = 0;
    for (var w = 0; w < days.length - 1; w++) {
      var windowDays = days.slice(w, w + Math.min(3, days.length - w));
      var avg = windowDays.reduce(function(a, d) { return a + d.score; }, 0) / windowDays.length;
      if (avg > bestAvg) {
        bestAvg = avg;
        bestWindow = windowDays;
      }
    }

    var self = this;
    var html = '';

    // Best window recommendation
    if (bestWindow && bestWindow.length > 0 && bestAvg >= 40) {
      html += '<div class="ww-recommendation">' +
        '<h3><i class="fas fa-trophy" style="color:var(--accent)"></i> Best Riding Window for ' + regionName + '</h3>' +
        '<p><strong>' + this.dayName(bestWindow[0].date) + '</strong>';
      if (bestWindow.length > 1) html += ' to <strong>' + this.dayName(bestWindow[bestWindow.length - 1].date) + '</strong>';
      html += ' — Average riding score: <strong>' + Math.round(bestAvg) + '/100</strong></p>' +
        '</div>';
    } else {
      html += '<div class="ww-no-window">' +
        '<h3><i class="fas fa-cloud-showers-heavy"></i> Tough Conditions Ahead</h3>' +
        '<p>No great riding windows found for ' + regionName + ' in this date range. Welcome to British motorcycling!</p>' +
        '</div>';
    }

    // Day-by-day forecast
    html += '<div class="ww-days">';
    days.forEach(function(d) {
      var isBest = bestWindow && bestWindow.some(function(bw) { return bw.date === d.date; });
      html += '<div class="ww-day' + (isBest ? ' ww-day-best' : '') + '">' +
        '<div class="ww-day-header">' +
          '<span class="ww-day-name">' + self.dayName(d.date) + '</span>' +
          '<span class="ww-day-score" style="background:' + d.rating.color + '">' + d.rating.label + '</span>' +
        '</div>' +
        '<div class="ww-day-details">' +
          '<div class="ww-day-icon"><i class="fas ' + self.weatherIcon(d.weatherCode) + '"></i></div>' +
          '<div class="ww-day-stats">' +
            '<span><i class="fas fa-temperature-high"></i> ' + d.tempMax + '°/' + d.tempMin + '°C</span>' +
            '<span><i class="fas fa-droplet"></i> ' + d.precipProb + '% (' + d.precip.toFixed(1) + 'mm)</span>' +
            '<span><i class="fas fa-wind"></i> ' + d.wind + ' km/h</span>' +
          '</div>' +
          '<div class="ww-day-bar">' +
            '<div class="ww-day-bar-fill" style="width:' + d.score + '%;background:' + d.rating.color + '"></div>' +
          '</div>' +
        '</div>' +
      '</div>';
    });
    html += '</div>';

    document.getElementById('wwResults').innerHTML = html;
    document.getElementById('wwResults').style.display = 'block';
  }
};
