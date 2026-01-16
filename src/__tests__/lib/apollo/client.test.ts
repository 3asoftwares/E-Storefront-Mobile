/* eslint-disable @typescript-eslint/no-explicit-any */
// Mock dependencies before importing
jest.mock('react-native', () => ({
  Platform: { OS: 'ios' },
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('../../../config/env', () => ({
  ENV: {
    GRAPHQL_URL: 'http://localhost:4000/graphql',
    GRAPHQL_URL_MOBILE: 'http://192.168.1.100:4000/graphql',
  },
}));

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  setAuthToken,
  getAuthToken,
  clearAuthToken,
  apolloClient,
} from '../../../lib/apollo/client';

describe('Apollo Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear global token
    (globalThis as any).__AUTH_TOKEN__ = undefined;
  });

  describe('apolloClient', () => {
    it('should be defined', () => {
      expect(apolloClient).toBeDefined();
    });

    it('should have cache', () => {
      expect(apolloClient.cache).toBeDefined();
    });

    it('should have link', () => {
      expect(apolloClient.link).toBeDefined();
    });
  });

  describe('setAuthToken', () => {
    it('should store token in AsyncStorage', async () => {
      await setAuthToken('test-token-123');

      expect(AsyncStorage.setItem).toHaveBeenCalledWith('accessToken', 'test-token-123');
    });

    it('should set global token', async () => {
      await setAuthToken('global-token');

      expect((globalThis as any).__AUTH_TOKEN__).toBe('global-token');
    });
  });

  describe('getAuthToken', () => {
    it('should retrieve token from AsyncStorage', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('stored-token');

      const token = await getAuthToken();

      expect(AsyncStorage.getItem).toHaveBeenCalledWith('accessToken');
      expect(token).toBe('stored-token');
    });

    it('should return null if no token stored', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const token = await getAuthToken();

      expect(token).toBeNull();
    });

    it('should update global token', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('fetched-token');

      await getAuthToken();

      expect((globalThis as any).__AUTH_TOKEN__).toBe('fetched-token');
    });
  });

  describe('clearAuthToken', () => {
    it('should remove token from AsyncStorage', async () => {
      await clearAuthToken();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('accessToken');
    });

    it('should clear global token', async () => {
      (globalThis as any).__AUTH_TOKEN__ = 'existing-token';

      await clearAuthToken();

      expect((globalThis as any).__AUTH_TOKEN__).toBeNull();
    });

    it('should remove refreshToken from AsyncStorage', async () => {
      await clearAuthToken();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('refreshToken');
    });

    it('should remove user from AsyncStorage', async () => {
      await clearAuthToken();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('user');
    });
  });

  describe('Token Management Integration', () => {
    it('should handle complete auth flow', async () => {
      // Set token
      await setAuthToken('flow-token');
      expect((globalThis as any).__AUTH_TOKEN__).toBe('flow-token');

      // Get token
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('flow-token');
      const retrieved = await getAuthToken();
      expect(retrieved).toBe('flow-token');

      // Clear token
      await clearAuthToken();
      expect((globalThis as any).__AUTH_TOKEN__).toBeNull();
    });

    it('should handle null tokens gracefully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const token = await getAuthToken();
      expect(token).toBeNull();
      expect((globalThis as any).__AUTH_TOKEN__).toBeNull();
    });
  });

  describe('Error Scenarios', () => {
    afterEach(() => {
      // Reset mocks after error tests
      jest.clearAllMocks();
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);
    });

    it('should handle AsyncStorage errors when setting token', async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));

      await expect(setAuthToken('test-token')).rejects.toThrow('Storage error');
    });

    it('should handle AsyncStorage errors when getting token', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));

      await expect(getAuthToken()).rejects.toThrow('Storage error');
    });

    it('should handle AsyncStorage errors when clearing token', async () => {
      (AsyncStorage.removeItem as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));

      await expect(clearAuthToken()).rejects.toThrow('Storage error');
    });

    it('should clear token successfully', async () => {
      // Reset mock to not throw
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
      (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);
      
      // Set a token first
      await setAuthToken('test-token');

      // Clear the token
      await clearAuthToken();

      // After clear, token should be null or undefined
      expect((globalThis as any).__AUTH_TOKEN__ == null).toBe(true);
    });
  });

  describe('Token Flow', () => {
    beforeEach(() => {
      // Reset mocks before each token flow test
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);
    });

    it('should handle full token lifecycle', async () => {
      // Set token
      await setAuthToken('lifecycle-token');
      expect((globalThis as any).__AUTH_TOKEN__).toBe('lifecycle-token');

      // Simulate get
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('lifecycle-token');
      const token = await getAuthToken();
      expect(token).toBe('lifecycle-token');

      // Clear token
      await clearAuthToken();
      // Token should be null or undefined after clearing
      expect((globalThis as any).__AUTH_TOKEN__ == null).toBe(true);
    });
  });
});
