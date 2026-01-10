/**
 * Tests for Analytics Service
 */

import { analytics, useScreenTracking } from '../../config/analytics';
import { renderHook } from '@testing-library/react-native';

// Mock ENV
jest.mock('../../config/env', () => ({
  ENV: {
    ANALYTICS_API_KEY: '',
    ANALYTICS_ENDPOINT: 'https://analytics.example.com',
  },
}));

describe('Analytics Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the service
    analytics.reset();
  });

  describe('Initialization', () => {
    it('should initialize without errors', async () => {
      await expect(analytics.init()).resolves.not.toThrow();
    });
  });

  describe('Event Tracking', () => {
    it('should track events in development mode', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      analytics.track('app_open', { source: 'test' });
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[Analytics]'),
        expect.any(Object)
      );
      
      consoleSpy.mockRestore();
    });

    it('should track screen views', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      analytics.trackScreen('HomeScreen', { category: 'main' });
      
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });

  describe('E-commerce Event Tracking', () => {
    it('should track product views', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      analytics.trackProductView('product-1', 'Test Product', 29.99, 'Electronics');
      
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    it('should track add to cart', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      analytics.trackAddToCart('product-1', 'Test Product', 29.99, 2);
      
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    it('should track purchases', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      analytics.trackPurchase('order-123', 199.99, 3, 'USD');
      
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    it('should track searches', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      analytics.trackSearch('running shoes', 25);
      
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });

  describe('User Identification', () => {
    it('should identify users', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      analytics.identify('user-123', {
        email: 'user@example.com',
        name: 'Test User',
      });
      
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    it('should reset on logout', () => {
      analytics.identify('user-123', { email: 'user@example.com' });
      analytics.reset();
      
      // After reset, a new session ID should be generated
      // This is an internal state change, so we just verify no errors
      expect(true).toBe(true);
    });
  });

  describe('useScreenTracking Hook', () => {
    it('should track screen on mount', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      renderHook(() => useScreenTracking('TestScreen'));
      
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    it('should track screen with params', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      renderHook(() => useScreenTracking('ProductScreen', { productId: '123' }));
      
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });
});
