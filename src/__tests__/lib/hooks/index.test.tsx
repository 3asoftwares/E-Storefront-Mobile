/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apolloClient } from '../../../lib/apollo/client';
import {
  useProducts,
  useInfiniteProducts,
  useProduct,
  useCategories,
  useLogin,
  useRegister,
  useLogout,
  useCurrentUser,
  useOrders,
  useOrder,
  useCreateOrder,
  useCancelOrder,
  useProductReviews,
  useCreateReview,
  useValidateCoupon,
  useAddresses,
  useAddAddress,
  useUpdateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
  useUpdateProfile,
  useChangePassword,
  useSendVerificationEmail,
  useVerifyEmail,
  useForgotPassword,
  useResetPassword,
  useValidateResetToken,
} from '../../../lib/hooks';

// Mock dependencies
jest.mock('../../../lib/apollo/client');
jest.mock('@react-native-async-storage/async-storage');
jest.mock('../../../store/cartStore', () => ({
  useCartStore: jest.fn((selector) => {
    const mockStore = {
      setUserProfile: jest.fn(),
      clearUser: jest.fn(),
      clearCart: jest.fn(),
    };
    return selector ? selector(mockStore) : mockStore;
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return Wrapper;
};

describe('Product Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useProducts', () => {
    it('should fetch products successfully', async () => {
      const mockProducts = {
        data: [{ id: '1', name: 'Product 1' }],
        pagination: { page: 1, pages: 1 },
      };

      (apolloClient.query as jest.Mock).mockResolvedValue({
        data: { products: mockProducts },
      });

      const { result } = renderHook(() => useProducts(1, 20), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockProducts);
    });

    it('should handle filters', async () => {
      const filters = { category: 'electronics', minPrice: 100 };
      (apolloClient.query as jest.Mock).mockResolvedValue({
        data: { products: { data: [] } },
      });

      renderHook(() => useProducts(1, 20, filters), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(apolloClient.query).toHaveBeenCalledWith(
          expect.objectContaining({
            variables: expect.objectContaining({
              ...filters,
              page: 1,
              limit: 20,
            }),
          })
        );
      });
    });
  });

  describe('useInfiniteProducts', () => {
    it('should fetch infinite products', async () => {
      const mockProducts = {
        data: [{ id: '1', name: 'Product 1' }],
        pagination: { page: 1, pages: 2 },
      };

      (apolloClient.query as jest.Mock).mockResolvedValue({
        data: { products: mockProducts },
      });

      const { result } = renderHook(() => useInfiniteProducts(20), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data?.pages[0]).toEqual(mockProducts);
    });
  });

  describe('useProduct', () => {
    it('should fetch single product', async () => {
      const mockProduct = { id: '1', name: 'Product 1' };
      (apolloClient.query as jest.Mock).mockResolvedValue({
        data: { product: mockProduct },
      });

      const { result } = renderHook(() => useProduct('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockProduct);
    });

    it('should not fetch when id is not provided', () => {
      const { result } = renderHook(() => useProduct(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.data).toBeUndefined();
    });
  });

  describe('useCategories', () => {
    it('should fetch categories', async () => {
      const mockCategories = [{ id: '1', name: 'Category 1' }];
      (apolloClient.query as jest.Mock).mockResolvedValue({
        data: { categories: { data: mockCategories } },
      });

      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockCategories);
    });
  });
});

describe('Auth Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useLogin', () => {
    it('should login successfully', async () => {
      const mockLoginData = {
        accessToken: 'token123',
        refreshToken: 'refresh123',
        user: { id: '1', email: 'test@example.com', name: 'Test User' },
      };

      (apolloClient.mutate as jest.Mock).mockResolvedValue({
        data: { login: mockLoginData },
      });

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      await result.current.login({ email: 'test@example.com', password: 'password' });

      expect(AsyncStorage.setItem).toHaveBeenCalledWith('refreshToken', 'refresh123');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockLoginData.user));
    });

    it('should handle login failure', async () => {
      (apolloClient.mutate as jest.Mock).mockResolvedValue({ data: { login: null } });

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      await expect(
        result.current.login({ email: 'test@example.com', password: 'wrong' })
      ).rejects.toThrow('Login failed');
    });
  });

  describe('useRegister', () => {
    it('should register successfully', async () => {
      const mockRegisterData = {
        accessToken: 'token123',
        refreshToken: 'refresh123',
        user: { id: '1', email: 'test@example.com', name: 'Test User' },
      };

      (apolloClient.mutate as jest.Mock).mockResolvedValue({
        data: { register: mockRegisterData },
      });

      const { result } = renderHook(() => useRegister(), {
        wrapper: createWrapper(),
      });

      await result.current.register({
        email: 'test@example.com',
        password: 'password',
        name: 'Test User',
      });

      expect(AsyncStorage.setItem).toHaveBeenCalledWith('refreshToken', 'refresh123');
    });
  });

  describe('useLogout', () => {
    it('should logout successfully', async () => {
      (apolloClient.mutate as jest.Mock).mockResolvedValue({});
      (apolloClient.resetStore as jest.Mock).mockResolvedValue({});

      const { result } = renderHook(() => useLogout(), {
        wrapper: createWrapper(),
      });

      await result.current.logout();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('refreshToken');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('user');
    });

    it('should handle logout errors gracefully', async () => {
      (apolloClient.mutate as jest.Mock).mockRejectedValue(new Error('Network error'));
      (apolloClient.resetStore as jest.Mock).mockResolvedValue({});

      const { result } = renderHook(() => useLogout(), {
        wrapper: createWrapper(),
      });

      await result.current.logout();

      expect(AsyncStorage.removeItem).toHaveBeenCalled();
    });
  });

  describe('useCurrentUser', () => {
    it('should fetch current user', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };
      (apolloClient.query as jest.Mock).mockResolvedValue({
        data: { me: mockUser },
      });

      const { result } = renderHook(() => useCurrentUser(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockUser);
    });

    it('should handle authentication error', async () => {
      const authError = {
        graphQLErrors: [{ extensions: { code: 'UNAUTHENTICATED' } }],
      };
      (apolloClient.query as jest.Mock).mockRejectedValue(authError);

      const { result } = renderHook(() => useCurrentUser(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
    });
  });
});

