/**
 * Content Refresher Agent — VisorUp
 *
 * Audits existing articles for staleness, outdated info, and SEO opportunities,
 * then uses Claude to rewrite sections while preserving the rider-to-rider voice.
 *
 * Articles live in articles/{slug}.js with metadata in articles.js.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import { execSync } from 'node:child_process';
import Anthropic from '@anthropic-ai/sdk';
import { google } from 'googleapis';
import { getOAuth2Client } from '../core/google-auth.js';
import { createLogger } from '../core/logger.js';
import { sendSlack, slackHeader, slackSection, slackDivider } from '../core/slack.js';

const log = createLogger('content-refresher');

/* ── Config ─────────────────────────────────────────────────────────── */
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const GH_REPO = process.env.GITHUB_REPO || 'GlobalBookings/visorup';
const GH_TOKEN = process.env.GITHUB_TOKEN;
const GA4_PROPERTY = process.env.GA4_PROPERTY_ID;
const SC_SITE = process.env.SEARCH_CONSOLE_SITE_URL || 'https://visorup.co.uk';
const SITE_URL = process.env.SITE_URL || 'https://visorup.co.uk';
const MAX_REFRESHES = 2;
const WORK_DIR = process.env.WORK_DIR || path.join(__dirname, '..', '..', '..');

/* ── Repo paths ─────────────────────────────────────────────────────── */
function getRepoPaths() {
  return {
    root: WORK_DIR,
    articlesIndex: path.join(WORK_DIR, 'articles.js'),
    articlesDir: path.join(WORK_DIR, 'articles'),
  };
}

/* ── Article helpers ────────────────────────────────────────────────── */
function parseArticlesIndex(indexPath) {
  const src = fs.readFileSync(indexPath, 'utf-8');
  const match = src.match(/const\s+ARTICLES\s*=\s*\[([\s\S]*)\];?\s*$/m);
  if (!match) {
    log.warn('Could not parse ARTICLES array from articles.js');
    return [];
  }
  try {
    // The file uses JSON-style objects inside a JS array
    const cleaned = `[${match[1]}]`;
    return JSON.parse(cleaned);
  } catch {
    // Fallback: eval in a safe-ish way via Function
    try {
      const fn = new Function(`return [${match[1]}]`);
      return fn();
    } catch (e) {
      log.error(`Failed to parse articles.js: ${e.message}`);
      return [];
    }
  }
}

function readArticleContent(articlesDir, slug) {
  const filePath = path.join(articlesDir, `${slug}.js`);
  if (!fs.existsSync(filePath)) return null;

  const src = fs.readFileSync(filePath, 'utf-8');
  // Extract HTML from template literal or string
  const tmplMatch = src.match(/`([\s\S]*?)`/);
  if (tmplMatch) return tmplMatch[1];

  const strMatch = src.match(/"content"\s*:\s*"([\s\S]*?)"/);
  if (strMatch) return strMatch[1];

  return src;
}

function writeArticleContent(articlesDir, slug, newContent) {
  const filePath = path.join(articlesDir, `${slug}.js`);
  if (!fs.existsSync(filePath)) {
    log.warn(`Article file not found for writing: ${filePath}`);
    return false;
  }

  let src = fs.readFileSync(filePath, 'utf-8');
  const tmplMatch = src.match(/`([\s\S]*?)`/);
  if (tmplMatch) {
    src = src.replace(tmplMatch[0], '`' + newContent + '`');
  } else {
    log.warn(`Could not locate template literal in ${filePath}`);
    return false;
  }

  fs.writeFileSync(filePath, src, 'utf-8');
  return true;
}

/* ── Search Console data ────────────────────────────────────────────── */
async function getSearchConsoleData(slug) {
  try {
    const auth = getOAuth2Client();
    const sc = google.searchconsole({ version: 'v1', auth });

    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 90 * 86400000).toISOString().split('T')[0];

    const res = await sc.searchanalytics.query({
      siteUrl: SC_SITE,
      requestBody: {
        startDate,
        endDate,
        dimensions: ['query'],
        dimensionFilterGroups: [{
          filters: [{ dimension: 'page', operator: 'contains', expression: `/guides/${slug}` }],
        }],
        rowLimit: 20,
      },
    });

    return (res.data.rows || []).map(r => ({
      query: r.keys[0],
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: r.ctr,
      position: r.position,
    }));
  } catch (err) {
    log.warn(`Search Console fetch failed for ${slug}: ${err.message}`);
    return [];
  }
}

