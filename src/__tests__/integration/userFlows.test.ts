/**
 * Integration tests for complete user flows
 */

import { act } from '@testing-library/react-native';
import { useCartStore } from '../../store/cartStore';

describe('E-Commerce User Flows', () => {
  beforeEach(() => {
    act(() => {
      useCartStore.setState({
        items: [],
        wishlist: [],
        recentlyViewed: [],
        recentSearches: [],
        userProfile: null,
      });
    });
  });

  describe('Shopping Cart Flow', () => {
    it('should complete a full shopping flow', () => {
      const store = useCartStore.getState();
      
      // 1. User browses and views products
      act(() => {
        store.addToRecentlyViewed({
          id: 'product-1',
          name: 'Running Shoes',
          price: 99.99,
          image: 'shoes.jpg',
        });
        store.addToRecentlyViewed({
          id: 'product-2',
          name: 'Sports Watch',
          price: 199.99,
          image: 'watch.jpg',
        });
      });
      
      let state = useCartStore.getState();
      expect(state.recentlyViewed.length).toBe(2);
      
      // 2. User adds item to wishlist
      act(() => {
        store.addToWishlist({
          productId: 'product-1',
          name: 'Running Shoes',
          price: 99.99,
          image: 'shoes.jpg',
        });
      });
      
      state = useCartStore.getState();
      expect(state.wishlist.length).toBe(1);
      
      // 3. User adds items to cart
      act(() => {
        store.addToCart({
          productId: 'product-1',
          name: 'Running Shoes',
          price: 99.99,
          quantity: 1,
        });
        store.addToCart({
          productId: 'product-2',
          name: 'Sports Watch',
          price: 199.99,
          quantity: 1,
        });
      });
      
      state = useCartStore.getState();
      expect(state.items.length).toBe(2);
      expect(state.getTotalItems()).toBe(2);
      expect(state.getTotalPrice()).toBe(299.98);
      
      // 4. User updates quantity
      act(() => {
        store.updateQuantity('product-1', 2);
      });
      
      state = useCartStore.getState();
      expect(state.getTotalItems()).toBe(3);
      expect(state.getTotalPrice()).toBe(399.97);
      
      // 5. User removes an item
      act(() => {
        store.removeFromCart('product-2');
      });
      
      state = useCartStore.getState();
      expect(state.items.length).toBe(1);
      expect(state.getTotalPrice()).toBe(199.98);
    });
  });

  describe('Wishlist to Cart Flow', () => {
    it('should move item from wishlist to cart', () => {
      const store = useCartStore.getState();
      
      const product = {
        productId: 'product-1',
        id: 'product-1',
        name: 'Laptop',
        price: 999.99,
        image: 'laptop.jpg',
      };
      
      // Add to wishlist
      act(() => {
        store.addToWishlist(product);
      });
      
      let state = useCartStore.getState();
      expect(state.wishlist.length).toBe(1);
      expect(state.items.length).toBe(0);
      
      // Move to cart
      act(() => {
        store.addToCart({
          productId: product.productId,
          name: product.name,
          price: product.price,
          quantity: 1,
        });
        store.removeFromWishlist(product.productId);
      });
      
      state = useCartStore.getState();
      expect(state.wishlist.length).toBe(0);
      expect(state.items.length).toBe(1);
    });
  });

  describe('Search Flow', () => {
    it('should track search history', () => {
      const store = useCartStore.getState();
      
      act(() => {
        store.addRecentSearch('running shoes');
        store.addRecentSearch('sports watch');
        store.addRecentSearch('fitness tracker');
      });
      
      const state = useCartStore.getState();
      expect(state.recentSearches.length).toBe(3);
      expect(state.recentSearches[0]).toBe('fitness tracker'); // Most recent first
    });

    it('should not duplicate searches', () => {
      const store = useCartStore.getState();
      
      act(() => {
        store.addRecentSearch('shoes');
        store.addRecentSearch('watches');
        store.addRecentSearch('shoes'); // Duplicate
      });
      
      const state = useCartStore.getState();
      expect(state.recentSearches.length).toBe(2);
      expect(state.recentSearches[0]).toBe('shoes'); // Moved to front
    });
  });

  describe('User Profile Flow', () => {
    it('should manage user profile and addresses', () => {
      const store = useCartStore.getState();
      
      // Set user profile
      act(() => {
        store.setUserProfile({
          id: 'user-1',
          email: 'user@example.com',
          name: 'John Doe',
          addresses: [],
        });
      });
      
      let state = useCartStore.getState();
      expect(state.userProfile?.name).toBe('John Doe');
      
      // Add address
      act(() => {
        store.addAddress({
          id: 'addr-1',
          label: 'Home',
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
        });
      });
      
      state = useCartStore.getState();
      expect(state.userProfile?.addresses?.length).toBe(1);
    });
  });

  describe('Cart Persistence Scenario', () => {
    it('should maintain cart state across multiple operations', () => {
      const store = useCartStore.getState();
      
      // Add multiple items
      act(() => {
        store.addToCart({ productId: 'p1', name: 'Item 1', price: 10, quantity: 1 });
        store.addToCart({ productId: 'p2', name: 'Item 2', price: 20, quantity: 2 });
        store.addToCart({ productId: 'p3', name: 'Item 3', price: 30, quantity: 1 });
      });
      
      let state = useCartStore.getState();
      expect(state.getTotalItems()).toBe(4);
      expect(state.getTotalPrice()).toBe(80); // 10 + 40 + 30
      
      // Update quantities
      act(() => {
        store.updateQuantity('p1', 3);
        store.updateQuantity('p2', 1);
      });
      
      state = useCartStore.getState();
      expect(state.getTotalItems()).toBe(5); // 3 + 1 + 1
      expect(state.getTotalPrice()).toBe(80); // 30 + 20 + 30
      
      // Remove item
      act(() => {
        store.removeFromCart('p3');
      });
      
      state = useCartStore.getState();
      expect(state.items.length).toBe(2);
      expect(state.getTotalPrice()).toBe(50); // 30 + 20
    });
  });

  describe('Checkout Preparation', () => {
    it('should prepare cart data for checkout', () => {
      const store = useCartStore.getState();
      
      // Setup user profile with address
      act(() => {
        store.setUserProfile({
          id: 'user-1',
          email: 'checkout@example.com',
          name: 'Checkout User',
          addresses: [],
        });
        
        store.addAddress({
          id: 'addr-1',
          label: 'Shipping',
          street: '456 Commerce Ave',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90001',
          country: 'USA',
          isDefault: true,
        });
        
        // Add items to cart
        store.addToCart({ productId: 'checkout-1', name: 'Product A', price: 49.99, quantity: 2 });
        store.addToCart({ productId: 'checkout-2', name: 'Product B', price: 29.99, quantity: 1 });
      });
      
      const state = useCartStore.getState();
      
      // Verify checkout readiness
      expect(state.userProfile).toBeDefined();
      expect(state.userProfile?.addresses?.length).toBeGreaterThan(0);
      expect(state.items.length).toBeGreaterThan(0);
      expect(state.getTotalPrice()).toBeGreaterThan(0);
      
      // Calculate expected checkout data
      const subtotal = state.getTotalPrice();
      expect(subtotal).toBe(129.97); // (49.99 * 2) + 29.99
    });
  });
});
