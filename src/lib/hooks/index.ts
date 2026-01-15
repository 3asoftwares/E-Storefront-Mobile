import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { apolloClient } from '../apollo/client';
import { GQL_QUERIES } from '../apollo/queries';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuthToken, clearAuthToken } from '../apollo/client';
import { useCartStore } from '../../store/cartStore';
import { router } from 'expo-router';

// ============== PRODUCT HOOKS ==============
export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: string;
  featured?: boolean;
}

export function useProducts(page: number = 1, limit: number = 20, filters?: ProductFilters) {
  return useQuery({
    queryKey: ['products', page, limit, filters],
    queryFn: async () => {
      const { data } = await apolloClient.query({
        query: GQL_QUERIES.GET_PRODUCTS_QUERY,
        variables: {
          page,
          limit,
          ...filters,
        },
        fetchPolicy: 'cache-first',
      });
      return data.products;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes - data stays fresh
    gcTime: 1000 * 60 * 30, // 30 minutes - cache retention
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

// Infinite scroll version of useProducts
export function useInfiniteProducts(limit: number = 20, filters?: ProductFilters) {
  return useInfiniteQuery({
    queryKey: ['infiniteProducts', limit, filters],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await apolloClient.query({
        query: GQL_QUERIES.GET_PRODUCTS_QUERY,
        variables: {
          page: pageParam,
          limit,
          ...filters,
        },
        fetchPolicy: 'cache-first',
      });
      return data.products;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const currentPage = allPages.length;
      const totalPages = lastPage?.pagination?.pages || 1;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data } = await apolloClient.query({
        query: GQL_QUERIES.GET_PRODUCT_QUERY,
        variables: { id },
        fetchPolicy: 'cache-first',
      });

      return data.product;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

// ============== CATEGORY HOOKS ==============
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await apolloClient.query({
        query: GQL_QUERIES.GET_CATEGORIES_QUERY,
        variables: {
          filter: { isActive: true },
        },
        fetchPolicy: 'cache-first',
      });

      return data.categories?.data || [];
    },
    staleTime: 1000 * 60 * 30,
  });
}

// ============== AUTH HOOKS ==============
export function useLogin() {
  const queryClient = useQueryClient();
  const setUserProfile = useCartStore((state) => state.setUserProfile);

  const mutation = useMutation({
    mutationFn: async (input: { email: string; password: string }) => {
      const { data } = await apolloClient.mutate({
        mutation: GQL_QUERIES.LOGIN_MUTATION,
        variables: { input },
      });

      if (!data?.login) {
        throw new Error('Login failed');
      }

      return data.login;
    },
    onSuccess: async (data) => {
      // Store tokens
      await setAuthToken(data.accessToken);
      await AsyncStorage.setItem('refreshToken', data.refreshToken);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));

      // Update store
      setUserProfile({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name || data.user.email.split('@')[0],
        phone: data.user.phone,
        addresses: [],
      });

      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.setQueryData(['me'], data.user);
    },
  });

  return {
    login: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}

export function useRegister() {
  const queryClient = useQueryClient();
  const setUserProfile = useCartStore((state) => state.setUserProfile);

  const mutation = useMutation({
    mutationFn: async (input: { email: string; password: string; name: string }) => {
      const { data } = await apolloClient.mutate({
        mutation: GQL_QUERIES.REGISTER_MUTATION,
        variables: { input },
      });

      if (!data?.register) {
        throw new Error('Registration failed');
      }

      return data.register;
    },
    onSuccess: async (data) => {
      await setAuthToken(data.accessToken);
      await AsyncStorage.setItem('refreshToken', data.refreshToken);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));

      setUserProfile({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name || data.user.email.split('@')[0],
        addresses: [],
      });

      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.setQueryData(['me'], data.user);
    },
  });

  return {
    register: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}

export function useLogout() {
  const queryClient = useQueryClient();
  const clearUser = useCartStore((state) => state.clearUser);

  const mutation = useMutation({
    mutationFn: async () => {
      try {
        await apolloClient.mutate({
          mutation: GQL_QUERIES.LOGOUT_MUTATION,
        });
      } catch (e) {
        // Ignore errors, just clear local state
      }
    },
    onSuccess: async () => {
      await clearAuthToken();
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('user');
      clearUser();
      queryClient.clear();
      // Reset Apollo cache to clear any cached user data
      await apolloClient.resetStore().catch(() => {});
    },
  });

  return {
    logout: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      try {
        const { data } = await apolloClient.query({
          query: GQL_QUERIES.GET_ME_QUERY,
          fetchPolicy: 'network-only',
        });

        return data.me;
      } catch (error: any) {
        // Check if it's an authentication error
        const isAuthError =
          error?.graphQLErrors?.some(
            (e: any) =>
              e.extensions?.code === 'UNAUTHENTICATED' || e.message?.includes('Not authenticated')
          ) || error?.message?.includes('Not authenticated');

        if (isAuthError) {
          // Clear auth state and throw to trigger redirect
          await clearAuthToken();
          throw new Error('Not authenticated');
        }
        throw error;
      }
    },
    retry: false,
  });
}

