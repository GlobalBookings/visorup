# VisorUp Gear Content Plan

**Data source**: 38,584 SportsBikeShop products with affiliate tracking (`#/28914,3714,0`)
**Status**: Scraper running continuously, enriching products with names/prices/categories.

---

## Phase 1: Core Catalogue (Build First)

### 1.1 Category Catalogue Pages — `/gear/[category]`
**File**: `gear-catalogue.js`
**Routes**: `/gear/helmets`, `/gear/jackets`, `/gear/gloves`, `/gear/boots`, `/gear/luggage`, `/gear/electronics`

- Product grid with image cards (CDN thumbnails), name, price, affiliate link
- Filter sidebar: brand, price range (sliders), subcategory
- Sort: price low-high, price high-low, newest, brand A-Z
- Pagination or infinite scroll (50 per page)
- Breadcrumbs: Gear > Helmets > Full Face
- Mobile: filter drawer, 2-column grid
- SEO: Each page targets "motorcycle [category] UK" keywords

**Data needed**: name, price, category, brand, imageUrl, affiliateUrl
**Template per card**:
```html
<div class="gear-card">
  <img src="[thumbUrl]" alt="[name]" loading="lazy">
  <h3>[name]</h3>
  <span class="gear-price">[price]</span>
  <a href="[affiliateUrl]" target="_blank" rel="sponsored">View at SportsBikeShop</a>
</div>
```

### 1.2 Gear Finder Quiz — `/gear/finder` ✅ DONE
Interactive 5-step quiz recommending gear by experience, style, weather, budget.

### 1.3 Brand Pages — `/gear/brands/[brand]`
**File**: `gear-catalogue.js` (same renderer, filtered by brand)

- Auto-generated from unique brands in catalogue
- Brand hero section with logo + description
- All products from that brand, filterable by category
- SEO: "Shoei helmets UK", "Alpinestars boots UK", "Rukka jackets UK"

---

## Phase 2: Interactive Tools

### 2.1 "Kit Me Out" Budget Calculator — `/gear/calculator`
**File**: `gear-calculator.js`

**How it works**:
1. User enters total budget (slider: £300 — £3,000)
2. Selects what they need (checkboxes: helmet, jacket, trousers, gloves, boots, luggage, electronics)
3. System allocates budget with smart splits:
   - Helmet: 30% (safety priority)
   - Jacket: 25%
   - Gloves: 10%
   - Boots: 12%
   - Trousers: 15%
   - Luggage: 8%
4. Shows best products at each price point from catalogue
5. "Adjust priorities" sliders to shift budget between categories
6. Running total with "Shop All" button

**Unique angle**: No other motorcycle site has this. High engagement, high affiliate clicks.

### 2.2 Colour Matcher — `/gear/colour-match`
**File**: `gear-colour-matcher.js`

**How it works**:
1. Pick a base colour (black, white, red, blue, hi-vis yellow, grey, green, orange)
2. Optionally pick a helmet first (shows matching jackets/gloves/boots)
3. Grid shows coordinated sets using product images
4. "Shop this look" links to all items

**Implementation**: Tag products by dominant colour during scraping (extract from name: "Matt Black", "Fluo Yellow", "Red/White"). Group by colour family.

**Data needed**: Add `colour` field to scraper based on product name parsing.

### 2.3 Comparison Tool — `/gear/compare`
**File**: `gear-compare.js`

**How it works**:
1. User searches/selects 2-3 products from same category
2. Side-by-side table: price, specs, weight, waterproof rating, CE level
3. "Verdict" auto-generated from specs (cheapest, best-protected, lightest)
4. Individual affiliate links per product

**SEO value**: "Shoei NXR 2 vs HJC RPHA 71" comparison queries.

### 2.4 "Gear for My Bike" Tool — `/gear/my-bike`
**File**: `gear-bike-match.js`

**How it works**:
1. Select bike model from existing BIKES catalogue
2. Shows compatible luggage (using fitment data from product specs)
3. Recommended accessories for that bike type (sport = back protector, ADV = crash bars)
4. Cross-links to bike setup guide pages we already have

