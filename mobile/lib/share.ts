import { Alert, Share } from 'react-native';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { buildGpx, gpxFileName, GpxWaypoint, LatLng } from './gpx';

/** Writes a GPX file (waypoints + track) and opens the share sheet. */
export async function exportGpx(opts: { name: string; waypoints?: GpxWaypoint[]; track?: LatLng[] }): Promise<void> {
  const gpx = buildGpx(opts);
  const fileName = gpxFileName(opts.name);
  try {
    const file = new File(Paths.document, fileName);
    if (file.exists) file.delete();
    file.create();
    file.write(gpx);
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(file.uri, { mimeType: 'application/gpx+xml', dialogTitle: 'Share GPX' });
    } else {
      Alert.alert('GPX Saved', `Saved as ${fileName}`);
    }
  } catch (e: any) {
    Alert.alert('Export failed', e?.message || 'Could not export GPX.');
  }
}

type SnapshotMap = { takeSnapshot?: (opts: any) => Promise<string> } | null;

/**
 * Shares a ride/route as a visual card: snapshots the map (route on the map)
 * and shares that image with the stats text. Falls back to text-only share.
 */
export async function shareRouteCard(map: SnapshotMap, message: string): Promise<void> {
  let uri: string | null = null;
  try {
    if (map?.takeSnapshot) {
      const shot = await map.takeSnapshot({ width: 900, height: 600, format: 'png', quality: 0.9, result: 'file' });
      uri = shot ? (shot.startsWith('file') || shot.startsWith('/') ? (shot.startsWith('/') ? `file://${shot}` : shot) : null) : null;
    }
  } catch {
    uri = null;
  }

  try {
    if (uri && (await Sharing.isAvailableAsync())) {
      await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: message });
      return;
    }
  } catch {
    // fall through to text share
  }

  try {
    await Share.share({ message });
  } catch {
    // user cancelled / unavailable
  }
}
