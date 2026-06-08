/**
 * SportsBikeShop Product Scraper
 * 
 * Scrapes product data from sportsbikeshop.co.uk URLs.
 * Designed to handle their Cloudflare blocking:
 * - Random delays between requests (8-15 seconds)
 * - Saves progress after each batch
 * - Can be resumed from where it left off
 * - Rotates user agents
 * 
 * Usage:
 *   node scripts/scrape-products.mjs              # Start/resume scraping
 *   node scripts/scrape-products.mjs --batch=50   # Scrape 50 products then stop
 *   node scripts/scrape-products.mjs --offset=100 # Start from product 100
 */

import fs from 'fs';
import path from 'path';

const URLS_FILE_PRIORITISED = path.resolve('product_urls_prioritised.txt');
const URLS_FILE_ORIGINAL = path.resolve('product_urls.txt');
const URLS_FILE = fs.existsSync(URLS_FILE_PRIORITISED) ? URLS_FILE_PRIORITISED : URLS_FILE_ORIGINAL;
const OUTPUT_FILE = path.resolve('data/products.json');
const PROGRESS_FILE = path.resolve('data/scrape-progress.json');
const FAILED_FILE = path.resolve('data/failed-urls.json');

const USER_AGENTS = [
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0',
];

const CATEGORY_MAP = {
  '/content_cat/1': 'Helmets',
  '/content_cat/17': 'Clothing',
  '/content_cat/63': 'Gloves',
  '/content_cat/62': 'Boots',
  '/content_cat/19': 'Accessories',
  '/content_cat/169': 'Parts',
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomDelay() {
  return 15000 + Math.random() * 15000; // 15-30 seconds (overnight safe mode)
}

function getRandomUA() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

function extractProductId(url) {
  const match = url.match(/content_prod\/(\d+)/);
  return match ? match[1] : null;
}

function parseProduct(html, url) {
  const id = extractProductId(url);
  if (!id) return null;

  // Extract title
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  let name = titleMatch ? titleMatch[1].replace(/ - FREE UK DELIVERY.*$/i, '').trim() : '';

  // Extract brand from h1 or title
  const brandMatch = html.match(/<img[^>]*class="[^"]*brand-logo[^"]*"[^>]*alt="([^"]+)"/i)
    || html.match(/logo\/([a-z-]+)\.svg/i);
  let brand = '';
  if (brandMatch) {
    brand = brandMatch[1].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  } else if (name.includes(' - ')) {
    // Try to extract brand from product name pattern "Brand Product - Colour"
    const parts = name.split(' ');
    brand = parts[0];
  }

  // Extract price (look for GBP first, then any currency)
  let price = '';
  const priceMatch = html.match(/£([\d,.]+)/);
  if (priceMatch) {
    price = '£' + priceMatch[1];
  } else {
    const dollarMatch = html.match(/\$[^\d]*([\d,.]+)/);
    if (dollarMatch) price = '$' + dollarMatch[1];
  }

  // Extract RRP
  let rrp = '';
  const rrpMatch = html.match(/RRP[^£$]*[£$]([\d,.]+)/i);
  if (rrpMatch) rrp = '£' + rrpMatch[1];

  // Extract description (first paragraph or subtitle)
  let description = '';
  const descMatch = html.match(/<h2[^>]*>([^<]+)<\/h2>/);
  if (descMatch) description = descMatch[1].trim();

  // Categorise from product name
  let category = 'Other';
  const lowerName = name.toLowerCase();
  // Known helmet models that don't say "helmet" in the name
  const helmetModels = ['shoei nxr', 'shoei gt-air', 'shoei gt air', 'shoei neotec', 'shoei x-spirit', 'shoei x spirit', 'shoei glamster', 'shoei j-cruise', 'shoei j cruise', 'shoei vfx',
    'arai rx-7', 'arai tour-x', 'arai profile', 'arai quantic', 'arai xd', 'arai sz',
    'agv k1', 'agv k3', 'agv k5', 'agv k6', 'agv pista', 'agv ax9', 'agv sportmodular',
    'hjc rpha', 'hjc i70', 'hjc i71', 'hjc i80', 'hjc i90', 'hjc c70', 'hjc c80', 'hjc c91', 'hjc f70', 'hjc f71',
    'shark ridill', 'shark spartan', 'shark evo', 'shark d-skwal', 'shark skwal', 'shark s-drak',
    'bell qualifier', 'bell star', 'bell srt', 'bell race star',
    'ls2 storm', 'ls2 stream', 'ls2 advant', 'ls2 explorer', 'ls2 vector',
    'schuberth c5', 'schuberth s3', 'schuberth e2', 'schuberth r2',
    'nolan n70', 'nolan n80', 'nolan n87', 'nolan n100', 'nolan x-lite', 'x-lite x-803',
    'mt thunder', 'mt braker', 'mt blade', 'mt targo', 'mt atom', 'mt genesis',
    'caberg drift', 'caberg flyon', 'caberg levo', 'caberg duke',
    'scorpion exo', 'leatt moto 7.5', 'leatt moto 8.5', 'leatt moto 9.5'];

  if (lowerName.includes('helmet') || lowerName.includes('visor') || lowerName.includes('pinlock')) category = 'Helmets';
  else if (helmetModels.some(m => lowerName.includes(m))) category = 'Helmets';
  else if (lowerName.includes('glove')) category = 'Gloves';
  else if (lowerName.includes('boot') || lowerName.includes('shoe') || lowerName.includes('trainer')) category = 'Boots';
  else if (lowerName.includes('jacket') || lowerName.includes('trouser') || lowerName.includes('suit') || lowerName.includes('jeans') || lowerName.includes('jean ') || lowerName.includes('jegging') || lowerName.includes('legging') || lowerName.includes('hoodie') || lowerName.includes('gilet') || lowerName.includes('base layer') || lowerName.includes('thermal') || lowerName.includes('textile ')) category = 'Clothing';
  else if (lowerName.includes('pannier') || lowerName.includes('tank bag') || lowerName.includes('tail pack') || lowerName.includes('roll bag') || lowerName.includes('saddle bag') || lowerName.includes('top box') || lowerName.includes('luggage') || lowerName.includes('rack') || lowerName.includes('rucksack') || lowerName.includes('backpack')) category = 'Luggage';
  else if (lowerName.includes('intercom') || lowerName.includes('camera') || lowerName.includes('sat nav') || lowerName.includes('gps') || lowerName.includes('charger') || lowerName.includes('phone mount') || lowerName.includes('dash cam') || lowerName.includes('bluetooth')) category = 'Electronics';
  else if (lowerName.includes('chain') || lowerName.includes('sprocket') || lowerName.includes('brake pad') || lowerName.includes('filter') || lowerName.includes('spark plug') || lowerName.includes('battery') || lowerName.includes('tyre')) category = 'Parts';
  else if (lowerName.includes('lock') || lowerName.includes('cover') || lowerName.includes('stand') || lowerName.includes('paddock') || lowerName.includes('ramp') || lowerName.includes('cleaning') || lowerName.includes('tool') || lowerName.includes('tent') || lowerName.includes('camping')) category = 'Accessories';
  else if (lowerName.includes('neck') || lowerName.includes('balaclava') || lowerName.includes('goggle') || lowerName.includes('ear plug') || lowerName.includes('back protector') || lowerName.includes('knee') || lowerName.includes('armour')) category = 'Protection';

  // Image URL is predictable
  const imageUrl = `https://cdn-iutgbvdd.sportsbikeshop.co.uk/image/upload/c_fill,h_600,w_600/product/${id}.jpg`;
  const thumbUrl = `https://cdn-iutgbvdd.sportsbikeshop.co.uk/image/upload/c_fill,h_200,w_200/product/${id}.jpg`;

  // Extract specs if available
  const specs = {};
  const specRows = html.matchAll(/<tr[^>]*>\s*<td[^>]*>([^<]+)<\/td>\s*<td[^>]*>([^<]+)<\/td>/gi);
  for (const row of specRows) {
    const key = row[1].trim();
    const val = row[2].trim();
    if (key && val && key.length < 30) specs[key] = val;
  }

  // Extract colour from product name (usually after the last dash)
  let colour = '';
  const colourMatch = name.match(/ - (.+)$/);
  if (colourMatch) colour = colourMatch[1].trim();

  // Map to colour family for colour matcher
  let colourFamily = 'other';
  const lc = colour.toLowerCase();
  if (lc.includes('black') && !lc.includes('white') && !lc.includes('red')) colourFamily = 'black';
  else if (lc.includes('white') && !lc.includes('black')) colourFamily = 'white';
  else if (lc.includes('red') || lc.includes('burgundy') || lc.includes('cherry')) colourFamily = 'red';
  else if (lc.includes('blue') || lc.includes('navy') || lc.includes('cobalt')) colourFamily = 'blue';
  else if (lc.includes('yellow') || lc.includes('fluo') || lc.includes('hi-vis') || lc.includes('hi vis')) colourFamily = 'hi-vis';
  else if (lc.includes('grey') || lc.includes('gray') || lc.includes('silver') || lc.includes('titanium')) colourFamily = 'grey';
  else if (lc.includes('green') || lc.includes('olive') || lc.includes('khaki') || lc.includes('camo')) colourFamily = 'green';
  else if (lc.includes('orange') || lc.includes('bronze') || lc.includes('copper')) colourFamily = 'orange';
  else if (lc.includes('brown') || lc.includes('tan')) colourFamily = 'brown';
  else if (lc.includes('pink') || lc.includes('purple') || lc.includes('violet')) colourFamily = 'pink';
  else if (lc.includes('black')) colourFamily = 'black'; // catch multi-colour with black

  return {
    id,
    url: url.trim(),
    affiliateUrl: url.trim() + '#/28914,3714,0',
    name,
    brand,
    price,
    rrp,
    description,
    category,
    colour,
    colourFamily,
    imageUrl,
    thumbUrl,
    specs,
    scrapedAt: new Date().toISOString(),
  };
}

