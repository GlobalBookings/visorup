// VisorUp Insurance Hub
// Phase-1, no-API affiliate hub: curated provider comparison + content + signposting
// to FCA-authorised brokers/comparison sites. No live quotes (those need panel
// integrations + FCA authorisation we don't have). Each "Get a quote" button is an
// affiliate link.
//
// MONETISATION: once you're approved on each programme, replace the `url` values in
// INSURANCE_PROVIDERS with your tracked affiliate deep-links (Awin / Devitt scheme /
// network). The current URLs point to the providers' own pages so the hub works today.

const INSURANCE_PROVIDERS = [
  {
    key: 'the-bike-insurer',
    name: 'The Bike Insurer',
    bestFor: 'Comparing the whole market fast',
    blurb: 'The UK\u2019s original motorbike comparison site \u2014 one form, quotes from 40+ specialist brokers.',
    cover: ['Comprehensive', 'TPFT', 'TPO'],
    multibike: true,
    rideAnyBike: false,
    features: ['Compares 40+ brokers', 'Single quick form', 'Free to use'],
    url: 'https://www.thebikeinsurer.co.uk/',
    featured: true,
  },
  {
    key: 'devitt',
    name: 'Devitt Insurance',
    bestFor: 'Classics, modified & multi-bike',
    blurb: 'Specialist bike broker since 1936. Strong on classic, custom and multi-bike policies.',
    cover: ['Comprehensive', 'TPFT', 'TPO'],
    multibike: true,
    rideAnyBike: false,
    features: ['Multi-bike policies', 'Classic & modified', 'UK call centre'],
    url: 'https://www.devittinsurance.com/',
  },
  {
    key: 'carole-nash',
    name: 'Carole Nash',
    bestFor: 'Added benefits & EU touring',
    blurb: 'Big specialist with generous extras \u2014 EU cover, breakdown and \u201cride other bikes\u201d on many policies.',
    cover: ['Comprehensive', 'TPFT', 'TPO'],
    multibike: true,
    rideAnyBike: true,
    features: ['Up to 90 days EU cover', 'DNA+ theft tracking', 'Multi-bike & ride other bikes'],
    url: 'https://www.carolenash.com/',
  },
  {
    key: 'bennetts',
    name: 'Bennetts',
    bestFor: 'Rewards & rider perks',
    blurb: 'Specialist insurer with BikeSocial membership perks, track-day discounts and rider rewards.',
    cover: ['Comprehensive', 'TPFT', 'TPO'],
    multibike: true,
    rideAnyBike: false,
    features: ['BikeSocial rewards', 'Track-day cover options', 'Multi-bike'],
    url: 'https://www.bennetts.co.uk/',
  },
  {
    key: 'bikesure',
    name: 'Bikesure',
    bestFor: 'Non-standard & ride-any-bike',
    blurb: 'Niche specialist (Adrian Flux). Home of the \u201cRide Any Bike\u201d add-on and cover for unusual risks.',
    cover: ['Comprehensive', 'TPFT', 'TPO'],
    multibike: true,
    rideAnyBike: true,
    features: ['\u201cRide Any Bike\u201d add-on', 'Imports & custom builds', 'Laid-up / SORN cover'],
    url: 'https://www.bikesure.co.uk/',
  },
  {
    key: 'lexham',
    name: 'Lexham Insurance',
    bestFor: 'Scooters, commuters & learners',
    blurb: 'Small-capacity and commuter specialist \u2014 great for scooters, mopeds, learners and delivery riders.',
    cover: ['Comprehensive', 'TPFT', 'TPO'],
    multibike: true,
    rideAnyBike: false,
    features: ['Scooter & moped focus', 'Learner & CBT riders', 'Multi-bike'],
    url: 'https://www.lexhaminsurance.co.uk/',
  },
];

// Estimate model. Calibrated to published UK average premiums (NimbleFins 2026:
// cheapest comprehensive cover, 125cc, 30yo, 5yr no-claims, garaged = baseline).
// These are INDICATIVE market averages, not quotes from any named broker.
const INS_BASE = 525;