---

## Phase 3: Content / SEO Articles

### 3.1 Buyer's Guide Articles
**File**: `articles/batch-gear-guides.js` (article data)

**Articles to generate**:
1. "How to Choose Your First Motorcycle Helmet — Complete Guide"
2. "Touring Jackets Explained: Textile vs Leather vs Laminate"
3. "Gore-Tex vs Drystar vs Hipora: Waterproof Membrane Showdown"
4. "Motorcycle Luggage Guide: Hard Panniers vs Soft Bags vs Tail Packs"
5. "Intercom Buying Guide 2026: Cardo vs Sena Head-to-Head"
6. "Motorcycle Boots Explained: Touring vs Sport vs Adventure vs Urban"
7. "Motorcycle Glove Guide: Summer, Winter, and All-Season Options"
8. "CE Armour Ratings Explained: What CE Level 1 vs 2 Actually Means"

**Format**: Long-form article (1500-2500 words) with embedded product cards at each recommendation point. Each article links to 8-15 specific products.

### 3.2 Seasonal Gear Guides
**Articles**:
1. "Complete Winter Motorcycle Kit 2026: Head-to-Toe Guide"
2. "Summer Riding Gear: Best Mesh Jackets, Gloves & Helmets"
3. "Autumn/Spring Transitional Gear: What Actually Works in 12°C"
4. "Scotland in the Rain: Essential Wet-Weather Touring Kit"

### 3.3 Budget Tier Articles
**Articles**:
1. "Kit Yourself Out for Under £500: The Budget Rider's Guide"
2. "Best Motorcycle Gear Between £500-£1,000"
3. "Premium Motorcycle Touring Kit: When Money's No Object"
4. "Best Value Motorcycle Gear 2026: Brands That Punch Above Their Weight"

### 3.4 How-To Articles
**Articles**:
1. "How to Measure Your Head for a Motorcycle Helmet"
2. "How to Break In New Motorcycle Boots Without Pain"
3. "How to Waterproof Your Motorcycle Kit (Properly)"
4. "How to Layer for British Weather on a Motorcycle"
5. "How to Pack Panniers for a Week-Long Tour"
6. "How to Clean and Maintain Your Motorcycle Helmet"
7. "How to Choose the Right Size Motorcycle Jacket"

### 3.5 "What You Need" Lists
**Articles**:
1. "New Rider Checklist: Everything You Need After Passing Your CBT"
2. "Motorcycle Commuting Kit: The Essential 12 Items"
3. "Motorcycle Touring Essentials: 20 Things You Can't Ride Without"
4. "Motorcycle Camping Kit List: Packing Light for Bike Tours"
5. "Track Day Kit: What You Need for Your First Track Day"

---

## Phase 4: Cross-Selling Existing Content

### 4.1 Route-Specific Gear Sidebars
Every route/destination page gets a contextual gear sidebar:

| Route | Gear Focus |
|-------|-----------|
| NC500 | Waterproofs, heated grips, rain gloves, tank bag |
| Lake District | Layering system, waterproof boots, visor cleaner |
| Coastal Cornwall | Summer mesh jacket, light gloves, sun visor |
| Scottish Highlands | Full waterproof suit, thermal base layers, heated gear |
| Channel Islands | Light touring jacket, compact luggage, ferry-friendly |

**Implementation**: Add `gearSuggestions` array to each ROUTE object, render as sidebar cards with affiliate links.

### 4.2 Packing Checklist Product Links
Existing packing checklist tool — add "Buy this" links next to each item:
- "Helmet" → link to helmets category
- "Waterproof oversuit" → link to specific product
- "Disc lock" → link to filtered accessories

### 4.3 Bike Page Gear Recommendations
Each bike setup guide gets a "Recommended Gear" section:
- BMW R1250GS → Givi Trekker panniers, Schuberth C5, ADV boots
- Triumph Tiger → SW-Motech TRAX, Rev'it Defender jacket

---

## Phase 5: Engagement & Retention

