# VisorUp — Project Overview & Engineering Notes

**Last updated:** 2026-06-13

This is the single reference for what VisorUp is, how each part is implemented and
why, the build/data pipelines, the test/deploy process, and — importantly — a log
of the issues we hit and how we fixed them so we don't relearn them later.

---

## 1. What VisorUp Is

VisorUp is a UK motorcycle‑touring platform with two surfaces:

1. **Website** (`visorup.co.uk`) — a static, client‑side single‑page app (SPA)
   hosted on Cloudflare Pages. Route planning, destination/route/ferry/bike/museum
   guides, ~250 articles, free rider tools, an affiliate gear shop, and SEO content.
2. **Mobile app** (`mobile/`) — a React Native / Expo app (iOS + Android) with the
   route builder, live ride, GPS navigation, community, offline maps, voice nav and
   push notifications.

Revenue is via **SportsBikeShop affiliate** links (tag `#/28914,3714,0`) surfaced
through the shop, buying guides, gear finder and homepage shop section.

---

## 2. Quick Reference

| Thing | Value |
|---|---|
| Repo | `github.com/GlobalBookings/visorup.git` (branch `main`) |
| Web hosting | Cloudflare Pages, project `motorbike-tour`, branch `main` |
| Public domain | `https://visorup.co.uk` (canonical; used in sitemap + JSON‑LD) |
| SPA base | `<base href="/">`, slug‑based client routing |
| Local dev server | `npm start` → `npx serve . -l 3000 -c serve.json` |
| Tests | `npm test` → `npx playwright test` (server on `:4173`) |
| Deploy (manual) | `npm run deploy` → `wrangler pages deploy . --project-name=motorbike-tour --branch=main` (normally auto‑deploys on push to `main`) |
| Backend | Supabase (`https://wqrazxstxiaahejsdurj.supabase.co`) for auth, community, cloud routes |
| Mobile builds | EAS (`eas build -p ios --profile production`, `eas submit`) |
| Scrape proxy | Oxylabs UK residential (`pr.oxylabs.io:7777`) |

---

## 3. Repository Layout

```
/                         Website SPA (root-served static files)
  index.html              Shell: <head>, nav (desktop mega-menu + mobile), script loads
  site.js                 SPA router + all page render methods (~7.4k lines)
  app.js                  Interactive planner (Leaflet/day-nav) for live routes
  route-builder.js        Interactive map "maker" + POI system (MapLibre)
  styles.css              All site styles + CSS-variable theming (dark/light)
  *.js (data modules)     poi-*.js, motorcycle-museums.js, bikes.js, articles.js,
                          buying-guides.js, fuel-stations-uk.js, bike-catalogue.js …
  *.js (tools)            gear-finder.js, garage-finder.js, fuel-range.js,
                          weather-window.js, motorcycle-law.js, road-ratings.js …
  shop.js                 Affiliate shop UI (loads public/data/shop/*.json)
  sitemap.xml             All indexable URLs
  serve.json              SPA fallback config for `serve` (local + tests)
  sw.js / manifest.json   PWA service worker + manifest
  scripts/                Build + scrape tooling (Node ESM .mjs)
  public/data/shop/       Generated catalogue the site loads on demand (tracked)
  data/                   Raw scrape data + progress/cache (mostly gitignored)
  tests/site.spec.js      Playwright e2e suite
  mobile/                 Expo React Native app
```

---

## 4. Website Architecture (SPA)

### Routing & rendering — `site.js`
- One big `App`/router class. The router reads `location.pathname`, splits into
  `parts`, and `switch`es on `parts[0]`. Hubs vs detail pages follow this pattern:

  ```js
  case 'museums':
    this.showSiteView();
    if (parts[1]) {                       // detail: /museums/:slug
      var museum = MOTORCYCLE_MUSEUMS.find(m => m.slug === parts[1]);
      if (museum) { this.pageContent.innerHTML = this.renderMuseumDetail(parts[1]) + this.renderFooter(); … }
      else        { this.pageContent.innerHTML = this.render404(); }
    } else {                               // hub: /museums
      this.pageContent.innerHTML = this.renderMuseumsHub() + this.renderFooter();
    }
    this.setActiveNav('museums');
    this.scrollToTop();
    break;
  ```

