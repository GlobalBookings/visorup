import { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, Dimensions, TouchableOpacity, FlatList, Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { AppStorage } from '../lib/storage';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../lib/theme';

const { width } = Dimensions.get('window');

const slides = [
  {
    icon: 'map-outline' as const,
    color: '#4285F4',
    title: 'Plan Your Ride',
    desc: 'Build routes with twisty road preferences, fuel stops, and 1800+ points of interest across the UK.',
  },
  {
    icon: 'navigate-outline' as const,
    color: '#34A853',
    title: 'Live Navigation',
    desc: 'GPS-guided ride mode with speed, distance, ETA, and voice prompts. Works even off-route.',
  },
  {
    icon: 'people-outline' as const,
    color: '#9C27B0',
    title: 'Ride Community',
    desc: 'Share ride reports, photos, and routes. See what other riders are exploring.',
  },
  {
    icon: 'cloud-download-outline' as const,
    color: colors.accent,
    title: 'Built for Bikers',
    desc: 'Offline routes, weather along your path, fuel range alerts. Everything a touring rider needs.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIdx, setCurrentIdx] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const finish = async () => {
    await AppStorage.setItem('onboarding_done', '1');
    router.replace('/(tabs)');
  };

  const next = () => {
    if (currentIdx < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIdx + 1 });
      setCurrentIdx(currentIdx + 1);
    } else {
      finish();
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        keyExtractor={(_, i) => String(i)}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIdx(idx);
        }}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View style={[styles.iconCircle, { backgroundColor: `${item.color}20` }]}>
              <Ionicons name={item.icon} size={60} color={item.color} />
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.desc}>{item.desc}</Text>
          </View>
        )}
      />

      {/* Dots */}
      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, currentIdx === i && styles.dotActive]} />
        ))}
      </View>

      {/* Bottom */}
      <View style={styles.bottom}>
        <TouchableOpacity onPress={finish}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextBtn} onPress={next}>
          <Text style={styles.nextText}>{currentIdx === slides.length - 1 ? 'Get Started' : 'Next'}</Text>
          <Ionicons name="arrow-forward" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  slide: { width, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40, paddingTop: 100 },
  iconCircle: {
    width: 120, height: 120, borderRadius: 60,
    justifyContent: 'center', alignItems: 'center', marginBottom: 32,
  },
  title: { color: colors.text, fontSize: 28, fontWeight: '900', textAlign: 'center', letterSpacing: -0.5 },
  desc: { color: colors.textMuted, fontSize: 16, lineHeight: 24, textAlign: 'center', marginTop: 12 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 30 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.surfaceLight },
  dotActive: { backgroundColor: colors.accent, width: 24 },
  bottom: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingBottom: 50,
  },
  skipText: { color: colors.textMuted, fontSize: 15 },
  nextBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.accent, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24,
  },
  nextText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
