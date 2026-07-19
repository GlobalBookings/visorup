import { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  downloadRouteForOffline,
  getOfflineRouteList,
  deleteOfflineRoute,
  getOfflineStorageSize,
  isRouteOffline,
  subscribeDownloadProgress,
  DownloadProgress,
} from '../lib/offline-maps';
import { SavedTrip } from '../lib/supabase';
import { tapHaptic, successHaptic } from '../lib/haptics';
import { colors, spacing } from '../lib/theme';

type Props = {
  visible: boolean;
  onClose: () => void;
  trip?: SavedTrip | null;
};

type OfflineEntry = { id: string; name: string; downloadedAt: number; sizeBytes: number };

export function OfflineDownloadSheet({ visible, onClose, trip }: Props) {
  const [offlineRoutes, setOfflineRoutes] = useState<OfflineEntry[]>([]);
  const [storageSize, setStorageSize] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState<DownloadProgress | null>(null);
  const [alreadyOffline, setAlreadyOffline] = useState(false);

  const refresh = useCallback(async () => {
    const list = await getOfflineRouteList();
    setOfflineRoutes(list);
    setStorageSize(await getOfflineStorageSize());
    if (trip) setAlreadyOffline(await isRouteOffline(trip.id));
  }, [trip]);

  useEffect(() => {
    if (visible) refresh();
  }, [visible, refresh]);

  useEffect(() => {
    const unsub = subscribeDownloadProgress((p) => {
      setProgress(p);
      if (p.phase === 'done' || p.phase === 'error') {
        setDownloading(false);
        refresh();
        if (p.phase === 'done') successHaptic();
      }
    });
    return unsub;
  }, [refresh]);

  const handleDownload = async () => {
    if (!trip) return;
    tapHaptic();
    setDownloading(true);
    const pref = (trip.settings as any)?.road_preference || 'curvy';
    await downloadRouteForOffline(trip, pref);
  };

  const handleDelete = (entry: OfflineEntry) => {
    Alert.alert('Remove Offline Route', `Delete "${entry.name}" from offline storage?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteOfflineRoute(entry.id);
          refresh();
        },
      },
    ]);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const phaseLabel = (phase: string) => {
    switch (phase) {
      case 'routing': return 'Calculating route...';
      case 'steps': return 'Fetching turn-by-turn...';
      case 'pois': return 'Finding nearby POIs...';
      case 'saving': return 'Saving to device...';
      case 'done': return 'Download complete';
      case 'error': return 'Download failed';
      default: return 'Preparing...';
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Offline Maps</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.storageBar}>
          <Ionicons name="cloud-download-outline" size={18} color={colors.accent} />
          <Text style={styles.storageText}>
            {offlineRoutes.length} routes saved ({formatSize(storageSize)})
          </Text>
        </View>

        {trip && (
          <View style={styles.downloadSection}>
            <Text style={styles.sectionTitle}>
              {alreadyOffline ? 'Route Available Offline' : 'Save for Offline'}
            </Text>
            <Text style={styles.routeName}>{trip.name}</Text>

            {downloading && progress ? (
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${progress.progress * 100}%` }]} />
                </View>
                <Text style={styles.progressText}>{phaseLabel(progress.phase)}</Text>
                {progress.error && <Text style={styles.errorText}>{progress.error}</Text>}
              </View>
            ) : alreadyOffline ? (
              <View style={styles.offlineBadge}>
                <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                <Text style={styles.offlineText}>Available offline</Text>
              </View>
            ) : (
              <TouchableOpacity style={styles.downloadBtn} onPress={handleDownload}>
                <Ionicons name="download-outline" size={20} color="#fff" />
                <Text style={styles.downloadBtnText}>Download Route</Text>
              </TouchableOpacity>
            )}

            <Text style={styles.hint}>
              Downloads turn-by-turn navigation, nearby POIs, and fuel stations for use without signal.
            </Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Saved Routes</Text>
        <FlatList
          data={offlineRoutes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.routeRow}>
              <View style={styles.routeInfo}>
                <Text style={styles.routeItemName}>{item.name}</Text>
                <Text style={styles.routeMeta}>
                  {formatSize(item.sizeBytes)} · Saved {formatDate(item.downloadedAt)}
                </Text>
              </View>
              <TouchableOpacity onPress={() => handleDelete(item)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name="trash-outline" size={20} color={colors.danger} />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No routes saved for offline use yet.</Text>
          }
          style={styles.list}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  title: { fontSize: 22, fontWeight: '700', color: colors.textBright },
  closeBtn: { padding: spacing.sm },
  storageBar: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, backgroundColor: colors.surface, marginHorizontal: spacing.md, borderRadius: 10 },
  storageText: { color: colors.text, fontSize: 14 },
  downloadSection: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, backgroundColor: colors.surface, marginHorizontal: spacing.md, marginTop: spacing.md, borderRadius: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.textBright, paddingHorizontal: spacing.lg, marginTop: spacing.lg, marginBottom: spacing.sm },
  routeName: { fontSize: 15, color: colors.accent, marginBottom: spacing.md },
  downloadBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.accent, paddingVertical: 12, borderRadius: 10 },
  downloadBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  progressContainer: { marginVertical: spacing.sm },
  progressBar: { height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.accent, borderRadius: 3 },
  progressText: { color: colors.text, fontSize: 13, marginTop: 6 },
  errorText: { color: colors.danger, fontSize: 13, marginTop: 4 },
  offlineBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.sm },
  offlineText: { color: colors.success, fontSize: 14, fontWeight: '500' },
  hint: { color: colors.textMuted, fontSize: 12, marginTop: spacing.sm },
  list: { flex: 1, paddingHorizontal: spacing.md, marginTop: spacing.sm },
  routeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.surface, padding: spacing.md, borderRadius: 10, marginBottom: spacing.sm },
  routeInfo: { flex: 1, marginRight: spacing.md },
  routeItemName: { color: colors.textBright, fontSize: 15, fontWeight: '500' },
  routeMeta: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  emptyText: { color: colors.textMuted, fontSize: 14, textAlign: 'center', marginTop: spacing.xl },
});
