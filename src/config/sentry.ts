import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';
import { ENV } from './env';

// Initialize Sentry for crash reporting and error tracking
export const initSentry = () => {
  if (!ENV.SENTRY_DSN || __DEV__) {
    console.log('Sentry disabled in development mode');
    return;
  }

  Sentry.init({
    dsn: ENV.SENTRY_DSN,
    environment: ENV.APP_ENV,
    release: `${Constants.expoConfig?.slug}@${Constants.expoConfig?.version}`,
    dist: Constants.expoConfig?.version,
    
    // Performance Monitoring
    tracesSampleRate: ENV.APP_ENV === 'production' ? 0.2 : 1.0,
    
    // Session Replay (optional)
    enableAutoSessionTracking: true,
    sessionTrackingIntervalMillis: 30000,
    
    // Additional options
    attachScreenshot: true,
    attachViewHierarchy: true,
    
    // Filter out non-critical errors
    beforeSend(event) {
      // Don't send events in development
      if (__DEV__) return null;
      
      // Filter out network errors that are expected
      if (event.exception?.values?.[0]?.value?.includes('Network request failed')) {
        return null;
      }
      
      return event;
    },
  });
};

// Capture custom events
export const captureEvent = (name: string, data?: Record<string, any>) => {
  Sentry.captureMessage(name, {
    level: 'info',
    extra: data,
  });
};

// Capture errors with context
export const captureError = (error: Error, context?: Record<string, any>) => {
  Sentry.captureException(error, {
    extra: context,
  });
};

// Set user context for tracking
export const setUserContext = (user: { id: string; email?: string; username?: string }) => {
  Sentry.setUser(user);
};

// Clear user context on logout
export const clearUserContext = () => {
  Sentry.setUser(null);
};

// Add breadcrumb for debugging
export const addBreadcrumb = (message: string, category: string, data?: Record<string, any>) => {
  Sentry.addBreadcrumb({
    message,
    category,
    data,
    level: 'info',
  });
};

export { Sentry };