// ============== ORDER HOOKS ==============
export function useOrders(customerId?: string) {
  return useQuery({
    queryKey: ['orders', customerId],
    queryFn: async () => {
      const { data } = await apolloClient.query({
        query: GQL_QUERIES.GET_ORDERS_BY_CUSTOMER_QUERY,
        variables: { customerId },
        fetchPolicy: 'network-only',
      });

      return data.ordersByCustomer;
    },
    enabled: !!customerId,
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const { data } = await apolloClient.query({
        query: GQL_QUERIES.GET_ORDER_QUERY,
        variables: { id },
        fetchPolicy: 'network-only',
      });

      return data.order;
    },
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const clearCart = useCartStore((state) => state.clearCart);

  const mutation = useMutation({
    mutationFn: async (input: any) => {
      const { data } = await apolloClient.mutate({
        mutation: GQL_QUERIES.CREATE_ORDER_MUTATION,
        variables: { input },
      });

      if (!data?.createOrder) {
        throw new Error('Failed to create order');
      }

      return data.createOrder;
    },
    onSuccess: () => {
      clearCart();
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  return {
    createOrder: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (orderId: string) => {
      const { data } = await apolloClient.mutate({
        mutation: GQL_QUERIES.CANCEL_ORDER_MUTATION,
        variables: { id: orderId },
      });

      if (!data?.cancelOrder) {
        throw new Error('Failed to cancel order');
      }

      return data.cancelOrder;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', data.id] });
    },
  });

  return {
    cancelOrder: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}

// ============== REVIEW HOOKS ==============
export function useProductReviews(productId: string, page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ['reviews', productId, page, limit],
    queryFn: async () => {
      const { data } = await apolloClient.query({
        query: GQL_QUERIES.GET_PRODUCT_REVIEWS_QUERY,
        variables: { productId, page, limit },
        fetchPolicy: 'cache-first',
      });

      return data.productReviews;
    },
    enabled: !!productId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (input: {
      productId: string;
      rating: number;
      title: string;
      comment: string;
    }) => {
      const { data } = await apolloClient.mutate({
        mutation: GQL_QUERIES.CREATE_REVIEW_MUTATION,
        variables: { input },
      });

      return data.createReview;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.productId] });
    },
  });

  return {
    createReview: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}

// ============== COUPON HOOKS ==============
export function useValidateCoupon() {
  const mutation = useMutation({
    mutationFn: async ({ code, orderTotal }: { code: string; orderTotal: number }) => {
      const { data } = await apolloClient.query({
        query: GQL_QUERIES.VALIDATE_COUPON_QUERY,
        variables: { code, orderTotal },
        fetchPolicy: 'network-only',
      });

      return data.validateCoupon;
    },
  });

  return {
    validateCoupon: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    data: mutation.data,
  };
}

// ============== ADDRESS HOOKS ==============
export function useAddresses() {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const { data } = await apolloClient.query({
        query: GQL_QUERIES.GET_MY_ADDRESSES_QUERY,
        fetchPolicy: 'network-only',
      });

      return data.myAddresses?.addresses || [];
    },
  });
}

export function useAddAddress() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (input: any) => {
      const { data } = await apolloClient.mutate({
        mutation: GQL_QUERIES.ADD_ADDRESS_MUTATION,
        variables: { input },
      });

      return data.addAddress;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });

  return {
    addAddress: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id, input }: { id: string; input: any }) => {
      const { data } = await apolloClient.mutate({
        mutation: GQL_QUERIES.UPDATE_ADDRESS_MUTATION,
        variables: { id, input },
      });

      return data.updateAddress;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });

  return {
    updateAddress: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apolloClient.mutate({
        mutation: GQL_QUERIES.DELETE_ADDRESS_MUTATION,
        variables: { id },
      });

      return data.deleteAddress;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });

  return {
    deleteAddress: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apolloClient.mutate({
        mutation: GQL_QUERIES.SET_DEFAULT_ADDRESS_MUTATION,
        variables: { id },
      });

      return data.setDefaultAddress;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });

  return {
    setDefaultAddress: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}

