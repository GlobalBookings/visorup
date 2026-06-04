#!/usr/bin/env node
/**
 * VisorUp Overpass API POI Scraper
 * Scrapes POIs from OpenStreetMap for all categories,
 * deduplicates against existing curated data,
 * selects top 10 per category, and outputs merged POI files.
 *
 * Usage:
 *   node scripts/scrape-pois.mjs           # Full scrape + merge
 *   node scripts/scrape-pois.mjs --cached  # Use cached data, re-merge only
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createContext, runInContext } from 'vm';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const CACHE_FILE = resolve(__dirname, 'poi-cache.json');
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
const DELAY_MS = 6000;
const DEDUP_RADIUS_M = 500;
const BBOX = '(49.0,-8.5,61.5,2.0)';

const sleep = ms => new Promise(r => setTimeout(r, ms));

// ── Region classification ──

function classifyRegion(lat, lng) {
  if (lat < 49.8 && lng > -2.9 && lng < -1.8) return 'wales'; // Channel Islands
  if (lat > 54.0 && lat < 54.45 && lng > -4.95 && lng < -4.25) return 'wales'; // Isle of Man
  if (lat > 55.3) return 'scotland';
  if (lat > 54.9 && lng < -2.5) return 'scotland';
  if (lat > 51.3 && lat < 53.5 && lng < -2.65) return 'wales';
  if (lat > 51.3 && lat < 52.0 && lng < -2.4) return 'wales';
  return 'england';
}

// ── Haversine distance (metres) ──

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const toRad = d => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── Overpass query builder ──

function buildQuery(tagFilters, requireName) {
  const nf = requireName ? '["name"]' : '';
  const parts = tagFilters.flatMap(f => [
    `node${f}${nf}${BBOX};`,
    `way${f}${nf}${BBOX};`
  ]);
  return `[out:json][timeout:300];\n(\n  ${parts.join('\n  ')}\n);\nout center;`;
}

async function queryOverpass(query, retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const resp = await fetch(OVERPASS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
          'User-Agent': 'VisorUp/1.0 (motorcycle touring platform)'
        },
        body: 'data=' + encodeURIComponent(query)
      });
      if (resp.status === 429 || resp.status === 504) {
        console.log('  Rate limited/timeout, waiting 30s...');
        await sleep(30000);
        continue;
      }
      if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${await resp.text().then(t => t.substring(0, 200))}`);
      return await resp.json();
    } catch (e) {
      console.log(`  Attempt ${attempt + 1} failed: ${e.message}`);
      if (attempt < retries - 1) await sleep(15000);
    }
  }
  return { elements: [] };
}

// ── Description generators ──

function descForCategory(cat, tags) {
  switch (cat) {
    case 'campsites': {
      const p = [];
      if (tags.capacity) p.push(`${tags.capacity} pitches`);
      if (tags.tents === 'yes' && tags.caravans === 'yes') p.push('tents and caravans');
      else if (tags.tents === 'yes') p.push('tents welcome');
      if (tags.power_supply === 'yes' || tags.electricity === 'yes') p.push('electric hookup');
      if (tags.internet_access === 'wlan' || tags.internet_access === 'yes') p.push('Wi-Fi');
      if (tags.shower === 'yes') p.push('showers');
      return p.length ? p.join(', ') + '.' : 'Campsite.';
    }
    case 'pubs': {
      const p = [];
      if (tags.food === 'yes') p.push('food served');
      if (tags.real_ale === 'yes') p.push('real ales');
      if (tags.beer_garden === 'yes' || tags.outdoor_seating === 'yes') p.push('beer garden');
      if (tags.accommodation === 'yes') p.push('rooms available');
      if (tags.microbrewery === 'yes') p.push('microbrewery');
      if (tags.cuisine) p.push(tags.cuisine.replace(/_/g, ' '));
      return p.length ? p.join(', ') + '.' : 'Pub.';
    }
    case 'viewpoints':
      if (tags.ele) return `Viewpoint at ${Math.round(parseFloat(tags.ele))}m elevation.`;
      return tags.description ? tags.description.substring(0, 120) : 'Scenic viewpoint.';
    case 'castles': {
      const p = [];
      if (tags.castle_type) p.push(tags.castle_type.replace(/_/g, ' '));
      if (tags.heritage) p.push(tags.heritage);
      if (tags.start_date) p.push(`from ${tags.start_date}`);
      return p.length ? 'Castle: ' + p.join(', ') + '.' : 'Historic castle.';
    }
    case 'waterfalls':
      if (tags.height) return `${tags.height}m waterfall.`;
      return tags.description ? tags.description.substring(0, 120) : 'Waterfall.';
    case 'beaches': {
      const p = [];
      if (tags.surface) p.push(tags.surface.replace(/_/g, ' ') + ' beach');
      else p.push('Beach');
      if (tags.length) p.push(`${tags.length}m long`);
      return p.join(', ') + '.';
    }
    case 'bridges': {
      const p = [];
      if (tags.bridge && tags.bridge !== 'yes') p.push(tags.bridge + ' bridge');
      else p.push('Bridge');
      if (tags.start_date) p.push(`built ${tags.start_date}`);
      if (tags.heritage) p.push(tags.heritage);
      return p.join(', ') + '.';
    }
    case 'distilleries': {
      const craft = tags.craft === 'distillery' ? 'Distillery' : 'Brewery';
      const p = [craft];
      if (tags.product) p.push(tags.product);
      return p.join(', ') + '.';
    }
    case 'landmarks':
      if (tags.description) return tags.description.substring(0, 120);
      if (tags.historic === 'monument') return 'Historic monument.';
      return 'Tourist attraction.';
    case 'ev_charging': {
      const p = [];
      if (tags.operator || tags.network) p.push(tags.operator || tags.network);
      if (tags.capacity) p.push(`${tags.capacity} points`);
      if (tags['socket:type2'] === 'yes') p.push('Type 2');
      if (tags['socket:chademo'] === 'yes') p.push('CHAdeMO');
      if (tags['socket:ccs'] === 'yes' || tags['socket:type2_combo'] === 'yes') p.push('CCS');
      return p.length ? 'EV charging: ' + p.join(', ') + '.' : 'EV charging station.';
    }
    case 'motorcycle_parking': {
      const p = ['Motorcycle parking'];
      if (tags.capacity) p.push(`${tags.capacity} spaces`);
      if (tags.covered === 'yes') p.push('covered');
      if (tags.fee === 'no' || tags.fee === 'free') p.push('free');
      return p.join(', ') + '.';
    }
    case 'repair_shops': {
      const p = ['Motorcycle shop'];
      if (tags.brand) p.push(tags.brand);
      if (tags['service:vehicle:tyres'] === 'yes') p.push('tyres');
      return p.join(', ') + '.';
    }
    case 'hotels': {
      const type = tags.tourism === 'guest_house' ? 'B&B/Guest House' : 'Hotel';
      const p = [type];
      if (tags.stars) p.push(`${tags.stars}-star`);
      if (tags.rooms) p.push(`${tags.rooms} rooms`);
      return p.join(', ') + '.';
    }
    case 'mountain_passes': {
      const p = ['Mountain pass'];
      if (tags.ele) p.push(`at ${Math.round(parseFloat(tags.ele))}m`);
      return p.join(' ') + '.';
    }
    default: return '';
  }
}

// ── Notability score for top-10 selection ──

function notabilityScore(tags, isCurated) {
  let s = 0;
  if (isCurated) s += 20;
  if (tags.wikipedia) s += 8;
  if (tags.wikidata) s += 5;
  if (tags.heritage) s += 4;
  if (tags.website || tags['contact:website']) s += 3;
  if (tags.description) s += 3;
  if (tags.image) s += 2;
  const tagCount = Object.keys(tags).length;
  if (tagCount > 15) s += 3;
  else if (tagCount > 8) s += 1;
  return s;
}

// ── Category definitions ──

const CATEGORIES = [
  {
    key: 'campsites',
    tags: ['["tourism"="camp_site"]'],
    requireName: true,
    maxResults: 2500
  },
  {
    key: 'pubs',
    tags: [
      '["amenity"="pub"]["food"="yes"]',
      '["amenity"="pub"]["real_ale"="yes"]',
      '["amenity"="pub"]["microbrewery"="yes"]',
      '["amenity"="pub"]["beer_garden"="yes"]',
      '["amenity"="pub"]["accommodation"="yes"]'
    ],
    requireName: true,
    maxResults: 3000
  },
  {
    key: 'viewpoints',
    tags: ['["tourism"="viewpoint"]'],
    requireName: true,
    maxResults: 2000
  },
  {
    key: 'castles',
    tags: ['["historic"="castle"]'],
    requireName: true,
    maxResults: 1000
  },
  {
    key: 'waterfalls',
    tags: ['["waterway"="waterfall"]'],
    requireName: true,
    maxResults: 600
  },
  {
    key: 'beaches',
    tags: ['["natural"="beach"]'],
    requireName: true,
    maxResults: 2000
  },
  {
    key: 'bridges',
    tags: [
      '["man_made"="bridge"]["wikipedia"]',
      '["man_made"="bridge"]["heritage"]',
      '["man_made"="bridge"]["historic"]',
      '["bridge"="yes"]["wikipedia"]'
    ],
    requireName: true,
    maxResults: 600
  },
  {
    key: 'distilleries',
    tags: ['["craft"="distillery"]', '["craft"="brewery"]'],
    requireName: true,
    maxResults: 800
  },
  {
    key: 'landmarks',
    tags: ['["tourism"="attraction"]', '["historic"="monument"]'],
    requireName: true,
    maxResults: 3000
  },
  {
    key: 'ev_charging',
    tags: ['["amenity"="charging_station"]'],
    requireName: false,
    maxResults: 5000
  },
  {
    key: 'motorcycle_parking',
    tags: [
      '["amenity"="parking"]["motorcycle"="yes"]',
      '["amenity"="parking"]["motorcycle"="designated"]',
      '["amenity"="motorcycle_parking"]'
    ],
    requireName: false,
    maxResults: 600
  },
  {
    key: 'repair_shops',
    tags: ['["shop"="motorcycle"]'],
    requireName: false,
    maxResults: 500
  },
  {
    key: 'hotels',
    tags: ['["tourism"="guest_house"]'],
    requireName: true,
    maxResults: 2000
  },
  {
    key: 'mountain_passes',
    tags: ['["mountain_pass"="yes"]'],
    requireName: false,
    maxResults: 200
  }
];

// ── Parse existing POI files ──

function readExistingPOIs(filename) {
  const path = filename.startsWith('/') ? filename : resolve(ROOT, filename);
  if (!existsSync(path)) return {};
  const content = readFileSync(path, 'utf8');
  const sandbox = { window: {} };
  createContext(sandbox);
  try {
    runInContext(content, sandbox);
  } catch (e) {
    console.error(`Failed to parse ${filename}: ${e.message}`);
    return {};
  }
  const keys = Object.keys(sandbox.window);
  return keys.length ? sandbox.window[keys[0]] : {};
}

// ── Deduplication ──

function isDuplicate(lat, lng, existingList) {
  for (const ex of existingList) {
    if (haversine(lat, lng, ex.lat, ex.lng) < DEDUP_RADIUS_M) return true;
  }
  return false;
}

// ── Scrape all categories ──

async function scrapeAll() {
  const allScraped = {};

  for (const cat of CATEGORIES) {
    console.log(`\nScraping: ${cat.key}...`);
    const query = buildQuery(cat.tags, cat.requireName);
    const data = await queryOverpass(query);
    const elements = data.elements || [];
    console.log(`  Raw elements: ${elements.length}`);

    const seen = new Set();
    let pois = [];

    for (const el of elements) {
      const lat = el.type === 'node' ? el.lat : el.center?.lat;
      const lon = el.type === 'node' ? el.lon : el.center?.lon;
      if (!lat || !lon) continue;

      const tags = el.tags || {};
      const name = tags.name || tags.description || '';
      if (!name && cat.requireName) continue;
      const displayName = name || `${cat.key.replace(/_/g, ' ')} at ${lat.toFixed(3)}, ${lon.toFixed(3)}`;

      const coordKey = `${lat.toFixed(5)},${lon.toFixed(5)}`;
      if (seen.has(coordKey)) continue;
      seen.add(coordKey);

      const desc = descForCategory(cat.key, tags);
      const score = notabilityScore(tags, false);

      const poi = {
        name: displayName,
        lat: parseFloat(lat.toFixed(5)),
        lng: parseFloat(lon.toFixed(5)),
        desc,
        _score: score
      };

      if (tags.website) poi.url = tags.website;
      else if (tags['contact:website']) poi.url = tags['contact:website'];

      pois.push(poi);
    }

    // Sort by score desc and limit
    if (cat.maxResults && pois.length > cat.maxResults) {
      pois.sort((a, b) => b._score - a._score);
      pois = pois.slice(0, cat.maxResults);
    }

    allScraped[cat.key] = pois;
    console.log(`  Kept: ${pois.length}`);

    if (CATEGORIES.indexOf(cat) < CATEGORIES.length - 1) {
      console.log(`  Waiting ${DELAY_MS / 1000}s...`);
      await sleep(DELAY_MS);
    }
  }
  return allScraped;
}

// ── Rate POIs 1-5 stars and select Editor's Picks ──

function computeRating(poi) {
  // 5 = curated by VisorUp editors (long hand-written descriptions)
  if (poi._curated) return 5;
  const s = poi._score || 0;
  const descLen = (poi.desc || '').length;
  // 4 = strong signals: high OSM score (wikipedia/wikidata/heritage + website + description)
  if (s >= 16 || (s >= 10 && descLen > 60)) return 4;
  // 3 = moderate signals: has website or decent tags
  if (s >= 6 || (poi.url && descLen > 20)) return 3;
  // 2 = minimal: has a name plus at least a website or one quality tag
  if (s >= 3 || poi.url) return 2;
  // 1 = stub: name and coordinates only
  return 1;
}

function rateAndSelectPicks(mergedPois) {
  for (const [cat, pois] of Object.entries(mergedPois)) {
    // Assign star ratings
    for (const p of pois) {
      p.rating = computeRating(p);
    }
    // Editor's Picks: top 10 by score within each category
    const scored = pois.map((p, i) => ({
      idx: i,
      score: (p._score || 0) + (p.desc && p.desc.length > 80 ? 5 : 0)
    }));
    scored.sort((a, b) => b.score - a.score);
    const topIndices = new Set(scored.slice(0, 10).map(s => s.idx));
    pois.forEach((p, i) => {
      if (topIndices.has(i)) p.top = true;
    });
  }
}

// ── Serialize POI file ──

function esc(str) {
  if (!str) return '';
  return String(str).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, ' ').replace(/\r/g, '');
}

function serializePOI(poi) {
  let s = `    { name: '${esc(poi.name)}', lat: ${poi.lat}, lng: ${poi.lng}, desc: '${esc(poi.desc)}'`;
  if (poi.url) s += `, url: '${esc(poi.url)}'`;
  if (poi.surface) s += `, surface: '${esc(poi.surface)}'`;
  if (poi.season) s += `, season: '${esc(poi.season)}'`;
  if (poi.hazard) s += `, hazard: '${esc(poi.hazard)}'`;
  if (poi.sLat !== undefined) s += `, sLat: ${poi.sLat}, sLng: ${poi.sLng}, eLat: ${poi.eLat}, eLng: ${poi.eLng}`;
  if (poi.miles) s += `, miles: ${poi.miles}`;
  if (poi.rating) s += `, rating: ${poi.rating}`;
  if (poi.top) s += `, top: true`;
  s += ' }';
  return s;
}

function generateFile(varName, header, data) {
  let out = `${header}\n\nwindow.${varName} = {\n`;
  const cats = Object.entries(data);
  for (let i = 0; i < cats.length; i++) {
    const [cat, pois] = cats[i];
    out += `\n  // ${cat.toUpperCase()} (${pois.length})\n`;
    out += `  ${cat}: [\n`;
    for (let j = 0; j < pois.length; j++) {
      out += serializePOI(pois[j]);
      if (j < pois.length - 1) out += ',';
      out += '\n';
    }
    out += '  ]';
    if (i < cats.length - 1) out += ',';
    out += '\n';
  }
  out += '\n};\n';
  return out;
}

// ── Main ──

async function main() {
  const useCached = process.argv.includes('--cached');
  let scraped;

  if (useCached && existsSync(CACHE_FILE)) {
    console.log('Using cached scraped data...');
    scraped = JSON.parse(readFileSync(CACHE_FILE, 'utf8'));
  } else {
    console.log('=== VisorUp Overpass POI Scraper ===\n');
    scraped = await scrapeAll();
    writeFileSync(CACHE_FILE, JSON.stringify(scraped));
    console.log(`\nCache saved to ${CACHE_FILE}`);
  }

  // Read original curated data (use --curated-from=<dir> to point at originals)
  const curatedArg = process.argv.find(a => a.startsWith('--curated-from='));
  const curatedDir = curatedArg ? curatedArg.split('=')[1] : ROOT;
  console.log('\nReading curated POIs from: ' + curatedDir);
  const existing = {
    england: readExistingPOIs(resolve(curatedDir, 'poi-england.js')),
    scotland: readExistingPOIs(resolve(curatedDir, 'poi-scotland.js')),
    wales: readExistingPOIs(resolve(curatedDir, 'poi-wales-islands.js'))
  };

  // Count curated
  let curatedTotal = 0;
  for (const region of Object.values(existing)) {
    for (const pois of Object.values(region)) {
      curatedTotal += pois.length;
    }
  }
  console.log(`  Curated POIs: ${curatedTotal}`);

  // Flatten curated for dedup lookup
  const curatedFlat = {};
  for (const region of Object.values(existing)) {
    for (const [cat, pois] of Object.entries(region)) {
      if (!curatedFlat[cat]) curatedFlat[cat] = [];
      curatedFlat[cat].push(...pois);
    }
  }

  // Mark curated POIs with high scores and curated flag
  for (const region of Object.values(existing)) {
    for (const pois of Object.values(region)) {
      for (const p of pois) {
        p._curated = true;
        p._score = 20 + (p.desc ? Math.min(p.desc.length / 10, 10) : 0) + (p.url ? 3 : 0);
      }
    }
  }

  // Classify scraped into regions and deduplicate
  let newTotal = 0;
  let dedupCount = 0;
  const newByRegion = { england: {}, scotland: {}, wales: {} };

  for (const [cat, pois] of Object.entries(scraped)) {
    const curatedList = curatedFlat[cat] || [];
    for (const poi of pois) {
      if (isDuplicate(poi.lat, poi.lng, curatedList)) {
        dedupCount++;
        continue;
      }
      const region = classifyRegion(poi.lat, poi.lng);
      if (!newByRegion[region][cat]) newByRegion[region][cat] = [];
      newByRegion[region][cat].push(poi);
      newTotal++;
    }
  }

  console.log(`  New scraped POIs (after dedup): ${newTotal}`);
  console.log(`  Duplicates removed: ${dedupCount}`);

  // Merge: curated first, then scraped
  const merged = { england: {}, scotland: {}, wales: {} };
  const allCats = new Set([
    ...Object.values(existing).flatMap(r => Object.keys(r)),
    ...Object.values(newByRegion).flatMap(r => Object.keys(r))
  ]);

  for (const region of ['england', 'scotland', 'wales']) {
    for (const cat of allCats) {
      merged[region][cat] = [
        ...(existing[region][cat] || []),
        ...(newByRegion[region][cat] || [])
      ];
    }
  }

  // Rate all POIs and select Editor's Picks
  for (const region of Object.values(merged)) {
    rateAndSelectPicks(region);
  }

  // Write output files
  const files = [
    {
      region: 'england',
      filename: 'poi-england.js',
      varName: 'POI_ENGLAND',
      header: '// POI - England\n// Points of Interest for motorcycle touring across England\n// Curated + OpenStreetMap data'
    },
    {
      region: 'scotland',
      filename: 'poi-scotland.js',
      varName: 'POI_SCOTLAND',
      header: '// POI - Scotland\n// Points of Interest for motorcycle touring across Scotland\n// Curated + OpenStreetMap data'
    },
    {
      region: 'wales',
      filename: 'poi-wales-islands.js',
      varName: 'POI_WALES_ISLANDS',
      header: '// POI - Wales, Channel Islands & Isle of Man\n// Points of Interest for motorcycle touring\n// Curated + OpenStreetMap data'
    }
  ];

  for (const f of files) {
    const data = merged[f.region];
    // Clean internal fields before writing
    for (const pois of Object.values(data)) {
      for (const p of pois) { delete p._score; delete p._curated; }
    }
    const content = generateFile(f.varName, f.header, data);
    writeFileSync(resolve(ROOT, f.filename), content);
    const total = Object.values(data).reduce((s, a) => s + a.length, 0);
    const topCount = Object.values(data).reduce((s, a) => s + a.filter(p => p.top).length, 0);
    const rDist = [0,0,0,0,0,0];
    for (const pois of Object.values(data)) for (const p of pois) rDist[p.rating || 1]++;
    console.log(`  ${f.filename}: ${total} POIs (${topCount} editor's picks) [5★:${rDist[5]} 4★:${rDist[4]} 3★:${rDist[3]} 2★:${rDist[2]} 1★:${rDist[1]}]`);
  }

  const grandTotal = Object.values(merged).reduce((s, region) =>
    s + Object.values(region).reduce((s2, a) => s2 + a.length, 0), 0);
  console.log(`\n=== Done. Grand total: ${grandTotal} POIs ===`);
}

main().catch(e => { console.error(e); process.exit(1); });
