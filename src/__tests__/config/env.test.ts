import { ENV, isDevelopment, isProduction } from '../../config/env';

describe('Environment Configuration', () => {
  describe('ENV object', () => {
    it('should have GRAPHQL_URL', () => {
      expect(ENV.GRAPHQL_URL).toBeDefined();
      expect(typeof ENV.GRAPHQL_URL).toBe('string');
    });

    it('should have GRAPHQL_URL_MOBILE', () => {
      expect(ENV.GRAPHQL_URL_MOBILE).toBeDefined();
      expect(typeof ENV.GRAPHQL_URL_MOBILE).toBe('string');
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
  });

  describe('Default values', () => {
    it('should have railway GraphQL URL by default', () => {
      expect(ENV.GRAPHQL_URL).toContain('graphql');
    });

    it('should have mobile GraphQL URL by default', () => {
      expect(ENV.GRAPHQL_URL_MOBILE).toBeDefined();
    });
  });

  describe('Type safety', () => {
    it('ENV should be readonly (const assertion)', () => {
      // TypeScript ensures this at compile time
      // Runtime check that values exist
      expect(Object.keys(ENV).length).toBe(2);
    });
  });
});
