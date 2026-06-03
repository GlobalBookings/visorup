/**
 * Infographic Generator Agent — VisorUp
 *
 * Generates motorcycle-themed infographics as HTML, renders them to PNG via
 * Puppeteer, and stores them in data/infographics/.
 *
 * Uses Gemini for hero images and brand colours matching VisorUp theme.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import { execSync } from 'node:child_process';
import puppeteer from 'puppeteer';
import { createLogger } from '../core/logger.js';
import { sendSlack, slackHeader, slackSection, slackDivider } from '../core/slack.js';
import { generateImageBuffer } from '../utils/gemini-image.js';
import { getWorkDir } from '../utils/repo.js';

const log = createLogger('infographic-generator');

/* ── Config ─────────────────────────────────────────────────────────── */
const GH_REPO = process.env.GITHUB_REPO || 'GlobalBookings/visorup';
const GH_TOKEN = process.env.GITHUB_TOKEN;
const SITE_URL = process.env.SITE_URL || 'https://visorup.co.uk';
const LOCAL_FALLBACK = path.join(__dirname, '..', '..', '..');

/* ── Brand colours ──────────────────────────────────────────────────── */
const BRAND = {
  accent: '#D68A2D',
  dark: '#0F1413',
  card: '#1A1F1E',
  text: '#E8E6E3',
  textMuted: '#9CA3AF',
  white: '#FFFFFF',
};

/* ── Infographic definitions ────────────────────────────────────────── */
const INFOGRAPHICS = [
  {
    id: 'uk-motorcycle-roads-ranked',
    title: 'Top 15 UK Motorcycle Roads',
    subtitle: 'Ranked by rider rating with elevation, distance & scenery score',
    heroPrompt: 'Aerial view of a winding mountain road in the Scottish Highlands with a motorcycle, dramatic light, cinematic, no text',
    buildHtml: buildRoadsRanked,
  },
  {
    id: 'bike-touring-decision-tree',
    title: 'Which Touring Bike Do You Need?',
    subtitle: 'A decision flowchart for every type of UK rider',
    heroPrompt: 'Four different types of touring motorcycles lined up on a British coastal road, golden hour, no text',
    buildHtml: buildDecisionTree,
  },
  {
    id: 'nc500-illustrated-map',
    title: 'NC500 Motorcycle Route',
    subtitle: 'Every stop on the North Coast 500',
    heroPrompt: 'Dramatic Scottish Highland landscape at sunset viewed from a coastal road with a touring motorcycle, cinematic, no text',
    buildHtml: buildNC500Map,
  },
  {
    id: 'motorcycle-touring-packing-list',
    title: 'Motorcycle Touring Packing List',
    subtitle: 'Visual checklist with categories',
    heroPrompt: 'Flat lay photograph of motorcycle touring gear neatly arranged: helmet, jacket, gloves, tools, camping gear, maps, on a dark background, no text',
    buildHtml: buildPackingList,
  },
  {
    id: 'uk-biker-wildlife-hazards',
    title: 'UK Biker Hazard Guide',
    subtitle: 'Seasonal hazards every rider should know',
    heroPrompt: 'A sheep standing on a narrow British country road with a motorcycle approaching, misty morning, dramatic lighting, no text',
    buildHtml: buildHazardGuide,
  },
];

