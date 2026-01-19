import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../../../../app/(tabs)/index';
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

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }: any) => children,
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
  useProducts: jest.fn(),
  useCategories: jest.fn(),
}));

// Mock cart store
const mockAddToCart = jest.fn();
const mockToggleWishlistItem = jest.fn();
const mockAddToRecentlyViewed = jest.fn();

jest.mock('../../../store/cartStore', () => ({
  useCartStore: jest.fn((selector) => {
    const state = {
      items: [],
      wishlist: [],
      recentlyViewed: [],
      addToCart: mockAddToCart,
      toggleWishlistItem: mockToggleWishlistItem,
      addToRecentlyViewed: mockAddToRecentlyViewed,
    };
    return selector ? selector(state) : state;
  }),
}));

import { useProducts, useCategories } from '../../../lib/hooks';

describe('HomeScreen', () => {
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
    { id: '1', name: 'Electronics', slug: 'electronics', productCount: 10 },
    { id: '2', name: 'Clothing', slug: 'clothing', productCount: 8 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useProducts as jest.Mock).mockReturnValue({
      data: { products: mockProducts },
      isLoading: false,
      refetch: jest.fn(),
      isRefetching: false,
    });
    (useCategories as jest.Mock).mockReturnValue({
      data: mockCategories,
      isLoading: false,
      refetch: jest.fn(),
    });
  });

  it('should render home screen correctly', async () => {
    const { getByText } = render(<HomeScreen />);

    await waitFor(() => {
      // Text contains newline, so use regex to match partial content
      expect(getByText(/Discover/)).toBeTruthy();
    });
  });

  it('should display welcome message', async () => {
    const { getByText } = render(<HomeScreen />);

    await waitFor(() => {
      expect(getByText('✨ Welcome Back')).toBeTruthy();
    });
  });

  it('should display Featured Products section', async () => {
    const { getByText } = render(<HomeScreen />);

    await waitFor(() => {
      expect(getByText('Featured Products')).toBeTruthy();
    });
  });

  it('should display Shop by Category section when categories exist', async () => {
    const { getByText } = render(<HomeScreen />);

    await waitFor(() => {
      expect(getByText('Shop by Category')).toBeTruthy();
    });
  });

  it('should display product names', async () => {
    const { getAllByText } = render(<HomeScreen />);

    await waitFor(() => {
      // Products may appear in multiple sections (Featured & New Arrivals)
      const product1Elements = getAllByText('Test Product 1');
      expect(product1Elements.length).toBeGreaterThan(0);
    });
  });

  it('should display Explore Now button', async () => {
    const { getByText } = render(<HomeScreen />);

    await waitFor(() => {
      expect(getByText('Explore Now')).toBeTruthy();
    });
  });

  it('should navigate to products when Explore Now is pressed', async () => {
    const { getByText } = render(<HomeScreen />);

    await waitFor(() => {
      const exploreButton = getByText('Explore Now');
      fireEvent.press(exploreButton);
    });

    expect(router.push).toHaveBeenCalledWith('/products');
  });

  it('should display special offer promo', async () => {
    const { getByText } = render(<HomeScreen />);

    await waitFor(() => {
      expect(getByText('Get 20% off on your first order with code FIRST20')).toBeTruthy();
    });
  });

  it('should show loading state when data is loading', async () => {
    (useProducts as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      refetch: jest.fn(),
      isRefetching: false,
    });
    (useCategories as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      refetch: jest.fn(),
    });

    const { getByText } = render(<HomeScreen />);

    await waitFor(() => {
      expect(getByText('Loading...')).toBeTruthy();
    });
  });

  it('should display category names', async () => {
    const { getByText } = render(<HomeScreen />);

    await waitFor(() => {
      expect(getByText('Electronics')).toBeTruthy();
      expect(getByText('Clothing')).toBeTruthy();
    });
  });

  it('should show See All links', async () => {
    const { getAllByText } = render(<HomeScreen />);

    await waitFor(() => {
      const seeAllButtons = getAllByText('See All');
      expect(seeAllButtons.length).toBeGreaterThan(0);
    });
  });

  it('should display empty state when no products', async () => {
    (useProducts as jest.Mock).mockReturnValue({
      data: { products: [] },
      isLoading: false,
      refetch: jest.fn(),
      isRefetching: false,
    });

    const { getByText } = render(<HomeScreen />);

    await waitFor(() => {
      expect(getByText('No products found')).toBeTruthy();
    });
  });
});
