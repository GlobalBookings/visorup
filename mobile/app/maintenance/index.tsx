import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import { supabase, UserBike } from '../../lib/supabase';
import { tapHaptic, successHaptic } from '../../lib/haptics';
import { colors, spacing } from '../../lib/theme';
import {
  ServiceType, MaintenanceLog, DueStatus, SERVICE_ITEMS, TCLOCS,
  fetchLogs, addLog, deleteLog, computeDue,
} from '../../lib/maintenance';

const STATUS_COLORS: Record<DueStatus['status'], string> = {
  ok: colors.success,
  soon: colors.accent,
  overdue: colors.danger,
  unknown: colors.textMuted,
};

const STATUS_LABELS: Record<DueStatus['status'], string> = {
  ok: 'OK',
  soon: 'Soon',
  overdue: 'Overdue',
  unknown: 'Not logged',
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

function bikeLabel(b: UserBike) {
  return b.nickname || `${b.make} ${b.model}`;
}

function dueText(d: DueStatus): string {
  if (d.status === 'unknown') return 'Never serviced';
  const parts: string[] = [];
  if (d.dueInMiles != null) parts.push(d.dueInMiles <= 0 ? `${Math.abs(d.dueInMiles)} mi over` : `${d.dueInMiles} mi`);
  if (d.dueInDays != null) parts.push(d.dueInDays <= 0 ? `${Math.abs(d.dueInDays)} d over` : `${d.dueInDays} d`);
  if (parts.length === 0) return 'Logged';
  return d.status === 'overdue' ? `Overdue · ${parts.join(' / ')}` : `Due in ${parts.join(' / ')}`;
}

type LogForm = {
  service_type: ServiceType;
  mileage: string;
  cost: string;
  notes: string;
  serviced_at: string;
};

export default function MaintenanceScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bikes, setBikes] = useState<UserBike[]>([]);
  const [selectedBikeId, setSelectedBikeId] = useState<string | null>(null);
  const [logs, setLogs] = useState<MaintenanceLog[]>([]);
  const [mileage, setMileage] = useState('');
  const [logForm, setLogForm] = useState<LogForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [showTclocs, setShowTclocs] = useState(false);
  const [ticks, setTicks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    (async () => {
      const { data: { user: u } } = await supabase.auth.getUser();
      setUser(u);
      if (!u) { setLoading(false); return; }
      const { data } = await supabase
        .from('user_bikes')
        .select('*')
        .eq('user_id', u.id)
        .order('is_primary', { ascending: false });
      const list = (data as UserBike[]) || [];
      setBikes(list);
      if (list.length > 0) setSelectedBikeId(list[0].id);
      setLoading(false);
    })();
  }, []);

  const loadLogs = useCallback(async (bikeId: string) => {
    const l = await fetchLogs(bikeId);
    setLogs(l);
    const latestWithMileage = l.find((x) => x.mileage != null);
    setMileage(latestWithMileage?.mileage != null ? String(latestWithMileage.mileage) : '');
  }, []);

  useEffect(() => {
    if (selectedBikeId) loadLogs(selectedBikeId);
  }, [selectedBikeId, loadLogs]);

  const currentMileage = mileage.trim() ? parseInt(mileage, 10) || null : null;
  const dueList = computeDue(logs, currentMileage);

  const openLog = (type: ServiceType = 'oil') => {
    tapHaptic();
    setLogForm({
      service_type: type,
      mileage: mileage.trim(),
      cost: '',
      notes: '',
      serviced_at: new Date().toISOString().slice(0, 10),
    });
  };

  const saveLog = async () => {
    if (!logForm || !selectedBikeId) return;
    setSaving(true);
    const { error } = await addLog({
      bike_id: selectedBikeId,
      service_type: logForm.service_type,
      mileage: logForm.mileage.trim() ? parseInt(logForm.mileage, 10) || null : null,
      cost: logForm.cost.trim() ? parseFloat(logForm.cost) || null : null,
      notes: logForm.notes.trim() || null,
      serviced_at: logForm.serviced_at.trim() || new Date().toISOString().slice(0, 10),
    });
    setSaving(false);
    if (error) { Alert.alert('Could not save', error); return; }
    setLogForm(null);
    successHaptic();
    await loadLogs(selectedBikeId);
  };

  const confirmDelete = (log: MaintenanceLog) => {
    const item = SERVICE_ITEMS.find((s) => s.type === log.service_type);
    Alert.alert('Delete log', `Remove this ${item?.label || log.service_type} record?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteLog(log.id);
          if (selectedBikeId) await loadLogs(selectedBikeId);
        },
      },
    ]);
  };

  const openTclocs = () => {
    tapHaptic();
    setTicks({});
    setShowTclocs(true);
  };

  const toggleTick = (key: string) => {
    tapHaptic();
    setTicks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const tickedCount = TCLOCS.filter((t) => ticks[t.key]).length;
  const allTicked = tickedCount === TCLOCS.length;

  if (loading) return <View style={styles.center} />;

  if (!user) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: 'Maintenance' }} />
        <Ionicons name="construct-outline" size={48} color={colors.textMuted} />
        <Text style={styles.emptyText}>Sign in to track maintenance</Text>
      </View>
    );
  }

  if (bikes.length === 0) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: 'Maintenance' }} />
        <Ionicons name="construct-outline" size={48} color={colors.textMuted} />
        <Text style={styles.emptyText}>Add a bike in your garage first.</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => { tapHaptic(); router.push('/(tabs)/profile'); }}>
          <Text style={styles.primaryBtnText}>Go to garage</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Maintenance' }} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {bikes.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>
            {bikes.map((b) => {
              const active = b.id === selectedBikeId;
              return (
                <TouchableOpacity
                  key={b.id}
                  style={[styles.pill, active && styles.pillActive]}
                  onPress={() => { tapHaptic(); setSelectedBikeId(b.id); }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.pillText, active && styles.pillTextActive]} numberOfLines={1}>{bikeLabel(b)}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        <TouchableOpacity style={styles.tclocsBtn} onPress={openTclocs} activeOpacity={0.85}>
          <Ionicons name="shield-checkmark-outline" size={20} color={colors.background} />
          <Text style={styles.tclocsBtnText}>Pre-ride check (TCLOCS)</Text>
        </TouchableOpacity>

        <View style={styles.mileageCard}>
          <Text style={styles.formLabel}>Current mileage</Text>
          <TextInput
            style={styles.formInput}
            value={mileage}
            onChangeText={setMileage}
            keyboardType="number-pad"
            placeholder="e.g. 12500"
            placeholderTextColor={colors.textMuted}
          />
          <Text style={styles.formHint}>Used to work out when mileage-based services are due.</Text>
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Service status</Text>
          <TouchableOpacity style={styles.logBtn} onPress={() => openLog()}>
            <Ionicons name="add" size={16} color={colors.accent} />
            <Text style={styles.logBtnText}>Log service</Text>
          </TouchableOpacity>
        </View>

        {dueList.map((d) => (
          <TouchableOpacity key={d.type} style={styles.serviceRow} activeOpacity={0.7} onPress={() => openLog(d.type)}>
            <View style={styles.serviceIcon}>
              <Ionicons name={d.icon as any} size={18} color={colors.accent} />
            </View>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceLabel}>{d.label}</Text>
              <Text style={styles.serviceMeta}>
                {d.lastDate
                  ? `Last: ${fmtDate(d.lastDate)}${d.lastMileage != null ? ` · ${d.lastMileage} mi` : ''}`
                  : 'Never serviced'}
              </Text>
              <Text style={[styles.serviceDue, { color: STATUS_COLORS[d.status] }]}>{dueText(d)}</Text>
            </View>
            <View style={[styles.chip, { backgroundColor: STATUS_COLORS[d.status] }]}>
              <Text style={styles.chipText}>{STATUS_LABELS[d.status]}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <Text style={styles.sectionTitle}>Service history</Text>
        {logs.length === 0 ? (
          <Text style={styles.emptySub}>No service records yet. Tap "Log service" to add one.</Text>
        ) : (
          logs.map((log) => {
            const item = SERVICE_ITEMS.find((s) => s.type === log.service_type);
            return (
              <View key={log.id} style={styles.historyRow}>
                <View style={styles.serviceIcon}>
                  <Ionicons name={(item?.icon || 'construct-outline') as any} size={16} color={colors.textMuted} />
                </View>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceLabel}>{item?.label || log.service_type}</Text>
                  <Text style={styles.serviceMeta}>
                    {fmtDate(log.serviced_at)}
                    {log.mileage != null ? ` · ${log.mileage} mi` : ''}
                    {log.cost != null ? ` · £${log.cost}` : ''}
                  </Text>
                  {log.notes ? <Text style={styles.historyNotes}>{log.notes}</Text> : null}
                </View>
                <TouchableOpacity onPress={() => confirmDelete(log)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Ionicons name="trash-outline" size={16} color={colors.textMuted} />
                </TouchableOpacity>
              </View>
            );
          })
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      <Modal visible={!!logForm} animationType="slide" transparent onRequestClose={() => setLogForm(null)}>
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Log service</Text>
              <TouchableOpacity onPress={() => setLogForm(null)}>
                <Ionicons name="close" size={22} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            {logForm && (
              <ScrollView keyboardShouldPersistTaps="handled">
                <Text style={styles.formLabel}>What was done</Text>
                <View style={styles.typeRow}>
                  {SERVICE_ITEMS.map((s) => {
                    const active = s.type === logForm.service_type;
                    return (
                      <TouchableOpacity
                        key={s.type}
                        style={[styles.typePill, active && styles.pillActive]}
                        onPress={() => setLogForm({ ...logForm, service_type: s.type })}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.pillText, active && styles.pillTextActive]}>{s.label}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                <View style={styles.formRow2}>
                  <View style={styles.formCol}>
                    <Text style={styles.formLabel}>Mileage</Text>
                    <TextInput
                      style={styles.formInput}
                      value={logForm.mileage}
                      onChangeText={(t) => setLogForm({ ...logForm, mileage: t })}
                      keyboardType="number-pad"
                      placeholder="Optional"
                      placeholderTextColor={colors.textMuted}
                    />
                  </View>
                  <View style={styles.formCol}>
                    <Text style={styles.formLabel}>Cost (£)</Text>
                    <TextInput
                      style={styles.formInput}
                      value={logForm.cost}
                      onChangeText={(t) => setLogForm({ ...logForm, cost: t })}
                      keyboardType="decimal-pad"
                      placeholder="Optional"
                      placeholderTextColor={colors.textMuted}
                    />
                  </View>
                </View>
                <Text style={styles.formLabel}>Date</Text>
                <TextInput
                  style={styles.formInput}
                  value={logForm.serviced_at}
                  onChangeText={(t) => setLogForm({ ...logForm, serviced_at: t })}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.textMuted}
                  autoCapitalize="none"
                />
                <Text style={styles.formLabel}>Notes</Text>
                <TextInput
                  style={[styles.formInput, styles.formInputMulti]}
                  value={logForm.notes}
                  onChangeText={(t) => setLogForm({ ...logForm, notes: t })}
                  placeholder="Optional — parts, workshop, observations"
                  placeholderTextColor={colors.textMuted}
                  multiline
                />
                <TouchableOpacity style={[styles.primaryBtn, saving && styles.primaryBtnDisabled]} onPress={saveLog} disabled={saving}>
                  <Text style={styles.primaryBtnText}>{saving ? 'Saving...' : 'Save log'}</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={showTclocs} animationType="slide" transparent onRequestClose={() => setShowTclocs(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pre-ride check</Text>
              <TouchableOpacity onPress={() => setShowTclocs(false)}>
                <Ionicons name="close" size={22} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            <Text style={styles.progressText}>{tickedCount} / {TCLOCS.length} checked</Text>
            <ScrollView>
              {TCLOCS.map((t) => {
                const checked = !!ticks[t.key];
                return (
                  <TouchableOpacity key={t.key} style={styles.tclocsRow} onPress={() => toggleTick(t.key)} activeOpacity={0.7}>
                    <Ionicons
                      name={checked ? 'checkbox' : 'square-outline'}
                      size={24}
                      color={checked ? colors.accent : colors.textMuted}
                    />
                    <View style={styles.tclocsInfo}>
                      <Text style={styles.tclocsLabel}>{t.label}</Text>
                      <Text style={styles.tclocsDetail}>{t.detail}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
              {allTicked ? (
                <View style={styles.goodToRide}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                  <Text style={styles.goodToRideText}>Good to ride. Stay safe out there.</Text>
                </View>
              ) : null}
              <View style={{ height: 20 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl, gap: 10, backgroundColor: colors.background },
  scroll: { padding: spacing.md },
  emptyText: { color: colors.text, fontSize: 16, fontWeight: '600', marginTop: 8, textAlign: 'center' },
  emptySub: { color: colors.textMuted, fontSize: 13, textAlign: 'center', marginBottom: spacing.md },
  primaryBtn: { backgroundColor: colors.accent, borderRadius: 10, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, alignItems: 'center', marginTop: spacing.sm },
  primaryBtnDisabled: { opacity: 0.45 },
  primaryBtnText: { color: colors.background, fontSize: 15, fontWeight: '700' },
  pillRow: { gap: 8, paddingBottom: spacing.sm },
  pill: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, maxWidth: 200,
  },
  pillActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  pillText: { color: colors.text, fontSize: 13, fontWeight: '600' },
  pillTextActive: { color: colors.background, fontWeight: '700' },
  tclocsBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: colors.accent, borderRadius: 12, padding: spacing.md, marginBottom: spacing.md,
  },
  tclocsBtnText: { color: colors.background, fontSize: 15, fontWeight: '800' },
  mileageCard: {
    backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.border,
    padding: spacing.md, marginBottom: spacing.md,
  },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.sm, marginBottom: spacing.sm },
  sectionTitle: { color: colors.accent, fontSize: 13, fontWeight: '700', letterSpacing: 0.5, marginTop: spacing.md, marginBottom: spacing.sm },
  logBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 14,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
  },
  logBtnText: { color: colors.accent, fontSize: 12, fontWeight: '700' },
  serviceRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.surface, borderRadius: 10, padding: spacing.md,
    borderWidth: 1, borderColor: colors.border, marginBottom: spacing.xs,
  },
  serviceIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: colors.surfaceLight, justifyContent: 'center', alignItems: 'center',
  },
  serviceInfo: { flex: 1 },
  serviceLabel: { color: colors.text, fontSize: 14, fontWeight: '700' },
  serviceMeta: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  serviceDue: { fontSize: 12, fontWeight: '600', marginTop: 3 },
  chip: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  chipText: { color: colors.background, fontSize: 10, fontWeight: '800' },
  historyRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.surface, borderRadius: 10, padding: spacing.md,
    borderWidth: 1, borderColor: colors.border, marginBottom: spacing.xs,
  },
  historyNotes: { color: colors.textMuted, fontSize: 12, marginTop: 3, fontStyle: 'italic' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: colors.surface, borderTopLeftRadius: 16, borderTopRightRadius: 16,
    padding: spacing.lg, paddingBottom: Platform.OS === 'ios' ? 34 : spacing.lg,
    maxHeight: '85%', borderTopWidth: 1, borderColor: colors.border,
  },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  modalTitle: { color: colors.text, fontSize: 18, fontWeight: '800' },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.sm },
  typePill: {
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 16,
    backgroundColor: colors.surfaceLight, borderWidth: 1, borderColor: colors.border,
  },
  formRow2: { flexDirection: 'row', gap: 10 },
  formCol: { flex: 1 },
  formLabel: { color: colors.textMuted, fontSize: 12, fontWeight: '600', marginBottom: 4, marginTop: 8 },
  formInput: {
    backgroundColor: colors.surfaceLight, borderWidth: 1, borderColor: colors.border, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10, color: colors.text, fontSize: 15,
  },
  formInputMulti: { minHeight: 70, textAlignVertical: 'top' },
  formHint: { color: colors.textMuted, fontSize: 11, marginTop: 8, lineHeight: 16 },
  progressText: { color: colors.textMuted, fontSize: 13, fontWeight: '600', marginBottom: spacing.sm },
  tclocsRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  tclocsInfo: { flex: 1 },
  tclocsLabel: { color: colors.text, fontSize: 15, fontWeight: '700' },
  tclocsDetail: { color: colors.textMuted, fontSize: 12, marginTop: 2, lineHeight: 17 },
  goodToRide: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.surfaceLight, borderRadius: 10, padding: spacing.md, marginTop: spacing.md,
    borderWidth: 1, borderColor: colors.success,
  },
  goodToRideText: { color: colors.success, fontSize: 14, fontWeight: '700' },
});
