import { ENV, isDevelopment, isProduction, getCurrentEnv, AppEnvironment } from '../../config/env';

describe('Environment Configuration', () => {
  describe('ENV object', () => {
    it('should have APP_ENV', () => {
      expect(ENV.APP_ENV).toBeDefined();
      expect(['development', 'staging', 'production']).toContain(ENV.APP_ENV);
    });

    it('should have GRAPHQL_URL', () => {
      expect(ENV.GRAPHQL_URL).toBeDefined();
      expect(typeof ENV.GRAPHQL_URL).toBe('string');
    });

    it('should have GRAPHQL_URL_MOBILE', () => {
      expect(ENV.GRAPHQL_URL_MOBILE).toBeDefined();
      expect(typeof ENV.GRAPHQL_URL_MOBILE).toBe('string');
    });

    it('should have API_URL', () => {
      expect(ENV.API_URL).toBeDefined();
      expect(typeof ENV.API_URL).toBe('string');
    });

    it('should have APP_NAME', () => {
      expect(ENV.APP_NAME).toBeDefined();
      expect(typeof ENV.APP_NAME).toBe('string');
    });

    it('should have APP_VERSION', () => {
      expect(ENV.APP_VERSION).toBeDefined();
      expect(typeof ENV.APP_VERSION).toBe('string');
    });
  });

  describe('Feature Flags', () => {
    it('should have ENABLE_ANALYTICS boolean', () => {
      expect(typeof ENV.ENABLE_ANALYTICS).toBe('boolean');
    });

    it('should have ENABLE_PUSH_NOTIFICATIONS boolean', () => {
      expect(typeof ENV.ENABLE_PUSH_NOTIFICATIONS).toBe('boolean');
    });

    it('should have ENABLE_CRASH_REPORTING boolean', () => {
      expect(typeof ENV.ENABLE_CRASH_REPORTING).toBe('boolean');
    });
  });

  describe('API Keys', () => {
    it('should have STRIPE_PUBLISHABLE_KEY', () => {
      expect(ENV.STRIPE_PUBLISHABLE_KEY).toBeDefined();
      expect(typeof ENV.STRIPE_PUBLISHABLE_KEY).toBe('string');
    });

    it('should have GOOGLE_MAPS_API_KEY', () => {
      expect(ENV.GOOGLE_MAPS_API_KEY).toBeDefined();
      expect(typeof ENV.GOOGLE_MAPS_API_KEY).toBe('string');
    });

    it('should have SENTRY_DSN', () => {
      expect(ENV.SENTRY_DSN).toBeDefined();
      expect(typeof ENV.SENTRY_DSN).toBe('string');
    });

    it('should have ANALYTICS_API_KEY', () => {
      expect(ENV.ANALYTICS_API_KEY).toBeDefined();
      expect(typeof ENV.ANALYTICS_API_KEY).toBe('string');
    });
  });

  describe('Helper functions', () => {
    it('isDevelopment should be a boolean', () => {
      expect(typeof isDevelopment).toBe('boolean');
    });

    it('isProduction should be a boolean', () => {
      expect(typeof isProduction).toBe('boolean');
    });

    it('isDevelopment and isProduction should be opposite in test', () => {
      // In test environment, __DEV__ is typically true
      expect(isDevelopment).toBe(true);
      expect(isProduction).toBe(false);
    });

    it('getCurrentEnv should return valid environment', () => {
      const env = getCurrentEnv();
      expect(['development', 'staging', 'production']).toContain(env);
    });

    it('getCurrentEnv should return the same as ENV.APP_ENV', () => {
      expect(getCurrentEnv()).toBe(ENV.APP_ENV);
    });
  });

  describe('Default values', () => {
    it('should have sensible default for APP_ENV', () => {
      // Default should be development
      expect(ENV.APP_ENV).toBe('development');
    });

    it('should have localhost GraphQL URL by default', () => {
      expect(ENV.GRAPHQL_URL).toContain('localhost');
    });

    it('should have default app name', () => {
      expect(ENV.APP_NAME).toBe('E-Storefront');
    });

    it('should have default app version', () => {
      expect(ENV.APP_VERSION).toMatch(/^\d+\.\d+\.\d+/);
    });
  });

  describe('Type safety', () => {
    it('ENV should be readonly (const assertion)', () => {
      // TypeScript ensures this at compile time
      // Runtime check that values exist
      expect(Object.keys(ENV).length).toBeGreaterThan(0);
    });

    it('AppEnvironment type should be valid', () => {
      const validEnvs: AppEnvironment[] = ['development', 'staging', 'production'];
      expect(validEnvs).toContain(ENV.APP_ENV);
    });
  });
});