const INS_FACTORS = {
  age:     { '17-20': 2.20, '21-24': 1.65, '25-29': 1.30, '30-39': 1.00, '40-49': 0.84, '50-59': 0.74, '60-69': 0.74, '70+': 0.85 },
  engine:  { 'le125': 1.00, '126-300': 1.05, '301-500': 1.12, '501-700': 1.20, '701-900': 1.22, '901-1200': 1.85, 'over1200': 2.20 },
  cover:   { 'comprehensive': 1.00, 'tpft': 0.80, 'tpo': 0.78 },
  exp:     { 'new': 1.70, '1-2': 1.35, '3-4': 1.15, '5+': 1.00 },
  storage: { 'garage': 1.00, 'driveway': 1.35, 'road': 1.60 },
  region:  { 'rural': 0.90, 'town': 1.00, 'city': 1.18, 'london': 1.38 },
};

// Small, explainable specialism nudges (NOT real per-broker pricing).
function _insFit(p, prof) {
  var young = (prof.age === '17-20' || prof.age === '21-24');
  var older = (prof.age === '50-59' || prof.age === '60-69' || prof.age === '70+');
  var small = (prof.engine === 'le125' || prof.engine === '126-300');
  var big = (prof.engine === '901-1200' || prof.engine === 'over1200');
  switch (p.key) {
    case 'the-bike-insurer': return 0.95;                  // compares 40+ -> tends to surface the cheapest
    case 'devitt': return older ? 0.97 : 1.00;             // strong for experienced / multi-bike
    case 'carole-nash': return 1.03;                       // more extras included as standard
    case 'bennetts': return 1.00;
    case 'bikesure': return (young || big) ? 0.98 : 1.04;  // non-standard / niche risks
    case 'lexham': return small ? 0.94 : 1.08;             // small-cc / commuter specialist
    default: return 1.00;
  }
}

function _insRound(n) { return Math.round(n / 5) * 5; }

const Insurance = {
  track: function (key) {
    try {
      if (typeof VisorUpAnalytics !== 'undefined' && VisorUpAnalytics.trackToolUsage) {
        VisorUpAnalytics.trackToolUsage('insurance-' + key);
      }
    } catch (e) { /* non-fatal */ }
    return true;
  },
  _val: function (id, fallback) {
    var el = document.getElementById(id);
    return el ? el.value : fallback;
  },
  calc: function () {
    var f = INS_FACTORS;
    var prof = {
      age: this._val('insAge', '30-39'),
      engine: this._val('insEngine', '701-900'),
      cover: this._val('insCover', 'comprehensive'),
      exp: this._val('insExp', '5+'),
      storage: this._val('insStorage', 'garage'),
      region: this._val('insRegion', 'town'),
    };
    var point = INS_BASE * f.age[prof.age] * f.engine[prof.engine] * f.cover[prof.cover] *
                f.exp[prof.exp] * f.storage[prof.storage] * f.region[prof.region];
    var low = _insRound(point);
    var high = _insRound(point * 1.8);
    var head = document.getElementById('insEstHeadline');
    if (head) head.innerHTML = 'Indicative market estimate: <strong>\u00a3' + low + '\u2013\u00a3' + high + '</strong><span style="font-size:14px;color:var(--text-muted)"> / year</span>';
    INSURANCE_PROVIDERS.forEach(function (p) {
      var est = _insRound(low * _insFit(p, prof));
      var slot = document.getElementById('ins-est-' + p.key);
      if (slot) slot.innerHTML = '<span style="font-size:12px;color:var(--text-muted)">Indicative from</span> <strong style="color:var(--text);font-size:18px">\u00a3' + est + '</strong><span style="font-size:12px;color:var(--text-muted)">/yr*</span>';
    });
    this.track('estimate');
    return false;
  },
};

