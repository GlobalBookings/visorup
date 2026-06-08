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

## SEO Target Keywords

**High-intent (buyer queries)**:
- "best motorcycle helmet UK 2026"
- "best touring jacket waterproof"
- "motorcycle gloves winter UK"
- "cheap motorcycle boots CE rated"
- "motorcycle luggage for [bike model]"

**Informational (guide queries)**:
- "how to choose motorcycle helmet"
- "textile vs leather motorcycle jacket"
- "what to wear motorcycle touring"
- "motorcycle gear cost UK"

**Comparison (vs queries)**:
- "Shoei NXR 2 vs Arai Quantic"
- "Cardo Packtalk vs Sena 50S"
- "Gore-Tex vs Drystar motorcycle"

---

## Build Order (When Scraping Completes)

1. **`gear-catalogue.js`** — Category pages + brand pages + search
2. **`gear-calculator.js`** — Budget calculator tool
3. **Buyer's guide articles** — 8 core guides with product embeds
4. **`gear-colour.js`** — Colour matcher
5. **Route gear sidebars** — Cross-sell on existing route pages
6. **Seasonal/budget articles** — 8 more SEO articles
7. **`gear-compare.js`** — Comparison tool
8. **How-to articles** — 7 practical guides
9. **Packing list product links** — Quick win cross-sell
10. **`gear-bike-match.js`** — Bike-specific gear tool
