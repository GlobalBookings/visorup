#!/usr/bin/env node
/**
 * Generate all site images using Gemini API.
 * Usage: node scripts/generate-images.mjs [--dry-run] [--limit N] [--only destinations|routes|heroes|ferries]
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

// --- Image definitions ---

const IMAGES = [
  // Destinations (800x600, 4:3 cards)
  { file: 'public/images/destinations/isle-of-skye.jpg', category: 'destinations',
    prompt: 'Dramatic Scottish Highland landscape of the Isle of Skye, showing the Old Man of Storr rock pinnacle rising from misty green hillside, moody sky with dramatic clouds, a narrow single-track road winding through the foreground, golden hour lighting, cinematic wide shot. Landscape orientation, 4:3 aspect ratio. No text, watermarks, or logos.' },
  { file: 'public/images/destinations/glencoe.jpg', category: 'destinations',
    prompt: 'Glencoe valley in the Scottish Highlands, the Three Sisters mountains with steep rocky faces rising on both sides of a dramatic valley, the A82 road visible as a ribbon through the glen floor, low clouds swirling around the peaks, moody atmospheric lighting with patches of sunlight breaking through, lush green valley floor. Landscape orientation, 4:3 aspect ratio. No text, watermarks, or logos.' },
  { file: 'public/images/destinations/nc500.jpg', category: 'destinations',
    prompt: 'The North Coast 500 route in Scotland, dramatic single-track road with passing places hugging a wild Highland coastline, turquoise sea on one side and rugged mountains on the other, white sandy beach visible below cliffs, a motorcycle parked at a scenic viewpoint, warm golden hour light. Landscape orientation, 4:3 aspect ratio. No text, watermarks, or logos.' },
  { file: 'public/images/destinations/lake-district.jpg', category: 'destinations',
    prompt: 'The English Lake District, a narrow mountain pass road (Hardknott Pass) with steep hairpin bends climbing through green fells, a deep glacial lake (Wastwater) visible in the valley below, stone walls lining the road, dramatic clouds over mountain peaks, afternoon sunlight. Landscape orientation, 4:3 aspect ratio. No text, watermarks, or logos.' },
  { file: 'public/images/destinations/yorkshire-dales.jpg', category: 'destinations',
    prompt: 'Yorkshire Dales landscape showing the Ribblehead Viaduct, its 24 stone arches spanning a green valley with moorland hills behind, a dry stone wall in the foreground, sheep grazing on the fell, dramatic sky with cumulus clouds, warm natural light. Landscape orientation, 4:3 aspect ratio. No text, watermarks, or logos.' },
  { file: 'public/images/destinations/snowdonia.jpg', category: 'destinations',
    prompt: 'Snowdonia National Park in Wales, the Llanberis Pass road winding between steep mountain walls with Snowdon summit visible behind, slate rock faces on both sides, a mountain stream alongside the road, atmospheric misty conditions with shafts of light breaking through, green moss on rocks. Landscape orientation, 4:3 aspect ratio. No text, watermarks, or logos.' },
  { file: 'public/images/destinations/brecon-beacons.jpg', category: 'destinations',
    prompt: 'The Black Mountain Pass (A4069) in the Brecon Beacons Wales, a sweeping tarmac road with flowing curves climbing over open moorland, rolling green hills stretching to the horizon, a lone motorcycle leaning into a bend, warm sunset lighting, expansive sky. Landscape orientation, 4:3 aspect ratio. No text, watermarks, or logos.' },
  { file: 'public/images/destinations/outer-hebrides.jpg', category: 'destinations',
    prompt: 'Luskentyre Beach on the Isle of Harris, Outer Hebrides Scotland, pristine white shell-sand beach with crystal turquoise water, machair grassland in the foreground, distant mountain silhouettes, dramatic clouds, a single-track road visible leading to the beach, bright natural light. Landscape orientation, 4:3 aspect ratio. No text, watermarks, or logos.' },
  { file: 'public/images/destinations/isle-of-man.jpg', category: 'destinations',
    prompt: 'The Isle of Man TT Mountain Course road, dramatic winding tarmac road climbing over Snaefell mountain, stone walls lining the road, a motorcycle at speed with slight lean angle, green hillside dropping away to the coast visible below, blue sky with scattered clouds, summer light. Landscape orientation, 4:3 aspect ratio. No text, watermarks, or logos.' },
  { file: 'public/images/destinations/scottish-borders.jpg', category: 'destinations',
    prompt: 'Scott\'s View in the Scottish Borders, looking over the River Tweed curving through a lush green valley toward the three Eildon Hills, rolling countryside with patches of heather, golden autumn colors on trees, warm afternoon light, a quiet B-road in the foreground. Landscape orientation, 4:3 aspect ratio. No text, watermarks, or logos.' },
  { file: 'public/images/destinations/northumberland.jpg', category: 'destinations',
    prompt: 'Bamburgh Castle in Northumberland England, the imposing medieval fortress on a rocky headland overlooking a wide sandy beach, dramatic clouds behind the castle, dune grass in the foreground, warm golden hour light reflecting on wet sand, the North Sea stretching to the horizon. Landscape orientation, 4:3 aspect ratio. No text, watermarks, or logos.' },
  { file: 'public/images/destinations/jersey.jpg', category: 'destinations',
    prompt: 'La Corbiere Lighthouse on Jersey, Channel Islands, the iconic white lighthouse on a rocky tidal island connected by a causeway, dramatic sunset sky with orange and purple clouds reflected in rock pools, granite coastline, Atlantic Ocean. Landscape orientation, 4:3 aspect ratio. No text, watermarks, or logos.' },
  { file: 'public/images/destinations/guernsey.jpg', category: 'destinations',
    prompt: 'St Peter Port harbour in Guernsey, Channel Islands, colorful harbourfront buildings climbing the hillside, boats moored in the marina, Castle Cornet visible at the harbour entrance, bright summer day, blue water, charming narrow lanes visible between buildings. Landscape orientation, 4:3 aspect ratio. No text, watermarks, or logos.' },

  // Routes (800x600, 4:3 cards)
  { file: 'public/images/routes/island-to-highlands.jpg', category: 'routes',
    prompt: 'A motorcycle touring adventure through Britain, a sport-touring motorcycle on a dramatic Highland road with mountains rising on both sides, a loch visible in the distance, panniers loaded for touring, golden hour lighting, sense of epic journey and freedom. Landscape orientation, 4:3 aspect ratio. No text, watermarks, or logos.' },
  { file: 'public/images/routes/scottish-highlands-loop.jpg', category: 'routes',
    prompt: 'A winding single-track road through the Scottish Highlands near Torridon, dramatic mountain scenery with Liathach mountain rising behind, a loch reflecting the sky, the road disappearing into the mountains, moody atmospheric lighting with clouds. Landscape orientation, 4:3 aspect ratio. No text, watermarks, or logos.' },
  { file: 'public/images/routes/nc500-complete.jpg', category: 'routes',
    prompt: 'The Bealach na Ba mountain pass road in Scotland, dramatic switchback hairpin bends climbing steeply through rocky terrain, the sea visible far below at Applecross, a motorcycle ascending the pass, clouds swirling around the summit, dramatic scale. Landscape orientation, 4:3 aspect ratio. No text, watermarks, or logos.' },
  { file: 'public/images/routes/welsh-mountain-passes.jpg', category: 'routes',
    prompt: 'A motorcycle riding through the Llanberis Pass in Snowdonia Wales, steep slate rock faces on both sides, the road curving between mountain walls, green moss and ferns, atmospheric misty conditions, a sport bike with rider in full gear. Landscape orientation, 4:3 aspect ratio. No text, watermarks, or logos.' },
  { file: 'public/images/routes/lake-district-ultimate.jpg', category: 'routes',
    prompt: 'Hardknott Pass in the English Lake District, an extremely steep narrow road with hairpin bends climbing a mountainside, green fells stretching below, a motorcycle carefully navigating the 30% gradient, dramatic perspective looking down the valley, bright overcast light. Landscape orientation, 4:3 aspect ratio. No text, watermarks, or logos.' },
  { file: 'public/images/routes/channel-islands-explorer.jpg', category: 'routes',
    prompt: 'A small motorcycle on a narrow coastal lane in the Channel Islands, granite walls on one side and the sea on the other, a small fishing harbour visible below, wildflowers growing on the verge, warm summer sunshine, relaxed island atmosphere, blue sea. Landscape orientation, 4:3 aspect ratio. No text, watermarks, or logos.' },
  { file: 'public/images/routes/coastal-cornwall.jpg', category: 'routes',
    prompt: 'The Atlantic Highway coast road in Cornwall England, dramatic cliffs dropping to the sea, the road hugging the coastline with sweeping bends, Tintagel Castle ruins visible on a headland in the distance, surging waves below, warm sunset light, wildflowers on the clifftop. Landscape orientation, 4:3 aspect ratio. No text, watermarks, or logos.' },

  // Hero backgrounds (1920x800, 21:9 ultrawide)
  { file: 'public/images/heroes/homepage.jpg', category: 'heroes',
    prompt: 'A motorcycle rider on an epic British road, shot from behind showing the road ahead stretching into dramatic Highland scenery, mountains on both sides, a loch in the distance, golden hour lighting, sense of adventure and freedom, wide cinematic composition. Landscape orientation, 21:9 ultrawide aspect ratio, 1920x800 pixels. No text, watermarks, or logos.' },
  { file: 'public/images/heroes/routes.jpg', category: 'heroes',
    prompt: 'Close-up detail of a motorcycle parked on a Scottish Highland road, focus on the tank and handlebars with a dramatic mountain landscape stretching behind, chrome reflecting the sky, touring gear visible, warm light. Landscape orientation, 21:9 ultrawide aspect ratio. No text, watermarks, or logos.' },
  { file: 'public/images/heroes/destinations.jpg', category: 'heroes',
    prompt: 'Panoramic view from a mountain summit in Britain looking down at a winding road through valleys, multiple mountain ranges fading into the distance, dramatic clouds with golden light breaking through, vast sense of scale and possibility. Landscape orientation, 21:9 ultrawide aspect ratio. No text, watermarks, or logos.' },
  { file: 'public/images/heroes/planning.jpg', category: 'heroes',
    prompt: 'Overhead flat-lay of motorcycle touring preparation, a physical map of Britain spread on a dark wooden table, riding gloves, a helmet visor, a phone showing a route map, a mug of coffee, warm ambient lighting, planning atmosphere. Landscape orientation, 21:9 ultrawide aspect ratio. No text, watermarks, or logos.' },

  // Ferries (800x500)
  { file: 'public/images/ferries/condor-ferry.jpg', category: 'ferries',
    prompt: 'A high-speed catamaran ferry at sea heading toward a rocky island coastline, the Channel Islands visible in the background, blue ocean water with white wake behind the vessel, motorcycles visible on the car deck, bright sunny day. Landscape orientation, 16:9 aspect ratio. No text, watermarks, or logos.' },
  { file: 'public/images/ferries/calmac-ferry.jpg', category: 'ferries',
    prompt: 'A CalMac ferry crossing from Skye to the Scottish mainland, the vessel in the foreground with the Cuillin mountains of Skye dramatic behind, motorcycles lashed to the car deck, moody Scottish weather with clouds, dark water. Landscape orientation, 16:9 aspect ratio. No text, watermarks, or logos.' },
  { file: 'public/images/ferries/steam-packet.jpg', category: 'ferries',
    prompt: 'The Isle of Man Steam Packet ferry approaching Douglas harbour, the Victorian promenade and Tower of Refuge visible, motorcycles queued on the dockside ready to board, TT race atmosphere, summer day. Landscape orientation, 16:9 aspect ratio. No text, watermarks, or logos.' },
];

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

async function main() {
  let images = IMAGES;
  if (only) images = images.filter(i => i.category === only);

  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (const img of images) {
    if (generated >= limit) break;
    const fullPath = resolve(ROOT, img.file);

    if (existsSync(fullPath)) {
      console.log(`  SKIP ${img.file} (exists)`);
      skipped++;
      continue;
    }

    if (dryRun) {
      console.log(`  DRY ${img.file}`);
      console.log(`      ${img.prompt.substring(0, 80)}...`);
      generated++;
      continue;
    }

    console.log(`  GEN  ${img.file}...`);
    try {
      const dir = dirname(fullPath);
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

      const buffer = await generateImage(img.prompt);
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
