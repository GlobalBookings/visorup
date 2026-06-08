/**
 * Build product catalogue from:
 * 1. product_urls.txt (38,584 IDs) - gives us URLs, image URLs, affiliate links
 * 2. data/products.json (scraped data) - gives us names, categories, prices for scraped items
 * 3. The per-product scraper enriches individual products over time
 * 
 * This generates a complete catalogue where scraped products have full data,
 * and unscraped products have IDs + image URLs + affiliate links ready to go.
 * 
 * Usage: node scripts/build-catalogue.mjs
 */

import fs from 'fs';
import path from 'path';

const URLS_FILE = path.resolve('product_urls.txt');
const SCRAPED_FILE = path.resolve('data/products.json');
const OUTPUT_FILE = path.resolve('data/full-catalogue.json');
const STATS_FILE = path.resolve('data/catalogue-stats.json');

function extractProductId(url) {
  const match = url.match(/content_prod\/(\d+)/);
  return match ? match[1] : null;
}

function main() {
  // Load all URLs
  const urls = fs.readFileSync(URLS_FILE, 'utf8').trim().split('\n').filter(u => u.trim());
  console.log(`Total product URLs: ${urls.length}`);

  // Load scraped data
  let scraped = {};
  if (fs.existsSync(SCRAPED_FILE)) {
    const data = JSON.parse(fs.readFileSync(SCRAPED_FILE, 'utf8'));
    for (const p of data) {
      scraped[p.id] = p;
    }
    console.log(`Scraped products with full data: ${Object.keys(scraped).length}`);
  }

  // Build catalogue
  const catalogue = [];
  let enriched = 0;
  let basic = 0;

  for (const url of urls) {
    const id = extractProductId(url);
    if (!id) continue;

    if (scraped[id]) {
      // Full data from scraper
      catalogue.push(scraped[id]);
      enriched++;
    } else {
      // Basic data from URL pattern
      catalogue.push({
        id,
        url: url.trim(),
        affiliateUrl: url.trim() + '#/28914,3714,0',
        name: '', // Not yet scraped
        brand: '',
        price: '',
        category: '',
        imageUrl: `https://cdn-iutgbvdd.sportsbikeshop.co.uk/image/upload/c_fill,h_600,w_600/product/${id}.jpg`,
        thumbUrl: `https://cdn-iutgbvdd.sportsbikeshop.co.uk/image/upload/c_fill,h_200,w_200/product/${id}.jpg`,
        enriched: false,
      });
      basic++;
    }
  }

  // Save catalogue
  if (!fs.existsSync('data')) fs.mkdirSync('data', { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(catalogue));
  console.log(`\nCatalogue saved: ${OUTPUT_FILE}`);
  console.log(`  Size: ${(fs.statSync(OUTPUT_FILE).size / 1024 / 1024).toFixed(1)} MB`);
  console.log(`  Enriched (full data): ${enriched}`);
  console.log(`  Basic (ID + images only): ${basic}`);
  console.log(`  Total: ${catalogue.length}`);

  // Category breakdown of enriched products
  const cats = {};
  for (const p of catalogue.filter(p => p.category)) {
    cats[p.category] = (cats[p.category] || 0) + 1;
  }
  if (Object.keys(cats).length > 0) {
    console.log(`\nCategories (enriched only):`);
    for (const [cat, count] of Object.entries(cats).sort((a, b) => b[1] - a[1])) {
      console.log(`  ${cat}: ${count}`);
    }
  }

  // Save stats
  const stats = {
    totalProducts: catalogue.length,
    enriched,
    basic,
    categories: cats,
    lastBuilt: new Date().toISOString(),
    coveragePercent: ((enriched / catalogue.length) * 100).toFixed(1) + '%',
  };
  fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2));
  console.log(`\nCoverage: ${stats.coveragePercent} enriched`);
  console.log(`\nTo enrich more products, run:`);
  console.log(`  node scripts/scrape-products.mjs --batch=10`);
}

main();
