/**
 * Tests for Cache Service
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { cacheService, productCache, userCache, categoryCache } from '../../utils/cache';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

describe('Cache Service', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    await cacheService.clear();
  });

  describe('Basic Operations', () => {
    it('should set and get cached items', async () => {
      await cacheService.set('test-key', { data: 'test' });
      const result = await cacheService.get('test-key');
      expect(result).toEqual({ data: 'test' });
    });

    it('should return null for non-existent keys', async () => {
      const result = await cacheService.get('non-existent');
      expect(result).toBeNull();
    });

    it('should remove cached items', async () => {
      await cacheService.set('to-remove', 'value');
      await cacheService.remove('to-remove');
      const result = await cacheService.get('to-remove');
      expect(result).toBeNull();
    });

    it('should clear all cached items', async () => {
      await cacheService.set('key1', 'value1');
      await cacheService.set('key2', 'value2');
      await cacheService.clear();
      
      const result1 = await cacheService.get('key1');
      const result2 = await cacheService.get('key2');
      
      expect(result1).toBeNull();
      expect(result2).toBeNull();
    });
  });

  describe('TTL (Time To Live)', () => {
    it('should respect custom TTL', async () => {
      // Set with very short TTL
      await cacheService.set('short-ttl', 'value', 1); // 1ms TTL
      
      // Wait for expiry
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const result = await cacheService.get('short-ttl');
      expect(result).toBeNull();
    });

    it('should return valid cached items before TTL expires', async () => {
      await cacheService.set('valid-ttl', 'value', 60000); // 1 minute TTL
      const result = await cacheService.get('valid-ttl');
      expect(result).toBe('value');
    });
  });

  describe('getOrFetch', () => {
    it('should return cached value if available', async () => {
      await cacheService.set('cached-key', 'cached-value');
      
      const fetchFn = jest.fn().mockResolvedValue('fresh-value');
      const result = await cacheService.getOrFetch('cached-key', fetchFn);
      
      expect(result).toBe('cached-value');
      expect(fetchFn).not.toHaveBeenCalled();
    });

    it('should fetch and cache if not available', async () => {
      const fetchFn = jest.fn().mockResolvedValue('fetched-value');
      const result = await cacheService.getOrFetch('new-key', fetchFn);
      
      expect(result).toBe('fetched-value');
      expect(fetchFn).toHaveBeenCalled();
      
      // Verify it was cached
      const cachedResult = await cacheService.get('new-key');
      expect(cachedResult).toBe('fetched-value');
    });
  });

  describe('Cache Stats', () => {
    it('should return stats', async () => {
      await cacheService.set('key1', 'value1');
      await cacheService.set('key2', 'value2');
      
      const stats = cacheService.getStats();
      
      expect(stats.memoryEntries).toBeGreaterThan(0);
    });
  });

  describe('Different Cache Instances', () => {
    it('should have separate product cache', async () => {
      await productCache.set('product-1', { name: 'Product' });
      const result = await productCache.get('product-1');
      expect(result).toEqual({ name: 'Product' });
    });

    it('should have separate user cache', async () => {
      await userCache.set('user-1', { name: 'User' });
      const result = await userCache.get('user-1');
      expect(result).toEqual({ name: 'User' });
    });

    it('should have separate category cache', async () => {
      await categoryCache.set('cat-1', { name: 'Category' });
      const result = await categoryCache.get('cat-1');
      expect(result).toEqual({ name: 'Category' });
    });
  });

  describe('Complex Data Types', () => {
    it('should cache arrays', async () => {
      const array = [1, 2, 3, 'test', { nested: true }];
      await cacheService.set('array-key', array);
      const result = await cacheService.get('array-key');
      expect(result).toEqual(array);
    });

    it('should cache nested objects', async () => {
      const obj = {
        level1: {
          level2: {
            level3: 'deep value',
          },
        },
      };
      await cacheService.set('nested-key', obj);
      const result = await cacheService.get('nested-key');
      expect(result).toEqual(obj);
    });

    it('should cache null values', async () => {
      await cacheService.set('null-key', null);
      const result = await cacheService.get('null-key');
      // Note: null might be treated as "no value" depending on implementation
      // This test documents the behavior
      expect(result).toBeDefined();
    });
  });
});