/* ── Shared CSS ─────────────────────────────────────────────────────── */
function baseCss() {
  return `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: ${BRAND.dark};
      color: ${BRAND.text};
      width: 1200px;
    }
    .header {
      position: relative;
      height: 340px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 40px;
    }
    .header img {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      object-fit: cover;
      filter: brightness(0.5);
    }
    .header h1 {
      position: relative;
      z-index: 1;
      font-size: 48px;
      font-weight: 800;
      color: ${BRAND.white};
      line-height: 1.1;
    }
    .header .subtitle {
      position: relative;
      z-index: 1;
      font-size: 20px;
      color: ${BRAND.accent};
      margin-top: 8px;
      font-weight: 600;
    }
    .content { padding: 40px; }
    .card {
      background: ${BRAND.card};
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 16px;
    }
    .accent { color: ${BRAND.accent}; }
    .muted { color: ${BRAND.textMuted}; }
    .grid { display: grid; gap: 16px; }
    .grid-2 { grid-template-columns: 1fr 1fr; }
    .grid-3 { grid-template-columns: 1fr 1fr 1fr; }
    .footer {
      background: ${BRAND.card};
      padding: 24px 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 2px solid ${BRAND.accent};
    }
    .footer .brand {
      font-size: 24px;
      font-weight: 800;
      color: ${BRAND.accent};
    }
    .footer .tagline {
      font-size: 14px;
      color: ${BRAND.textMuted};
    }
    .rank {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: ${BRAND.accent};
      color: ${BRAND.dark};
      font-weight: 800;
      font-size: 16px;
      margin-right: 12px;
      flex-shrink: 0;
    }
    .bar {
      height: 8px;
      border-radius: 4px;
      background: ${BRAND.dark};
      margin-top: 6px;
    }
    .bar-fill {
      height: 100%;
      border-radius: 4px;
      background: ${BRAND.accent};
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
    }
    th, td {
      padding: 10px 14px;
      text-align: left;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    th {
      color: ${BRAND.accent};
      font-weight: 700;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    td { font-size: 15px; }
    .icon { font-size: 24px; margin-right: 8px; }
  `;
}

function wrapHtml(css, body, heroDataUrl) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><style>${baseCss()}${css}</style></head>
<body>
${body}
<div class="footer">
  <div>
    <div class="brand">🏍️ VisorUp.com</div>
    <div class="tagline">UK Motorcycle Touring Platform</div>
  </div>
  <div class="muted">© ${new Date().getFullYear()} VisorUp</div>