/* ── GA4 performance ────────────────────────────────────────────────── */
async function getGA4Performance(slug) {
  if (!GA4_PROPERTY) return null;
  try {
    const auth = getOAuth2Client();
    const analytics = google.analyticsdata({ version: 'v1beta', auth });

    const res = await analytics.properties.runReport({
      property: `properties/${GA4_PROPERTY}`,
      requestBody: {
        dateRanges: [{ startDate: '90daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [
          { name: 'screenPageViews' },
          { name: 'averageSessionDuration' },
          { name: 'bounceRate' },
        ],
        dimensionFilter: {
          filter: { fieldName: 'pagePath', stringFilter: { matchType: 'CONTAINS', value: `/guides/${slug}` } },
        },
      },
    });

    const row = res.data.rows?.[0];
    if (!row) return null;
    return {
      pageViews: Number(row.metricValues[0].value),
      avgDuration: Number(row.metricValues[1].value),
      bounceRate: Number(row.metricValues[2].value),
    };
  } catch (err) {
    log.warn(`GA4 fetch failed for ${slug}: ${err.message}`);
    return null;
  }
}

/* ── Staleness scoring ──────────────────────────────────────────────── */
function scoreStaleness(article, scData, ga4Data) {
  let score = 0;
  const reasons = [];

  // Age check — older articles score higher
  const pubDate = new Date(article.publishDate);
  const ageMonths = (Date.now() - pubDate.getTime()) / (30 * 86400000);
  if (ageMonths > 12) { score += 3; reasons.push(`${Math.round(ageMonths)} months old`); }
  else if (ageMonths > 6) { score += 1; reasons.push(`${Math.round(ageMonths)} months old`); }

  // Year references — articles with outdated year in title
  const currentYear = new Date().getFullYear();
  if (article.title && /20\d{2}/.test(article.title)) {
    const yearInTitle = parseInt(article.title.match(/20\d{2}/)[0]);
    if (yearInTitle < currentYear) {
      score += 4;
      reasons.push(`Title contains outdated year ${yearInTitle}`);
    }
  }

  // High impressions but low CTR — meta needs improvement
  const totalImpressions = scData.reduce((s, r) => s + r.impressions, 0);
  const avgCtr = scData.length ? scData.reduce((s, r) => s + r.ctr, 0) / scData.length : 0;
  if (totalImpressions > 500 && avgCtr < 0.02) {
    score += 3;
    reasons.push(`High impressions (${totalImpressions}) but low CTR (${(avgCtr * 100).toFixed(1)}%)`);
  }

  // High bounce rate
  if (ga4Data && ga4Data.bounceRate > 0.7) {
    score += 2;
    reasons.push(`Bounce rate ${(ga4Data.bounceRate * 100).toFixed(0)}%`);
  }

  // Position 5-20 — striking distance, worth refreshing
  const strikingQueries = scData.filter(r => r.position >= 5 && r.position <= 20);
  if (strikingQueries.length > 0) {
    score += 2;
    reasons.push(`${strikingQueries.length} queries in striking distance (pos 5-20)`);
  }

  return { score, reasons };
}

/* ── Claude refresh ─────────────────────────────────────────────────── */
async function refreshWithClaude(article, currentContent, scData) {
  const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

  const strikingQueries = scData
    .filter(r => r.position >= 5 && r.position <= 20)
    .map(r => `"${r.query}" (pos ${r.position.toFixed(1)})`)
    .join(', ');

  const prompt = `You are a content editor for VisorUp, a UK motorcycle touring platform.
Jack is a motorcycle tourer who rides across Britain and writes in a direct, rider-to-rider, first-person voice.
Example tone: "I've ridden this road in the rain and it's still brilliant."

Article: "${article.title}" (category: ${article.category})
Current publish date: ${article.publishDate}

Current content:
${currentContent}

${strikingQueries ? `Queries ranking positions 5-20 (work these in naturally): ${strikingQueries}` : ''}

Tasks:
1. Update any outdated information (prices, gear models, road conditions, year references)
2. Strengthen the intro — make it punchy and first-person
3. Add any missing practical detail a touring rider would want
4. Naturally incorporate striking-distance keywords without stuffing
5. Keep the direct, conversational voice — like one rider advising another over a brew at a biker café
6. Include at least one affiliate mention: <a href="https://www.sportsbikeshop.co.uk" target="_blank" rel="noopener sponsored">SportsBikeShop</a>
7. Add internal links where relevant:
   - Routes: /routes/island-to-highlands, /routes/nc500-complete
   - Tools: /build-route, /plan-trip, /packing-checklist
   - Other guides: /guides/{slug}
8. Update the year to ${new Date().getFullYear()} where appropriate

Return ONLY the refreshed HTML content. No wrapper, no explanation.`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }],
  });

  return response.content[0].text.trim();
}

