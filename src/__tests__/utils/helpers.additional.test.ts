// Mock theme constants
jest.mock('../../constants/theme', () => ({
  APP_CONFIG: {
    currency: 'USD',
    currencySymbol: '$',
  },
}));

import { renderHook, act } from '@testing-library/react-native';
import { formatPrice, formatDate, truncateText, isValidEmail } from '../../utils/helpers';

describe('Helpers Utils', () => {
  describe('formatPrice', () => {
    it('should format price with default currency', () => {
      expect(formatPrice(100)).toBe('$100.00');
    });

    it('should format zero price', () => {
      expect(formatPrice(0)).toBe('$0.00');
    });

    it('should format decimal prices', () => {
      expect(formatPrice(99.99)).toBe('$99.99');
    });

    it('should format large prices', () => {
      expect(formatPrice(1000000)).toBe('$1000000.00');
    });

    it('should round to 2 decimal places', () => {
      expect(formatPrice(99.999)).toBe('$100.00');
    });
  });

  describe('formatDate', () => {
    it('should format date to readable string', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const formatted = formatDate(date);
      expect(formatted).toContain('2024');
    });

    it('should format date string', () => {
      const formatted = formatDate('2024-01-15');
      expect(formatted).toContain('2024');
    });
  });

  describe('truncateText', () => {
    it('should truncate long text', () => {
      const text = 'This is a very long text that needs to be truncated';
      expect(truncateText(text, 20)).toBe('This is a very long...');
    });

    it('should not truncate short text', () => {
      const text = 'Short text';
      expect(truncateText(text, 20)).toBe('Short text');
    });

    it('should handle exact length', () => {
      const text = '12345';
      expect(truncateText(text, 5)).toBe('12345');
    });

    it('should handle empty string', () => {
      expect(truncateText('', 10)).toBe('');
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct email', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
    });

    it('should validate email with subdomain', () => {
      expect(isValidEmail('user@mail.example.com')).toBe(true);
    });

    it('should validate email with numbers', () => {
      expect(isValidEmail('user123@example.com')).toBe(true);
    });

    it('should validate email with dots', () => {
      expect(isValidEmail('user.name@example.com')).toBe(true);
    });

    it('should validate email with hyphens', () => {
      expect(isValidEmail('user-name@example.com')).toBe(true);
    });

    it('should reject email without @', () => {
      expect(isValidEmail('testexample.com')).toBe(false);
    });

    it('should reject email without domain', () => {
      expect(isValidEmail('test@')).toBe(false);
    });

    it('should reject email without username', () => {
      expect(isValidEmail('@example.com')).toBe(false);
    });

    it('should reject email with spaces', () => {
      expect(isValidEmail('test @example.com')).toBe(false);
    });

    it('should reject empty string', () => {
      expect(isValidEmail('')).toBe(false);
    });

    it('should reject email without TLD', () => {
      expect(isValidEmail('test@example')).toBe(false);
    });
  });

  describe('Additional Helpers', () => {
    it('should capitalize first letter', () => {
      const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
      expect(capitalize('hello')).toBe('Hello');
    });

    it('should get discount percentage', () => {
      const getDiscountPercentage = (original: number, discounted: number) =>
        Math.round(((original - discounted) / original) * 100);

      expect(getDiscountPercentage(100, 80)).toBe(20);
      expect(getDiscountPercentage(200, 150)).toBe(25);
    });

    it('should check if value is in range', () => {
      const isInRange = (value: number, min: number, max: number) => value >= min && value <= max;

      expect(isInRange(50, 0, 100)).toBe(true);
      expect(isInRange(150, 0, 100)).toBe(false);
    });

    it('should generate initials from name', () => {
      const getInitials = (name: string) =>
        name
          .split(' ')
          .map((word) => word[0])
          .join('')
          .toUpperCase();

      expect(getInitials('John Doe')).toBe('JD');
      expect(getInitials('Jane')).toBe('J');
    });

    it('should calculate rating percentage', () => {
      const getRatingPercentage = (rating: number, maxRating: number = 5) =>
        (rating / maxRating) * 100;

      expect(getRatingPercentage(4, 5)).toBe(80);
      expect(getRatingPercentage(3.5, 5)).toBe(70);
    });
  });
});