</div>
</body>
</html>`;
}

/* ── Infographic 1: UK Roads Ranked ─────────────────────────────────── */
function buildRoadsRanked(heroDataUrl) {
  const roads = [
    { rank: 1, name: 'A82 Glencoe', region: 'Scotland', dist: '17 mi', elev: '350m', scenery: 98 },
    { rank: 2, name: 'Cat and Fiddle (A537)', region: 'England', dist: '7 mi', elev: '515m', scenery: 88 },
    { rank: 3, name: 'A4069 Black Mountain', region: 'Wales', dist: '12 mi', elev: '493m', scenery: 92 },
    { rank: 4, name: 'Bealach na Bà', region: 'Scotland', dist: '6 mi', elev: '626m', scenery: 97 },
    { rank: 5, name: 'Snake Pass (A57)', region: 'England', dist: '14 mi', elev: '510m', scenery: 82 },
    { rank: 6, name: 'A44 Devil\'s Staircase', region: 'Wales', dist: '10 mi', elev: '450m', scenery: 86 },
    { rank: 7, name: 'Hardknott Pass', region: 'England', dist: '2 mi', elev: '393m', scenery: 94 },
    { rank: 8, name: 'A838 Laxford Bridge', region: 'Scotland', dist: '24 mi', elev: '210m', scenery: 95 },
    { rank: 9, name: 'A470 Brecon Beacons', region: 'Wales', dist: '20 mi', elev: '440m', scenery: 84 },
    { rank: 10, name: 'B3212 Dartmoor', region: 'England', dist: '18 mi', elev: '420m', scenery: 80 },
    { rank: 11, name: 'A87 to Skye Bridge', region: 'Scotland', dist: '30 mi', elev: '280m', scenery: 93 },
    { rank: 12, name: 'Kirkstone Pass (A592)', region: 'England', dist: '5 mi', elev: '454m', scenery: 87 },
    { rank: 13, name: 'A4086 Llanberis Pass', region: 'Wales', dist: '6 mi', elev: '359m', scenery: 91 },
    { rank: 14, name: 'A9 Drumochter Pass', region: 'Scotland', dist: '18 mi', elev: '462m', scenery: 79 },
    { rank: 15, name: 'Cheddar Gorge (B3135)', region: 'England', dist: '3 mi', elev: '260m', scenery: 83 },
  ];

  const rows = roads.map(r => `
    <tr>
      <td><span class="rank">${r.rank}</span></td>
      <td><strong>${r.name}</strong><br><span class="muted">${r.region}</span></td>
      <td>${r.dist}</td>
      <td>${r.elev}</td>
      <td>
        <span class="accent">${r.scenery}/100</span>
        <div class="bar"><div class="bar-fill" style="width:${r.scenery}%"></div></div>
      </td>
    </tr>
  `).join('');

  const heroImg = heroDataUrl ? `<img src="${heroDataUrl}" alt="">` : '';
  const body = `
    <div class="header">
      ${heroImg}
      <h1>Top 15 UK Motorcycle Roads</h1>
      <div class="subtitle">Ranked by rider rating with elevation, distance & scenery score</div>
    </div>
    <div class="content">
      <table>
        <tr><th>#</th><th>Road</th><th>Distance</th><th>Elevation</th><th>Scenery</th></tr>
        ${rows}
      </table>
    </div>
  `;

  return wrapHtml('', body, heroDataUrl);
}

/* ── Infographic 2: Decision Tree ───────────────────────────────────── */
function buildDecisionTree(heroDataUrl) {
  const heroImg = heroDataUrl ? `<img src="${heroDataUrl}" alt="">` : '';
  const body = `
    <div class="header">
      ${heroImg}
      <h1>Which Touring Bike Do You Need?</h1>
      <div class="subtitle">A decision flowchart for every type of UK rider</div>
    </div>
    <div class="content">
      <div class="card" style="text-align:center;padding:32px">
        <h2 style="font-size:24px;margin-bottom:24px" class="accent">START: What's your riding style?</h2>
      </div>

      <div class="grid grid-2">
        <div class="card">
          <h3 class="accent">🛣️ Mostly Tarmac</h3>
          <p style="margin:12px 0">Do you prioritise comfort or speed?</p>
          <div class="grid grid-2" style="margin-top:16px">
            <div class="card" style="background:${BRAND.dark}">
              <h4 class="accent">Comfort</h4>
              <p style="margin:8px 0">Long distances, pillions, luggage?</p>
              <div style="margin-top:12px;padding:12px;background:${BRAND.accent};color:${BRAND.dark};border-radius:8px;text-align:center;font-weight:700">
                Full Tourer<br><span style="font-weight:400;font-size:13px">BMW R 1300 RT, Honda Gold Wing</span>
              </div>
            </div>
            <div class="card" style="background:${BRAND.dark}">
              <h4 class="accent">Speed</h4>
              <p style="margin:8px 0">Spirited B-roads, sport feel?</p>
              <div style="margin-top:12px;padding:12px;background:${BRAND.accent};color:${BRAND.dark};border-radius:8px;text-align:center;font-weight:700">
                Sport Tourer<br><span style="font-weight:400;font-size:13px">Yamaha Tracer 9 GT, Kawasaki Ninja 1000SX</span>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <h3 class="accent">🌲 Mixed Terrain</h3>
          <p style="margin:12px 0">How much off-road will you do?</p>
          <div class="grid grid-2" style="margin-top:16px">
            <div class="card" style="background:${BRAND.dark}">
              <h4 class="accent">Green Lanes</h4>
              <p style="margin:8px 0">Farm tracks, forest roads?</p>
              <div style="margin-top:12px;padding:12px;background:${BRAND.accent};color:${BRAND.dark};border-radius:8px;text-align:center;font-weight:700">
                Adventure Bike<br><span style="font-weight:400;font-size:13px">BMW R 1300 GS, Triumph Tiger 1200</span>
              </div>
            </div>
            <div class="card" style="background:${BRAND.dark}">
              <h4 class="accent">Light Trails</h4>
              <p style="margin:8px 0">Occasional gravel, mainly road?</p>
              <div style="margin-top:12px;padding:12px;background:${BRAND.accent};color:${BRAND.dark};border-radius:8px;text-align:center;font-weight:700">
                Crossover ADV<br><span style="font-weight:400;font-size:13px">Suzuki V-Strom 800, Honda CB500X</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-2" style="margin-top:16px">
        <div class="card">
          <h3 class="accent">💰 Budget Matters</h3>
          <p style="margin:12px 0">First tourer or tight budget?</p>
          <div style="margin-top:12px;padding:12px;background:${BRAND.accent};color:${BRAND.dark};border-radius:8px;text-align:center;font-weight:700">
            Budget Tourer<br><span style="font-weight:400;font-size:13px">Kawasaki Versys 650, Suzuki V-Strom 650</span>
          </div>
        </div>
        <div class="card">
          <h3 class="accent">🏍️ Solo & Light</h3>
          <p style="margin:12px 0">Minimal luggage, nimble handling?</p>
          <div style="margin-top:12px;padding:12px;background:${BRAND.accent};color:${BRAND.dark};border-radius:8px;text-align:center;font-weight:700">
            Naked Tourer<br><span style="font-weight:400;font-size:13px">Triumph Speed 400, Yamaha MT-07</span>
          </div>
        </div>
      </div>
    </div>
  `;

  return wrapHtml('', body, heroDataUrl);
}

/* ── Infographic 3: NC500 Map ───────────────────────────────────────── */
function buildNC500Map(heroDataUrl) {
  const stops = [
    { name: 'Inverness', type: 'Start/End', desc: 'Capital of the Highlands — fuel up and stock supplies' },
    { name: 'Beauly', type: 'Town', desc: 'Pretty village with great cafés and a ruined priory' },
    { name: 'Applecross', type: 'Must-Ride', desc: 'Bealach na Bà pass — the most dramatic road in Britain' },
    { name: 'Torridon', type: 'Scenery', desc: 'Jaw-dropping mountains and single-track roads' },
    { name: 'Gairloch', type: 'Fuel Stop', desc: 'Last reliable fuel before remote northwest section' },
    { name: 'Ullapool', type: 'Town', desc: 'Harbour town with fish & chips and ferry connections' },
    { name: 'Lochinver', type: 'Detour', desc: 'Stunning coastal detour via Drumbeg road' },
    { name: 'Kylesku', type: 'Scenery', desc: 'Modern bridge over dramatic fjord-like sea loch' },
    { name: 'Durness', type: 'Must-Stop', desc: 'Smoo Cave, Balnakeil Beach — northwest corner of mainland' },
    { name: 'Tongue', type: 'Scenery', desc: 'Causeway across Kyle of Tongue with mountain backdrop' },
    { name: 'Bettyhill', type: 'Town', desc: 'North coast village with Strathnaver Museum' },
    { name: 'Thurso', type: 'Town', desc: 'Most northerly mainland town — Scrabster harbour nearby' },
    { name: 'John o\' Groats', type: 'Landmark', desc: 'Iconic endpoint — photo op essential' },
    { name: 'Wick', type: 'Fuel Stop', desc: 'Last major town before heading south along east coast' },
    { name: 'Helmsdale', type: 'Town', desc: 'Fishing village with La Mirage café' },
    { name: 'Brora / Golspie', type: 'Scenery', desc: 'Coastal riding with Dunrobin Castle detour' },
    { name: 'Dornoch', type: 'Town', desc: 'Cathedral town and Dornoch Firth crossing' },
    { name: 'Tain', type: 'Town', desc: 'Glenmorangie Distillery stop for non-riding day' },
    { name: 'Inverness', type: 'End', desc: 'Loop complete — 516 miles of the best riding in Britain' },
  ];

  const rows = stops.map((s, i) => `
    <tr>
      <td style="font-weight:700;color:${BRAND.accent}">${i + 1}</td>
      <td><strong>${s.name}</strong></td>
      <td><span style="padding:3px 10px;border-radius:4px;background:${BRAND.dark};font-size:12px;font-weight:600">${s.type}</span></td>
      <td class="muted">${s.desc}</td>
    </tr>
  `).join('');

  const heroImg = heroDataUrl ? `<img src="${heroDataUrl}" alt="">` : '';
  const body = `
    <div class="header">
      ${heroImg}
      <h1>NC500 Motorcycle Route</h1>
      <div class="subtitle">Every stop on the North Coast 500 — 516 miles of Scotland's finest</div>
    </div>
    <div class="content">
      <div class="card" style="margin-bottom:24px">
        <div class="grid grid-3" style="text-align:center">
          <div>
            <div style="font-size:36px;font-weight:800" class="accent">516</div>
            <div class="muted">Miles</div>
          </div>
          <div>
            <div style="font-size:36px;font-weight:800" class="accent">5-7</div>
            <div class="muted">Days Recommended</div>
          </div>
          <div>
            <div style="font-size:36px;font-weight:800" class="accent">19</div>
            <div class="muted">Key Stops</div>
          </div>
        </div>
      </div>
      <table>
        <tr><th>#</th><th>Stop</th><th>Type</th><th>Notes</th></tr>
        ${rows}
      </table>
    </div>
  `;

  return wrapHtml('', body, heroDataUrl);
}

/* ── Infographic 4: Packing List ────────────────────────────────────── */
function buildPackingList(heroDataUrl) {
  const categories = [
    {
      icon: '🛡️', name: 'Riding Gear',
      items: ['Helmet + Pinlock', 'Jacket (waterproof)', 'Trousers (armoured)', 'Boots (waterproof)', 'Gloves (2 pairs)', 'Base layers x3', 'Neck tube / balaclava'],
    },
    {
      icon: '🔧', name: 'Tools & Spares',
      items: ['Puncture repair kit', 'Tyre pressure gauge', 'Multi-tool', 'Cable ties & duct tape', 'Chain lube', 'Spare fuses', 'Jump starter / USB charger'],
    },
    {
      icon: '⛺', name: 'Camping (if applicable)',
      items: ['Tent (lightweight)', 'Sleeping bag', 'Roll mat', 'Stove + fuel', 'Mug & spork', 'Head torch', 'Dry bags'],
    },
    {
      icon: '📱', name: 'Tech & Navigation',
      items: ['Phone mount', 'Sat nav / GPS', 'Power bank', 'USB cables', 'Intercom', 'Action camera', 'Paper map backup'],
    },
    {
      icon: '🩹', name: 'Safety & First Aid',
      items: ['First aid kit', 'Hi-vis vest', 'Disc lock + reminder', 'Bike cover', 'Insurance docs', 'Breakdown cover card', 'ICE contact card'],
    },
    {
      icon: '👕', name: 'Off-Bike Clothes',
      items: ['Casual trousers / jeans', 'T-shirts x2', 'Trainers / shoes', 'Lightweight rain jacket', 'Swim shorts (wild swimming!)', 'Warm fleece'],
    },
  ];

  const cards = categories.map(cat => `
    <div class="card">
      <h3 style="font-size:18px;margin-bottom:12px"><span class="icon">${cat.icon}</span> <span class="accent">${cat.name}</span></h3>
      <ul style="list-style:none;padding:0">
        ${cat.items.map(item => `
          <li style="padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.05);font-size:14px">
            ☐ ${item}
          </li>
        `).join('')}
      </ul>
    </div>
  `).join('');

  const heroImg = heroDataUrl ? `<img src="${heroDataUrl}" alt="">` : '';
  const body = `
    <div class="header">
      ${heroImg}
      <h1>Motorcycle Touring Packing List</h1>
      <div class="subtitle">Everything you need — nothing you don't</div>
    </div>
    <div class="content">
      <div class="grid grid-2">${cards}</div>
    </div>
  `;

  return wrapHtml('', body, heroDataUrl);
}

/* ── Infographic 5: Hazard Guide ────────────────────────────────────── */
function buildHazardGuide(heroDataUrl) {
  const hazards = [
    {
      icon: '🐑', name: 'Sheep', season: 'Year-round (peaks Mar-Oct)',
      risk: 85, advice: 'Common on moorland B-roads in Wales, Scotland, and northern England. They bolt without warning — always ride at a speed where you can stop within the road you can see.',
    },
    {
      icon: '🦌', name: 'Deer', season: 'Oct-Nov (rutting) & May-Jun (fawns)',
      risk: 75, advice: 'Dawn and dusk are highest risk. Watch for deer-crossing signs on A-roads through forested areas. Highlands and New Forest are hotspots.',
    },
    {
      icon: '🧊', name: 'Ice & Frost', season: 'Nov-Mar',
      risk: 95, advice: 'Shaded bends stay icy when the rest of the road is clear. Mountain passes freeze overnight. Check road surface temperature — if below 3°C, assume ice is present.',
    },
    {
      icon: '⚠️', name: 'Gravel & Mud', season: 'Year-round (worst Oct-Apr)',
      risk: 70, advice: 'Farm entrances, hedge cutting, and flood aftermath deposit debris on bends. Rural B-roads after rain are worst. Scan the road surface constantly.',
    },
    {
      icon: '🛢️', name: 'Diesel Spills', season: 'Year-round',
      risk: 80, advice: 'Roundabouts, fuel station approaches, and industrial estate exits are highest risk. Rainbow sheen on wet road means diesel — treat like ice. Urban and suburban roads near lorry routes are worst.',
    },
  ];

  const cards = hazards.map(h => `
    <div class="card">
      <div style="display:flex;align-items:center;margin-bottom:12px">
        <span style="font-size:40px;margin-right:16px">${h.icon}</span>
        <div>
          <h3 style="font-size:20px">${h.name}</h3>
          <div class="muted" style="font-size:13px">${h.season}</div>
        </div>
        <div style="margin-left:auto;text-align:right">
          <div style="font-size:13px;font-weight:600" class="accent">Risk Level</div>
          <div style="font-size:24px;font-weight:800" class="accent">${h.risk}%</div>
        </div>
      </div>
      <div class="bar" style="margin-bottom:12px"><div class="bar-fill" style="width:${h.risk}%"></div></div>
      <p style="font-size:14px;line-height:1.5">${h.advice}</p>
    </div>
  `).join('');

  const heroImg = heroDataUrl ? `<img src="${heroDataUrl}" alt="">` : '';
  const body = `
    <div class="header">
      ${heroImg}
      <h1>UK Biker Hazard Guide</h1>
      <div class="subtitle">Seasonal hazards every rider should know</div>
    </div>
    <div class="content">${cards}</div>
  `;

  return wrapHtml('', body, heroDataUrl);
}

/* ── Render HTML → PNG ──────────────────────────────────────────────── */
async function renderToPng(html, outputPath) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Get full page height
    const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
    await page.setViewport({ width: 1200, height: bodyHeight });

    await page.screenshot({ path: outputPath, fullPage: true, type: 'png' });
    log.info(`Rendered infographic: ${outputPath}`);
  } finally {
    await browser.close();
  }
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

/* ── Publish as guide page ───────────────────────────────────────────── */
function buildArticleContent(info, pngPublicPath) {
  const embedCode = `<a href="${SITE_URL}/guides/${info.id}"><img src="${SITE_URL}/${pngPublicPath}" alt="${info.title}" style="max-width:100%;height:auto;" /></a>\n<p>Source: <a href="${SITE_URL}" rel="follow">VisorUp.co.uk</a> — UK Motorcycle Touring</p>`;
  const escapedEmbed = embedCode.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  return `<div style="text-align:center;margin-bottom:32px">
  <img src="/${pngPublicPath}" alt="${info.title} — ${info.subtitle}" style="max-width:100%;height:auto;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.3)" />
