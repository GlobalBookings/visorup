# Changelog

All notable changes to the VisorUp motorcycle touring platform.

## [1.1.0] - 2026-06-04

### Massive POI Scrape + Editor's Picks Glow Effect

#### Part 1: POI Data Expansion
- Built Overpass API scraper (`scripts/scrape-pois.mjs`) querying OpenStreetMap for 14 POI categories across the UK
- Scraped 22,753 new POIs from OSM, merged with 686 existing hand-curated POIs for a total of 23,439
- Deduplication removed 117 duplicates within 500m radius (curated POIs always preserved)
- 5 new POI categories added: EV charging stations (5,000), motorcycle parking (600), repair shops (500), hotels/B&Bs (2,000), mountain passes (143)
- Existing categories expanded: campsites (2,500), pubs (3,000), viewpoints (1,579), castles (1,000), waterfalls (600), beaches (1,548), bridges (600), distilleries (800), landmarks (3,000)
- Scraper supports `--cached` flag to re-merge without re-querying Overpass API
- POI data split by region: England (15,952), Scotland (3,717), Wales/Islands (3,770)

#### Part 2: Editor's Picks Glow Effect
- Top 10 POIs per category per region tagged with `top: true` flag (542 total Editor's Picks)
- Selection criteria: curated descriptions get highest score, then Wikipedia/Wikidata presence, website links, tag richness
- Golden pulsing glow CSS animation (`@keyframes editorPickPulse`) on Editor's Pick markers
- Inline star badge and gold "Editor's Pick" ribbon beneath markers (no clipped pseudo-elements)
- Editor's Pick markers render at 34px (vs 22px regular) in a dedicated Leaflet pane (z-index 650) so they always display in front of regular markers
- POI name tooltip appears on hover beneath the gold ribbon
- "Editor's Picks Only" toggle button below destination maps to filter regular markers
- One-time onboarding callout on first map view explaining gold markers and the toggle (auto-dismisses after 12s, stored in localStorage)
- New category icons and colours wired into app.js, site.js, and trip-builder.js

---

## [1.0.0] - 2026-06-01

### Initial Release — Full Platform Launch

#### Added
- Complete SPA website with hash-based routing
- Dark/light theme toggle with localStorage persistence
- Cinematic homepage with full-viewport hero, stats, featured route, destination grid, ferry guides, planning tools, newsletter CTA
- 13 destination pages with real content (Isle of Skye, Glencoe, NC500, Lake District, Yorkshire Dales, Snowdonia, Brecon Beacons, Outer Hebrides, Isle of Man, Scottish Borders, Northumberland, Jersey, Guernsey)
- 6 ferry guide pages (Guernsey, Jersey, Isle of Man, Skye, Outer Hebrides, Orkney) with operators, costs, booking tips
- Trip Planning page with comprehensive packing checklist, fuel strategy guide, weather advice
- Routes listing page with 6 routes (1 live, 5 coming soon)
- Coming Soon pages for Gear Reviews, Ride Reports, Community
- 404 page with brand personality
- Full responsive footer with 4-column layout

#### Flagship Route: "Island To Highlands"
- 14-day route from Guernsey to Scottish Highlands via NC500
- 130+ curated points of interest across all 14 days
- Interactive Leaflet map with dark/street/terrain tile layers
- OSRM road-accurate route calculation for all 14 days
- GPX export: per-day and full-trip downloads
- 14 marker types: ferry, landmark, viewpoint, waterfall, road, camp, wildlife, fuel, beach, castle, distillery, pub, bridge, fossil
- Day-by-day sidebar with grouped stops, road ratings (1-5 stars), biker tips
- Route progress bar during OSRM calculation
- 11 bridges plotted (Clifton Suspension, Severn, Ribblehead Viaduct, Bridge of Orchy, Ballachulish, Sligachan Old Bridge, Skye Bridge, Kylesku, Kessock, Invermoriston, Carrbridge)
- 6 fossil/dinosaur sites (Kimmeridge Bay, Fossil Forest, An Corran Staffin, Staffin Dinosaur Museum, Knockan Crag, Hugh Miller Museum)
- Park4Night links for every campsite
- Ferry route visualization (dashed lines for Guernsey-Poole and Mallaig-Armadale)
- Bike-specific advice for GSX-R1000 and Ninja 650

#### Design
- Premium dark theme with Forest Green (#0D3B2E), Slate Grey (#2B3137), Road White (#F4F4F4), Sunrise Amber (#D68A2D)
- Playfair Display serif for hero/display, Inter for body text
- Cinematic photography via Unsplash
- Card hover animations with lift and shadow
- Staggered fade-in animations on page load
- Sidebar content animations

#### Technical
- Pure vanilla JS — no frameworks, no build step
- SPA hash routing (site.js)
- Leaflet.js for interactive maps
- OSRM for road-accurate route calculation
- GPX 1.1 export with waypoints and tracks
- Cloudflare Pages hosting
- Mobile-first responsive design (1024/768/380 breakpoints)
- ~8,000 lines of hand-written code across 6 files

---

## Build History (Development Phases)

### Phase 1: Initial Route Planner
- Created 7-day Guernsey to Scotland route
- Dark theme sidebar + Leaflet map
- Basic route polylines and POI markers
- Park4Night camp links

### Phase 2: Expanded to 14 Days
- Added Isle of Skye (Days 7-8)
- Added full NC500 loop (Days 9-12)
- Added Cairngorms and return (Days 13-14)
- Expanded to 130+ POIs
- Added new marker types: beach, castle, distillery, pub

### Phase 3: Bridges
- Added 11 bridge POIs across the route
- New bridge marker type with dedicated icon
- Clifton Suspension Bridge, Ribblehead Viaduct, Kylesku Bridge, Sligachan Old Bridge, etc.

### Phase 4: Fossil & Dinosaur Sites
- Added 6 fossil/dinosaur POIs
- Kimmeridge Bay (Jurassic Coast), Fossil Forest, An Corran dinosaur footprints (Skye), Staffin Dinosaur Museum, Knockan Crag, Hugh Miller Museum

### Phase 5: OSRM Road Routing + GPX Export
- Replaced rough polylines with OSRM road-accurate routes
- Added GPX download per day and full trip
- Route progress bar during calculation
- Real distance/duration from OSRM data

### Phase 6: VisorUp Rebrand
- Orange motorcycle brand identity
- Mobile responsive with sidebar overlay
- Trip pill badge system

### Phase 7: Full Platform Build
- SPA architecture with site.js router
- Homepage with cinematic hero
- 13 destination pages
- 6 ferry guide pages
- Trip planning tools
- Dark/light theme toggle
- New brand palette: Forest Green, Slate Grey, Road White, Sunrise Amber
- Playfair Display typography for heroes

### Phase 8: Bug Fixes & Polish
- Fixed 71 missing CSS classes for site content pages
- Fixed hero-stat class mismatch
- Fixed footer structure mismatch
- Fixed planner-back mobile positioning
- Added document.title updates
- Added breadcrumb styling
- Fixed copyright year
- Added mobile responsive rules for all content grids
- Added page transition effects
