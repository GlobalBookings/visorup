/**
 * Build Shop Catalogue
 *
 * Transforms the raw scraped data/products.json (38k colour variants) into
 * clean, deduplicated, per-category JSON files the website loads on demand.
 *
 *   - Decodes HTML entities in name/brand/description
 *   - Re-extracts brand from the cleaned name (fixes "Trustpilot Logo Stars" etc.)
 *   - Re-categorises everything with a richer keyword ruleset
 *   - Merges colour variants into a single product (keeps a colours[] list)
 *   - Writes public/data/shop/<category>.json + index.json
 *
 * Usage: node scripts/build-shop-catalogue.mjs
 */

import fs from 'fs';
import path from 'path';

const INPUT = path.resolve('data/products.json');
const OUT_DIR = path.resolve('public/data/shop');
const AFFILIATE = '#/28914,3714,0';

function decodeEntities(s) {
  if (!s) return '';
  return s
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&eacute;/g, 'é')
    .replace(/&pound;/g, '£')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
    .replace(/\s+/g, ' ')
    .trim();
}

function parsePrice(s) {
  if (!s) return null;
  const m = String(s).replace(/,/g, '').match(/(\d+(?:\.\d+)?)/);
  return m ? parseFloat(m[1]) : null;
}

// Helmet model keywords only apply when the brand is a known lid maker —
// otherwise generic words like "storm" or "header" wrongly grab jackets/exhausts.
const HELMET_BRANDS = new Set([
  'shoei', 'arai', 'agv', 'hjc', 'shark', 'bell', 'ls2', 'schuberth', 'nolan', 'mt',
  'caberg', 'scorpion', 'x-lite', 'airoh', 'nexx', 'hedon', 'ruroc', 'icon', 'fox',
  'oneal', 'o\'neal', 'leatt', 'klim', 'spada', 'duchinni', 'vcan', 'stealth', 'box',
]);
const HELMET_MODELS = [
  'nxr', 'gt-air', 'gt air', 'neotec', 'x-spirit', 'x spirit', 'glamster', 'j-cruise', 'jcruise', 'vfx',
  'rx-7', 'tour-x', 'tourx', 'quantic', 'rapide',
  'k1', 'k3', 'k5', 'k6', 'pista', 'ax9', 'sportmodular', 'tourmodular',
  'rpha', 'i70', 'i71', 'i80', 'i90', 'i50', 'i30', 'c70', 'c80', 'c91', 'f70', 'f71',
  'ridill', 'spartan', 'd-skwal', 'skwal', 's-drak',
  'qualifier', 'race star',
  'advant', 'thunder', 'braker', 'targo', 'genesis',
  'n70', 'n80', 'n87', 'n100', 'x-803', 'x-804',
  'drift', 'flyon', 'levo', 'exo', 'moto 9', 'moto 8', 'moto 7',
];

