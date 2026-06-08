/**
 * GA4 Briefing Agent — VisorUp
 *
 * Pulls the last 7 days of GA4 data and posts a Slack digest
 * covering traffic overview, sources, devices, top pages,
 * landing pages, affiliate clicks, geo breakdown, and
 * VisorUp-specific events (tool_used, guide_viewed, etc.).
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

const log = createLogger('ga4-briefing');

const PROPERTY_ID = process.env.GA4_PROPERTY_ID;
const TIMEZONE = 'Europe/London';

// ── helpers ────────────────────────────────────────────────

function dateFmt(dateStr) {
  // dateStr = 'YYYY-MM-DD' from dateRange()
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function fmtNum(n) {
  return Number(n).toLocaleString('en-GB');
}

function pct(a, b) {
  if (!b) return '—';
  return `${((a / b) * 100).toFixed(1)}%`;
}

function dateRange(daysAgo = 7) {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - daysAgo);
  const fmt = (d) => d.toISOString().slice(0, 10);
  return { startDate: fmt(start), endDate: fmt(end) };
}

function categorisePath(pagePath) {
  if (pagePath.startsWith('/guides/')) return 'guide';
  if (pagePath.startsWith('/routes/')) return 'route';
  if (
    [
      '/build-route',
      '/plan-trip',
      '/packing-checklist',
      '/cost-calculator',
      '/weather',
      '/sunrise-sunset',
      '/service-tracker',
      '/mot-tax',
      '/emergency-card',
    ].some((t) => pagePath.startsWith(t))
  )
    return 'tool';
  if (pagePath.startsWith('/community')) return 'community';
  return 'other';
}

// ── GA4 query helper ──────────────────────────────────────

async function query(analytics, body) {
  const res = await analytics.properties.runReport({
    property: `properties/${PROPERTY_ID}`,
    requestBody: body,
  });
  return res.data;
}

// ── data fetchers ─────────────────────────────────────────

// Filter to exclude likely bot traffic: only count sessions with engagement time > 0
const BOT_FILTER = {
  filter: {
    fieldName: 'sessionDefaultChannelGroup',
    stringFilter: { value: '(not set)', matchType: 'EXACT' },
  },
};

// Dimension filter for engaged sessions only (engagement time > 0 seconds)
const ENGAGED_FILTER = {
  filter: {
    fieldName: 'engagedSessions',
    numericFilter: { operation: 'GREATER_THAN', value: { int64Value: '0' } },
  },
};

async function getOverview(analytics, range) {
  // Get raw numbers (all traffic)
  const rawData = await query(analytics, {
    dateRanges: [{ startDate: range.startDate, endDate: range.endDate }],
    metrics: [
      { name: 'activeUsers' },
      { name: 'sessions' },
      { name: 'screenPageViews' },
      { name: 'averageSessionDuration' },
      { name: 'bounceRate' },
      { name: 'newUsers' },
    ],
  });

  // Get engaged users only (likely real humans)
  const engagedData = await query(analytics, {
    dateRanges: [{ startDate: range.startDate, endDate: range.endDate }],
    metrics: [
      { name: 'activeUsers' },
      { name: 'sessions' },
      { name: 'engagedSessions' },
      { name: 'screenPageViews' },
      { name: 'userEngagementDuration' },
    ],
    dimensionFilter: {
      filter: {
        fieldName: 'sessionDefaultChannelGroup',
        stringFilter: { value: 'Direct', matchType: 'EXACT' },
      },
    },
  });

  const data = rawData;

  const row = data.rows?.[0]?.metricValues || [];
  const engRow = engagedData.rows?.[0]?.metricValues || [];
  const engagedSessions = Number(engRow[2]?.value || 0);
  const totalSessions = Number(row[1]?.value || 0);
  const estimatedBots = totalSessions > 0 ? Math.max(0, totalSessions - engagedSessions * 3) : 0;

  return {
    users: Number(row[0]?.value || 0),
    sessions: Number(row[1]?.value || 0),
    pageviews: Number(row[2]?.value || 0),
    avgDuration: Number(row[3]?.value || 0),
    bounceRate: Number(row[4]?.value || 0),
    newUsers: Number(row[5]?.value || 0),
    engagedSessions,
    estimatedBots,
  };
}

async function getSources(analytics, range) {
  const data = await query(analytics, {
    dateRanges: [{ startDate: range.startDate, endDate: range.endDate }],
    dimensions: [{ name: 'sessionDefaultChannelGroup' }],
    metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 8,
  });

  return (data.rows || []).map((r) => ({
    channel: r.dimensionValues[0].value,
    sessions: Number(r.metricValues[0].value),
    users: Number(r.metricValues[1].value),
  }));
}

async function getDevices(analytics, range) {
  const data = await query(analytics, {
    dateRanges: [{ startDate: range.startDate, endDate: range.endDate }],
    dimensions: [{ name: 'deviceCategory' }],
    metrics: [{ name: 'sessions' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
  });

  return (data.rows || []).map((r) => ({
    device: r.dimensionValues[0].value,
    sessions: Number(r.metricValues[0].value),
  }));
}

async function getTopPages(analytics, range) {
  const data = await query(analytics, {
    dateRanges: [{ startDate: range.startDate, endDate: range.endDate }],
    dimensions: [{ name: 'pagePath' }],
    metrics: [{ name: 'screenPageViews' }, { name: 'activeUsers' }],
    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
    limit: 15,
  });

  return (data.rows || []).map((r) => ({
    path: r.dimensionValues[0].value,
    views: Number(r.metricValues[0].value),
    users: Number(r.metricValues[1].value),
    type: categorisePath(r.dimensionValues[0].value),
  }));
}

async function getLandingPages(analytics, range) {
  const data = await query(analytics, {
    dateRanges: [{ startDate: range.startDate, endDate: range.endDate }],
    dimensions: [{ name: 'landingPagePlusQueryString' }],
    metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 10,
  });

  return (data.rows || []).map((r) => ({
    page: r.dimensionValues[0].value,
    sessions: Number(r.metricValues[0].value),
    users: Number(r.metricValues[1].value),
  }));
}

async function getAffiliateClicks(analytics, range) {
  const data = await query(analytics, {
    dateRanges: [{ startDate: range.startDate, endDate: range.endDate }],
    dimensions: [{ name: 'eventName' }],
    metrics: [{ name: 'eventCount' }],
    dimensionFilter: {
      filter: {
        fieldName: 'eventName',
        stringFilter: { value: 'affiliate_click', matchType: 'EXACT' },
      },
    },
  });

  const total = Number(data.rows?.[0]?.metricValues?.[0]?.value || 0);

  // breakdown by page
  const detail = await query(analytics, {
    dateRanges: [{ startDate: range.startDate, endDate: range.endDate }],
    dimensions: [{ name: 'pagePath' }],
    metrics: [{ name: 'eventCount' }],
    dimensionFilter: {
      filter: {
        fieldName: 'eventName',
        stringFilter: { value: 'affiliate_click', matchType: 'EXACT' },
      },
    },
    orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
    limit: 5,
  });

  const pages = (detail.rows || []).map((r) => ({
    page: r.dimensionValues[0].value,
    clicks: Number(r.metricValues[0].value),
  }));

  return { total, pages };
}

async function getVisorUpEvents(analytics, range) {
  const eventNames = ['tool_used', 'guide_viewed', 'community_post', 'sign_up'];

  const data = await query(analytics, {
    dateRanges: [{ startDate: range.startDate, endDate: range.endDate }],
    dimensions: [{ name: 'eventName' }],
    metrics: [{ name: 'eventCount' }],
    dimensionFilter: {
      filter: {
        fieldName: 'eventName',
        inListFilter: { values: eventNames },
      },
    },
    orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
  });

  const counts = {};
  for (const name of eventNames) counts[name] = 0;
  for (const row of data.rows || []) {
    counts[row.dimensionValues[0].value] = Number(row.metricValues[0].value);
  }
  return counts;
}

async function getGeo(analytics, range) {
  const data = await query(analytics, {
    dateRanges: [{ startDate: range.startDate, endDate: range.endDate }],
    dimensions: [{ name: 'country' }],
    metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 10,
  });

  return (data.rows || []).map((r) => ({
    country: r.dimensionValues[0].value,
    sessions: Number(r.metricValues[0].value),
    users: Number(r.metricValues[1].value),
  }));
}

// ── report builder ────────────────────────────────────────

function buildReport(overview, sources, devices, topPages, landings, affiliate, visorUpEvents, geo, range) {
  const blocks = [];

  // header
  blocks.push(slackHeader('🏍️ VisorUp — GA4 Weekly Briefing'));
  blocks.push(
    slackSection(
      `*${dateFmt(range.startDate)} – ${dateFmt(range.endDate)}*`
    )
  );
  blocks.push(slackDivider());

  // overview
  blocks.push(slackSection('*📊 Traffic Overview*'));
  blocks.push(
    slackFields([
      ['Users', fmtNum(overview.users)],
      ['New Users', fmtNum(overview.newUsers)],
      ['Sessions', fmtNum(overview.sessions)],
      ['Pageviews', fmtNum(overview.pageviews)],
      ['Avg Duration', `${overview.avgDuration.toFixed(1)}s`],
      ['Bounce Rate', `${(overview.bounceRate * 100).toFixed(1)}%`],
      ['Engaged Sessions', fmtNum(overview.engagedSessions)],
      ['Est. Bot Traffic', fmtNum(overview.estimatedBots)],
    ])
  );

  // Bot warning if bounce rate is very high
  if (overview.bounceRate > 0.85 && overview.estimatedBots > overview.sessions * 0.5) {
    blocks.push(
      slackSection(
        '⚠️ *High bot traffic detected.* ' +
        `~${fmtNum(overview.estimatedBots)} sessions (${pct(overview.estimatedBots, overview.sessions)}) appear to be bots. ` +
        'Real engaged users: ~' + fmtNum(overview.engagedSessions) + '. ' +
        'Consider enabling Cloudflare Bot Fight Mode or GA4 internal traffic filters.'
      )
    );
  }
  blocks.push(slackDivider());

  // content type breakdown
  const typeCounts = { guide: 0, route: 0, tool: 0, community: 0, other: 0 };
  for (const p of topPages) typeCounts[p.type] = (typeCounts[p.type] || 0) + p.views;
  blocks.push(slackSection('*📂 Content Type Breakdown*'));
  blocks.push(
    slackSection(
      Object.entries(typeCounts)
        .map(([t, v]) => `• *${t}*: ${fmtNum(v)} views`)
        .join('\n')
    )
  );
  blocks.push(slackDivider());

  // sources
  blocks.push(slackSection('*🔗 Traffic Sources*'));
  blocks.push(
    slackSection(
      sources
        .map(
          (s) =>
            `• *${s.channel}*: ${fmtNum(s.sessions)} sessions (${fmtNum(s.users)} users)`
        )
        .join('\n') || '_No source data_'
    )
  );
  blocks.push(slackDivider());

  // devices
  const totalDevSessions = devices.reduce((a, d) => a + d.sessions, 0);
  blocks.push(slackSection('*📱 Devices*'));
  blocks.push(
    slackSection(
      devices
        .map(
          (d) =>
            `• *${d.device}*: ${fmtNum(d.sessions)} (${pct(d.sessions, totalDevSessions)})`
        )
        .join('\n') || '_No device data_'
    )
  );
  blocks.push(slackDivider());

  // top pages
  blocks.push(slackSection('*📄 Top Pages*'));
  blocks.push(
    slackSection(
      topPages
        .slice(0, 10)
        .map(
          (p) =>
            `• \`${p.path}\` — ${fmtNum(p.views)} views (${p.type})`
        )
        .join('\n') || '_No page data_'
    )
  );
  blocks.push(slackDivider());

  // landing pages
  blocks.push(slackSection('*🛬 Top Landing Pages*'));
  blocks.push(
    slackSection(
      landings
        .map(
          (l) =>
            `• \`${l.page}\` — ${fmtNum(l.sessions)} sessions`
        )
        .join('\n') || '_No landing data_'
    )
  );
  blocks.push(slackDivider());

  // affiliate clicks
  blocks.push(slackSection('*💰 Affiliate Clicks*'));
  blocks.push(slackSection(`Total: *${fmtNum(affiliate.total)}* clicks`));
  if (affiliate.pages.length) {
    blocks.push(
      slackSection(
        affiliate.pages
          .map((p) => `• \`${p.page}\` — ${fmtNum(p.clicks)}`)
          .join('\n')
      )
    );
  }
  blocks.push(slackDivider());

  // VisorUp-specific events
  blocks.push(slackSection('*🏍️ VisorUp Events*'));
  blocks.push(
    slackFields([
      ['tool_used', fmtNum(visorUpEvents.tool_used)],
      ['guide_viewed', fmtNum(visorUpEvents.guide_viewed)],
      ['community_post', fmtNum(visorUpEvents.community_post)],
      ['sign_up', fmtNum(visorUpEvents.sign_up)],
    ])
  );
  blocks.push(slackDivider());

  // geo
  blocks.push(slackSection('*🌍 Geography*'));
  blocks.push(
    slackSection(
      geo
        .map(
          (g) =>
            `• *${g.country}*: ${fmtNum(g.sessions)} sessions (${fmtNum(g.users)} users)`
        )
        .join('\n') || '_No geo data_'
    )
  );
  blocks.push(slackDivider());

  // footer
  blocks.push(slackSection('_GA4 Briefing Agent — VisorUp_'));

  return blocks;
}

// ── main ──────────────────────────────────────────────────

export async function run() {
  if (!PROPERTY_ID) {
    log.error('GA4_PROPERTY_ID not set — skipping');
    return;
  }

  log.info('Starting GA4 briefing...');
  const auth = getOAuth2Client();
  const analytics = google.analyticsdata({ version: 'v1beta', auth });
  const range = dateRange(7);

  const [overview, sources, devices, topPages, landings, affiliate, visorUpEvents, geo] =
    await Promise.all([
      getOverview(analytics, range),
      getSources(analytics, range),
      getDevices(analytics, range),
      getTopPages(analytics, range),
      getLandingPages(analytics, range),
      getAffiliateClicks(analytics, range),
      getVisorUpEvents(analytics, range),
      getGeo(analytics, range),
    ]);

  const blocks = buildReport(
    overview,
    sources,
    devices,
    topPages,
    landings,
    affiliate,
    visorUpEvents,
    geo,
    range
  );

  await sendSlack(blocks, 'VisorUp GA4 Weekly Briefing');
  log.info('GA4 briefing posted');
}

export default { run };
