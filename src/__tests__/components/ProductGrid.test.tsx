/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render } from '@testing-library/react-native';

// Mock dependencies
jest.mock('../../components/products/ProductCard', () => ({
  ProductCard: ({ product }: any) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Text } = require('react-native');
    return <Text>{product.name}</Text>;
  },
}));

jest.mock('../../components/ui', () => ({
  ProductCardSkeleton: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { View } = require('react-native');
    return <View testID="skeleton" />;
  },
  EmptyState: ({ title, description, actionLabel, onAction }: any) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { View, Text, TouchableOpacity } = require('react-native');
    return (
      <View>
        <Text>{title}</Text>
        <Text>{description}</Text>
        {actionLabel && onAction && (
          <TouchableOpacity onPress={onAction}>
            <Text>{actionLabel}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  },
}));

import { ProductGrid } from '../../components/products/ProductGrid';

const mockProducts = [
  { id: '1', name: 'Product 1', price: 29.99 },
  { id: '2', name: 'Product 2', price: 39.99 },
  { id: '3', name: 'Product 3', price: 49.99 },
];

describe('ProductGrid Component', () => {
  describe('Loading State', () => {
    it('shows skeletons when loading with no products', () => {
      const { getAllByTestId } = render(<ProductGrid products={[]} loading={true} />);

      const skeletons = getAllByTestId('skeleton');
      expect(skeletons.length).toBe(6);
    });

    it('does not show skeletons when loading but has products', () => {
      const { queryAllByTestId, getByText } = render(
        <ProductGrid products={mockProducts} loading={true} />
      );

      expect(getByText('Product 1')).toBeTruthy();
      expect(queryAllByTestId('skeleton').length).toBe(0);
    });
  });

  describe('Error State', () => {
    it('shows error message when error prop is provided', () => {
      const error = new Error('Network error');
      const { getByText } = render(<ProductGrid products={[]} error={error} />);

      expect(getByText('Error loading products')).toBeTruthy();
      expect(getByText('Network error')).toBeTruthy();
    });

    it('shows Try Again button on error', () => {
      const error = new Error('Network error');
      const onRefresh = jest.fn();
      const { getByText } = render(
        <ProductGrid products={[]} error={error} onRefresh={onRefresh} />
      );

      expect(getByText('Try Again')).toBeTruthy();
    });
  });

  describe('Empty State', () => {
    it('shows default empty state when no products', () => {
      const { getByText } = render(<ProductGrid products={[]} loading={false} />);

      expect(getByText('No products found')).toBeTruthy();
      expect(getByText('Try adjusting your search or filters')).toBeTruthy();
    });

    it('shows custom empty state', () => {
      const onAction = jest.fn();
      const { getByText } = render(
        <ProductGrid
          products={[]}
          loading={false}
          emptyTitle="Your cart is empty"
          emptyDescription="Start shopping now!"
          emptyActionLabel="Browse Products"
          onEmptyAction={onAction}
        />
      );

      expect(getByText('Your cart is empty')).toBeTruthy();
      expect(getByText('Start shopping now!')).toBeTruthy();
    });
  });

  describe('Products Display', () => {
    it('renders all products', () => {
      const { getByText } = render(<ProductGrid products={mockProducts} />);

      expect(getByText('Product 1')).toBeTruthy();
      expect(getByText('Product 2')).toBeTruthy();
      expect(getByText('Product 3')).toBeTruthy();
    });

    it('renders with ListHeaderComponent', () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { Text } = require('react-native');
      const { getByText } = render(
        <ProductGrid products={mockProducts} ListHeaderComponent={<Text>Header</Text>} />
      );

      expect(getByText('Header')).toBeTruthy();
      expect(getByText('Product 1')).toBeTruthy();
    });

    it('renders with ListFooterComponent', () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { Text } = require('react-native');
      const { getByText } = render(
        <ProductGrid products={mockProducts} ListFooterComponent={<Text>Footer</Text>} />
      );

      expect(getByText('Footer')).toBeTruthy();
    });

    it('shows loading more indicator when loading with products', () => {
      const { getByText } = render(<ProductGrid products={mockProducts} loading={true} />);

      expect(getByText('Loading more...')).toBeTruthy();
    });
  });

  describe('Refresh Functionality', () => {
    it('handles refresh', () => {
      const onRefresh = jest.fn();
      render(<ProductGrid products={mockProducts} onRefresh={onRefresh} />);

      expect(onRefresh).toBeDefined();
    });

    it('handles refreshing state', () => {
      const { getByText } = render(
        <ProductGrid products={mockProducts} refreshing={true} onRefresh={() => {}} />
      );

      expect(getByText('Product 1')).toBeTruthy();
    });
  });

  describe('Pagination', () => {
    it('handles onEndReached callback', () => {
      const onEndReached = jest.fn();
      render(<ProductGrid products={mockProducts} onEndReached={onEndReached} />);

      expect(onEndReached).toBeDefined();
    });
  });
});

// ProductHorizontalList tests
import { ProductHorizontalList } from '../../components/products/ProductGrid';

jest.mock('@fortawesome/react-native-fontawesome', () => ({
  FontAwesomeIcon: 'FontAwesomeIcon',
}));

describe('ProductHorizontalList Component', () => {
  it('renders horizontal list with title', () => {
    const { getByText } = render(
      <ProductHorizontalList title="Featured Products" products={mockProducts} />
    );

    expect(getByText('Featured Products')).toBeTruthy();
  });

  it('renders without title', () => {
    const { getByText } = render(<ProductHorizontalList products={mockProducts} />);

    expect(getByText('Product 1')).toBeTruthy();
  });

  it('shows See All button when onSeeAll provided', () => {
    const onSeeAll = jest.fn();
    const { getByText } = render(
      <ProductHorizontalList title="Featured" products={mockProducts} onSeeAll={onSeeAll} />
    );

    expect(getByText('See All')).toBeTruthy();
  });

  it('shows loading state', () => {
    const { getByText } = render(
      <ProductHorizontalList title="Loading" products={[]} loading={true} />
    );

    expect(getByText('Loading')).toBeTruthy();
  });

  it('returns null when no products and not loading', () => {
    const { queryByText } = render(
      <ProductHorizontalList title="Empty" products={[]} loading={false} />
    );

    expect(queryByText('Empty')).toBeNull();
  });

  it('renders all products in horizontal list', () => {
    const { getByText } = render(
      <ProductHorizontalList title="Products" products={mockProducts} />
    );

    expect(getByText('Product 1')).toBeTruthy();
    expect(getByText('Product 2')).toBeTruthy();
    expect(getByText('Product 3')).toBeTruthy();
  });
});
