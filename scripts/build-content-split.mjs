#!/usr/bin/env node
/**
 * build-content-split.mjs — VisorUp
 *
 * The SPA historically loaded ~2.2 MB of article JS on EVERY page (articles.js
 * alone is 1.6 MB) because the full article bodies live in the global ARTICLES
 * array. This script splits that data:
 *
 *   • content-index.js       — a light metadata-only ARTICLES array (no bodies),
 *                              loaded eagerly. Enough for listings, search,
 *                              related cards, routing, titles and meta tags.
 *   • content/<slug>.json    — the heavy per-article body fields, fetched on
 *                              demand only when a guide/infographic is opened.
 *
 * It reconstructs the FINAL merged ARTICLES exactly as the browser would: it
 * runs every ARTICLES-contributing <script> from index.html in order (base
 * files that push articles, then enrich-*.js files that add keyTakeaways /
 * comparisonTable / prosCons / faq via ARTICLES.forEach). Consolidated
 * duplicate slugs (guide-redirects.js) are excluded.
 *
 * Idempotent — safe to run repeatedly. Usage: node scripts/build-content-split.mjs [ROOT]
 */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = process.argv[2] || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_INDEX = path.join(ROOT, 'content-index.js');
const OUT_DIR = path.join(ROOT, 'content');

// Fields moved OUT of the eager index and into per-article body files.
const HEAVY = ['content', 'keyTakeaways', 'comparisonTable', 'prosCons', 'faq', 'affiliateLinks'];

// Files that contribute to the global ARTICLES array, in load order (base files
// that push articles first, then enrich-*.js that add fields via ARTICLES.forEach).
// These are no longer <script>-loaded by index.html (content-index.js replaces
// them at runtime) but remain the source of truth for this build.
// NOTE: if a new content/enrich file is added, list it here.
const ARTICLE_FILES = [
  'articles.js', 'buying-guides.js', 'touring-guides-1.js', 'touring-guides-2.js',
  'gear-clusters-1.js', 'gear-clusters-2.js', 'routes-clusters-1.js', 'routes-clusters-2.js',
  'niche-guides-1.js', 'niche-guides-2.js', 'ios-apps-guides.js', 'insurance-guides.js',
  'enrich-buying-1.js', 'enrich-buying-2.js', 'enrich-gear-1.js', 'enrich-gear-2.js',
  'enrich-bikes-1.js', 'enrich-bikes-2.js', 'enrich-routes-1.js', 'enrich-routes-2.js',
  'enrich-destinations-1.js', 'enrich-destinations-2.js', 'enrich-scenic-1.js', 'enrich-scenic-2.js',
  'enrich-planning-1.js', 'enrich-planning-2.js', 'enrich-seasonal-1.js', 'enrich-seasonal-2.js',
  'enrich-infographics-1.js',
];
const ARTICLE_FILE_RE = /^(articles|buying-guides|touring-guides-\d+|gear-clusters-\d+|routes-clusters-\d+|niche-guides-\d+|ios-apps-guides|insurance-guides|enrich-.+)\.js$/;

function orderedArticleFiles() {
  const files = ARTICLE_FILES.filter(f => fs.existsSync(path.join(ROOT, f)));
  // Safety net: warn about any matching source file not in the hardcoded list.
  for (const f of fs.readdirSync(ROOT)) {
    if (ARTICLE_FILE_RE.test(f) && !ARTICLE_FILES.includes(f)) {
      console.warn(`  WARNING: ${f} matches an ARTICLES source pattern but is not in ARTICLE_FILES — it will be ignored.`);
    }
  }
  return files;
}

function loadRedirected() {
  try {
    const p = path.join(ROOT, 'guide-redirects.js');
    if (!fs.existsSync(p)) return new Set();
    const mm = fs.readFileSync(p, 'utf8').match(/\{[\s\S]*\}/);
    return mm ? new Set(Object.keys(JSON.parse(mm[0]))) : new Set();
  } catch { return new Set(); }
}

function reconstructArticles(files) {
  const sandbox = { ARTICLES: undefined, window: {}, document: {}, console: { log() {}, warn() {}, error() {} } };
  vm.createContext(sandbox);
  vm.runInContext('var ARTICLES;', sandbox);
  for (const rel of files) {
    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) { console.warn(`  (skip missing ${rel})`); continue; }
    // Only articles.js declares `const ARTICLES = [...]`; strip the declaration
    // so it assigns the pre-declared context global instead of block-scoping it.
    const src = fs.readFileSync(abs, 'utf8').replace(/\b(?:const|let)\s+ARTICLES\s*=/, 'ARTICLES =');
    try { vm.runInContext(src, sandbox, { filename: rel }); }
    catch (e) { throw new Error(`Failed executing ${rel}: ${e.message}`); }
  }
  return sandbox.ARTICLES || [];
}

function main() {
  const files = orderedArticleFiles();
  console.log(`ARTICLES source files (in order): ${files.length}`);
  const ARTICLES = reconstructArticles(files);
  if (!Array.isArray(ARTICLES) || !ARTICLES.length) throw new Error('Reconstructed ARTICLES is empty — aborting.');
  const redirected = loadRedirected();

  // Reset the body dir (only *.json) so removed/renamed articles don't linger.
  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const f of fs.readdirSync(OUT_DIR)) if (f.endsWith('.json')) fs.unlinkSync(path.join(OUT_DIR, f));

  const index = [];
  let bodies = 0, skipped = 0, heavyBytes = 0;
  const seen = new Set();
  for (const a of ARTICLES) {
    if (!a || !a.slug) continue;
    if (redirected.has(a.slug)) { skipped++; continue; }
    if (seen.has(a.slug)) continue; // guard against accidental dupes
    seen.add(a.slug);

    const light = {}; const body = {};
    for (const [k, v] of Object.entries(a)) {
      if (HEAVY.includes(k)) { if (v !== undefined && v !== null) body[k] = v; }
      else light[k] = v;
    }
    index.push(light);
    // Always write a body file (even if empty) so every indexed slug is
    // fetchable — a real 404 then only ever means a genuinely unknown slug.
    const json = JSON.stringify(body);
    heavyBytes += Buffer.byteLength(json);
    fs.writeFileSync(path.join(OUT_DIR, `${a.slug}.json`), json, 'utf8');
    bodies++;
  }

  const banner = '/* AUTO-GENERATED by scripts/build-content-split.mjs — do not edit by hand.\n' +
    '   Light metadata index; article bodies load on demand from /content/<slug>.json */\n';
  fs.writeFileSync(OUT_INDEX, banner + 'var ARTICLES = ' + JSON.stringify(index) + ';\n', 'utf8');

  const idxKb = (Buffer.byteLength(fs.readFileSync(OUT_INDEX)) / 1024).toFixed(1);
  console.log(`content-index.js: ${index.length} articles, ${idxKb} KB (eager)`);
  console.log(`content/*.json:   ${bodies} body files, ${(heavyBytes / 1048576).toFixed(2)} MB total (lazy)`);
  console.log(`excluded (redirected): ${skipped}`);
}

main();
