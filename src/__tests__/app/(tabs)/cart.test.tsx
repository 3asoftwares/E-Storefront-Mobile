import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import CartScreen from '../../../../app/(tabs)/cart';
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
    useValidateCoupon: jest.fn(() => ({
        validateCoupon: jest.fn(),
        isLoading: false,
        error: null,
    })),
}));

// Mock helpers
jest.mock('../../../utils/helpers', () => ({
    showAlert: jest.fn(),
    showConfirm: jest.fn((title, message, onConfirm) => onConfirm && onConfirm()),
}));

// Cart store mock state
let mockCartItems: any[] = [];
const mockUpdateQuantity = jest.fn();
const mockRemoveFromCart = jest.fn();
const mockClearCart = jest.fn();

jest.mock('../../../store/cartStore', () => ({
    useCartStore: Object.assign(
        jest.fn((selector) => {
            const state = {
                items: mockCartItems,
                userProfile: { id: '1', name: 'Test User', email: 'test@example.com' },
                updateQuantity: mockUpdateQuantity,
                removeFromCart: mockRemoveFromCart,
                clearCart: mockClearCart,
            };
            return selector ? selector(state) : state;
        }),
        {
            getState: () => ({
                userProfile: { id: '1', name: 'Test User', email: 'test@example.com' },
            }),
        }
    ),
}));

import { showConfirm } from '../../../utils/helpers';

describe('CartScreen', () => {
    const mockCartItemsData = [
        {
            productId: '1',
            name: 'Test Product 1',
            price: 99.99,
            quantity: 2,
            image: 'https://example.com/image1.jpg',
        },
        {
            productId: '2',
            name: 'Test Product 2',
            price: 49.99,
            quantity: 1,
            image: 'https://example.com/image2.jpg',
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        mockCartItems = [...mockCartItemsData];
    });

    it('should render cart screen with header', async () => {
        const { getByText } = render(<CartScreen />);

        await waitFor(() => {
            expect(getByText('Shopping Cart')).toBeTruthy();
        });
    });

    it('should display cart items', async () => {
        const { getByText } = render(<CartScreen />);

        await waitFor(() => {
            expect(getByText('Test Product 1')).toBeTruthy();
            expect(getByText('Test Product 2')).toBeTruthy();
        });
    });

    it('should display item prices', async () => {
        const { getAllByText } = render(<CartScreen />);

        await waitFor(() => {
            // Prices may appear multiple times (per item price and total)
            const price1Elements = getAllByText('₹99.99');
            const price2Elements = getAllByText('₹49.99');
            expect(price1Elements.length).toBeGreaterThan(0);
            expect(price2Elements.length).toBeGreaterThan(0);
        });
    });

    it('should display item quantities', async () => {
        const { getByText } = render(<CartScreen />);

        await waitFor(() => {
            expect(getByText('2')).toBeTruthy(); // quantity of first item
            expect(getByText('1')).toBeTruthy(); // quantity of second item
        });
    });

    it('should display Order Summary section', async () => {
        const { getByText } = render(<CartScreen />);

        await waitFor(() => {
            expect(getByText('Order Summary')).toBeTruthy();
            expect(getByText('Subtotal')).toBeTruthy();
        });
    });

    it('should display Clear All button', async () => {
        const { getByText } = render(<CartScreen />);

        await waitFor(() => {
            expect(getByText('Clear All')).toBeTruthy();
        });
    });

    it('should show Proceed to Checkout button', async () => {
        const { getByText } = render(<CartScreen />);

        await waitFor(() => {
            // Button contains total, so we search for the beginning text
            expect(getByText(/Proceed to Checkout/)).toBeTruthy();
        });
    });

    it('should navigate to checkout when checkout button is pressed', async () => {
        const { getByText } = render(<CartScreen />);

        await waitFor(() => {
            const checkoutButton = getByText(/Proceed to Checkout/);
            fireEvent.press(checkoutButton);
        });

        expect(router.push).toHaveBeenCalledWith('/checkout');
    });

    it('should show Continue Shopping link', async () => {
        const { getByText } = render(<CartScreen />);

        await waitFor(() => {
            expect(getByText('Continue Shopping')).toBeTruthy();
        });
    });

    it('should navigate to products when Continue Shopping is pressed', async () => {
        const { getByText } = render(<CartScreen />);

        await waitFor(() => {
            const continueShoppingButton = getByText('Continue Shopping');
            fireEvent.press(continueShoppingButton);
        });

        expect(router.push).toHaveBeenCalledWith('/products');
    });

    it('should display item count', async () => {
        const { getByText } = render(<CartScreen />);

        await waitFor(() => {
            expect(getByText('3 items in your cart')).toBeTruthy();
        });
    });

    it('should show clear cart confirmation when Clear All is pressed', async () => {
        const { getByText } = render(<CartScreen />);

        await waitFor(() => {
            const clearButton = getByText('Clear All');
            fireEvent.press(clearButton);
        });

        expect(showConfirm).toHaveBeenCalledWith(
            'Clear Cart',
            'Are you sure you want to remove all items from your cart?',
            expect.any(Function),
            undefined,
            'Clear'
        );
    });

    describe('Empty Cart', () => {
        beforeEach(() => {
            mockCartItems = [];
        });

        it('should display empty cart message', async () => {
            const { getByText } = render(<CartScreen />);

            await waitFor(() => {
                expect(getByText('Your cart is empty')).toBeTruthy();
            });
        });

        it('should display empty cart description', async () => {
            const { getByText } = render(<CartScreen />);

            await waitFor(() => {
                expect(getByText('Add some items to your cart to get started')).toBeTruthy();
            });
        });

        it('should show Continue Shopping button in empty state', async () => {
            const { getByText } = render(<CartScreen />);

            await waitFor(() => {
                expect(getByText('Continue Shopping')).toBeTruthy();
            });
        });

        it('should navigate to products from empty cart', async () => {
            const { getByText } = render(<CartScreen />);

            await waitFor(() => {
                const continueShoppingButton = getByText('Continue Shopping');
                fireEvent.press(continueShoppingButton);
            });

            expect(router.push).toHaveBeenCalledWith('/products');
        });
    });
});
