/**
 * Content Publisher Agent — VisorUp
 *
 * Uses Search Console data to identify content gaps in motorcycle touring queries,
 * then generates new SEO-optimised articles with Claude and hero images via Gemini.
 *
 * Writes new articles to articles/{slug}.js and appends metadata to articles.js.
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
import { generateImage } from '../utils/gemini-image.js';
import { getWorkDir } from '../utils/repo.js';

const log = createLogger('content-publisher');

/* ── Config ─────────────────────────────────────────────────────────── */
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const GH_REPO = process.env.GITHUB_REPO || 'GlobalBookings/visorup';
const GH_TOKEN = process.env.GITHUB_TOKEN;
const SC_SITE = process.env.SEARCH_CONSOLE_SITE_URL || 'https://visorup.co.uk';
const SITE_URL = process.env.SITE_URL || 'https://visorup.co.uk';
const GA4_PROPERTY = process.env.GA4_PROPERTY_ID;
const LOCAL_FALLBACK = path.join(__dirname, '..', '..', '..');
const POSTS_PER_RUN = 2;

const CATEGORIES = [
  'Routes',
  'Destinations',
  'Gear',
  'Maintenance',
  'Planning',
  'Safety',
  'Accommodation',
];

/* ── Repo paths ─────────────────────────────────────────────────────── */
function getRepoPaths(workDir) {
  const wd = workDir || getWorkDir(LOCAL_FALLBACK);
  return {
    root: wd,
    articlesIndex: path.join(wd, 'articles.js'),
    articlesDir: path.join(wd, 'articles'),
    imagesDir: path.join(wd, 'public', 'images', 'guides'),
  };
}

/* ── Article index helpers ──────────────────────────────────────────── */
function parseArticlesIndex(indexPath) {
  const src = fs.readFileSync(indexPath, 'utf-8');
  const match = src.match(/const\s+ARTICLES\s*=\s*\[([\s\S]*)\];?\s*$/m);
  if (!match) return [];
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

function getExistingSlugs(articles) {
  return new Set(articles.map(a => a.slug));
}

function appendToArticlesIndex(indexPath, metadata) {
  let src = fs.readFileSync(indexPath, 'utf-8');

  // Find the last closing brace+comma or brace before the array end
  const lastEntry = src.lastIndexOf('}');
  if (lastEntry === -1) {
    log.error('Could not find insertion point in articles.js');
    return false;
  }

  // Find the end bracket after the last entry
  const arrayEnd = src.indexOf(']', lastEntry);
  if (arrayEnd === -1) {
    log.error('Could not find array end in articles.js');
    return false;
  }

  const entry = ',\n' + JSON.stringify(metadata);
  src = src.slice(0, arrayEnd) + entry + '\n' + src.slice(arrayEnd);

  fs.writeFileSync(indexPath, src, 'utf-8');
  return true;
}

/* ── Search Console — find content gaps ─────────────────────────────── */
async function findContentGaps(existingSlugs) {
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
        rowLimit: 500,
      },
    });

    const rows = res.data.rows || [];

    // Find queries with high impressions but no matching article
    const gaps = rows
      .filter(r => r.impressions > 50 && r.clicks < 5)
      .filter(r => {
        const query = r.keys[0].toLowerCase();
        // Must be motorcycle/touring related
        return /motorcycle|motorbike|touring|riding|bike|route|road|helmet|gear/i.test(query);
      })
      .filter(r => {
        // No existing article covers this query well
        const query = r.keys[0].toLowerCase();
        const slug = query.replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        return !existingSlugs.has(slug);
      })
      .sort((a, b) => b.impressions - a.impressions)
      .slice(0, 10)
      .map(r => ({
        query: r.keys[0],
        impressions: r.impressions,
        clicks: r.clicks,
        position: r.position,
      }));

    return gaps;
  } catch (err) {
    log.warn(`Search Console gap analysis failed: ${err.message}`);
    return [];
  }
}

/* ── Assign category ────────────────────────────────────────────────── */
function assignCategory(query) {
  const q = query.toLowerCase();
  if (/route|road|a-road|b-road|pass|nc500|coast/i.test(q)) return 'Routes';
  if (/scotland|wales|england|highlands|lake district|isle of/i.test(q)) return 'Destinations';
  if (/helmet|jacket|glove|boot|gear|luggage|pannier|tank bag/i.test(q)) return 'Gear';
  if (/oil|chain|tyre|brake|service|maintenance|clean/i.test(q)) return 'Maintenance';
  if (/plan|pack|budget|checklist|prepare|itinerary/i.test(q)) return 'Planning';
  if (/safe|hazard|rain|ice|visibility|first aid/i.test(q)) return 'Safety';
  if (/camp|b&b|hotel|hostel|accommodation|bothy|stay/i.test(q)) return 'Accommodation';
  return CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
}

