/**
 * Generate data-driven buying-guide articles from the real catalogue.
 * Output: buying-guides.js  (ARTICLES.push(...) — loaded after articles.js)
 * Each guide embeds real product cards (image, live price, direct affiliate
 * link) plus populates the article affiliateLinks sidebar.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SHOP_DIR = path.join(__dirname, '..', 'public', 'data', 'shop');
const load = (cat) => JSON.parse(fs.readFileSync(path.join(SHOP_DIR, cat + '.json'), 'utf8'));

const has = (p, ...kw) => { const n = p.name.toLowerCase(); return kw.some((k) => n.includes(k)); };
const not = (p, ...kw) => { const n = p.name.toLowerCase(); return !kw.some((k) => n.includes(k)); };
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const money = (n) => '£' + (Math.round(n * 100) / 100).toLocaleString('en-GB');

// Minimum sensible price per category — filters out mis-categorised spares/accessories.
const FLOORS = { helmets: 60, jackets: 45, trousers: 45, gloves: 18, boots: 50, luggage: 25, electronics: 20 };

// Select a price-varied, popularity-ranked shortlist.
function selectProducts(items, filterFn, n = 8, floor = 0) {
  const matched = items.filter((p) => p.priceNum >= floor && filterFn(p));
  const rank = (a, b) => (b.colourCount - a.colourCount) || (b.priceNum - a.priceNum);
  const premium = matched.filter((p) => p.priceNum >= 400).sort(rank);
  const mid = matched.filter((p) => p.priceNum >= 150 && p.priceNum < 400).sort(rank);
  const budget = matched.filter((p) => p.priceNum < 150).sort(rank);
  const out = [];
  const want = [[premium, 3], [mid, 3], [budget, 2]];
  for (const [arr, count] of want) out.push(...arr.slice(0, count));
  // Top up to n from remaining matched by rank
  if (out.length < n) {
    const rest = matched.filter((p) => !out.includes(p)).sort(rank);
    out.push(...rest.slice(0, n - out.length));
  }
  return out.slice(0, n).sort((a, b) => b.priceNum - a.priceNum);
}

function tierWord(p) {
  if (p.priceNum >= 400) return 'premium';
  if (p.priceNum >= 150) return 'mid-range';
  return 'budget';
}

function productCard(p, blurb) {
  const colours = p.colourCount > 1 ? ` <span class="bg-prod-col">${p.colourCount} colours</span>` : '';
  return '' +
  '<div class="bg-prod">' +
    `<a href="${p.affiliateUrl}" target="_blank" rel="noopener sponsored" class="bg-prod-img"><img src="${p.thumb}" alt="${esc(p.name)}" loading="lazy" onerror="var x=this.closest('.bg-prod-img'); if(x) x.style.display='none';"></a>` +
    '<div class="bg-prod-info">' +
      `<span class="bg-prod-brand">${esc(p.brand)}</span>` +
      `<a href="${p.affiliateUrl}" target="_blank" rel="noopener sponsored" class="bg-prod-name">${esc(p.name)}</a>${colours}` +
      `<p class="bg-prod-blurb">${blurb}</p>` +
      `<div class="bg-prod-foot"><span class="bg-prod-price">${esc(p.price)}</span>` +
      `<a href="${p.affiliateUrl}" target="_blank" rel="noopener sponsored" class="bg-prod-btn">Check price <i class="fas fa-arrow-right"></i></a></div>` +
    '</div>' +
  '</div>';
}

// Per-product blurb generated from real attributes.
function blurbFor(base, p) {
  const tier = tierWord(p);
  const b = p.brand;
  const lines = {
    helmets: {
      premium: `${b}'s flagship lid — top-tier shell, refined ventilation and the quiet comfort that makes long touring days effortless.`,
      'mid-range': `A superb all-rounder from ${b} with the features most UK tourers actually need, at a sensible price.`,
      budget: `Outstanding value from ${b} — proper protection and everyday comfort without stretching the budget.`,
    },
    jackets: {
      premium: `${b}'s premium touring shell — serious weather protection and CE armour for riders who do big miles in all conditions.`,
      'mid-range': `Well-equipped ${b} jacket that balances weatherproofing, protection and price beautifully.`,
      budget: `Brilliant entry-level armour from ${b} — keeps you protected and dry without the premium price tag.`,
    },
    trousers: {
      premium: `${b}'s top-tier riding trousers with the protection and weatherproofing for genuine all-day, all-weather touring.`,
      'mid-range': `Comfortable, protective ${b} trousers that pair perfectly with a touring jacket.`,
      budget: `Great-value ${b} trousers delivering CE protection at an accessible price.`,
    },
    gloves: {
      premium: `${b}'s premium gloves — supple, protective and built to last season after season.`,
      'mid-range': `A dependable ${b} glove with the protection and feel that tourers rate highly.`,
      budget: `Excellent budget ${b} gloves that punch well above their price for everyday riding.`,
    },
    boots: {
      premium: `${b}'s flagship boot — serious ankle protection, all-day comfort and proven waterproofing.`,
      'mid-range': `A versatile ${b} boot that walks as well as it rides — ideal for touring.`,
      budget: `Solid value from ${b} with the waterproofing and protection that matter most.`,
    },
    luggage: {
      premium: `${b}'s premium luggage — rugged, secure and built for big-mileage touring.`,
      'mid-range': `Practical ${b} luggage that carries your kit safely and fits a wide range of bikes.`,
      budget: `Affordable ${b} luggage that does the job without the premium outlay.`,
    },
    electronics: {
      premium: `${b}'s top-spec unit — the features and range that make it a tourer favourite.`,
      'mid-range': `A capable ${b} option with the core features most riders want.`,
      budget: `Great-value ${b} tech to upgrade your ride affordably.`,
    },
  };
  return (lines[base] && lines[base][tier]) || `Quality ${b} kit at a ${tier} price.`;
}

// Category-level buying tips + FAQs (reused, with the topic spliced in).
const TIPS = {
  helmets: [
    '<strong>Fit first.</strong> The safest helmet is one that fits your head shape snugly with no pressure points — try several brands before buying.',
    '<strong>Look for ECE 22.06.</strong> The current safety standard includes rotational-impact testing. A high SHARP star rating is a useful extra guide.',
    '<strong>Pinlock-ready visor.</strong> Essential for the UK — a Pinlock insert stops fogging on cold, damp mornings.',
    '<strong>Weight matters.</strong> Under ~1,600g keeps neck fatigue down on long days. Composite and carbon shells are lighter than polycarbonate.',
  ],
  jackets: [
    '<strong>Laminated beats drop-liner.</strong> A bonded waterproof membrane keeps the outer from soaking through and chilling you in sustained rain.',
    '<strong>CE Level 2 armour.</strong> Insist on shoulder and elbow protectors, and budget for a back protector if one is not included.',
    '<strong>Layering system.</strong> A removable thermal liner turns one jacket into a three-season solution for British weather.',
    '<strong>Connection zip.</strong> A jacket-to-trouser zip stops your kit separating in a slide — buy matching pieces where possible.',
  ],
  trousers: [
    '<strong>Match your jacket.</strong> A 360° connection zip keeps your suit together in a crash — stick to one brand range where you can.',
    '<strong>Knee and hip armour.</strong> CE Level 2 at the knees is the minimum; hip protectors matter in low-speed falls too.',
    '<strong>Boot gaiters.</strong> Internal gaiters seal over your boots and stop rain running into your footwear.',
    '<strong>Riding-position fit.</strong> Always try trousers seated — check the waist, knee articulation and length in your riding posture.',
  ],
  gloves: [
    '<strong>Knuckle and palm protection.</strong> Look for hard or moulded knuckle armour and palm sliders that resist abrasion.',
    '<strong>Waterproofing.</strong> A membrane like Gore-Tex or Drystar keeps hands dry — vital for safe control in UK rain.',
    '<strong>Fit and feel.</strong> Gloves should be snug with no loose fingertips so you keep full control of the levers.',
    '<strong>Season-specific.</strong> Vented summer gloves and insulated winter gloves do very different jobs — many tourers own both.',
  ],
  boots: [
    '<strong>Ankle protection.</strong> Rigid ankle cups and a torsion-control sole protect the joints most at risk in a fall.',
    '<strong>Waterproof membrane.</strong> Your feet sit lowest on the bike — a Gore-Tex or equivalent liner is essential in the UK.',
    '<strong>Walk test them.</strong> Touring means walking too — choose a sole flexible enough for castles, pubs and fuel stops.',
    '<strong>Break them in.</strong> Wear new boots around the house and on short rides before committing to a big tour.',
  ],
  luggage: [
    '<strong>Mounting system.</strong> Check fitment for your bike — many panniers need brand-specific frames or holders.',
    '<strong>Waterproofing.</strong> Either a fully sealed roll-top design or a supplied rain cover keeps your kit dry.',
    '<strong>Capacity vs handling.</strong> More litres is not always better — heavy, wide luggage affects how the bike steers.',
    '<strong>Security.</strong> Lockable hard cases deter opportunists; quick-release systems let you take luggage with you.',
  ],
  electronics: [
    '<strong>Range and mesh.</strong> Mesh intercoms keep groups connected over far greater distances than basic Bluetooth pairs.',
    '<strong>Battery life.</strong> Look for all-day talk time if you do long touring days between charges.',
    '<strong>Helmet compatibility.</strong> Check speaker depth and clamp style suit your lid before buying.',
    '<strong>Weatherproofing.</strong> Any unit you fit to a bike needs to shrug off British rain.',
  ],
};

function faqBlock(topicLabel, base, stats) {
  const qs = [];
  qs.push([`How much should I spend on ${topicLabel.toLowerCase()}?`,
    `Our catalogue spans ${money(stats.min)} to ${money(stats.max)}. Budget options under £150 cover the essentials, the £150–£400 mid-range hits the sweet spot for most UK tourers, and premium picks above £400 add refinement, lighter materials and longer-term durability.`]);
  qs.push([`Which brands are worth considering?`,
    `Popular, well-reviewed brands in this category include ${stats.brands.join(', ')}. All are stocked by SportsBikeShop with UK warranty support.`]);
  if (base === 'helmets') qs.push(['Are expensive helmets actually safer?', 'Not necessarily — every road-legal helmet meets the same ECE 22.06 standard. You pay more for lighter materials, lower noise, better ventilation and comfort features, not a higher safety floor. Always prioritise correct fit.']);
  else if (base === 'jackets' || base === 'trousers') qs.push(['Textile or leather?', 'Textile is the practical all-weather choice for UK touring thanks to waterproof membranes and thermal liners. Leather offers the best abrasion resistance for spirited, dry-weather sport touring. Many riders own both.']);
  else if (base === 'boots' || base === 'gloves') qs.push(['Do I really need waterproof kit?', 'In the UK, yes. Cold, wet hands and feet impair control and concentration within minutes. A waterproof membrane is one of the best touring upgrades you can make.']);
  else qs.push(['Will this fit my bike?', 'Always check fitment before buying — some luggage and accessories need bike-specific mounts. SportsBikeShop lists compatibility on each product page.']);
  return '<h2>Frequently asked questions</h2>' + qs.map(([q, a]) =>
    `<h3>${esc(q)}</h3><p>${a}</p>`).join('');
}

function buildContent(cfg, products, allCount) {
  const base = cfg.base;
  const prices = products.map((p) => p.priceNum);
  const brandsAll = [...new Set(products.map((p) => p.brand))];
  const stats = {
    min: Math.min(...prices), max: Math.max(...prices),
    brands: brandsAll.slice(0, 6),
  };
  const cheapest = products.reduce((a, b) => (b.priceNum < a.priceNum ? b : a));
  const dearest = products.reduce((a, b) => (b.priceNum > a.priceNum ? b : a));

  let html = '';
  html += `<p>${cfg.intro}</p>`;
  html += `<p>To build this guide we sifted through <strong>${allCount.toLocaleString()} ${cfg.noun}</strong> in the SportsBikeShop range and shortlisted ${products.length} standouts across every budget — from the <strong>${esc(cheapest.brand)} ${esc(cheapest.name)}</strong> at ${esc(cheapest.price)} to the <strong>${esc(dearest.brand)} ${esc(dearest.name)}</strong> at ${esc(dearest.price)}. Prices are live and every link goes straight to the product page.</p>`;
  html += `<p class="bg-disclosure"><i class="fas fa-circle-info"></i> VisorUp may earn a commission on purchases made through the links below, at no extra cost to you. This is how we keep our route tools and guides free.</p>`;

  html += `<h2>The best ${cfg.shortLabel} at a glance</h2>`;
  html += '<div class="bg-products">';
  for (const p of products) html += productCard(p, p.desc ? esc(p.desc) : blurbFor(base, p));
  html += '</div>';

  html += `<h2>What to look for in ${cfg.shortLabel}</h2><ul>`;
  for (const t of (TIPS[base] || [])) html += `<li>${t}</li>`;
  html += '</ul>';

  html += faqBlock(cfg.shortLabel, base, stats);

  html += `<h2>Where to buy</h2><p>Every product above is available from <strong>SportsBikeShop</strong> with free UK delivery and 365-day returns. Browse the full range in our <a href="/shop/${cfg.shopSlug}">${cfg.shortLabel} shop</a>, or take our <a href="/gear">Gear Finder quiz</a> for personalised recommendations based on your riding style, the weather you ride in and your budget.</p>`;

  return html;
}

// --- Guide definitions ---
const helmets = load('helmets');
const jackets = load('jackets');
const trousers = load('trousers');
const gloves = load('gloves');
const boots = load('boots');
const luggage = load('luggage');
const electronics = load('electronics');

const isFullFace = (p) => not(p, 'modular', 'flip', 'open face', ' jet', 'adventure', 'adv', 'tour-x', 'hornet', 'peak');
const isModular = (p) => has(p, 'modular', 'flip');
const isAdvHelmet = (p) => has(p, 'adventure', 'adv', 'tour-x', 'tourx', 'hornet', 'explorer', 'rally', 'peak', 'dual');

const GUIDES = [
  // Helmets
  { slug: 'best-motorcycle-helmets-uk-2026', base: 'helmets', items: helmets, filter: () => true,
    title: 'Best Motorcycle Helmets UK 2026: Top Picks at Every Budget',
    noun: 'helmets', shortLabel: 'motorcycle helmets', shopSlug: 'helmets', hero: 'best-touring-helmets-uk',
    related: ['best-touring-helmets-uk', 'modular-helmets-guide', 'full-face-helmets-touring'],
    intro: 'The right helmet is the single most important piece of kit you will buy. We have pulled together the best motorcycle helmets on sale in the UK for 2026, with picks to suit every head shape, riding style and budget.' },
  { slug: 'best-modular-flip-up-helmets-uk-2026', base: 'helmets', items: helmets, filter: isModular,
    title: 'Best Modular (Flip-Up) Motorcycle Helmets UK 2026',
    noun: 'helmets', shortLabel: 'modular helmets', shopSlug: 'helmets', hero: 'modular-helmets-guide',
    related: ['modular-helmets-guide', 'best-touring-helmets-uk', 'motorcycle-intercom-systems'],
    intro: 'Flip-up convenience without losing full-face protection — modular helmets are the touring rider\'s favourite. These are the best modular lids you can buy in the UK right now.' },
  { slug: 'best-adventure-helmets-uk-2026', base: 'helmets', items: helmets, filter: isAdvHelmet,
    title: 'Best Adventure & Dual-Sport Helmets UK 2026',
    noun: 'helmets', shortLabel: 'adventure helmets', shopSlug: 'helmets', hero: 'adventure-helmets-review',
    related: ['adventure-helmets-review', 'adventure-motorcycle-boots', 'best-touring-helmets-uk'],
    intro: 'Peak up, visor down, ready for anything — adventure helmets bridge road and trail. Here are the best ADV and dual-sport helmets for mixed-terrain UK riding.' },
  { slug: 'best-full-face-helmets-uk-2026', base: 'helmets', items: helmets, filter: isFullFace,
    title: 'Best Full-Face Motorcycle Helmets UK 2026',
    noun: 'helmets', shortLabel: 'full-face helmets', shopSlug: 'helmets', hero: 'full-face-helmets-touring',
    related: ['full-face-helmets-touring', 'best-touring-helmets-uk', 'helmet-visor-inserts-guide'],
    intro: 'For outright protection and the quietest, most aerodynamic ride, nothing beats a full-face helmet. These are our top full-face picks for UK riders in 2026.' },
  { slug: 'best-budget-motorcycle-helmets-uk', base: 'helmets', items: helmets, filter: (p) => p.priceNum < 150,
    title: 'Best Budget Motorcycle Helmets UK (Under £150)',
    noun: 'helmets', shortLabel: 'budget helmets', shopSlug: 'helmets', hero: 'helmet-visor-inserts-guide',
    related: ['best-touring-helmets-uk', 'full-face-helmets-touring', 'modular-helmets-guide'],
    intro: 'A tight budget does not mean compromising on safety — every road-legal helmet meets the same ECE standard. These are the best motorcycle helmets you can buy in the UK for under £150.' },
  // Jackets
  { slug: 'best-motorcycle-jackets-uk-2026', base: 'jackets', items: jackets, filter: () => true,
    title: 'Best Motorcycle Jackets UK 2026: Touring, Adventure & All-Weather',
    noun: 'jackets', shortLabel: 'motorcycle jackets', shopSlug: 'jackets', hero: 'textile-touring-jackets',
    related: ['textile-touring-jackets', 'waterproof-motorcycle-jackets', 'winter-motorcycle-jackets'],
    intro: 'From summer mesh to four-season laminates, the right jacket keeps you protected and comfortable whatever the British weather throws at you. Here are the best motorcycle jackets on sale in the UK for 2026.' },
  { slug: 'best-waterproof-motorcycle-jackets-uk-2026', base: 'jackets', items: jackets,
    filter: (p) => has(p, 'waterproof', 'gore-tex', 'gore tex', 'gtx', 'laminat', 'membrane', 'h2o', 'aqua', 'drystar'),
    title: 'Best Waterproof Motorcycle Jackets UK 2026',
    noun: 'jackets', shortLabel: 'waterproof jackets', shopSlug: 'jackets', hero: 'waterproof-motorcycle-jackets',
    related: ['waterproof-motorcycle-jackets', 'textile-touring-jackets', 'motorcycle-rain-gear'],
    intro: 'In a country that rains 150-plus days a year, a genuinely waterproof jacket is essential touring kit. These are the best waterproof motorcycle jackets for staying dry on British roads.' },
  { slug: 'best-summer-mesh-motorcycle-jackets-uk', base: 'jackets', items: jackets,
    filter: (p) => has(p, 'mesh', ' air', 'summer', 'ventilat', 'vented'),
    title: 'Best Summer & Mesh Motorcycle Jackets UK 2026',
    noun: 'jackets', shortLabel: 'summer jackets', shopSlug: 'jackets', hero: 'summer-motorcycle-jackets',
    related: ['summer-motorcycle-jackets', 'summer-motorcycle-gloves', 'textile-touring-jackets'],
    intro: 'When the sun finally shows up, a mesh jacket keeps the air flowing without sacrificing armour. Here are the best summer and mesh motorcycle jackets for warm-weather UK riding.' },
  { slug: 'best-winter-motorcycle-jackets-uk-2026', base: 'jackets', items: jackets,
    filter: (p) => has(p, 'winter', 'thermal', 'gore-tex', 'gtx', 'laminat', 'h2o'),
    title: 'Best Winter Motorcycle Jackets UK 2026',
    noun: 'jackets', shortLabel: 'winter jackets', shopSlug: 'jackets', hero: 'winter-motorcycle-jackets',
    related: ['winter-motorcycle-jackets', 'winter-motorcycle-gloves', 'heated-motorcycle-gloves'],
    intro: 'Cold kills concentration. A warm, windproof, waterproof jacket is your first defence against the British winter. These are the best winter motorcycle jackets you can buy.' },
  { slug: 'best-leather-motorcycle-jackets-uk', base: 'jackets', items: jackets,
    filter: (p) => has(p, 'leather'),
    title: 'Best Leather Motorcycle Jackets UK 2026',
    noun: 'jackets', shortLabel: 'leather jackets', shopSlug: 'jackets', hero: 'textile-touring-jackets',
    related: ['textile-touring-jackets', 'leather-motorcycle-trousers', 'summer-motorcycle-jackets'],
    intro: 'For timeless style and the best abrasion resistance money can buy, leather still rules. Here are the best leather motorcycle jackets on sale in the UK for 2026.' },
  // Trousers
  { slug: 'best-motorcycle-jeans-uk-2026', base: 'trousers', items: trousers,
    filter: (p) => has(p, 'jean', 'denim'),
    title: 'Best Motorcycle Jeans UK 2026: Protective Riding Denim',
    noun: 'riding jeans', shortLabel: 'motorcycle jeans', shopSlug: 'trousers', hero: 'motorcycle-riding-jeans',
    related: ['motorcycle-riding-jeans', 'textile-touring-trousers', 'knee-armour-guide'],
    intro: 'Modern riding jeans look like premium denim but pack aramid fibres and CE armour. These are the best motorcycle jeans for riders who want protection without looking like they stepped off a racetrack.' },
  { slug: 'best-textile-motorcycle-trousers-uk', base: 'trousers', items: trousers,
    filter: (p) => has(p, 'textile', 'waterproof', 'gore-tex', 'gtx', 'laminat', 'touring', 'h2o') && not(p, 'jean', 'denim', 'leather'),
    title: 'Best Textile Motorcycle Trousers UK 2026',
    noun: 'trousers', shortLabel: 'textile trousers', shopSlug: 'trousers', hero: 'textile-touring-trousers',
    related: ['textile-touring-trousers', 'textile-touring-jackets', 'waterproof-motorcycle-boots'],
    intro: 'Waterproof, armoured and built for all-day comfort, textile trousers are the all-weather touring essential for your lower half. Here are the best on sale in the UK.' },
  { slug: 'best-leather-motorcycle-trousers-uk', base: 'trousers', items: trousers,
    filter: (p) => has(p, 'leather'),
    title: 'Best Leather Motorcycle Trousers & Jeans UK 2026',
    noun: 'trousers', shortLabel: 'leather trousers', shopSlug: 'trousers', hero: 'leather-motorcycle-trousers',
    related: ['leather-motorcycle-trousers', 'motorcycle-riding-jeans', 'textile-touring-trousers'],
    intro: 'For sport-touring pace and the ultimate slide protection, leather trousers are hard to beat. These are the best leather motorcycle trousers and jeans you can buy in the UK.' },
  // Gloves
  { slug: 'best-motorcycle-gloves-uk-2026', base: 'gloves', items: gloves, filter: () => true,
    title: 'Best Motorcycle Gloves UK 2026: Summer, Winter & Waterproof',
    noun: 'gloves', shortLabel: 'motorcycle gloves', shopSlug: 'gloves', hero: 'waterproof-motorcycle-gloves',
    related: ['waterproof-motorcycle-gloves', 'winter-motorcycle-gloves', 'summer-motorcycle-gloves'],
    intro: 'Your hands need protection, feel and weatherproofing in equal measure. We have rounded up the best motorcycle gloves on sale in the UK for 2026, for every season and budget.' },
  { slug: 'best-waterproof-motorcycle-gloves-uk', base: 'gloves', items: gloves,
    filter: (p) => has(p, 'waterproof', 'gore-tex', 'gtx', 'membrane', 'drystar', 'h2o', 'aqua'),
    title: 'Best Waterproof Motorcycle Gloves UK 2026',
    noun: 'gloves', shortLabel: 'waterproof gloves', shopSlug: 'gloves', hero: 'waterproof-motorcycle-gloves',
    related: ['waterproof-motorcycle-gloves', 'winter-motorcycle-gloves', 'motorcycle-rain-gear'],
    intro: 'Cold, wet hands ruin a ride and compromise control. These waterproof motorcycle gloves keep your hands dry and working whatever the forecast.' },
  { slug: 'best-winter-motorcycle-gloves-uk', base: 'gloves', items: gloves,
    filter: (p) => has(p, 'winter', 'thermal', 'heated'),
    title: 'Best Winter Motorcycle Gloves UK 2026',
    noun: 'gloves', shortLabel: 'winter gloves', shopSlug: 'gloves', hero: 'winter-motorcycle-gloves',
    related: ['winter-motorcycle-gloves', 'heated-motorcycle-gloves', 'winter-motorcycle-jackets'],
    intro: 'When temperatures drop, warm hands keep you safe and in control. Here are the best winter and heated motorcycle gloves for cold-weather UK riding.' },
  { slug: 'best-summer-motorcycle-gloves-uk', base: 'gloves', items: gloves,
    filter: (p) => has(p, 'summer', 'mesh', 'short', 'vented', ' air') && not(p, 'winter'),
    title: 'Best Summer Motorcycle Gloves UK 2026',
    noun: 'gloves', shortLabel: 'summer gloves', shopSlug: 'gloves', hero: 'summer-motorcycle-gloves',
    related: ['summer-motorcycle-gloves', 'summer-motorcycle-jackets', 'waterproof-motorcycle-gloves'],
    intro: 'Ventilated, lightweight and protective — the right summer gloves keep your hands cool without leaving them exposed. These are our top picks for warm-weather riding.' },
  // Boots
  { slug: 'best-motorcycle-boots-uk-2026', base: 'boots', items: boots, filter: () => true,
    title: 'Best Motorcycle Boots UK 2026: Touring, Adventure & Waterproof',
    noun: 'boots', shortLabel: 'motorcycle boots', shopSlug: 'boots', hero: 'touring-motorcycle-boots',
    related: ['touring-motorcycle-boots', 'adventure-motorcycle-boots', 'waterproof-motorcycle-boots'],
    intro: 'Protective, waterproof and comfortable enough to walk in — the best touring boots do it all. Here are our top motorcycle boot picks for UK riders in 2026.' },
  { slug: 'best-adventure-motorcycle-boots-uk', base: 'boots', items: boots,
    filter: (p) => has(p, 'adventure', 'adv', 'off-road', 'enduro', 'rally', 'dirt'),
    title: 'Best Adventure Motorcycle Boots UK 2026',
    noun: 'boots', shortLabel: 'adventure boots', shopSlug: 'boots', hero: 'adventure-motorcycle-boots',
    related: ['adventure-motorcycle-boots', 'touring-motorcycle-boots', 'adventure-helmets-review'],
    intro: 'Tougher soles, taller shafts and serious shin protection — adventure boots handle green lanes and tarmac alike. These are the best ADV boots for UK riding.' },
  { slug: 'best-waterproof-motorcycle-boots-uk', base: 'boots', items: boots,
    filter: (p) => has(p, 'waterproof', 'gore-tex', 'gtx', 'drystar', 'h2o', 'wp', 'd-wp'),
    title: 'Best Waterproof Motorcycle Boots UK 2026',
    noun: 'boots', shortLabel: 'waterproof boots', shopSlug: 'boots', hero: 'waterproof-motorcycle-boots',
    related: ['waterproof-motorcycle-boots', 'touring-motorcycle-boots', 'motorcycle-rain-gear'],
    intro: 'Your boots sit at the lowest point of the bike, catching every puddle and spray. These waterproof motorcycle boots keep your feet bone-dry on British tours.' },
  // Luggage
  { slug: 'best-motorcycle-panniers-uk-2026', base: 'luggage', items: luggage,
    filter: (p) => has(p, 'pannier') && not(p, 'holder', 'bracket', 'fitting', 'frame', 'inner', 'rack', 'plate'),
    title: 'Best Motorcycle Panniers UK 2026: Hard & Soft Luggage',
    noun: 'panniers', shortLabel: 'motorcycle panniers', shopSlug: 'luggage', hero: 'motorcycle-panniers-guide',
    related: ['motorcycle-panniers-guide', 'motorcycle-luggage-systems', 'tank-bags-touring'],
    intro: 'Panniers turn any bike into a tourer. Whether you want lockable hard cases or lightweight soft throwovers, here are the best motorcycle panniers on sale in the UK.' },
  { slug: 'best-motorcycle-tank-bags-uk', base: 'luggage', items: luggage,
    filter: (p) => has(p, 'tank bag', 'tankbag'),
    title: 'Best Motorcycle Tank Bags UK 2026',
    noun: 'tank bags', shortLabel: 'tank bags', shopSlug: 'luggage', hero: 'tank-bags-touring',
    related: ['tank-bags-touring', 'motorcycle-luggage-systems', 'motorcycle-panniers-guide'],
    intro: 'Keep your essentials, phone and maps within easy reach with a quality tank bag. These are the best motorcycle tank bags for UK touring in 2026.' },
  { slug: 'best-motorcycle-luggage-uk-2026', base: 'luggage', items: luggage,
    filter: (p) => not(p, 'holder', 'bracket', 'fitting', 'frame', 'inner', 'plate'),
    title: 'Best Motorcycle Luggage UK 2026: Panniers, Tail Packs & Tank Bags',
    noun: 'luggage items', shortLabel: 'motorcycle luggage', shopSlug: 'luggage', hero: 'motorcycle-luggage-systems',
    related: ['motorcycle-luggage-systems', 'motorcycle-panniers-guide', 'tail-packs-roll-bags'],
    intro: 'From weekend roll bags to full hard-luggage systems, the right setup carries your kit securely for miles. Here is the best motorcycle luggage you can buy in the UK.' },
  // Electronics
  { slug: 'best-motorcycle-intercoms-uk-2026', base: 'electronics', items: electronics,
    filter: (p) => has(p, 'intercom', 'comm', 'cardo', 'sena', 'mesh', 'bluetooth'),
    title: 'Best Motorcycle Intercoms UK 2026: Cardo, Sena & More',
    noun: 'comms units', shortLabel: 'motorcycle intercoms', shopSlug: 'electronics', hero: 'motorcycle-intercom-systems',
    related: ['motorcycle-intercom-systems', 'modular-helmets-guide', 'motorcycle-gps-navigation'],
    intro: 'Rider-to-rider chat, music and turn-by-turn directions in your helmet — a good intercom transforms group touring. These are the best motorcycle intercoms on sale in the UK.' },
];

const TODAY = '2026-06-11';
const out = [];
for (const cfg of GUIDES) {
  const floor = FLOORS[cfg.base] || 0;
  const products = selectProducts(cfg.items, cfg.filter, 8, floor);
  if (products.length < 4) { console.warn(`SKIP ${cfg.slug} — only ${products.length} products matched`); continue; }
  const allCount = cfg.items.filter((p) => p.priceNum >= floor && cfg.filter(p)).length;
  const article = {
    slug: cfg.slug,
    category: 'buying-guides',
    title: cfg.title,
    metaDescription: cfg.intro.length > 158 ? cfg.intro.slice(0, 155) + '…' : cfg.intro,
    heroImage: 'public/images/guides/gear/' + cfg.hero + '.jpg',
    author: 'VisorUp Team',
    publishDate: TODAY,
    readTime: Math.max(6, Math.round(products.length * 0.9 + 4)) + ' min read',
    tags: ['buying guide', cfg.base, 'gear', '2026'],
    relatedSlugs: cfg.related,
    affiliateLinks: products.slice(0, 6).map((p) => ({ name: p.brand + ' ' + p.name, price: p.price, url: p.affiliateUrl })),
    content: buildContent(cfg, products, allCount),
  };
  out.push(article);
  console.log(`  ${cfg.slug} — ${products.length} products (${money(Math.min(...products.map(p=>p.priceNum)))}–${money(Math.max(...products.map(p=>p.priceNum)))})`);
}

const banner = '/* AUTO-GENERATED by scripts/build-buying-guides.mjs — do not edit by hand. */\n';
const body = 'if (typeof ARTICLES !== "undefined") {\n  ARTICLES.push(\n' +
  out.map((a) => '    ' + JSON.stringify(a)).join(',\n') +
  '\n  );\n}\n';
fs.writeFileSync(path.join(__dirname, '..', 'buying-guides.js'), banner + body);
console.log(`\nWrote buying-guides.js — ${out.length} guides`);
