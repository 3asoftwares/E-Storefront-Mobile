/**
 * Tests for Secure Storage Service
 */

import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { secureStorage, STORAGE_KEYS } from '../../utils/secureStorage';

// Mock modules
jest.mock('expo-secure-store');
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
jest.mock('react-native', () => ({
  Platform: { OS: 'ios' },
}));

describe('Secure Storage Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('STORAGE_KEYS', () => {
    it('should have all required keys', () => {
      expect(STORAGE_KEYS.AUTH_TOKEN).toBe('auth_token');
      expect(STORAGE_KEYS.REFRESH_TOKEN).toBe('refresh_token');
      expect(STORAGE_KEYS.USER_ID).toBe('user_id');
      expect(STORAGE_KEYS.BIOMETRIC_ENABLED).toBe('biometric_enabled');
      expect(STORAGE_KEYS.PIN_CODE).toBe('pin_code');
      expect(STORAGE_KEYS.DEVICE_ID).toBe('device_id');
    });
  });

  describe('setSecureItem', () => {
    it('should store item using SecureStore on mobile', async () => {
      (SecureStore.setItemAsync as jest.Mock).mockResolvedValue(undefined);
      
      await secureStorage.setSecureItem('test_key', 'test_value');
      
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        'test_key',
        'test_value',
        expect.any(Object)
      );
    });

    it('should handle errors gracefully', async () => {
      (SecureStore.setItemAsync as jest.Mock).mockRejectedValue(new Error('Storage error'));
      
      await expect(
        secureStorage.setSecureItem('test_key', 'test_value')
      ).rejects.toThrow('Storage error');
    });
  });

  describe('getSecureItem', () => {
    it('should retrieve item using SecureStore on mobile', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('stored_value');
      
      const result = await secureStorage.getSecureItem('test_key');
      
      expect(result).toBe('stored_value');
    });

    it('should return null for non-existent items', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
      
      const result = await secureStorage.getSecureItem('non_existent');
      
      expect(result).toBeNull();
    });

    it('should return null on error', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockRejectedValue(new Error('Read error'));
      
      const result = await secureStorage.getSecureItem('error_key');
      
      expect(result).toBeNull();
    });
  });

  describe('deleteSecureItem', () => {
    it('should delete item using SecureStore', async () => {
      (SecureStore.deleteItemAsync as jest.Mock).mockResolvedValue(undefined);
      
      await secureStorage.deleteSecureItem('test_key');
      
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(
        'test_key',
        expect.any(Object)
      );
    });
  });

  describe('Auth Token Operations', () => {
    it('should store auth tokens', async () => {
      (SecureStore.setItemAsync as jest.Mock).mockResolvedValue(undefined);
      
      await secureStorage.storeAuthTokens('access_token_123', 'refresh_token_456');
      
      expect(SecureStore.setItemAsync).toHaveBeenCalledTimes(2);
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        'auth_token',
        'access_token_123',
        expect.any(Object)
      );
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        'refresh_token',
        'refresh_token_456',
        expect.any(Object)
      );
    });

    it('should store only access token if no refresh token', async () => {
      (SecureStore.setItemAsync as jest.Mock).mockResolvedValue(undefined);
      
      await secureStorage.storeAuthTokens('access_token_only');
      
      expect(SecureStore.setItemAsync).toHaveBeenCalledTimes(1);
    });

    it('should get auth token', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('my_auth_token');
      
      const token = await secureStorage.getAuthToken();
      
      expect(token).toBe('my_auth_token');
    });

    it('should clear auth tokens', async () => {
      (SecureStore.deleteItemAsync as jest.Mock).mockResolvedValue(undefined);
      
      await secureStorage.clearAuthTokens();
      
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledTimes(2);
    });
  });

  describe('clearAllSecure', () => {
    it('should clear all secure storage keys', async () => {
      (SecureStore.deleteItemAsync as jest.Mock).mockResolvedValue(undefined);
      
      await secureStorage.clearAllSecure();
      
      const keyCount = Object.values(STORAGE_KEYS).length;
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledTimes(keyCount);
    });
  });
});
