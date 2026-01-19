/**
 * Comprehensive tests for Cart Store
 */

import { act } from '@testing-library/react-native';
import { useCartStore } from '../../store/cartStore';

// Reset store before each test
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

describe('Cart Store', () => {
  describe('Cart Operations', () => {
    const mockItem = {
      id: 'item-1',
      productId: 'product-1',
      name: 'Test Product',
      price: 29.99,
      quantity: 1,
      image: 'test.jpg',
    };

    it('should start with empty cart', () => {
      const state = useCartStore.getState();
      expect(state.items).toEqual([]);
    });

    it('should add item to cart', () => {
      const { addItem } = useCartStore.getState();

      act(() => {
        addItem(mockItem);
      });

      const state = useCartStore.getState();
      expect(state.items.length).toBe(1);
      expect(state.items[0].name).toBe('Test Product');
      expect(state.items[0].price).toBe(29.99);
    });

    it('should increase quantity when adding same item', () => {
      const { addItem } = useCartStore.getState();

      act(() => {
        addItem(mockItem);
        addItem({ ...mockItem, quantity: 2 });
      });

      const state = useCartStore.getState();
      expect(state.items.length).toBe(1);
      expect(state.items[0].quantity).toBe(3);
    });

    it('should add item using addToCart', () => {
      const { addToCart } = useCartStore.getState();

      act(() => {
        addToCart({
          productId: 'product-2',
          name: 'Another Product',
          price: 49.99,
          quantity: 2,
        });
      });

      const state = useCartStore.getState();
      expect(state.items.length).toBe(1);
      expect(state.items[0].quantity).toBe(2);
    });

    it('should remove item from cart by id', () => {
      const { addItem, removeItem } = useCartStore.getState();

      act(() => {
        addItem(mockItem);
        removeItem('item-1');
      });

      const state = useCartStore.getState();
      expect(state.items.length).toBe(0);
    });

    it('should remove item from cart by productId', () => {
      const { addItem, removeFromCart } = useCartStore.getState();

      act(() => {
        addItem(mockItem);
        removeFromCart('product-1');
      });

      const state = useCartStore.getState();
      expect(state.items.length).toBe(0);
    });

    it('should update item quantity', () => {
      const { addItem, updateQuantity } = useCartStore.getState();

      act(() => {
        addItem(mockItem);
        updateQuantity('item-1', 5);
      });

      const state = useCartStore.getState();
      expect(state.items[0].quantity).toBe(5);
    });

    it('should remove item when quantity is set to 0', () => {
      const { addItem, updateQuantity } = useCartStore.getState();

      act(() => {
        addItem(mockItem);
        updateQuantity('item-1', 0);
      });

      const state = useCartStore.getState();
      expect(state.items.length).toBe(0);
    });

    it('should clear cart', () => {
      const { addItem, clearCart } = useCartStore.getState();

      act(() => {
        addItem(mockItem);
        addItem({ ...mockItem, id: 'item-2', productId: 'product-2' });
        clearCart();
      });

      const state = useCartStore.getState();
      expect(state.items.length).toBe(0);
    });

    it('should calculate total items', () => {
      const { addItem, getTotalItems } = useCartStore.getState();

      act(() => {
        addItem({ ...mockItem, quantity: 2 });
        addItem({ ...mockItem, id: 'item-2', productId: 'product-2', quantity: 3 });
      });

      expect(getTotalItems()).toBe(5);
    });

    it('should calculate total price', () => {
      const { addItem, getTotalPrice } = useCartStore.getState();

      act(() => {
        addItem({ ...mockItem, price: 10, quantity: 2 }); // 20
        addItem({ ...mockItem, id: 'item-2', productId: 'product-2', price: 15, quantity: 1 }); // 15
      });

      expect(getTotalPrice()).toBe(35);
    });

    it('should handle cart with variants', () => {
      const { addToCart } = useCartStore.getState();

      act(() => {
        addToCart({
          productId: 'product-1',
          name: 'Product',
          price: 20,
          quantity: 1,
          variant: 'Size: M',
        });
      });

      const state = useCartStore.getState();
      expect(state.items[0].id).toBe('product-1Size: M');
    });
  });

  describe('Wishlist Operations', () => {
    const mockWishlistItem = {
      productId: 'product-1',
      id: 'product-1',
      name: 'Wishlist Product',
      price: 99.99,
      image: 'wishlist.jpg',
    };

    it('should add item to wishlist', () => {
      const { addToWishlist } = useCartStore.getState();

      act(() => {
        addToWishlist(mockWishlistItem);
      });

      const state = useCartStore.getState();
      expect(state.wishlist.length).toBe(1);
      expect(state.wishlist[0].name).toBe('Wishlist Product');
      expect(state.wishlist[0].addedAt).toBeDefined();
    });

    it('should not add duplicate to wishlist', () => {
      const { addToWishlist } = useCartStore.getState();

      act(() => {
        addToWishlist(mockWishlistItem);
        addToWishlist(mockWishlistItem);
      });

      const state = useCartStore.getState();
      expect(state.wishlist.length).toBe(1);
    });

    it('should remove item from wishlist', () => {
      const { addToWishlist, removeFromWishlist } = useCartStore.getState();

      act(() => {
        addToWishlist(mockWishlistItem);
        removeFromWishlist('product-1');
      });

      const state = useCartStore.getState();
      expect(state.wishlist.length).toBe(0);
    });

    it('should toggle wishlist item', () => {
      const { toggleWishlistItem } = useCartStore.getState();

      // Add
      act(() => {
        toggleWishlistItem(mockWishlistItem);
      });

      let state = useCartStore.getState();
      expect(state.wishlist.length).toBe(1);

      // Remove
      act(() => {
        toggleWishlistItem(mockWishlistItem);
      });

      state = useCartStore.getState();
      expect(state.wishlist.length).toBe(0);
    });

    it('should check if item is in wishlist', () => {
      const { addToWishlist, isInWishlist } = useCartStore.getState();

      expect(isInWishlist('product-1')).toBe(false);

      act(() => {
        addToWishlist(mockWishlistItem);
      });

      expect(useCartStore.getState().isInWishlist('product-1')).toBe(true);
    });

    it('should clear wishlist', () => {
      const { addToWishlist, clearWishlist } = useCartStore.getState();

      act(() => {
        addToWishlist(mockWishlistItem);
        addToWishlist({ ...mockWishlistItem, productId: 'product-2', id: 'product-2' });
        clearWishlist();
      });

      const state = useCartStore.getState();
      expect(state.wishlist.length).toBe(0);
    });
  });

  describe('Recently Viewed Operations', () => {
    const mockRecentItem = {
      productId: 'product-1',
      name: 'Recently Viewed Product',
      price: 59.99,
      image: 'recent.jpg',
    };

    it('should add recently viewed item', () => {
      const { addRecentlyViewed } = useCartStore.getState();

      act(() => {
        addRecentlyViewed(mockRecentItem);
      });

      const state = useCartStore.getState();
      expect(state.recentlyViewed.length).toBe(1);
      expect(state.recentlyViewed[0].viewedAt).toBeDefined();
    });

    it('should move existing item to front', () => {
      const { addRecentlyViewed } = useCartStore.getState();

      act(() => {
        addRecentlyViewed(mockRecentItem);
        addRecentlyViewed({ ...mockRecentItem, productId: 'product-2' });
        addRecentlyViewed(mockRecentItem); // View again
      });

      const state = useCartStore.getState();
      expect(state.recentlyViewed.length).toBe(2);
      expect(state.recentlyViewed[0].productId).toBe('product-1');
    });

    it('should limit to 12 items', () => {
      const { addRecentlyViewed } = useCartStore.getState();

      act(() => {
        for (let i = 0; i < 15; i++) {
          addRecentlyViewed({ ...mockRecentItem, productId: `product-${i}` });
        }
      });

      const state = useCartStore.getState();
      expect(state.recentlyViewed.length).toBe(12);
    });

    it('should clear recently viewed', () => {
      const { addRecentlyViewed, clearRecentlyViewed } = useCartStore.getState();

      act(() => {
        addRecentlyViewed(mockRecentItem);
        clearRecentlyViewed();
      });

      const state = useCartStore.getState();
      expect(state.recentlyViewed.length).toBe(0);
    });

    it('should add recently viewed using addToRecentlyViewed', () => {
      const { addToRecentlyViewed } = useCartStore.getState();

      act(() => {
        addToRecentlyViewed({
          id: 'product-1',
          name: 'Product',
          price: 100,
          image: 'img.jpg',
        });
      });

      const state = useCartStore.getState();
      expect(state.recentlyViewed.length).toBe(1);
      expect(state.recentlyViewed[0].productId).toBe('product-1');
    });
  });

  describe('Recent Searches', () => {
    it('should add recent search', () => {
      const { addRecentSearch } = useCartStore.getState();

      act(() => {
        addRecentSearch('shoes');
      });

      const state = useCartStore.getState();
      expect(state.recentSearches).toContain('shoes');
    });

    it('should not add duplicate searches (case insensitive)', () => {
      const { addRecentSearch } = useCartStore.getState();

      act(() => {
        addRecentSearch('Shoes');
        addRecentSearch('shoes');
        addRecentSearch('SHOES');
      });

      const state = useCartStore.getState();
      expect(state.recentSearches.length).toBe(1);
    });

    it('should limit to 20 searches', () => {
      const { addRecentSearch } = useCartStore.getState();

      act(() => {
        for (let i = 0; i < 25; i++) {
          addRecentSearch(`search-${i}`);
        }
      });

      const state = useCartStore.getState();
      expect(state.recentSearches.length).toBe(20);
    });

    it('should clear recent searches', () => {
      const { addRecentSearch, clearRecentSearches } = useCartStore.getState();

      act(() => {
        addRecentSearch('test');
        clearRecentSearches();
      });

      const state = useCartStore.getState();
      expect(state.recentSearches.length).toBe(0);
    });
  });

  describe('User Profile Operations', () => {
    const mockProfile = {
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
      phone: '+1234567890',
      addresses: [],
    };

    it('should set user profile', () => {
      const { setUserProfile } = useCartStore.getState();

      act(() => {
        setUserProfile(mockProfile);
      });

      const state = useCartStore.getState();
      expect(state.userProfile?.email).toBe('test@example.com');
    });

    it('should clear user', () => {
      const { setUserProfile, clearUser } = useCartStore.getState();

      act(() => {
        setUserProfile(mockProfile);
        clearUser();
      });

      const state = useCartStore.getState();
      expect(state.userProfile).toBeNull();
    });
  });

  describe('Address Operations', () => {
    const mockAddress = {
      id: 'addr-1',
      label: 'Home',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    };

    beforeEach(() => {
      act(() => {
        useCartStore.getState().setUserProfile({
          id: 'user-1',
          email: 'test@example.com',
          name: 'Test User',
          addresses: [],
        });
      });
    });

    it('should add address', () => {
      const { addAddress } = useCartStore.getState();

      act(() => {
        addAddress(mockAddress);
      });

      const state = useCartStore.getState();
      expect(state.userProfile?.addresses?.length).toBe(1);
    });

    it('should not add address if no user profile', () => {
      act(() => {
        useCartStore.setState({ userProfile: null });
      });

      const { addAddress } = useCartStore.getState();

      act(() => {
        addAddress(mockAddress);
      });

      const state = useCartStore.getState();
      expect(state.userProfile).toBeNull();
    });

    it('should update address', () => {
      const { addAddress, updateAddress } = useCartStore.getState();

      act(() => {
        addAddress(mockAddress);
        updateAddress('addr-1', { city: 'Boston', state: 'MA' });
      });

      const state = useCartStore.getState();
      const updatedAddress = state.userProfile?.addresses?.find((a: any) => a.id === 'addr-1');
      expect(updatedAddress?.city).toBe('Boston');
      expect(updatedAddress?.state).toBe('MA');
    });

    it('should not update address if no user profile', () => {
      act(() => {
        useCartStore.setState({ userProfile: null });
      });

      const { updateAddress } = useCartStore.getState();

      act(() => {
        updateAddress('addr-1', { city: 'Boston' });
      });

      const state = useCartStore.getState();
      expect(state.userProfile).toBeNull();
    });

    it('should remove address', () => {
      const { addAddress, removeAddress } = useCartStore.getState();

      act(() => {
        addAddress(mockAddress);
        addAddress({ ...mockAddress, id: 'addr-2', label: 'Work' });
        removeAddress('addr-1');
      });

      const state = useCartStore.getState();
      expect(state.userProfile?.addresses?.length).toBe(1);
      expect(state.userProfile?.addresses?.[0].id).toBe('addr-2');
    });

    it('should not remove address if no user profile', () => {
      act(() => {
        useCartStore.setState({ userProfile: null });
      });

      const { removeAddress } = useCartStore.getState();

      act(() => {
        removeAddress('addr-1');
      });

      const state = useCartStore.getState();
      expect(state.userProfile).toBeNull();
    });

    it('should set default address', () => {
      const { addAddress, setDefaultAddress } = useCartStore.getState();

      act(() => {
        addAddress(mockAddress);
        setDefaultAddress('addr-1');
      });

      const state = useCartStore.getState();
      expect(state.userProfile?.defaultAddressId).toBe('addr-1');
    });

    it('should not set default address if no user profile', () => {
      act(() => {
        useCartStore.setState({ userProfile: null });
      });

      const { setDefaultAddress } = useCartStore.getState();

      act(() => {
        setDefaultAddress('addr-1');
      });

      const state = useCartStore.getState();
      expect(state.userProfile).toBeNull();
    });
  });

  describe('Cart Alias', () => {
    it('should access items through items array', () => {
      const { addItem } = useCartStore.getState();
      const mockItem = {
        id: 'item-1',
        productId: 'product-1',
        name: 'Test Product',
        price: 29.99,
        quantity: 1,
      };

      act(() => {
        addItem(mockItem);
      });

      const state = useCartStore.getState();
      expect(state.items.length).toBe(1);
      expect(state.items[0].name).toBe('Test Product');
    });
  });

  describe('Wishlist with ID alias', () => {
    it('should add item using id field', () => {
      const { addToWishlist } = useCartStore.getState();

      act(() => {
        addToWishlist({
          id: 'product-1',
          productId: '',
          name: 'Product',
          price: 100,
        });
      });

      const state = useCartStore.getState();
      expect(state.wishlist.length).toBe(1);
    });

    it('should not add duplicate using id field', () => {
      const { addToWishlist } = useCartStore.getState();

      act(() => {
        addToWishlist({
          id: 'product-1',
          productId: '',
          name: 'Product',
          price: 100,
        });
        addToWishlist({
          id: 'product-1',
          productId: '',
          name: 'Product',
          price: 100,
        });
      });

      const state = useCartStore.getState();
      expect(state.wishlist.length).toBe(1);
    });

    it('should remove from wishlist using id field', () => {
      const { addToWishlist, removeFromWishlist } = useCartStore.getState();

      act(() => {
        addToWishlist({
          id: 'product-1',
          productId: '',
          name: 'Product',
          price: 100,
        });
        removeFromWishlist('product-1');
      });

      const state = useCartStore.getState();
      expect(state.wishlist.length).toBe(0);
    });
  });

  describe('Update quantity by productId', () => {
    it('should update quantity by productId', () => {
      const { addItem, updateQuantity } = useCartStore.getState();
      const mockItem = {
        id: 'item-1',
        productId: 'product-1',
        name: 'Product',
        price: 100,
        quantity: 1,
      };

      act(() => {
        addItem(mockItem);
        updateQuantity('product-1', 5);
      });

      const state = useCartStore.getState();
      expect(state.items[0].quantity).toBe(5);
    });

    it('should remove item when updating quantity to 0 by productId', () => {
      const { addItem, updateQuantity } = useCartStore.getState();
      const mockItem = {
        id: 'item-1',
        productId: 'product-1',
        name: 'Product',
        price: 100,
        quantity: 1,
      };

      act(() => {
        addItem(mockItem);
        updateQuantity('product-1', 0);
      });

      const state = useCartStore.getState();
      expect(state.items.length).toBe(0);
    });
  });
});
