#!/usr/bin/env node
/**
 * Update articles.js to use local guide images instead of Unsplash URLs.
 * Only updates heroImage for articles where a local image exists.
 * Usage: node scripts/update-guide-image-refs.mjs [--dry-run]
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const dryRun = process.argv.includes('--dry-run');

const articlesPath = resolve(ROOT, 'articles.js');
const code = readFileSync(articlesPath, 'utf8');
const ARTICLES = new Function(code + '; return ARTICLES;')();

let updated = 0;
let missing = 0;
let articlesCode = code;

for (const article of ARTICLES) {
  const localPath = `public/images/guides/${article.category}/${article.slug}.jpg`;
  const fullPath = resolve(ROOT, localPath);

  if (existsSync(fullPath)) {
    const oldImage = article.heroImage;
    if (oldImage !== localPath) {
      articlesCode = articlesCode.replace(
        JSON.stringify(oldImage),
        JSON.stringify(localPath)
      );
      updated++;
      if (dryRun) console.log(`  UPD ${article.slug}: ${localPath}`);
    }
  } else {
    missing++;
    if (dryRun) console.log(`  MISS ${article.slug}: ${localPath}`);
  }
}

if (!dryRun && updated > 0) {
  writeFileSync(articlesPath, articlesCode);
}

console.log(`\nDone: ${updated} updated, ${missing} missing local images`);
if (dryRun) console.log('(dry run — no files modified)');