function _insField(label, id, opts, sel) {
  var o = opts.map(function (pair) {
    return '<option value="' + pair[0] + '"' + (pair[0] === sel ? ' selected' : '') + '>' + pair[1] + '</option>';
  }).join('');
  return '' +
    '<div>' +
      '<label for="' + id + '" style="display:block;font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.3px;margin-bottom:6px">' + label + '</label>' +
      '<select id="' + id + '" onchange="Insurance.calc()" style="width:100%;padding:10px 12px;border:1px solid var(--border);border-radius:8px;background:var(--bg-primary);color:var(--text);font-size:14px">' + o + '</select>' +
    '</div>';
}

function _insChips(p) {
  var chips = '';
  p.cover.forEach(function (c) {
    chips += '<span style="display:inline-block;font-size:11px;font-weight:600;padding:3px 8px;border-radius:6px;background:var(--bg-primary);border:1px solid var(--border);color:var(--text-muted);margin:0 4px 4px 0">' + c + '</span>';
  });
  if (p.multibike) chips += '<span style="display:inline-block;font-size:11px;font-weight:600;padding:3px 8px;border-radius:6px;background:rgba(39,174,96,0.12);border:1px solid rgba(39,174,96,0.4);color:#27ae60;margin:0 4px 4px 0"><i class="fas fa-check"></i> Multi-bike</span>';
  if (p.rideAnyBike) chips += '<span style="display:inline-block;font-size:11px;font-weight:600;padding:3px 8px;border-radius:6px;background:rgba(155,89,182,0.12);border:1px solid rgba(155,89,182,0.4);color:#9b59b6;margin:0 4px 4px 0"><i class="fas fa-check"></i> Ride any bike</span>';
  return chips;
}

function _insCard(p) {
  var feats = '';
  p.features.forEach(function (f) {
    feats += '<li style="margin:0 0 6px 0;padding-left:22px;position:relative;font-size:14px;color:var(--text)"><i class="fas fa-check" style="position:absolute;left:0;top:3px;color:var(--accent);font-size:12px"></i>' + f + '</li>';
  });
  return '' +
    '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:22px;display:flex;flex-direction:column">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:4px">' +
        '<h3 style="margin:0;font-size:19px;color:var(--text)">' + p.name + '</h3>' +
      '</div>' +
      '<div style="font-size:12px;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:.4px;margin-bottom:10px">' + p.bestFor + '</div>' +
      '<p style="margin:0 0 12px 0;font-size:14px;line-height:1.5;color:var(--text-muted)">' + p.blurb + '</p>' +
      '<div style="margin-bottom:14px">' + _insChips(p) + '</div>' +
      '<ul style="list-style:none;margin:0 0 14px 0;padding:0">' + feats + '</ul>' +
      '<div id="ins-est-' + p.key + '" style="margin-top:auto;text-align:center;padding:10px 0;min-height:22px">' +
        '<span style="font-size:12px;color:var(--text-muted)">Use the estimator above for a price</span></div>' +
      '<a href="' + p.url + '" target="_blank" rel="sponsored noopener nofollow" onclick="Insurance.track(\'quote-' + p.key + '\')" ' +
        'style="display:block;text-align:center;background:var(--accent);color:#fff;font-weight:700;padding:12px 16px;border-radius:10px;text-decoration:none">' +
        'Get a quote <i class="fas fa-arrow-right" style="font-size:12px"></i></a>' +
    '</div>';
}

