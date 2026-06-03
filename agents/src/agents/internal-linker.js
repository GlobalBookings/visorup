/**
 * Internal Linker Agent — VisorUp
 *
 * Scans every article for internal-linking opportunities, injecting contextual
 * links to related guides and money pages to strengthen site architecture.
 *
 * Articles live in articles/{slug}.js with metadata in articles.js.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import { execSync } from 'node:child_process';
import { createLogger } from '../core/logger.js';
import { sendSlack, slackHeader, slackSection, slackDivider } from '../core/slack.js';

const log = createLogger('internal-linker');

/* ── Config ─────────────────────────────────────────────────────────── */
const GH_REPO = process.env.GITHUB_REPO || 'GlobalBookings/visorup';
const GH_TOKEN = process.env.GITHUB_TOKEN;
const SITE_URL = process.env.SITE_URL || 'https://visorup.co.uk';
const WORK_DIR = process.env.WORK_DIR || path.join(__dirname, '..', '..', '..');
const MAX_LINKS_PER_ARTICLE = 5;
const MIN_CONTENT_LENGTH = 500;

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
    return JSON.parse(`[${match[1]}]`);
  } catch {
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
  const tmplMatch = src.match(/`([\s\S]*?)`/);
  if (tmplMatch) return tmplMatch[1];
  return src;
}

function writeArticleContent(articlesDir, slug, newContent) {
  const filePath = path.join(articlesDir, `${slug}.js`);
  if (!fs.existsSync(filePath)) return false;

  let src = fs.readFileSync(filePath, 'utf-8');
  const tmplMatch = src.match(/`([\s\S]*?)`/);
  if (tmplMatch) {
    src = src.replace(tmplMatch[0], '`' + newContent + '`');
    fs.writeFileSync(filePath, src, 'utf-8');
    return true;
  }
  return false;
}

/* ── Link analysis ──────────────────────────────────────────────────── */
function getExistingInternalLinks(html) {
  const linkRegex = /href=["']\/guides\/([^"']+)["']/g;
  const links = new Set();
  let m;
  while ((m = linkRegex.exec(html)) !== null) {
    links.add(m[1]);
  }
  return links;
}

function findLinkOpportunities(article, content, allArticles) {
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
          return `${before}<a href="/guides/${target.slug}">${match}</a>${after}`;
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
        const link = ` Read our <a href="/guides/${target.slug}">${target.title}</a> guide for more.`;
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
  const articles = parseArticlesIndex(paths.articlesIndex);

  if (!articles.length) {
    log.warn('No articles found in articles.js');
    return;
  }

  log.info(`Analysing ${articles.length} articles for internal linking opportunities`);

  const results = [];
  const changedFiles = [];

  for (const article of articles) {
    const content = readArticleContent(paths.articlesDir, article.slug);
    if (!content || content.length < MIN_CONTENT_LENGTH) continue;

    const existingLinks = getExistingInternalLinks(content);
    const opportunities = findLinkOpportunities(article, content, articles);

    if (!opportunities.length) continue;

    const { content: linked, injected } = injectLinks(content, opportunities);

    if (injected > 0) {
      const written = writeArticleContent(paths.articlesDir, article.slug, linked);
      if (written) {
        const filePath = path.join('articles', `${article.slug}.js`);
        changedFiles.push(filePath);
        results.push({
          slug: article.slug,
          title: article.title,
          existingLinks: existingLinks.size,
          injected,
        });
        log.info(`Injected ${injected} links into ${article.slug} (had ${existingLinks.size} existing)`);
      }
    }
  }

  if (!changedFiles.length) {
    log.info('No linking opportunities found');
    return;
  }

  // Commit and push
  const sha = gitCommitAndPush(
    paths.root,
    changedFiles,
    `seo: add internal links to ${changedFiles.length} article(s)`,
  );

  // Slack report
  const totalInjected = results.reduce((s, r) => s + r.injected, 0);
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
