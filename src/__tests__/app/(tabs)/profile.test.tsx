import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import ProfileScreen from '../../../../app/(tabs)/profile';
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

// Mock helpers
jest.mock('../../../utils/helpers', () => ({
  showAlert: jest.fn(),
  showConfirm: jest.fn((title, message, onConfirm) => onConfirm && onConfirm()),
}));

// Mock hooks
const mockLogout = jest.fn();
jest.mock('../../../lib/hooks', () => ({
  useCurrentUser: jest.fn(() => ({
    data: { id: '1', name: 'Test User', email: 'test@example.com' },
    isLoading: false,
    error: null,
  })),
  useLogout: jest.fn(() => ({
    logout: mockLogout,
    isLoading: false,
  })),
  useOrders: jest.fn(() => ({
    data: [
      { id: '1', orderStatus: 'PENDING' },
      { id: '2', orderStatus: 'DELIVERED' },
    ],
    isLoading: false,
  })),
}));

// Profile store mock state
let mockUserProfile: any = { id: '1', name: 'Test User', email: 'test@example.com' };
const mockCartItems = [{ productId: '1', name: 'Test', price: 10, quantity: 1 }];
const mockWishlistItems = [{ productId: '2', name: 'Wishlist Item', price: 20 }];

jest.mock('../../../store/cartStore', () => ({
  useCartStore: jest.fn((selector) => {
    const state = {
      userProfile: mockUserProfile,
      items: mockCartItems,
      wishlist: mockWishlistItems,
    };
    return selector ? selector(state) : state;
  }),
}));

import { useCurrentUser, useOrders } from '../../../lib/hooks';
import { showConfirm } from '../../../utils/helpers';

