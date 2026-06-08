/**
 * Samples product URLs, fetches just the <title>, categorises them,
 * then reorders the full URL list with touring-priority categories first.
 * 
 * Priority order:
 * 1. Helmets, Clothing (jackets/trousers), Gloves, Boots - core riding gear
 * 2. Luggage, Electronics (intercoms, nav, cameras)
 * 3. Accessories (locks, covers, tools, camping)
 * 4. Protection (armour, back protectors)
 * 5. Parts (chains, brakes, filters, tyres)
 * 6. Everything else
 */

import fs from 'fs';
import path from 'path';

const URLS_FILE = path.resolve('product_urls.txt');
const OUTPUT_FILE = path.resolve('product_urls_prioritised.txt');
const TITLES_CACHE = path.resolve('data/title-cache.json');

const USER_AGENTS = [
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
];

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function categoriseFromTitle(title) {
  const t = title.toLowerCase();
  if (t.includes('helmet') || t.includes('visor') || t.includes('pinlock')) return 'Helmets';
  if (t.includes('glove')) return 'Gloves';
  if (t.includes('boot') || t.includes('shoe') || t.includes('trainer')) return 'Boots';
  if (t.includes('jacket') || t.includes('trouser') || t.includes('suit') || t.includes('jeans') || t.includes('hoodie') || t.includes('gilet') || t.includes('base layer') || t.includes('thermal') || t.includes('textile') || t.includes('leather')) return 'Clothing';
  if (t.includes('pannier') || t.includes('tank bag') || t.includes('tail pack') || t.includes('roll bag') || t.includes('saddle bag') || t.includes('top box') || t.includes('luggage') || t.includes('rack') || t.includes('rucksack') || t.includes('backpack') || t.includes('dry bag')) return 'Luggage';
  if (t.includes('intercom') || t.includes('camera') || t.includes('sat nav') || t.includes('gps') || t.includes('charger') || t.includes('phone mount') || t.includes('dash cam') || t.includes('bluetooth') || t.includes('headset') || t.includes('sena') || t.includes('cardo')) return 'Electronics';
  if (t.includes('chain') || t.includes('sprocket') || t.includes('brake pad') || t.includes('filter') || t.includes('spark plug') || t.includes('battery') || t.includes('tyre') || t.includes('oil')) return 'Parts';
  if (t.includes('lock') || t.includes('cover') || t.includes('stand') || t.includes('paddock') || t.includes('ramp') || t.includes('cleaning') || t.includes('tool') || t.includes('tent') || t.includes('camping') || t.includes('garage')) return 'Accessories';
  if (t.includes('neck') || t.includes('balaclava') || t.includes('goggle') || t.includes('ear plug') || t.includes('back protector') || t.includes('knee') || t.includes('armour') || t.includes('guard')) return 'Protection';
  return 'Other';
}

const PRIORITY = {
  'Helmets': 1,
  'Clothing': 1,
  'Gloves': 1,
  'Boots': 1,
  'Luggage': 2,
  'Electronics': 2,
  'Protection': 3,
  'Accessories': 3,
  'Parts': 4,
  'Other': 5,
};

function extractId(url) {
  const m = url.match(/content_prod\/(\d+)/);
  return m ? m[1] : null;
}

async function fetchTitle(url) {
  const res = await fetch(url.trim(), {
    headers: {
      'User-Agent': USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)],
      'Accept': 'text/html',
      'Accept-Language': 'en-GB,en;q=0.9',
      'Range': 'bytes=0-4000', // Only fetch first 4KB to get <title>
    },
  });
  
  if (res.status === 403 || res.status === 429) throw new Error('BLOCKED');
  
  const html = await res.text();
  const match = html.match(/<title>([^<]+)<\/title>/i);
  return match ? match[1].replace(/ - FREE UK DELIVERY.*$/i, '').trim() : '';
}

