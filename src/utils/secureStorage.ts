import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Secure storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_ID: 'user_id',
  BIOMETRIC_ENABLED: 'biometric_enabled',
  PIN_CODE: 'pin_code',
  DEVICE_ID: 'device_id',
} as const;

// Secure store options
const secureStoreOptions: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

/**
 * Secure Storage Service
 * Uses expo-secure-store for sensitive data (tokens, credentials)
 * Falls back to AsyncStorage on web (with encryption recommended)
 */
class SecureStorageService {
  // Store sensitive data securely
  async setSecureItem(key: string, value: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        // Web fallback - consider adding encryption layer
        await AsyncStorage.setItem(`secure_${key}`, value);
      } else {
        await SecureStore.setItemAsync(key, value, secureStoreOptions);
      }
    } catch (error) {
      console.error(`Failed to store secure item: ${key}`, error);
      throw error;
    }
  }

  // Retrieve sensitive data
  async getSecureItem(key: string): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        return await AsyncStorage.getItem(`secure_${key}`);
      }
      return await SecureStore.getItemAsync(key, secureStoreOptions);
    } catch (error) {
      console.error(`Failed to retrieve secure item: ${key}`, error);
      return null;
    }
  }

  // Delete sensitive data
  async deleteSecureItem(key: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        await AsyncStorage.removeItem(`secure_${key}`);
      } else {
        await SecureStore.deleteItemAsync(key, secureStoreOptions);
      }
    } catch (error) {
      console.error(`Failed to delete secure item: ${key}`, error);
    }
  }

  // Clear all secure storage
  async clearAllSecure(): Promise<void> {
    const keys = Object.values(STORAGE_KEYS);
    await Promise.all(keys.map(key => this.deleteSecureItem(key)));
  }

  // Store auth tokens
  async storeAuthTokens(accessToken: string, refreshToken?: string): Promise<void> {
    await this.setSecureItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);
    if (refreshToken) {
      await this.setSecureItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }
  }

  // Get auth token
  async getAuthToken(): Promise<string | null> {
    return this.getSecureItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  // Clear auth tokens (logout)
  async clearAuthTokens(): Promise<void> {
    await this.deleteSecureItem(STORAGE_KEYS.AUTH_TOKEN);
    await this.deleteSecureItem(STORAGE_KEYS.REFRESH_TOKEN);
  }
}

export const secureStorage = new SecureStorageService();
