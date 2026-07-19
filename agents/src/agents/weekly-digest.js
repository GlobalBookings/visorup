/**
 * Weekly Executive Digest — VisorUp
 *
 * One consolidated Slack post with the KPIs that matter, each compared
 * week-over-week (this last 7 days vs the 7 days before):
 *   • Website (GA4)     — users, sign-ups, affiliate clicks
 *   • Search (GSC)      — clicks, impressions, average position
 *   • App Store         — downloads
 *   • App (Supabase)    — new riders, total riders, routes saved
 *   • Affiliate         — latest commission from the scraper
 *
 * Every source degrades gracefully: a section that can't be fetched is
 * simply omitted, so the digest never hard-fails.
 */

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { google } from 'googleapis';
import { getOAuth2Client } from '../core/google-auth.js';
import { createLogger } from '../core/logger.js';
import {
  sendSlack, slackHeader, slackSection, slackDivider, slackFields,
} from '../core/slack.js';
import { ascConfigured, ascFetch } from '../core/asc-auth.js';
import { supabaseConfigured, countRows, countBetween } from '../core/supabase.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AFFILIATE_RESULT = path.join(__dirname, '..', '..', 'data', 'affiliate-last.json');

const log = createLogger('weekly-digest');

const GA4_PROPERTY = process.env.GA4_PROPERTY_ID;
const SITE_URL = process.env.SEARCH_CONSOLE_SITE_URL || process.env.SITE_URL;
const VENDOR_NUMBER = process.env.ASC_VENDOR_NUMBER;

// ── date helpers ──────────────────────────────────────────

function ymd(d) { return d.toISOString().slice(0, 10); }
function daysAgo(n) { const d = new Date(); d.setDate(d.getDate() - n); return d; }

// This week = [today-7, today-1]; last week = [today-14, today-8].
const CUR = { startDate: ymd(daysAgo(7)), endDate: ymd(daysAgo(1)) };
const PREV = { startDate: ymd(daysAgo(14)), endDate: ymd(daysAgo(8)) };

function fmtNum(n) { return n == null ? 'n/a' : Number(n).toLocaleString('en-GB'); }

// [label, "value ▲delta"] — set lowerIsBetter for metrics like avg position.
function withDelta(label, cur, prev, { currency = false, decimals = 0, lowerIsBetter = false } = {}) {
  const fmt = (v) => currency ? `£${Number(v).toFixed(2)}` : (decimals ? Number(v).toFixed(decimals) : fmtNum(Math.round(v)));
  const val = cur == null ? 'n/a' : fmt(cur);
  if (cur == null || prev == null) return [label, val];
  const d = cur - prev;
  if (Math.abs(d) < (decimals ? 0.05 : 0.5)) return [label, `${val}  ▬`];
  const improving = lowerIsBetter ? d < 0 : d > 0;
  const sign = improving ? '▲' : '▼';
  const mag = currency ? `£${Math.abs(d).toFixed(2)}` : (decimals ? Math.abs(d).toFixed(decimals) : fmtNum(Math.round(Math.abs(d))));
  return [label, `${val}  ${sign}${mag}`];
}

// ── GA4 ───────────────────────────────────────────────────

async function ga4Metric(analytics, range, metric, eventName) {
  const body = {
    dateRanges: [{ startDate: range.startDate, endDate: range.endDate }],
    metrics: [{ name: metric }],
  };
  if (eventName) {
    body.dimensionFilter = {
      filter: { fieldName: 'eventName', stringFilter: { value: eventName, matchType: 'EXACT' } },
    };
  }
  const res = await analytics.properties.runReport({ property: `properties/${GA4_PROPERTY}`, requestBody: body });
  return Number(res.data.rows?.[0]?.metricValues?.[0]?.value || 0);
}