describe('ProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUserProfile = { id: '1', name: 'Test User', email: 'test@example.com' };
  });

  describe('Authenticated User', () => {
    it('should render profile screen with user name', async () => {
      const { getByText } = render(<ProfileScreen />);

      await waitFor(() => {
        expect(getByText('Test User')).toBeTruthy();
      });
    });

    it('should display user email', async () => {
      const { getByText } = render(<ProfileScreen />);

      await waitFor(() => {
        expect(getByText('test@example.com')).toBeTruthy();
      });
    });

    it('should display user avatar initial', async () => {
      const { getByText } = render(<ProfileScreen />);

      await waitFor(() => {
        expect(getByText('T')).toBeTruthy();
      });
    });

    it('should display Edit Profile button', async () => {
      const { getByText } = render(<ProfileScreen />);

      await waitFor(() => {
        expect(getByText('Edit Profile')).toBeTruthy();
      });
    });

    it('should navigate to edit profile when button is pressed', async () => {
      const { getByText } = render(<ProfileScreen />);

      await waitFor(() => {
        const editButton = getByText('Edit Profile');
        fireEvent.press(editButton);
      });

      expect(router.push).toHaveBeenCalledWith('/edit-profile');
    });

    it('should display My Account section', async () => {
      const { getByText } = render(<ProfileScreen />);

      await waitFor(() => {
        expect(getByText('My Account')).toBeTruthy();
      });
    });

    it('should display My Orders menu item', async () => {
      const { getByText } = render(<ProfileScreen />);

      await waitFor(() => {
        expect(getByText('My Orders')).toBeTruthy();
      });
    });

    it('should navigate to orders when My Orders is pressed', async () => {
      const { getByText } = render(<ProfileScreen />);

      await waitFor(() => {
        const ordersItem = getByText('My Orders');
        fireEvent.press(ordersItem);
      });

      expect(router.push).toHaveBeenCalledWith('/orders');
    });

    it('should display Addresses menu item', async () => {
      const { getByText } = render(<ProfileScreen />);

      await waitFor(() => {
        expect(getByText('Addresses')).toBeTruthy();
      });
    });

    it('should navigate to addresses when Addresses is pressed', async () => {
      const { getByText } = render(<ProfileScreen />);

      await waitFor(() => {
        const addressesItem = getByText('Addresses');
        fireEvent.press(addressesItem);
      });

      expect(router.push).toHaveBeenCalledWith('/addresses');
    });

    it('should display Wishlist menu item', async () => {
      const { getAllByText } = render(<ProfileScreen />);

      await waitFor(() => {
        const wishlistItems = getAllByText('Wishlist');
        expect(wishlistItems.length).toBeGreaterThan(0);
      });
    });

    it('should display Settings section', async () => {
      const { getByText } = render(<ProfileScreen />);

      await waitFor(() => {
        expect(getByText('Settings')).toBeTruthy();
      });
    });

    it('should display Support section', async () => {
      const { getByText } = render(<ProfileScreen />);

      await waitFor(() => {
        expect(getByText('Support')).toBeTruthy();
      });
    });

    it('should display Help Center menu item', async () => {
      const { getByText } = render(<ProfileScreen />);

      await waitFor(() => {
        expect(getByText('Help Center')).toBeTruthy();
      });
    });

    it('should display Sign Out button', async () => {
      const { getByText } = render(<ProfileScreen />);

      await waitFor(() => {
        expect(getByText('Sign Out')).toBeTruthy();
      });
    });

    it('should show logout confirmation when Sign Out is pressed', async () => {
      const { getByText } = render(<ProfileScreen />);

      await waitFor(() => {
        const logoutButton = getByText('Sign Out');
        fireEvent.press(logoutButton);
      });

      expect(showConfirm).toHaveBeenCalledWith(
        'Sign Out',
        'Are you sure you want to sign out?',
        expect.any(Function),
        undefined,
        'Sign Out'
      );
    });

    it('should display app version', async () => {
      const { getByText } = render(<ProfileScreen />);

      await waitFor(() => {
        expect(getByText('Version 1.0.0')).toBeTruthy();
      });
    });

    it('should display stats cards', async () => {
      const { getByText } = render(<ProfileScreen />);

      await waitFor(() => {
        expect(getByText('Orders')).toBeTruthy();
        expect(getByText('Cart')).toBeTruthy();
      });
    });

    it('should navigate to Privacy & Security', async () => {
      const { getByText } = render(<ProfileScreen />);

      await waitFor(() => {
        const privacyItem = getByText('Privacy & Security');
        fireEvent.press(privacyItem);
      });

      expect(router.push).toHaveBeenCalledWith('/privacy-security');
    });

    it('should navigate to Terms of Service', async () => {
      const { getByText } = render(<ProfileScreen />);

      await waitFor(() => {
        const termsItem = getByText('Terms of Service');
        fireEvent.press(termsItem);
      });

      expect(router.push).toHaveBeenCalledWith('/terms-of-service');
    });

    it('should navigate to Privacy Policy', async () => {
      const { getByText } = render(<ProfileScreen />);

      await waitFor(() => {
        const policyItem = getByText('Privacy Policy');
        fireEvent.press(policyItem);
      });

      expect(router.push).toHaveBeenCalledWith('/privacy-policy');
    });
  });

  describe('Guest User', () => {
    beforeEach(() => {
      mockUserProfile = null;
      (useCurrentUser as jest.Mock).mockReturnValue({
        data: null,
        isLoading: false,
        error: { message: 'Not authenticated' },
      });
    });

    it('should display welcome message for guest', async () => {
      const { getByText } = render(<ProfileScreen />);

      await waitFor(() => {
        expect(getByText('Welcome, Guest!')).toBeTruthy();
      });
    });

    it('should display sign in prompt', async () => {
      const { getByText } = render(<ProfileScreen />);

      await waitFor(() => {
        expect(getByText('Sign in to access your profile, orders, and more')).toBeTruthy();
      });
    });

    it('should display Sign In button', async () => {
      const { getByText } = render(<ProfileScreen />);

      await waitFor(() => {
        expect(getByText('Sign In')).toBeTruthy();
      });
    });

    it('should navigate to login when Sign In is pressed', async () => {
      const { getByText } = render(<ProfileScreen />);

      await waitFor(() => {
        const signInButton = getByText('Sign In');
        fireEvent.press(signInButton);
      });

      expect(router.push).toHaveBeenCalledWith('/login');
    });

    it('should display Create Account button', async () => {
      const { getByText } = render(<ProfileScreen />);

      await waitFor(() => {
        expect(getByText('Create Account')).toBeTruthy();
      });
    });

    it('should navigate to signup when Create Account is pressed', async () => {
      const { getByText } = render(<ProfileScreen />);

      await waitFor(() => {
        const signUpButton = getByText('Create Account');
        fireEvent.press(signUpButton);
      });

      expect(router.push).toHaveBeenCalledWith('/signup');
    });

    it('should display Quick Actions section', async () => {
      const { getByText } = render(<ProfileScreen />);

      await waitFor(() => {
        expect(getByText('Quick Actions')).toBeTruthy();
      });
    });

    it('should display View Cart in quick actions', async () => {
      const { getByText } = render(<ProfileScreen />);

      await waitFor(() => {
        expect(getByText('View Cart')).toBeTruthy();
      });
    });

    it('should display Browse Products in quick actions', async () => {
      const { getByText } = render(<ProfileScreen />);

      await waitFor(() => {
        expect(getByText('Browse Products')).toBeTruthy();
      });
    });
  });

  describe('Loading State', () => {
    beforeEach(() => {
      mockUserProfile = { id: '1', name: 'Test User', email: 'test@example.com' };
      (useCurrentUser as jest.Mock).mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
      });
    });

    it('should display loading state', async () => {
      const { getByText } = render(<ProfileScreen />);

      await waitFor(() => {
        expect(getByText('Loading profile...')).toBeTruthy();
      });
    });
  });
});