### 5.1 Price Alerts (Future)
- User signs up for price drop notifications on specific products
- Re-scrape weekly, compare prices, send email alerts
- Requires: email capture, scheduled scraping, notification system

### 5.2 "My Kit" Garage
- Users save their gear list (like the bike garage but for gear)
- Shows total kit value
- Suggests upgrades: "Your gloves are budget — here's a mid-range upgrade"
- Social sharing: "My touring kit" infographic

### 5.3 Gear Reviews & Ratings
- Users can rate gear they own (1-5 stars)
- "Community Rated" badge on popular products
- Feeds into recommendations (gear finder suggests highest-rated)

---

## Data Requirements by Feature

| Feature | Needs | Have Now? |
|---------|-------|-----------|
| Catalogue pages | name, price, category, image, affiliate | ✅ (for enriched) |
| Gear Finder | Curated recommendations | ✅ Done |
| Budget Calculator | price (numeric), category | ✅ |
| Colour Matcher | colour extraction from name | ❌ Add to scraper |
| Comparison Tool | specs table data | Partial (some specs scraped) |
| Bike Gear Match | fitment/compatibility data | ❌ Manual curation |
| Buyer's Guides | Curated product picks | Manual + catalogue |
| Route Gear Sidebar | Weather + terrain mapping | Manual curation |
| Brand Pages | brand, all products | ✅ |
| Price Alerts | Re-scraping schedule | ❌ Future |

---

## Technical Architecture

All features built as methods on `VisorUpSite` class in dedicated JS files:
```
gear-finder.js      ← ✅ Done (quiz)
gear-catalogue.js   ← Category pages, brand pages, search
gear-calculator.js  ← Budget calculator
gear-colour.js      ← Colour matcher
gear-compare.js     ← Product comparison
gear-articles.js    ← Article data for gear content
```

Product data loaded from `data/full-catalogue.json` (rebuilt after scraping completes via `scripts/build-catalogue.mjs`).

For the website, catalogue data will be compiled into a compact JS file (`gear-data.js`) with only the fields needed for browsing: `{id, name, brand, price, category, colour, thumbUrl, affiliateUrl}`.

---

---

## PPC Arbitrage Strategy

### Commission Rates (SportsBikeShop)

| Customer Type | Standard | Own-Brand | Reduced (Electronics) |
|---------------|----------|-----------|----------------------|
| **New customer** | **8%** | 10% | 3% |
| Existing customer | 2% | 7% | 1% |

10-day cookie window. **Target new customers for 8% rate.**

Own-brand products (10%): Bad Dog, DXR, FLM, Hi-Q, Pharao, QBag, Reusch, Road, Spirit Motors, Zing.
Reduced rate (3%/1%): Action Cameras, Airbags, Electronics, Intercoms, Sat Navs.

### Commission Per Sale by Category

| Category | Avg Price | Commission (New 8%) | Commission (Exist 2%) | Est. CPC | Margin |
|----------|-----------|---------------------|----------------------|----------|--------|
| Clothing | £230 | **£18.43** | £4.61 | £0.60-1.50 | Very High |
| Boots | £194 | **£15.51** | £3.88 | £0.40-1.00 | Very High |
| Luggage | £175 | **£13.96** | £3.49 | £0.30-0.80 | Very High |
| Helmets | £144 | **£11.49** | £2.87 | £0.80-2.00 | High |
| Other | £110 | **£8.84** | £2.21 | £0.30-0.60 | High |
| Gloves | £79 | **£6.35** | £1.59 | £0.30-0.60 | Good |
| Electronics | £189 | £5.67 (3%) | £1.89 (1%) | £0.50-1.50 | Moderate |
| Protection | £57 | **£4.52** | £1.13 | £0.20-0.40 | Good |

### Arbitrage Model

Assume 5% click-through from article to SportsBikeShop, 3% conversion on SBS:
- £230 jacket article: 1000 visitors -> 50 click-throughs -> 1.5 sales -> £27.64 revenue
- At £1.00 CPC, 1000 visitors costs £1000 -> negative
- At £0.50 CPC long-tail, 1000 visitors costs £500 -> still negative on pure PPC

