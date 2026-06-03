/**
 * Shareable Content Agent — VisorUp
 *
 * Generates linkbait-style articles designed for social sharing and backlinks.
 * Content types: comparisons, data-driven pieces, ultimate lists, seasonal guides.
 *
 * Writes to articles/{slug}.js with metadata in articles.js.
 * Hero images generated via Gemini.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import Anthropic from '@anthropic-ai/sdk';
import { createLogger } from '../core/logger.js';
import { sendSlack, slackHeader, slackSection, slackDivider } from '../core/slack.js';
import { generateImage } from '../utils/gemini-image.js';

const log = createLogger('shareable-content');

/* ── Config ─────────────────────────────────────────────────────────── */
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const GH_REPO = process.env.GITHUB_REPO || 'GlobalBookings/visorup';
const GH_TOKEN = process.env.GITHUB_TOKEN;
const SITE_URL = process.env.SITE_URL || 'https://visorup.com';
const WORK_DIR = process.env.WORK_DIR || process.cwd();

/* ── Content templates ──────────────────────────────────────────────── */
const CONTENT_TYPES = {
  comparison: [
    'Sport Touring vs Adventure Bikes: Which Is Better for UK Touring?',
    'Scotland vs Wales: Best Motorcycle Touring Destination?',
    'NC500 vs Isle of Man TT Course: Which Route to Ride First?',
    'Camping vs B&Bs: Best Accommodation for Bike Touring',
    'Summer vs Autumn: Best Season for UK Motorcycle Touring',
    'Tank Bag vs Panniers: Which Luggage Setup Wins?',
  ],
  'data-driven': [
    'UK Motorcycle Touring by the Numbers: Stats Every Rider Should Know',
    'The True Cost of a UK Motorcycle Tour: Budget Breakdown',
    'Best UK Motorcycle Roads Ranked: Every A-Road and B-Road Rated',
    'UK Fuel Station Density Map: Where You Can and Can\'t Fill Up',
  ],
  'ultimate-list': [
    '50 Must-Ride Roads in Britain: The Complete Checklist',
    '25 Best Biker-Friendly Pubs and Cafes in the UK',
    'Every Scottish Pass Worth Riding: The Complete List',
    '30 Best Viewpoints You Can Ride To in Britain',
  ],
  'seasonal-guide': [
    'Motorcycle Touring in March: Early Season Guide',
    'Motorcycle Touring in June: Peak Season Planning',
    'Motorcycle Touring in September: The Best Month to Ride?',
    'Winter Motorcycle Storage: Complete Preparation Guide',
  ],
};

/* ── Repo paths ─────────────────────────────────────────────────────── */
function getRepoPaths() {
  return {
    root: WORK_DIR,
    articlesIndex: path.join(WORK_DIR, 'articles.js'),
    articlesDir: path.join(WORK_DIR, 'articles'),
    imagesDir: path.join(WORK_DIR, 'public', 'images', 'guides'),
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

  const lastEntry = src.lastIndexOf('}');
  if (lastEntry === -1) return false;

  const arrayEnd = src.indexOf(']', lastEntry);
  if (arrayEnd === -1) return false;

  const entry = ',\n' + JSON.stringify(metadata);
  src = src.slice(0, arrayEnd) + entry + '\n' + src.slice(arrayEnd);

  fs.writeFileSync(indexPath, src, 'utf-8');
  return true;
}

/* ── Pick next topic ────────────────────────────────────────────────── */
function pickTopic(existingSlugs) {
  const allTopics = [];

  for (const [type, titles] of Object.entries(CONTENT_TYPES)) {
    for (const title of titles) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/(^-|-$)/g, '');
      if (!existingSlugs.has(slug)) {
        allTopics.push({ type, title, slug });
      }
    }
  }

  if (!allTopics.length) return null;

  // Rotate through content types to maintain variety
  const typeCounts = {};
  for (const t of allTopics) {
    typeCounts[t.type] = (typeCounts[t.type] || 0) + 1;
  }

  // Pick from the type with most remaining topics
  const sorted = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);
  const targetType = sorted[0][0];

  return allTopics.find(t => t.type === targetType);
}

/* ── Assign category ────────────────────────────────────────────────── */
function assignCategory(type, title) {
  const t = title.toLowerCase();
  if (/route|road|pass|nc500|coast/i.test(t)) return 'routes';
  if (/scotland|wales|england|destination/i.test(t)) return 'destinations';
  if (/gear|helmet|jacket|boot|luggage|pannier|tank bag/i.test(t)) return 'gear';
  if (/maintenance|storage|chain|oil/i.test(t)) return 'maintenance';
  if (/plan|budget|cost|season|march|june|september/i.test(t)) return 'planning';
  if (/safe|hazard/i.test(t)) return 'safety';
  if (/camp|b&b|accommodation|pub/i.test(t)) return 'accommodation';
  if (type === 'seasonal-guide') return 'planning';
  if (type === 'data-driven') return 'planning';
  return 'routes';
}