/* ── Git operations ─────────────────────────────────────────────────── */
function gitCommitAndPush(repoRoot, files, message) {
  if (!GH_TOKEN) {
    log.warn('No GITHUB_TOKEN — skipping git push');
    return null;
  }

  try {
    const opts = { cwd: repoRoot, stdio: 'pipe' };
    execSync('git config user.email "agent@visorup.com"', opts);
    execSync('git config user.name "VisorUp Agent"', opts);

    for (const f of files) {
      execSync(`git add "${f}"`, opts);
    }

    execSync(`git commit -m "${message}"`, opts);

    const remote = `https://x-access-token:${GH_TOKEN}@github.com/${GH_REPO}.git`;
    execSync(`git push ${remote} HEAD:main`, opts);

    const sha = execSync('git rev-parse --short HEAD', opts).toString().trim();
    log.info(`Pushed commit ${sha}: ${message}`);
    return sha;
  } catch (err) {
    log.error(`Git push failed: ${err.message}`);
    return null;
  }
}

/* ── Main run ───────────────────────────────────────────────────────── */
export async function run() {
  log.info('Content Refresher starting');

  if (!ANTHROPIC_API_KEY) {
    log.error('ANTHROPIC_API_KEY is required');
    return;
  }

  const paths = getRepoPaths();
  const articles = parseArticlesIndex(paths.articlesIndex);

  if (!articles.length) {
    log.warn('No articles found in articles.js');
    return;
  }

  log.info(`Found ${articles.length} articles to evaluate`);

  // Score all articles for staleness
  const scored = [];
  for (const article of articles) {
    const scData = await getSearchConsoleData(article.slug);
    const ga4Data = await getGA4Performance(article.slug);
    const { score, reasons } = scoreStaleness(article, scData, ga4Data);
    scored.push({ article, scData, ga4Data, score, reasons });
  }

  // Sort by staleness score, take top N
  scored.sort((a, b) => b.score - a.score);
  const toRefresh = scored.slice(0, MAX_REFRESHES).filter(s => s.score > 0);

  if (!toRefresh.length) {
    log.info('No articles need refreshing');
    return;
  }

  log.info(`Refreshing ${toRefresh.length} articles`);

  const results = [];
  const changedFiles = [];

  for (const { article, scData, score, reasons } of toRefresh) {
    log.info(`Refreshing: ${article.title} (score: ${score})`);

    const currentContent = readArticleContent(paths.articlesDir, article.slug);
    if (!currentContent) {
      log.warn(`Could not read content for ${article.slug}`);
      continue;
    }

    try {
      const refreshedContent = await refreshWithClaude(article, currentContent, scData);

      const written = writeArticleContent(paths.articlesDir, article.slug, refreshedContent);
      if (written) {
        const filePath = path.join('articles', `${article.slug}.js`);
        changedFiles.push(filePath);
        results.push({ slug: article.slug, title: article.title, score, reasons });
        log.info(`Refreshed: ${article.slug}`);
      }
    } catch (err) {
      log.error(`Failed to refresh ${article.slug}: ${err.message}`);
    }
  }

  // Commit and push
  if (changedFiles.length) {
    const sha = gitCommitAndPush(
      paths.root,
      changedFiles,
      `content: refresh ${changedFiles.length} article(s) for freshness and SEO`,
    );

    // Slack report
    const blocks = [
      slackHeader('🏍️ Content Refresher — VisorUp'),
      slackSection(`Refreshed *${results.length}* article(s)${sha ? ` • commit \`${sha}\`` : ''}`),
      slackDivider(),
      ...results.map(r => slackSection(
        `*${r.title}*\n` +
        `Score: ${r.score} — ${r.reasons.join(', ')}\n` +
        `${SITE_URL}/guides/${r.slug}`,
      )),
    ];

    await sendSlack(blocks, `Content Refresher: ${results.length} article(s) refreshed`);
  }

  log.info(`Content Refresher complete — ${results.length} article(s) refreshed`);
}