/* ── Generate article with Claude ───────────────────────────────────── */
async function generateArticle(topic, category) {
  const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

  const currentYear = new Date().getFullYear();

  const prompt = `You are writing for VisorUp, a UK motorcycle touring platform.
Author: Jack, a motorcycle tourer who rides across Britain.
Voice: direct, rider-to-rider, first-person. Like advising a mate over a brew at a biker café.
Example: "I've ridden this road in the rain and it's still brilliant."

Write a comprehensive SEO article about: "${topic}"
Category: ${category}
Year: ${currentYear}

Requirements:
1. HTML content only — use <h2>, <h3>, <p>, <ul>, <li>, <blockquote> tags
2. 1,500-2,500 words, information-dense and practical
3. First-person, direct voice throughout
4. Include practical tips a touring rider actually needs
5. Reference specific UK roads, locations, and conditions
6. Include at least one affiliate mention:
   <a href="https://www.sportsbikeshop.co.uk" target="_blank" rel="noopener sponsored">SportsBikeShop</a>
7. Include 2-3 internal links:
   - Routes: /routes/island-to-highlands, /routes/nc500-complete
   - Tools: /build-route, /plan-trip, /packing-checklist
   - Guides: /guides/{relevant-slug}
8. Include one blockquote with a key takeaway
9. End with a practical summary or action step
10. Cover British weather, gear, and riding conditions where relevant

Also provide these as separate lines at the very end, each on its own line prefixed with META::
META::TITLE: (SEO title, max 60 chars, include year if relevant)
META::DESCRIPTION: (Meta description, max 155 chars)
META::SLUG: (URL slug, lowercase-kebab-case)
META::TAGS: (comma-separated tags)
META::READ_TIME: (e.g. "8 min read")`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 5000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].text.trim();

  // Parse META lines
  const metaLines = text.split('\n').filter(l => l.startsWith('META::'));
  const meta = {};
  for (const line of metaLines) {
    const [key, ...rest] = line.replace('META::', '').split(':');
    meta[key.trim().toLowerCase()] = rest.join(':').trim();
  }

  // Extract HTML content (everything before META lines)
  const contentEnd = text.indexOf('META::');
  const htmlContent = contentEnd > -1 ? text.slice(0, contentEnd).trim() : text;

  return {
    content: htmlContent,
    title: meta.title || topic,
    metaDescription: meta.description || '',
    slug: meta.slug || topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    tags: meta.tags ? meta.tags.split(',').map(t => t.trim()) : [],
    readTime: meta.read_time || '7 min read',
    category: category.toLowerCase(),
  };
}

