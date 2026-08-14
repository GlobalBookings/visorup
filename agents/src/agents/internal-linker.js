/**
 * Internal Linker Agent — VisorUp
 *
 * Scans every article for internal-linking opportunities, injecting contextual
 * links to related guides and money pages to strengthen site architecture.
 *
 * Article content lives inline in the `content` field of each entry in
 * articles.js — this is the file the site actually loads and renders, so the
 * linker reads and writes it directly (the per-file articles/{slug}.js copies
 * are not served and are intentionally left untouched).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import { execSync } from 'node:child_process';
import { createLogger } from '../core/logger.js';
import { sendSlack, slackHeader, slackSection, slackDivider } from '../core/slack.js';
import { getWorkDir } from '../utils/repo.js';

const log = createLogger('internal-linker');

/* ── Config ─────────────────────────────────────────────────────────── */
const GH_REPO = process.env.GITHUB_REPO || 'GlobalBookings/visorup';
const GH_TOKEN = process.env.GITHUB_TOKEN;
const SITE_URL = process.env.SITE_URL || 'https://visorup.co.uk';
const LOCAL_FALLBACK = path.join(__dirname, '..', '..', '..');
const MAX_LINKS_PER_ARTICLE = 3;
const MIN_CONTENT_LENGTH = 500;
// Hard ceiling on total internal /guides links per article (existing + newly
// injected) so repeated runs can't over-link a page.
const MAX_TOTAL_INTERNAL_LINKS = 8;
// When set, analyse and validate but do not write or commit (LINKER_DRY_RUN=1)
const DRY_RUN = process.env.LINKER_DRY_RUN === '1';

/* ── Money slugs — pages to prioritise linking TO ───────────────────── */
const MONEY_SLUGS = [
  'best-motorcycle-roads-scotland',
  'nc500-motorcycle-guide',
  'motorcycle-packing-checklist',
  'best-motorcycle-gear-touring',
  'motorcycle-camping-guide-uk',
  'isle-of-man-tt-guide',
];

/* ── Related category mapping ───────────────────────────────────────── */
const RELATED_CATEGORIES = {
  'Routes':         ['Destinations', 'Gear', 'Planning'],
  'Destinations':   ['Routes', 'Planning', 'Accommodation'],
  'Gear':           ['Routes', 'Maintenance', 'Safety'],
  'Planning':       ['Routes', 'Gear', 'Destinations'],
  'Maintenance':    ['Gear', 'Safety'],
  'Safety':         ['Gear', 'Maintenance', 'Planning'],
  'Accommodation':  ['Destinations', 'Routes', 'Planning'],
};

/* ── Repo paths ─────────────────────────────────────────────────────── */
function getRepoPaths(workDir) {
  const wd = workDir || getWorkDir(LOCAL_FALLBACK);
  return {
    root: wd,
    articlesIndex: path.join(wd, 'articles.js'),
    articlesDir: path.join(wd, 'articles'),
  };
}

// Slugs consolidated into a canonical page (guide-redirects.js) must not be
// used as link sources or targets — they 301/redirect to their canonical.
function loadRedirected(wd) {
  try {
    const p = path.join(wd, 'guide-redirects.js');
    if (!fs.existsSync(p)) return new Set();
    const m = fs.readFileSync(p, 'utf-8').match(/\{[\s\S]*\}/);
    return m ? new Set(Object.keys(JSON.parse(m[0]))) : new Set();
  } catch { return new Set(); }
}

/* ── Article helpers ────────────────────────────────────────────────── */
// Parse the ARTICLES array out of the raw articles.js source. The file is
// valid JSON inside the array literal, so JSON.parse round-trips exactly —
// which lets us locate and replace individual `content` values by their
// canonical JSON serialisation without reformatting the rest of the file.
function parseArticles(src) {
  const match = src.match(/const\s+ARTICLES\s*=\s*\[([\s\S]*)\];?\s*$/m);
  if (!match) {
    log.warn('Could not parse ARTICLES array from articles.js');
    return null;
  }
  try {
    return JSON.parse(`[${match[1]}]`);
  } catch (e) {
    log.error(`Failed to parse articles.js: ${e.message}`);
    return null;
  }
}