**Key insight**: PPC alone won't work at scale. The play is:
1. **SEO-first** — rank organically for high-volume terms (free traffic)
2. **PPC on long-tail** — bid on ultra-specific queries (£0.15-0.40 CPC) where intent is extremely high (10%+ CTR to SBS)
3. **Retarget organic visitors** — cheap remarketing to people who already read your content
4. **Whole-basket strategy** — a "beginner kit" article drives £500-1000 baskets (£40-80 commission per conversion)

### PPC-Viable Keywords (Low CPC, High Intent)

**Sweet spot**: Keywords where CPC < £0.50 AND buyer is likely a new SBS customer.

| Keyword | Est. CPC | Intent | Target Article |
|---------|----------|--------|----------------|
| "best touring jacket 2026" | £0.60-1.00 | Buy | Best Touring Jackets |
| "best motorcycle helmet under 200" | £0.40-0.70 | Buy | Budget Helmets |
| "waterproof motorcycle boots uk" | £0.30-0.60 | Buy | Best Boots |
| "motorcycle panniers for touring" | £0.25-0.50 | Buy | Best Luggage |
| "shoei neotec 3 review" | £0.30-0.50 | Buy | Shoei Neotec 3 vs Schuberth C5 |
| "what motorcycle gear do i need" | £0.15-0.30 | Research | Beginner Kit Guide |
| "motorcycle gear for scotland" | £0.10-0.20 | Research | NC500/Scotland Gear |
| "motorcycle winter gloves uk" | £0.30-0.50 | Buy | Winter Gloves |
| "rev'it defender 3 review" | £0.20-0.40 | Buy | Rev'it Defender Review |
| "motorcycle touring checklist" | £0.10-0.25 | Research | Packing + Gear List |
| "best motorcycle jacket under 300" | £0.40-0.60 | Buy | Mid-Range Jackets |
| "rukka nivala review" | £0.15-0.30 | Buy | Rukka Nivala Review |
| "kriega os-32 review" | £0.15-0.30 | Buy | Soft Panniers Guide |
| "new rider motorcycle kit list" | £0.10-0.20 | Research | Beginner Kit Guide |
| "motorcycle helmet noise comparison" | £0.20-0.40 | Research | Quietest Helmets |

---

## Phase 6: PPC Arbitrage Listicles

All listicle articles follow this template:
- Hero image + quick verdict (30s for scanners)
- Comparison table (name, price, key spec, rating)
- Individual mini-reviews with pros/cons
- Each product: "View at SportsBikeShop" affiliate CTA button
- "How We Chose" trust section
- FAQ (catches more long-tail keywords)
- Related listicle cross-links

### Tier 1 — Highest Margin (£15-18 commission per sale)

#### 6.1 "7 Best Touring Jackets 2026 (Tested in British Weather)" — `/gear/best-touring-jackets`
**Target keywords**: "best touring jacket", "best motorcycle jacket for touring", "waterproof motorcycle jacket UK"
**Commission**: £18.43 per new customer sale (avg £230)
**Products to feature**:
- Budget: RST Maverick Evo (£180), Oxford Continental (£200)
- Mid: Rev'it Defender 3 GTX (£500), Dainese Carve Master 3 (£450)
- Premium: Klim Badlands Pro A3 (£900), Rukka Nivala 2.0 (£800)
- Best value: Held Tropic 3 (£180)
**PPC bid**: £0.60-1.00 on long-tail variants
**Estimated ROI**: 1 in 30 visitors buys = £18.43 revenue. At £0.80 CPC, breakeven at 23 clicks.

#### 6.2 "Best Motorcycle Boots 2026: Touring, Sport & Urban" — `/gear/best-motorcycle-boots`
**Target keywords**: "best motorcycle boots UK", "waterproof motorcycle boots", "touring motorcycle boots"
**Commission**: £15.51 per new customer sale (avg £194)
**Products to feature**:
- Budget: RST Axiom CE (£100), Spada Braker WP (£80)
- Mid: Alpinestars RT-8 GTX (£250), Rev'it Pioneer GTX (£280)
- Premium: Sidi Adventure 2 GTX (£300), Klim Havoc GTX BOA (£350)
- Urban: Oxford Hardy (£130), Held Marick (£120)

