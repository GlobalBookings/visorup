import 'react-native-url-polyfill/auto';
import { Component, ReactNode, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Linking from 'expo-linking';
import { AppStorage } from '../lib/storage';
import { colors } from '../lib/theme';
import { extractSessionFromUrl } from '../lib/auth';
import { setupNotifications } from '../lib/notifications';
import { supabase } from '../lib/supabase';

SplashScreen.preventAutoHideAsync().catch(() => {});

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error('[RootLayout] Caught render error:', error);
    SplashScreen.hideAsync().catch(() => {});
  }

  render() {
    if (this.state.error) {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: colors.background,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <Text style={{ color: colors.textBright, fontSize: 18, fontWeight: '700', marginBottom: 8 }}>
            Something went wrong
          </Text>
          <Text style={{ color: colors.textMuted, textAlign: 'center' }}>
            Please restart the app. If the problem continues, reinstall from the App Store.
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function RootLayout() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      let done: string | null = null;
      try {
        done = await AppStorage.getItem('onboarding_done');
      } catch (e) {
        console.warn('[RootLayout] startup storage error:', e);
      } finally {
        await SplashScreen.hideAsync().catch(() => {});
        setReady(true);
      }
      if (!done) {
        setTimeout(() => router.replace('/onboarding'), 100);
      }
    })();
  }, []);

  useEffect(() => {
    const sub = Linking.addEventListener('url', async ({ url }) => {
      if (url.includes('access_token') || url.includes('code=')) {
        await extractSessionFromUrl(url);
      }
    });

    Linking.getInitialURL()
      .then((url) => {
        if (url && (url.includes('access_token') || url.includes('code='))) {
          extractSessionFromUrl(url);
        }
      })
      .catch(() => {});

    return () => sub.remove();
  }, []);

  // Register push notifications when user is authenticated
  useEffect(() => {
    let subscription: { unsubscribe: () => void } | undefined;
    try {
      const res = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setupNotifications().catch((e) => console.warn('[RootLayout] notifications error:', e));
        }
      });
      subscription = res.data.subscription;
    } catch (e) {
      console.warn('[RootLayout] auth subscription error:', e);
    }
    return () => {
      try {
        subscription?.unsubscribe();
      } catch {}
    };
  }, []);

  return (
    <ErrorBoundary>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.accent,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="onboarding" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="route/[id]"
          options={{ title: 'Route', presentation: 'card' }}
        />
        <Stack.Screen
          name="ride/[id]"
          options={{
            headerShown: false,
            presentation: 'fullScreenModal',
            animation: 'slide_from_bottom',
          }}
        />
      </Stack>
    </ErrorBoundary>
  );
}
