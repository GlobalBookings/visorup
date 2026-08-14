#!/usr/bin/env node
/**
 * sync-sitemap.mjs — VisorUp
 *
 * Ensures every article in articles.js has a matching <url> entry in sitemap.xml.
 *
 * Articles are only reachable at /guides/{category}/{slug} (or /infographics/{slug}
 * for infographics). Agents that publish content historically forgot to add the new
 * URL to the sitemap, leaving live pages undiscoverable by search engines. This
 * script backfills any missing entries and is safe to run repeatedly (idempotent).
 *
 * Usage:
 *   node scripts/sync-sitemap.mjs [--dry-run] [--articles <path>] [--sitemap <path>]
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SITE_URL = process.env.SITE_URL || 'https://visorup.co.uk';

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const DRY_RUN = process.argv.includes('--dry-run');
const ARTICLES_PATH = arg('--articles', path.join(ROOT, 'articles.js'));
const SITEMAP_PATH = arg('--sitemap', path.join(ROOT, 'sitemap.xml'));

function parseArticles(indexPath) {
  const src = fs.readFileSync(indexPath, 'utf-8');
  const match = src.match(/const\s+ARTICLES\s*=\s*\[([\s\S]*)\];?\s*$/m);
  if (!match) throw new Error(`Could not locate ARTICLES array in ${indexPath}`);
  return JSON.parse(`[${match[1]}]`);
}

function urlPathFor(article) {
  const isInfographic =
    article.category === 'infographics' ||
    (Array.isArray(article.tags) && article.tags.includes('infographic'));
  return isInfographic
    ? `/infographics/${article.slug}`
    : `/guides/${article.category}/${article.slug}`;
}

function loadRedirected() {
  try {
    const p = path.join(ROOT, 'guide-redirects.js');
    if (!fs.existsSync(p)) return new Set();
    const m = fs.readFileSync(p, 'utf-8').match(/\{[\s\S]*\}/);
    return m ? new Set(Object.keys(JSON.parse(m[0]))) : new Set();
  } catch { return new Set(); }
}

function main() {
  const articles = parseArticles(ARTICLES_PATH);
  const REDIRECTED = loadRedirected(); // consolidated dupes must stay out of the sitemap
  let xml = fs.readFileSync(SITEMAP_PATH, 'utf-8');

  const missing = [];
  for (const a of articles) {
    if (!a.slug || !a.category) continue;
    if (REDIRECTED.has(a.slug)) continue;
    const loc = `${SITE_URL}${urlPathFor(a)}`;
    if (!xml.includes(`<loc>${loc}</loc>`)) missing.push({ loc, category: a.category });
  }

  console.log(`Articles: ${articles.length} | Already in sitemap: ${articles.length - missing.length} | Missing: ${missing.length}`);
  for (const m of missing) console.log(`  + ${m.loc}`);

  if (!missing.length) {
    console.log('Sitemap already complete — nothing to do.');
    return;
  }
  if (DRY_RUN) {
    console.log('\n(dry run — no changes written)');
    return;
  }

  const closeIdx = xml.lastIndexOf('</urlset>');
  if (closeIdx === -1) throw new Error('Could not find </urlset> in sitemap.xml');

  const entries = missing
    .map(m => `  <url><loc>${m.loc}</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>\n`)
    .join('');

  xml = xml.slice(0, closeIdx) + entries + xml.slice(closeIdx);
  fs.writeFileSync(SITEMAP_PATH, xml, 'utf-8');
  console.log(`\nAdded ${missing.length} URL(s) to ${SITEMAP_PATH}`);
}

main();