async function getWebsite() {
  if (!GA4_PROPERTY) return null;
  const auth = getOAuth2Client();
  const analytics = google.analyticsdata({ version: 'v1beta', auth });

  const [
    usersCur, usersPrev,
    signupCur, signupPrev,
    affCur, affPrev,
  ] = await Promise.all([
    ga4Metric(analytics, CUR, 'activeUsers'),
    ga4Metric(analytics, PREV, 'activeUsers'),
    ga4Metric(analytics, CUR, 'eventCount', 'sign_up'),
    ga4Metric(analytics, PREV, 'eventCount', 'sign_up'),
    ga4Metric(analytics, CUR, 'eventCount', 'affiliate_click'),
    ga4Metric(analytics, PREV, 'eventCount', 'affiliate_click'),
  ]);

  return { usersCur, usersPrev, signupCur, signupPrev, affCur, affPrev };
}

// ── Search Console ────────────────────────────────────────

async function scTotals(webmasters, range) {
  const res = await webmasters.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: { startDate: range.startDate, endDate: range.endDate, type: 'web' },
  });
  const row = res.data.rows?.[0];
  return {
    clicks: row?.clicks || 0,
    impressions: row?.impressions || 0,
    position: row?.position ?? null,
  };
}

async function getSearch() {
  if (!SITE_URL) return null;
  const auth = getOAuth2Client();
  const webmasters = google.searchconsole({ version: 'v1', auth });
  const [cur, prev] = await Promise.all([scTotals(webmasters, CUR), scTotals(webmasters, PREV)]);
  return { cur, prev };
}

// ── App Store downloads (this week vs last week) ──────────

async function downloadsForDate(reportDate) {
  const params = new URLSearchParams({
    'filter[frequency]': 'DAILY',
    'filter[reportDate]': reportDate,
    'filter[reportSubType]': 'SUMMARY',
    'filter[reportType]': 'SALES',
    'filter[vendorNumber]': VENDOR_NUMBER,
  });
  const { ok, buffer } = await ascFetch(`/v1/salesReports?${params.toString()}`, { responseType: 'buffer' });
  if (!ok) return 0; // 404 = no sales that day
  try {
    const lines = zlib.gunzipSync(buffer).toString('utf-8').split('\n').filter(Boolean);
    if (lines.length < 2) return 0;
    const h = lines[0].split('\t');
    const iU = h.indexOf('Units');
    const iT = h.indexOf('Product Type Identifier');
    let dl = 0;
    for (let i = 1; i < lines.length; i++) {
      const c = lines[i].split('\t');
      if ((c[iT] || '').trim().startsWith('1')) dl += Number(c[iU] || 0);
    }
    return dl;
  } catch { return 0; }
}

async function getDownloads() {
  if (!(ascConfigured() && VENDOR_NUMBER)) return null;
  let cur = 0, prev = 0;
  for (let i = 1; i <= 14; i++) {
    const dl = await downloadsForDate(ymd(daysAgo(i)));
    if (i <= 7) cur += dl; else prev += dl;
  }
  return { cur, prev };
}

// ── App (Supabase) ────────────────────────────────────────

async function getApp() {
  if (!supabaseConfigured()) return null;
  const [totalRiders, newCur, newPrev, totalRoutes, routesCur, routesPrev] = await Promise.all([
    countRows('profiles'),
    countBetween('profiles', 'created_at', daysAgo(7).toISOString(), new Date().toISOString()),
    countBetween('profiles', 'created_at', daysAgo(14).toISOString(), daysAgo(7).toISOString()),
    countRows('saved_trips'),
    countBetween('saved_trips', 'created_at', daysAgo(7).toISOString(), new Date().toISOString()),
    countBetween('saved_trips', 'created_at', daysAgo(14).toISOString(), daysAgo(7).toISOString()),
  ]);
  return { totalRiders, newCur, newPrev, totalRoutes, routesCur, routesPrev };
}

// ── Affiliate (latest scrape) ─────────────────────────────

function getAffiliate() {
  try {
    if (!fs.existsSync(AFFILIATE_RESULT)) return null;
    return JSON.parse(fs.readFileSync(AFFILIATE_RESULT, 'utf-8'));
  } catch { return null; }
}

