import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { supabase } from './supabase';

WebBrowser.maybeCompleteAuthSession();

const redirectUri = AuthSession.makeRedirectUri({ scheme: 'visorup', path: 'auth/callback' });

export { redirectUri };

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUri,
      skipBrowserRedirect: true,
    },
  });

  if (error || !data.url) {
    throw new Error(error?.message || 'Failed to get auth URL');
  }

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);

  if (result.type === 'success' && result.url) {
    return extractSessionFromUrl(result.url);
  }

  return false;
}

export async function extractSessionFromUrl(url: string): Promise<boolean> {
  try {
    // Supabase returns tokens in the URL fragment (#access_token=...&refresh_token=...)
    const parsed = new URL(url);

    // Try hash fragment first (implicit grant)
    let params = new URLSearchParams(parsed.hash.substring(1));
    let accessToken = params.get('access_token');
    let refreshToken = params.get('refresh_token');

    // Also check query params in case fragment is empty
    if (!accessToken) {
      accessToken = parsed.searchParams.get('access_token');
      refreshToken = parsed.searchParams.get('refresh_token');
    }

    if (accessToken && refreshToken) {
      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      if (error) throw error;
      return true;
    }

    // PKCE flow - exchange code for session
    const code = parsed.searchParams.get('code');
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) throw error;
      return true;
    }
  } catch (e: any) {
    console.warn('[Auth] Failed to extract session:', e.message);
  }

  return false;
}
