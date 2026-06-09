/**
 * SportsBikeShop Category Page Scraper
 * 
 * Instead of hitting 38,584 product pages individually (gets blocked),
 * this scrapes category listing pages which contain 20-100 products each.
 * ~100-200 requests to get ALL product names + categories vs 38,584 individual scrapes.
 * 
 * Usage:
 *   node scripts/scrape-categories.mjs --batch=10
 */

import fs from 'fs';
import path from 'path';

const OUTPUT_FILE = path.resolve('data/products-catalogue.json');
const PROGRESS_FILE = path.resolve('data/category-progress.json');

const USER_AGENTS = [
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15',
];

// Top-level category structure to scrape
const CATEGORIES = [
  { url: 'https://www.sportsbikeshop.co.uk/motorcycle_parts/content_cat/1', name: 'Helmets' },
  { url: 'https://www.sportsbikeshop.co.uk/motorcycle_parts/content_cat/17', name: 'Clothing' },
  { url: 'https://www.sportsbikeshop.co.uk/motorcycle_parts/content_cat/63', name: 'Gloves' },
  { url: 'https://www.sportsbikeshop.co.uk/motorcycle_parts/content_cat/62', name: 'Boots' },
  { url: 'https://www.sportsbikeshop.co.uk/motorcycle_parts/content_cat/19', name: 'Accessories' },
  { url: 'https://www.sportsbikeshop.co.uk/motorcycle_parts/content_cat/169', name: 'Parts' },
  { url: 'https://www.sportsbikeshop.co.uk/motorcycle_parts/content_cat/1153', name: 'Motocross' },
];

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function randomDelay() { return 10000 + Math.random() * 10000; } // 10-20s
function getRandomUA() { return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]; }

function extractProductsFromCategoryPage(html, categoryName) {
  const products = [];

  // Match product links with pattern: content_prod/ID" title="PRODUCT NAME"
  const linkPattern = /content_prod\/(\d+)"[^>]*title="([^"]+)"/gi;
  let match;
  const seen = new Set();

  while ((match = linkPattern.exec(html)) !== null) {
    const id = match[1];
    const name = match[2].trim();
    if (!seen.has(id) && name && !name.includes('content_') && name.length > 5) {
      seen.add(id);

      // Extract price near this product (look for £ within next 500 chars)
      const afterMatch = html.substring(match.index, match.index + 800);
      const priceMatch = afterMatch.match(/£([\d,.]+)/);
      const price = priceMatch ? '£' + priceMatch[1] : '';

      // Extract brand from product name (first word usually)
      const nameParts = name.split(' ');
      let brand = nameParts[0];
      // Common multi-word brands
      if (name.startsWith('Rev It') || name.startsWith("Rev'It")) brand = "Rev'It";
      else if (name.startsWith('Kriega')) brand = 'Kriega';
      else if (name.startsWith('SW-Motech')) brand = 'SW-Motech';
      else if (name.startsWith('Quad Lock')) brand = 'Quad Lock';

      products.push({
        id,
        url: `https://www.sportsbikeshop.co.uk/motorcycle_parts/content_prod/${id}`,
        affiliateUrl: `https://www.sportsbikeshop.co.uk/motorcycle_parts/content_prod/${id}#/28914,3714,0`,
        name,
        brand,
        price,
        category: categoryName,
        imageUrl: `https://cdn-iutgbvdd.sportsbikeshop.co.uk/image/upload/c_fill,h_600,w_600/product/${id}.jpg`,
        thumbUrl: `https://cdn-iutgbvdd.sportsbikeshop.co.uk/image/upload/c_fill,h_200,w_200/product/${id}.jpg`,
      });
    }
  }

  return products;
}

function extractSubcategoryLinks(html, baseCategory) {
  const links = [];
  // Find subcategory links: content_cat/ID
  const pattern = /href="(\/motorcycle_parts\/content_cat\/\d+)"[^>]*>([^<]+)</gi;
  let match;
  const seen = new Set();

  while ((match = pattern.exec(html)) !== null) {
    const path = match[1];
    const label = match[2].trim();
    if (!seen.has(path) && label.length > 2 && label.length < 50) {
      seen.add(path);
      links.push({
        url: `https://www.sportsbikeshop.co.uk${path}`,
        name: `${baseCategory} > ${label}`,
      });
    }
  }
  return links;
}

async function fetchPage(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': getRandomUA(),
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'en-GB,en;q=0.9',
    },
  });

  if (res.status === 403 || res.status === 429) {
    throw new Error(`BLOCKED (${res.status})`);
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const html = await res.text();
  if (html.includes('challenge-platform') && html.length < 5000) {
    throw new Error('CLOUDFLARE_CHALLENGE');
  }
  return html;
}

