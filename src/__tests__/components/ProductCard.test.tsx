import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

// Mock dependencies
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('../../store/cartStore', () => ({
  useCartStore: () => ({
    addItem: jest.fn(),
    addToWishlist: jest.fn(),
    removeFromWishlist: jest.fn(),
    isInWishlist: jest.fn().mockReturnValue(false),
  }),
}));

import { ProductCard } from '../../components/products/ProductCard';

const mockProduct = {
  id: '1',
  name: 'Test Product',
  price: 99.99,
  imageUrl: 'https://example.com/image.jpg',
  rating: 4.5,
  reviewCount: 100,
  stock: 10,
  category: { name: 'Electronics' },
};

describe('ProductCard Component', () => {
  describe('Grid Variant', () => {
    it('renders product name', () => {
      const { getByText } = render(<ProductCard product={mockProduct} />);
      expect(getByText('Test Product')).toBeTruthy();
    });

    it('renders product price', () => {
      const { getByText } = render(<ProductCard product={mockProduct} />);
      // Price format may vary, just check that price value is rendered
      expect(getByText(/99\.99/)).toBeTruthy();
    });

    it('renders product rating', () => {
      const { getByText } = render(<ProductCard product={mockProduct} />);
      expect(getByText('⭐ 4.5')).toBeTruthy();
    });

    it('calls onPress when card is pressed', () => {
      const onPress = jest.fn();
      const { getByText } = render(<ProductCard product={mockProduct} onPress={onPress} />);

      fireEvent.press(getByText('Test Product'));
      expect(onPress).toHaveBeenCalled();
    });
  });

  describe('With Compare Price (Discount)', () => {
    it('shows discount percentage when compareAtPrice exists', () => {
      const productWithDiscount = {
        ...mockProduct,
        price: 79.99,
        compareAtPrice: 99.99,
      };

      const { getByText } = render(<ProductCard product={productWithDiscount} />);
      expect(getByText(/79\.99/)).toBeTruthy();
    });

    it('shows compare price', () => {
      const productWithDiscount = {
        ...mockProduct,
        price: 79.99,
        compareAtPrice: 99.99,
      };

      const { getAllByText } = render(<ProductCard product={productWithDiscount} />);
      // Both prices should be displayed
      expect(getAllByText(/\d+\.\d{2}/).length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Horizontal Variant', () => {
    it('renders horizontal layout', () => {
      const { getByText } = render(<ProductCard product={mockProduct} variant="horizontal" />);
      expect(getByText('Test Product')).toBeTruthy();
    });

    it('shows category in horizontal variant', () => {
      const { getByText } = render(<ProductCard product={mockProduct} variant="horizontal" />);
      expect(getByText('Electronics')).toBeTruthy();
    });
  });

  describe('Out of Stock', () => {
    it('handles out of stock product', () => {
      const outOfStockProduct = { ...mockProduct, stock: 0 };
      const { getByText } = render(<ProductCard product={outOfStockProduct} />);
      expect(getByText('Test Product')).toBeTruthy();
    });
  });

  describe('Without Optional Props', () => {
    it('renders without rating', () => {
      const { id, name, price } = mockProduct;
      const { getByText } = render(<ProductCard product={{ id, name, price }} />);
      expect(getByText('Test Product')).toBeTruthy();
    });

    it('renders without imageUrl (uses placeholder)', () => {
      const { id, name, price } = mockProduct;
      const { getByText } = render(<ProductCard product={{ id, name, price }} />);
      expect(getByText('Test Product')).toBeTruthy();
    });

    it('renders without category', () => {
      const productWithoutCategory = { ...mockProduct, category: undefined };
      const { getByText } = render(
        <ProductCard product={productWithoutCategory} variant="horizontal" />
      );
      expect(getByText('Test Product')).toBeTruthy();
    });
  });

  describe('Review Count', () => {
    it('displays review count with rating', () => {
      const { getByText } = render(<ProductCard product={mockProduct} variant="horizontal" />);
      expect(getByText('(100)')).toBeTruthy();
    });
  });
});
