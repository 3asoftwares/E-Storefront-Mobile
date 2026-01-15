/**
 * Comprehensive tests for helper utility functions
 */

// Mock Platform and Alert for testing
jest.mock('react-native', () => ({
  Platform: { OS: 'ios' },
  Dimensions: {
    get: () => ({ width: 375, height: 812 }),
  },
  Alert: {
    alert: jest.fn(),
  },
}));

// Mock theme constants
jest.mock('../../constants/theme', () => ({
  APP_CONFIG: {
    currency: 'USD',
    currencySymbol: '$',
  },
}));

import {
  formatCurrency,
  formatPrice,
  calculateDiscount,
  formatDate,
  truncateText,
  isValidEmail,
  isValidPassword,
  getPasswordStrength,
  isValidPhone,
  generateId,
  capitalize,
  capitalizeWords,
  formatOrderStatus,
  calculateCartTotal,
  getInitials,
  formatNumber,
  clamp,
  shuffle,
  groupBy,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  IS_SMALL_DEVICE,
  IS_TABLET,
  IS_IOS,
  IS_ANDROID,
  IS_WEB,
} from '../../utils/helpers';

describe('Helper Utilities', () => {
  describe('Device Constants', () => {
    it('should have correct screen dimensions', () => {
      expect(SCREEN_WIDTH).toBe(375);
      expect(SCREEN_HEIGHT).toBe(812);
    });

    it('should correctly identify device size', () => {
      expect(IS_SMALL_DEVICE).toBe(false); // 375 >= 375
      expect(IS_TABLET).toBe(false); // 375 < 768
    });

    it('should correctly identify platform', () => {
      expect(IS_IOS).toBe(true);
      expect(IS_ANDROID).toBe(false);
      expect(IS_WEB).toBe(false);
    });
  });

  describe('formatCurrency', () => {
    it('should format currency with USD by default', () => {
      expect(formatCurrency(29.99)).toBe('$29.99');
      expect(formatCurrency(1000)).toBe('$1,000.00');
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('should handle negative values', () => {
      expect(formatCurrency(-50)).toBe('-$50.00');
    });

    it('should handle large numbers', () => {
      expect(formatCurrency(1000000)).toBe('$1,000,000.00');
    });
  });

  describe('formatPrice', () => {
    it('should format price with currency symbol', () => {
      expect(formatPrice(29.99)).toBe('$29.99');
      expect(formatPrice(100)).toBe('$100.00');
    });

    it('should handle decimal precision', () => {
      expect(formatPrice(29.999)).toBe('$30.00');
      expect(formatPrice(29.1)).toBe('$29.10');
    });
  });

  describe('calculateDiscount', () => {
    it('should calculate correct discount percentage', () => {
      expect(calculateDiscount(100, 80)).toBe(20);
      expect(calculateDiscount(50, 25)).toBe(50);
      expect(calculateDiscount(200, 150)).toBe(25);
    });

    it('should return 0 for invalid original price', () => {
      expect(calculateDiscount(0, 50)).toBe(0);
      expect(calculateDiscount(-100, 50)).toBe(0);
    });

    it('should round to nearest integer', () => {
      expect(calculateDiscount(100, 33)).toBe(67);
    });
  });

  describe('formatDate', () => {
    const testDate = new Date('2025-06-15T12:00:00Z');

    it('should format date in short format by default', () => {
      const result = formatDate(testDate);
      expect(result).toContain('Jun');
      expect(result).toContain('15');
      expect(result).toContain('2025');
    });

    it('should format date in long format', () => {
      const result = formatDate(testDate, 'long');
      expect(result).toContain('June');
      expect(result).toContain('2025');
    });

    it('should format relative dates', () => {
      const now = new Date();
      expect(formatDate(now, 'relative')).toBe('Today');

      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      expect(formatDate(yesterday, 'relative')).toBe('Yesterday');

      const lastWeek = new Date(now);
      lastWeek.setDate(lastWeek.getDate() - 5);
      expect(formatDate(lastWeek, 'relative')).toBe('5 days ago');
    });

    it('should handle string dates', () => {
      const result = formatDate('2025-01-01');
      expect(result).toContain('2025');
    });
  });

  describe('truncateText', () => {
    it('should truncate text longer than max length', () => {
      expect(truncateText('Hello World', 5)).toBe('Hello...');
    });

    it('should not truncate text shorter than max length', () => {
      expect(truncateText('Hello', 10)).toBe('Hello');
    });

    it('should handle exact length', () => {
      expect(truncateText('Hello', 5)).toBe('Hello');
    });

    it('should handle empty string', () => {
      expect(truncateText('', 5)).toBe('');
    });
  });

  describe('Email Validation', () => {
    it('should validate correct emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co')).toBe(true);
      expect(isValidEmail('user+tag@domain.org')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('invalid@')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
      expect(isValidEmail('test @example.com')).toBe(false);
    });
  });

  describe('Password Validation', () => {
    it('should validate strong passwords', () => {
      expect(isValidPassword('Password1')).toBe(true);
      expect(isValidPassword('SecurePass123')).toBe(true);
    });

    it('should reject weak passwords', () => {
      expect(isValidPassword('password')).toBe(false); // no uppercase or number
      expect(isValidPassword('PASSWORD1')).toBe(false); // no lowercase
      expect(isValidPassword('Pass1')).toBe(false); // too short
      expect(isValidPassword('')).toBe(false);
    });
  });

  describe('getPasswordStrength', () => {
    it('should return weak for short passwords', () => {
      expect(getPasswordStrength('abc')).toBe('weak');
      expect(getPasswordStrength('12345')).toBe('weak');
    });

    it('should return medium for moderate passwords', () => {
      expect(getPasswordStrength('password123')).toBe('medium');
    });

    it('should return strong for complex passwords', () => {
      expect(getPasswordStrength('SecureP@ss123')).toBe('strong');
    });
  });

  describe('Phone Validation', () => {
    it('should validate correct phone numbers', () => {
      expect(isValidPhone('+1234567890')).toBe(true);
      expect(isValidPhone('123-456-7890')).toBe(true);
      expect(isValidPhone('(123) 456-7890')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(isValidPhone('123')).toBe(false);
      expect(isValidPhone('')).toBe(false);
      expect(isValidPhone('abc')).toBe(false);
    });
  });

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });

    it('should generate string IDs', () => {
      const id = generateId();
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });
  });

  describe('String Utilities', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('HELLO')).toBe('Hello');
      expect(capitalize('hELLO')).toBe('Hello');
    });

    it('should capitalize each word', () => {
      expect(capitalizeWords('hello world')).toBe('Hello World');
      expect(capitalizeWords('HELLO WORLD')).toBe('Hello World');
    });

    it('should format order status', () => {
      expect(formatOrderStatus('pending_payment')).toBe('Pending Payment');
      expect(formatOrderStatus('in_transit')).toBe('In Transit');
      expect(formatOrderStatus('delivered')).toBe('Delivered');
    });
  });

  describe('calculateCartTotal', () => {
    const items = [
      { price: 100, quantity: 2 },
      { price: 50, quantity: 1 },
    ];

    it('should calculate correct subtotal', () => {
      const result = calculateCartTotal(items);
      expect(result.subtotal).toBe(250);
    });

    it('should apply discount correctly', () => {
      const result = calculateCartTotal(items, 10);
      expect(result.discount).toBe(25);
      expect(result.total).toBe(225);
    });

    it('should add shipping correctly', () => {
      const result = calculateCartTotal(items, 0, 15);
      expect(result.shipping).toBe(15);
      expect(result.total).toBe(265);
    });

    it('should handle empty cart', () => {
      const result = calculateCartTotal([]);
      expect(result.subtotal).toBe(0);
      expect(result.total).toBe(0);
    });

    it('should not return negative total', () => {
      const result = calculateCartTotal(items, 200, 0);
      expect(result.total).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getInitials', () => {
    it('should get initials from full name', () => {
      expect(getInitials('John Doe')).toBe('JD');
      expect(getInitials('Jane Smith')).toBe('JS');
    });

    it('should handle single name', () => {
      expect(getInitials('John')).toBe('J');
    });

    it('should limit to 2 characters', () => {
      expect(getInitials('John Middle Doe')).toBe('JM');
    });
  });

  describe('formatNumber', () => {
    it('should format thousands', () => {
      expect(formatNumber(1500)).toBe('1.5K');
      expect(formatNumber(2000)).toBe('2.0K');
    });

    it('should format millions', () => {
      expect(formatNumber(1500000)).toBe('1.5M');
    });

    it('should not format small numbers', () => {
      expect(formatNumber(500)).toBe('500');
    });
  });

  describe('clamp', () => {
    it('should clamp values within range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });

    it('should handle edge cases', () => {
      expect(clamp(0, 0, 10)).toBe(0);
      expect(clamp(10, 0, 10)).toBe(10);
    });
  });

  describe('shuffle', () => {
    it('should return array of same length', () => {
      const arr = [1, 2, 3, 4, 5];
      const shuffled = shuffle(arr);
      expect(shuffled.length).toBe(arr.length);
    });

    it('should contain all original elements', () => {
      const arr = [1, 2, 3, 4, 5];
      const shuffled = shuffle(arr);
      arr.forEach((item) => {
        expect(shuffled).toContain(item);
      });
    });

    it('should not modify original array', () => {
      const arr = [1, 2, 3, 4, 5];
      const original = [...arr];
      shuffle(arr);
      expect(arr).toEqual(original);
    });
  });

  describe('groupBy', () => {
    it('should group array by key', () => {
      const items = [
        { category: 'A', name: 'Item 1' },
        { category: 'B', name: 'Item 2' },
        { category: 'A', name: 'Item 3' },
      ];
      const grouped = groupBy(items, 'category');
      expect(grouped['A'].length).toBe(2);
      expect(grouped['B'].length).toBe(1);
    });

    it('should handle empty array', () => {
      const grouped = groupBy([], 'category');
      expect(Object.keys(grouped).length).toBe(0);
    });
  });
});
