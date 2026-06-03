/**
 * Rank Tracker Agent — VisorUp
 *
 * Snapshots current Search Console positions, compares against
 * the previous snapshot, and posts a Slack digest with movers,
 * new entries, and drops.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
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

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const log = createLogger('rank-tracker');

const SITE_URL = process.env.SITE_URL || process.env.SEARCH_CONSOLE_SITE_URL;
const TIMEZONE = 'Europe/London';
const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const SNAPSHOT_FILE = path.join(DATA_DIR, 'rank-snapshot.json');

// ── helpers ───────────────────────────────────────────────

function dateFmt(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function fmtNum(n) {
  return Number(n).toLocaleString('en-GB');
}

function dateRange(daysAgo = 7) {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - daysAgo);
  const fmt = (d) => d.toISOString().slice(0, 10);
  return { startDate: fmt(start), endDate: fmt(end) };
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    log.info(`Created data directory: ${DATA_DIR}`);
  }
}

function loadPreviousSnapshot() {
  try {
    if (fs.existsSync(SNAPSHOT_FILE)) {
      const raw = fs.readFileSync(SNAPSHOT_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    log.warn(`Could not load previous snapshot: ${err.message}`);
  }
  return null;
}

function saveSnapshot(snapshot) {
  ensureDataDir();
  fs.writeFileSync(SNAPSHOT_FILE, JSON.stringify(snapshot, null, 2));
  log.info(`Snapshot saved → ${SNAPSHOT_FILE}`);
}

// ── Search Console data ───────────────────────────────────

async function fetchPositions(webmasters, range) {
  log.info('Fetching Search Console position data...');
  const res = await webmasters.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: {
      startDate: range.startDate,
      endDate: range.endDate,
      dimensions: ['query', 'page'],
      rowLimit: 500,
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

function compareSnapshots(current, previous) {
  const prevMap = new Map();
  if (previous?.rows) {
    for (const r of previous.rows) {
      prevMap.set(`${r.query}|||${r.page}`, r);
    }
  }

  const improved = [];
  const declined = [];
  const newEntries = [];
  const lost = [];

  for (const row of current) {
    const key = `${row.query}|||${row.page}`;
    const prev = prevMap.get(key);

    if (!prev) {
      newEntries.push(row);
    } else {
      const delta = prev.position - row.position; // positive = improved
      if (delta >= 2) {
        improved.push({ ...row, prevPosition: prev.position, delta });
      } else if (delta <= -2) {
        declined.push({ ...row, prevPosition: prev.position, delta });
      }
      prevMap.delete(key);
    }
  }

  // remaining in prevMap are lost keywords
  for (const [, row] of prevMap) {
    lost.push(row);
  }

  improved.sort((a, b) => b.delta - a.delta);
  declined.sort((a, b) => a.delta - b.delta);
  newEntries.sort((a, b) => b.impressions - a.impressions);
  lost.sort((a, b) => b.impressions - a.impressions);

  return { improved, declined, newEntries, lost };
}

function summariseStats(current) {
  if (!current.length) return { total: 0, avgPos: 0, top10: 0, top20: 0 };

  const total = current.length;
  const avgPos = current.reduce((s, r) => s + r.position, 0) / total;
  const top10 = current.filter((r) => r.position <= 10).length;
  const top20 = current.filter((r) => r.position <= 20).length;

  return { total, avgPos, top10, top20 };
}

// ── report builder ────────────────────────────────────────

function buildReport(stats, changes, range, hasPrevious) {
  const blocks = [];

  blocks.push(slackHeader('📈 VisorUp — Rank Tracker'));
  blocks.push(
    slackSection(
      `*${dateFmt(range.startDate)} – ${dateFmt(range.endDate)}*`
    )
  );
  blocks.push(slackDivider());

  // summary
  blocks.push(slackSection('*📊 Position Summary*'));
  blocks.push(
    slackFields([
      ['Tracked Queries', fmtNum(stats.total)],
      ['Avg Position', stats.avgPos.toFixed(1)],
      ['Top 10', fmtNum(stats.top10)],
      ['Top 20', fmtNum(stats.top20)],
    ])
  );
  blocks.push(slackDivider());

  if (!hasPrevious) {
    blocks.push(
      slackSection(
        '⚙️ _First run — snapshot saved. Changes will appear next time._'
      )
    );
    blocks.push(slackDivider());
    blocks.push(slackSection('_Rank Tracker Agent — VisorUp_'));
    return blocks;
  }

  // improved
  blocks.push(slackSection('*🟢 Improved*'));
  blocks.push(
    slackSection(
      changes.improved
        .slice(0, 10)
        .map(
          (r) =>
            `• \`${r.query}\` — ${r.prevPosition.toFixed(1)} → *${r.position.toFixed(1)}* (+${r.delta.toFixed(1)})`
        )
        .join('\n') || '_None_'
    )
  );
  blocks.push(slackDivider());

  // declined
  blocks.push(slackSection('*🔴 Declined*'));
  blocks.push(
    slackSection(
      changes.declined
        .slice(0, 10)
        .map(
          (r) =>
            `• \`${r.query}\` — ${r.prevPosition.toFixed(1)} → *${r.position.toFixed(1)}* (${r.delta.toFixed(1)})`
        )
        .join('\n') || '_None_'
    )
  );
  blocks.push(slackDivider());

  // new entries
  blocks.push(slackSection('*🆕 New Rankings*'));
  blocks.push(
    slackSection(
      changes.newEntries
        .slice(0, 8)
        .map(
          (r) =>
            `• \`${r.query}\` — pos ${r.position.toFixed(1)}, ${fmtNum(r.impressions)} impr`
        )
        .join('\n') || '_None_'
    )
  );
  blocks.push(slackDivider());

  // lost
  if (changes.lost.length) {
    blocks.push(slackSection('*⚠️ Lost Rankings*'));
    blocks.push(
      slackSection(
        changes.lost
          .slice(0, 8)
          .map(
            (r) =>
              `• \`${r.query}\` — was pos ${r.position.toFixed(1)}, ${fmtNum(r.impressions)} impr`
          )
          .join('\n')
      )
    );
    blocks.push(slackDivider());
  }

  // footer
  blocks.push(slackSection('_Rank Tracker Agent — VisorUp_'));

  return blocks;
}

// ── main ──────────────────────────────────────────────────

export async function run() {
  if (!SITE_URL) {
    log.error('SITE_URL / SEARCH_CONSOLE_SITE_URL not set — skipping');
    return;
  }

  log.info('Starting rank tracker...');
  const auth = getOAuth2Client();
  const webmasters = google.searchconsole({ version: 'v1', auth });
  const range = dateRange(7);

  const current = await fetchPositions(webmasters, range);
  log.info(`Fetched ${current.length} query/page pairs`);

  if (!current.length) {
    log.warn('No Search Console data returned');
    await sendSlack(
      [slackSection('⚠️ Rank Tracker: no Search Console data for the last 7 days.')],
      'VisorUp Rank Tracker — no data'
    );
    return;
  }

  const previous = loadPreviousSnapshot();
  const hasPrevious = !!previous;
  const stats = summariseStats(current);
  const changes = compareSnapshots(current, previous?.rows ? previous : { rows: [] });

  const blocks = buildReport(stats, changes, range, hasPrevious);
  await sendSlack(blocks, 'VisorUp Rank Tracker');

  // save current snapshot for next comparison
  saveSnapshot({
    date: new Date().toISOString(),
    range,
    rows: current,
  });

  log.info('Rank tracker report posted & snapshot saved');
}

export default { run };
