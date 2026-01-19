import { renderHook, act } from '@testing-library/react-native';
import { useCartStore } from '../../store/cartStore';

describe('CartStore - Additional Tests', () => {
  beforeEach(() => {
    // Reset store before each test
    const { result } = renderHook(() => useCartStore());
    act(() => {
      result.current.clearCart();
      result.current.clearWishlist();
      result.current.clearRecentlyViewed();
      result.current.clearRecentSearches();
    });
  });

  describe('Wishlist Management', () => {
    it('should add item to wishlist', () => {
      const { result } = renderHook(() => useCartStore());
      const item = {
        productId: '1',
        name: 'Test Product',
        price: 100,
        image: 'test.jpg',
      };

      act(() => {
        result.current.addToWishlist(item);
      });

      expect(result.current.wishlist).toHaveLength(1);
      expect(result.current.wishlist[0].productId).toBe('1');
    });

    it('should remove item from wishlist', () => {
      const { result } = renderHook(() => useCartStore());
      const item = {
        productId: '1',
        name: 'Test Product',
        price: 100,
      };

      act(() => {
        result.current.addToWishlist(item);
        result.current.removeFromWishlist('1');
      });

      expect(result.current.wishlist).toHaveLength(0);
    });

    it('should check if item is in wishlist', () => {
      const { result } = renderHook(() => useCartStore());
      const item = {
        productId: '1',
        name: 'Test Product',
        price: 100,
      };

      act(() => {
        result.current.addToWishlist(item);
      });

      expect(result.current.isInWishlist('1')).toBe(true);
      expect(result.current.isInWishlist('2')).toBe(false);
    });

    it('should not add duplicate items to wishlist', () => {
      const { result } = renderHook(() => useCartStore());
      const item = {
        productId: '1',
        name: 'Test Product',
        price: 100,
      };

      act(() => {
        result.current.addToWishlist(item);
        result.current.addToWishlist(item);
      });

      expect(result.current.wishlist).toHaveLength(1);
    });

    it('should clear entire wishlist', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addToWishlist({ productId: '1', name: 'Product 1', price: 100 });
        result.current.addToWishlist({ productId: '2', name: 'Product 2', price: 200 });
        result.current.clearWishlist();
      });

      expect(result.current.wishlist).toHaveLength(0);
    });
  });

  describe('Recently Viewed', () => {
    it('should add item to recently viewed', () => {
      const { result } = renderHook(() => useCartStore());
      const item = {
        id: '1',
        name: 'Test Product',
        price: 100,
        image: 'test.jpg',
      };

      act(() => {
        result.current.addToRecentlyViewed(item);
      });

      expect(result.current.recentlyViewed).toHaveLength(1);
      expect(result.current.recentlyViewed[0].productId).toBe('1');
    });

    it('should move existing item to front when viewed again', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addToRecentlyViewed({ id: '1', name: 'Product 1', price: 100 });
        result.current.addToRecentlyViewed({ id: '2', name: 'Product 2', price: 200 });
        result.current.addToRecentlyViewed({ id: '1', name: 'Product 1', price: 100 });
      });

      expect(result.current.recentlyViewed).toHaveLength(2);
      expect(result.current.recentlyViewed[0].productId).toBe('1');
    });

    it('should limit recently viewed to maximum items', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        for (let i = 1; i <= 25; i++) {
          result.current.addToRecentlyViewed({
            id: `${i}`,
            name: `Product ${i}`,
            price: i * 100,
          });
        }
      });

      // Should limit to 12 items
      expect(result.current.recentlyViewed.length).toBeLessThanOrEqual(12);
    });

    it('should clear recently viewed', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addToRecentlyViewed({ id: '1', name: 'Product 1', price: 100 });
        result.current.clearRecentlyViewed();
      });

      expect(result.current.recentlyViewed).toHaveLength(0);
    });
  });

  describe('Recent Searches', () => {
    it('should add search query to recent searches', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addRecentSearch('laptop');
      });

      expect(result.current.recentSearches).toContain('laptop');
    });

    it('should not add duplicate search queries', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addRecentSearch('laptop');
        result.current.addRecentSearch('laptop');
      });

      const laptopCount = result.current.recentSearches.filter((s) => s === 'laptop').length;
      expect(laptopCount).toBe(1);
    });

    it('should move existing query to front', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addRecentSearch('laptop');
        result.current.addRecentSearch('phone');
        result.current.addRecentSearch('laptop');
      });

      expect(result.current.recentSearches[0]).toBe('laptop');
    });

    it('should limit recent searches to maximum items', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        for (let i = 1; i <= 25; i++) {
          result.current.addRecentSearch(`search${i}`);
        }
      });

      expect(result.current.recentSearches.length).toBeLessThanOrEqual(20);
    });

    it('should clear all recent searches', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addRecentSearch('laptop');
        result.current.addRecentSearch('phone');
        result.current.clearRecentSearches();
      });

      expect(result.current.recentSearches).toHaveLength(0);
    });
  });

  describe('User Profile', () => {
    it('should set user profile', () => {
      const { result } = renderHook(() => useCartStore());
      const profile = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        phone: '1234567890',
      };

      act(() => {
        result.current.setUserProfile(profile);
      });

      expect(result.current.userProfile).toEqual(profile);
    });

    it('should update user profile', () => {
      const { result } = renderHook(() => useCartStore());
      const profile = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      };

      act(() => {
        result.current.setUserProfile(profile);
        result.current.setUserProfile({ ...profile, phone: '9876543210' });
      });

      expect(result.current.userProfile?.phone).toBe('9876543210');
    });

    it('should clear user profile', () => {
      const { result } = renderHook(() => useCartStore());
      const profile = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      };

      act(() => {
        result.current.setUserProfile(profile);
        result.current.setUserProfile(null);
      });

      expect(result.current.userProfile).toBeNull();
    });
  });

  describe('Cart Total Calculations', () => {
    it('should calculate cart total correctly', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addItem({
          id: '1',
          productId: '1',
          name: 'Product 1',
          price: 100,
          quantity: 2,
        });
        result.current.addItem({
          id: '2',
          productId: '2',
          name: 'Product 2',
          price: 50,
          quantity: 3,
        });
      });

      const total = result.current.getTotalPrice();
      expect(total).toBe(350); // (100 * 2) + (50 * 3)
    });

    it('should return 0 for empty cart', () => {
      const { result } = renderHook(() => useCartStore());

      const total = result.current.getTotalPrice();
      expect(total).toBe(0);
    });

    it('should get cart item count', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addItem({
          id: '1',
          productId: '1',
          name: 'Product 1',
          price: 100,
          quantity: 2,
        });
        result.current.addItem({
          id: '2',
          productId: '2',
          name: 'Product 2',
          price: 50,
          quantity: 3,
        });
      });

      const count = result.current.getTotalItems();
      expect(count).toBe(5); // 2 + 3
    });
  });

  describe('Address Management', () => {
    it('should add address when user profile exists', () => {
      const { result } = renderHook(() => useCartStore());
      const address = {
        id: '1',
        label: 'Home',
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        isDefault: true,
      };

      act(() => {
        // First set up a user profile
        result.current.setUserProfile({
          id: 'user1',
          email: 'test@example.com',
          name: 'Test User',
          addresses: [],
        });
        result.current.addAddress(address);
      });

      expect(result.current.userProfile?.addresses).toHaveLength(1);
      expect(result.current.userProfile?.addresses?.[0].id).toBe('1');
    });

    it('should remove address when user profile exists', () => {
      const { result } = renderHook(() => useCartStore());
      const address = {
        id: '1',
        label: 'Home',
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        isDefault: true,
      };

      act(() => {
        result.current.setUserProfile({
          id: 'user1',
          email: 'test@example.com',
          name: 'Test User',
          addresses: [address],
        });
        result.current.removeAddress('1');
      });

      expect(result.current.userProfile?.addresses).toHaveLength(0);
    });

    it('should update address when user profile exists', () => {
      const { result } = renderHook(() => useCartStore());
      const address = {
        id: '1',
        label: 'Home',
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        isDefault: true,
      };

      act(() => {
        result.current.setUserProfile({
          id: 'user1',
          email: 'test@example.com',
          name: 'Test User',
          addresses: [address],
        });
        result.current.updateAddress('1', { street: '456 Oak Ave' });
      });

      expect(result.current.userProfile?.addresses?.[0].street).toBe('456 Oak Ave');
    });

    it('should set default address id', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.setUserProfile({
          id: 'user1',
          email: 'test@example.com',
          name: 'Test User',
          addresses: [],
        });
        result.current.setDefaultAddress('2');
      });

      expect(result.current.userProfile?.defaultAddressId).toBe('2');
    });
  });
});
