# VisorUp — Build Document

## Project Overview

VisorUp is a premium motorcycle touring and adventure travel platform focused on the United Kingdom, Scotland, Wales, England, Northern Ireland, the Channel Islands, Isle of Man, and future European expansion.

**Live URL:** https://motorbike-tour.pages.dev (staging) → visorup.co.uk (production)

**Tagline:** "Motorcycle Adventures Across Britain"
**Alternative:** "From Island Roads To Highland Horizons"

## Brand Identity

### Personality
Adventurous, practical, helpful, authentic, inspiring. Explorer mentality. Safety conscious. Premium photography. Real rider experiences. NOT a biker gang site, NOT a racing site, NOT Harley-focused.

### Visual References
- Long Way Round
- National Geographic Adventure
- Top Gear Road Trips
- Motorcycle Adventure Magazine
- The Dyrt / Komoot / RevZilla Common Tread

### Colour Palette
| Name | Hex | Usage |
|------|-----|-------|
| Forest Green | #0D3B2E | Primary brand, footer, badges |
| Slate Grey | #2B3137 | Secondary backgrounds |
| Road White | #F4F4F4 | Light mode background, text |
| Sunrise Amber | #D68A2D | Accent, CTAs, highlights |

### Typography
- **Display:** Playfair Display (700, 900) — hero titles, section headings, card titles
- **Body:** Inter (400-900) — everything else

### Logo
Text mark: VISOR**UP** with motorcycle icon (Font Awesome fa-motorcycle). Icon colour: Sunrise Amber. Text: white/dark based on context.

## Technical Architecture

### Stack
- **Frontend:** Vanilla JavaScript (no frameworks, no build step)
- **Styling:** CSS3 with CSS custom properties for theming
- **Maps:** Leaflet.js 1.9.4
- **Routing:** OSRM (Open Source Routing Machine) public API
- **Icons:** Font Awesome 6.5.1
- **Fonts:** Google Fonts (Inter + Playfair Display)
- **Hosting:** Cloudflare Pages (free tier)
- **Deployment:** Wrangler CLI (`npx wrangler pages deploy`)

### File Structure
```
/MotorbikeTour
├── index.html          — App shell (nav, site-view, planner-view)
├── styles.css          — Complete design system (~2300 lines)
├── site.js             — SPA router, all page renderers (~1150 lines)
├── app.js              — Leaflet map planner engine (~610 lines)
├── data.js             — Flagship route data: 14 days, 130+ POIs (~1600 lines)
├── trip-builder.js     — Trip builder wizard (future use)
├── CHANGELOG.md        — Version history
├── BUILD_DOCUMENT.md   — This document
└── trips/
    └── jc-scotland.js  — Saved trip module (backup of data.js)
```

### Routing Architecture
Hash-based SPA routing via site.js:
- `#/` → Homepage
- `#/routes` → Routes listing
- `#/routes/island-to-highlands` → Switches to planner view (app.js)
- `#/destinations` → Destinations listing
- `#/destinations/{slug}` → Individual destination
- `#/ferries` → Ferry guides listing
- `#/ferries/{slug}` → Individual ferry guide
- `#/planning` → Trip planning tools
- `#/gear`, `#/reports`, `#/community` → Coming soon pages

### Map Planner Architecture
- `app.js` contains `TripPlanner` class
- `initPlanner()` global function — called by site.js when entering planner view
- OSRM routes calculated sequentially on load with 300ms delays
- GPX export uses proper GPX 1.1 XML with tracks + waypoints
- Ferry routes rendered as dashed polylines
- 14 custom marker types with Font Awesome icons

### Theming
- CSS custom properties under `[data-theme="dark"]` and `[data-theme="light"]`
- Stored in localStorage key `visorup-theme`
- Toggle button swaps sun/moon icon

## Content

### Destinations (13 live)
Isle of Skye, Glencoe, NC500, Lake District, Yorkshire Dales, Snowdonia, Brecon Beacons, Outer Hebrides, Isle of Man, Scottish Borders, Northumberland, Jersey, Guernsey

