#!/usr/bin/env node
/**
 * build-seo-manifest.mjs — VisorUp
 *
 * Generates seo-manifest.json: a compact map of  pathname -> per-URL SEO
 * metadata  used by functions/[[path]].js to inject correct <title>, meta
 * description, Open Graph / Twitter tags, canonical, and Article JSON-LD into
 * the HTML shell at the edge. This is what lets social scrapers and non-JS
 * crawlers see the right preview/metadata for every page (the SPA otherwise
 * only sets these client-side).
 *
 * Run from the repo root:  node scripts/build-seo-manifest.mjs
 * Sources of truth: the same content/data files the browser loads.
 */
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = process.argv[2] || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://visorup.co.uk';

/* ── helpers ─────────────────────────────────────────────────────────── */
function read(f) { return fs.readFileSync(path.join(ROOT, f), 'utf8'); }
function exists(f) { return fs.existsSync(path.join(ROOT, f)); }

// Extract a top-level `const NAME = [ ... ]` array literal and eval it.
function extractArray(src, name) {
  const start = src.search(new RegExp(`(const|let|var)\\s+${name}\\s*=\\s*\\[`));
  if (start < 0) return [];
  const b = src.indexOf('[', start);
  let depth = 0, i = b, q = null, esc = false;
  for (; i < src.length; i++) {
    const c = src[i];
    if (q) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === q) q = null; continue; }
    if (c === '"' || c === "'" || c === '`') { q = c; continue; }
    if (c === '[') depth++; else if (c === ']') { depth--; if (depth === 0) { i++; break; } }
  }
  try { return vm.runInNewContext('(' + src.slice(b, i) + ')', {}); }
  catch (e) { console.warn(`extractArray(${name}) failed: ${e.message.split('\n')[0]}`); return []; }
}

// Load global arrays (ARTICLES / BIKES) by running data files with const->var.
function loadGlobals(files, names) {
  const sandbox = { window: {}, document: { addEventListener() {}, getElementById() { return null; } }, navigator: {}, console, setTimeout() {}, localStorage: { getItem() {}, setItem() {} } };
  vm.createContext(sandbox);
  vm.runInContext(names.map(n => `var ${n};`).join(''), sandbox);
  for (const f of files) {
    if (!exists(f)) continue;
    let code = read(f).replace(/^(\s*)(const|let)\s+/gm, '$1var ');
    try { vm.runInContext(code, sandbox, { filename: f }); }
    catch (e) { console.warn(`load ${f}: ${e.message.split('\n')[0]}`); }
  }
  const out = {}; for (const n of names) out[n] = sandbox[n] || []; return out;
}

