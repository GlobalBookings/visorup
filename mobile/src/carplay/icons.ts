/**
 * Registers an icon font for CarPlay glyph images.
 *
 * @iternio/react-native-auto-play does not bundle an icon font, so we reuse the
 * MaterialIcons font that already ships with @expo/vector-icons (copied to
 * assets/fonts/material_icons.ttf and declared via expo-font in app.json).
 *
 * NOTE (needs on-device check): the first argument to setIconFont must match the
 * font's registered family name. If glyphs do not render on the car screen, try
 * 'MaterialIcons' / 'Material Icons' instead of 'material_icons'.
 */
import { MaterialIcons } from '@expo/vector-icons';
import { setIconFont } from '@iternio/react-native-auto-play';

let registered = false;

export function registerCarPlayIcons() {
  if (registered) return;
  try {
    const glyphMap = MaterialIcons.getRawGlyphMap() as unknown as Record<string, number>;
    setIconFont('material_icons', glyphMap);
    registered = true;
  } catch (_) {
    // Native module or font not present (e.g. running JS without a CarPlay build).
  }
}
