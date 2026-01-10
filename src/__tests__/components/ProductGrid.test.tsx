import React from 'react';
import { render } from '@testing-library/react-native';

// Mock dependencies
jest.mock('../../components/products/ProductCard', () => ({
  ProductCard: ({ product }: any) => {
    const { Text } = require('react-native');
    return <Text>{product.name}</Text>;
  },
}));

jest.mock('../../components/ui', () => ({
  ProductCardSkeleton: () => {
    const { View } = require('react-native');
    return <View testID="skeleton" />;
  },
  EmptyState: ({ title, description, actionLabel, onAction }: any) => {
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
      const { getAllByTestId } = render(
        <ProductGrid products={[]} loading={true} />
      );
      
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
      const { getByText } = render(
        <ProductGrid products={[]} error={error} />
      );
      
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
      const { getByText } = render(
        <ProductGrid products={[]} loading={false} />
      );
      
      expect(getByText('No products found')).toBeTruthy();
      expect(getByText('Try adjusting your search or filters')).toBeTruthy();
    });

    it('shows custom empty state', () => {
      const { getByText } = render(
        <ProductGrid 
          products={[]} 
          loading={false}
          emptyTitle="Your cart is empty"
          emptyDescription="Start shopping now!"
          emptyActionLabel="Browse Products"
        />
      );
      
      expect(getByText('Your cart is empty')).toBeTruthy();
      expect(getByText('Start shopping now!')).toBeTruthy();
    });
  });

  describe('Products Display', () => {
    it('renders all products', () => {
      const { getByText } = render(
        <ProductGrid products={mockProducts} />
      );
      
      expect(getByText('Product 1')).toBeTruthy();
      expect(getByText('Product 2')).toBeTruthy();
      expect(getByText('Product 3')).toBeTruthy();
    });

    it('renders with ListHeaderComponent', () => {
      const { Text } = require('react-native');
      const { getByText } = render(
        <ProductGrid 
          products={mockProducts}
          ListHeaderComponent={<Text>Header</Text>}
        />
      );
      
      expect(getByText('Header')).toBeTruthy();
      expect(getByText('Product 1')).toBeTruthy();
    });
  });
});
