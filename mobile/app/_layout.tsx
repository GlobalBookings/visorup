import { useEffect, useCallback, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Linking from 'expo-linking';
import { AppStorage } from '../lib/storage';
import { colors } from '../lib/theme';
import { extractSessionFromUrl } from '../lib/auth';
import { setupNotifications } from '../lib/notifications';
import { supabase } from '../lib/supabase';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const done = await AppStorage.getItem('onboarding_done');
      await SplashScreen.hideAsync();
      setReady(true);
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

    Linking.getInitialURL().then((url) => {
      if (url && (url.includes('access_token') || url.includes('code='))) {
        extractSessionFromUrl(url);
      }
    });

    return () => sub.remove();
  }, []);

  // Register push notifications when user is authenticated
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setupNotifications();
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
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
    </>
  );
}
