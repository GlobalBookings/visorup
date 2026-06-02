# DROID Build Prompt: VisorUp Route-Planning Tool

Copy everything below the line into DROID. It is written as a standalone agent brief.

---

## ROLE AND GOAL

You are building the route-planning and map-building tool for **VisorUp**, a UK and Channel Islands motorcycle touring platform. The content side (route guides, POIs, editorial) is handled separately. Your job is ONLY the interactive planner: the engine, the map UI, twistiness routing, GPX import/export, cloud save, and cross-device sync.

The target is to match the planning capability of Kurviger, Calimoto, Scenic, and TomTom Rider, while beating them on three things: web-first (no app required), free GPX export, and twistiness scored from real road geometry.

Do not build turn-by-turn voice navigation or offline map tiles in this scope. Those are deferred. Plan for them but do not implement them.

## OPERATING RULES

1. Never use the em dash character anywhere. Use a double hyphen or restructure the sentence.
2. Work in ordered phases. Do not start a phase until the previous phase passes its acceptance criteria.
3. Write tests for every module before marking it done. Show passing test output.
4. Do not invent features outside this spec. If something is ambiguous, list the options and pick the simplest one that meets the acceptance criteria, then state the assumption.
5. Commit after each completed module with a clear message. Keep commits small.
6. Prefer open-source, no-per-request-fee components. Avoid anything with a metered map or routing API where a self-hosted option exists.

## PHASE 0: AUDIT THE EXISTING APP (do this first, do not skip)

The current site is a hash-routed single-page app deployed at motorbike-tour.pages.dev with a `#/build-route` route that may or may not be a real planner. Before building anything:

1. Clone or open the existing repository. Identify the framework, the routing approach (hash vs history API), the map library if any, and whether `#/build-route` contains a working routing engine or a static placeholder.
2. Produce a short written inventory: what exists, what is a stub, what is missing against this spec.
3. Decide and state whether you are extending the existing codebase or scaffolding a fresh module that the existing app will mount. Default to extending if the stack matches Phase 1 below; otherwise scaffold fresh and document the integration point.

Output the inventory before writing code. Acceptance: a clear written audit and a stated build decision.

## TARGET STACK

- Frontend: Astro or Next.js with history-API routing (not hash routing). The planner page must have a real crawlable URL such as `/plan`.
- Map UI: MapLibre GL JS (open source, no per-map fees). Use a free or self-hosted tile source (OpenStreetMap raster to start, vector tiles later).
- Routing engine: self-hosted GraphHopper (Apache-licensed, OSM-based), running in Docker on a small VPS.
- Map data: Geofabrik OSM extracts for Great Britain plus the Channel Islands plus northern France (Normandy and Brittany), merged into one routing graph.
- Database: PostgreSQL with PostGIS for saved routes, waypoints, and POI-along-route queries.
- Auth and sync: simple email or OAuth accounts, routes stored server-side, fetchable across devices.
- Hosting: Cloudflare Pages for the frontend (already in use), VPS for GraphHopper and the API, managed Postgres or a Postgres container.

If the existing app already uses a different but adequate stack, keep it and note the deviation. Do not rewrite working code for stack purity alone.

## PHASE 1: ROUTING ENGINE (GraphHopper self-hosted)

Set up GraphHopper as the routing backend with a motorcycle-aware curvy profile.

Requirements:
1. Run GraphHopper in Docker. Download the Geofabrik extracts for Great Britain, the Channel Islands, and northern France, merge them with osmium, and build a single graph.
2. Enable the `curvature` encoded value (available since GraphHopper 7.0). Enable elevation import so elevation profiles and slope are available.
3. Define custom models as JSON for at least three twistiness levels by adjusting `priority`, `speed`, and `distance_influence`:
   - `fast`: shortest sensible time, motorways allowed.
   - `curvy`: weight curvature up, mild detour tolerance.
   - `twisty`: weight curvature heavily, high detour tolerance, penalise motorways and main roads.
   Start from GraphHopper's bundled `motorcycle.json` and `curvature.json` custom models as references.
4. Enable Contraction Hierarchies or Landmarks for fast query response. Target sub-300ms for a typical 200km GB route on the VPS.
5. Expose the GraphHopper HTTP API behind your own thin API layer so the frontend never calls GraphHopper directly. The API layer handles auth, rate limiting, and request shaping (injecting the right custom model per twistiness level).

Acceptance:
- A POST to your API with start, end, and a twistiness level returns a route geometry, distance, time, and an elevation array.
- Switching twistiness level visibly changes the returned route on the same start and end pair.
- A round-trip request (see Phase 3) is stubbed but not required yet.

## PHASE 2: MAP UI AND WAYPOINT PLANNING

Build the interactive planner front end on MapLibre GL.

Requirements:
1. Full-screen map with OSM tiles. Pan, zoom, and a clean control layout that works one-handed on mobile (large tap targets, glove-aware).
2. Click to add waypoints. Drag waypoints to move them. Drag the route line to insert shaping points. Delete waypoints. Reorder via drag in a sidebar list.
3. Render the route polyline returned from the Phase 1 API. Show total distance, estimated ride time, and a waypoint list.
4. Twistiness control: a three-position selector (fast, curvy, twisty) that re-requests the route from the API.
5. Geocoding search box for place names (use a free geocoder such as Nominatim self-hosted or Photon; do not use a metered paid geocoder).
6. Responsive layout. The mobile web view must be usable without an app, with the map dominant and controls collapsible.