/* ── Generate with Claude ───────────────────────────────────────────── */
async function generateShareableArticle(topic) {
  const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

  const typeInstructions = {
    comparison: 'Write a detailed comparison with pros/cons tables, verdict, and "who should choose which" section.',
    'data-driven': 'Pack it with specific numbers, statistics, costs, and data points. Use tables and ranked lists.',
    'ultimate-list': 'Write an epic numbered list. Each entry gets 2-3 sentences with a specific, useful detail.',
    'seasonal-guide': 'Cover weather conditions, road states, gear requirements, and specific routes suited to the season.',
  };

  const currentYear = new Date().getFullYear();

  const prompt = `You are writing shareable content for VisorUp, a UK motorcycle touring platform.
Author: Jack, a motorcycle tourer who rides across Britain.
Voice: direct, rider-to-rider, first-person. Punchy, opinionated, but backed by experience.
Example: "I've ridden this road in the rain and it's still brilliant."

Content type: ${topic.type}
${typeInstructions[topic.type] || ''}

Title: "${topic.title}"
Year: ${currentYear}

Requirements:
1. HTML content only — use <h2>, <h3>, <p>, <ul>, <li>, <ol>, <blockquote>, <table>, <tr>, <th>, <td> tags
2. 2,000-3,500 words — this is premium shareable content, go deep
3. First-person, opinionated voice. Take strong positions backed by riding experience
4. Include practical, specific information that makes riders want to share this
5. Reference real UK roads (A-roads, B-roads by number), real places, real conditions
6. Include 1-2 affiliate mentions:
   <a href="https://www.sportsbikeshop.co.uk" target="_blank" rel="noopener sponsored">SportsBikeShop</a>
7. Include 3-4 internal links:
   - Routes: /routes/island-to-highlands, /routes/nc500-complete
   - Tools: /build-route, /plan-trip, /packing-checklist
   - Guides: /guides/{relevant-slug}
8. Include at least one blockquote with a strong opinion or key insight
9. Make the intro compelling enough to share — hook the reader in the first 2 sentences
10. End with a clear call-to-action

Also provide these META lines at the end:
META::DESCRIPTION: (meta description, max 155 chars, compelling for social sharing)
META::TAGS: (comma-separated tags)
META::READ_TIME: (e.g. "12 min read")`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 6000,
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

  const contentEnd = text.indexOf('META::');
  const htmlContent = contentEnd > -1 ? text.slice(0, contentEnd).trim() : text;

  return {
    content: htmlContent,
    metaDescription: meta.description || '',
    tags: meta.tags ? meta.tags.split(',').map(t => t.trim()) : [],
    readTime: meta.read_time || '10 min read',
  };
}

/* ── Generate hero image ────────────────────────────────────────────── */
async function generateHeroImage(title, category, imagesDir) {
  const categoryDir = path.join(imagesDir, category);
  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir, { recursive: true });
  }

  const prompt = `A striking, shareable hero image for a motorcycle touring article titled "${title}". ` +
    `Style: bold, dramatic, high-contrast. British landscape with motorcycle. ` +
    `Cinematic composition, vibrant colours, sweeping road through dramatic scenery. ` +
    `Photorealistic, magazine-quality, no text or watermarks.`;

  const dataUrl = await generateImage(prompt);
  if (!dataUrl) return null;

  const match = dataUrl.match(/^data:image\/(.*?);base64,(.*)$/);
  if (!match) return null;

  const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
  const buffer = Buffer.from(match[2], 'base64');
  const filename = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50)}.${ext}`;
  const imagePath = path.join(categoryDir, filename);

  fs.writeFileSync(imagePath, buffer);
  log.info(`Hero image saved: ${imagePath}`);

  return `public/images/guides/${category}/${filename}`;
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
  log.info('Shareable Content Agent starting');

  if (!ANTHROPIC_API_KEY) {
    log.error('ANTHROPIC_API_KEY is required');
    return;
  }

  const paths = getRepoPaths();
  const articles = parseArticlesIndex(paths.articlesIndex);
  const existingSlugs = getExistingSlugs(articles);

  log.info(`Found ${articles.length} existing articles`);

  const topic = pickTopic(existingSlugs);
  if (!topic) {
    log.info('All shareable content topics have been published');
    return;
  }

  log.info(`Generating shareable content: "${topic.title}" (${topic.type})`);

  try {
    const category = assignCategory(topic.type, topic.title);
    const article = await generateShareableArticle(topic);

    // Generate hero image
    const heroImage = await generateHeroImage(topic.title, category, paths.imagesDir);

    // Write article file
    writeArticleFile(paths.articlesDir, topic.slug, article.content);

    // Build metadata
    const metadata = {
      slug: topic.slug,
      category,
      title: topic.title,
      metaDescription: article.metaDescription,
      heroImage: heroImage || `public/images/guides/${category}/${topic.slug}.jpg`,
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

    // Collect changed files
    const changedFiles = [
      path.join('articles', `${topic.slug}.js`),
      'articles.js',
    ];
    if (heroImage) changedFiles.push(heroImage);

    // Commit and push
    const sha = gitCommitAndPush(
      paths.root,
      changedFiles,
      `content: publish shareable ${topic.type} — ${topic.title}`,
    );

    // Slack report
    const blocks = [
      slackHeader('🚀 Shareable Content — VisorUp'),
      slackSection(
        `Published *${topic.type}* article${sha ? ` • commit \`${sha}\`` : ''}\n` +
        `*${topic.title}*\n` +
        `Category: ${category}\n` +
        `${SITE_URL}/guides/${topic.slug}`,
      ),
    ];

    await sendSlack(blocks, `Shareable Content: ${topic.title}`);

    log.info(`Shareable Content complete — published: ${topic.title}`);
  } catch (err) {
    log.error(`Failed to generate shareable content: ${err.message}`);
  }
}