function categorise(name, brand) {
  const ln = name.toLowerCase();
  const lb = (brand || '').toLowerCase();
  const has = (...kw) => kw.some(k => ln.includes(k));

  // Care / cleaning / consumables go to Accessories first (before keyword bleed)
  if (has('wipe', 'microfibre', 'micro fibre', 'cleaning cloth', 'care kit', 'cleaner', 'cleaning kit',
          'anti-fog', 'anti fog', 'fuse', 'polish', 'detailer', 'protectant')) return 'Accessories';

  // Helmets & helmet accessories
  if (has('helmet', 'visor', 'pinlock', 'face shield', 'helemt')) return 'Helmets';
  if (has(' jet ', 'open face', 'full face', 'flip up', 'flip-up', 'modular')) return 'Helmets';
  if (HELMET_BRANDS.has(lb) && HELMET_MODELS.some(m => ln.includes(m)) &&
      !has('jacket','glove','boot','pant','bag','exhaust','rack','cover','collar','rear set')) return 'Helmets';

  // Exhausts (large slice of Other)
  if (has('exhaust', 'silencer', 'downpipe', 'down pipe', 'link pipe', 'collector', 'db killer',
          'end can', 'slip-on', 'slip on', 'full system', 'header')) return 'Exhausts';

  // Trousers / jeans
  if (has('trouser', 'jeans', 'jean ', 'jegging', 'legging', ' pant', 'pants ', 'pants-', 'salopette',
          'chino', 'cargo')) return 'Trousers';

  // Jackets & suits
  if (has('jacket', 'suit', 'gilet', 'bodywarmer', 'smock', 'parka')) return 'Jackets';

  // Casual / base layers
  if (has('t-shirt', 'tshirt', 't shirt', 'hoodie', 'hoody', 'sweatshirt', 'jumper', 'fleece',
          'polo', 'cap ', ' cap', 'beanie', 'sock', 'belt')) return 'Casual';
  if (has('base layer', 'baselayer', 'thermal', 'balaclava', 'neck tube', 'neck warmer', 'snood',
          'underwear', 'boxer')) return 'Base Layers';

  // Gloves
  if (has('glove', 'mitt')) return 'Gloves';

  // Boots & footwear
  if (has('boot', 'shoe', 'trainer', 'sneaker')) return 'Boots';

  // Luggage
  if (has('pannier', 'tank bag', 'tail pack', 'roll bag', 'saddle bag', 'top box', 'top case',
          'side case', 'luggage', 'rack', 'rucksack', 'backpack', 'dry bag', 'seat bag', 'duffel',
          'barrel bag', 'holdall', 'tail bag', 'tunnel bag', 'sissy bar')) return 'Luggage';

  // Electronics
  if (has('intercom', 'camera', 'sat nav', 'satnav', ' gps', 'charger', 'phone mount', 'phone holder',
          'dash cam', 'bluetooth', 'headset', 'sena', 'cardo', 'tyre pressure monitor', 'tpms')) return 'Electronics';

  // Protection
  if (has('back protector', 'chest protector', 'body armour', 'body armor', 'knee', 'elbow guard',
          'armour', 'armor', ' guard', 'kidney belt', 'neck brace', 'airbag', 'protector')) return 'Protection';

  // Parts / maintenance
  if (has('chain', 'sprocket', 'brake pad', 'brake disc', 'brake line', 'filter', 'spark plug',
          'battery', 'tyre', 'tire', ' oil', 'lever', 'grip', 'mirror', 'screen', 'windshield',
          'windscreen', 'mudguard', 'hugger', 'crash bung', 'crash protect', 'frame slider',
          'radiator', 'clutch', 'cable', 'bearing', 'bulb', 'indicator', 'fork')) return 'Parts';

  // Mounts & fitting kits
  if (has('mount', 'bracket', 'fitting kit', 'adapter', 'adaptor')) return 'Parts';

  // Accessories / care
  if (has('lock', 'cover', 'stand', 'paddock', 'ramp', 'cleaning', 'cleaner', 'tool', 'tent',
          'camping', 'garage', 'tie down', 'tie-down', 'lubricant', 'lube', 'polish', 'wax',
          'sticker', 'decal', 'keyring', 'gift', 'stationery')) return 'Accessories';

  return 'Other';
}

function colourFamily(colour) {
  const lc = (colour || '').toLowerCase();
  if (!lc) return 'other';
  if (lc.includes('hi-vis') || lc.includes('hi vis') || lc.includes('fluo') || lc.includes('yellow')) return 'hi-vis';
  if (lc.includes('white') && !lc.includes('black')) return 'white';
  if (lc.includes('black')) return 'black';
  if (lc.includes('red') || lc.includes('burgundy')) return 'red';
  if (lc.includes('blue') || lc.includes('navy')) return 'blue';
  if (lc.includes('grey') || lc.includes('gray') || lc.includes('silver') || lc.includes('gun')) return 'grey';
  if (lc.includes('green') || lc.includes('olive') || lc.includes('khaki') || lc.includes('camo')) return 'green';
  if (lc.includes('orange') || lc.includes('bronze')) return 'orange';
  if (lc.includes('brown') || lc.includes('tan') || lc.includes('sand')) return 'brown';
  if (lc.includes('pink') || lc.includes('purple') || lc.includes('violet')) return 'pink';
  return 'other';
}

function slugify(s) {
  return s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
}

