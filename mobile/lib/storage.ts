import * as SecureStore from 'expo-secure-store';

/**
 * Safe storage adapter for Supabase auth (uses expo-secure-store).
 * Also provides getItem/setItem/removeItem for general app storage
 * with fallback to in-memory when native modules aren't available (Expo Go).
 */

// In-memory fallback for when native modules are unavailable
const memoryStore: Record<string, string> = {};

export const ExpoSecureStoreAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return memoryStore[key] ?? null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {
      memoryStore[key] = value;
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch {
      delete memoryStore[key];
    }
  },
};

/**
 * General-purpose storage for app data (onboarding state, cached routes, etc).
 * Uses SecureStore for small values, falls back to memory.
 */
export const AppStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return memoryStore[key] ?? null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      // SecureStore has a 2KB limit per value
      if (value.length > 2048) {
        memoryStore[key] = value;
        return;
      }
      await SecureStore.setItemAsync(key, value);
    } catch {
      memoryStore[key] = value;
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch {
      delete memoryStore[key];
    }
  },
};