Acceptance:
- A user can search a start, click waypoints, drag to reshape, switch twistiness, and see the route and stats update live.
- Works on a phone browser with touch, one-handed.

## PHASE 3: ROUND-TRIP GENERATOR AND AVOIDANCE OPTIONS

These are the most-loved features across Calimoto, Scenic, and TomTom. Build both.

Requirements:
1. Round-trip generator: user sets a start point, a target distance, and a heading or "surprise me" direction. Generate a loop returning to start, respecting the active twistiness level. Use GraphHopper's round-trip algorithm or a custom heading-and-distance approach.
2. Avoidance toggles applied to the routing request: avoid motorways, avoid main roads, avoid toll roads, avoid ferries, avoid unpaved, avoid narrow lanes. Implement via custom-model adjustments or GraphHopper blocking parameters.
3. Avoidances must combine with twistiness (for example, twisty plus avoid-motorways).

Acceptance:
- Generating a 150km loop from a GB start returns a closed loop near that distance that returns to the start.
- Toggling "avoid motorways" visibly removes motorway segments from a route that previously used them.

## PHASE 4: ELEVATION, SURFACE, AND POI-ALONG-ROUTE

Surface the data that unifies the tool with the content side.

Requirements:
1. Elevation profile: render an interactive elevation chart under the map from the elevation array. Hovering the chart highlights the point on the map.
2. Surface and road-type display: where OSM surface tags exist, flag unpaved or rough sections on the route and in a summary.
3. **Twistiness score from geometry**: compute a twistiness rating (1 to 5) for any planned route from its curvature per kilometre, derived from the route geometry. This same scoring function must be reusable by the content side to rate guide routes, so expose it as a shared, well-documented function or microservice.
4. POI-along-route: query the PostGIS POI table for fuel, biker cafes, and viewpoints within a buffer (for example 2km) of the route line, and show them as togglable markers. The POI table schema is shared with the content side; define it if it does not exist (id, name, type, lat, lng, metadata JSON).

Acceptance:
- Every planned route shows an elevation profile and a computed twistiness score.
- POIs within the buffer appear as markers and can be toggled by type.
- The twistiness scoring function is unit-tested against known curvy and straight routes and returns sensible relative scores.

## PHASE 5: GPX IMPORT AND EXPORT (the free wedge)

This is the key differentiator against Calimoto's paywall. GPX must be free.

Requirements:
1. Export the planned route as GPX. Embed waypoints intelligently so that a Garmin Zumo or TomTom Rider reproduces the planned line rather than recalculating its own route. Research and apply the "shaping points vs via points" distinction so device fidelity holds.
2. Also export KML and TomTom ITN for device compatibility.
3. Import GPX (and KML) uploaded by the user, render it on the map, and allow editing it as a new route.
4. Server-side generation so the files are clean and consistent. Validate against the GPX 1.1 schema.

Acceptance:
- Exported GPX loads on a Garmin and a TomTom and follows the intended line without major recalculation drift. (Document the test even if you cannot run it on real hardware; provide a validation script and a manual test checklist.)
- An imported GPX renders correctly and can be edited and re-exported.

## PHASE 6: ACCOUNTS, CLOUD SAVE, AND CROSS-DEVICE SYNC

Match the Kurviger Cloud model: plan on desktop, ride from phone.

Requirements:
1. Email or OAuth login. Keep it simple and secure (hashed credentials or delegated OAuth; never store plaintext passwords).
2. Save routes server-side with name, waypoints, twistiness level, avoidances, and computed stats.
3. List, open, rename, duplicate, and delete saved routes.
4. Cross-device sync: a route saved on desktop appears on the same account on mobile without manual transfer.
5. Curated-road overlay hook: a togglable map layer that displays VisorUp editorial routes (read from the shared content data source) on the planner, so users can plan onto known-good roads. Implement the toggle and data binding; the content data itself comes from the content side.

Acceptance:
- A logged-in user saves a route on one browser and sees it on another.
- The curated-road overlay toggles on and off and shows editorial routes when content data is present.

## PHASE 7: HARDENING AND HANDOFF

1. Rate-limit the API. Cache identical routing requests. Protect the GraphHopper instance from public direct access.
2. Add error states in the UI for failed routing, no route found, and offline.
3. Write a short README covering deployment, the OSM data refresh process, custom-model editing, and how to add a new avoidance option.
4. Document the deferred work explicitly: turn-by-turn navigation, offline map tiles, and device-sync integrations (Garmin Tread, TomTom MyDrive) are out of scope and noted for a future phase.

Acceptance:
- The full flow works end to end on a deployed staging URL: search, plan, reshape, twistiness, round-trip, avoidances, elevation, POIs, GPX export and import, save, and sync.
- README and deferred-work notes are committed.

## DELIVERABLES SUMMARY

1. Audit of the existing app and a stated build decision.
2. Self-hosted GraphHopper with GB plus Channel Islands plus N France graph and three twistiness custom models.
3. MapLibre planner UI with waypoint editing and live stats.
4. Round-trip generator and avoidance toggles.
5. Elevation profile, surface flags, geometry-based twistiness scoring (shared function), and POI-along-route.
6. Free GPX, KML, and ITN export plus GPX and KML import, device-fidelity validated.
7. Accounts, cloud save, cross-device sync, and the curated-road overlay hook.
8. Hardening, README, and documented deferred work.

Begin with Phase 0. Show me the audit and your build decision before writing any feature code.