- Each `render*()` returns an HTML **string** assigned to `this.pageContent.innerHTML`.
  Because every navigation replaces `pageContent`, anything embedded in the returned
  HTML (incl. JSON‑LD `<script>`) is **self‑clearing** on the next navigation.
- Articles/guides live in `ARTICLES` (from `articles.js` + `buying-guides.js`) and
  route as `/guides/:category/:slug` (`parts[1]`=category, `parts[2]`=slug).

### SEO
- `setTitle(page)` sets `document.title`.
- `_setMeta({ description, image, type })` updates meta/OG tags per page.
- **JSON‑LD**: detail pages embed a `<script type="application/ld+json">` directly in
  the page HTML (e.g. `Museum` schema with `PostalAddress` + `GeoCoordinates` +
  `sameAs`). NOTE: there are 2 site‑wide JSON‑LD blocks in `index.html`, so a detail
  page has **3** total — tests must look for the right one, not assert a count of 1.
- `sitemap.xml` lists every indexable URL with `changefreq`/`priority`.

### Script load order (`index.html`) — **matters**
Data modules must load **before** the consumers that read them at construction time:
```
fuel-stations-uk.js → poi-scotland.js → poi-england.js → poi-wales-islands.js
→ motorcycle-museums.js → articles.js → buying-guides.js → app.js
→ route-builder.js → … tools … → shop.js → site.js
```
`route-builder.js` reads `MOTORCYCLE_MUSEUMS_POI` in its constructor and `site.js`
reads `MOTORCYCLE_MUSEUMS`, so `motorcycle-museums.js` is loaded ahead of both.

### Styling / theming — `styles.css`
- Theme via CSS variables on `:root` (dark) and `[data-theme="light"]`. Key tokens:
  `--bg`, `--bg-surface`, `--bg-card`, `--bg-card-hover`, `--text`, `--text-secondary`,
  `--text-muted`, `--border`, `--accent` (brand amber `#D68A2D`/`#c07820`), `--green`,
  `--slate`, `--hero-overlay`.
- **Always use these variables** for new UI so dark/light both work (museum cards and
  `.shop-card-desc` were built this way).
- Reusable building blocks: `.page-hero`/`.page-hero-title`/`.page-hero-sub`,
  `.page-section`, `.container`, `.breadcrumb`, `.detail-grid` (`.detail-main` +
  `.detail-sidebar` with `.info-card`), `.tips-callout`.

### PWA
`manifest.json` + `sw.js` provide installability, offline page (`offline.html`) and
app icons.

---

## 5. Interactive Route Builder & POI System — `route-builder.js`

The "map maker" at `/build-route`. MapLibre GL is loaded from unpkg CDN.

- **`RouteBuilder.POI_CONFIG`** is the single source of truth for POI categories.
  Each entry: `{ dataKey, color, faIcon, size, label }`. The toggle UI (`_buildDOM`),
  rendering and stop‑suggestions all iterate `Object.keys(POI_CONFIG)`, so **adding a
  category here auto‑creates its toggle** (`<input data-poi-type="…">`) and rendering.
- Static arrays (`static MUSEUMS = []`, etc.) are populated by `_mergeExternalPOI()`,
  which merges external POI source objects via a `keyMap` (`{ museums:'MUSEUMS', … }`),
  de‑duping by `name`.
- POI shape expected by the layer: `{ name, lat, lng, desc, url, rating, top }`.
- `_suggestStops()` recommends POIs within 8 miles of the route for chosen
  `suggestTypes`.

**Museums integration example** (5 edits, no data duplication):
1. `POI_CONFIG.museums = { dataKey:'MUSEUMS', color:'#8e44ad', faIcon:'fa-landmark', size:28, label:'Museums' }`
2. `static MUSEUMS = []`
3. `keyMap.museums = 'MUSEUMS'`
4. `_mergeExternalPOI`: `sources.push({ museums: MOTORCYCLE_MUSEUMS_POI })`
5. `suggestTypes.museums = 1`

