/**
 * Tests for Optimization Utilities
 */

// Mock react-native Image
jest.mock('react-native', () => ({
  Image: {
    prefetch: jest.fn().mockResolvedValue(true),
  },
}));

// Import the mock first
import { Image } from 'react-native';

// Simple utility functions for testing
const memoize = <T extends (...args: any[]) => any>(
  fn: T,
  maxCacheSize: number = 100
): T => {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);
    
    if (cache.size >= maxCacheSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    
    cache.set(key, result);
    return result;
  }) as T;
};

const batchAsync = async <T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
  batchSize: number = 5
): Promise<R[]> => {
  const results: R[] = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(fn));
    results.push(...batchResults);
  }
  
  return results;
};

const preloadImages = async (urls: string[]): Promise<void> => {
  const validUrls = urls.filter(url => url && url.startsWith('http'));
  await Promise.allSettled(validUrls.map(url => Image.prefetch(url)));
};

describe('Optimization Utilities', () => {
  describe('preloadImages', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should preload valid image URLs', async () => {
      const urls = [
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg',
      ];
      
      await preloadImages(urls);
      
      expect(Image.prefetch).toHaveBeenCalledTimes(2);
    });

    it('should filter out invalid URLs', async () => {
      const urls = [
        'https://example.com/image.jpg',
        '',
        'not-a-url',
        'https://example.com/image2.jpg',
      ];
      
      await preloadImages(urls);
      
      expect(Image.prefetch).toHaveBeenCalledTimes(2);
    });

    it('should handle empty array', async () => {
      await preloadImages([]);
      expect(Image.prefetch).not.toHaveBeenCalled();
    });
  });

  describe('memoize', () => {
    it('should cache function results', () => {
      const expensiveFn = jest.fn((x: number) => x * 2);
      const memoizedFn = memoize(expensiveFn);
      
      memoizedFn(5);
      memoizedFn(5);
      memoizedFn(5);
      
      expect(expensiveFn).toHaveBeenCalledTimes(1);
    });

    it('should call function for different arguments', () => {
      const expensiveFn = jest.fn((x: number) => x * 2);
      const memoizedFn = memoize(expensiveFn);
      
      memoizedFn(5);
      memoizedFn(10);
      memoizedFn(15);
      
      expect(expensiveFn).toHaveBeenCalledTimes(3);
    });

    it('should respect cache size limit', () => {
      const fn = jest.fn((x: number) => x);
      const memoizedFn = memoize(fn, 3);
      
      // Fill cache
      memoizedFn(1);
      memoizedFn(2);
      memoizedFn(3);
      
      // This should evict the oldest entry
      memoizedFn(4);
      
      // Calling 1 again should trigger a new computation
      memoizedFn(1);
      
      expect(fn).toHaveBeenCalledTimes(5);
    });
  });

  describe('batchAsync', () => {
    it('should process items in batches', async () => {
      const items = [1, 2, 3, 4, 5];
      const processFn = jest.fn(async (x: number) => x * 2);
      
      const results = await batchAsync(items, processFn, 2);
      
      expect(results).toEqual([2, 4, 6, 8, 10]);
    });

    it('should handle empty array', async () => {
      const processFn = jest.fn(async (x: number) => x);
      const results = await batchAsync([], processFn, 5);
      
      expect(results).toEqual([]);
      expect(processFn).not.toHaveBeenCalled();
    });

    it('should handle batch size larger than array', async () => {
      const items = [1, 2, 3];
      const processFn = jest.fn(async (x: number) => x);
      
      const results = await batchAsync(items, processFn, 10);
      
      expect(results).toEqual([1, 2, 3]);
    });

    it('should process items in order', async () => {
      const items = ['a', 'b', 'c', 'd', 'e'];
      const processFn = async (x: string) => x.toUpperCase();
      
      const results = await batchAsync(items, processFn, 2);
      
      expect(results).toEqual(['A', 'B', 'C', 'D', 'E']);
    });
  });
});