/* ── Generate hero image ────────────────────────────────────────────── */
async function generateHeroImage(title, category, imagesDir) {
  const categoryDir = path.join(imagesDir, category.toLowerCase());
  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir, { recursive: true });
  }

  const prompt = `A stunning photograph of a motorcycle touring scene in the British countryside. ` +
    `Related to: ${title}. ` +
    `Style: cinematic, golden hour lighting, dramatic UK landscape with rolling hills or coastal roads. ` +
    `A touring motorcycle (adventure bike or sport tourer) is visible. ` +
    `Photorealistic, high quality, no text or watermarks.`;

  const dataUrl = await generateImage(prompt);
  if (!dataUrl) return null;

  // Save image
  const match = dataUrl.match(/^data:image\/(.*?);base64,(.*)$/);
  if (!match) return null;

  const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
  const buffer = Buffer.from(match[2], 'base64');
  const filename = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50)}.${ext}`;
  const imagePath = path.join(categoryDir, filename);

  fs.writeFileSync(imagePath, buffer);
  log.info(`Hero image saved: ${imagePath}`);

  return `public/images/guides/${category.toLowerCase()}/${filename}`;
}

/* ── Write article file ─────────────────────────────────────────────── */
function writeArticleFile(articlesDir, slug, content) {
  const filePath = path.join(articlesDir, `${slug}.js`);
  const fileContent = `export const content = \`${content.replace(/`/g, '\\`')}\`;\n`;
  fs.writeFileSync(filePath, fileContent, 'utf-8');
  return filePath;
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
  log.info('Content Publisher starting');

  if (!ANTHROPIC_API_KEY) {
    log.error('ANTHROPIC_API_KEY is required');
    return;
  }

  const paths = getRepoPaths();
  const articles = parseArticlesIndex(paths.articlesIndex);
  const existingSlugs = getExistingSlugs(articles);

  log.info(`Found ${articles.length} existing articles`);

  // Find content gaps via Search Console
  const gaps = await findContentGaps(existingSlugs);
  log.info(`Found ${gaps.length} content gap opportunities`);

  // Select topics to write about
  let topics = gaps.slice(0, POSTS_PER_RUN).map(g => ({
    query: g.query,
    category: assignCategory(g.query),
    impressions: g.impressions,
  }));

  // If no gaps found, use fallback topics
  if (!topics.length) {
    log.info('No Search Console gaps found — using fallback topics');
    const fallbacks = [
      { query: 'best motorcycle roads in the Lake District', category: 'Routes' },
      { query: 'motorcycle touring packing tips for beginners', category: 'Planning' },
      { query: 'winter motorcycle storage guide UK', category: 'Maintenance' },
      { query: 'best biker-friendly B&Bs in Scotland', category: 'Accommodation' },
      { query: 'motorcycle chain maintenance on tour', category: 'Maintenance' },
      { query: 'wet weather riding techniques UK', category: 'Safety' },
    ];

    topics = fallbacks
      .filter(f => !existingSlugs.has(f.query.toLowerCase().replace(/[^a-z0-9]+/g, '-')))
      .slice(0, POSTS_PER_RUN)
      .map(f => ({ ...f, impressions: 0 }));
  }

  if (!topics.length) {
    log.info('No suitable topics to publish');
    return;
  }

  const results = [];
  const changedFiles = [];

  for (const topic of topics) {
    log.info(`Generating article: "${topic.query}" (${topic.category})`);

    try {
      // Generate article content with Claude
      const article = await generateArticle(topic.query, topic.category);

      // Skip if slug already exists
      if (existingSlugs.has(article.slug)) {
        log.warn(`Slug already exists: ${article.slug} — skipping`);
        continue;
      }

      // Generate hero image
      const heroImage = await generateHeroImage(article.title, article.category, paths.imagesDir);

      // Write article file
      writeArticleFile(paths.articlesDir, article.slug, article.content);
      changedFiles.push(path.join('articles', `${article.slug}.js`));

      // Add hero image if generated
      if (heroImage) {
        changedFiles.push(heroImage);
      }

      // Build metadata
      const metadata = {
        slug: article.slug,
        category: article.category,
        title: article.title,
        metaDescription: article.metaDescription,
        heroImage: heroImage || `public/images/guides/${article.category}/${article.slug}.jpg`,
        author: 'VisorUp Team',
        publishDate: new Date().toISOString().split('T')[0],
        readTime: article.readTime,
        tags: article.tags,
        relatedSlugs: [],
        affiliateLinks: [],
        content: article.content,
      };

      // Append to articles.js
      appendToArticlesIndex(paths.articlesIndex, metadata);
      changedFiles.push('articles.js');

      existingSlugs.add(article.slug);
      results.push({ slug: article.slug, title: article.title, category: article.category });
      log.info(`Published: ${article.title}`);
    } catch (err) {
      log.error(`Failed to generate article for "${topic.query}": ${err.message}`);
    }
  }

  if (!changedFiles.length) {
    log.info('No articles published');
    return;
  }

  // Commit and push
  const sha = gitCommitAndPush(
    paths.root,
    [...new Set(changedFiles)],
    `content: publish ${results.length} new article(s)`,
  );

  // Slack report
  const blocks = [
    slackHeader('📝 Content Publisher — VisorUp'),
    slackSection(
      `Published *${results.length}* new article(s)` +
      (sha ? ` • commit \`${sha}\`` : ''),
    ),
    slackDivider(),
    ...results.map(r => slackSection(
      `*${r.title}*\n` +
      `Category: ${r.category}\n` +
      `${SITE_URL}/guides/${r.slug}`,
    )),
  ];

  await sendSlack(blocks, `Content Publisher: ${results.length} new articles published`);

  log.info(`Content Publisher complete — ${results.length} article(s) published`);
}