#### 6.3 "Best Motorcycle Luggage for Touring: Panniers, Tank Bags & Tail Packs" — `/gear/best-motorcycle-luggage`
**Target keywords**: "motorcycle panniers", "best motorcycle luggage", "motorcycle tank bag", "soft panniers vs hard"
**Commission**: £13.96 per new customer sale (avg £175)
**Products to feature**:
- Soft: Kriega OS-32 (£300), Oxford Aqua T-50 (£60), Kriega US-20 (£70)
- Hard: Givi Trekker Outback 48L (£260), SW-Motech TRAX ADV (£600)
- Tank bags: Givi EA119 (£80), Kriega US-5 (£50)
- Tail packs: Kriega US-30 (£100)
**PPC note**: Very low competition. "motorcycle panniers" CPC ~£0.25-0.50. High ROI.

#### 6.4 "Best Motorcycle Jackets Under £300" — `/gear/best-motorcycle-jackets-under-300`
**Target keywords**: "motorcycle jacket under 300", "best motorcycle jacket budget", "affordable motorcycle jacket UK"
**Commission**: ~£16-20 per sale (products in £150-299 range)
**Products**: Curated from catalogue, all jackets £150-299 sorted by value/ratings.

### Tier 2 — Volume Play (£6-11 commission, high search volume)

#### 6.5 "Best Motorcycle Helmets 2026: Every Type Reviewed" — `/gear/best-motorcycle-helmets`
**Target keywords**: "best motorcycle helmet UK", "motorcycle helmet 2026", "best full face helmet"
**Commission**: £11.49 per new customer sale (avg £144)
**Products to feature**:
- Budget full-face: HJC i70 (£130), LS2 Stream II (£90)
- Mid full-face: Shoei NXR 2 (£380), HJC RPHA 71 (£350)
- Premium: Shoei GT-Air 3 (£500), Arai Profile-V (£480)
- Flip-up: Schuberth C5 (£450), Shoei Neotec 3 (£530)
- Adventure: Arai Tour-X5 (£450), Shoei Hornet ADV (£420)
**PPC bid**: £0.80-1.50 (competitive but highest volume)

#### 6.6 "Best Winter Motorcycle Gloves 2026" — `/gear/best-winter-motorcycle-gloves`
**Target keywords**: "winter motorcycle gloves UK", "best heated motorcycle gloves", "waterproof motorcycle gloves"
**Commission**: £6.35 per sale (avg £79)
**Seasonal**: Run PPC Sept-March only. Very low CPC in shoulder months.
**Products**: Rukka Virium 2.0 GTX (£170), Rev'it Stratos 3 GTX (£130), Oxford Montreal 4.0 (£60)

#### 6.7 "Best Motorcycle Helmet Under £200" — `/gear/best-motorcycle-helmet-under-200`
**Target keywords**: "cheap motorcycle helmet UK", "best helmet under 200", "budget motorcycle helmet"
**Commission**: ~£8-12 per sale
**PPC note**: Budget shoppers are often new riders = new SBS customers = 8% commission.

#### 6.8 "Best Summer Motorcycle Gear 2026" — `/gear/best-summer-motorcycle-gear`
**Target keywords**: "summer motorcycle jacket", "mesh motorcycle jacket", "summer motorcycle gear UK"
**Commission**: Mixed (jacket £15+, gloves £4, helmet £8)
**Seasonal**: Run PPC April-August.

### Tier 3 — Premium Product Reviews (£30-64 commission, ultra-low CPC)

