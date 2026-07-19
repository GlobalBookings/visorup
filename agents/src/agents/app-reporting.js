/**
 * App Reporting Agent — VisorUp
 *
 * Posts a daily Slack digest of how the iOS app is doing:
 *   • App Store Connect — downloads, updates, proceeds, recent ratings & reviews
 *   • Supabase — riders, rides logged, routes saved, and 7-day / 24-hour activity
 *
 * Everything degrades gracefully: if App Store Connect or Supabase isn't
 * configured, that section is skipped rather than failing the whole report.
 */

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { createLogger } from '../core/logger.js';
import {
  sendSlack, slackHeader, slackSection, slackDivider, slackFields,
} from '../core/slack.js';
import { ascConfigured, ascFetch } from '../core/asc-auth.js';
import { supabaseConfigured, getCommunityMetrics } from '../core/supabase.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const HISTORY_FILE = path.join(DATA_DIR, 'app-report-history.json');

const log = createLogger('app-reporting');

const VENDOR_NUMBER = process.env.ASC_VENDOR_NUMBER;
const APP_ID = process.env.ASC_APP_ID;

// ── helpers ───────────────────────────────────────────────

function fmtNum(n) {
  return n == null ? 'n/a' : Number(n).toLocaleString('en-GB');
}

function ymd(date) {
  return date.toISOString().slice(0, 10);
}

// ── trend history (week-over-week) ────────────────────────

function loadHistory() {
  try {
    if (fs.existsSync(HISTORY_FILE)) return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf-8'));
  } catch (err) {
    log.warn(`Could not read history: ${err.message}`);
  }
  return [];
}

function saveSnapshot(history, metrics) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  const today = ymd(new Date());
  const filtered = history.filter((h) => h.date !== today); // one entry per day
  filtered.push({ date: today, ts: new Date().toISOString(), metrics });
  while (filtered.length > 90) filtered.shift();
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(filtered, null, 2));
}

// Newest snapshot that is at least `days` old — the week-over-week baseline.
function baselineFor(history, days = 7) {
  const target = Date.now() - days * 86400000;
  const older = history
    .filter((h) => new Date(h.ts || h.date).getTime() <= target)
    .sort((a, b) => (a.ts < b.ts ? -1 : 1));
  return older.length ? older[older.length - 1] : null;
}

// Return [label, value(+arrow)] for slackFields.
function withDelta(label, cur, base, currency = false) {
  const val = cur == null ? 'n/a' : currency ? `£${Number(cur).toFixed(2)}` : fmtNum(cur);
  if (cur == null || base == null) return [label, val];
  const d = cur - base;
  if (d === 0) return [label, `${val}  ▬`];
  const sign = d > 0 ? '▲' : '▼';
  const mag = currency ? `£${Math.abs(d).toFixed(2)}` : fmtNum(Math.abs(d));
  return [label, `${val}  ${sign}${mag}`];
}

// ── App Store Connect: sales / downloads ──────────────────

async function fetchSalesForDate(reportDate) {
  const params = new URLSearchParams({
    'filter[frequency]': 'DAILY',
    'filter[reportDate]': reportDate,
    'filter[reportSubType]': 'SUMMARY',
    'filter[reportType]': 'SALES',
    'filter[vendorNumber]': VENDOR_NUMBER,
  });

  const { ok, status, buffer } = await ascFetch(`/v1/salesReports?${params.toString()}`, { responseType: 'buffer' });
  if (!ok) {
    // 404 simply means no report for that day yet — expected for the latest 1-2 days.
    if (status !== 404) log.warn(`sales report ${reportDate} → ${status}`);
    return null;
  }

  let tsv;
  try {
    tsv = zlib.gunzipSync(buffer).toString('utf-8');
  } catch (err) {
    log.warn(`gunzip ${reportDate} failed: ${err.message}`);
    return null;
  }

  const lines = tsv.split('\n').filter(Boolean);
  if (lines.length < 2) return null;

  const headers = lines[0].split('\t');
  const idx = (name) => headers.indexOf(name);
  const iUnits = idx('Units');
  const iProceeds = idx('Developer Proceeds');
  const iType = idx('Product Type Identifier');

  let downloads = 0, updates = 0, redownloads = 0, proceeds = 0;

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split('\t');
    const units = Number(cols[iUnits] || 0);
    const perUnit = Number(cols[iProceeds] || 0);
    const type = (cols[iType] || '').trim();

    proceeds += units * perUnit;
    if (type.startsWith('1')) downloads += units;        // first-time app downloads
    else if (type.startsWith('3')) redownloads += units; // redownloads
    else if (type.startsWith('7')) updates += units;      // updates
  }

  return { date: reportDate, downloads, updates, redownloads, proceeds };
}

function sumSales(rows) {
  return rows.reduce(
    (acc, r) => ({
      downloads: acc.downloads + r.downloads,
      updates: acc.updates + r.updates,
      redownloads: acc.redownloads + r.redownloads,
      proceeds: acc.proceeds + r.proceeds,
    }),
    { downloads: 0, updates: 0, redownloads: 0, proceeds: 0 },
  );
}

async function getAppStoreSales() {
  // Sales data lands ~1-2 days late. A 404 for a date means zero sales that day.
  // Scan the last 30 days so we can show today / 7-day / 30-day totals.
  const days = [];
  for (let i = 1; i <= 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(ymd(d));
  }

  const results = [];
  for (const date of days) {
    const r = await fetchSalesForDate(date);
    if (r) results.push(r);
  }
  if (!results.length) return null;

  results.sort((a, b) => (a.date < b.date ? 1 : -1)); // newest first
  const latest = results[0];

  const cutoff7 = ymd(new Date(Date.now() - 7 * 86400000));
  const sum7 = sumSales(results.filter((r) => r.date >= cutoff7));
  const sum30 = sumSales(results);

  return { latest, sum7, sum30, daysWithData: results.length };
}

