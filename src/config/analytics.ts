import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { ENV } from './env';

// Analytics event types
export type AnalyticsEvent =
  | 'app_open'
  | 'screen_view'
  | 'product_view'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'begin_checkout'
  | 'purchase'
  | 'search'
  | 'add_to_wishlist'
  | 'login'
  | 'signup'
  | 'logout'
  | 'share'
  | 'error';

interface AnalyticsEventData {
  [key: string]: string | number | boolean | undefined;
}

interface UserProperties {
  userId?: string;
  email?: string;
  name?: string;
  isGuest?: boolean;
  platform?: string;
  appVersion?: string;
}

class AnalyticsService {
  private isEnabled: boolean = false;
  private userId: string | null = null;
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.isEnabled = !__DEV__ && !!ENV.ANALYTICS_API_KEY;
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Initialize analytics
  async init(): Promise<void> {
    if (!this.isEnabled) {
      console.log('Analytics disabled in development');
      return;
    }

    // Initialize your analytics provider here
    // Example: Firebase, Mixpanel, Amplitude, etc.
    console.log('Analytics initialized');
  }

  // Track events
  track(event: AnalyticsEvent, data?: AnalyticsEventData): void {
    if (!this.isEnabled) {
      console.log(`[Analytics] ${event}:`, data);
      return;
    }

    const eventData = {
      ...data,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId,
      platform: Platform.OS,
      appVersion: Constants.expoConfig?.version,
    };

    // Send to your analytics service
    this.sendEvent(event, eventData);
  }

  // Track screen views
  trackScreen(screenName: string, params?: Record<string, any>): void {
    this.track('screen_view', {
      screen_name: screenName,
      ...params,
    });
  }

  // E-commerce specific events
  trackProductView(productId: string, productName: string, price: number, category?: string): void {
    this.track('product_view', {
      product_id: productId,
      product_name: productName,
      price,
      category,
    });
  }

  trackAddToCart(productId: string, productName: string, price: number, quantity: number): void {
    this.track('add_to_cart', {
      product_id: productId,
      product_name: productName,
      price,
      quantity,
      value: price * quantity,
    });
  }

  trackPurchase(orderId: string, total: number, items: number, currency: string = 'USD'): void {
    this.track('purchase', {
      order_id: orderId,
      value: total,
      items_count: items,
      currency,
    });
  }

  trackSearch(query: string, resultsCount: number): void {
    this.track('search', {
      search_term: query,
      results_count: resultsCount,
    });
  }

  // User identification
  identify(userId: string, properties?: UserProperties): void {
    this.userId = userId;
    
    if (!this.isEnabled) {
      console.log('[Analytics] Identify:', userId, properties);
      return;
    }

    // Send to your analytics service
    console.log('User identified:', userId);
  }

  // Reset user on logout
  reset(): void {
    this.userId = null;
    this.sessionId = this.generateSessionId();
  }

  // Private method to send events
  private async sendEvent(event: string, data: AnalyticsEventData): Promise<void> {
    try {
      // Replace with your actual analytics endpoint
      // Example using a custom API:
      /*
      await fetch(`${ENV.ANALYTICS_ENDPOINT}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': ENV.ANALYTICS_API_KEY,
        },
        body: JSON.stringify({ event, data }),
      });
      */
      console.log(`[Analytics Sent] ${event}`);
    } catch (error) {
      console.error('Failed to send analytics event:', error);
    }
  }
}

// Export singleton instance
export const analytics = new AnalyticsService();

// React hook for screen tracking
import { useEffect } from 'react';

export const useScreenTracking = (screenName: string, params?: Record<string, any>) => {
  useEffect(() => {
    analytics.trackScreen(screenName, params);
  }, [screenName]);
};