async function main() {
  const urls = fs.readFileSync(URLS_FILE, 'utf8').trim().split('\n').filter(u => u.trim());
  console.log(`Total URLs: ${urls.length}`);

  // Load existing scraped data for known categories
  let knownCategories = {};
  if (fs.existsSync(path.resolve('data/products.json'))) {
    const products = JSON.parse(fs.readFileSync(path.resolve('data/products.json'), 'utf8'));
    for (const p of products) {
      knownCategories[p.id] = p.category;
    }
    console.log(`Already categorised from scraper: ${Object.keys(knownCategories).length}`);
  }

  // Load title cache
  let titleCache = {};
  if (fs.existsSync(TITLES_CACHE)) {
    titleCache = JSON.parse(fs.readFileSync(TITLES_CACHE, 'utf8'));
    console.log(`Cached titles: ${Object.keys(titleCache).length}`);
  }

  // Sample ~50 evenly spaced URLs to learn the category distribution
  const sampleSize = 50;
  const step = Math.floor(urls.length / sampleSize);
  const samplesToFetch = [];
  
  for (let i = 0; i < urls.length; i += step) {
    const id = extractId(urls[i]);
    if (id && !knownCategories[id] && !titleCache[id]) {
      samplesToFetch.push({ idx: i, url: urls[i], id });
    }
  }
  
  console.log(`Need to fetch ${samplesToFetch.length} titles for categorisation...`);
  
  // Fetch titles with delays
  let fetched = 0;
  for (const sample of samplesToFetch) {
    try {
      process.stdout.write(`[${fetched + 1}/${samplesToFetch.length}] ${sample.id}... `);
      const title = await fetchTitle(sample.url);
      if (title) {
        titleCache[sample.id] = title;
        const cat = categoriseFromTitle(title);
        knownCategories[sample.id] = cat;
        console.log(`${cat} (${title.substring(0, 40)})`);
        fetched++;
      } else {
        console.log('no title');
      }
    } catch (err) {
      console.log(`✗ ${err.message}`);
      if (err.message === 'BLOCKED') {
        console.log('Blocked - stopping fetch, using what we have');
        break;
      }
    }
    
    // Save cache
    fs.writeFileSync(TITLES_CACHE, JSON.stringify(titleCache, null, 2));
    
    if (fetched < samplesToFetch.length - 1) {
      await sleep(8000 + Math.random() * 7000);
    }
  }

  // Now categorise ALL URLs based on what we know
  // For unknown products, assign based on nearest known neighbour (products are often grouped by category)
  console.log(`\nCategorising all ${urls.length} URLs...`);
  
  const categorised = urls.map((url, idx) => {
    const id = extractId(url);
    let category = knownCategories[id] || '';
    
    // If unknown, check title cache
    if (!category && titleCache[id]) {
      category = categoriseFromTitle(titleCache[id]);
    }
    
    return { url: url.trim(), id, category, idx };
  });

  // Fill in unknowns by looking at nearby products (they tend to be grouped)
  let lastKnownCat = 'Other';
  for (const item of categorised) {
    if (item.category) {
      lastKnownCat = item.category;
    } else {
      item.category = lastKnownCat;
    }
  }

  // Sort by priority
  categorised.sort((a, b) => {
    const pa = PRIORITY[a.category] || 5;
    const pb = PRIORITY[b.category] || 5;
    return pa - pb;
  });

  // Write prioritised URLs
  const output = categorised.map(c => c.url).join('\n') + '\n';
  fs.writeFileSync(OUTPUT_FILE, output);
  
  // Stats
  const cats = {};
  for (const c of categorised) {
    cats[c.category] = (cats[c.category] || 0) + 1;
  }
  
  console.log(`\nPrioritised URL list saved: ${OUTPUT_FILE}`);
  console.log(`\nEstimated category distribution:`);
  for (const [cat, count] of Object.entries(cats).sort((a, b) => (PRIORITY[a] || 5) - (PRIORITY[b] || 5))) {
    const prio = PRIORITY[cat] || 5;
    console.log(`  [P${prio}] ${cat}: ${count} (${((count / urls.length) * 100).toFixed(1)}%)`);
  }
}

main().catch(console.error);