// ── App Store Connect: ratings & reviews ──────────────────

async function getReviews() {
  if (!APP_ID) return null;

  const params = new URLSearchParams({
    sort: '-createdDate',
    limit: '50',
  });
  const { ok, status, data } = await ascFetch(`/v1/apps/${APP_ID}/customerReviews?${params.toString()}`);
  if (!ok || !data?.data) {
    if (status) log.warn(`reviews → ${status}`);
    return null;
  }

  const reviews = data.data;
  if (!reviews.length) return { count: 0, avg: null, latest: null };

  const ratings = reviews.map((r) => Number(r.attributes?.rating || 0)).filter(Boolean);
  const avg = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null;

  const newest = reviews[0].attributes || {};
  const latest = {
    rating: newest.rating,
    title: (newest.title || '').trim(),
    body: (newest.body || '').trim().slice(0, 180),
    reviewer: newest.reviewerNickname || 'A rider',
  };

  return { count: reviews.length, avg, latest };
}

// ── report builder ────────────────────────────────────────

function stars(avg) {
  if (avg == null) return 'n/a';
  const rounded = Math.round(avg);
  return `${'★'.repeat(rounded)}${'☆'.repeat(5 - rounded)} ${avg.toFixed(2)}`;
}

function buildReport(sales, reviews, community, baseline) {
  const b = baseline?.metrics || {};
  const blocks = [];
  blocks.push(slackHeader('📱 VisorUp — Daily App Report'));
  const trendNote = baseline
    ? `  ·  _arrows vs ${baseline.date}_`
    : '  ·  _building trend history_';
  blocks.push(slackSection(`*${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}*${trendNote}`));
  blocks.push(slackDivider());

  // App Store
  blocks.push(slackSection('*🍏 App Store*'));
  if (sales) {
    blocks.push(slackFields([
      [`Downloads (${sales.latest.date})`, fmtNum(sales.latest.downloads)],
      withDelta('Downloads (7d)', sales.sum7.downloads, b.dl7),
      withDelta('Downloads (30d)', sales.sum30.downloads, b.dl30),
      withDelta('Updates (30d)', sales.sum30.updates, b.up30),
      ['Redownloads (30d)', fmtNum(sales.sum30.redownloads)],
      withDelta('Proceeds (30d)', sales.sum30.proceeds, b.proceeds30, true),
    ]));
  } else {
    blocks.push(slackSection('_No App Store sales data yet (reports lag 1-2 days, or ASC not configured)._'));
  }

  if (reviews) {
    blocks.push(slackSection(`*⭐ Ratings* — recent avg ${stars(reviews.avg)} _(last ${reviews.count} reviews)_`));
    if (reviews.latest) {
      const l = reviews.latest;
      blocks.push(slackSection(`> *${l.title || 'Review'}* — ${'★'.repeat(l.rating || 0)}\n> ${l.body || ''}\n> _— ${l.reviewer}_`));
    }
  }
  blocks.push(slackDivider());

  // Supabase / community
  blocks.push(slackSection('*🏍️ Riders & Activity*'));
  if (community) {
    blocks.push(slackFields([
      withDelta('Total riders', community.totalRiders, b.riders),
      withDelta('New riders (7d)', community.newRiders7d, b.newRiders7d),
      withDelta('Routes saved (total)', community.totalRoutes, b.routes),
      withDelta('Routes saved (7d)', community.newRoutes7d, b.newRoutes7d),
      withDelta('Public routes', community.publicRoutes, b.publicRoutes),
      withDelta('Community posts (7d)', community.posts7d, b.posts7d),
      withDelta('Bikes in garages', community.bikes, b.bikes),
    ]));
  } else {
    blocks.push(slackSection('_Supabase not configured — set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY._'));
  }
  blocks.push(slackDivider());
  blocks.push(slackSection('_App Reporting Agent — VisorUp_'));

  return blocks;
}

// ── main ──────────────────────────────────────────────────

export async function run() {
  log.info('Starting app report...');

  const ascReady = ascConfigured() && VENDOR_NUMBER;
  if (!ascReady) log.warn('App Store Connect not fully configured — skipping ASC sections');
  if (!supabaseConfigured()) log.warn('Supabase not configured — skipping community section');

  const [sales, reviews, community] = await Promise.all([
    ascReady ? getAppStoreSales().catch((e) => { log.error(`sales: ${e.message}`); return null; }) : null,
    ascConfigured() && APP_ID ? getReviews().catch((e) => { log.error(`reviews: ${e.message}`); return null; }) : null,
    supabaseConfigured() ? getCommunityMetrics().catch((e) => { log.error(`supabase: ${e.message}`); return null; }) : null,
  ]);

  const history = loadHistory();
  const baseline = baselineFor(history, 7);

  const blocks = buildReport(sales, reviews, community, baseline);
  await sendSlack(blocks, 'VisorUp Daily App Report');

  const metrics = {
    dl7: sales?.sum7.downloads ?? null,
    dl30: sales?.sum30.downloads ?? null,
    up30: sales?.sum30.updates ?? null,
    proceeds30: sales?.sum30.proceeds ?? null,
    riders: community?.totalRiders ?? null,
    newRiders7d: community?.newRiders7d ?? null,
    routes: community?.totalRoutes ?? null,
    newRoutes7d: community?.newRoutes7d ?? null,
    publicRoutes: community?.publicRoutes ?? null,
    posts7d: community?.posts7d ?? null,
    bikes: community?.bikes ?? null,
  };
  saveSnapshot(history, metrics);

  log.info('App report posted');
}

export default { run };
