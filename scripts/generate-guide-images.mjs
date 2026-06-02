#!/usr/bin/env node
/**
 * Generate hero images for guide articles using Gemini API.
 * Usage: node scripts/generate-guide-images.mjs [--dry-run] [--limit N] [--only {category}]
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// Load API key
const envPath = resolve(ROOT, '.env');
if (!existsSync(envPath)) { console.error('Missing .env file'); process.exit(1); }
const envContent = readFileSync(envPath, 'utf8');
const GEMINI_API_KEY = envContent.match(/GEMINI_API_KEY=(.+)/)?.[1]?.trim();
if (!GEMINI_API_KEY) { console.error('Missing GEMINI_API_KEY in .env'); process.exit(1); }

const MODEL = 'gemini-3.1-flash-image-preview';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const limitIdx = args.indexOf('--limit');
const limit = limitIdx >= 0 ? parseInt(args[limitIdx + 1]) : Infinity;
const onlyIdx = args.indexOf('--only');
const only = onlyIdx >= 0 ? args[onlyIdx + 1] : null;

// --- Load articles from articles.js ---

const articlesCode = readFileSync(resolve(ROOT, 'articles.js'), 'utf8');
const ARTICLES = new Function(articlesCode + '; return ARTICLES;')();

// --- Prompt generation by category ---

function extractKeywords(title) {
  // Remove common filler words to extract meaningful nouns/descriptors
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'for', 'in', 'on', 'of', 'to', 'with',
    'your', 'our', 'best', 'top', 'how', 'why', 'what', 'when', 'guide',
    'complete', 'ultimate', 'essential', 'uk', 'british', 'britain',
    'motorcycle', 'motorcycling', 'motorbike', 'riding', 'rider', 'riders',
    'touring', 'tour', 'tours', '2026', '2025', 'review', 'reviews',
    'compared', 'vs', 'from', 'that', 'this', 'are', 'is', 'be', 'can',
    'you', 'every', 'all', 'more', 'most', 'new', 'great',
  ]);
  return title
    .replace(/[^a-zA-Z0-9\s'-]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w.toLowerCase()))
    .map(w => w.toLowerCase())
    .join(' ');
}

function generatePrompt(category, title) {
  const keywords = extractKeywords(title);

  switch (category) {
    case 'gear':
      return `Motorcycle touring gear photo showing ${keywords}, arranged on a dark surface with dramatic lighting, professional product photography style. Landscape 16:10, no text or logos.`;

    case 'bikes':
      return `Motorcycle ${keywords} parked on a scenic British road, dramatic landscape background, golden hour lighting. Landscape 16:10, no text or logos.`;

    case 'routes':
      return `Scenic British motorcycle road ${keywords}, winding through beautiful countryside landscape, dramatic sky, cinematic wide shot. Landscape 16:10, no text or logos.`;

    case 'destinations':
      return `Beautiful ${keywords} landscape showing iconic scenery, dramatic lighting, cinematic wide shot. Landscape 16:10, no text or logos.`;

    case 'planning':
      return `Motorcycle touring preparation scene relevant to ${keywords}, warm ambient lighting, overhead or detail shot. Landscape 16:10, no text or logos.`;

    case 'scenic':
      return `${keywords} in Britain, dramatic natural landscape, golden hour lighting, cinematic wide shot. Landscape 16:10, no text or logos.`;

    case 'seasonal':
      return `British motorcycle road in ${keywords} conditions, seasonal atmosphere, atmospheric lighting. Landscape 16:10, no text or logos.`;

    default:
      return `Scenic British motorcycle touring scene related to ${keywords}, dramatic lighting, cinematic wide shot. Landscape 16:10, no text or logos.`;
  }
}

// --- API call ---

async function generateImage(prompt) {
  const res = await fetch(`${ENDPOINT}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
    }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`API ${res.status}: ${txt.substring(0, 200)}`);
  }
  const data = await res.json();
  const parts = data.candidates?.[0]?.content?.parts || [];
  for (const part of parts) {
    if (part.inlineData?.mimeType?.startsWith('image/')) {
      return Buffer.from(part.inlineData.data, 'base64');
    }
  }
  throw new Error('No image in response');
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// --- Main ---

async function main() {
  let articles = ARTICLES;
  if (only) articles = articles.filter(a => a.category === only);

  console.log(`Found ${articles.length} articles${only ? ` in category '${only}'` : ''}`);

  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (const article of articles) {
    if (generated >= limit) break;
    const filePath = `public/images/guides/${article.category}/${article.slug}.jpg`;
    const fullPath = resolve(ROOT, filePath);

    if (existsSync(fullPath)) {
      console.log(`  SKIP ${filePath} (exists)`);
      skipped++;
      continue;
    }

    const prompt = generatePrompt(article.category, article.title);

    if (dryRun) {
      console.log(`  DRY ${filePath}`);
      console.log(`      ${prompt.substring(0, 80)}...`);
      generated++;
      continue;
    }

    console.log(`  GEN  ${filePath}...`);
    try {
      const dir = dirname(fullPath);
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

      const buffer = await generateImage(prompt);
      writeFileSync(fullPath, buffer);
      const kb = Math.round(buffer.length / 1024);
      console.log(`       OK (${kb}KB)`);
      generated++;
      await sleep(2500);
    } catch (e) {
      console.error(`       FAIL: ${e.message}`);
      failed++;
      await sleep(3000);
    }
  }

  console.log(`\nDone: ${generated} generated, ${skipped} skipped, ${failed} failed`);
}

main().catch(e => { console.error(e); process.exit(1); });
