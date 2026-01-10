import AsyncStorage from '@react-native-async-storage/async-storage';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxEntries?: number;
}

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
const CACHE_PREFIX = '@cache:';

/**
 * Offline-first caching service
 * Stores data locally with TTL for offline support
 */
class CacheService {
  private memoryCache: Map<string, CacheEntry<any>> = new Map();
  private config: CacheConfig;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      ttl: config.ttl || DEFAULT_TTL,
      maxEntries: config.maxEntries || 100,
    };
  }

  // Generate cache key
  private getCacheKey(key: string): string {
    return `${CACHE_PREFIX}${key}`;
  }

  // Set item in cache
  async set<T>(key: string, data: T, ttl?: number): Promise<void> {
    const now = Date.now();
    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      expiresAt: now + (ttl || this.config.ttl),
    };

    // Store in memory
    this.memoryCache.set(key, entry);

    // Persist to storage
    try {
      await AsyncStorage.setItem(
        this.getCacheKey(key),
        JSON.stringify(entry)
      );
    } catch (error) {
      console.warn('Failed to persist cache:', error);
    }

    // Cleanup if needed
    this.cleanup();
  }

  // Get item from cache
  async get<T>(key: string): Promise<T | null> {
    const now = Date.now();

    // Check memory cache first
    const memoryEntry = this.memoryCache.get(key);
    if (memoryEntry && memoryEntry.expiresAt > now) {
      return memoryEntry.data as T;
    }

    // Check persistent storage
    try {
      const stored = await AsyncStorage.getItem(this.getCacheKey(key));
      if (stored) {
        const entry: CacheEntry<T> = JSON.parse(stored);
        if (entry.expiresAt > now) {
          // Refresh memory cache
          this.memoryCache.set(key, entry);
          return entry.data;
        } else {
          // Expired, remove it
          await this.remove(key);
        }
      }
    } catch (error) {
      console.warn('Failed to read cache:', error);
    }

    return null;
  }

  // Get with fallback fetch
  async getOrFetch<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    // Try cache first
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Fetch fresh data
    const data = await fetchFn();
    await this.set(key, data, ttl);
    return data;
  }

  // Remove item from cache
  async remove(key: string): Promise<void> {
    this.memoryCache.delete(key);
    try {
      await AsyncStorage.removeItem(this.getCacheKey(key));
    } catch (error) {
      console.warn('Failed to remove cache:', error);
    }
  }

  // Clear all cache
  async clear(): Promise<void> {
    this.memoryCache.clear();
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(k => k.startsWith(CACHE_PREFIX));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  }

  // Cleanup expired entries
  private async cleanup(): Promise<void> {
    const now = Date.now();

    // Cleanup memory cache
    for (const [key, entry] of this.memoryCache.entries()) {
      if (entry.expiresAt < now) {
        this.memoryCache.delete(key);
      }
    }

    // Limit cache size
    if (this.memoryCache.size > (this.config.maxEntries || 100)) {
      const entries = Array.from(this.memoryCache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      const toRemove = entries.slice(0, entries.length - (this.config.maxEntries || 100));
      for (const [key] of toRemove) {
        this.memoryCache.delete(key);
      }
    }
  }

  // Get cache stats
  getStats(): { memoryEntries: number; oldestEntry: number | null } {
    let oldest: number | null = null;
    
    for (const entry of this.memoryCache.values()) {
      if (oldest === null || entry.timestamp < oldest) {
        oldest = entry.timestamp;
      }
    }

    return {
      memoryEntries: this.memoryCache.size,
      oldestEntry: oldest,
    };
  }
}

// Export singleton instance
export const cacheService = new CacheService();

// Specific cache instances for different data types
export const productCache = new CacheService({ ttl: 10 * 60 * 1000 }); // 10 minutes
export const userCache = new CacheService({ ttl: 5 * 60 * 1000 }); // 5 minutes
export const categoryCache = new CacheService({ ttl: 30 * 60 * 1000 }); // 30 minutes