async function scrapeUrl(url) {
  const referers = [
    'https://www.google.co.uk/',
    'https://www.google.com/',
    'https://www.sportsbikeshop.co.uk/',
    'https://www.sportsbikeshop.co.uk/motorcycle_parts/content_cat/1',
    'https://www.sportsbikeshop.co.uk/motorcycle_parts/content_cat/17',
    'https://www.sportsbikeshop.co.uk/motorcycle_parts/content_cat/63',
  ];
  const headers = {
    'User-Agent': getRandomUA(),
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-GB,en;q=0.9,en-US;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Referer': referers[Math.floor(Math.random() * referers.length)],
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': Math.random() > 0.5 ? 'same-origin' : 'cross-site',
    'DNT': '1',
    'Upgrade-Insecure-Requests': '1',
    'Cache-Control': 'max-age=0',
  };
  const response = await fetch(url.trim(), { headers, redirect: 'follow' });

  if (response.status === 403 || response.status === 429) {
    throw new Error(`BLOCKED (${response.status}) - Need to wait longer or use proxy`);
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const html = await response.text();

  // Check for Cloudflare challenge
  if (html.includes('challenge-platform') && html.length < 5000) {
    throw new Error('CLOUDFLARE_CHALLENGE - Need to wait or rotate IP');
  }

  return parseProduct(html, url);
}

async function main() {
  // Parse args
  const args = process.argv.slice(2);
  let batchSize = 10;
  let startOffset = 0;
  let continuous = false;
  let cooldownMins = 2; // Minutes to wait after a block before retrying

  let initialWait = 0;

  for (const arg of args) {
    if (arg.startsWith('--batch=')) batchSize = parseInt(arg.split('=')[1]);
    if (arg.startsWith('--offset=')) startOffset = parseInt(arg.split('=')[1]);
    if (arg === '--continuous') continuous = true;
    if (arg.startsWith('--cooldown=')) cooldownMins = parseInt(arg.split('=')[1]);
    if (arg.startsWith('--wait=')) initialWait = parseInt(arg.split('=')[1]);
  }

  // Load URLs
  const urls = fs.readFileSync(URLS_FILE, 'utf8').trim().split('\n').filter(u => u.trim());
  console.log(`Total URLs: ${urls.length}`);

  // Load existing progress
  if (!fs.existsSync('data')) fs.mkdirSync('data', { recursive: true });

  let products = [];
  let scraped = new Set();

  if (fs.existsSync(OUTPUT_FILE)) {
    products = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
    scraped = new Set(products.map(p => p.id));
    console.log(`Already scraped: ${products.length} products`);
  }

  // Load failed URLs to skip
  let failedIds = new Set();
  if (fs.existsSync(FAILED_FILE)) {
    failedIds = new Set(JSON.parse(fs.readFileSync(FAILED_FILE, 'utf8')));
    console.log(`Skipping ${failedIds.size} previously failed URLs`);
  }

  if (fs.existsSync(PROGRESS_FILE)) {
    const progress = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
    if (!startOffset) startOffset = progress.lastIndex || 0;
    console.log(`Resuming from index: ${startOffset}`);
  }

  // Filter URLs not yet scraped
  const remaining = urls
    .slice(startOffset)
    .filter(url => !scraped.has(extractProductId(url)));

  console.log(`Remaining to scrape: ${remaining.length}`);
  console.log(`Batch size: ${batchSize}`);
  console.log(`Starting in 3 seconds...\n`);
  await sleep(3000);

  let totalSuccess = 0;
  let totalFail = 0;
  let blocked = false;

  async function runBatch() {
    // Re-filter remaining each time (skip scraped + known failures)
    const remaining = urls.filter(url => {
      const id = extractProductId(url);
      return !scraped.has(id) && !failedIds.has(id);
    });
    if (remaining.length === 0) {
      console.log('\n*** ALL PRODUCTS SCRAPED! ***');
      return false;
    }

    console.log(`\n--- Starting batch (${remaining.length} remaining, ${products.length} scraped) ---`);
    let batchSuccess = 0;
    let batchFail = 0;

    const thisBatch = remaining.slice(0, batchSize);

    for (let i = 0; i < thisBatch.length; i++) {
      const url = thisBatch[i];
      const id = extractProductId(url);

      try {
        process.stdout.write(`[${products.length + 1}] ${id}... `);
        const product = await scrapeUrl(url);

        if (product && product.name) {
          products.push(product);
          scraped.add(product.id);
          batchSuccess++;
          totalSuccess++;
          const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
          const rate = (totalSuccess / (Date.now() - startTime) * 3600000).toFixed(0);
          console.log(`✓ ${product.name.substring(0, 45)} (${product.category}) [${rate}/hr]`);
        } else {
          batchFail++;
          totalFail++;
          console.log(`✗ No data extracted`);
        }
      } catch (err) {
        batchFail++;
        totalFail++;
        console.log(`✗ ${err.message}`);

        if (err.message.includes('BLOCKED') || err.message.includes('CLOUDFLARE')) {
          blocked = true;
          break;
        }
        // Track 404s and other permanent failures so we don't retry them
        if (err.message.includes('404') || err.message.includes('410')) {
          failedIds.add(id);
          fs.writeFileSync(FAILED_FILE, JSON.stringify([...failedIds]));
        }
      }

      // Save progress after each product
      fs.writeFileSync(OUTPUT_FILE, JSON.stringify(products, null, 2));
      fs.writeFileSync(PROGRESS_FILE, JSON.stringify({
        lastIndex: urls.indexOf(url) + 1,
        totalScraped: products.length,
        lastRun: new Date().toISOString(),
        totalSuccess,
        totalFail,
      }));

      // Random delay between requests
      if (i < thisBatch.length - 1) {
        const delay = randomDelay();
        await sleep(delay);
      }
    }

    console.log(`Batch: +${batchSuccess} scraped, ${batchFail} failed | Total: ${products.length}`);
    return !blocked;
  }

  const startTime = Date.now();

  if (initialWait > 0) {
    console.log(`\n⏳ Waiting ${initialWait} minutes before starting (letting rate limit expire)...`);
    await sleep(initialWait * 60 * 1000);
    console.log(`   Wait complete, starting scraper.`);
  }

  if (continuous) {
    console.log(`\n=== CONTINUOUS MODE === (cooldown: ${cooldownMins}min after blocks)`);
    console.log(`Target: ${urls.length} products\n`);

    while (true) {
      const ok = await runBatch();
      if (!ok && !blocked) break; // All done

      if (blocked) {
        console.log(`\n⏸  Blocked! Cooling down for ${cooldownMins} minutes...`);
        console.log(`   (${products.length} products saved so far)`);
        await sleep(cooldownMins * 60 * 1000);
        blocked = false;
        // Increase cooldown each time, cap at 30 min
        cooldownMins = Math.min(cooldownMins + 3, 30);
        console.log(`   Resuming... (next cooldown: ${cooldownMins}min)`);
      } else {
        // Small pause between batches
        await sleep(2000);
      }
    }
  } else {
    await runBatch();
  }

  const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
  console.log(`\n--- Final Results (${elapsed} min) ---`);
  console.log(`Success: ${totalSuccess} | Failed: ${totalFail}`);
  console.log(`Total products saved: ${products.length}`);
  console.log(`Output: ${OUTPUT_FILE}`);

  // Print category breakdown
  const cats = {};
  for (const p of products) {
    cats[p.category] = (cats[p.category] || 0) + 1;
  }
  console.log(`\nCategories:`);
  for (const [cat, count] of Object.entries(cats).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${cat}: ${count}`);
  }
}

main().catch(console.error);
