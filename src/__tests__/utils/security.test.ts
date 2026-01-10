/**
 * Tests for Security Utilities
 */

import {
  sanitizeInput,
  isValidEmail,
  validatePassword,
  maskSensitiveData,
  isValidUrl,
  getSecureHeaders,
  apiRateLimiter,
  authRateLimiter,
} from '../../utils/security';

describe('Security Utilities', () => {
  describe('sanitizeInput', () => {
    it('should trim whitespace', () => {
      expect(sanitizeInput('  hello  ')).toBe('hello');
    });

    it('should remove potential XSS characters', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
      expect(sanitizeInput('Hello <World>')).toBe('Hello World');
    });

    it('should limit string length', () => {
      const longString = 'a'.repeat(2000);
      expect(sanitizeInput(longString).length).toBe(1000);
    });

    it('should handle empty string', () => {
      expect(sanitizeInput('')).toBe('');
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      const result = validatePassword('SecureP@ss123');
      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
      expect(result.strength).toBe('strong');
    });

    it('should reject short passwords', () => {
      const result = validatePassword('Pass1!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters');
    });

    it('should require uppercase letter', () => {
      const result = validatePassword('password1!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
    });

    it('should require lowercase letter', () => {
      const result = validatePassword('PASSWORD1!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one lowercase letter');
    });

    it('should require number', () => {
      const result = validatePassword('Password!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one number');
    });

    it('should require special character', () => {
      const result = validatePassword('Password1');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one special character');
    });

    it('should return correct strength levels', () => {
      expect(validatePassword('abc').strength).toBe('weak');
      expect(validatePassword('Password').strength).toBe('medium'); // 8 chars, upper, lower = score 3
      expect(validatePassword('SecureP@ss123').strength).toBe('strong');
    });
  });

  describe('maskSensitiveData', () => {
    it('should mask middle of data', () => {
      expect(maskSensitiveData('1234567890')).toBe('1234**7890');
      expect(maskSensitiveData('test@example.com')).toBe('test********.com');
    });

    it('should handle short strings', () => {
      expect(maskSensitiveData('abc')).toBe('***');
      expect(maskSensitiveData('ab')).toBe('**');
    });

    it('should use custom visible characters', () => {
      expect(maskSensitiveData('1234567890', 2)).toBe('12******90');
    });
  });

  describe('isValidUrl', () => {
    it('should validate http URLs', () => {
      expect(isValidUrl('http://example.com')).toBe(true);
      expect(isValidUrl('https://example.com')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(isValidUrl('')).toBe(false);
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('ftp://example.com')).toBe(false);
      expect(isValidUrl('javascript:alert(1)')).toBe(false);
    });
  });

  describe('getSecureHeaders', () => {
    it('should return base headers without token', () => {
      const headers = getSecureHeaders();
      expect(headers['Content-Type']).toBe('application/json');
      expect(headers['X-Platform']).toBe('mobile');
      expect(headers['X-Request-ID']).toBeDefined();
      expect(headers['Authorization']).toBeUndefined();
    });

    it('should include authorization header with token', () => {
      const headers = getSecureHeaders('test-token');
      expect(headers['Authorization']).toBe('Bearer test-token');
    });

    it('should generate unique request IDs', () => {
      const headers1 = getSecureHeaders();
      const headers2 = getSecureHeaders();
      expect(headers1['X-Request-ID']).not.toBe(headers2['X-Request-ID']);
    });
  });

  describe('Rate Limiter', () => {
    beforeEach(() => {
      // Reset rate limiters by creating new instances would be ideal
      // but we'll test with different keys
    });

    it('should allow requests within limit', () => {
      const key = `test-${Date.now()}`;
      expect(apiRateLimiter.isAllowed(key)).toBe(true);
      expect(apiRateLimiter.isAllowed(key)).toBe(true);
    });

    it('should track remaining requests', () => {
      const key = `remaining-${Date.now()}`;
      const remaining = apiRateLimiter.getRemainingRequests(key);
      expect(remaining).toBeGreaterThan(0);
    });

    it('should have stricter auth rate limiting', () => {
      const key = `auth-${Date.now()}`;
      // Auth limiter allows only 5 requests per 5 minutes
      for (let i = 0; i < 5; i++) {
        expect(authRateLimiter.isAllowed(key)).toBe(true);
      }
      expect(authRateLimiter.isAllowed(key)).toBe(false);
    });
  });
});
