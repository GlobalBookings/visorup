/**
 * Build curated Gear Finder picks from the real catalogue.
 * Output: public/data/shop/gear-picks.json
 * Structure mirrors gearFinder.getRecommendations(category, subKey, budget):
 *   { helmets: { beginner|touring|adventure: { budget|mid|premium: [products] } }, ... }
 * Each product: { name, brand, price, priceNum, why, url, thumb }
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SHOP_DIR = path.join(__dirname, '..', 'public', 'data', 'shop');

// Minimum sensible price per category so trivial accessories (a £9 strap, a £15 part)
// never get recommended as if they were the real product.
const FLOORS = { helmets: 55, jackets: 60, trousers: 45, gloves: 25, boots: 60, luggage: 25, electronics: 30 };

function load(cat) {
  const f = path.join(SHOP_DIR, cat + '.json');
  const arr = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : [];
  const floor = FLOORS[cat] || 0;
  return arr.filter((p) => typeof p.priceNum === 'number' && p.priceNum >= floor);
}

const TIERS = {
  budget: (p) => p.priceNum < 150,
  mid: (p) => p.priceNum >= 150 && p.priceNum < 400,
  premium: (p) => p.priceNum >= 400,
};

const has = (p, ...kw) => {
  const n = p.name.toLowerCase();
  return kw.some((k) => n.includes(k));
};
const not = (p, ...kw) => {
  const n = p.name.toLowerCase();
  return !kw.some((k) => n.includes(k));
};

// Quality proxy: more colour variants = more stocked/popular; then price within tier.
function rank(arr) {
  return arr.slice().sort((a, b) => (b.colourCount - a.colourCount) || (b.priceNum - a.priceNum));
}

function pick(items, filterFn, tierFn, n = 3) {
  const matched = rank(items.filter((p) => tierFn(p) && filterFn(p)));
  // Fallback: if too few match the keyword filter, top up with any in-tier product
  if (matched.length < n) {
    const extra = rank(items.filter((p) => tierFn(p) && !matched.includes(p)));
    matched.push(...extra.slice(0, n - matched.length));
  }
  return matched.slice(0, n);
}

function reason(category, subKey, tier, p) {
  const b = p.brand;
  const map = {
    helmets: {
      beginner: `Well-rounded full-face lid from ${b} — a safe, comfortable first helmet.`,
      touring: `Quiet, feature-rich ${b} helmet built for long days in the saddle.`,
      adventure: `${b} adventure helmet with peak and wide view — road and trail ready.`,
    },
    jackets: {
      fairWeather: `Ventilated ${b} jacket that keeps you cool when the sun's out.`,
      allWeather: `Waterproof ${b} jacket with the protection to handle any forecast.`,
      winter: `Warm, weatherproof ${b} jacket for cold-season touring.`,
    },
    gloves: {
      fairWeather: `Breathable ${b} gloves with solid summer protection.`,
      allWeather: `Waterproof ${b} gloves that stay comfortable in the wet.`,
      winter: `Insulated ${b} gloves to keep your hands warm in the cold.`,
    },
    trousers: {
      fairWeather: `Lightweight, protective ${b} trousers that keep you cool on warmer rides.`,
      allWeather: `Waterproof ${b} trousers ready for whatever the forecast throws at you.`,
      winter: `Warm, weatherproof ${b} trousers for cold-season touring.`,
    },
    boots: { touring: `Comfortable, weatherproof ${b} boots built for the long haul.` },
    armour: { all: `Serious ${b} impact protection — one of the smartest safety upgrades you can make.` },
    luggage: { touring: `Practical ${b} luggage to carry kit securely on tour.` },
    electronics: { all: `Popular ${b} tech to upgrade your ride.` },
  };
  const tierNote = tier === 'premium' ? ' Top-tier choice.' : tier === 'budget' ? ' Great value.' : '';
  return (map[category]?.[subKey] || `Quality ${b} gear.`) + tierNote;
}

function toProduct(category, subKey, tier, p) {
  return {
    name: p.name,
    brand: p.brand,
    price: p.price,
    priceNum: p.priceNum,
    why: reason(category, subKey, tier, p),
    url: p.affiliateUrl,
    thumb: p.thumb,
    colourCount: p.colourCount,
  };
}

function buildCategory(items, subKeyFilters) {
  const out = {};
  for (const [subKey, filterFn] of Object.entries(subKeyFilters)) {
    out[subKey] = {};
    for (const [tier, tierFn] of Object.entries(TIERS)) {
      out[subKey][tier] = pick(items, filterFn, tierFn).map((p) => toProduct('__cat__', subKey, tier, p));
    }
  }
  return out;
}

// Rider body armour lives inside the 'protection' catalogue (which is mostly bike
// crash protection), so positively select only wearable armour.
const isArmour = (p) => has(p, 'back protector', 'body armour', 'chest protector', 'armoured shirt', 'armour shirt', 'protective shirt', 'knee armour', 'armour insert', 'protector vest', 'safety jacket', 'airbag', 'tech-air', 'rib protector', 'shoulder armour');

// --- Load catalogues ---
const helmets = load('helmets');
const jackets = load('jackets');
const trousers = load('trousers');
const gloves = load('gloves');
const boots = load('boots');
const luggage = load('luggage');
const electronics = load('electronics');
const armour = load('protection').filter((p) => isArmour(p) && p.priceNum >= 30);

// --- Filters per subKey ---
const out = {
  helmets: {},
  jackets: {},
  trousers: {},
  gloves: {},
  boots: {},
  armour: {},
  luggage: {},
  electronics: {},
};

const helmetFilters = {
  beginner: (p) => !has(p, 'modular', 'flip', 'adventure', 'adv', 'tour-x', 'hornet', 'open face', 'jet'),
  touring: (p) => has(p, 'modular', 'flip', 'neotec', 'c5', 'c3', 'c4', 'rpha 91', 'lite', 'tour'),
  adventure: (p) => has(p, 'adventure', 'adv', 'tour-x', 'tourx', 'hornet', 'explorer', 'rally', 'peak', 'dual'),
};
const weatherJacketFilters = {
  fairWeather: (p) => has(p, 'mesh', ' air', 'summer', 'ventilat', 'vented'),
  allWeather: (p) => has(p, 'waterproof', 'gore-tex', 'gore tex', 'gtx', 'laminat', 'membrane', '3-layer', 'h2o', 'aqua', 'drystar'),
  winter: (p) => has(p, 'winter', 'thermal', 'gore-tex', 'gtx', 'laminat', 'warm', 'h2o'),
};
const weatherGloveFilters = {
  fairWeather: (p) => has(p, 'summer', 'mesh', 'short', 'vented', ' air') && not(p, 'casual'),
  allWeather: (p) => has(p, 'waterproof', 'gore-tex', 'gtx', 'membrane', 'drystar', 'h2o', 'aqua') && not(p, 'casual'),
  winter: (p) => has(p, 'winter', 'thermal', 'heated') && not(p, 'casual'),
};
const weatherTrouserFilters = {
  fairWeather: (p) => has(p, 'mesh', ' air', 'summer', 'ventilat', 'vented', 'jean', 'denim') && not(p, 'kids', 'junior'),
  allWeather: (p) => has(p, 'waterproof', 'gore-tex', 'gore tex', 'gtx', 'laminat', 'membrane', 'h2o', 'aqua', 'drystar', 'textile') && not(p, 'kids', 'junior'),
  winter: (p) => has(p, 'winter', 'thermal', 'gore-tex', 'gtx', 'laminat', 'h2o') && not(p, 'kids', 'junior'),
};

for (const [subKey, fn] of Object.entries(helmetFilters)) {
  out.helmets[subKey] = {};
  for (const [tier, tierFn] of Object.entries(TIERS)) {
    out.helmets[subKey][tier] = pick(helmets, fn, tierFn).map((p) => toProduct('helmets', subKey, tier, p));
  }
}
for (const [subKey, fn] of Object.entries(weatherJacketFilters)) {
  out.jackets[subKey] = {};
  for (const [tier, tierFn] of Object.entries(TIERS)) {
    out.jackets[subKey][tier] = pick(jackets, fn, tierFn).map((p) => toProduct('jackets', subKey, tier, p));
  }
}
for (const [subKey, fn] of Object.entries(weatherTrouserFilters)) {
  out.trousers[subKey] = {};
  for (const [tier, tierFn] of Object.entries(TIERS)) {
    out.trousers[subKey][tier] = pick(trousers, fn, tierFn).map((p) => toProduct('trousers', subKey, tier, p));
  }
}
for (const [subKey, fn] of Object.entries(weatherGloveFilters)) {
  out.gloves[subKey] = {};
  for (const [tier, tierFn] of Object.entries(TIERS)) {
    out.gloves[subKey][tier] = pick(gloves, fn, tierFn).map((p) => toProduct('gloves', subKey, tier, p));
  }
}
// Boots / luggage / electronics: single subKey
out.boots.touring = {};
for (const [tier, tierFn] of Object.entries(TIERS)) {
  out.boots.touring[tier] = pick(boots, (p) => has(p, 'touring', 'waterproof', 'gore-tex', 'gtx', 'adventure', 'sport', 'road'), tierFn)
    .map((p) => toProduct('boots', 'touring', tier, p));
}
out.armour.all = {};
for (const [tier, tierFn] of Object.entries(TIERS)) {
  out.armour.all[tier] = pick(armour, () => true, tierFn).map((p) => toProduct('armour', 'all', tier, p));
}
out.luggage.touring = {};
for (const [tier, tierFn] of Object.entries(TIERS)) {
  out.luggage.touring[tier] = pick(luggage, (p) => has(p, 'pannier', 'tank bag', 'top box', 'tail pack', 'tail bag', 'roll bag', 'saddle', 'rucksack', 'backpack', 'duffle', 'kit bag', 'luggage', 'bag') && not(p, 'holder', 'bracket', 'fitting', 'frame', 'mount kit', 'inner bag', 'rack', 'plate'), tierFn)
    .map((p) => toProduct('luggage', 'touring', tier, p));
}
out.electronics.all = {};
for (const [tier, tierFn] of Object.entries(TIERS)) {
  out.electronics.all[tier] = pick(electronics, (p) => has(p, 'intercom', 'comm', 'camera', 'sat nav', 'gps', 'charger', 'cardo', 'sena', 'mount'), tierFn)
    .map((p) => toProduct('electronics', 'all', tier, p));
}

fs.writeFileSync(path.join(SHOP_DIR, 'gear-picks.json'), JSON.stringify(out, null, 1));

// Report
let count = 0;
for (const cat of Object.keys(out)) {
  for (const sk of Object.keys(out[cat])) {
    for (const t of Object.keys(out[cat][sk])) count += out[cat][sk][t].length;
  }
}
console.log(`Wrote gear-picks.json — ${count} curated product slots`);
for (const cat of Object.keys(out)) {
  const sample = Object.values(out[cat])[0];
  const tierSample = sample.mid || sample.premium || Object.values(sample)[0];
  console.log(`  ${cat}: ${tierSample.length ? tierSample[0].brand + ' ' + tierSample[0].name.slice(0, 30) : '(empty)'}`);
}