async function main() {
  const args = process.argv.slice(2);
  let batchSize = 10;
  for (const arg of args) {
    if (arg.startsWith('--batch=')) batchSize = parseInt(arg.split('=')[1]);
  }

  if (!fs.existsSync('data')) fs.mkdirSync('data', { recursive: true });

  // Load existing products
  let allProducts = [];
  let seenIds = new Set();
  if (fs.existsSync(OUTPUT_FILE)) {
    allProducts = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
    seenIds = new Set(allProducts.map(p => p.id));
    console.log(`Existing products: ${allProducts.length}`);
  }

  // Load progress
  let queue = [];
  let pagesScraped = 0;
  if (fs.existsSync(PROGRESS_FILE)) {
    const progress = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
    queue = progress.queue || [];
    pagesScraped = progress.pagesScraped || 0;
    console.log(`Resuming: ${queue.length} pages in queue, ${pagesScraped} already scraped`);
  }

  // Initialize queue with top-level categories if empty
  if (queue.length === 0) {
    queue = [...CATEGORIES];
    console.log('Starting fresh with top-level categories');
  }

  console.log(`Queue: ${queue.length} pages | Batch: ${batchSize}`);
  console.log(`Starting in 3 seconds...\n`);
  await sleep(3000);

  let newProducts = 0;
  let pagesThisBatch = 0;

  while (queue.length > 0 && pagesThisBatch < batchSize) {
    const page = queue.shift();
    pagesThisBatch++;

    try {
      process.stdout.write(`[${pagesThisBatch}/${batchSize}] ${page.name}... `);
      const html = await fetchPage(page.url);

      // Extract products from this page
      const products = extractProductsFromCategoryPage(html, page.name);
      let added = 0;
      for (const p of products) {
        if (!seenIds.has(p.id)) {
          allProducts.push(p);
          seenIds.add(p.id);
          added++;
        }
      }
      newProducts += added;
      console.log(`${products.length} found, ${added} new`);

      // Find subcategory links to add to queue
      const subcats = extractSubcategoryLinks(html, page.name.split(' > ')[0]);
      let newSubcats = 0;
      for (const sub of subcats) {
        // Avoid duplicates in queue
        if (!queue.some(q => q.url === sub.url)) {
          queue.push(sub);
          newSubcats++;
        }
      }
      if (newSubcats > 0) {
        console.log(`   + ${newSubcats} subcategories added to queue`);
      }

      pagesScraped++;
    } catch (err) {
      console.log(`✗ ${err.message}`);
      // Put it back in queue for retry
      queue.unshift(page);

      if (err.message.includes('BLOCKED') || err.message.includes('CLOUDFLARE')) {
        console.log('\n⚠️  Blocked! Saving progress. Wait 10-15 min then resume.\n');
        break;
      }
    }

    // Save progress after each page
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allProducts, null, 2));
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify({
      queue,
      pagesScraped,
      totalProducts: allProducts.length,
      lastRun: new Date().toISOString(),
    }));

    // Delay
    if (queue.length > 0 && pagesThisBatch < batchSize) {
      const delay = randomDelay();
      process.stdout.write(`   Waiting ${(delay / 1000).toFixed(0)}s...\r`);
      await sleep(delay);
    }
  }

  console.log(`\n--- Results ---`);
  console.log(`Pages scraped this batch: ${pagesThisBatch}`);
  console.log(`New products found: ${newProducts}`);
  console.log(`Total products: ${allProducts.length}`);
  console.log(`Remaining in queue: ${queue.length}`);

  // Category breakdown
  const cats = {};
  for (const p of allProducts) {
    const topCat = p.category.split(' > ')[0];
    cats[topCat] = (cats[topCat] || 0) + 1;
  }
  console.log(`\nCategories:`);
  for (const [cat, count] of Object.entries(cats).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${cat}: ${count}`);
  }
}

main().catch(console.error);
