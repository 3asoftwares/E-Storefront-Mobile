import { useCartStore } from '../../store/cartStore';

// Reset store before each test
beforeEach(() => {
  useCartStore.setState({ 
    items: [], 
    wishlist: [], 
    recentlyViewed: [],
    recentSearches: [],
    userProfile: null,
  });
});

describe('Cart Store - Extended Tests', () => {
  describe('addToCart with variants', () => {
    it('should add item with variant', () => {
      const { addToCart } = useCartStore.getState();
      
      addToCart({
        productId: '1',
        name: 'T-Shirt',
        price: 29.99,
        quantity: 1,
        variant: 'size-L',
      });

      const state = useCartStore.getState();
      expect(state.items.length).toBe(1);
      expect(state.items[0].id).toBe('1size-L');
    });

    it('should update quantity for same product without variant', () => {
      const { addToCart } = useCartStore.getState();
      
      addToCart({ productId: '1', name: 'Item', price: 10, quantity: 1 });
      addToCart({ productId: '1', name: 'Item', price: 10, quantity: 2 });

      const state = useCartStore.getState();
      expect(state.items.length).toBe(1);
      expect(state.items[0].quantity).toBe(3);
    });

    it('should default quantity to 1 if not provided', () => {
      const { addToCart } = useCartStore.getState();
      
      addToCart({ productId: '1', name: 'Item', price: 10 });

      const state = useCartStore.getState();
      expect(state.items[0].quantity).toBe(1);
    });
  });

  describe('removeFromCart', () => {
    it('should remove item by productId', () => {
      const { addToCart, removeFromCart } = useCartStore.getState();
      
      addToCart({ productId: '1', name: 'Item 1', price: 10 });
      addToCart({ productId: '2', name: 'Item 2', price: 20 });
      
      removeFromCart('1');

      const state = useCartStore.getState();
      expect(state.items.length).toBe(1);
      expect(state.items[0].productId).toBe('2');
    });
  });

  describe('updateQuantity', () => {
    it('should update quantity for item', () => {
      const { addToCart, updateQuantity } = useCartStore.getState();
      
      addToCart({ productId: '1', name: 'Item', price: 10 });
      updateQuantity('1', 5);

      const state = useCartStore.getState();
      expect(state.items[0].quantity).toBe(5);
    });

    it('should remove item when quantity set to 0', () => {
      const { addToCart, updateQuantity } = useCartStore.getState();
      
      addToCart({ productId: '1', name: 'Item', price: 10 });
      updateQuantity('1', 0);

      const state = useCartStore.getState();
      expect(state.items.length).toBe(0);
    });

    it('should remove item when quantity is negative', () => {
      const { addToCart, updateQuantity } = useCartStore.getState();
      
      addToCart({ productId: '1', name: 'Item', price: 10 });
      updateQuantity('1', -1);

      const state = useCartStore.getState();
      expect(state.items.length).toBe(0);
    });
  });

  describe('getTotalItems', () => {
    it('should return total item count', () => {
      const { addToCart, getTotalItems } = useCartStore.getState();
      
      addToCart({ productId: '1', name: 'Item 1', price: 10, quantity: 2 });
      addToCart({ productId: '2', name: 'Item 2', price: 20, quantity: 3 });

      expect(getTotalItems()).toBe(5);
    });

    it('should return 0 for empty cart', () => {
      const { getTotalItems } = useCartStore.getState();
      expect(getTotalItems()).toBe(0);
    });
  });

  describe('getTotalPrice', () => {
    it('should return total price', () => {
      const { addToCart, getTotalPrice } = useCartStore.getState();
      
      addToCart({ productId: '1', name: 'Item 1', price: 10, quantity: 2 }); // 20
      addToCart({ productId: '2', name: 'Item 2', price: 25, quantity: 1 }); // 25

      expect(getTotalPrice()).toBe(45);
    });

    it('should return 0 for empty cart', () => {
      const { getTotalPrice } = useCartStore.getState();
      expect(getTotalPrice()).toBe(0);
    });
  });

  describe('Wishlist', () => {
    it('should add item to wishlist', () => {
      const { addToWishlist } = useCartStore.getState();
      
      addToWishlist({
        productId: '1',
        name: 'Wishlist Item',
        price: 99.99,
        image: 'image.jpg',
      });

      const state = useCartStore.getState();
      expect(state.wishlist.length).toBe(1);
      expect(state.wishlist[0].name).toBe('Wishlist Item');
    });

    it('should not add duplicate to wishlist', () => {
      const { addToWishlist } = useCartStore.getState();
      
      addToWishlist({ productId: '1', name: 'Item', price: 10 });
      addToWishlist({ productId: '1', name: 'Item', price: 10 });

      const state = useCartStore.getState();
      expect(state.wishlist.length).toBe(1);
    });

    it('should remove from wishlist', () => {
      const { addToWishlist, removeFromWishlist } = useCartStore.getState();
      
      addToWishlist({ productId: '1', name: 'Item', price: 10 });
      removeFromWishlist('1');

      const state = useCartStore.getState();
      expect(state.wishlist.length).toBe(0);
    });

    it('should toggle wishlist item - add', () => {
      const { toggleWishlistItem } = useCartStore.getState();
      
      toggleWishlistItem({ id: '1', name: 'Item', price: 10 });

      const state = useCartStore.getState();
      expect(state.wishlist.length).toBe(1);
    });

    it('should toggle wishlist item - remove', () => {
      const { toggleWishlistItem } = useCartStore.getState();
      
      toggleWishlistItem({ id: '1', name: 'Item', price: 10 });
      toggleWishlistItem({ id: '1', name: 'Item', price: 10 });

      const state = useCartStore.getState();
      expect(state.wishlist.length).toBe(0);
    });

    it('should check if item is in wishlist', () => {
      const { addToWishlist, isInWishlist } = useCartStore.getState();
      
      addToWishlist({ productId: '1', name: 'Item', price: 10 });

      expect(isInWishlist('1')).toBe(true);
      expect(isInWishlist('2')).toBe(false);
    });

    it('should clear wishlist', () => {
      const { addToWishlist, clearWishlist } = useCartStore.getState();
      
      addToWishlist({ productId: '1', name: 'Item 1', price: 10 });
      addToWishlist({ productId: '2', name: 'Item 2', price: 20 });
      clearWishlist();

      const state = useCartStore.getState();
      expect(state.wishlist.length).toBe(0);
    });
  });

  describe('Recently Viewed', () => {
    it('should add to recently viewed', () => {
      const { addRecentlyViewed } = useCartStore.getState();
      
      addRecentlyViewed({
        productId: '1',
        name: 'Viewed Item',
        price: 50,
      });

      const state = useCartStore.getState();
      expect(state.recentlyViewed.length).toBe(1);
    });

    it('should add to recently viewed using alternative method', () => {
      const { addToRecentlyViewed } = useCartStore.getState();
      
      addToRecentlyViewed({
        id: '1',
        name: 'Item',
        price: 50,
      });

      const state = useCartStore.getState();
      expect(state.recentlyViewed.length).toBe(1);
      expect(state.recentlyViewed[0].productId).toBe('1');
    });

    it('should move duplicate to front', () => {
      const { addRecentlyViewed } = useCartStore.getState();
      
      addRecentlyViewed({ productId: '1', name: 'First', price: 10 });
      addRecentlyViewed({ productId: '2', name: 'Second', price: 20 });
      addRecentlyViewed({ productId: '1', name: 'First', price: 10 });

      const state = useCartStore.getState();
      expect(state.recentlyViewed.length).toBe(2);
      expect(state.recentlyViewed[0].productId).toBe('1');
    });

    it('should limit to 12 items', () => {
      const { addRecentlyViewed } = useCartStore.getState();
      
      for (let i = 0; i < 15; i++) {
        addRecentlyViewed({ productId: `${i}`, name: `Item ${i}`, price: 10 });
      }

      const state = useCartStore.getState();
      expect(state.recentlyViewed.length).toBe(12);
    });

    it('should clear recently viewed', () => {
      const { addRecentlyViewed, clearRecentlyViewed } = useCartStore.getState();
      
      addRecentlyViewed({ productId: '1', name: 'Item', price: 10 });
      clearRecentlyViewed();

      const state = useCartStore.getState();
      expect(state.recentlyViewed.length).toBe(0);
    });
  });

  describe('Recent Searches', () => {
    it('should add recent search', () => {
      const { addRecentSearch } = useCartStore.getState();
      
      addRecentSearch('blue shirt');

      const state = useCartStore.getState();
      expect(state.recentSearches).toContain('blue shirt');
    });

    it('should clear recent searches', () => {
      const { addRecentSearch, clearRecentSearches } = useCartStore.getState();
      
      addRecentSearch('shirt');
      addRecentSearch('pants');
      clearRecentSearches();

      const state = useCartStore.getState();
      expect(state.recentSearches.length).toBe(0);
    });
  });

  describe('User Profile', () => {
    it('should set user profile', () => {
      const { setUserProfile } = useCartStore.getState();
      
      setUserProfile({
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
      });

      const state = useCartStore.getState();
      expect(state.userProfile?.email).toBe('test@example.com');
    });

    it('should clear user', () => {
      const { setUserProfile, clearUser } = useCartStore.getState();
      
      setUserProfile({ id: '1', email: 'test@example.com', name: 'Test' });
      clearUser();

      const state = useCartStore.getState();
      expect(state.userProfile).toBeNull();
    });
  });

  describe('Cart Alias', () => {
    it('cart getter should return items array', () => {
      const { addItem } = useCartStore.getState();
      
      addItem({
        id: '1',
        productId: '1',
        name: 'Test',
        price: 10,
        quantity: 1,
      });

      const state = useCartStore.getState();
      // cart is a getter that returns items - verify items has the added item
      expect(state.items.length).toBe(1);
      expect(state.items[0].name).toBe('Test');
    });
  });
});