### Ferry Guides (6 live)
Guernsey to UK, Jersey to UK, Isle of Man, Mallaig to Skye, Outer Hebrides, Orkney

### Routes (1 live, 5 coming soon)
- **Island To Highlands** (LIVE) — 14 days, 1,880 miles, Guernsey → Scotland
- The Welsh Dragon — 5 days, 650 miles
- Highland 500 — 7 days, 520 miles
- Lake District Loop — 3 days, 280 miles
- Channel Islands Escape — 4 days, 180 miles
- Coastal Cornwall — 4 days, 350 miles

### Flagship Route: Island To Highlands
14-day itinerary:
1. Guernsey → Dorset (ferry + Jurassic Coast)
2. Dorset → Brecon Beacons (Cheddar Gorge, Black Mountain Pass)
3. Brecon → Peak District (Elan Valley, Cat and Fiddle)
4. Peak District → Lake District (Snake Pass, Hardknott, Wrynose)
5. Lake District → Scottish Borders (Hartside, Hadrian's Wall)
6. Borders → Glencoe (Duke's Pass, Rannoch Moor)
7. Glencoe → Isle of Skye (Glen Etive, Glenfinnan, ferry)
8. Isle of Skye full day (Quiraing, Storr, Talisker)
9. Skye → Applecross (Bealach na Ba)
10. Applecross → Durness (Torridon, Ullapool, Kylesku)
11. Durness → John O'Groats (north coast)
12. John O'Groats → Inverness (Dunrobin, dolphins)
13. Inverness → Cairngorms (Loch Ness, reindeer)
14. Cairngorms → Fort William (Steall Falls, Ben Nevis)

## Future Roadmap

### Phase 2 — Content Expansion
- [ ] Build out remaining 5 routes with full planner data
- [ ] Gear reviews section
- [ ] Ride reports blog with CMS
- [ ] Accommodation section (motorcycle-friendly hotels, B&Bs, wild camping)
- [ ] Weather integration per destination
- [ ] Image galleries for destinations

### Phase 3 — Interactive Features
- [ ] Trip builder wizard (poi-database.js + trip-builder.js)
- [ ] Search functionality across all content
- [ ] User accounts and saved trips
- [ ] GPX upload and route sharing
- [ ] Budget/fuel/distance calculators
- [ ] Comments on ride reports

### Phase 4 — Monetisation
- [ ] Affiliate links for accommodation booking
- [ ] Gear affiliate programme
- [ ] Ferry booking commission
- [ ] Premium route downloads
- [ ] Sponsored destination content

### Phase 5 — European Expansion
- [ ] France (Normandy, Pyrenees, Alps)
- [ ] Spain (Picos de Europa)
- [ ] Italy (Dolomites, Stelvio)
- [ ] Norway (Atlantic Road, Trollstigen)

## SEO Strategy

### URL Structure
Clean hash routes for now. Future migration to History API pushState for proper SEO:
- `/routes/scotland/island-to-highlands/`
- `/destinations/isle-of-skye/`
- `/ferries/guernsey-to-portsmouth/`

### Target Keywords
- UK motorcycle touring
- Best motorcycle roads UK
- NC500 motorcycle route
- Isle of Skye motorcycle
- Motorcycle ferry UK
- GPX motorcycle routes UK
- Wild camping motorcycle UK

### Schema Markup (planned)
- Organization
- Route/TouristAttraction for destinations
- FAQ for ferry guides
- BreadcrumbList for navigation

## Deployment

### Cloudflare Pages
```bash
npx wrangler pages deploy /path/to/MotorbikeTour --project-name=motorbike-tour
```

### Custom Domain
Point visorup.co.uk CNAME to motorbike-tour.pages.dev via Cloudflare DNS.

## Core Team
Built by VisorUp. Route planned and ridden by JC and crew (GSX-R1000 + Ninja 650).
