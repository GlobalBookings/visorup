import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, SectionList, TouchableOpacity, ActivityIndicator,
  RefreshControl, Modal, TextInput, Alert,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase, SavedTrip } from '../../lib/supabase';
import { tapHaptic, successHaptic } from '../../lib/haptics';
import { colors, spacing } from '../../lib/theme';

const UNFILED = 'Unfiled';

export default function MyRoutes() {
  const router = useRouter();
  const [routes, setRoutes] = useState<SavedTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [signedIn, setSignedIn] = useState(true);
  const [menuTarget, setMenuTarget] = useState<SavedTrip | null>(null);
  const [newFolder, setNewFolder] = useState('');

  const fetchRoutes = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSignedIn(false); setLoading(false); return; }
    setSignedIn(true);
    const { data } = await supabase
      .from('saved_trips')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });
    if (data) setRoutes(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchRoutes(); }, [fetchRoutes]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchRoutes();
    setRefreshing(false);
  }, [fetchRoutes]);

  const folders = [...new Set(routes.map((r) => r.folder).filter(Boolean) as string[])];

  const sections = [...folders, UNFILED]
    .map((f) => ({
      title: f,
      data: routes.filter((r) => (f === UNFILED ? !r.folder : r.folder === f)),
    }))
    .filter((s) => s.data.length > 0);

  const moveToFolder = async (trip: SavedTrip, folder: string | null) => {
    await supabase.from('saved_trips').update({ folder }).eq('id', trip.id);
    setMenuTarget(null);
    setNewFolder('');
    successHaptic();
    fetchRoutes();
  };

  const deleteRoute = (trip: SavedTrip) => {
    Alert.alert('Delete Route', `Delete "${trip.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await supabase.from('saved_trips').delete().eq('id', trip.id);
          setMenuTarget(null);
          fetchRoutes();
        },
      },
    ]);
  };

  const fmtDist = (m?: number) => (m ? `${Math.round(m * 0.000621371)} mi` : '');

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={colors.accent} /></View>;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'My Routes' }} />
      {!signedIn ? (
        <View style={styles.center}>
          <Ionicons name="lock-closed-outline" size={40} color={colors.textMuted} />
          <Text style={styles.emptyText}>Sign in to see your saved routes.</Text>
        </View>
      ) : routes.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="map-outline" size={40} color={colors.textMuted} />
          <Text style={styles.emptyText}>No saved routes yet.</Text>
          <Text style={styles.emptySub}>Build a route and save it to see it here.</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          stickySectionHeadersEnabled={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <Ionicons name={section.title === UNFILED ? 'documents-outline' : 'folder-outline'} size={14} color={colors.accent} />
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionCount}>{section.data.length}</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.7}
              onPress={() => { tapHaptic(); router.push(`/route/${item.id}`); }}
            >
              <Ionicons name="navigate-outline" size={18} color={colors.accent} />
              <View style={styles.cardInfo}>
                <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.cardMeta}>
                  {fmtDist(item.route_stats?.distance)}
                  {item.waypoints?.length ? ` · ${item.waypoints.length} stops` : ''}
                </Text>
              </View>
              <TouchableOpacity style={styles.menuBtn} onPress={() => { tapHaptic(); setMenuTarget(item); }}>
                <Ionicons name="ellipsis-vertical" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}

      <Modal visible={!!menuTarget} transparent animationType="fade" onRequestClose={() => setMenuTarget(null)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setMenuTarget(null)}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle} numberOfLines={1}>{menuTarget?.name}</Text>
            <Text style={styles.modalLabel}>Move to folder</Text>
            <View style={styles.folderChips}>
              {folders.filter((f) => f !== menuTarget?.folder).map((f) => (
                <TouchableOpacity key={f} style={styles.folderChip} onPress={() => menuTarget && moveToFolder(menuTarget, f)}>
                  <Ionicons name="folder-outline" size={12} color={colors.accent} />
                  <Text style={styles.folderChipText}>{f}</Text>
                </TouchableOpacity>
              ))}
              {menuTarget?.folder && (
                <TouchableOpacity style={styles.folderChip} onPress={() => menuTarget && moveToFolder(menuTarget, null)}>
                  <Ionicons name="close-circle-outline" size={12} color={colors.textMuted} />
                  <Text style={styles.folderChipText}>Unfile</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.newFolderRow}>
              <TextInput
                style={styles.newFolderInput}
                placeholder="New folder..."
                placeholderTextColor={colors.textMuted}
                value={newFolder}
                onChangeText={setNewFolder}
              />
              <TouchableOpacity
                style={[styles.newFolderBtn, !newFolder.trim() && { opacity: 0.4 }]}
                disabled={!newFolder.trim()}
                onPress={() => menuTarget && moveToFolder(menuTarget, newFolder.trim())}
              >
                <Text style={styles.newFolderBtnText}>Move</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.deleteRow} onPress={() => menuTarget && deleteRoute(menuTarget)}>
              <Ionicons name="trash-outline" size={16} color={colors.danger} />
              <Text style={styles.deleteRowText}>Delete route</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl, gap: 8 },
  emptyText: { color: colors.text, fontSize: 16, fontWeight: '600', marginTop: 8, textAlign: 'center' },
  emptySub: { color: colors.textMuted, fontSize: 13, textAlign: 'center' },
  list: { padding: spacing.lg },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.md, marginBottom: spacing.xs },
  sectionTitle: { color: colors.accent, fontSize: 12, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase', flex: 1 },
  sectionCount: { color: colors.textMuted, fontSize: 12, fontWeight: '600' },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.surface, borderRadius: 10, padding: spacing.md,
    borderWidth: 1, borderColor: colors.border, marginBottom: spacing.xs,
  },
  cardInfo: { flex: 1 },
  cardName: { color: colors.text, fontSize: 15, fontWeight: '700' },
  cardMeta: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  menuBtn: { padding: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: colors.surface, borderTopLeftRadius: 16, borderTopRightRadius: 16,
    padding: spacing.lg, paddingBottom: 36, gap: 4,
  },
  modalTitle: { color: colors.text, fontSize: 16, fontWeight: '800', marginBottom: 8 },
  modalLabel: { color: colors.textMuted, fontSize: 12, fontWeight: '700', marginTop: 4 },
  folderChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  folderChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.surfaceLight, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8,
    borderWidth: 1, borderColor: colors.border,
  },
  folderChipText: { color: colors.text, fontSize: 12, fontWeight: '600' },
  newFolderRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  newFolderInput: {
    flex: 1, backgroundColor: colors.surfaceLight, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10,
    color: colors.text, fontSize: 14, borderWidth: 1, borderColor: colors.border,
  },
  newFolderBtn: { backgroundColor: colors.accent, borderRadius: 8, paddingHorizontal: 18, justifyContent: 'center' },
  newFolderBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  deleteRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, marginTop: 6 },
  deleteRowText: { color: colors.danger, fontSize: 14, fontWeight: '700' },
});