#### 6.9 "Shoei Neotec 3 vs Schuberth C5: The Touring Helmet Showdown" — `/gear/shoei-neotec-3-vs-schuberth-c5`
**Target keywords**: "shoei neotec 3 review", "schuberth c5 review", "neotec 3 vs c5", "best touring helmet"
**Commission**: £42.40 (Neotec 3 @ £530) / £36.00 (C5 @ £450) per new customer
**CPC**: £0.30-0.50 (very specific, low competition)
**ROI**: Exceptional. 1 in 15 visitors buys = profit at almost any CPC.

#### 6.10 "Rev'it Defender 3 GTX Review: Is It Worth £500?" — `/gear/revit-defender-3-review`
**Target keywords**: "rev'it defender 3 review", "revit defender 3 gtx", "best adventure jacket"
**Commission**: £40.00 per new customer sale
**CPC**: £0.20-0.40

#### 6.11 "Rukka Nivala 2.0 Review: The Best Winter Touring Jacket?" — `/gear/rukka-nivala-review`
**Target keywords**: "rukka nivala review", "rukka nivala 2.0", "best winter motorcycle jacket"
**Commission**: **£64.00** per new customer sale (£800)
**CPC**: £0.15-0.30 (niche brand)
**ROI**: Best single-product ROI in entire catalogue.

#### 6.12 "Kriega OS-32 vs Givi Trekker Outback: Soft vs Hard Panniers" — `/gear/kriega-os32-vs-givi-trekker`
**Target keywords**: "kriega os-32 review", "givi trekker outback review", "soft panniers vs hard motorcycle"
**Commission**: £24.00 (Kriega) / £20.80 (Givi) per sale
**CPC**: £0.15-0.30

#### 6.13 "Cardo Packtalk Edge vs Sena 50S: Best Motorcycle Intercom 2026" — `/gear/cardo-packtalk-vs-sena-50s`
**Target keywords**: "cardo vs sena", "best motorcycle intercom", "packtalk edge review", "sena 50s review"
**Commission**: £8.40-9.00 (reduced 3% rate on electronics)
**CPC**: £0.30-0.50
**Note**: Lower commission (reduced category) but VERY high search volume. Worth it for SEO traffic.

### Tier 4 — Whole-Basket Guides (£40-80 commission per conversion)

#### 6.14 "New Rider? Here's Every Piece of Gear You Need (Complete Kit Guide)" — `/gear/new-rider-kit-guide`
**Target keywords**: "what motorcycle gear do I need", "new rider motorcycle kit", "CBT gear list", "motorcycle gear for beginners"
**Commission**: £40-80 per conversion (full kit: helmet + jacket + gloves + boots = £500-1000 basket)
**CPC**: £0.10-0.25 (informational, very cheap)
**Strategy**: This is the highest-value article. New riders = definitely new SBS customers (8%). They buy EVERYTHING at once.
**Format**: Section per gear type, budget/mid/premium option for each, total cost calculators at bottom.

#### 6.15 "Complete Motorcycle Touring Kit: Head-to-Toe for Under £1,000" — `/gear/touring-kit-under-1000`
**Target keywords**: "motorcycle touring gear", "motorcycle touring kit list", "how much does motorcycle gear cost"
**Commission**: £60-80 per conversion (full touring setup)
**CPC**: £0.15-0.30

#### 6.16 "Motorcycle Commuter Kit: The 12 Essentials" — `/gear/commuter-kit-essentials`
**Target keywords**: "motorcycle commuting gear", "best motorcycle gear for commuting", "motorcycle commute essentials"
**Commission**: £30-50 per conversion (waterproofs + gloves + lock + lights)
**CPC**: £0.10-0.20

#### 6.17 "Scotland NC500 Gear Guide: What to Pack for the Ultimate Tour" — `/gear/nc500-gear-guide`
**Target keywords**: "nc500 motorcycle gear", "what to wear motorcycle scotland", "nc500 packing list"
**Commission**: £40-60 (touring jacket + waterproofs + luggage)
**CPC**: £0.10-0.15 (niche, almost zero competition)
**Cross-sell**: Links to existing NC500 route page. Riders planning this trip WILL buy gear.

