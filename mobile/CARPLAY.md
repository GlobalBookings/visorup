# VisorUp CarPlay — Implementation Runbook

Status: **staged on branch `feature/carplay` only. `main` / production is untouched.**
Do **not** merge to `main` until CarPlay has been validated on real hardware (see "Testing").

## Why this is on a branch
VisorUp is a **managed Expo (CNG)** app: `ios/` and `android/` are regenerated at
build time, so CarPlay native code must be injected by a **config plugin**, not
committed. The app also runs on **React Native 0.85 (new architecture only)**, so the
old `react-native-carplay` does **not** work. The maintained, new-architecture library
is **`@iternio/react-native-auto-play`** (Nitro-based).

## Native setup (done + verified)
- Deps resolved against RN 0.85 / Expo 56: `@iternio/react-native-auto-play`,
  `react-native-nitro-modules`, `react-native-worklets` (kept in sync with reanimated),
  `expo-build-properties`, `patch-package`.
- `plugins/withCarPlay.js` injects: the `com.apple.developer.carplay-maps` entitlement,
  the `UIApplicationSceneManifest` (window + CarPlay head-unit scenes), and the
  `getRootViewForAutoplay` method in `AppDelegate.swift` (Expo SDK 56 / RN 0.85 signatures).
- `app.json` registers `expo-build-properties` (`buildReactNativeFromSource: true`,
  required by @iternio), `expo-font` (embeds the icon font) and `./plugins/withCarPlay`.
- `src/carplay/icons.ts` registers MaterialIcons via
  `setIconFont('material_icons', MaterialIcons.getRawGlyphMap())` — used for both menu
  and turn-by-turn maneuver glyphs.
- `app/_layout.tsx` calls `registerAutoPlay()` via a guarded dynamic import, so it is a
  no-op on web / any build without the native module.
- Build **succeeds**, @iternio compiles against RN 0.85, the phone app launches normally.

## What is implemented (`src/carplay/AutoPlay.tsx`)

### Menu flow (works on the CarPlay Simulator)
`Main menu (List)` → My Routes / Looped Ride / Search Location / Points of Interest.
- **My Routes** — saved routes + sample routes → route preview.
- **Looped Ride** — pick a distance → `lib/roundtrip.buildRoundTrip` round trip from GPS.
- **Search** — `lib/geocode.searchPlaces` (Nominatim, debounced) → pick a destination.
- **POIs** — category → nearest 12 by distance → pick a destination.
- The preview is a single `InformationTemplate` with distance/stops, an in-place
  Fastest/Curvy toggle (rebuilds via `updateItems`) and a **Start ride** action.

### Phone → CarPlay live sync (turn-by-turn)
- `lib/active-ride.ts` is a tiny dependency-free store shared by the phone ride screen
  and CarPlay (same JS runtime). It holds route coords, waypoints, live position/heading/
  speed, distance travelled, the current maneuver, and the full turn-by-turn step list +
  current step index.
- `app/ride/[id].tsx` drives it: `startActiveRide` on ride start, `updateActiveRide` in
  the location watcher, `endActiveRide` on stop + unmount.
- `AutoPlay.tsx` subscribes via `subscribeActiveRide(syncLiveRide)`:
  - **Real hardware:** a live `MapTemplate` (`LiveRideMap`) follows the rider, and a
    native CarPlay **navigation session** drives the OS maneuver cards:
    `startNavigation(tripFor(ride))` once, then `updateManeuvers` + `setManeuverState`
    each tick. OSRM maneuver `type`/`modifier` are mapped to `ManeuverType`/`TurnType`
    with MaterialIcons glyphs; traffic side is **Left** (UK).
  - **Simulator:** the map is guarded off (see limitation below); Start shows a live
    status `InformationTemplate` card instead, so the whole flow is still demoable.

## Hard CarPlay constraints (baked into the code — do not "simplify" away)
- **iOS 26 Simulator crashes on `MapTemplate`.** Apple's own `CarPlayTemplateUIHost`
  process throws `-[CPSTemplateInstance vehicleSupportsDestinationSharing]: unrecognized
  selector` when a `CPMapTemplate` loads. It is an Apple simulator bug we cannot patch, so
  the map is gated to `Device.isDevice` (`MAP_ENABLED`). The map + native turn-by-turn
  therefore only run on real hardware.
- **5-template stack limit.** CarPlay allows at most 5 templates on the nav stack, so the
  preview keeps route-type/Start as in-place updates rather than pushing more templates.
- **`AutoPlayRoot` must be registered.** The head-unit scene always mounts the RN root
  `AutoPlayRoot`; we register a default via `AppRegistry` in `registerAutoPlay` (a live
  `MapTemplate` re-registers it with `LiveRideMap` on device).
- **Do not flood the template bridge.** Location streams several times/sec; car-side
  refreshes are throttled to once per second (`LIVE_UPDATE_MS`) — un-throttling freezes
  CarPlay.
- **A CarPlay app cannot self-foreground.** It only pops to the front from the CarPlay
  home screen via an active navigation session (`startNavigation`), which needs the
  `MapTemplate` — so auto-foreground-on-Start works on **hardware only**. On the sim you
  must open VisorUp on the car screen first; then Start switches the view in-app.
- **Already-connected on load.** `didConnect` does not re-fire if CarPlay is attached when
  the JS (re)loads, so `registerAutoPlay` also reads `HybridAutoPlay.isConnected()`.

## Testing
- **Simulator (menu + live status card):** run the app, open **Simulator → I/O → External
  Displays → CarPlay**, tap the VisorUp icon (menu appears). Start a ride on the phone and
  feed motion via **Features → Location → Freeway Drive**; the live status card updates
  ~1/sec. `[CarPlay]` diagnostics print in dev (gated by `__DEV__`).
- **Real head unit (map + native turn-by-turn):** required to validate the map render,
  follow camera, native maneuver cards (glyphs/instruction/distance), auto-foreground on
  Start, and voice guidance. Expect small tuning: glyph names, distance units
  (meters vs yards/miles), roundabout exit numbers.

## Go-live checklist
1. **Apple CarPlay entitlement** — granted (App ID → CarPlay Navigation App). It flows
   into the provisioning profile on the next EAS/Xcode build.
2. **Validate on real hardware** (map + turn-by-turn) — the only thing the simulator can't cover.
3. **Merge** `feature/carplay` → `main` (only after hardware validation).
4. **Bump** `version` + iOS `buildNumber`, then `eas build --profile production` and `eas submit`.

## Notes / risks
- `buildReactNativeFromSource: true` makes iOS builds significantly slower.
- The library is early (v0.5.x); maneuver/trip APIs may need small tweaks on-device.
- **Icon font family name:** if maneuver/menu glyphs don't render on the car, try
  `'MaterialIcons'` / `'Material Icons'` in `src/carplay/icons.ts`.
- **Patches:** `patches/react-native+0.85.3.patch` and `patches/expo-splash-screen+56.0.10.patch`
  apply cleanly to the pinned versions; regenerate with `npx patch-package <pkg>` if bumped.

## Abandoning safely
Everything is on `feature/carplay`. `main` (the App Store build) is unaffected. To drop
CarPlay, simply don't merge this branch.