const strip = html => (html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
function descOf(a) {
  if (a.metaDescription) return a.metaDescription.trim();
  const t = strip(a.content);
  return t ? t.slice(0, 155).trim() : '';
}

/* ── sources ─────────────────────────────────────────────────────────── */
const CONTENT = ['articles.js', 'buying-guides.js', 'touring-guides-1.js', 'touring-guides-2.js', 'gear-clusters-1.js', 'gear-clusters-2.js', 'routes-clusters-1.js', 'routes-clusters-2.js', 'niche-guides-1.js', 'niche-guides-2.js', 'ios-apps-guides.js', 'insurance-guides.js'];
const { ARTICLES } = loadGlobals(CONTENT, ['ARTICLES']);
const { BIKES } = loadGlobals(['bikes.js', 'bikes-extra-1.js', 'bikes-extra-2.js'], ['BIKES']);
const siteSrc = read('site.js');
const ROUTES = extractArray(siteSrc, 'ROUTES');
const DESTINATIONS = extractArray(siteSrc, 'DESTINATIONS');
const FERRIES = extractArray(siteSrc, 'FERRIES');

/* ── build manifest ──────────────────────────────────────────────────── */
const manifest = {};
const put = (p, t, d, i, ty, extra = {}) => { manifest[p] = { t, d, i: i || '', ty, ...extra }; };

// Static landing pages (titles/descriptions mirror site.js route handlers)
put('/', 'VisorUp — Motorcycle Adventures Across Britain', 'Plan epic motorcycle tours across Britain and the Channel Islands. Scenic roads, stunning viewpoints, GPX downloads, ferry guides. From island roads to highland horizons.', 'public/images/heroes/homepage.jpg', 'website');
put('/routes', 'Motorcycle Touring Routes — VisorUp', 'Curated motorcycle touring routes across Britain with interactive planners, GPX downloads, and day-by-day guides.', 'public/images/heroes/routes.jpg', 'website');
put('/destinations', 'Motorcycle Destinations — UK & Islands', 'Explore Britain by bike — detailed destination guides from the Highlands to the coast, with riding tips, POIs, and route suggestions.', 'public/images/heroes/homepage.jpg', 'website');
put('/bikes', 'Motorcycle Touring Setup — Bike Guides', 'Touring bike guides with specs, luggage options, and rider verdicts — find the right motorcycle for your UK adventure.', 'public/images/heroes/homepage.jpg', 'website');
put('/gear', 'Find Your Perfect Motorcycle Gear — VisorUp', 'Interactive gear finder — personalised motorcycle gear recommendations based on your riding style, experience, weather conditions, and budget.', 'public/images/heroes/homepage.jpg', 'website');
put('/guides', 'Motorcycle Touring Guides — VisorUp', 'In-depth motorcycle touring guides: routes, gear, bikes, planning, maintenance and destinations across Britain.', 'public/images/heroes/homepage.jpg', 'website');
put('/infographics', 'Motorcycle Infographics — VisorUp', 'Visual motorcycle touring guides and data — gear, routes, bikes and planning at a glance.', 'public/images/heroes/homepage.jpg', 'website');
put('/ferries', 'Motorcycle Ferry Guides — VisorUp', 'Ferry guides for motorcycle touring around Britain and the islands — booking tips, lashing, and boarding advice.', 'public/images/heroes/homepage.jpg', 'website');
put('/shop', 'Motorcycle Gear Shop — VisorUp', 'Shop hand-picked motorcycle touring gear — helmets, jackets, luggage and more.', 'public/images/heroes/homepage.jpg', 'website');

// Articles (guides + infographics)
let nGuides = 0, nInfo = 0;
for (const a of ARTICLES) {
  if (!a || !a.slug) continue;
  const isInfo = a.category === 'infographics' || (Array.isArray(a.tags) && a.tags.includes('infographic'));
  const p = isInfo ? `/infographics/${a.slug}` : `/guides/${a.category}/${a.slug}`;
  const extra = {};
  if (a.publishDate) extra.pd = a.publishDate;
  if (a.updatedDate || a.publishDate) extra.md = a.updatedDate || a.publishDate;
  put(p, `${a.title} — VisorUp`, descOf(a), a.heroImage, 'article', extra);
  if (isInfo) nInfo++; else nGuides++;
}

// Routes / Destinations / Ferries
for (const r of ROUTES) { if (r && r.slug) put(`/routes/${r.slug}`, `${r.name} — Motorcycle Route`, r.tagline || '', r.image, 'article'); }
for (const d of DESTINATIONS) { if (d && d.slug) put(`/destinations/${d.slug}`, `${d.name} — Motorcycle Destination Guide`, d.tagline || '', d.image, 'article'); }
for (const f of FERRIES) { if (f && f.slug) put(`/ferries/${f.slug}`, `${f.name} — Motorcycle Ferry Guide`, f.tagline || f.summary || '', f.image, 'article'); }

// Bikes
let nBikes = 0;
for (const b of BIKES) {
  if (!b || !b.slug) continue;
  const d = b.tagline || b.summary || (b.name ? `${b.name} touring setup guide — specs, luggage options, and rider verdict for UK motorcycle touring.` : '');
  put(`/bikes/${b.slug}`, `${b.name} — Touring Setup Guide`, d, b.image, 'article');
  nBikes++;
}

/* ── write ───────────────────────────────────────────────────────────── */
fs.writeFileSync(path.join(ROOT, 'seo-manifest.json'), JSON.stringify(manifest), 'utf8');
const bytes = fs.statSync(path.join(ROOT, 'seo-manifest.json')).size;
console.log(`seo-manifest.json written: ${Object.keys(manifest).length} URLs, ${(bytes / 1024).toFixed(0)} KB`);
console.log(`  guides=${nGuides} infographics=${nInfo} routes=${ROUTES.length} destinations=${DESTINATIONS.length} ferries=${FERRIES.length} bikes=${nBikes}`);