---

## 6. Data Modules

| File | Global | Notes |
|---|---|---|
| `poi-scotland.js` / `poi-england.js` / `poi-wales-islands.js` | `POI_*` | Region POI sets merged into RouteBuilder |
| `motorcycle-museums.js` | `MOTORCYCLE_MUSEUMS`, `MOTORCYCLE_MUSEUMS_POI` | 18 museums; POI adapter derived from same data |
| `fuel-stations-uk.js` | fuel data | 9,913 UK fuel stations |
| `bikes.js` | `BIKES` | Bike touring setup guides |
| `bike-catalogue.js` | catalogue | Small curated catalogue used in UI |
| `articles.js` | `ARTICLES` | ~250 guides/articles |
| `buying-guides.js` | pushes into `ARTICLES` | **Auto-generated** — do not hand‑edit |

> Pattern: keep **one source data module**, then derive any secondary shapes (e.g.
> map POIs) from it instead of duplicating records.

---

## 7. Content System (articles & guides)

- Articles are objects in `ARTICLES` (`{ slug, category, title, metaDescription,
  heroImage, content (HTML), tags, relatedSlugs, … }`).
- Buying guides are a generated subset (`category:'buying-guides'`) produced by
  `scripts/build-buying-guides.mjs` from the real catalogue, written to
  `buying-guides.js` (banner: "AUTO‑GENERATED … do not edit by hand").
- Infographics are articles tagged `infographic` with PNG/HTML assets.

---

## 8. Monetization: Product Pipeline & Shop

### 8.1 Scraping pipeline
- **`scripts/scrape-proxy.mjs`** — holds the real Oxylabs credentials. **GITIGNORED**;
  never committed.
- **`scripts/scrape-fix.mjs`** — concurrent re‑scraper (~20k products/hr). Reads proxy
  creds *from* `scrape-proxy.mjs` by regex interpolation so no secret is duplicated in
  a tracked file.
- Raw output → `data/products.json` (35MB, **gitignored**): 38,477 colour‑variant
  records with `name, brand, price, rrp, description, category, imageUrl, thumbUrl,
  specs, …`.
- **`data/price-image-fix.json`** (5MB, untracked): 17,290 corrected price+image
  records keyed by product id, produced by the re‑scrape to fix bad source data.

### 8.2 Catalogue build — `scripts/build-shop-catalogue.mjs`
Transforms `data/products.json` (+ overlays `price-image-fix.json`) into the files the
site loads on demand:
- Decodes HTML entities, re‑extracts brand from the cleaned name, **re‑categorises**
  with a rich keyword ruleset, merges colour variants into one product (keeps
  `colours[]`), and writes per‑category JSON + `index.json` + a compact
  `search-index.json`.
- **Output is tracked** in `public/data/shop/` (so the site works without the raw
  data). Run: `node scripts/build-shop-catalogue.mjs`.
- Current totals: **17,300 unique products across 14 categories**.

Category item shape (loaded by `shop.js`):
```json
{ "id","slug","name","brand","category","desc","priceNum","price","priceFixed",
  "url","affiliateUrl","image","thumb","colours":[…],"colourCount","colourFamilies":[…] }
```
`desc` is a cleaned, ≤240‑char description (added 2026‑06; see §9). The
`search-index.json` deliberately **omits** `desc` to stay lean (~4.7MB).

### 8.3 Shop UI — `shop.js`
- Hub loads `index.json` (category cards). Category page fetches
  `public/data/shop/<slug>.json` and renders cards with brand/name/**description**/
  price/affiliate button + brand/price/sort filters.
- Search loads `search-index.json` (compact keys `n,b,c,p,t,u`).
- All product links: `target="_blank" rel="noopener sponsored"` with the affiliate tag.

### 8.4 Buying guides — `scripts/build-buying-guides.mjs`
- 24 data‑driven guides, each selecting a price‑varied shortlist from a category and
  embedding live product cards + an FAQ + tips. Writes `buying-guides.js`.
