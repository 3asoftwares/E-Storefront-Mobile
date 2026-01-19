import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import OrderDetailScreen from '../../../../app/orders/[id]';
import { useOrder, useCancelOrder } from '../../../lib/hooks';

// Mock dependencies
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    back: jest.fn(),
  },
  useLocalSearchParams: () => ({ id: 'order-123' }),
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
  useOrder: jest.fn(),
  useCancelOrder: jest.fn(),
}));

describe('OrderDetailScreen', () => {
  const mockCancelOrder = jest.fn();
  const mockRefetch = jest.fn();

  const mockOrder = {
    id: 'order-123',
    orderNumber: 'ORD-12345',
    orderStatus: 'processing',
    total: 299.99,
    subtotal: 289.99,
    shipping: 10.0,
    discount: 0,
    tax: 0,
    createdAt: '2024-01-15T00:00:00.000Z',
    paymentMethod: 'card',
    items: [
      {
        id: 'item-1',
        productName: 'Test Product 1',
        price: 149.99,
        quantity: 1,
        variant: 'Red',
      },
      {
        id: 'item-2',
        productName: 'Test Product 2',
        price: 139.99,
        quantity: 1,
      },
    ],
    shippingAddress: {
      name: 'John Doe',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'USA',
      mobile: '+1234567890',
      email: 'john@example.com',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useOrder as jest.Mock).mockReturnValue({
      data: mockOrder,
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    });
    (useCancelOrder as jest.Mock).mockReturnValue({
      cancelOrder: mockCancelOrder,
      isLoading: false,
    });
  });

  it('should render order detail screen correctly', () => {
    const { getByText } = render(<OrderDetailScreen />);

    expect(getByText('Order Details')).toBeTruthy();
  });

  it('should display order number', () => {
    const { getByText } = render(<OrderDetailScreen />);

    expect(getByText('Order #ORD-12345')).toBeTruthy();
  });

  it('should display order status', () => {
    const { getAllByText } = render(<OrderDetailScreen />);

    // Processing appears in both badge and timeline
    expect(getAllByText('Processing').length).toBeGreaterThan(0);
  });

  it('should display order status section title', () => {
    const { getByText } = render(<OrderDetailScreen />);

    expect(getByText('Order Status')).toBeTruthy();
  });

  it('should display order items section', () => {
    const { getByText } = render(<OrderDetailScreen />);

    expect(getByText('Items (2)')).toBeTruthy();
  });

  it('should display product names', () => {
    const { getByText } = render(<OrderDetailScreen />);

    expect(getByText('Test Product 1')).toBeTruthy();
    expect(getByText('Test Product 2')).toBeTruthy();
  });

  it('should display item variant', () => {
    const { getByText } = render(<OrderDetailScreen />);

    expect(getByText('Red')).toBeTruthy();
  });

  it('should display shipping address section', () => {
    const { getByText } = render(<OrderDetailScreen />);

    expect(getByText('Shipping Address')).toBeTruthy();
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('123 Main St')).toBeTruthy();
  });

  it('should display payment method section', () => {
    const { getByText } = render(<OrderDetailScreen />);

    expect(getByText('Payment Method')).toBeTruthy();
    expect(getByText('💳 Credit Card')).toBeTruthy();
  });

  it('should display order summary section', () => {
    const { getByText } = render(<OrderDetailScreen />);

    expect(getByText('Order Summary')).toBeTruthy();
    expect(getByText('Subtotal')).toBeTruthy();
    expect(getByText('Shipping')).toBeTruthy();
    expect(getByText('Total')).toBeTruthy();
  });

  it('should display total amount', () => {
    const { getByText } = render(<OrderDetailScreen />);

    expect(getByText('₹299.99')).toBeTruthy();
  });

  it('should display cancel button for pending orders', () => {
    (useOrder as jest.Mock).mockReturnValue({
      data: { ...mockOrder, orderStatus: 'pending' },
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    });

    const { getByText } = render(<OrderDetailScreen />);

    expect(getByText('Cancel Order')).toBeTruthy();
  });

  it('should display need help button', () => {
    const { getByText } = render(<OrderDetailScreen />);

    expect(getByText('Need Help?')).toBeTruthy();
  });

  it('should show loading state', () => {
    (useOrder as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      refetch: mockRefetch,
    });

    const { getByText } = render(<OrderDetailScreen />);

    expect(getByText('Loading order...')).toBeTruthy();
  });

  it('should show error state when order not found', () => {
    (useOrder as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Not found'),
      refetch: mockRefetch,
    });

    const { getByText } = render(<OrderDetailScreen />);

    expect(getByText('Order not found')).toBeTruthy();
    expect(getByText('View All Orders')).toBeTruthy();
  });

  it('should display back button', () => {
    const { getByText } = render(<OrderDetailScreen />);

    expect(getByText('Back')).toBeTruthy();
  });

  it('should render correctly', () => {
    const { toJSON } = render(<OrderDetailScreen />);
    expect(toJSON()).toBeTruthy();
  });

  it('should show cancelled status message', () => {
    (useOrder as jest.Mock).mockReturnValue({
      data: { ...mockOrder, orderStatus: 'cancelled' },
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    });

    const { getByText } = render(<OrderDetailScreen />);

    expect(getByText('This order has been cancelled')).toBeTruthy();
  });

  it('should display write review button for delivered orders', () => {
    (useOrder as jest.Mock).mockReturnValue({
      data: { ...mockOrder, orderStatus: 'delivered' },
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    });

    const { getByText } = render(<OrderDetailScreen />);

    expect(getByText('Write a Review')).toBeTruthy();
  });
});