</div>

<h2>${info.title}</h2>
<p>${info.subtitle}. Created by <a href="${SITE_URL}">VisorUp</a> — the UK's motorcycle touring platform.</p>
<p>Feel free to share this infographic on your website, blog, or forum. Just use the embed code below — it includes a link back to VisorUp so your readers can explore more.</p>

<h3>Embed This Infographic</h3>
<p>Copy and paste this HTML code into your site:</p>
<div style="position:relative;margin:16px 0 32px">
  <pre style="background:#1A1F1E;border:1px solid #2a302e;border-radius:8px;padding:16px 48px 16px 16px;overflow-x:auto;font-size:13px;line-height:1.6;color:#c5ccc9;white-space:pre-wrap;word-break:break-all"><code>${escapedEmbed}</code></pre>
  <button onclick="navigator.clipboard.writeText(this.parentElement.querySelector('code').textContent.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'\\&quot;'));this.textContent='Copied!';setTimeout(()=>this.textContent='Copy',2000)" style="position:absolute;top:8px;right:8px;background:#D68A2D;color:#0F1413;border:none;border-radius:6px;padding:6px 14px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit">Copy</button>
</div>

<div style="background:#1A1F1E;border:1px solid #2a302e;border-radius:12px;padding:20px;margin:24px 0">
  <h4 style="color:#D68A2D;margin:0 0 8px;font-size:14px">Preview of embed:</h4>
  <a href="${SITE_URL}/guides/${info.id}"><img src="/${pngPublicPath}" alt="${info.title}" style="max-width:100%;height:auto;border-radius:8px" /></a>
  <p style="font-size:12px;color:#7a8a85;margin:8px 0 0">Source: <a href="${SITE_URL}" style="color:#D68A2D">VisorUp.co.uk</a> — UK Motorcycle Touring</p>