describe('Order Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useOrders', () => {
    it('should fetch orders', async () => {
      const mockOrders = [{ id: '1', total: 100 }];
      (apolloClient.query as jest.Mock).mockResolvedValue({
        data: { ordersByCustomer: mockOrders },
      });

      const { result } = renderHook(() => useOrders('customer1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockOrders);
    });
  });

  describe('useOrder', () => {
    it('should fetch single order', async () => {
      const mockOrder = { id: '1', total: 100 };
      (apolloClient.query as jest.Mock).mockResolvedValue({
        data: { order: mockOrder },
      });

      const { result } = renderHook(() => useOrder('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockOrder);
    });
  });

  describe('useCreateOrder', () => {
    it('should create order successfully', async () => {
      const mockOrder = { id: '1', total: 100 };
      (apolloClient.mutate as jest.Mock).mockResolvedValue({
        data: { createOrder: mockOrder },
      });

      const { result } = renderHook(() => useCreateOrder(), {
        wrapper: createWrapper(),
      });

      await result.current.createOrder({ items: [] });

      expect(apolloClient.mutate).toHaveBeenCalled();
    });
  });

  describe('useCancelOrder', () => {
    it('should cancel order successfully', async () => {
      const mockOrder = { id: '1', status: 'cancelled' };
      (apolloClient.mutate as jest.Mock).mockResolvedValue({
        data: { cancelOrder: mockOrder },
      });

      const { result } = renderHook(() => useCancelOrder(), {
        wrapper: createWrapper(),
      });

      await result.current.cancelOrder('1');

      expect(apolloClient.mutate).toHaveBeenCalled();
    });
  });
});

describe('Review Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useProductReviews', () => {
    it('should fetch product reviews', async () => {
      const mockReviews = [{ id: '1', rating: 5 }];
      (apolloClient.query as jest.Mock).mockResolvedValue({
        data: { productReviews: mockReviews },
      });

      const { result } = renderHook(() => useProductReviews('product1', 1, 10), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockReviews);
    });
  });

  describe('useCreateReview', () => {
    it('should create review successfully', async () => {
      const mockReview = { id: '1', rating: 5 };
      (apolloClient.mutate as jest.Mock).mockResolvedValue({
        data: { createReview: mockReview },
      });

      const { result } = renderHook(() => useCreateReview(), {
        wrapper: createWrapper(),
      });

      await result.current.createReview({
        productId: '1',
        rating: 5,
        title: 'Great',
        comment: 'Excellent product',
      });

      expect(apolloClient.mutate).toHaveBeenCalled();
    });
  });
});

