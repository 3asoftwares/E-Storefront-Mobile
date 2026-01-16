import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CategoriesScreen from '../../../app/categories';
import { useCategories } from '../../lib/hooks';
import { useRouter } from 'expo-router';

// Mock dependencies
jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));

jest.mock('../../lib/hooks', () => ({
    useCategories: jest.fn(),
}));

describe('CategoriesScreen', () => {
    const mockPush = jest.fn();
    const mockBack = jest.fn();
    const mockRefetch = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush, back: mockBack });
    });

    it('should render loading state', () => {
        (useCategories as jest.Mock).mockReturnValue({
            data: null,
            isLoading: true,
            error: null,
            refetch: mockRefetch,
        });

        const { getByText } = render(<CategoriesScreen />);
        expect(getByText('Loading categories...')).toBeTruthy();
    });

    it('should render error state', () => {
        (useCategories as jest.Mock).mockReturnValue({
            data: null,
            isLoading: false,
            error: new Error('Failed to load'),
            refetch: mockRefetch,
        });

        const { getByText } = render(<CategoriesScreen />);
        expect(getByText('Error loading categories')).toBeTruthy();
        expect(getByText('Please try again later')).toBeTruthy();
    });

    it('should call refetch when retry button is pressed', () => {
        (useCategories as jest.Mock).mockReturnValue({
            data: null,
            isLoading: false,
            error: new Error('Failed to load'),
            refetch: mockRefetch,
        });

        const { getByText } = render(<CategoriesScreen />);
        const retryButton = getByText('Retry');

        fireEvent.press(retryButton);
        expect(mockRefetch).toHaveBeenCalled();
    });

    it('should render categories list', () => {
        const mockCategories = [
            {
                id: '1',
                name: 'Electronics',
                slug: 'electronics',
                description: 'Electronic devices and gadgets',
                productCount: 25,
            },
            {
                id: '2',
                name: 'Clothing',
                slug: 'clothing',
                description: 'Fashion and apparel',
                productCount: 50,
            },
        ];

        (useCategories as jest.Mock).mockReturnValue({
            data: { categories: mockCategories },
            isLoading: false,
            error: null,
            refetch: mockRefetch,
        });

        const { getByText } = render(<CategoriesScreen />);
        expect(getByText('Electronics')).toBeTruthy();
        expect(getByText('Clothing')).toBeTruthy();
        expect(getByText('Electronic devices and gadgets')).toBeTruthy();
        expect(getByText('Fashion and apparel')).toBeTruthy();
    });

    it('should display product count for each category', () => {
        const mockCategories = [
            {
                id: '1',
                name: 'Electronics',
                slug: 'electronics',
                productCount: 25,
            },
        ];

        (useCategories as jest.Mock).mockReturnValue({
            data: { categories: mockCategories },
            isLoading: false,
            error: null,
            refetch: mockRefetch,
        });

        const { getByText } = render(<CategoriesScreen />);
        expect(getByText('25 products')).toBeTruthy();
    });

    it('should navigate to products screen when category is pressed', () => {
        const mockCategories = [
            {
                id: '1',
                name: 'Electronics',
                slug: 'electronics',
                productCount: 25,
            },
        ];

        (useCategories as jest.Mock).mockReturnValue({
            data: { categories: mockCategories },
            isLoading: false,
            error: null,
            refetch: mockRefetch,
        });

        const { getByText } = render(<CategoriesScreen />);
        const categoryCard = getByText('Electronics');

        fireEvent.press(categoryCard);
        expect(mockPush).toHaveBeenCalledWith({
            pathname: '/(tabs)/products',
            params: { category: '1' },
        });
    });

    it('should render empty state when no categories', () => {
        (useCategories as jest.Mock).mockReturnValue({
            data: { categories: [] },
            isLoading: false,
            error: null,
            refetch: mockRefetch,
        });

        const { getByText } = render(<CategoriesScreen />);
        expect(getByText(/No categories/i)).toBeTruthy();
    });

    it('should handle singular product count', () => {
        const mockCategories = [
            {
                id: '1',
                name: 'Electronics',
                slug: 'electronics',
                productCount: 1,
            },
        ];

        (useCategories as jest.Mock).mockReturnValue({
            data: { categories: mockCategories },
            isLoading: false,
            error: null,
            refetch: mockRefetch,
        });

        const { getByText } = render(<CategoriesScreen />);
        expect(getByText('1 product')).toBeTruthy();
    });
});