</div>`;
}

function writeArticleFile(articlesDir, slug, content) {
  const filePath = path.join(articlesDir, `${slug}.js`);
  const fileContent = `export const content = \`${content.replace(/`/g, '\\`')}\`;\n`;
  fs.writeFileSync(filePath, fileContent, 'utf-8');
  return filePath;
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

function parseExistingSlugs(indexPath) {
  try {
    const src = fs.readFileSync(indexPath, 'utf-8');
    const slugs = [...src.matchAll(/"slug"\s*:\s*"([^"]+)"/g)].map(m => m[1]);
    return new Set(slugs);
  } catch { return new Set(); }
}

/* ── Main run ───────────────────────────────────────────────────────── */
export async function run() {
  log.info('Infographic Generator starting');

  const WORK_DIR = getWorkDir(LOCAL_FALLBACK);
  log.info(`Working directory: ${WORK_DIR}`);

  const outputDir = path.join(WORK_DIR, 'data', 'infographics');
  const publicImgDir = path.join(WORK_DIR, 'public', 'images', 'infographics');
  const articlesDir = path.join(WORK_DIR, 'articles');
  const articlesIndex = path.join(WORK_DIR, 'articles.js');

  fs.mkdirSync(outputDir, { recursive: true });
  fs.mkdirSync(publicImgDir, { recursive: true });

  const existingSlugs = parseExistingSlugs(articlesIndex);

  const results = [];
  const changedFiles = [];

  for (const info of INFOGRAPHICS) {
    // Skip if already published as a guide
    if (existingSlugs.has(info.id)) {
      log.info(`Skipping ${info.id} — already published`);
      continue;
    }

    const outputPath = path.join(outputDir, `${info.id}.png`);
    const publicPngPath = path.join(publicImgDir, `${info.id}.png`);

    log.info(`Generating: ${info.title}`);

    try {
      // Generate hero image via Gemini
      let heroDataUrl = null;
      const imgResult = await generateImageBuffer(info.heroPrompt);
      if (imgResult) {
        heroDataUrl = `data:${imgResult.mimeType};base64,${imgResult.buffer.toString('base64')}`;
      }

      // Build HTML infographic
      const html = info.buildHtml(heroDataUrl);

      // Save HTML for reference
      const htmlPath = path.join(outputDir, `${info.id}.html`);
      fs.writeFileSync(htmlPath, html, 'utf-8');

      // Render to PNG
      await renderToPng(html, outputPath);

      // Copy PNG to public dir for the site
      fs.copyFileSync(outputPath, publicPngPath);

      const pngPublicPath = `public/images/infographics/${info.id}.png`;

      // Create article content with embed code
      const articleContent = buildArticleContent(info, pngPublicPath);
      writeArticleFile(articlesDir, info.id, articleContent);

      // Add to articles.js
      const metadata = {
        slug: info.id,
        category: 'Guides',
        title: info.title + ' [Infographic]',
        metaDescription: `${info.subtitle}. Free to share — embed code included. By VisorUp.`,
        heroImage: pngPublicPath,
        author: 'VisorUp Team',
        publishDate: new Date().toISOString().split('T')[0],
        readTime: '2 min read',
        tags: ['infographic', 'shareable'],
        relatedSlugs: [],
        affiliateLinks: [],
      };
      appendToArticlesIndex(articlesIndex, metadata);

      changedFiles.push(
        `articles/${info.id}.js`,
        'articles.js',
        pngPublicPath,
      );

      results.push({ id: info.id, title: info.title, url: `${SITE_URL}/guides/${info.id}` });
      log.info(`Published: ${info.title} -> /guides/${info.id}`);
    } catch (err) {
      log.error(`Failed to generate ${info.id}: ${err.message}`);
    }
  }

  if (!results.length) {
    log.info('No new infographics to publish');
    return;
  }

  // Commit and push
  const sha = gitCommitAndPush(
    WORK_DIR,
    changedFiles,
    `content: publish ${results.length} infographic(s) as guide pages`,
  );

  // Slack report
  const blocks = [
    slackHeader('Infographic Generator — VisorUp'),
    slackSection(
      `Published *${results.length}* infographic(s) as shareable guide pages` +
      (sha ? ` • commit \`${sha}\`` : ''),
    ),
    slackDivider(),
    ...results.map(r => slackSection(`*${r.title}*\n${r.url}\n_Embed code included on page_`)),
  ];

  await sendSlack(blocks, `Infographic Generator: ${results.length} published`);

  log.info(`Infographic Generator complete — ${results.length} infographic(s) published`);
}