describe('Coupon Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useValidateCoupon', () => {
    it('should validate coupon successfully', async () => {
      const mockCoupon = { code: 'SAVE10', discount: 10 };
      (apolloClient.query as jest.Mock).mockResolvedValue({
        data: { validateCoupon: mockCoupon },
      });

      const { result } = renderHook(() => useValidateCoupon(), {
        wrapper: createWrapper(),
      });

      await result.current.validateCoupon({ code: 'SAVE10', orderTotal: 100 });

      expect(apolloClient.query).toHaveBeenCalled();
    });
  });
});

describe('Address Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useAddresses', () => {
    it('should fetch addresses', async () => {
      const mockAddresses = [{ id: '1', street: '123 Main St' }];
      (apolloClient.query as jest.Mock).mockResolvedValue({
        data: { myAddresses: { addresses: mockAddresses } },
      });

      const { result } = renderHook(() => useAddresses(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockAddresses);
    });
  });

  describe('useAddAddress', () => {
    it('should add address successfully', async () => {
      const mockAddress = { id: '1', street: '123 Main St' };
      (apolloClient.mutate as jest.Mock).mockResolvedValue({
        data: { addAddress: mockAddress },
      });

      const { result } = renderHook(() => useAddAddress(), {
        wrapper: createWrapper(),
      });

      await result.current.addAddress({ street: '123 Main St' });

      expect(apolloClient.mutate).toHaveBeenCalled();
    });
  });

  describe('useUpdateAddress', () => {
    it('should update address successfully', async () => {
      const mockAddress = { id: '1', street: '456 Oak St' };
      (apolloClient.mutate as jest.Mock).mockResolvedValue({
        data: { updateAddress: mockAddress },
      });

      const { result } = renderHook(() => useUpdateAddress(), {
        wrapper: createWrapper(),
      });

      await result.current.updateAddress({ id: '1', input: { street: '456 Oak St' } });

      expect(apolloClient.mutate).toHaveBeenCalled();
    });
  });

  describe('useDeleteAddress', () => {
    it('should delete address successfully', async () => {
      (apolloClient.mutate as jest.Mock).mockResolvedValue({
        data: { deleteAddress: true },
      });

      const { result } = renderHook(() => useDeleteAddress(), {
        wrapper: createWrapper(),
      });

      await result.current.deleteAddress('1');

      expect(apolloClient.mutate).toHaveBeenCalled();
    });
  });

  describe('useSetDefaultAddress', () => {
    it('should set default address successfully', async () => {
      (apolloClient.mutate as jest.Mock).mockResolvedValue({
        data: { setDefaultAddress: true },
      });

      const { result } = renderHook(() => useSetDefaultAddress(), {
        wrapper: createWrapper(),
      });

      await result.current.setDefaultAddress('1');

      expect(apolloClient.mutate).toHaveBeenCalled();
    });
  });
});

