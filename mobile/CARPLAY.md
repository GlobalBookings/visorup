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
  required by @iternio), `expo-font` (embeds the icon font), and `./plugins/withCarPlay`.
- `src/carplay/AutoPlay.tsx` — the CarPlay experience (type-checks against the library):
  on connect it lists the rider's saved routes (+ sample routes); selecting one opens a
  MapTemplate showing the route. Type-checked with `tsc`.
- **patch-package (done + verified):** `patch-package` + `postinstall-postinstall` added,
  `postinstall: "patch-package"` script wired. `patches/react-native+0.85.3.patch` and
  `patches/expo-splash-screen+56.0.10.patch` (adapted from the library's `0.83.5` / `57.0.2`
  patches) **apply cleanly** to your installed versions — confirmed with `npx patch-package`.
- **Icon font (done + verified):** reuses the MaterialIcons font already bundled with
  `@expo/vector-icons`, copied to `assets/fonts/material_icons.ttf` and declared via
  `expo-font` (`{"fonts": [...]}`). `src/carplay/icons.ts` registers it with
  `setIconFont('material_icons', MaterialIcons.getRawGlyphMap())`. Clean `expo prebuild`
  confirms the font lands in `UIAppFonts` + the Xcode project.
- **registerAutoPlay wired:** `app/_layout.tsx` calls it via a guarded dynamic import
  (`import('../src/carplay/AutoPlay').then(m => m.default())`), so it is a no-op on web /
  Expo Go / any build without the native module, and registers icons + templates otherwise.

## What could NOT be verified in this environment (needs a Mac)
Prebuild + type-checking pass, but the following require an actual iOS build and a
CarPlay head unit / Xcode CarPlay Simulator (macOS only):
- Whether @iternio's Swift/Nitro code **compiles** against RN 0.85.
- Whether the app still **launches** with the scene manifest in place (a bad scene
  setup can break the normal phone app, which is the main risk — hence branch-only).
- Whether CarPlay actually **renders** the list/map on a head unit.

## Remaining steps
The prep (patches, icon font, `registerAutoPlay` wiring) is done and validated via
`tsc` + clean `expo prebuild`. What's left is the actual native build/test loop.

1. **Apple portal (done):** App ID → enable **CarPlay Navigation App** → Save. EAS/Xcode
   regenerates the provisioning profile to include it on the next build.
2. **Build & run locally on your Mac (fastest loop):**
   ```bash
   git checkout feature/carplay
   cd mobile && npm install          # runs postinstall → patch-package
   npx expo prebuild -p ios          # regenerates ios/ with the CarPlay plugin
   npx expo run:ios                  # builds + launches in the iOS Simulator
   ```
   Needs CocoaPods (`sudo gem install cocoapods` or Homebrew). First build is slow
   (`buildReactNativeFromSource`). You can also open `ios/visorup.xcworkspace` in Xcode
   to read Swift/Nitro compile errors directly.
3. **Test CarPlay:** with the app running in the iOS Simulator, open the **Simulator**
   menu → **I/O → External Displays → CarPlay** to bring up the car screen and verify the
   route list + map render. You cannot test CarPlay from the phone screen alone.
4. **(Optional) Ship to TestFlight** once the local build is clean:
   ```bash
   eas build --platform ios --profile production
   eas submit --platform ios --latest
   ```

## Notes / risks
- `buildReactNativeFromSource: true` makes iOS builds significantly slower.
- The library is early (v0.5.x). Template APIs may need small tweaks during on-device
  validation; `AutoPlay.tsx` is a starting point, not a finished feature.
- **Icon font family name:** `setIconFont('material_icons', ...)` uses the font's
  filename. If glyphs don't render on the car screen, try `'MaterialIcons'` or
  `'Material Icons'` (the ttf's internal family name) in `src/carplay/icons.ts`.
- **Patch versions:** the committed patches were adapted from the library's `0.83.5` /
  `57.0.2` patches and currently apply cleanly to RN `0.85.3` / expo-splash-screen
  `56.0.10`. If you bump those packages, regenerate with `npx patch-package <pkg>`.
- Full turn-by-turn on the car screen (CPTrip / navigation session / maneuvers) is a
  follow-up; the guidance engine already exists in `lib/navigation.ts` + `lib/voice-nav.ts`.

## Abandoning safely
Everything is on `feature/carplay`. `main` (the App Store build) is unaffected. To drop
CarPlay, simply don't merge this branch.