function main() {
  const raw = JSON.parse(fs.readFileSync(INPUT, 'utf8'));
  console.log(`Loaded ${raw.length} raw entries`);

  // Clean + normalise every entry
  const cleaned = raw.map(p => {
    const name = decodeEntities(p.name);
    const brand = name.split(' ')[0] || decodeEntities(p.brand);
    const colourMatch = name.match(/ - (.+)$/);
    const colour = colourMatch ? colourMatch[1].trim() : '';
    const baseName = name.replace(/ - .+$/, '').trim();
    return {
      id: p.id,
      name, brand, baseName, colour,
      colourFamily: colourFamily(colour),
      price: p.price ? '£' + parsePrice(p.price) : '',
      priceNum: parsePrice(p.price),
      category: categorise(name, brand),
      url: p.url,
      affiliateUrl: p.url + AFFILIATE,
      image: p.imageUrl,
      thumb: p.thumbUrl,
    };
  }).filter(p => p.name && p.priceNum);

  console.log(`Cleaned to ${cleaned.length} priced entries`);

  // Merge colour variants by baseName + brand
  const groups = new Map();
  for (const p of cleaned) {
    const key = p.brand.toLowerCase() + '|' + p.baseName.toLowerCase();
    if (!groups.has(key)) {
      groups.set(key, {
        id: p.id,
        slug: slugify(p.baseName),
        name: p.baseName,
        brand: p.brand,
        category: p.category,
        priceNum: p.priceNum,
        price: p.price,
        url: p.url,
        affiliateUrl: p.affiliateUrl,
        image: p.image,
        thumb: p.thumb,
        colours: [],
      });
    }
    const g = groups.get(key);
    g.colours.push({ colour: p.colour, family: p.colourFamily, image: p.image, affiliateUrl: p.affiliateUrl });
    // Keep the lowest price across variants as the headline price
    if (p.priceNum < g.priceNum) { g.priceNum = p.priceNum; g.price = p.price; }
  }

  const products = [...groups.values()].map(g => ({
    ...g,
    colourCount: g.colours.length,
    colourFamilies: [...new Set(g.colours.map(c => c.family))],
  }));
  console.log(`Merged into ${products.length} unique products`);

  // Group by category, write files
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  const byCat = {};
  for (const p of products) (byCat[p.category] = byCat[p.category] || []).push(p);

  const index = { generated: new Date().toISOString(), total: products.length, categories: {} };
  for (const [cat, items] of Object.entries(byCat)) {
    // Default sort: price descending so flagship products lead the category
    items.sort((a, b) => b.priceNum - a.priceNum);
    const brands = {};
    for (const p of items) brands[p.brand] = (brands[p.brand] || 0) + 1;
    const topBrands = Object.entries(brands).sort((a, b) => b[1] - a[1]).map(([b, c]) => ({ brand: b, count: c }));
    const slug = slugify(cat);
    fs.writeFileSync(path.join(OUT_DIR, slug + '.json'), JSON.stringify(items));
    const prices = items.map(p => p.priceNum);
    index.categories[cat] = {
      slug, count: items.length,
      minPrice: Math.min.apply(null, prices),
      maxPrice: Math.max.apply(null, prices),
      brands: topBrands.slice(0, 40),
    };
    console.log(`  ${cat}: ${items.length} products → ${slug}.json`);
  }

  fs.writeFileSync(path.join(OUT_DIR, 'index.json'), JSON.stringify(index, null, 2));

  // Compact global search index (name/brand/price/thumb/link/category) for on-demand search
  const searchIndex = products.map(p => ({
    n: p.name, b: p.brand, c: p.category, p: p.priceNum,
    t: p.thumb, u: p.affiliateUrl,
  }));
  fs.writeFileSync(path.join(OUT_DIR, 'search-index.json'), JSON.stringify(searchIndex));
  const siSize = (fs.statSync(path.join(OUT_DIR, 'search-index.json')).size / 1024 / 1024).toFixed(1);
  console.log(`\nWrote index.json + search-index.json (${siSize}MB)`);
  console.log(`${products.length} products across ${Object.keys(byCat).length} categories`);
}

main();
