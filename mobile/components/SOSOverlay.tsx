import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Pressable,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../lib/theme';
import { SOSStatus } from '../lib/emergency-sos';
import { cancelSOS, subscribeSOSState } from '../lib/emergency-sos';

export function SOSOverlay() {
  const [status, setStatus] = useState<SOSStatus | null>(null);
  const [pulseAnim] = useState(() => new Animated.Value(1));

  useEffect(() => {
    const unsubscribe = subscribeSOSState((s) => {
      setStatus(s);
    });
    return unsubscribe;
  }, []);

  // Pulse animation during countdown
  useEffect(() => {
    if (status?.state !== 'countdown') return;

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [status?.state]);

  if (!status || status.state === 'idle') return null;

  if (status.state === 'sent') {
    return (
      <View style={styles.container}>
        <View style={styles.sentContent}>
          <Ionicons name="checkmark-circle" size={80} color={colors.success} />
          <Text style={styles.sentHeading}>SOS Sent</Text>
          <Text style={styles.sentSubtext}>
            Emergency contacts have been notified
          </Text>
          {status.contacts.length > 0 && (
            <View style={styles.contactsList}>
              {status.contacts.map((contact) => (
                <Text key={contact.id} style={styles.contactName}>
                  {contact.name} ({contact.relationship})
                </Text>
              ))}
            </View>
          )}
          <Text style={styles.emergencyText}>
            999 emergency call initiated
          </Text>
        </View>
      </View>
    );
  }

  if (status.state === 'alerting') {
    return (
      <View style={styles.container}>
        <View style={styles.alertingContent}>
          <Ionicons name="radio" size={60} color="#ffffff" />
          <Text style={styles.alertingHeading}>Contacting Emergency Services...</Text>
        </View>
      </View>
    );
  }

  // Countdown state
  return (
    <TouchableWithoutFeedback onPress={cancelSOS}>
      <View style={styles.container}>
        <View style={styles.countdownContent}>
          <Ionicons name="warning" size={48} color="#ffffff" />
          <Text style={styles.crashHeading}>Crash Detected</Text>

          <Animated.View style={[styles.timerCircle, { transform: [{ scale: pulseAnim }] }]}>
            <Text style={styles.timerNumber}>{status.secondsRemaining}</Text>
          </Animated.View>

          <Text style={styles.countdownSubtext}>
            Contacting emergency services in {status.secondsRemaining} seconds
          </Text>

          <Text style={styles.cancelInstruction}>
            Tap anywhere to cancel
          </Text>

          <Pressable style={styles.cancelButton} onPress={cancelSOS}>
            <Ionicons name="close-circle" size={24} color="#ffffff" />
            <Text style={styles.cancelButtonText}>Cancel SOS</Text>
          </Pressable>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    zIndex: 9999,
    backgroundColor: 'rgba(255, 30, 30, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  countdownContent: {
    alignItems: 'center',
    gap: spacing.lg,
  },
  crashHeading: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 1,
  },
  timerCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 4,
    borderColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  timerNumber: {
    color: '#ffffff',
    fontSize: 64,
    fontWeight: '900',
    lineHeight: 72,
  },
  countdownSubtext: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  cancelInstruction: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: spacing.sm,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#ffffff',
    marginTop: spacing.xl,
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  alertingContent: {
    alignItems: 'center',
    gap: spacing.lg,
  },
  alertingHeading: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
  },
  sentContent: {
    alignItems: 'center',
    gap: spacing.md,
  },
  sentHeading: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
  },
  sentSubtext: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 16,
    textAlign: 'center',
  },
  contactsList: {
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  contactName: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  emergencyText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    textAlign: 'center',
    marginTop: spacing.lg,
    fontStyle: 'italic',
  },
});
