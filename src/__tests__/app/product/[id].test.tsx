import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ProductDetailScreen from '../../../../app/product/[id]';
import { useProduct, useProductReviews } from '../../../lib/hooks';
import { useCartStore } from '../../../store/cartStore';

// Mock dependencies
jest.mock('expo-router', () => ({
    router: {
        push: jest.fn(),
        back: jest.fn(),
    },
    useLocalSearchParams: () => ({ id: 'product-123' }),
    Stack: {
        Screen: () => null,
    },
}));

jest.mock('react-native-safe-area-context', () => ({
    SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@fortawesome/react-native-fontawesome', () => ({
    FontAwesomeIcon: () => null,
}));

jest.mock('../../../lib/hooks', () => ({
    useProduct: jest.fn(),
    useProductReviews: jest.fn(),
}));

jest.mock('../../../store/cartStore', () => ({
    useCartStore: jest.fn(),
}));

describe('ProductDetailScreen', () => {
    const mockAddToCart = jest.fn();
    const mockToggleWishlistItem = jest.fn();
    const mockAddToRecentlyViewed = jest.fn();

    const mockProduct = {
        id: 'product-123',
        name: 'Test Product',
        price: 99.99,
        salePrice: 79.99,
        description: 'This is a test product description',
        imageUrl: 'https://example.com/image.jpg',
        stock: 10,
        rating: 4.5,
        reviewCount: 25,
        category: { name: 'Electronics' },
        variants: [
            { name: 'Red' },
            { name: 'Blue' },
        ],
    };

    const mockReviews = [
        {
            id: 'review-1',
            userName: 'John Doe',
            rating: 5,
            title: 'Great product!',
            comment: 'I love this product',
            createdAt: '2024-01-15T00:00:00.000Z',
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        (useProduct as jest.Mock).mockReturnValue({
            data: mockProduct,
            isLoading: false,
            error: null,
        });
        (useProductReviews as jest.Mock).mockReturnValue({
            data: { data: mockReviews },
        });
        (useCartStore as unknown as jest.Mock).mockImplementation((selector) => {
            const state = {
                addToCart: mockAddToCart,
                toggleWishlistItem: mockToggleWishlistItem,
                addToRecentlyViewed: mockAddToRecentlyViewed,
                wishlist: [],
            };
            return selector(state);
        });
    });

    it('should render product detail screen correctly', () => {
        const { getByText } = render(<ProductDetailScreen />);

        expect(getByText('Test Product')).toBeTruthy();
    });

    it('should display product price', () => {
        const { getByText } = render(<ProductDetailScreen />);

        expect(getByText('₹79.99')).toBeTruthy();
    });

    it('should display original price when on sale', () => {
        const { getByText } = render(<ProductDetailScreen />);

        expect(getByText('₹99.99')).toBeTruthy();
    });

    it('should display product description', () => {
        const { getByText } = render(<ProductDetailScreen />);

        expect(getByText('Description')).toBeTruthy();
        expect(getByText('This is a test product description')).toBeTruthy();
    });

    it('should display stock information', () => {
        const { getByText } = render(<ProductDetailScreen />);

        expect(getByText('10 in stock')).toBeTruthy();
    });

    it('should display category badge', () => {
        const { getByText } = render(<ProductDetailScreen />);

        expect(getByText('Electronics')).toBeTruthy();
    });

    it('should display quantity section', () => {
        const { getByText } = render(<ProductDetailScreen />);

        expect(getByText('Quantity')).toBeTruthy();
        expect(getByText('1')).toBeTruthy();
    });

    it('should display reviews section', () => {
        const { getByText } = render(<ProductDetailScreen />);

        expect(getByText('Reviews (1)')).toBeTruthy();
    });

    it('should show loading state', () => {
        (useProduct as jest.Mock).mockReturnValue({
            data: null,
            isLoading: true,
            error: null,
        });

        const { getByText } = render(<ProductDetailScreen />);

        expect(getByText('Loading product...')).toBeTruthy();
    });

    it('should show error state when product not found', () => {
        (useProduct as jest.Mock).mockReturnValue({
            data: null,
            isLoading: false,
            error: new Error('Not found'),
        });

        const { getByText } = render(<ProductDetailScreen />);

        expect(getByText('Product not found')).toBeTruthy();
        expect(getByText('Browse Products')).toBeTruthy();
    });

    it('should render correctly', () => {
        const { toJSON } = render(<ProductDetailScreen />);
        expect(toJSON()).toBeTruthy();
    });

    it('should show out of stock when stock is 0', () => {
        (useProduct as jest.Mock).mockReturnValue({
            data: { ...mockProduct, stock: 0 },
            isLoading: false,
            error: null,
        });

        const { getByText } = render(<ProductDetailScreen />);

        expect(getByText('Out of stock')).toBeTruthy();
    });

    it('should display variants when available', () => {
        const { getByText } = render(<ProductDetailScreen />);

        expect(getByText('Variants')).toBeTruthy();
        expect(getByText('Red')).toBeTruthy();
        expect(getByText('Blue')).toBeTruthy();
    });

    it('should display review author name', () => {
        const { getByText } = render(<ProductDetailScreen />);

        expect(getByText('John Doe')).toBeTruthy();
    });

    it('should show no reviews message when there are no reviews', () => {
        (useProductReviews as jest.Mock).mockReturnValue({
            data: { data: [] },
        });

        const { getByText } = render(<ProductDetailScreen />);

        expect(getByText('No reviews yet. Be the first to review!')).toBeTruthy();
    });
});
