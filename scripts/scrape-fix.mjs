/**
 * Re-scrape correct PRICE + IMAGE for every merged product (one representative
 * variant per brand|baseName group ~16.4k). Fixes two source-data bugs:
 *   - price: old scraper grabbed the first £ on the page = finance monthly figure.
 *            We now read the JSON-LD "price" (real selling price).
 *   - image: old scraper guessed product/{id}.jpg (≈50% 404). We now read og:image.
 *
 * Concurrent worker pool over Oxylabs rotating residential sessions (fast).
 * Output: data/price-image-fix.json  { [id]: { priceNum, price, rrpNum, image, thumb } }
 * Resumable: re-run to continue; skips ids already done or permanently failed.
 *
 * Usage:
 *   node scripts/scrape-fix.mjs --test=20        # parse-check a small batch, no save
 *   node scripts/scrape-fix.mjs --conc=10        # full run, 10 concurrent workers
 */
import fs from 'fs';
import path from 'path';
import { ProxyAgent, fetch as undiciFetch } from 'undici';

const RAW = path.resolve('data/products.json');
const OUT = path.resolve('data/price-image-fix.json');
const FAILED = path.resolve('data/fix-failed.json');

// Read proxy credentials from the existing scraper so secrets aren't duplicated.
const psrc = fs.readFileSync(path.resolve('scripts/scrape-proxy.mjs'), 'utf8');
const PROXY_HOST = (psrc.match(/PROXY_HOST = '([^']+)'/) || [])[1];
const PROXY_PORT = (psrc.match(/PROXY_PORT = (\d+)/) || [])[1];
const PROXY_USER = (psrc.match(/PROXY_USER = '([^']+)'/) || [])[1];
const PROXY_PASS = (psrc.match(/PROXY_PASS = '([^']+)'/) || [])[1];

const UAS = [
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0',
];
const REFERERS = ['https://www.google.co.uk/', 'https://www.sportsbikeshop.co.uk/', 'https://www.google.co.uk/search?q=motorcycle+gear'];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const rnd = (a) => a[Math.floor(Math.random() * a.length)];
const newSession = () => 'sess' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
const makeAgent = (s) => new ProxyAgent(`http://${PROXY_USER}-sessid-${s}:${PROXY_PASS}@${PROXY_HOST}:${PROXY_PORT}`);

