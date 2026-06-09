#!/usr/bin/env node
/**
 * Generate additional POIs for under-covered UK regions using Gemini AI.
 * Focuses on: South/Central England, East Anglia, Channel Islands, Midlands.
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const envContent = readFileSync(resolve(ROOT, '.env'), 'utf8');
const GEMINI_API_KEY = envContent.match(/GEMINI_API_KEY=(.+)/)?.[1]?.trim();
if (!GEMINI_API_KEY) { console.error('Missing GEMINI_API_KEY'); process.exit(1); }

const MODEL = 'gemini-2.5-flash';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;

const REGIONS = [
  { name: 'South East England', latRange: [50.8, 51.8], lngRange: [-2.0, 1.5] },
  { name: 'South West England (beyond Cornwall)', latRange: [50.3, 51.3], lngRange: [-4.0, -2.0] },
  { name: 'East Anglia', latRange: [52.0, 53.0], lngRange: [0.0, 1.8] },
  { name: 'East Midlands', latRange: [52.3, 53.2], lngRange: [-1.8, -0.3] },
  { name: 'West Midlands', latRange: [52.0, 52.8], lngRange: [-2.5, -1.5] },
  { name: 'North West England (Lancashire/Cumbria gaps)', latRange: [53.5, 54.5], lngRange: [-3.5, -2.0] },
  { name: 'Jersey Channel Islands', latRange: [49.1, 49.3], lngRange: [-2.3, -2.0] },
  { name: 'Guernsey Channel Islands', latRange: [49.4, 49.5], lngRange: [-2.7, -2.5] },
  { name: 'North East England gaps', latRange: [54.5, 55.5], lngRange: [-2.5, -1.0] },
  { name: 'Scottish Lowlands', latRange: [55.5, 56.3], lngRange: [-5.0, -3.0] },
  { name: 'Central Wales', latRange: [51.8, 52.8], lngRange: [-4.5, -3.0] },
  { name: 'Isle of Man', latRange: [54.0, 54.4], lngRange: [-4.9, -4.3] }
];

const CATEGORIES = [
  { key: 'campsites', prompt: 'biker-friendly campsites or camping sites', fields: 'name, lat, lng, desc (1 sentence with practical info for motorcyclists)' },
  { key: 'pubs', prompt: 'biker-friendly pubs, cafes, or tea rooms popular with motorcyclists', fields: 'name, lat, lng, desc (1 sentence, mention parking/food/atmosphere)' },
  { key: 'viewpoints', prompt: 'scenic viewpoints or lookout points accessible by road', fields: 'name, lat, lng, desc (1 sentence about the view and access)' },
  { key: 'roads', prompt: 'notable motorcycle roads or passes (A/B roads known for good riding)', fields: 'name, lat, lng, desc (1 sentence about the road character), surface (excellent/good/fair), miles (approximate length)' },
  { key: 'castles', prompt: 'castles, ruins, or historic sites visible from or near good roads', fields: 'name, lat, lng, desc (1 sentence)' },
  { key: 'waterfalls', prompt: 'waterfalls or water features accessible or visible from roads', fields: 'name, lat, lng, desc (1 sentence)' },
  { key: 'beaches', prompt: 'beaches or coastal viewpoints with motorcycle parking', fields: 'name, lat, lng, desc (1 sentence)' },
  { key: 'landmarks', prompt: 'landmarks, monuments, or notable structures worth a stop', fields: 'name, lat, lng, desc (1 sentence)' },
  { key: 'wildlife', prompt: 'wildlife watching spots or nature reserves near good roads', fields: 'name, lat, lng, desc (1 sentence about what to see)' }
];

async function generatePOIs(region, category) {
  const prompt = `You are a UK motorcycle touring expert. Generate a JSON array of ${category.key === 'roads' ? '5' : '4'} real, genuine ${category.prompt} in the ${region.name} area of the UK (approximately lat ${region.latRange[0]}-${region.latRange[1]}, lng ${region.lngRange[0]}-${region.lngRange[1]}).

Each entry must be a REAL place that actually exists. Use accurate GPS coordinates.
Return ONLY a valid JSON array with these fields: ${category.fields}

Example format: [{"name":"Place Name","lat":51.5,"lng":-0.1,"desc":"Brief useful description."}]

No markdown, no explanation, just the JSON array.`;

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.3, maxOutputTokens: 2000 }
  };

  const resp = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`API error ${resp.status}: ${err.substring(0, 200)}`);
  }

  const data = await resp.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const jsonStr = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  try {
    const pois = JSON.parse(jsonStr);
    if (!Array.isArray(pois)) throw new Error('Not an array');
    return pois.filter(p => p.name && p.lat && p.lng && p.desc);
  } catch (e) {
    console.warn(`  WARN: Failed to parse response for ${region.name}/${category.key}: ${e.message}`);
    return [];
  }
}

async function main() {
  const results = { england: {}, wales: {}, scotland: {}, islands: {} };

  // Initialize category arrays
  for (const cat of CATEGORIES) {
    results.england[cat.key] = [];
    results.wales[cat.key] = [];
    results.scotland[cat.key] = [];
    results.islands[cat.key] = [];
  }

  let total = 0;
  for (const region of REGIONS) {
    console.log(`\n=== ${region.name} ===`);
    for (const cat of CATEGORIES) {
      process.stdout.write(`  ${cat.key}...`);

      // Rate limit
      await new Promise(r => setTimeout(r, 1500));

      try {
        const pois = await generatePOIs(region, cat);
        total += pois.length;

        // Determine which file this belongs to
        let target;
        if (region.name.includes('Scotland') || region.name.includes('Scottish')) target = 'scotland';
        else if (region.name.includes('Wales')) target = 'wales';
        else if (region.name.includes('Jersey') || region.name.includes('Guernsey') || region.name.includes('Isle of Man')) target = 'islands';
        else target = 'england';

        // If islands, merge into wales file (poi-wales-islands.js)
        if (target === 'islands') target = 'wales';

        results[target][cat.key].push(...pois);
        console.log(` ${pois.length} POIs`);
      } catch (e) {
        console.log(` ERROR: ${e.message}`);
      }
    }
  }

  console.log(`\n=== Total new POIs: ${total} ===\n`);

  // Now merge into existing files
  for (const [fileKey, catData] of Object.entries(results)) {
    if (fileKey === 'islands') continue;
    const fileName = fileKey === 'wales' ? 'poi-wales-islands.js' : `poi-${fileKey}.js`;
    const filePath = resolve(ROOT, fileName);

    if (!existsSync(filePath)) { console.log(`SKIP: ${fileName} not found`); continue; }

    let code = readFileSync(filePath, 'utf8');
    let added = 0;

    for (const [catKey, newPois] of Object.entries(catData)) {
      if (newPois.length === 0) continue;

      // Find the closing bracket of this category array
      const catPattern = new RegExp(`(${catKey}:\\s*\\[)([\\s\\S]*?)(\\])`);
      const match = code.match(catPattern);
      if (!match) {
        console.log(`  WARN: Category ${catKey} not found in ${fileName}`);
        continue;
      }

      // Build new entries
      const newEntries = newPois.map(p => {
        let entry = `    { name: '${p.name.replace(/'/g, "\\'")}', lat: ${p.lat.toFixed(2)}, lng: ${p.lng.toFixed(2)}, desc: '${(p.desc || '').replace(/'/g, "\\'")}'`;
        if (p.surface) entry += `, surface: '${p.surface}'`;
        if (p.miles) entry += `, miles: ${p.miles}`;
        if (p.url) entry += `, url: '${p.url}'`;
        entry += ' }';
        return entry;
      }).join(',\n');

      // Append before the closing bracket
      const existingContent = match[2].trimEnd();
      const separator = existingContent.endsWith(',') ? '\n' : ',\n';
      code = code.replace(catPattern, `${match[1]}${existingContent}${separator}${newEntries}\n  ${match[3]}`);
      added += newPois.length;
    }

    if (added > 0) {
      writeFileSync(filePath, code);
      console.log(`Updated ${fileName}: +${added} POIs`);
    }
  }
}

main().catch(e => { console.error(e); process.exit(1); });
