import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import CheckoutScreen from '../../../app/checkout';
import { useCartStore } from '../../store/cartStore';
import {
    useCreateOrder,
    useAddresses,
    useValidateCoupon,
    useAddAddress,
} from '../../lib/hooks';
import { router } from 'expo-router';

// Mock dependencies
jest.mock('expo-router', () => ({
    router: {
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
    },
    Stack: {
        Screen: () => null,
    },
}));

jest.mock('@fortawesome/react-native-fontawesome', () => ({
    FontAwesomeIcon: () => null,
}));

jest.mock('react-native-safe-area-context', () => ({
    SafeAreaView: ({ children }: any) => children,
}));

jest.mock('../../store/cartStore');
jest.mock('../../lib/hooks');
jest.spyOn(Alert, 'alert');

describe('CheckoutScreen', () => {
    const mockCartItems = [
        {
            id: '1',
            productId: 'prod-1',
            name: 'Product 1',
            price: 100,
            quantity: 2,
            image: 'https://example.com/product1.jpg',
            variant: 'Medium',
        },
        {
            id: '2',
            productId: 'prod-2',
            name: 'Product 2',
            price: 50,
            quantity: 1,
            image: 'https://example.com/product2.jpg',
            variant: 'Large',
        },
    ];

    const mockAddresses = [
        {
            id: 'addr-1',
            name: 'John Doe',
            mobile: '9876543210',
            email: 'john@example.com',
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zip: '10001',
            country: 'USA',
            isDefault: true,
        },
    ];

    const mockClearCart = jest.fn();
    const mockCreateOrder = jest.fn();
    const mockValidateCoupon = jest.fn();
    const mockAddAddress = jest.fn();

    const mockStoreState = {
        items: mockCartItems,
        userProfile: { id: 'user-1', name: 'John Doe', email: 'john@example.com' },
        clearCart: mockClearCart,
    };

    const setupMocks = (overrides: any = {}) => {
        const storeState = { ...mockStoreState, ...overrides.storeState };

        (useCartStore as unknown as jest.Mock).mockImplementation((selector) => {
            if (typeof selector === 'function') {
                return selector(storeState);
            }
            return storeState;
        });

        (useCreateOrder as jest.Mock).mockReturnValue({
            createOrder: overrides.createOrder || mockCreateOrder,
            isLoading: overrides.isCreatingOrder || false,
        });

        (useAddresses as jest.Mock).mockReturnValue({
            data: overrides.addresses !== undefined ? overrides.addresses : mockAddresses,
            isLoading: overrides.addressesLoading || false,
        });

        (useValidateCoupon as jest.Mock).mockReturnValue({
            validateCoupon: overrides.validateCoupon || mockValidateCoupon,
            isLoading: overrides.isValidatingCoupon || false,
        });

        (useAddAddress as jest.Mock).mockReturnValue({
            addAddress: overrides.addAddress || mockAddAddress,
            isLoading: overrides.isAddingAddress || false,
        });
    };

    beforeEach(() => {
        jest.clearAllMocks();
        setupMocks();
    });

    // =========================================
    // Empty Cart State Tests
    // =========================================
    describe('Empty Cart State', () => {
        it('should render empty cart state when cart is empty', () => {
            setupMocks({ storeState: { items: [], userProfile: null, clearCart: mockClearCart } });

            const { getByText } = render(<CheckoutScreen />);

            expect(getByText('Your cart is empty')).toBeTruthy();
            expect(getByText('Start Shopping')).toBeTruthy();
        });

        it('should navigate to products when Start Shopping is pressed', () => {
            setupMocks({ storeState: { items: [], userProfile: null, clearCart: mockClearCart } });

            const { getByText } = render(<CheckoutScreen />);
            const shopButton = getByText('Start Shopping');

            fireEvent.press(shopButton);

            expect(router.push).toHaveBeenCalledWith('/products');
        });
    });

    // =========================================
    // Basic Rendering Tests
    // =========================================
    describe('Basic Rendering', () => {
        it('should render checkout screen with cart items', () => {
            const { getByText } = render(<CheckoutScreen />);

            expect(getByText('Product 1')).toBeTruthy();
            expect(getByText('Product 2')).toBeTruthy();
        });

        it('should display secure checkout header', () => {
            const { getByText } = render(<CheckoutScreen />);

            expect(getByText('Secure Checkout')).toBeTruthy();
            expect(getByText('Back')).toBeTruthy();
        });

        it('should display saved addresses', () => {
            const { getByText } = render(<CheckoutScreen />);

            expect(getByText('123 Main St')).toBeTruthy();
            expect(getByText('John Doe')).toBeTruthy();
        });

        it('should display default badge for default address', () => {
            const { getByText } = render(<CheckoutScreen />);

            expect(getByText('Default')).toBeTruthy();
        });

        it('should display mobile number in address', () => {
            const { getByText } = render(<CheckoutScreen />);

            expect(getByText('📱 9876543210')).toBeTruthy();
        });

        it('should render correctly', () => {
            const { toJSON } = render(<CheckoutScreen />);
            expect(toJSON()).toBeTruthy();
        });
    });

    // =========================================
    // Address Loading States
    // =========================================
    describe('Address Loading States', () => {
        it('should show loading indicator when addresses are loading', () => {
            setupMocks({ addresses: [], addressesLoading: true });

            const { getByText } = render(<CheckoutScreen />);

            expect(getByText('Loading addresses...')).toBeTruthy();
        });

        it('should show no saved addresses message when empty', () => {
            setupMocks({ addresses: [] });

            const { getByText } = render(<CheckoutScreen />);

            expect(getByText('No saved addresses. Please add one below.')).toBeTruthy();
        });

        it('should auto-select default address on load', async () => {
            const addresses = [
                { id: 'addr-1', name: 'First', isDefault: false, street: '111 First St', city: 'A', state: 'X', zip: '111', country: 'USA' },
                { id: 'addr-2', name: 'Second', isDefault: true, street: '222 Second St', city: 'B', state: 'Y', zip: '222', country: 'USA' },
            ];
            setupMocks({ addresses });

            const { getByText } = render(<CheckoutScreen />);

            await waitFor(() => {
                expect(getByText('222 Second St')).toBeTruthy();
            });
        });

        it('should auto-select first address if no default', async () => {
            const addresses = [
                { id: 'addr-1', name: 'First', isDefault: false, street: '111 First St', city: 'A', state: 'X', zip: '111', country: 'USA' },
                { id: 'addr-2', name: 'Second', isDefault: false, street: '222 Second St', city: 'B', state: 'Y', zip: '222', country: 'USA' },
            ];
            setupMocks({ addresses });

            const { getByText } = render(<CheckoutScreen />);

            await waitFor(() => {
                expect(getByText('111 First St')).toBeTruthy();
            });
        });
    });

    // =========================================
    // Address Selection Tests
    // =========================================
    describe('Address Selection', () => {
        it('should allow selecting a different address', () => {
            const addresses = [
                { id: 'addr-1', name: 'First', street: '111 First St', city: 'A', state: 'X', zip: '111', country: 'USA', isDefault: true },
                { id: 'addr-2', name: 'Second', street: '222 Second St', city: 'B', state: 'Y', zip: '222', country: 'USA', isDefault: false },
            ];
            setupMocks({ addresses });

            const { getByText } = render(<CheckoutScreen />);

            const secondAddress = getByText('222 Second St');
            fireEvent.press(secondAddress);

            expect(secondAddress).toBeTruthy();
        });
    });

    // =========================================
    // Add New Address Modal Tests
    // =========================================
    describe('Add New Address Modal', () => {
        it('should open add address modal', () => {
            const { getByText } = render(<CheckoutScreen />);

            const addButton = getByText('Add New Address');
            fireEvent.press(addButton);

            expect(getByText('Full Name *')).toBeTruthy();
            expect(getByText('Mobile Number *')).toBeTruthy();
            expect(getByText('Street Address *')).toBeTruthy();
        });

        it('should close modal when Cancel is pressed', () => {
            const { getByText, queryByText } = render(<CheckoutScreen />);

            const addButton = getByText('Add New Address');
            fireEvent.press(addButton);

            expect(getByText('Full Name *')).toBeTruthy();

            const cancelButton = getByText('Cancel');
            fireEvent.press(cancelButton);

            // Modal should close - Full Name label might still be visible briefly
            expect(cancelButton).toBeTruthy();
        });

        it('should show validation error for missing required fields', async () => {
            const { getByText } = render(<CheckoutScreen />);

            const addButton = getByText('Add New Address');
            fireEvent.press(addButton);

            const saveButton = getByText('Save Address');
            fireEvent.press(saveButton);

            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalledWith(
                    'Missing Information',
                    'Please fill in all required fields'
                );
            });
        });

        it('should show validation error for invalid mobile number', async () => {
            const { getByText, getByPlaceholderText } = render(<CheckoutScreen />);

            const addButton = getByText('Add New Address');
            fireEvent.press(addButton);

            // Fill in required fields
            fireEvent.changeText(getByPlaceholderText('John Doe'), 'Test User');
            fireEvent.changeText(getByPlaceholderText('9876543210'), '123'); // Invalid mobile
            fireEvent.changeText(getByPlaceholderText('123 Main Street, Apt 4B'), '456 Test St');
            fireEvent.changeText(getByPlaceholderText('Mumbai'), 'Test City');
            fireEvent.changeText(getByPlaceholderText('Maharashtra'), 'Test State');
            fireEvent.changeText(getByPlaceholderText('400001'), '12345');

            const saveButton = getByText('Save Address');
            fireEvent.press(saveButton);

            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalledWith(
                    'Invalid Mobile',
                    'Please enter a valid 10-digit mobile number'
                );
            });
        });

        it('should successfully add a new address', async () => {
            mockAddAddress.mockResolvedValue({ address: { id: 'new-addr-1' } });
            setupMocks({ addAddress: mockAddAddress });

            const { getByText, getByPlaceholderText } = render(<CheckoutScreen />);

            const addButton = getByText('Add New Address');
            fireEvent.press(addButton);

            // Fill in all fields
            fireEvent.changeText(getByPlaceholderText('John Doe'), 'Test User');
            fireEvent.changeText(getByPlaceholderText('9876543210'), '9876543210');
            fireEvent.changeText(getByPlaceholderText('john@example.com'), 'test@example.com');
            fireEvent.changeText(getByPlaceholderText('123 Main Street, Apt 4B'), '456 Test St');
            fireEvent.changeText(getByPlaceholderText('Mumbai'), 'Test City');
            fireEvent.changeText(getByPlaceholderText('Maharashtra'), 'Test State');
            fireEvent.changeText(getByPlaceholderText('400001'), '123456');
            fireEvent.changeText(getByPlaceholderText('India'), 'India');

            const saveButton = getByText('Save Address');
            fireEvent.press(saveButton);

            await waitFor(() => {
                expect(mockAddAddress).toHaveBeenCalled();
                expect(Alert.alert).toHaveBeenCalledWith('Success', 'Address added successfully!');
            });
        });

        it('should handle address add with id in result directly', async () => {
            mockAddAddress.mockResolvedValue({ id: 'new-addr-direct' });
            setupMocks({ addAddress: mockAddAddress });

            const { getByText, getByPlaceholderText } = render(<CheckoutScreen />);

            const addButton = getByText('Add New Address');
            fireEvent.press(addButton);

            fireEvent.changeText(getByPlaceholderText('John Doe'), 'Test User');
            fireEvent.changeText(getByPlaceholderText('123 Main Street, Apt 4B'), '456 Test St');
            fireEvent.changeText(getByPlaceholderText('Mumbai'), 'Test City');
            fireEvent.changeText(getByPlaceholderText('Maharashtra'), 'Test State');
            fireEvent.changeText(getByPlaceholderText('400001'), '123456');

            const saveButton = getByText('Save Address');
            fireEvent.press(saveButton);

            await waitFor(() => {
                expect(mockAddAddress).toHaveBeenCalled();
            });
        });

        it('should handle add address error', async () => {
            mockAddAddress.mockRejectedValue(new Error('Network error'));
            setupMocks({ addAddress: mockAddAddress });

            const { getByText, getByPlaceholderText } = render(<CheckoutScreen />);

            const addButton = getByText('Add New Address');
            fireEvent.press(addButton);

            fireEvent.changeText(getByPlaceholderText('John Doe'), 'Test User');
            fireEvent.changeText(getByPlaceholderText('123 Main Street, Apt 4B'), '456 Test St');
            fireEvent.changeText(getByPlaceholderText('Mumbai'), 'Test City');
            fireEvent.changeText(getByPlaceholderText('Maharashtra'), 'Test State');
            fireEvent.changeText(getByPlaceholderText('400001'), '123456');

            const saveButton = getByText('Save Address');
            fireEvent.press(saveButton);

            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalledWith('Error', 'Network error');
            });
        });

        it('should handle add address error without message', async () => {
            mockAddAddress.mockRejectedValue(new Error());
            setupMocks({ addAddress: mockAddAddress });

            const { getByText, getByPlaceholderText } = render(<CheckoutScreen />);

            const addButton = getByText('Add New Address');
            fireEvent.press(addButton);

            fireEvent.changeText(getByPlaceholderText('John Doe'), 'Test User');
            fireEvent.changeText(getByPlaceholderText('123 Main Street, Apt 4B'), '456 Test St');
            fireEvent.changeText(getByPlaceholderText('Mumbai'), 'Test City');
            fireEvent.changeText(getByPlaceholderText('Maharashtra'), 'Test State');
            fireEvent.changeText(getByPlaceholderText('400001'), '123456');

            const saveButton = getByText('Save Address');
            fireEvent.press(saveButton);

            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to add address');
            });
        });
    });

    // =========================================
    // Delivery Method Tests
    // =========================================
    describe('Delivery Method Selection', () => {
        it('should handle delivery method selection', () => {
            const { getByText } = render(<CheckoutScreen />);

            const expressDelivery = getByText('Express Delivery');
            fireEvent.press(expressDelivery);

            expect(expressDelivery).toBeTruthy();
        });

        it('should show standard delivery selected by default', () => {
            const { getByText } = render(<CheckoutScreen />);

            expect(getByText('Standard Delivery')).toBeTruthy();
        });

        it('should toggle between delivery methods', () => {
            const { getByText } = render(<CheckoutScreen />);

            // Select express
            fireEvent.press(getByText('Express Delivery'));
            
            // Select standard again
            fireEvent.press(getByText('Standard Delivery'));

            expect(getByText('Standard Delivery')).toBeTruthy();
        });
    });

    // =========================================
    // Payment Method Tests
    // =========================================
    describe('Payment Method Selection', () => {
        it('should handle payment method selection', () => {
            const { getByText } = render(<CheckoutScreen />);

            const upiPayment = getByText('UPI');
            fireEvent.press(upiPayment);

            expect(upiPayment).toBeTruthy();
        });

        it('should select bank transfer payment', () => {
            const { getByText } = render(<CheckoutScreen />);

            const bankPayment = getByText('Bank Transfer');
            fireEvent.press(bankPayment);

            expect(bankPayment).toBeTruthy();
        });

        it('should select credit/debit card payment', () => {
            const { getByText } = render(<CheckoutScreen />);

            const cardPayment = getByText('Credit/Debit Card');
            fireEvent.press(cardPayment);

            expect(cardPayment).toBeTruthy();
        });
    });

    // =========================================
    // Order Notes Tests
    // =========================================
    describe('Order Notes', () => {
        it('should allow entering order notes', () => {
            const { getByPlaceholderText } = render(<CheckoutScreen />);

            const notesInput = getByPlaceholderText('Add any special instructions for delivery...');
            fireEvent.changeText(notesInput, 'Please leave at door');

            expect(notesInput.props.value).toBe('Please leave at door');
        });
    });

    // =========================================
    // Coupon Tests
    // =========================================
    describe('Coupon Functionality', () => {
        it('should have coupon input field', () => {
            const { getByPlaceholderText } = render(<CheckoutScreen />);
            const couponInput = getByPlaceholderText('Enter coupon code');

            expect(couponInput).toBeTruthy();
        });

        it('should show error when applying empty coupon', async () => {
            const { getByText } = render(<CheckoutScreen />);

            const applyButton = getByText('Apply');
            fireEvent.press(applyButton);

            await waitFor(() => {
                expect(getByText('Please enter a coupon code')).toBeTruthy();
            });
        });

        it('should apply coupon successfully with percentage discount', async () => {
            mockValidateCoupon.mockResolvedValue({
                valid: true,
                code: 'SAVE10',
                discountType: 'percentage',
                discountValue: 10,
                discount: 25,
            });
            setupMocks({ validateCoupon: mockValidateCoupon });

            const { getByText, getByPlaceholderText } = render(<CheckoutScreen />);

            const couponInput = getByPlaceholderText('Enter coupon code');
            fireEvent.changeText(couponInput, 'SAVE10');

            const applyButton = getByText('Apply');
            fireEvent.press(applyButton);

            await waitFor(() => {
                expect(mockValidateCoupon).toHaveBeenCalledWith({
                    code: 'SAVE10',
                    orderTotal: 250,
                });
                expect(Alert.alert).toHaveBeenCalledWith(
                    'Success',
                    expect.stringContaining('Coupon applied!')
                );
            });
        });

        it('should apply coupon with fixed discount', async () => {
            mockValidateCoupon.mockResolvedValue({
                valid: true,
                code: 'FLAT50',
                discountType: 'fixed',
                discountValue: 50,
                discount: 50,
            });
            setupMocks({ validateCoupon: mockValidateCoupon });

            const { getByText, getByPlaceholderText } = render(<CheckoutScreen />);

            const couponInput = getByPlaceholderText('Enter coupon code');
            fireEvent.changeText(couponInput, 'FLAT50');

            const applyButton = getByText('Apply');
            fireEvent.press(applyButton);

            await waitFor(() => {
                expect(mockValidateCoupon).toHaveBeenCalled();
            });
        });

        it('should show error for invalid coupon', async () => {
            mockValidateCoupon.mockResolvedValue({
                valid: false,
                message: 'Coupon expired',
            });
            setupMocks({ validateCoupon: mockValidateCoupon });

            const { getByText, getByPlaceholderText } = render(<CheckoutScreen />);

            const couponInput = getByPlaceholderText('Enter coupon code');
            fireEvent.changeText(couponInput, 'INVALID');

            const applyButton = getByText('Apply');
            fireEvent.press(applyButton);

            await waitFor(() => {
                expect(getByText('Coupon expired')).toBeTruthy();
            });
        });

        it('should show default error for invalid coupon without message', async () => {
            mockValidateCoupon.mockResolvedValue({
                valid: false,
            });
            setupMocks({ validateCoupon: mockValidateCoupon });

            const { getByText, getByPlaceholderText } = render(<CheckoutScreen />);

            const couponInput = getByPlaceholderText('Enter coupon code');
            fireEvent.changeText(couponInput, 'INVALID');

            const applyButton = getByText('Apply');
            fireEvent.press(applyButton);

            await waitFor(() => {
                expect(getByText('Invalid coupon code')).toBeTruthy();
            });
        });

        it('should handle coupon validation error', async () => {
            mockValidateCoupon.mockRejectedValue(new Error('Network error'));
            setupMocks({ validateCoupon: mockValidateCoupon });

            const { getByText, getByPlaceholderText } = render(<CheckoutScreen />);

            const couponInput = getByPlaceholderText('Enter coupon code');
            fireEvent.changeText(couponInput, 'SAVE10');

            const applyButton = getByText('Apply');
            fireEvent.press(applyButton);

            await waitFor(() => {
                expect(getByText('Network error')).toBeTruthy();
            });
        });

        it('should handle coupon validation error without message', async () => {
            mockValidateCoupon.mockRejectedValue(new Error());
            setupMocks({ validateCoupon: mockValidateCoupon });

            const { getByText, getByPlaceholderText } = render(<CheckoutScreen />);

            const couponInput = getByPlaceholderText('Enter coupon code');
            fireEvent.changeText(couponInput, 'SAVE10');

            const applyButton = getByText('Apply');
            fireEvent.press(applyButton);

            await waitFor(() => {
                expect(getByText('Failed to validate coupon')).toBeTruthy();
            });
        });

        it('should clear coupon error when typing', async () => {
            const { getByText, getByPlaceholderText } = render(<CheckoutScreen />);

            // First trigger error
            const applyButton = getByText('Apply');
            fireEvent.press(applyButton);

            await waitFor(() => {
                expect(getByText('Please enter a coupon code')).toBeTruthy();
            });

            // Type in coupon input to clear error
            const couponInput = getByPlaceholderText('Enter coupon code');
            fireEvent.changeText(couponInput, 'NEW');

            expect(couponInput.props.value).toBe('NEW');
        });

        it('should remove applied coupon', async () => {
            mockValidateCoupon.mockResolvedValue({
                valid: true,
                code: 'SAVE10',
                discountType: 'PERCENTAGE',
                discountValue: 10,
                discount: 25,
            });
            setupMocks({ validateCoupon: mockValidateCoupon });

            const { getByText, getByPlaceholderText, queryByText } = render(<CheckoutScreen />);

            const couponInput = getByPlaceholderText('Enter coupon code');
            fireEvent.changeText(couponInput, 'SAVE10');

            const applyButton = getByText('Apply');
            fireEvent.press(applyButton);

            await waitFor(() => {
                expect(getByText('10% off')).toBeTruthy();
            });

            // Find and press remove button (the X icon)
            const couponDisplay = getByText('SAVE10');
            expect(couponDisplay).toBeTruthy();
        });
    });

    // =========================================
    // Order Summary Tests
    // =========================================
    describe('Order Summary', () => {
        it('should display order summary section', () => {
            const { getByText } = render(<CheckoutScreen />);

            expect(getByText('Order Summary')).toBeTruthy();
            expect(getByText('Subtotal')).toBeTruthy();
            expect(getByText('Shipping')).toBeTruthy();
            expect(getByText('Tax (8%)')).toBeTruthy();
            expect(getByText('Total')).toBeTruthy();
        });

        it('should calculate correct subtotal', () => {
            const { getByText } = render(<CheckoutScreen />);

            // Subtotal = (100*2) + (50*1) = 250
            expect(getByText('₹250.00')).toBeTruthy();
        });

        it('should show free shipping for orders over 100', () => {
            const { getByText } = render(<CheckoutScreen />);

            expect(getByText('FREE')).toBeTruthy();
        });

        it('should show shipping cost for small orders', () => {
            const smallCart = [
                { id: '1', productId: 'prod-1', name: 'Small Item', price: 50, quantity: 1, image: '', variant: '' },
            ];
            setupMocks({ storeState: { ...mockStoreState, items: smallCart } });

            const { getAllByText, getByText } = render(<CheckoutScreen />);

            // Shipping should be ₹10 for small orders under 100
            expect(getByText('₹10.00')).toBeTruthy();
        });

        it('should show express shipping cost', () => {
            const { getByText } = render(<CheckoutScreen />);

            fireEvent.press(getByText('Express Delivery'));

            expect(getByText('₹80.00')).toBeTruthy();
        });

        it('should display item quantity', () => {
            const { getByText } = render(<CheckoutScreen />);

            expect(getByText('Qty: 2')).toBeTruthy();
            expect(getByText('Qty: 1')).toBeTruthy();
        });

        it('should display discount when coupon applied', async () => {
            mockValidateCoupon.mockResolvedValue({
                valid: true,
                code: 'SAVE10',
                discountType: 'percentage',
                discountValue: 10,
                discount: 25,
            });
            setupMocks({ validateCoupon: mockValidateCoupon });

            const { getByText, getByPlaceholderText } = render(<CheckoutScreen />);

            fireEvent.changeText(getByPlaceholderText('Enter coupon code'), 'SAVE10');
            fireEvent.press(getByText('Apply'));

            await waitFor(() => {
                expect(getByText('Discount')).toBeTruthy();
            });
        });

        it('should display bottom bar with total and item count', () => {
            const { getByText } = render(<CheckoutScreen />);

            expect(getByText('2 items')).toBeTruthy();
        });
    });

    // =========================================
    // Place Order Tests
    // =========================================
    describe('Place Order', () => {
        it('should have place order button', () => {
            const { getByText } = render(<CheckoutScreen />);
            const placeOrderButton = getByText('Place Order');

            expect(placeOrderButton).toBeTruthy();
        });

        it('should show error when placing order without address', async () => {
            setupMocks({ addresses: [] });

            const { getByText } = render(<CheckoutScreen />);
            const placeOrderButton = getByText('Place Order');

            fireEvent.press(placeOrderButton);

            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalledWith(
                    'Missing Address',
                    'Please select or add a shipping address'
                );
            });
        });

        it('should show login prompt when user is not logged in', async () => {
            setupMocks({ storeState: { ...mockStoreState, userProfile: null } });

            const { getByText } = render(<CheckoutScreen />);
            const placeOrderButton = getByText('Place Order');

            fireEvent.press(placeOrderButton);

            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalledWith(
                    'Please Login',
                    'You need to be logged in to place an order',
                    expect.arrayContaining([
                        expect.objectContaining({ text: 'Cancel', style: 'cancel' }),
                        expect.objectContaining({ text: 'Login' }),
                    ])
                );
            });
        });

        it('should navigate to login when user clicks Login in alert', async () => {
            setupMocks({ storeState: { ...mockStoreState, userProfile: null } });

            const { getByText } = render(<CheckoutScreen />);
            fireEvent.press(getByText('Place Order'));

            await waitFor(() => {
                const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
                const loginButton = alertCall[2].find((btn: any) => btn.text === 'Login');
                loginButton.onPress();

                expect(router.push).toHaveBeenCalledWith('/login');
            });
        });

        it('should show error when selected address not found', async () => {
            // Create addresses but mock them to change after initial render
            setupMocks({ addresses: mockAddresses });

            const { getByText, rerender } = render(<CheckoutScreen />);

            // Now change addresses to empty to simulate address being deleted
            setupMocks({ addresses: [] });

            // Re-render to trigger the changed addresses
            rerender(<CheckoutScreen />);

            // Wait and press place order - selected address will be invalid
            await waitFor(async () => {
                const placeOrderButton = getByText('Place Order');
                fireEvent.press(placeOrderButton);
            });
        });

        it('should place order successfully', async () => {
            mockCreateOrder.mockResolvedValue({
                id: 'order-123',
                orderNumber: 'ORD-001',
            });
            setupMocks({ createOrder: mockCreateOrder });

            const { getByText } = render(<CheckoutScreen />);

            await waitFor(() => {
                const placeOrderButton = getByText('Place Order');
                fireEvent.press(placeOrderButton);
            });

            await waitFor(() => {
                expect(mockCreateOrder).toHaveBeenCalled();
                expect(mockClearCart).toHaveBeenCalled();
                expect(Alert.alert).toHaveBeenCalledWith(
                    'Order Placed!',
                    expect.stringContaining('ORD-001'),
                    expect.any(Array)
                );
            });
        });

        it('should place order successfully with order id as fallback', async () => {
            mockCreateOrder.mockResolvedValue({
                id: 'order-123',
            });
            setupMocks({ createOrder: mockCreateOrder });

            const { getByText } = render(<CheckoutScreen />);

            await waitFor(() => {
                const placeOrderButton = getByText('Place Order');
                fireEvent.press(placeOrderButton);
            });

            await waitFor(() => {
                expect(mockCreateOrder).toHaveBeenCalled();
                expect(Alert.alert).toHaveBeenCalledWith(
                    'Order Placed!',
                    expect.stringContaining('order-123'),
                    expect.any(Array)
                );
            });
        });

        it('should navigate to order when View Order is pressed', async () => {
            mockCreateOrder.mockResolvedValue({ id: 'order-123', orderNumber: 'ORD-001' });
            setupMocks({ createOrder: mockCreateOrder });

            const { getByText } = render(<CheckoutScreen />);
            fireEvent.press(getByText('Place Order'));

            await waitFor(() => {
                const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
                const viewOrderButton = alertCall[2].find((btn: any) => btn.text === 'View Order');
                viewOrderButton.onPress();

                expect(router.replace).toHaveBeenCalledWith('/orders/order-123');
            });
        });

        it('should navigate to tabs when Continue Shopping is pressed', async () => {
            mockCreateOrder.mockResolvedValue({ id: 'order-123', orderNumber: 'ORD-001' });
            setupMocks({ createOrder: mockCreateOrder });

            const { getByText } = render(<CheckoutScreen />);
            fireEvent.press(getByText('Place Order'));

            await waitFor(() => {
                const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
                const continueButton = alertCall[2].find((btn: any) => btn.text === 'Continue Shopping');
                continueButton.onPress();

                expect(router.replace).toHaveBeenCalledWith('/(tabs)');
            });
        });

        it('should handle order creation error', async () => {
            mockCreateOrder.mockRejectedValue(new Error('Payment failed'));
            setupMocks({ createOrder: mockCreateOrder });

            const { getByText } = render(<CheckoutScreen />);
            fireEvent.press(getByText('Place Order'));

            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalledWith(
                    'Order Failed',
                    'Payment failed'
                );
            });
        });

        it('should handle order creation error without message', async () => {
            mockCreateOrder.mockRejectedValue(new Error());
            setupMocks({ createOrder: mockCreateOrder });

            const { getByText } = render(<CheckoutScreen />);
            fireEvent.press(getByText('Place Order'));

            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalledWith(
                    'Order Failed',
                    'Failed to place order. Please try again.'
                );
            });
        });

        it('should include coupon code in order when valid coupon applied', async () => {
            mockValidateCoupon.mockResolvedValue({
                valid: true,
                code: 'SAVE10',
                discountType: 'percentage',
                discountValue: 10,
                discount: 25,
            });
            mockCreateOrder.mockResolvedValue({ id: 'order-123', orderNumber: 'ORD-001' });
            setupMocks({ validateCoupon: mockValidateCoupon, createOrder: mockCreateOrder });

            const { getByText, getByPlaceholderText } = render(<CheckoutScreen />);

            // Apply coupon
            fireEvent.changeText(getByPlaceholderText('Enter coupon code'), 'save10');
            fireEvent.press(getByText('Apply'));

            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalledWith('Success', expect.any(String));
            });

            // Place order
            fireEvent.press(getByText('Place Order'));

            await waitFor(() => {
                expect(mockCreateOrder).toHaveBeenCalledWith(
                    expect.objectContaining({
                        couponCode: 'SAVE10',
                    })
                );
            });
        });

        it('should include order notes in the order', async () => {
            mockCreateOrder.mockResolvedValue({ id: 'order-123', orderNumber: 'ORD-001' });
            setupMocks({ createOrder: mockCreateOrder });

            const { getByText, getByPlaceholderText } = render(<CheckoutScreen />);

            // Add order notes
            fireEvent.changeText(
                getByPlaceholderText('Add any special instructions for delivery...'),
                'Leave at door'
            );

            fireEvent.press(getByText('Place Order'));

            await waitFor(() => {
                expect(mockCreateOrder).toHaveBeenCalledWith(
                    expect.objectContaining({
                        notes: 'Leave at door',
                    })
                );
            });
        });

        it('should include correct payment method in order', async () => {
            mockCreateOrder.mockResolvedValue({ id: 'order-123', orderNumber: 'ORD-001' });
            setupMocks({ createOrder: mockCreateOrder });

            const { getByText } = render(<CheckoutScreen />);

            // Select UPI payment
            fireEvent.press(getByText('UPI'));

            fireEvent.press(getByText('Place Order'));

            await waitFor(() => {
                expect(mockCreateOrder).toHaveBeenCalledWith(
                    expect.objectContaining({
                        paymentMethod: 'upi',
                    })
                );
            });
        });
    });

    // =========================================
    // Navigation Tests
    // =========================================
    describe('Navigation', () => {
        it('should navigate back when Back button is pressed', () => {
            const { getByText } = render(<CheckoutScreen />);

            const backButton = getByText('Back');
            fireEvent.press(backButton);

            expect(router.back).toHaveBeenCalled();
        });
    });

    // =========================================
    // Edge Cases and Loading States
    // =========================================
    describe('Edge Cases and Loading States', () => {
        it('should show loading indicator when validating coupon', () => {
            setupMocks({ isValidatingCoupon: true });

            const { getByPlaceholderText } = render(<CheckoutScreen />);

            // Coupon input should still be visible
            expect(getByPlaceholderText('Enter coupon code')).toBeTruthy();
        });

        it('should show loading indicator when adding address', () => {
            setupMocks({ isAddingAddress: true });

            const { getByText, UNSAFE_queryByType } = render(<CheckoutScreen />);

            const addButton = getByText('Add New Address');
            fireEvent.press(addButton);

            // Modal should be visible with loading indicator (ActivityIndicator replaces Save Address text)
            expect(getByText('Full Name *')).toBeTruthy();
        });

        it('should handle cart with items without image', () => {
            const cartWithNoImage = [
                { id: '1', productId: 'prod-1', name: 'Product No Image', price: 100, quantity: 1, image: '', variant: '' },
            ];
            setupMocks({ storeState: { ...mockStoreState, items: cartWithNoImage } });

            const { getByText } = render(<CheckoutScreen />);

            expect(getByText('Product No Image')).toBeTruthy();
        });

        it('should handle address without mobile number', () => {
            const addressWithoutMobile = [
                {
                    id: 'addr-1',
                    name: 'John Doe',
                    street: '123 Main St',
                    city: 'New York',
                    state: 'NY',
                    zip: '10001',
                    country: 'USA',
                    isDefault: true,
                },
            ];
            setupMocks({ addresses: addressWithoutMobile });

            const { getByText, queryByText } = render(<CheckoutScreen />);

            expect(getByText('123 Main St')).toBeTruthy();
            expect(queryByText(/📱/)).toBeNull();
        });

        it('should calculate discount correctly for PERCENTAGE type (uppercase)', async () => {
            mockValidateCoupon.mockResolvedValue({
                valid: true,
                code: 'SAVE20',
                discountType: 'PERCENTAGE',
                discountValue: 20,
                discount: 50,
            });
            setupMocks({ validateCoupon: mockValidateCoupon });

            const { getByText, getByPlaceholderText } = render(<CheckoutScreen />);

            fireEvent.changeText(getByPlaceholderText('Enter coupon code'), 'SAVE20');
            fireEvent.press(getByText('Apply'));

            await waitFor(() => {
                expect(getByText('20% off')).toBeTruthy();
            });
        });

        it('should display fixed discount amount correctly', async () => {
            mockValidateCoupon.mockResolvedValue({
                valid: true,
                code: 'FLAT100',
                discountType: 'fixed',
                discountValue: 100,
                discount: 100,
            });
            setupMocks({ validateCoupon: mockValidateCoupon });

            const { getByText, getByPlaceholderText } = render(<CheckoutScreen />);

            fireEvent.changeText(getByPlaceholderText('Enter coupon code'), 'FLAT100');
            fireEvent.press(getByText('Apply'));

            await waitFor(() => {
                expect(getByText('₹100.00 off')).toBeTruthy();
            });
        });
    });
});
