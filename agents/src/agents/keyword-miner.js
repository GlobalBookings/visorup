/**
 * Keyword Miner Agent — VisorUp
 *
 * Pulls Search Console queries, groups them by motorcycle-touring
 * keyword themes, scores them for commercial intent, and posts
 * a digest to Slack with opportunities & quick-wins.
 */

import { google } from 'googleapis';
import { getOAuth2Client } from '../core/google-auth.js';
import { createLogger } from '../core/logger.js';
import {
  sendSlack,
  slackHeader,
  slackSection,
  slackDivider,
  slackFields,
} from '../core/slack.js';
import { fetchSitemapUrls, categorizeUrl } from '../utils/sitemap.js';

const log = createLogger('keyword-miner');

const SITE_URL = process.env.SITE_URL || process.env.SEARCH_CONSOLE_SITE_URL;
const SITEMAP_URL = process.env.SITEMAP_URL;

// ── keyword themes ────────────────────────────────────────

const THEMES = {
  'motorcycle': [],
  'route': [],
  'touring': [],
  'biker': [],
  'scotland': [],
  'highlands': [],
  'wales': [],
  'lake district': [],
  'nc500': [],
  'packing': [],
  'gear': [],
  'ferry': [],
  'camping': [],
  'accommodation': [],
  'weather': [],
  'gps': [],
};

// ── scoring signals ───────────────────────────────────────

const BOOKING_SIGNALS = [
  'gear', 'buy', 'shop', 'helmet', 'jacket', 'boots', 'gloves',
  'panniers', 'luggage', 'satnav', 'gps', 'intercom', 'exhaust',
  'insurance', 'ferry', 'hotel', 'accommodation', 'camping',
  'sportsbikeshop', 'best', 'review', 'top',
];

const DEPRIORITIZE_SIGNALS = [
  'weather', 'forecast', 'meaning', 'wiki', 'distance', 'population', 'history',
];

// ── helpers ───────────────────────────────────────────────

function dateRange(daysAgo = 28) {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - daysAgo);
  const fmt = (d) => d.toISOString().slice(0, 10);
  return { startDate: fmt(start), endDate: fmt(end) };
}

function fmtNum(n) {
  return Number(n).toLocaleString('en-GB');
}

function scoreQuery(query, clicks, impressions, position) {
  let score = 0;
  const q = query.toLowerCase();

  // base score from volume
  score += Math.min(impressions / 100, 10);
  score += clicks * 2;

  // position bonus — reward queries near page 1
  if (position <= 10) score += 5;
  else if (position <= 20) score += 10; // strike-distance
  else if (position <= 30) score += 5;

  // booking intent
  for (const sig of BOOKING_SIGNALS) {
    if (q.includes(sig)) {
      score += 3;
      break;
    }
  }

  // deprioritize informational
  for (const sig of DEPRIORITIZE_SIGNALS) {
    if (q.includes(sig)) {
      score -= 4;
      break;
    }
  }

  return Math.max(score, 0);
}

function assignTheme(query) {
  const q = query.toLowerCase();
  for (const theme of Object.keys(THEMES)) {
    if (q.includes(theme)) return theme;
  }
  return 'other';
}

function categorizePageUrl(url) {
  try {
    const path = new URL(url).pathname;
    if (path.startsWith('/guides/')) return 'guide';
    if (path.startsWith('/routes/')) return 'route';
    if (
      [
        '/build-route', '/plan-trip', '/packing-checklist',
        '/cost-calculator', '/weather', '/sunrise-sunset',
        '/service-tracker', '/mot-tax', '/emergency-card',
      ].some((t) => path.startsWith(t))
    )
      return 'tool';
    return 'page';
  } catch {
    return 'page';
  }
}

// ── Search Console data ───────────────────────────────────

async function fetchQueries(webmasters, range) {
  log.info('Fetching Search Console query data...');
  const res = await webmasters.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: {
      startDate: range.startDate,
      endDate: range.endDate,
      dimensions: ['query', 'page'],
      rowLimit: 1000,
      type: 'web',
    },
  });

  return (res.data.rows || []).map((r) => ({
    query: r.keys[0],
    page: r.keys[1],
    clicks: r.clicks,
    impressions: r.impressions,
    ctr: r.ctr,
    position: r.position,
  }));
}

// ── analysis ──────────────────────────────────────────────