// ── report ────────────────────────────────────────────────

function buildReport(web, search, downloads, app, affiliate) {
  const blocks = [];
  blocks.push(slackHeader('📊 VisorUp — Weekly Executive Digest'));
  blocks.push(slackSection(`*${CUR.startDate} – ${CUR.endDate}*  vs previous 7 days  ·  _▲ better · ▼ worse · ▬ flat_`));
  blocks.push(slackDivider());

  // Website
  blocks.push(slackSection('*🌐 Website (GA4)*'));
  if (web) {
    blocks.push(slackFields([
      withDelta('Users', web.usersCur, web.usersPrev),
      withDelta('Sign-ups', web.signupCur, web.signupPrev),
      withDelta('Affiliate clicks', web.affCur, web.affPrev),
    ]));
  } else {
    blocks.push(slackSection('_GA4 not configured._'));
  }
  blocks.push(slackDivider());

  // Search
  blocks.push(slackSection('*🔎 Search (Search Console)*'));
  if (search) {
    blocks.push(slackFields([
      withDelta('Clicks', search.cur.clicks, search.prev.clicks),
      withDelta('Impressions', search.cur.impressions, search.prev.impressions),
      withDelta('Avg position', search.cur.position, search.prev.position, { decimals: 1, lowerIsBetter: true }),
    ]));
  } else {
    blocks.push(slackSection('_Search Console not configured._'));
  }
  blocks.push(slackDivider());

  // App
  blocks.push(slackSection('*📱 App*'));
  const appFields = [];
  if (downloads) appFields.push(withDelta('Downloads', downloads.cur, downloads.prev));
  if (app) {
    appFields.push(withDelta('New riders', app.newCur, app.newPrev));
    appFields.push(['Total riders', fmtNum(app.totalRiders)]);
    appFields.push(withDelta('Routes saved', app.routesCur, app.routesPrev));
    appFields.push(['Total routes', fmtNum(app.totalRoutes)]);
  }
  if (appFields.length) blocks.push(slackFields(appFields));
  else blocks.push(slackSection('_App Store / Supabase not configured._'));
  blocks.push(slackDivider());

  // Affiliate
  blocks.push(slackSection('*💰 Affiliate (SportsBikeShop)*'));
  if (affiliate && (affiliate.commission || affiliate.clicks || affiliate.sales)) {
    const commission = affiliate.commission
      ? (String(affiliate.commission).startsWith('£') ? affiliate.commission : `£${affiliate.commission}`)
      : 'n/a';
    blocks.push(slackFields([
      ['Commission', commission],
      ['Clicks', affiliate.clicks || 'n/a'],
      ['Sales', affiliate.sales || 'n/a'],
    ]));
    blocks.push(slackSection(`_As of ${new Date(affiliate.date).toLocaleDateString('en-GB')}_`));
  } else {
    blocks.push(slackSection('_No affiliate figures yet — run the affiliate-revenue agent._'));
  }
  blocks.push(slackDivider());
  blocks.push(slackSection('_Weekly Executive Digest — VisorUp_'));

  return blocks;
}

// ── main ──────────────────────────────────────────────────

export async function run() {
  log.info('Building weekly executive digest...');

  const [web, search, downloads, app] = await Promise.all([
    getWebsite().catch((e) => { log.error(`GA4: ${e.message}`); return null; }),
    getSearch().catch((e) => { log.error(`Search Console: ${e.message}`); return null; }),
    getDownloads().catch((e) => { log.error(`App Store: ${e.message}`); return null; }),
    getApp().catch((e) => { log.error(`Supabase: ${e.message}`); return null; }),
  ]);
  const affiliate = getAffiliate();

  const blocks = buildReport(web, search, downloads, app, affiliate);
  await sendSlack(blocks, 'VisorUp Weekly Executive Digest');
  log.info('Weekly digest posted');
}

export default { run };
