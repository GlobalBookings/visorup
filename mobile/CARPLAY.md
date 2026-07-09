# VisorUp CarPlay — Implementation Runbook

Status: **staged on branch `feature/carplay` only. `main` / production is untouched.**
Do **not** merge to `main` until CarPlay has been validated on a device (see "Testing").

## Why this is on a branch
VisorUp is a **managed Expo (CNG)** app: `ios/` and `android/` are regenerated at
build time, so CarPlay native code must be injected by a **config plugin**, not
committed. The app also runs on **React Native 0.85 (new architecture only)**, so
the old `react-native-carplay` and its Expo plugin do **not** work. The maintained,
new-architecture library is **`@iternio/react-native-auto-play`** (Nitro-based).

## What is already done on this branch
- Dependencies added and resolved against RN 0.85 / Expo 56:
  `@iternio/react-native-auto-play`, `react-native-nitro-modules`,
  `react-native-worklets@^0.9.1` (kept in sync with reanimated), `expo-build-properties`.
- `plugins/withCarPlay.js` — config plugin. **Verified via `expo prebuild`** to inject:
  - the `com.apple.developer.carplay-maps` entitlement,
  - the `UIApplicationSceneManifest` (window + CarPlay head-unit/dashboard/cluster scenes),
  - the `getRootViewForAutoplay` method in `AppDelegate.swift`.
- `app.json` — registers `expo-build-properties` (`ios.buildReactNativeFromSource: true`,
  required by @iternio) and `./plugins/withCarPlay`.
- `src/carplay/AutoPlay.tsx` — the CarPlay experience (type-checks against the library):
  on connect it lists the rider's saved routes (+ sample routes); selecting one opens a
  MapTemplate showing the route. Type-checked with `tsc`.

## What could NOT be verified in this environment (needs a Mac)
Prebuild + type-checking pass, but the following require an actual iOS build and a
CarPlay head unit / Xcode CarPlay Simulator (macOS only):
- Whether @iternio's Swift/Nitro code **compiles** against RN 0.85.
- Whether the app still **launches** with the scene manifest in place (a bad scene
  setup can break the normal phone app, which is the main risk — hence branch-only).
- Whether CarPlay actually **renders** the list/map on a head unit.

## Remaining steps (do these on a Mac, or via EAS + TestFlight)
1. **Apple portal (done):** App ID → enable **CarPlay Navigation App** → Save. EAS will
   regenerate the provisioning profile to include it on the next build.
2. **Apply @iternio patches (required).** The library ships `patch-package` patches for
   RN (timers on screen lock) and `expo-splash-screen` (scenes). Add `patch-package`,
   copy the patches from the library's `patches/` dir into `mobile/patches/`, and add a
   `postinstall: "patch-package"` script. Because `buildReactNativeFromSource` is on, the
   RN patch can be applied.
3. **Wire the headless task.** Add to the top of `app/_layout.tsx`:
   ```ts
   import registerAutoPlay from '../src/carplay/AutoPlay';
   registerAutoPlay();
   ```
   (Only takes effect once the native module is in the build.)
4. **Icons.** @iternio needs an icon font (e.g. Material Symbols) registered via
   `expo-font` + `setIconFont(...)` before any glyph is used. See the library README.
5. **Build & submit for testing:**
   ```bash
   eas build --platform ios --profile production
   eas submit --platform ios --latest
   ```
6. **Test CarPlay:** install the TestFlight build on an iPhone and connect it to a real
   CarPlay head unit (your car), or use the **Xcode CarPlay Simulator** on a Mac
   (Simulator → I/O → External Displays → CarPlay). You cannot test CarPlay from the
   phone screen alone.

## Notes / risks
- `buildReactNativeFromSource: true` makes iOS builds significantly slower.
- The library is early (v0.5.x). Template APIs may need small tweaks during on-device
  validation; `AutoPlay.tsx` is a starting point, not a finished feature.
- Full turn-by-turn on the car screen (CPTrip / navigation session / maneuvers) is a
  follow-up; the guidance engine already exists in `lib/navigation.ts` + `lib/voice-nav.ts`.

## Abandoning safely
Everything is on `feature/carplay`. `main` (the App Store build) is unaffected. To drop
CarPlay, simply don't merge this branch.
