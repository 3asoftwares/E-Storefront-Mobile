import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import WishlistScreen from '../../../../app/(tabs)/wishlist';
import { router } from 'expo-router';

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  Link: ({ children }: any) => children,
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: any) => children,
}));

// Mock @fortawesome
jest.mock('@fortawesome/react-native-fontawesome', () => ({
  FontAwesomeIcon: () => null,
}));

// Mock helpers
jest.mock('../../../utils/helpers', () => ({
  showAlert: jest.fn(),
  showConfirm: jest.fn((title, message, onConfirm) => onConfirm && onConfirm()),
}));

// Wishlist store mock state
let mockWishlistItems: any[] = [];
const mockAddToCart = jest.fn();
const mockRemoveFromWishlist = jest.fn();
const mockClearWishlist = jest.fn();

jest.mock('../../../store/cartStore', () => ({
  useCartStore: jest.fn((selector) => {
    const state = {
      wishlist: mockWishlistItems,
      addToCart: mockAddToCart,
      removeFromWishlist: mockRemoveFromWishlist,
      clearWishlist: mockClearWishlist,
    };
    return selector ? selector(state) : state;
  }),
}));

import { showAlert, showConfirm } from '../../../utils/helpers';

describe('WishlistScreen', () => {
  const mockWishlistData = [
    {
      productId: '1',
      name: 'Wishlist Product 1',
      price: 99.99,
      image: 'https://example.com/image1.jpg',
      addedAt: Date.now(),
    },
    {
      productId: '2',
      name: 'Wishlist Product 2',
      price: 149.99,
      image: 'https://example.com/image2.jpg',
      addedAt: Date.now(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockWishlistItems = [...mockWishlistData];
  });

  it('should render wishlist screen with header', async () => {
    const { getByText } = render(<WishlistScreen />);

    await waitFor(() => {
      expect(getByText('Wishlist')).toBeTruthy();
    });
  });

  it('should display wishlist items', async () => {
    const { getByText } = render(<WishlistScreen />);

    await waitFor(() => {
      expect(getByText('Wishlist Product 1')).toBeTruthy();
      expect(getByText('Wishlist Product 2')).toBeTruthy();
    });
  });

  it('should display item prices', async () => {
    const { getByText } = render(<WishlistScreen />);

    await waitFor(() => {
      expect(getByText('₹99.99')).toBeTruthy();
      expect(getByText('₹149.99')).toBeTruthy();
    });
  });

  it('should display item count', async () => {
    const { getByText } = render(<WishlistScreen />);

    await waitFor(() => {
      expect(getByText('2 items saved')).toBeTruthy();
    });
  });

  it('should display Clear All button', async () => {
    const { getByText } = render(<WishlistScreen />);

    await waitFor(() => {
      expect(getByText('Clear All')).toBeTruthy();
    });
  });

  it('should display Add to Cart buttons', async () => {
    const { getAllByText } = render(<WishlistScreen />);

    await waitFor(() => {
      const addToCartButtons = getAllByText('Add to Cart');
      expect(addToCartButtons.length).toBe(2);
    });
  });

  it('should display Add All to Cart button', async () => {
    const { getByText } = render(<WishlistScreen />);

    await waitFor(() => {
      expect(getByText('Add All to Cart (2 items)')).toBeTruthy();
    });
  });

  it('should add item to cart when Add to Cart is pressed', async () => {
    const { getAllByText } = render(<WishlistScreen />);

    await waitFor(() => {
      const addToCartButtons = getAllByText('Add to Cart');
      fireEvent.press(addToCartButtons[0]);
    });

    expect(mockAddToCart).toHaveBeenCalled();
    expect(showAlert).toHaveBeenCalledWith(
      'Added to Cart',
      'Wishlist Product 1 has been added to your cart'
    );
  });

  it('should add all items to cart when Add All to Cart is pressed', async () => {
    const { getByText } = render(<WishlistScreen />);

    await waitFor(() => {
      const addAllButton = getByText('Add All to Cart (2 items)');
      fireEvent.press(addAllButton);
    });

    expect(mockAddToCart).toHaveBeenCalledTimes(2);
    expect(showAlert).toHaveBeenCalledWith('Success', 'All items have been added to your cart');
  });

  it('should show clear wishlist confirmation when Clear All is pressed', async () => {
    const { getByText } = render(<WishlistScreen />);

    await waitFor(() => {
      const clearButton = getByText('Clear All');
      fireEvent.press(clearButton);
    });

    expect(showConfirm).toHaveBeenCalledWith(
      'Clear Wishlist',
      'Are you sure you want to remove all items from your wishlist?',
      expect.any(Function),
      undefined,
      'Clear'
    );
  });

  it('should navigate to product detail when item is pressed', async () => {
    const { getByText } = render(<WishlistScreen />);

    await waitFor(() => {
      const productCard = getByText('Wishlist Product 1');
      fireEvent.press(productCard);
    });

    expect(router.push).toHaveBeenCalledWith('/product/1');
  });

  describe('Empty Wishlist', () => {
    beforeEach(() => {
      mockWishlistItems = [];
    });

    it('should display empty wishlist message', async () => {
      const { getByText } = render(<WishlistScreen />);

      await waitFor(() => {
        expect(getByText('Your wishlist is empty')).toBeTruthy();
      });
    });

    it('should display empty wishlist description', async () => {
      const { getByText } = render(<WishlistScreen />);

      await waitFor(() => {
        expect(getByText('Save items you like by tapping the heart icon')).toBeTruthy();
      });
    });

    it('should show Browse Products button in empty state', async () => {
      const { getByText } = render(<WishlistScreen />);

      await waitFor(() => {
        expect(getByText('Browse Products')).toBeTruthy();
      });
    });

    it('should navigate to products from empty wishlist', async () => {
      const { getByText } = render(<WishlistScreen />);

      await waitFor(() => {
        const browseButton = getByText('Browse Products');
        fireEvent.press(browseButton);
      });

      expect(router.push).toHaveBeenCalledWith('/products');
    });
  });

  describe('Single Item Wishlist', () => {
    beforeEach(() => {
      mockWishlistItems = [mockWishlistData[0]];
    });

    it('should display singular item count', async () => {
      const { getByText } = render(<WishlistScreen />);

      await waitFor(() => {
        expect(getByText('1 item saved')).toBeTruthy();
      });
    });
  });
});