function analyseQueries(rows) {
  // score and sort
  const scored = rows.map((r) => ({
    ...r,
    score: scoreQuery(r.query, r.clicks, r.impressions, r.position),
    theme: assignTheme(r.query),
    pageType: categorizePageUrl(r.page),
  }));
  scored.sort((a, b) => b.score - a.score);

  // theme breakdown
  const themes = {};
  for (const r of scored) {
    if (!themes[r.theme]) themes[r.theme] = { queries: 0, clicks: 0, impressions: 0 };
    themes[r.theme].queries += 1;
    themes[r.theme].clicks += r.clicks;
    themes[r.theme].impressions += r.impressions;
  }

  // quick-wins: high impressions, low clicks, position 8–20
  const quickWins = scored.filter(
    (r) => r.impressions >= 20 && r.position >= 8 && r.position <= 20 && r.clicks < 5
  );
  quickWins.sort((a, b) => b.impressions - a.impressions);

  // strike-distance: position 11–20 with decent impressions
  const strikeDistance = scored.filter(
    (r) => r.position >= 11 && r.position <= 20 && r.impressions >= 10
  );
  strikeDistance.sort((a, b) => a.position - b.position);

  // high-commercial keywords
  const commercial = scored.filter(
    (r) => BOOKING_SIGNALS.some((s) => r.query.toLowerCase().includes(s))
  );
  commercial.sort((a, b) => b.score - a.score);

  return { scored, themes, quickWins, strikeDistance, commercial };
}

// ── report builder ────────────────────────────────────────

function buildReport(analysis, range) {
  const { scored, themes, quickWins, strikeDistance, commercial } = analysis;
  const blocks = [];

  blocks.push(slackHeader('🔍 VisorUp — Keyword Miner'));
  blocks.push(
    slackSection(
      `*${range.startDate} – ${range.endDate}*  |  ${fmtNum(scored.length)} queries analysed`
    )
  );
  blocks.push(slackDivider());

  // theme breakdown
  blocks.push(slackSection('*📂 Theme Breakdown*'));
  const sortedThemes = Object.entries(themes).sort((a, b) => b[1].impressions - a[1].impressions);
  blocks.push(
    slackSection(
      sortedThemes
        .slice(0, 12)
        .map(
          ([t, v]) =>
            `• *${t}*: ${fmtNum(v.queries)} queries, ${fmtNum(v.impressions)} impr, ${fmtNum(v.clicks)} clicks`
        )
        .join('\n') || '_No themes_'
    )
  );
  blocks.push(slackDivider());

  // top 10 by score
  blocks.push(slackSection('*⭐ Top Scored Keywords*'));
  blocks.push(
    slackSection(
      scored
        .slice(0, 10)
        .map(
          (r) =>
            `• \`${r.query}\` — pos ${r.position.toFixed(1)}, ${fmtNum(r.impressions)} impr, ${r.clicks} clicks (${r.theme})`
        )
        .join('\n') || '_None_'
    )
  );
  blocks.push(slackDivider());

  // quick-wins
  blocks.push(slackSection('*🎯 Quick-Win Opportunities*'));
  blocks.push(
    slackSection(
      quickWins
        .slice(0, 8)
        .map(
          (r) =>
            `• \`${r.query}\` — pos ${r.position.toFixed(1)}, ${fmtNum(r.impressions)} impr, ${r.clicks} clicks`
        )
        .join('\n') || '_No quick-wins found_'
    )
  );
  blocks.push(slackDivider());

  // strike-distance
  blocks.push(slackSection('*🎳 Strike-Distance (pos 11–20)*'));
  blocks.push(
    slackSection(
      strikeDistance
        .slice(0, 8)
        .map(
          (r) =>
            `• \`${r.query}\` — pos ${r.position.toFixed(1)}, ${fmtNum(r.impressions)} impr → \`${new URL(r.page).pathname}\``
        )
        .join('\n') || '_None_'
    )
  );
  blocks.push(slackDivider());

  // commercial intent
  blocks.push(slackSection('*💰 Commercial-Intent Keywords*'));
  blocks.push(
    slackSection(
      commercial
        .slice(0, 8)
        .map(
          (r) =>
            `• \`${r.query}\` — pos ${r.position.toFixed(1)}, ${fmtNum(r.impressions)} impr, score ${r.score.toFixed(0)}`
        )
        .join('\n') || '_No commercial keywords_'
    )
  );
  blocks.push(slackDivider());

  // footer
  blocks.push(slackSection('_Keyword Miner Agent — VisorUp_'));

  return blocks;
}

// ── main ──────────────────────────────────────────────────

export async function run() {
  if (!SITE_URL) {
    log.error('SITE_URL / SEARCH_CONSOLE_SITE_URL not set — skipping');
    return;
  }

  log.info('Starting keyword miner...');
  const auth = getOAuth2Client();
  const webmasters = google.searchconsole({ version: 'v1', auth });
  const range = dateRange(28);

  const rows = await fetchQueries(webmasters, range);
  log.info(`Fetched ${rows.length} query rows`);

  if (!rows.length) {
    log.warn('No Search Console data returned');
    await sendSlack(
      [slackSection('⚠️ Keyword Miner: no Search Console data for the last 28 days.')],
      'VisorUp Keyword Miner — no data'
    );
    return;
  }

  const analysis = analyseQueries(rows);
  const blocks = buildReport(analysis, range);

  await sendSlack(blocks, 'VisorUp Keyword Miner');
  log.info('Keyword miner report posted');
}

export default { run };