/* ── Link analysis ──────────────────────────────────────────────────── */
function getExistingInternalLinks(html) {
  // Capture the final slug segment for both /guides/{slug} and
  // /guides/{category}/{slug} so de-duplication works regardless of format.
  const linkRegex = /href=["']\/guides\/(?:[^"'/]+\/)?([^"'/]+)["']/g;
  const links = new Set();
  let m;
  while ((m = linkRegex.exec(html)) !== null) {
    links.add(m[1]);
  }
  return links;
}

function findLinkOpportunities(article, content, allArticles, redirected = new Set()) {
  const existingLinks = getExistingInternalLinks(content);
  const opportunities = [];

  // Determine related categories
  const catKey = Object.keys(RELATED_CATEGORIES).find(
    k => k.toLowerCase() === (article.category || '').toLowerCase(),
  );
  const relatedCats = catKey
    ? RELATED_CATEGORIES[catKey].map(c => c.toLowerCase())
    : [];

  for (const target of allArticles) {
    if (target.slug === article.slug) continue;
    if (redirected.has(target.slug)) continue;
    if (existingLinks.has(target.slug)) continue;

    let score = 0;

    // Money slug bonus
    if (MONEY_SLUGS.includes(target.slug)) score += 5;

    // Related category bonus
    if (relatedCats.includes((target.category || '').toLowerCase())) score += 3;

    // Same category bonus (lower than related — we want cross-linking)
    if ((target.category || '').toLowerCase() === (article.category || '').toLowerCase()) score += 1;

    // Title keyword overlap
    const sourceWords = new Set(
      (article.title || '').toLowerCase().split(/\W+/).filter(w => w.length > 3),
    );
    const targetWords = (target.title || '').toLowerCase().split(/\W+/).filter(w => w.length > 3);
    const overlap = targetWords.filter(w => sourceWords.has(w)).length;
    score += Math.min(overlap, 3);

    // Tag overlap
    if (article.tags && target.tags) {
      const sourceTags = new Set(article.tags.map(t => t.toLowerCase()));
      const tagOverlap = target.tags.filter(t => sourceTags.has(t.toLowerCase())).length;
      score += tagOverlap;
    }

    if (score > 0) {
      opportunities.push({ target, score });
    }
  }

  opportunities.sort((a, b) => b.score - a.score);
  return opportunities.slice(0, MAX_LINKS_PER_ARTICLE);
}

