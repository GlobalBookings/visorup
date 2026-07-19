/**
 * JoinGroupRide — Modal for joining or creating a group ride.
 *
 * Shows a 6-character code input, loading/error states, and a
 * "Create New Ride" option. On successful join, displays ride
 * name and leader info.
 */
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../lib/theme';
import { createGroupRide, joinGroupRide } from '../lib/group-ride';
import type { GroupRide } from '../lib/group-ride';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Props = {
  visible: boolean;
  onClose: () => void;
  onJoined: (ride: GroupRide) => void;
};

type ViewState = 'join' | 'create' | 'success';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function JoinGroupRide({ visible, onClose, onJoined }: Props) {
  const [view, setView] = useState<ViewState>('join');
  const [joinCode, setJoinCode] = useState('');
  const [rideName, setRideName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [joinedRide, setJoinedRide] = useState<GroupRide | null>(null);

  const reset = useCallback(() => {
    setView('join');
    setJoinCode('');
    setRideName('');
    setLoading(false);
    setError(null);
    setJoinedRide(null);
  }, []);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [onClose, reset]);

  const handleJoin = useCallback(async () => {
    if (joinCode.length < 6) {
      setError('Enter a 6-character join code');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const ride = await joinGroupRide(joinCode);
      setJoinedRide(ride);
      setView('success');
      // Short delay then notify parent
      setTimeout(() => onJoined(ride), 1200);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to join ride');
    } finally {
      setLoading(false);
    }
  }, [joinCode, onJoined]);

  const handleCreate = useCallback(async () => {
    if (!rideName.trim()) {
      setError('Enter a name for your ride');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const ride = await createGroupRide(rideName.trim());
      setJoinedRide(ride);
      setView('success');
      setTimeout(() => onJoined(ride), 1200);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to create ride');
    } finally {
      setLoading(false);
    }
  }, [rideName, onJoined]);

  const handleCodeChange = useCallback((text: string) => {
    // Only allow alphanumeric, uppercase, max 6 chars
    const cleaned = text.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 6);
    setJoinCode(cleaned);
    setError(null);
  }, []);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {view === 'join' && 'Join Group Ride'}
            {view === 'create' && 'Create Group Ride'}
            {view === 'success' && 'Joined!'}
          </Text>
          <Pressable style={styles.closeButton} onPress={handleClose}>
            <Ionicons name="close" size={24} color={colors.text} />
          </Pressable>
        </View>

        {/* Join view */}
        {view === 'join' && (
          <View style={styles.content}>
            <Text style={styles.subtitle}>
              Enter the 6-character code shared by your ride leader
            </Text>

            <TextInput
              style={styles.codeInput}
              value={joinCode}
              onChangeText={handleCodeChange}
              placeholder="ABCDEF"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={6}
              keyboardType="default"
              returnKeyType="go"
              onSubmitEditing={handleJoin}
              editable={!loading}
            />

            {error && (
              <View style={styles.errorRow}>
                <Ionicons name="alert-circle" size={16} color={colors.danger} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Pressable
              style={[
                styles.primaryButton,
                (loading || joinCode.length < 6) && styles.buttonDisabled,
              ]}
              onPress={handleJoin}
              disabled={loading || joinCode.length < 6}
            >
              {loading ? (
                <ActivityIndicator size="small" color={colors.textBright} />
              ) : (
                <>
                  <Ionicons name="enter-outline" size={18} color={colors.textBright} />
                  <Text style={styles.primaryButtonText}>Join Ride</Text>
                </>
              )}
            </Pressable>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Create new ride option */}
            <Pressable
              style={styles.secondaryButton}
              onPress={() => {
                setView('create');
                setError(null);
              }}
            >
              <Ionicons name="add-circle-outline" size={18} color={colors.accent} />
              <Text style={styles.secondaryButtonText}>Create New Ride</Text>
            </Pressable>
          </View>
        )}

        {/* Create view */}
        {view === 'create' && (
          <View style={styles.content}>
            <Text style={styles.subtitle}>
              Start a group ride and share the code with your mates
            </Text>

            <TextInput
              style={styles.nameInput}
              value={rideName}
              onChangeText={(t) => {
                setRideName(t);
                setError(null);
              }}
              placeholder="Ride name (e.g. Sunday Coastal Run)"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="words"
              autoCorrect={false}
              maxLength={50}
              returnKeyType="go"
              onSubmitEditing={handleCreate}
              editable={!loading}
            />

            {error && (
              <View style={styles.errorRow}>
                <Ionicons name="alert-circle" size={16} color={colors.danger} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Pressable
              style={[
                styles.primaryButton,
                (loading || !rideName.trim()) && styles.buttonDisabled,
              ]}
              onPress={handleCreate}
              disabled={loading || !rideName.trim()}
            >
              {loading ? (
                <ActivityIndicator size="small" color={colors.textBright} />
              ) : (
                <>
                  <Ionicons name="people" size={18} color={colors.textBright} />
                  <Text style={styles.primaryButtonText}>Create Ride</Text>
                </>
              )}
            </Pressable>

            <Pressable
              style={styles.backButton}
              onPress={() => {
                setView('join');
                setError(null);
              }}
            >
              <Text style={styles.backButtonText}>Back to Join</Text>
            </Pressable>
          </View>
        )}

        {/* Success view */}
        {view === 'success' && joinedRide && (
          <View style={styles.successContent}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark-circle" size={64} color={colors.success} />
            </View>
            <Text style={styles.successTitle}>{joinedRide.name}</Text>
            <Text style={styles.successSubtitle}>
              Led by {joinedRide.leaderName}
            </Text>
            <View style={styles.successCodeRow}>
              <Text style={styles.successCodeLabel}>Join code:</Text>
              <Text style={styles.successCodeValue}>{joinedRide.joinCode}</Text>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    color: colors.textBright,
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    padding: spacing.xs,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  codeInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    color: colors.textBright,
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 6,
  },
  nameInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.textBright,
    fontSize: 16,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
  primaryButtonText: {
    color: colors.textBright,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginVertical: spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    color: colors.textMuted,
    fontSize: 13,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 12,
    paddingVertical: spacing.md,
  },
  secondaryButtonText: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  backButtonText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  successContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  successIcon: {
    marginBottom: spacing.md,
  },
  successTitle: {
    color: colors.textBright,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  successSubtitle: {
    color: colors.textMuted,
    fontSize: 15,
  },
  successCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  successCodeLabel: {
    color: colors.textMuted,
    fontSize: 13,
  },
  successCodeValue: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 2,
  },
});