- Product card blurb now uses the **real scraped `desc`**, falling back to a generated
  per‑brand/tier blurb (`blurbFor`) when a description is missing.

### 8.5 Gear Finder — `gear-finder.js` + `scripts/build-gear-picks.mjs`
- A quiz (experience / style / weather / budget / category) → tiered product picks.
- Picks are pre‑built into `public/data/shop/gear-picks.json` (141 slots) by
  `build-gear-picks.mjs`; `getRecommendations` prefers `GEAR_PICKS` and **degrades
  gracefully** (returns null for missing categories — no hardcoded fallback).

---

## 9. Feature Log (what + why, recent first)

| Date / Commit | Feature | Why |
|---|---|---|
| `de72763` | **Product descriptions** on shop cards + buying guides | We had scraped a description for all 38,477 products but never surfaced it. Build now carries a cleaned `desc`; cards/guides render it for better UX + SEO + conversion. |
| `217e67b` | **Motorbike Museums** directory (18, GB/IoM/Ireland) | Ride‑out destinations: `/museums` hub + rich SEO detail pages (admission/opening/JSON‑LD/map) + a Museums layer on the Route Builder. |
| `821e026` | **Trousers + Body Armour** in Gear Finder | Filled gear‑category gaps; 141 pick slots; body armour positively filtered from the `protection` catalogue. |
| `5a5b183` | **App Store crash fix + shop data overhaul** | Fixed iOS launch crash (see §15) and re‑scraped to fix finance prices / broken images / miscategorisation. |
| `e8d4c90` | Homepage shop section | Monetisation surface on the landing page. |
| `469a730` | 24 data‑driven buying guides | SEO + affiliate revenue. |
| `b2d28ff` | Gear Finder with real products | Personalised, monetised recommendations. |
| `b9a5822` | Shop: 14 categories | Browse the full affiliate catalogue. |
| earlier | Tools, infographics, garage finder, PWA, mobile app, Supabase cloud routes | Free utilities for SEO/retention + the native app. |

---

## 10. Mobile App (`mobile/`) — Expo / React Native

