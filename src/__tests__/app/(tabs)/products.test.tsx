import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import ProductsScreen from '../../../../app/(tabs)/products';
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

// Mock hooks
jest.mock('../../../lib/hooks', () => ({
  useInfiniteProducts: jest.fn(),
  useCategories: jest.fn(),
}));

// Mock cart store
const mockAddToCart = jest.fn();
const mockToggleWishlistItem = jest.fn();

jest.mock('../../../store/cartStore', () => ({
  useCartStore: jest.fn((selector) => {
    const state = {
      items: [],
      wishlist: [],
      addToCart: mockAddToCart,
      toggleWishlistItem: mockToggleWishlistItem,
    };
    return selector ? selector(state) : state;
  }),
}));

import { useInfiniteProducts, useCategories } from '../../../lib/hooks';

describe('ProductsScreen', () => {
  const mockProducts = [
    {
      id: '1',
      name: 'Test Product 1',
      price: 99.99,
      salePrice: 79.99,
      imageUrl: 'https://example.com/image1.jpg',
      rating: 4.5,
      reviewCount: 10,
    },
    {
      id: '2',
      name: 'Test Product 2',
      price: 149.99,
      imageUrl: 'https://example.com/image2.jpg',
      rating: 4.0,
      reviewCount: 5,
    },
  ];

  const mockCategories = [
    { id: '1', name: 'Electronics', slug: 'electronics' },
    { id: '2', name: 'Clothing', slug: 'clothing' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useInfiniteProducts as jest.Mock).mockReturnValue({
      data: { pages: [{ products: mockProducts }] },
      isLoading: false,
      refetch: jest.fn(),
      isRefetching: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
    });
    (useCategories as jest.Mock).mockReturnValue({
      data: mockCategories,
      isLoading: false,
    });
  });

  it('should render products screen correctly', async () => {
    const { getByPlaceholderText } = render(<ProductsScreen />);

    await waitFor(() => {
      expect(getByPlaceholderText('Search products...')).toBeTruthy();
    });
  });

  it('should display search input', async () => {
    const { getByPlaceholderText } = render(<ProductsScreen />);

    await waitFor(() => {
      const searchInput = getByPlaceholderText('Search products...');
      expect(searchInput).toBeTruthy();
    });
  });

  it('should handle search input', async () => {
    const { getByPlaceholderText } = render(<ProductsScreen />);

    await waitFor(() => {
      const searchInput = getByPlaceholderText('Search products...');
      fireEvent.changeText(searchInput, 'test search');
      expect(searchInput.props.value).toBe('test search');
    });
  });

  it('should display product names', async () => {
    const { getByText } = render(<ProductsScreen />);

    await waitFor(() => {
      expect(getByText('Test Product 1')).toBeTruthy();
      expect(getByText('Test Product 2')).toBeTruthy();
    });
  });

  it('should display product prices', async () => {
    const { getByText } = render(<ProductsScreen />);

    await waitFor(() => {
      expect(getByText('₹79.99')).toBeTruthy(); // Sale price
      expect(getByText('₹149.99')).toBeTruthy();
    });
  });

  it('should display Add to Cart buttons', async () => {
    const { getAllByText } = render(<ProductsScreen />);

    await waitFor(() => {
      const addToCartButtons = getAllByText('Add to Cart');
      expect(addToCartButtons.length).toBeGreaterThan(0);
    });
  });

  it('should navigate to product detail when product is pressed', async () => {
    const { getByText } = render(<ProductsScreen />);

    await waitFor(() => {
      const productCard = getByText('Test Product 1');
      fireEvent.press(productCard);
    });

    expect(router.push).toHaveBeenCalledWith('/product/1');
  });

  it('should show loading state when fetching next page', async () => {
    (useInfiniteProducts as jest.Mock).mockReturnValue({
      data: { pages: [{ products: mockProducts }] },
      isLoading: false,
      refetch: jest.fn(),
      isRefetching: false,
      isFetchingNextPage: true,
      hasNextPage: true,
      fetchNextPage: jest.fn(),
    });

    const { getByText } = render(<ProductsScreen />);

    await waitFor(() => {
      expect(getByText('Loading more...')).toBeTruthy();
    });
  });

  it('should display discount badge on sale items', async () => {
    const { getByText } = render(<ProductsScreen />);

    await waitFor(() => {
      expect(getByText('-20%')).toBeTruthy();
    });
  });

  it('should display product ratings', async () => {
    const { getByText } = render(<ProductsScreen />);

    await waitFor(() => {
      expect(getByText(' 4.5')).toBeTruthy();
      expect(getByText('(10)')).toBeTruthy();
    });
  });
});