// ============== PROFILE HOOKS ==============
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setUserProfile = useCartStore((state) => state.setUserProfile);

  const mutation = useMutation({
    mutationFn: async (input: { name?: string; phone?: string }) => {
      const { data } = await apolloClient.mutate({
        mutation: GQL_QUERIES.UPDATE_PROFILE_MUTATION,
        variables: { input },
      });

      if (!data?.updateProfile) {
        throw new Error('Failed to update profile');
      }

      return data.updateProfile;
    },
    onSuccess: async (data) => {
      if (data.success && data.user) {
        // Update stored user
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          const updatedUser = { ...parsedUser, ...data.user };
          await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        }

        // Update store
        setUserProfile({
          id: data.user.id,
          email: data.user.email,
          name: data.user.name || data.user.email.split('@')[0],
          phone: data.user.phone,
          addresses: [],
        });

        queryClient.invalidateQueries({ queryKey: ['me'] });
        queryClient.setQueryData(['me'], data.user);
      }
    },
  });

  return {
    updateProfile: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
  };
}

export function useChangePassword() {
  const mutation = useMutation({
    mutationFn: async (input: { currentPassword: string; newPassword: string }) => {
      const { data } = await apolloClient.mutate({
        mutation: GQL_QUERIES.CHANGE_PASSWORD_MUTATION,
        variables: { input },
      });

      if (!data?.changePassword?.success) {
        throw new Error(data?.changePassword?.message || 'Failed to change password');
      }

      return data.changePassword;
    },
  });

  return {
    changePassword: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}

// ============== EMAIL VERIFICATION HOOKS ==============
export function useSendVerificationEmail() {
  const mutation = useMutation({
    mutationFn: async (source: string = 'mobile') => {
      const { data } = await apolloClient.mutate({
        mutation: GQL_QUERIES.SEND_VERIFICATION_EMAIL_MUTATION,
        variables: { source },
      });

      if (!data?.sendVerificationEmail) {
        throw new Error('Failed to send verification email');
      }

      return data.sendVerificationEmail;
    },
  });

  return {
    sendVerificationEmail: (source?: string) => mutation.mutateAsync(source || 'mobile'),
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
  };
}

export function useVerifyEmail() {
  const queryClient = useQueryClient();
  const setUserProfile = useCartStore((state) => state.setUserProfile);

  const mutation = useMutation({
    mutationFn: async () => {
      const { data } = await apolloClient.mutate({
        mutation: GQL_QUERIES.VERIFY_EMAIL_MUTATION,
      });

      if (!data?.verifyEmail) {
        throw new Error('Failed to verify email');
      }

      return data.verifyEmail;
    },
    onSuccess: async (data) => {
      if (data.success && data.user) {
        // Update stored user
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          const updatedUser = { ...parsedUser, ...data.user };
          await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        }

        // Update store
        setUserProfile({
          id: data.user.id,
          email: data.user.email,
          name: data.user.name || data.user.email.split('@')[0],
          addresses: [],
        });

        queryClient.invalidateQueries({ queryKey: ['me'] });
        queryClient.setQueryData(['me'], data.user);
      }
    },
  });

  return {
    verifyEmail: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
  };
}

// ============== PASSWORD RESET HOOKS ==============
export function useForgotPassword() {
  const mutation = useMutation({
    mutationFn: async ({ email, domain }: { email: string; domain: string }) => {
      const { data } = await apolloClient.mutate({
        mutation: GQL_QUERIES.FORGOT_PASSWORD_MUTATION,
        variables: { email, domain },
      });

      if (!data?.forgotPassword) {
        throw new Error('Failed to process password reset request');
      }

      return data.forgotPassword;
    },
  });

  return {
    forgotPassword: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
  };
}

export function useResetPassword() {
  const mutation = useMutation({
    mutationFn: async ({
      token,
      password,
      confirmPassword,
    }: {
      token: string;
      password: string;
      confirmPassword: string;
    }) => {
      const { data } = await apolloClient.mutate({
        mutation: GQL_QUERIES.RESET_PASSWORD_MUTATION,
        variables: { token, password, confirmPassword },
      });

      if (!data?.resetPassword) {
        throw new Error('Failed to reset password');
      }

      return data.resetPassword;
    },
  });

  return {
    resetPassword: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
  };
}

export function useValidateResetToken(token: string | null) {
  const query = useQuery({
    queryKey: ['validateResetToken', token],
    queryFn: async () => {
      if (!token) {
        return { success: false, message: 'No token provided', email: null };
      }

      const { data } = await apolloClient.query({
        query: GQL_QUERIES.VALIDATE_RESET_TOKEN_QUERY,
        variables: { token },
        fetchPolicy: 'network-only',
      });

      if (!data?.validateResetToken) {
        throw new Error('Failed to validate token');
      }

      return data.validateResetToken;
    },
    enabled: !!token,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    isValid: query.data?.success ?? false,
    email: query.data?.email ?? null,
  };
}
