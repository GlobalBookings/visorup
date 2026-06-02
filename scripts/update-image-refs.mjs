#!/usr/bin/env node
/**
 * Update all image references in site.js from Unsplash URLs to local generated images.
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const siteJs = resolve(ROOT, 'site.js');

let content = readFileSync(siteJs, 'utf8');

// Destination image replacements (in DESTINATIONS array)
const destMap = {
  'isle-of-skye': 'public/images/destinations/isle-of-skye.jpg',
  'glencoe': 'public/images/destinations/glencoe.jpg',
  'nc500': 'public/images/destinations/nc500.jpg',
  'lake-district': 'public/images/destinations/lake-district.jpg',
  'yorkshire-dales': 'public/images/destinations/yorkshire-dales.jpg',
  'snowdonia': 'public/images/destinations/snowdonia.jpg',
  'brecon-beacons': 'public/images/destinations/brecon-beacons.jpg',
  'outer-hebrides': 'public/images/destinations/outer-hebrides.jpg',
  'isle-of-man': 'public/images/destinations/isle-of-man.jpg',
  'scottish-borders': 'public/images/destinations/scottish-borders.jpg',
  'northumberland': 'public/images/destinations/northumberland.jpg',
  'jersey': 'public/images/destinations/jersey.jpg',
  'guernsey': 'public/images/destinations/guernsey.jpg',
};

// Route image replacements (in ROUTES array)
const routeMap = {
  'island-to-highlands': 'public/images/routes/island-to-highlands.jpg',
  'scottish-highlands-loop': 'public/images/routes/scottish-highlands-loop.jpg',
  'nc500-complete': 'public/images/routes/nc500-complete.jpg',
  'welsh-mountain-passes': 'public/images/routes/welsh-mountain-passes.jpg',
  'lake-district-ultimate': 'public/images/routes/lake-district-ultimate.jpg',
  'channel-islands-explorer': 'public/images/routes/channel-islands-explorer.jpg',
  'coastal-cornwall': 'public/images/routes/coastal-cornwall.jpg',
};

// Replace destination images
for (const [slug, path] of Object.entries(destMap)) {
  // Match: slug line followed by image line within ~10 lines
  const regex = new RegExp(`(slug:\\s*"${slug}"[\\s\\S]*?image:\\s*)"[^"]+"`, 'm');
  const match = content.match(regex);
  if (match) {
    content = content.replace(match[0], match[1] + '"' + path + '"');
    console.log(`  Updated dest: ${slug}`);
  } else {
    console.log(`  MISS dest: ${slug}`);
  }
}

// Replace route images
for (const [slug, path] of Object.entries(routeMap)) {
  const regex = new RegExp(`(slug:\\s*"${slug}"[\\s\\S]*?image:\\s*)"[^"]+"`, 'm');
  const match = content.match(regex);
  if (match) {
    content = content.replace(match[0], match[1] + '"' + path + '"');
    console.log(`  Updated route: ${slug}`);
  } else {
    console.log(`  MISS route: ${slug}`);
  }
}

// Replace hero backgrounds
const heroReplacements = [
  // Homepage hero
  { from: /class="hero"[^>]*style="background-image:url\([^)]+\)"/, 
    search: /(class="hero"[^>]*style="background-image:url\()[^)]+(\)")/, 
    to: '$1public/images/heroes/homepage.jpg$2' },
  // Routes page hero
  { search: /(renderRoutes[\s\S]*?page-hero.*?style="background-image:url\()[^)]+(\)")/, 
    to: '$1public/images/heroes/routes.jpg$2' },
  // Destinations page hero  
  { search: /(renderDestinations[\s\S]*?page-hero.*?style="background-image:url\()[^)]+(\)")/, 
    to: '$1public/images/heroes/destinations.jpg$2' },
];

// Simpler approach: replace specific Unsplash URLs used as hero backgrounds
const heroUrlMap = {
  // The motorcycle-on-road hero (used on homepage, about, planning)
  'photo-1558981806-ec527fa84c39': 'public/images/heroes/homepage.jpg',
  // The motorcycle detail (used on routes, contact)
  'photo-1558981852-426c6c22a060': 'public/images/heroes/routes.jpg',
  // The mountain panorama (used on destinations)
  'photo-1506905925346-21bda4d32df4': 'public/images/heroes/destinations.jpg',
};

for (const [photoId, localPath] of Object.entries(heroUrlMap)) {
  const regex = new RegExp(`https://images\\.unsplash\\.com/${photoId}\\?[^"']+`, 'g');
  const matches = content.match(regex);
  if (matches) {
    content = content.replace(regex, localPath);
    console.log(`  Updated hero: ${photoId} (${matches.length} refs) -> ${localPath}`);
  }
}

writeFileSync(siteJs, content);
console.log('\nDone. All image references updated to local files.');