#### 6.18 "Winter Riding Survival Kit: Head-to-Toe Cold Weather Gear" — `/gear/winter-riding-kit`
**Target keywords**: "motorcycle winter gear UK", "winter motorcycle riding kit", "riding motorcycle in winter"
**Commission**: £40-60 (thermal jacket + winter gloves + heated gear + balaclava)
**Seasonal**: PPC Sept-Feb only.

### Tier 5 — Comparison & "vs" Articles (Hyper-Intent)

#### 6.19 "Textile vs Leather Motorcycle Jacket: Which Should You Buy?" — `/gear/textile-vs-leather`
**Target keywords**: "textile vs leather motorcycle jacket", "motorcycle jacket material"
**Products**: 3 best textile, 3 best leather at each price point.

#### 6.20 "Gore-Tex vs Drystar vs Hipora: Waterproof Membrane Showdown" — `/gear/gore-tex-vs-drystar`
**Target keywords**: "gore-tex vs drystar motorcycle", "best waterproof motorcycle jacket membrane"
**Products**: Pair jackets from each technology at 3 price points.

#### 6.21 "Flip-Up vs Full-Face Helmet: Pros, Cons & Best Options" — `/gear/flip-up-vs-full-face`
**Target keywords**: "flip up vs full face", "modular helmet vs full face", "are flip up helmets safe"

#### 6.22 "Alpinestars vs Dainese: Which Brand is Better for Touring?" — `/gear/alpinestars-vs-dainese`
**Target keywords**: "alpinestars vs dainese", "best motorcycle gear brand"
**Commission**: Both brands avg £200-400, so £16-32 per sale.

### Tier 6 — How-To Articles (SEO Funnels)

These rank for informational queries and funnel readers into buying guides:

#### 6.23 "How to Choose the Right Motorcycle Helmet Size" — `/gear/guides/helmet-sizing`
**Funnel to**: Best Helmets listicle
**Keywords**: "motorcycle helmet size chart", "how to measure head for motorcycle helmet"

#### 6.24 "How to Choose a Motorcycle Jacket: The Complete Guide" — `/gear/guides/jacket-guide`
**Funnel to**: Best Touring Jackets, Textile vs Leather
**Keywords**: "how to choose motorcycle jacket", "motorcycle jacket buying guide"

#### 6.25 "How to Layer for British Weather on a Motorcycle" — `/gear/guides/layering-guide`
**Funnel to**: Winter Kit, Seasonal Gear articles
**Keywords**: "motorcycle layering", "what to wear under motorcycle jacket"

#### 6.26 "CE Armour Ratings Explained: Level 1 vs Level 2" — `/gear/guides/ce-armour-explained`
**Funnel to**: All clothing listicles
**Keywords**: "ce level 1 vs 2 motorcycle", "motorcycle armour ratings explained"

#### 6.27 "How to Waterproof Your Motorcycle Kit (Properly)" — `/gear/guides/waterproofing`
**Funnel to**: Waterproof jacket/boot/glove listicles
**Keywords**: "how to waterproof motorcycle jacket", "motorcycle waterproofing spray"

#### 6.28 "How to Pack Motorcycle Panniers for a Week-Long Tour" — `/gear/guides/packing-panniers`
**Funnel to**: Luggage listicle, NC500 Gear Guide
**Keywords**: "how to pack motorcycle panniers", "motorcycle touring packing tips"

#### 6.29 "How to Break In New Motorcycle Boots Without Pain" — `/gear/guides/breaking-in-boots`
**Funnel to**: Best Boots listicle
**Keywords**: "break in motorcycle boots", "new motorcycle boots hurt"

---

## SEO Target Keywords (Complete)

### High-Intent Buyer Queries (PPC-viable)
- "best motorcycle helmet UK 2026"
- "best touring jacket waterproof"
- "motorcycle gloves winter UK"
- "best motorcycle boots waterproof"
- "motorcycle panniers for touring"
- "best motorcycle jacket under 300"
- "best helmet under 200"
- "summer motorcycle jacket mesh"