function renderInsuranceHub() {
  var featured = INSURANCE_PROVIDERS.filter(function (p) { return p.featured; })[0];
  var rest = INSURANCE_PROVIDERS.filter(function (p) { return !p.featured; });
  var cards = rest.map(_insCard).join('');

  return '' +
  '<div class="content-hero" style="background:linear-gradient(135deg, var(--bg-primary), var(--bg-card))">' +
    '<div class="hero-content">' +
      '<span class="hero-badge"><i class="fas fa-shield-halved"></i> Insurance</span>' +
      '<h1>Motorbike Insurance for Tourers</h1>' +
      '<p class="hero-subtitle">Compare specialist UK motorcycle insurers in one place \u2014 multi-bike, ride-any-bike, classic and touring cover. Find the right policy for the way you ride.</p>' +
      '<a href="' + featured.url + '" target="_blank" rel="sponsored noopener nofollow" onclick="Insurance.track(\'quote-' + featured.key + '\')" ' +
        'style="display:inline-block;background:var(--accent);color:#fff;font-weight:700;padding:14px 28px;border-radius:12px;text-decoration:none;font-size:16px;margin-top:8px">' +
        '<i class="fas fa-bolt"></i> Compare 40+ brokers</a>' +
      '<a href="#ins-compare" style="display:inline-block;color:var(--text);font-weight:600;padding:14px 20px;text-decoration:none;font-size:15px">Browse providers <i class="fas fa-chevron-down" style="font-size:12px"></i></a>' +
    '</div>' +
  '</div>' +

  // Disclosure strip
  '<section style="background:var(--bg-card);border-bottom:1px solid var(--border)">' +
    '<div class="container" style="max-width:900px;padding:14px 20px">' +
      '<p style="margin:0;font-size:13px;color:var(--text-muted);text-align:center">' +
        '<i class="fas fa-circle-info"></i> VisorUp is a marketing partner, not an insurer or broker. We link to FCA-authorised providers and may earn a commission at no extra cost to you. This helps keep our tools free. Always check the policy wording and IPID before buying.' +
      '</p>' +
    '</div>' +
  '</section>' +

  // Premium estimator
  '<section class="page-section" id="ins-estimate" style="padding-bottom:8px">' +
    '<div class="container" style="max-width:1000px">' +
      '<h2 style="text-align:center;font-size:26px;color:var(--text);margin:0 0 6px 0">Estimate your premium</h2>' +
      '<p style="text-align:center;font-size:15px;color:var(--text-muted);margin:0 0 22px 0">A quick indicative figure modelled on published UK average premiums \u2014 then get a real quote.</p>' +
      '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:16px;padding:24px">' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:14px">' +
          _insField('Rider age', 'insAge', [['17-20', '17\u201320'], ['21-24', '21\u201324'], ['25-29', '25\u201329'], ['30-39', '30\u201339'], ['40-49', '40\u201349'], ['50-59', '50\u201359'], ['60-69', '60\u201369'], ['70+', '70+']], '30-39') +
          _insField('Engine size', 'insEngine', [['le125', 'Up to 125cc'], ['126-300', '126\u2013300cc'], ['301-500', '301\u2013500cc'], ['501-700', '501\u2013700cc'], ['701-900', '701\u2013900cc'], ['901-1200', '901\u20131200cc'], ['over1200', 'Over 1200cc']], '701-900') +
          _insField('Cover type', 'insCover', [['comprehensive', 'Comprehensive'], ['tpft', 'Third Party F&T'], ['tpo', 'Third Party Only']], 'comprehensive') +
          _insField('Experience', 'insExp', [['new', 'New rider'], ['1-2', '1\u20132 yrs'], ['3-4', '3\u20134 yrs'], ['5+', '5+ yrs']], '5+') +
          _insField('Kept overnight', 'insStorage', [['garage', 'Locked garage'], ['driveway', 'Driveway'], ['road', 'On the road']], 'garage') +
          _insField('Area', 'insRegion', [['rural', 'Rural'], ['town', 'Town / suburb'], ['city', 'City'], ['london', 'Greater London']], 'town') +
        '</div>' +
        '<div style="text-align:center;margin-top:20px">' +
          '<button onclick="Insurance.calc()" style="background:var(--accent);color:#fff;font-weight:700;padding:13px 32px;border:none;border-radius:10px;font-size:16px;cursor:pointer"><i class="fas fa-calculator"></i> Estimate my premium</button>' +
        '</div>' +
        '<div style="text-align:center;margin-top:20px">' +
          '<div id="insEstHeadline" style="font-size:22px;color:var(--text)">Indicative market estimate: <strong>\u2014</strong></div>' +
          '<p style="font-size:13px;color:var(--text-muted);margin:10px auto 0;max-width:700px;line-height:1.5">This is an <strong>estimate, not a quote</strong>. It\u2019s modelled on published UK average premiums (NimbleFins, 2026) and the many factors insurers use will move your real price up or down. Per-provider figures reflect typical specialism, not that broker\u2019s actual price \u2014 always get a real quote.</p>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</section>' +

  // Featured comparison partner
  '<section class="page-section" id="ins-compare">' +
    '<div class="container" style="max-width:1000px">' +
      '<div style="background:linear-gradient(135deg, rgba(255,107,53,0.10), var(--bg-card));border:1px solid var(--accent);border-radius:16px;padding:26px;margin-bottom:34px;display:flex;flex-wrap:wrap;align-items:center;gap:20px;justify-content:space-between">' +
        '<div style="flex:1;min-width:260px">' +
          '<div style="font-size:12px;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">Quickest way to compare</div>' +
          '<h2 style="margin:0 0 8px 0;font-size:24px;color:var(--text)">' + featured.name + '</h2>' +
          '<p style="margin:0 0 10px 0;font-size:15px;color:var(--text-muted);line-height:1.5">' + featured.blurb + '</p>' +
          '<div id="ins-est-' + featured.key + '" style="min-height:20px"><span style="font-size:12px;color:var(--text-muted)">Use the estimator above for a price</span></div>' +
        '</div>' +
        '<a href="' + featured.url + '" target="_blank" rel="sponsored noopener nofollow" onclick="Insurance.track(\'quote-' + featured.key + '\')" ' +
          'style="display:inline-block;background:var(--accent);color:#fff;font-weight:700;padding:14px 26px;border-radius:12px;text-decoration:none;white-space:nowrap">Compare quotes <i class="fas fa-arrow-right" style="font-size:12px"></i></a>' +
      '</div>' +

      '<h2 style="text-align:center;font-size:26px;color:var(--text);margin:0 0 6px 0">Specialist motorcycle insurers</h2>' +
      '<p style="text-align:center;font-size:15px;color:var(--text-muted);margin:0 0 28px 0">Hand-picked UK bike specialists \u2014 pick by what matters to you, then get a quote direct.</p>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:18px">' + cards + '</div>' +
    '</div>' +
  '</section>' +

  // Cover types + the "rider / ride any bike" explainer
  '<section class="page-section" style="background:var(--bg-card)">' +
    '<div class="container" style="max-width:900px">' +
      '<h2 style="font-size:26px;color:var(--text);margin:0 0 20px 0">Which type of cover do you need?</h2>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;margin-bottom:34px">' +
        _insCoverCard('Third Party Only (TPO)', 'The legal minimum. Covers damage/injury you cause to others, not your own bike. Often best value on older or low-value bikes \u2014 but not always cheapest, so compare.') +
        _insCoverCard('Third Party, Fire &amp; Theft', 'TPO plus cover if your bike is stolen or catches fire. A middle ground for bikes worth protecting against theft.') +
        _insCoverCard('Comprehensive', 'Everything in TPFT plus damage to your own bike, even if a crash was your fault. Usually best for newer or higher-value touring bikes.') +
      '</div>' +

      '<h2 style="font-size:24px;color:var(--text);margin:0 0 12px 0">Riding more than one bike? Your options</h2>' +
      '<p style="font-size:15px;color:var(--text-muted);line-height:1.6;margin:0 0 16px 0">If you want the freedom to ride different bikes \u2014 your own collection, a mate\u2019s bike, or whatever you fancy \u2014 there are three routes, depending on the bike\u2019s ownership and the cover level you need:</p>' +
      '<ul style="margin:0 0 24px 0;padding-left:0;list-style:none">' +
        _insBullet('Multi-bike policy', 'One policy covering several bikes <strong>you own</strong>, usually with one renewal date and a single no-claims discount. Offered by Devitt, Carole Nash, Bennetts, Bikesure and others.') +
        _insBullet('\u201cRide other bikes\u201d extension', 'Some comprehensive policies add third-party cover to ride <strong>bikes you don\u2019t own</strong> (with the owner\u2019s permission). Carole Nash includes this on many policies \u2014 always check your certificate.') +
        _insBullet('\u201cRide any bike\u201d add-on', 'A bolt-on (e.g. Bikesure) that lets you ride <strong>any bike</strong> up to a stated engine size on a third-party basis. Closest thing to a true rider-based policy in the UK today.') +
      '</ul>' +

      '<div style="background:var(--bg-primary);border:1px dashed var(--accent);border-radius:14px;padding:22px;text-align:center">' +
        '<div style="font-size:12px;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">Coming soon</div>' +
        '<h3 style="margin:0 0 8px 0;font-size:20px;color:var(--text)">A VisorUp Rider Policy</h3>' +
        '<p style="margin:0 0 14px 0;font-size:15px;color:var(--text-muted);line-height:1.6;max-width:620px;margin-left:auto;margin-right:auto">We\u2019re exploring a rider-based policy built for tourers \u2014 insure yourself to ride any bike up to a set engine size, third party. Want first access when it launches?</p>' +
        '<a href="mailto:hello@visorup.co.uk?subject=VisorUp%20Rider%20Policy%20interest" style="display:inline-block;background:var(--accent);color:#fff;font-weight:700;padding:12px 24px;border-radius:10px;text-decoration:none">Register your interest</a>' +
      '</div>' +
    '</div>' +
  '</section>' +

  // FAQ
  '<section class="page-section">' +
    '<div class="container" style="max-width:820px">' +
      '<h2 style="font-size:26px;color:var(--text);margin:0 0 20px 0">Motorbike insurance FAQs</h2>' +
      _insFaq('Does VisorUp sell insurance?', 'No. We\u2019re an independent motorcycle touring platform. We compare and link to FCA-authorised insurers and brokers, and may earn a commission if you buy through our links. We don\u2019t give regulated advice \u2014 always read the policy documents.') +
      _insFaq('Why can\u2019t I get a live quote on this page?', 'Live motorcycle quotes require direct integrations with each insurer\u2019s pricing engine and FCA authorisation as a comparison service. Instead we send you to trusted partners who already do that \u2014 fast and free.') +
      _insFaq('Is third party really cheaper than comprehensive?', 'Not always. Counter-intuitively, TPO can sometimes cost more because it\u2019s chosen by higher-risk riders. Always compare all three cover levels \u2014 comprehensive is frequently similar in price and far better value.') +
      _insFaq('Can I insure a bike that isn\u2019t registered to me?', 'Often yes, but terms vary by insurer and you usually can\u2019t earn no-claims on a bike you don\u2019t own. Be upfront about ownership and the registered keeper to avoid invalidating cover.') +
      _insFaq('Will touring abroad be covered?', 'UK policies typically include limited EU cover (often a set number of days) \u2014 Carole Nash and others offer extended foreign-use cover. Check the days and cover level before a European tour.') +
    '</div>' +
  '</section>';
}

function _insCoverCard(title, body) {
  return '' +
    '<div style="background:var(--bg-primary);border:1px solid var(--border);border-radius:12px;padding:18px">' +
      '<h3 style="margin:0 0 8px 0;font-size:17px;color:var(--text)">' + title + '</h3>' +
      '<p style="margin:0;font-size:14px;color:var(--text-muted);line-height:1.55">' + body + '</p>' +
    '</div>';
}

function _insBullet(title, body) {
  return '' +
    '<li style="background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:16px 18px;margin-bottom:12px">' +
      '<strong style="color:var(--text);font-size:16px">' + title + '</strong>' +
      '<p style="margin:6px 0 0 0;font-size:14px;color:var(--text-muted);line-height:1.55">' + body + '</p>' +
    '</li>';
}

function _insFaq(q, a) {
  return '' +
    '<div style="border-bottom:1px solid var(--border);padding:18px 0">' +
      '<h3 style="margin:0 0 8px 0;font-size:17px;color:var(--text)">' + q + '</h3>' +
      '<p style="margin:0;font-size:15px;color:var(--text-muted);line-height:1.6">' + a + '</p>' +
    '</div>';
}