- Expo Router app (`app/`), TypeScript, `app.json` config, EAS via `eas.json`.
- `lib/supabase.ts` — **launch‑safe** Supabase client (see §15).
- Env: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`. Provided locally
  by `mobile/.env` (gitignored) and to EAS builds by the `env` blocks in `eas.json`.
- Build/submit: `eas build -p ios --profile production` then `eas submit`.
- `mobile/google-play-key.json` (Play service account) is referenced by `eas.json`
  but is **untracked** — it is a real secret and must never be committed.

---

## 11. Build Scripts Reference (`scripts/`)

| Script | Purpose |
|---|---|
| `scrape-products.mjs` / `scrape-categories.mjs` | Initial catalogue scrape |
| `scrape-fix.mjs` | Fast concurrent **re**‑scrape (~20k/hr); fixes prices/images |
| `scrape-proxy.mjs` | **Gitignored** — Oxylabs credentials + low‑level fetch |
| `categorise-urls.mjs` | URL/category mapping helper |
| `build-shop-catalogue.mjs` | products.json → `public/data/shop/*.json` (+desc) |
| `build-gear-picks.mjs` | Gear Finder tiered picks → `gear-picks.json` |
| `build-buying-guides.mjs` | Generates `buying-guides.js` (24 guides) |
| `build-catalogue.mjs` | Legacy/auxiliary catalogue build |
| `generate-pois.mjs` / `scrape-pois.mjs` | POI generation/scrape |
| `fetch-fuel-stations.js` | UK fuel station dataset |
| `generate-images.mjs` / `generate-bike-images.mjs` / `generate-guide-images.mjs` | AI image generation |
| `update-image-refs.mjs` / `update-guide-image-refs.mjs` | Rewrite image references after generation |

**Rebuild order after a re‑scrape:** `build-shop-catalogue.mjs` →
`build-gear-picks.mjs` → `build-buying-guides.mjs`.

---

## 12. Data Files Reference

| Path | Tracked? | Size | Notes |
|---|---|---|---|
| `public/data/shop/*.json` | ✅ tracked | ~22MB total | Site loads these; safe to ship (public product data) |
| `public/data/shop/index.json` | ✅ | 37KB | Has a `generated` timestamp → always shows a diff on rebuild |
| `public/data/shop/search-index.json` | ✅ | 4.7MB | Compact; no `desc`; regenerates byte‑identical if products unchanged |
| `data/products.json` | ❌ gitignored | 35MB | Raw 38,477 scrape records (incl. description + specs) |
| `data/price-image-fix.json` | ❌ untracked | 5MB | 17,290 price/image corrections; needed to rebuild catalogue |
| `data/full-catalogue.json`, progress/cache, `*.log` | ❌ gitignored | — | Scrape working files |
| `scripts/scrape-proxy.mjs` | ❌ gitignored | — | **Contains credentials** |
| `mobile/.env`, `mobile/google-play-key.json` | ❌ | — | Secrets/keys — never commit |

> ⚠️ `data/price-image-fix.json` is untracked but **not** in `.gitignore`. The shop
> works because the *built* JSON is committed, but a fresh clone cannot reproduce the
> price/image fixes without this file. Keep a backup; consider documenting its origin.

---

## 13. Testing — Playwright (`tests/site.spec.js`, `playwright.config.js`)

- `baseURL: http://localhost:4173`; `webServer: npx serve . -l 4173 -c serve.json`
  (SPA fallback, so deep links like `/museums/:slug` resolve to `index.html`).
- Two projects: **Desktop Chrome** + **Mobile Chrome (Pixel 7)** → every test runs ×2.
- Run all: `npm test`. Run a subset: `npx playwright test -g "Museum" --reporter=line`.
- Current status: **146 tests passing**.
- Coverage includes: homepage, nav, route/destination/ferry/bike detail pages, the
  interactive planner, Gear Finder quizzes (budget/mid/premium/trousers/armour),
  Museums (hub + detail + map integration), and shop/buying‑guide descriptions.

**Testing conventions learned:**
- Detail pages assert `.page-hero-title`, `.detail-grid`, `.breadcrumb` visible.
- For data wiring, prefer `page.evaluate(() => window.GLOBAL…)` over relying on map
  tiles rendering (robust, no CDN/timing flakiness).
- `class` declarations (e.g. `RouteBuilder`) are global **lexical** bindings — they are
  *not* `window` properties, but a bare reference inside `page.evaluate` resolves them.

---

## 14. Deployment

- **Web:** push to `main` → Cloudflare Pages auto‑deploys (project `motorbike-tour`).
  Manual: `npm run deploy`. Build hook injects Supabase env into `supabase-env.json`
  only if `SUPABASE_URL`/`SUPABASE_ANON_KEY` are set (see `package.json` `build`).
- **Mobile:** EAS build + submit (above). After the crash fix, iOS needs a fresh
  production build + resubmit (tracked in Backlog).

---

## 15. Issues Encountered & Fixes (READ BEFORE DEBUGGING)

### iOS launch crash on App Store build
- **Symptom:** app crashed at launch on device (not in dev).
- **Cause:** `mobile/.env` is gitignored, so the EAS production build had **no**
  Supabase env. `createClient('', '')` threw at import time → crash before first frame.
- **Fix:** (1) made `lib/supabase.ts` **launch‑safe** — guard with
  `isSupabaseConfigured = Boolean(URL && KEY)` and pass a `'placeholder-anon-key'` so
  import never throws; cloud features simply disable if unconfigured. (2) Added `env`
  blocks (URL + anon key) to `eas.json` `preview`/`production` so real builds get creds.
- **Lesson:** any `EXPO_PUBLIC_*` the app needs at import must be in `eas.json`, because
  `.env` is not bundled into EAS builds.

### iOS launch crash #2 — Supabase + Hermes `URL` (build 4, Apple re-reject)
- **Symptom:** build 4 (1.0(4)) still "crashed on launch." Apple's attached `.ips`
  logs were all device **`iPad15,3`** (iPad Pro 11" M4): `EXC_CRASH / SIGABRT`,
  `abort() called`, via `-[RCTExceptionsManager reportFatal:]` — i.e. an **unhandled
  JS exception at launch** taken fatal by React Native in production (Hermes confirmed
  by `hermes::vm::HadesGC` frames).
- **Cause:** the app uses `@supabase/supabase-js` v2 on **Hermes**, whose WHATWG `URL`
  implementation is incomplete. supabase-js (`auth-js`/`realtime-js`) calls `new URL()`
  during session init. At launch `app/_layout.tsx` registers
  `supabase.auth.onAuthStateChange(...)`, which kicks off auth init → `new URL()` →
  Hermes throws → unhandled → fatal `abort()`. **`react-native-url-polyfill` was not
  installed.** (Fixing crash #1's env throw simply exposed this next startup throw.)
- **Fix:**
  1. `npx expo install react-native-url-polyfill` (pure-JS, no pod changes).
  2. `import 'react-native-url-polyfill/auto';` as the **first import** in
     `lib/supabase.ts` (before `createClient`) **and** at the top of `app/_layout.tsx`
     so global `URL` is patched before any supabase code runs.
  3. Defense-in-depth so no future startup error is fatal: a React **ErrorBoundary**
     around the root `<Stack>` (shows a fallback instead of crashing), `try/catch`
     around `onAuthStateChange`, and a guaranteed `SplashScreen.hideAsync()` in the
     startup effect's `finally`.
- **Verified:** Release simulator build launched past the splash to the onboarding
  screen on **all 11 available simulators** — iPhone 17 / 17 Pro / **17 Pro Max**
  (Apple's review device) / 17e / Air, and iPad **Pro 11" M5** (the `iPad15,3` analog) /
  Pro 13" M5 / mini A17 Pro / Air 13" M4 / Air 11" M4 / (A16). Each stayed alive
  (`launchctl` status 0) with **zero** new crash reports.
- **Lesson:** Supabase on React Native/Hermes **requires** `react-native-url-polyfill`
  imported before the client. `structuredClone` was a red herring here — auth-js's
  `deepClone` is `JSON.parse(JSON.stringify())`, so no structuredClone polyfill is needed.
- **Reproducing the per-device test (no physical device needed):**
  ```sh
  cd mobile && npx expo run:ios --configuration Release --device "iPhone 17"   # build once
  APP=…/Release-iphonesimulator/VisorUp.app
  xcrun simctl boot <udid>; xcrun simctl bootstatus <udid>
  xcrun simctl install <udid> "$APP"
  xcrun simctl launch <udid> co.uk.visorup.app          # prints PID
  xcrun simctl spawn <udid> launchctl list | grep visorup   # PID + status 0 == alive
  xcrun simctl io <udid> screenshot out.png             # visual confirm past splash
  ```
  Note: a full iOS Release build needs ~6–8 GB free disk; reclaim from
  `~/Library/Developer/Xcode/DerivedData` and `xcrun simctl erase <udid>` between
  devices if space is tight.

### Gear Finder showing wrong/odd products → full re‑scrape
- **Symptoms:** finance ("£X/month") prices, broken/404 images, mis‑categorised items
  (e.g. helmets list polluted to 1,106 entries).
- **Fixes:**
  - **Prices & images** were wrong *at the source* → required a **re‑scrape**
    (`scrape-fix.mjs`) producing `price-image-fix.json`, overlaid in the catalogue build.
  - **Categories** were a **code** problem → rewrote `categorise()` in
    `build-shop-catalogue.mjs` (match the base name *before* the ` - variant` suffix;
    positive/negative keyword guards). Helmets dropped 1,106 → 152 clean.
- **Lesson:** distinguish *data* bugs (re‑scrape) from *transform* bugs (fix the build).

### Body armour selection
- The `protection` category mixes back/chest protectors, armoured shirts and Tech‑Air
  airbags with other items → used a **positive** `isArmour()` filter (+ `priceNum ≥ 30`)
  rather than trying to exclude everything else.

### Flaky Playwright test under parallel load
- "Interactive Planner › planner back button" occasionally failed under full parallel
  runs but passed on rerun → environmental flakiness, **not a regression**. Re‑run
  before treating as a real failure.

### JSON‑LD assertion counted 3, expected 1
- Detail pages embed 1 `Museum` JSON‑LD, but `index.html` has 2 site‑wide blocks → 3
  total. **Fix:** assert that *some* block contains `"@type":"Museum"` via
  `allTextContents()`, not an exact count.

### Ambiguous Playwright `hasText` matched two cards
- `.info-card` filtered by `'Admission'` also matched the **Opening** card on the
  National Motorcycle Museum because its hours text contains "last **admission**"
  (`hasText` is case‑insensitive substring). **Fix:** target `.info-card h4` (heading
  text only) so "Admission"/"Opening" are unambiguous.

### `git push` rejected (remote ahead)
- Remote had SEO auto‑commits we didn't have locally → **fetch + `git rebase
  origin/main`** to replay our commits on top (clean, linear), then push. Re‑run the
  test suite after a rebase if the rebase pulled in unrelated content changes.

### Secret‑scan false positives on minified JSON
- The shop JSONs are single‑line, so a substring match prints the whole multi‑MB file.
  Matches for `password`/`secret` were **product names** ("Tucano Urbano Password Plus
  Hydroscud Gloves", "Held Ladies Secret Pro Leather Glove"), not credentials. Use
  `grep -oiE` to see the *exact* matched tokens before reacting.

### Supabase anon key is publishable (not a leak)
- The `EXPO_PUBLIC_SUPABASE_ANON_KEY` in `mobile/eas.json` is a **publishable** client
  key (RLS‑protected, already bundled in the app binary). Committing it is standard for
  Expo. The dangerous secrets are the **service_role** key and
  `google-play-key.json` — those stay untracked.

### Module load order
- New data globals must be `<script>`‑loaded **before** the files that consume them at
  construction/parse time (added `motorcycle-museums.js` before `route-builder.js` and
  `site.js`).

---

## 16. Security & Secrets Handling

- **Never commit:** `scripts/scrape-proxy.mjs` (Oxylabs creds), `mobile/.env`,
  `mobile/google-play-key.json`, any service_role key. All are gitignored/untracked —
  keep it that way.
- **Safe to ship:** SportsBikeShop product data, affiliate URLs, the Supabase URL, and
  the publishable anon key.
- **Pre‑commit ritual:** stage only your own files explicitly (never `git add -A`);
  run `git diff --cached` + a secret scan; treat untracked artifacts (crash logs, large
  data files) as off‑limits unless explicitly intended.

---

## 17. Conventions

- **Static SPA**: render methods return HTML strings; embed page‑scoped JSON‑LD so it
  self‑clears on navigation; reuse existing CSS classes + theme variables.
- **Single‑source data → derive** secondary shapes (don't duplicate records).
- **Generated files** (`buying-guides.js`, `public/data/shop/*`) are produced by scripts
  — edit the script, then rebuild; don't hand‑edit the output.
- **Git**: concise imperative commit subject + a short body explaining *why*; co‑author
  trailer `factory-droid[bot]`. Stage explicitly; never push without an explicit go‑ahead.

---

## 18. Backlog / Pending

- **iOS:** URL-polyfill launch-crash fix is implemented + simulator-verified on all
  devices. **Next:** `cd mobile && eas build -p ios --profile production` (build 5) →
  `eas submit -p ios --latest` → reply on the Apple rejection (Submission ID
  039443fd-9740-4213-b482-4ac143ce8295) that the launch crash is fixed.
- **Android:** submit the AAB to Google Play (internal track configured in `eas.json`).
- **Data hygiene:** decide whether to back up / track `data/price-image-fix.json` so the
  catalogue is reproducible from a clean clone.
- **Content:** consolidate the Lake District articles (duplicates noted earlier).
- **Optional:** surface product `specs` (also scraped) on product/guide pages.
```