### Product-Specific (Ultra-high intent, low CPC)
- "shoei neotec 3 review"
- "schuberth c5 review"
- "rev'it defender 3 review"
- "rukka nivala review"
- "kriega os-32 review"
- "cardo packtalk edge review"
- "alpinestars rt-8 gore-tex review"

### Comparison Queries (Very high conversion)
- "shoei neotec 3 vs schuberth c5"
- "cardo packtalk vs sena 50s"
- "textile vs leather motorcycle jacket"
- "gore-tex vs drystar motorcycle"
- "alpinestars vs dainese"
- "flip up vs full face helmet"
- "soft panniers vs hard panniers"

### Informational (SEO funnel top)
- "what motorcycle gear do I need"
- "how to choose motorcycle helmet"
- "motorcycle gear for beginners"
- "how much does motorcycle gear cost UK"
- "ce armour ratings explained"
- "how to layer for motorcycle riding"

### Location/Route-Specific (Zero competition)
- "nc500 motorcycle gear"
- "motorcycle gear for scotland"
- "what to wear motorcycle touring UK"
- "motorcycle winter riding UK"

---

## Build Order (When Scraping Completes)

### Sprint 1: Foundation + Highest-ROI Content
1. **`gear-catalogue.js`** — Category pages + brand pages + search/filter
2. **`gear-calculator.js`** — "Kit Me Out" budget calculator
3. **Article: New Rider Kit Guide** (6.14) — Highest basket value, lowest CPC
4. **Article: Best Touring Jackets** (6.1) — Highest commission per sale
5. **Article: Best Motorcycle Helmets** (6.5) — Highest search volume

### Sprint 2: Premium Reviews + Comparisons
6. **Article: Shoei Neotec 3 vs Schuberth C5** (6.9) — £36-42 commission, hyper-intent
7. **Article: Rev'it Defender 3 Review** (6.10) — £40 commission
8. **Article: Rukka Nivala Review** (6.11) — £64 commission (!)
9. **Article: Best Motorcycle Boots** (6.2) — £15.51 avg commission
10. **Article: Best Motorcycle Luggage** (6.3) — Low CPC, high margin

### Sprint 3: Seasonal + Budget Content
11. **Article: Best Winter Motorcycle Gloves** (6.6) — Seasonal PPC Sept-March
12. **Article: Touring Kit Under £1,000** (6.15) — Whole-basket guide
13. **Article: Best Helmet Under £200** (6.7) — Budget buyers = new customers
14. **Article: Best Jackets Under £300** (6.4) — Mid-range sweet spot
15. **Article: NC500 Gear Guide** (6.17) — Cross-sells existing route content

### Sprint 4: Comparison & How-To Funnels
16. **Article: Textile vs Leather** (6.19)
17. **Article: Gore-Tex vs Drystar** (6.20)
18. **Article: Flip-Up vs Full-Face** (6.21)
19. **Article: Alpinestars vs Dainese** (6.22)
20. **Article: Cardo vs Sena Intercom** (6.13)

### Sprint 5: How-To SEO Funnels
21. **Article: Helmet Sizing Guide** (6.23)
22. **Article: Jacket Buying Guide** (6.24)
23. **Article: Layering Guide** (6.25)
24. **Article: CE Armour Explained** (6.26)
25. **Article: Waterproofing Guide** (6.27)
26. **Article: Packing Panniers** (6.28)
27. **Article: Breaking In Boots** (6.29)

### Sprint 6: Tools + Cross-Selling
28. **`gear-colour.js`** — Colour matcher tool
29. **`gear-compare.js`** — Side-by-side product comparison
30. **Route gear sidebars** — Contextual gear on every route/destination page
31. **Packing list product links** — Affiliate links on existing checklist
32. **`gear-bike-match.js`** — Gear for my bike tool

### Sprint 7: Engagement + Retention
33. **Summer Gear Guide** (6.8) — Seasonal PPC April-August
34. **Winter Riding Kit** (6.18) — Seasonal PPC Sept-Feb
35. **Commuter Kit** (6.16) — Year-round
36. **Brand pages** — Auto-generated from catalogue data
37. **Price alerts** — Future: email signup for price drops