function decodeEntities(s) {
  if (!s) return '';
  return s.replace(/&amp;/g, '&').replace(/&#0?39;/g, "'").replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10))).replace(/\s+/g, ' ').trim();
}

// Insert a Cloudinary size transform into an og:image URL, replacing any existing transform.
function imgWithSize(og, size) {
  const m = og.match(/^(https?:\/\/[^/]+\/image\/upload\/)(.*)$/);
  if (!m) return og;
  let rest = m[2];
  const seg = rest.split('/')[0];
  if (/[,]/.test(seg) || /^(c_|w_|h_|q_|f_|g_|e_)/.test(seg)) rest = rest.split('/').slice(1).join('/');
  return `${m[1]}c_fill,h_${size},w_${size}/${rest}`;
}

function parse(html) {
  let priceNum = null;
  const pm = html.match(/"price"\s*:\s*"?(\d+(?:\.\d{1,2})?)"?/);
  if (pm) priceNum = parseFloat(pm[1]);
  if (priceNum == null) {
    const lp = html.match(/"lowPrice"\s*:\s*"?(\d+(?:\.\d{1,2})?)"?/);
    if (lp) priceNum = parseFloat(lp[1]);
  }
  let rrpNum = null;
  const rm = html.match(/RRP[^£]{0,12}£\s*([\d,]+(?:\.\d{1,2})?)/i);
  if (rm) rrpNum = parseFloat(rm[1].replace(/,/g, ''));
  let og = null;
  const om = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
  if (om) og = om[1];
  return { priceNum, rrpNum, og };
}

async function fetchOne(url, agent) {
  const res = await undiciFetch(url.trim(), {
    dispatcher: agent,
    headers: {
      'User-Agent': rnd(UAS),
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-GB,en;q=0.9',
      'Referer': rnd(REFERERS),
      'Sec-Fetch-Dest': 'document', 'Sec-Fetch-Mode': 'navigate',
      'Upgrade-Insecure-Requests': '1', 'Cache-Control': 'max-age=0', 'DNT': '1',
    },
  });
  if (res.status === 403 || res.status === 429) throw new Error('BLOCKED');
  if (res.status === 404 || res.status === 410) throw new Error('NOTFOUND');
  if (!res.ok) throw new Error('HTTP_' + res.status);
  const html = await res.text();
  if (html.includes('challenge-platform') && html.length < 5000) throw new Error('CF');
  return parse(html);
}

function buildReps() {
  const raw = JSON.parse(fs.readFileSync(RAW, 'utf8'));
  const groups = new Map();
  for (const p of raw) {
    const name = decodeEntities(p.name);
    if (!name) continue;
    const brand = name.split(' ')[0];
    const baseName = name.replace(/ - .+$/, '').trim();
    const key = brand.toLowerCase() + '|' + baseName.toLowerCase();
    if (!groups.has(key)) groups.set(key, { id: p.id, url: p.url });
  }
  return [...groups.values()].filter((r) => r.id && r.url);
}

async function main() {
  const args = process.argv.slice(2);
  const testN = (args.find((a) => a.startsWith('--test=')) || '').split('=')[1];
  const conc = parseInt((args.find((a) => a.startsWith('--conc=')) || '--conc=10').split('=')[1], 10);

  let reps = buildReps();
  console.log(`Representatives (merged products): ${reps.length}`);

  const results = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {};
  const failed = fs.existsSync(FAILED) ? JSON.parse(fs.readFileSync(FAILED, 'utf8')) : {};

  if (testN) {
    reps = reps.slice(0, parseInt(testN, 10));
    let agent = makeAgent(newSession());
    for (const r of reps) {
      try {
        const out = await fetchOne(r.url, agent);
        console.log(`${out.priceNum != null ? '£' + out.priceNum : 'NO-PRICE'}  rrp=${out.rrpNum ?? '-'}  img=${out.og ? 'Y' : 'N'}  | ${r.id}`);
      } catch (e) { console.log(`ERR ${e.message}  | ${r.id}`); agent = makeAgent(newSession()); }
      await sleep(400);
    }
    return;
  }

  const queue = reps.filter((r) => !results[r.id] && !failed[r.id]);
  console.log(`Done: ${Object.keys(results).length} | Failed: ${Object.keys(failed).length} | To do: ${queue.length} | Workers: ${conc}`);

  let qi = 0, success = 0, fail = 0, sinceSave = 0;
  const retries = new Map();
  const start = Date.now();

  function save() {
    fs.writeFileSync(OUT, JSON.stringify(results));
    fs.writeFileSync(FAILED, JSON.stringify(failed));
  }

  async function worker() {
    let sess = newSession(), agent = makeAgent(sess), n = 0;
    while (qi < queue.length) {
      const item = queue[qi++];
      if (!item) break;
      if (n >= 8) { sess = newSession(); agent = makeAgent(sess); n = 0; }
      try {
        const out = await fetchOne(item.url, agent); n++;
        if (out.priceNum != null) {
          results[item.id] = {
            priceNum: out.priceNum, price: '£' + out.priceNum,
            rrpNum: out.rrpNum || null,
            image: out.og ? imgWithSize(out.og, 600) : null,
            thumb: out.og ? imgWithSize(out.og, 200) : null,
          };
          success++;
        } else { failed[item.id] = 1; fail++; }
      } catch (e) {
        if (e.message === 'NOTFOUND') { failed[item.id] = 1; fail++; }
        else {
          const r = (retries.get(item.id) || 0) + 1;
          retries.set(item.id, r);
          if (r <= 5) { queue.push(item); } else { failed[item.id] = 1; fail++; }
          sess = newSession(); agent = makeAgent(sess); n = 0;
          await sleep(e.message === 'BLOCKED' || e.message === 'CF' ? 1500 : 600);
          continue;
        }
      }
      if (++sinceSave >= 200) { sinceSave = 0; save(); }
      const total = success + fail;
      if (total % 100 === 0) {
        const rate = Math.round(success / ((Date.now() - start) / 3600000));
        const eta = ((queue.length - qi) / Math.max(rate, 1) * 60).toFixed(0);
        process.stdout.write(`  [${Object.keys(results).length} done | ${fail} fail | ${rate}/hr | ~${eta}m left]\n`);
      }
      await sleep(250 + Math.random() * 350);
    }
  }

  await Promise.all(Array.from({ length: conc }, () => worker()));
  save();
  const mins = ((Date.now() - start) / 60000).toFixed(1);
  console.log(`\nDONE in ${mins}m — success ${success}, failed ${fail}, total saved ${Object.keys(results).length}`);
}

process.on('uncaughtException', (e) => console.error('[UNCAUGHT]', e.message));
process.on('unhandledRejection', (e) => console.error('[UNHANDLED]', e.message || e));
main().catch((e) => console.error('Fatal:', e.message));
