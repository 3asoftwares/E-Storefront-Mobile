import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import OrdersScreen from '../../../../app/orders/index';
import { useOrders } from '../../../lib/hooks';
import { useCartStore } from '../../../store/cartStore';

// Mock dependencies
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    back: jest.fn(),
  },
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
  useOrders: jest.fn(),
}));

jest.mock('../../../store/cartStore', () => ({
  useCartStore: jest.fn(),
}));

describe('OrdersScreen', () => {
  const mockOrders = [
    {
      id: 'order-1',
      orderNumber: 'ORD-001',
      orderStatus: 'pending',
      total: 199.99,
      createdAt: '2024-01-15T00:00:00.000Z',
      items: [{ quantity: 2 }, { quantity: 1 }],
      paymentMethod: 'card',
    },
    {
      id: 'order-2',
      orderNumber: 'ORD-002',
      orderStatus: 'delivered',
      total: 89.5,
      createdAt: '2024-01-10T00:00:00.000Z',
      items: [{ quantity: 1 }],
      paymentMethod: 'paypal',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useOrders as jest.Mock).mockReturnValue({
      data: mockOrders,
      isLoading: false,
      refetch: jest.fn(),
      isRefetching: false,
    });
    (useCartStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        userProfile: { id: 'user-123' },
      };
      return selector(state);
    });
  });

  it('should render orders screen correctly', () => {
    const { getByText } = render(<OrdersScreen />);

    expect(getByText('My Orders')).toBeTruthy();
  });

  it('should display order count', () => {
    const { getByText } = render(<OrdersScreen />);

    expect(getByText('2 orders')).toBeTruthy();
  });

  it('should display order number', () => {
    const { getByText } = render(<OrdersScreen />);

    expect(getByText('Order #ORD-001')).toBeTruthy();
    expect(getByText('Order #ORD-002')).toBeTruthy();
  });

  it('should display order status badge', () => {
    const { getByText } = render(<OrdersScreen />);

    expect(getByText('Pending')).toBeTruthy();
    expect(getByText('Delivered')).toBeTruthy();
  });

  it('should display order total', () => {
    const { getAllByText } = render(<OrdersScreen />);

    expect(getAllByText('₹199.99').length).toBeGreaterThan(0);
    expect(getAllByText('₹89.50').length).toBeGreaterThan(0);
  });

  it('should display item count', () => {
    const { getAllByText } = render(<OrdersScreen />);

    // First order has 3 items, second has 1
    expect(getAllByText('3').length).toBeGreaterThan(0);
    expect(getAllByText('1').length).toBeGreaterThan(0);
  });

  it('should display view details link', () => {
    const { getAllByText } = render(<OrdersScreen />);

    expect(getAllByText('View Details').length).toBe(2);
  });

  it('should show loading state', () => {
    (useOrders as jest.Mock).mockReturnValue({
      data: [],
      isLoading: true,
      refetch: jest.fn(),
      isRefetching: false,
    });

    const { getByText } = render(<OrdersScreen />);

    expect(getByText('Loading orders...')).toBeTruthy();
  });

  it('should show empty state when no orders', () => {
    (useOrders as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      refetch: jest.fn(),
      isRefetching: false,
    });

    const { getByText } = render(<OrdersScreen />);

    expect(getByText('No orders yet')).toBeTruthy();
    expect(getByText('Start shopping to see your orders here')).toBeTruthy();
    expect(getByText('Start Shopping')).toBeTruthy();
  });

  it('should display back button', () => {
    const { getByText } = render(<OrdersScreen />);

    expect(getByText('Back')).toBeTruthy();
  });

  it('should render correctly', () => {
    const { toJSON } = render(<OrdersScreen />);
    expect(toJSON()).toBeTruthy();
  });

  it('should show singular order text for one order', () => {
    (useOrders as jest.Mock).mockReturnValue({
      data: [mockOrders[0]],
      isLoading: false,
      refetch: jest.fn(),
      isRefetching: false,
    });

    const { getByText } = render(<OrdersScreen />);

    expect(getByText('1 order')).toBeTruthy();
  });
});