/* ── Link injection ─────────────────────────────────────────────────── */
function injectLinks(content, opportunities) {
  let modified = content;
  let injected = 0;

  for (const { target } of opportunities) {
    // Find a natural place to insert — look for the target title or key phrases in the text
    const titleWords = (target.title || '')
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3);

    // Try to find a phrase match in a <p> tag
    let linked = false;
    for (const word of titleWords) {
      // Case-insensitive word match NOT already inside a link
      const regex = new RegExp(
        `(<p[^>]*>[^<]*?)\\b(${word})\\b([^<]*<\\/p>)`,
        'i',
      );

      if (regex.test(modified) && !modified.match(new RegExp(`<a[^>]*>[^<]*${word}[^<]*<\\/a>`, 'i'))) {
        modified = modified.replace(regex, (_, before, match, after) => {
          return `${before}<a href="/guides/${target.category}/${target.slug}">${match}</a>${after}`;
        });
        linked = true;
        injected++;
        break;
      }
    }

    // Fallback: append a contextual link at the end of a relevant paragraph
    if (!linked) {
      const lastP = modified.lastIndexOf('</p>');
      if (lastP > -1) {
        const link = ` Read our <a href="/guides/${target.category}/${target.slug}">${target.title}</a> guide for more.`;
        modified = modified.slice(0, lastP) + link + modified.slice(lastP);
        injected++;
      }
    }
  }

  return { content: modified, injected };
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
  log.info('Internal Linker starting');

  const paths = getRepoPaths();
  const redirected = loadRedirected(paths.root);
  let src = fs.readFileSync(paths.articlesIndex, 'utf-8');
  const articles = parseArticles(src);

  if (!articles || !articles.length) {
    log.warn('No articles found in articles.js');
    return;
  }

  log.info(`Analysing ${articles.length} articles for internal linking opportunities`);

  const results = [];
  let skippedUnlocatable = 0;

  for (const article of articles) {
    if (redirected.has(article.slug)) continue; // consolidated dupe — leave untouched
    const content = article.content;
    if (typeof content !== 'string' || content.length < MIN_CONTENT_LENGTH) continue;

    const existingLinks = getExistingInternalLinks(content);
    const budget = Math.min(MAX_LINKS_PER_ARTICLE, MAX_TOTAL_INTERNAL_LINKS - existingLinks.size);
    if (budget <= 0) continue; // already sufficiently linked
    const opportunities = findLinkOpportunities(article, content, articles, redirected).slice(0, budget);
    if (!opportunities.length) continue;

    const { content: linked, injected } = injectLinks(content, opportunities);
    if (injected <= 0 || linked === content) continue;

    // Replace this article's content in-place using its canonical JSON form.
    // If the serialised value isn't uniquely locatable (escaping mismatch or
    // duplicate content), skip it rather than risk corrupting articles.js.
    const oldSerialized = JSON.stringify(content);
    const newSerialized = JSON.stringify(linked);
    const occurrences = src.split(oldSerialized).length - 1;
    if (occurrences !== 1) {
      skippedUnlocatable++;
      log.warn(`Skipped ${article.slug}: content not uniquely locatable in articles.js (${occurrences} matches)`);
      continue;
    }
    src = src.split(oldSerialized).join(newSerialized);
    results.push({
      slug: article.slug,
      title: article.title,
      existingLinks: existingLinks.size,
      injected,
    });
    log.info(`Injected ${injected} links into ${article.slug} (had ${existingLinks.size} existing)`);
  }

  if (!results.length) {
    log.info('No linking opportunities applied');
    return;
  }

  // Validate the modified source still parses to the same article count
  // before writing anything to disk.
  const verify = parseArticles(src);
  if (!verify || verify.length !== articles.length) {
    log.error('Post-edit validation failed — articles.js would be invalid; aborting without writing');
    return;
  }

  const totalInjected = results.reduce((s, r) => s + r.injected, 0);

  if (DRY_RUN) {
    log.info(`[DRY RUN] Would update ${results.length} articles with ${totalInjected} links ` +
      `(skipped ${skippedUnlocatable} unlocatable). Not writing or committing.`);
    return;
  }

  fs.writeFileSync(paths.articlesIndex, src, 'utf-8');
  const changedFiles = ['articles.js'];

  // Commit and push
  const sha = gitCommitAndPush(
    paths.root,
    changedFiles,
    `seo: add internal links to ${results.length} article(s)`,
  );

  // Slack report
  const blocks = [
    slackHeader('🔗 Internal Linker — VisorUp'),
    slackSection(
      `Processed *${articles.length}* articles\n` +
      `Updated *${results.length}* articles with *${totalInjected}* new internal links` +
      (sha ? ` • commit \`${sha}\`` : ''),
    ),
    slackDivider(),
    ...results.slice(0, 10).map(r => slackSection(
      `*${r.title}*\n+${r.injected} links (was ${r.existingLinks})`,
    )),
  ];

  await sendSlack(blocks, `Internal Linker: ${totalInjected} links added to ${results.length} articles`);

  log.info(`Internal Linker complete — ${totalInjected} links added to ${results.length} articles`);
}
