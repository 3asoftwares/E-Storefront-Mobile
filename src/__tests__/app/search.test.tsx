import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SearchScreen from '../../../app/search';
import { useProducts } from '../../lib/hooks';
import { useCartStore } from '../../store/cartStore';

// Mock dependencies
jest.mock('expo-router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        back: jest.fn(),
    }),
}));

jest.mock('../../lib/hooks', () => ({
    useProducts: jest.fn(),
}));

jest.mock('../../store/cartStore', () => ({
    useCartStore: jest.fn(),
}));

describe('SearchScreen', () => {
    const mockAddRecentSearch = jest.fn();
    const mockClearRecentSearches = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useProducts as jest.Mock).mockReturnValue({
            data: { products: [] },
            isLoading: false,
            refetch: jest.fn(),
        });
        (useCartStore as jest.Mock).mockReturnValue({
            recentSearches: ['Electronics', 'Phones'],
            addRecentSearch: mockAddRecentSearch,
            clearRecentSearches: mockClearRecentSearches,
        });
    });

    it('should render search screen correctly', () => {
        const { getByPlaceholderText } = render(<SearchScreen />);

        expect(getByPlaceholderText('Search products...')).toBeTruthy();
    });

    it('should handle search input', () => {
        const { getByPlaceholderText } = render(<SearchScreen />);
        const searchInput = getByPlaceholderText('Search products...');

        fireEvent.changeText(searchInput, 'laptop');
        expect(searchInput.props.value).toBe('laptop');
    });

    it('should show recent searches when search is empty', () => {
        const { getByText, getAllByText } = render(<SearchScreen />);

        expect(getByText('Recent Searches')).toBeTruthy();
        // Electronics and Phones appear in both Recent and Popular, so we use getAllByText
        expect(getAllByText('Electronics').length).toBeGreaterThan(0);
        expect(getAllByText('Phones').length).toBeGreaterThan(0);
    });

    it('should show popular searches', () => {
        const { getByText } = render(<SearchScreen />);

        expect(getByText('Popular Searches')).toBeTruthy();
        expect(getByText('Clothing')).toBeTruthy();
        expect(getByText('Shoes')).toBeTruthy();
    });

    it('should add to recent searches when searching', async () => {
        const { getByPlaceholderText } = render(<SearchScreen />);
        const searchInput = getByPlaceholderText('Search products...');

        fireEvent.changeText(searchInput, 'laptop');
        fireEvent(searchInput, 'submitEditing');

        await waitFor(() => {
            expect(mockAddRecentSearch).toHaveBeenCalledWith('laptop');
        });
    });

    it('should render correctly', () => {
        const { toJSON } = render(<SearchScreen />);
        expect(toJSON()).toBeTruthy();
    });

    it('should handle recent search press', () => {
        const { getAllByText, getByPlaceholderText } = render(<SearchScreen />);
        const recentSearches = getAllByText('Electronics');

        fireEvent.press(recentSearches[0]);

        const searchInput = getByPlaceholderText('Search products...');
        expect(searchInput.props.value).toBe('Electronics');
    });
});