describe('Profile Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useUpdateProfile', () => {
    it('should update profile successfully', async () => {
      const mockUser = { id: '1', name: 'Updated Name', email: 'test@example.com' };
      (apolloClient.mutate as jest.Mock).mockResolvedValue({
        data: { updateProfile: { success: true, user: mockUser } },
      });
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockUser));

      const { result } = renderHook(() => useUpdateProfile(), {
        wrapper: createWrapper(),
      });

      await result.current.updateProfile({ name: 'Updated Name' });

      expect(apolloClient.mutate).toHaveBeenCalled();
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('useChangePassword', () => {
    it('should change password successfully', async () => {
      (apolloClient.mutate as jest.Mock).mockResolvedValue({
        data: { changePassword: { success: true } },
      });

      const { result } = renderHook(() => useChangePassword(), {
        wrapper: createWrapper(),
      });

      await result.current.changePassword({
        currentPassword: 'old',
        newPassword: 'new',
      });

      expect(apolloClient.mutate).toHaveBeenCalled();
    });

    it('should handle password change failure', async () => {
      (apolloClient.mutate as jest.Mock).mockResolvedValue({
        data: { changePassword: { success: false, message: 'Wrong password' } },
      });

      const { result } = renderHook(() => useChangePassword(), {
        wrapper: createWrapper(),
      });

      await expect(
        result.current.changePassword({
          currentPassword: 'wrong',
          newPassword: 'new',
        })
      ).rejects.toThrow();
    });
  });
});

describe('Email Verification Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useSendVerificationEmail', () => {
    it('should send verification email', async () => {
      (apolloClient.mutate as jest.Mock).mockResolvedValue({
        data: { sendVerificationEmail: { success: true } },
      });

      const { result } = renderHook(() => useSendVerificationEmail(), {
        wrapper: createWrapper(),
      });

      await result.current.sendVerificationEmail();

      expect(apolloClient.mutate).toHaveBeenCalled();
    });

    it('should send verification email with custom source', async () => {
      (apolloClient.mutate as jest.Mock).mockResolvedValue({
        data: { sendVerificationEmail: { success: true } },
      });

      const { result } = renderHook(() => useSendVerificationEmail(), {
        wrapper: createWrapper(),
      });

      await result.current.sendVerificationEmail('custom-source');

      expect(apolloClient.mutate).toHaveBeenCalled();
    });
  });

  describe('useVerifyEmail', () => {
    it('should verify email successfully', async () => {
      const mockUser = { id: '1', email: 'test@example.com', emailVerified: true };
      (apolloClient.mutate as jest.Mock).mockResolvedValue({
        data: { verifyEmail: { success: true, user: mockUser } },
      });
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockUser));

      const { result } = renderHook(() => useVerifyEmail(), {
        wrapper: createWrapper(),
      });

      await result.current.verifyEmail();

      expect(apolloClient.mutate).toHaveBeenCalled();
    });
  });
});

describe('Password Reset Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useForgotPassword', () => {
    it('should send forgot password email', async () => {
      (apolloClient.mutate as jest.Mock).mockResolvedValue({
        data: { forgotPassword: { success: true } },
      });

      const { result } = renderHook(() => useForgotPassword(), {
        wrapper: createWrapper(),
      });

      await result.current.forgotPassword({
        email: 'test@example.com',
        domain: 'example.com',
      });

      expect(apolloClient.mutate).toHaveBeenCalled();
    });
  });

  describe('useResetPassword', () => {
    it('should reset password successfully', async () => {
      (apolloClient.mutate as jest.Mock).mockResolvedValue({
        data: { resetPassword: { success: true } },
      });

      const { result } = renderHook(() => useResetPassword(), {
        wrapper: createWrapper(),
      });

      await result.current.resetPassword({
        token: 'token123',
        password: 'newpass',
        confirmPassword: 'newpass',
      });

      expect(apolloClient.mutate).toHaveBeenCalled();
    });
  });

  describe('useValidateResetToken', () => {
    it('should validate reset token', async () => {
      const mockResult = { success: true, email: 'test@example.com' };
      (apolloClient.query as jest.Mock).mockResolvedValue({
        data: { validateResetToken: mockResult },
      });

      const { result } = renderHook(() => useValidateResetToken('token123'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isValid).toBe(true));
      expect(result.current.email).toBe('test@example.com');
    });

    it('should handle null token', () => {
      const { result } = renderHook(() => useValidateResetToken(null), {
        wrapper: createWrapper(),
      });

      expect(result.current.data).toBeUndefined();
    });
  });
});
