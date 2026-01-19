import '@testing-library/jest-native/extend-expect';

// ============== MOCK HOOKS MODULE ==============
// Create reusable mock functions for hooks
const mockHooks = {
  useProducts: jest.fn(() => ({
    data: { products: [] },
    isLoading: false,
    error: null,
    refetch: jest.fn(),
    isRefetching: false,
  })),
  useInfiniteProducts: jest.fn(() => ({
    data: { pages: [] },
    isLoading: false,
    error: null,
    fetchNextPage: jest.fn(),
    hasNextPage: false,
    isFetchingNextPage: false,
  })),
  useProduct: jest.fn(() => ({
    data: null,
    isLoading: false,
    error: null,
  })),
  useCategories: jest.fn(() => ({
    data: [],
    isLoading: false,
    error: null,
    refetch: jest.fn(),
  })),
  useLogin: jest.fn(() => ({
    login: jest.fn(),
    isLoading: false,
    error: null,
    isSuccess: false,
  })),
  useRegister: jest.fn(() => ({
    register: jest.fn(),
    isLoading: false,
    error: null,
    isSuccess: false,
  })),
  useLogout: jest.fn(() => ({
    logout: jest.fn(),
    isLoading: false,
  })),
  useCurrentUser: jest.fn(() => ({
    data: null,
    isLoading: false,
    error: null,
  })),
  useOrders: jest.fn(() => ({
    data: [],
    isLoading: false,
    error: null,
  })),
  useOrder: jest.fn(() => ({
    data: null,
    isLoading: false,
    error: null,
  })),
  useCreateOrder: jest.fn(() => ({
    createOrder: jest.fn(),
    isLoading: false,
    error: null,
    isSuccess: false,
  })),
  useCancelOrder: jest.fn(() => ({
    cancelOrder: jest.fn(),
    isLoading: false,
    error: null,
    isSuccess: false,
  })),
  useProductReviews: jest.fn(() => ({
    data: null,
    isLoading: false,
    error: null,
  })),
  useCreateReview: jest.fn(() => ({
    createReview: jest.fn(),
    isLoading: false,
    error: null,
  })),
  useValidateCoupon: jest.fn(() => ({
    validateCoupon: jest.fn(),
    isLoading: false,
    error: null,
    data: null,
  })),
  useAddresses: jest.fn(() => ({
    data: [],
    isLoading: false,
    error: null,
  })),
  useAddAddress: jest.fn(() => ({
    addAddress: jest.fn(),
    isLoading: false,
    error: null,
  })),
  useUpdateAddress: jest.fn(() => ({
    updateAddress: jest.fn(),
    isLoading: false,
    error: null,
  })),
  useDeleteAddress: jest.fn(() => ({
    deleteAddress: jest.fn(),
    isLoading: false,
    error: null,
  })),
  useSetDefaultAddress: jest.fn(() => ({
    setDefaultAddress: jest.fn(),
    isLoading: false,
    error: null,
  })),
  useUpdateProfile: jest.fn(() => ({
    updateProfile: jest.fn(),
    isLoading: false,
    error: null,
    isSuccess: false,
    data: null,
  })),
  useChangePassword: jest.fn(() => ({
    changePassword: jest.fn(),
    isLoading: false,
    error: null,
    isSuccess: false,
  })),
  useSendVerificationEmail: jest.fn(() => ({
    sendVerificationEmail: jest.fn(),
    isLoading: false,
    error: null,
    isSuccess: false,
    data: null,
  })),
  useVerifyEmail: jest.fn(() => ({
    verifyEmail: jest.fn(),
    isLoading: false,
    error: null,
    isSuccess: false,
    data: null,
  })),
  useForgotPassword: jest.fn(() => ({
    forgotPassword: jest.fn(),
    isLoading: false,
    error: null,
    isSuccess: false,
    data: null,
  })),
  useResetPassword: jest.fn(() => ({
    resetPassword: jest.fn(),
    isLoading: false,
    error: null,
    isSuccess: false,
    data: null,
  })),
  useValidateResetToken: jest.fn(() => ({
    data: null,
    isLoading: false,
    error: null,
    isValid: false,
    email: null,
  })),
};

// Mock hooks using multiple path variations to ensure they're caught
jest.mock('../src/lib/hooks', () => mockHooks, { virtual: true });
jest.mock('../../src/lib/hooks', () => mockHooks, { virtual: true });

// ============== MOCK CART STORE ==============
const mockCartStore = {
  items: [],
  wishlist: [],
  recentlyViewed: [],
  recentSearches: [],
  userProfile: null,
  addToCart: jest.fn(),
  removeFromCart: jest.fn(),
  updateQuantity: jest.fn(),
  clearCart: jest.fn(),
  toggleWishlistItem: jest.fn(),
  addToRecentlyViewed: jest.fn(),
  addRecentSearch: jest.fn(),
  clearRecentSearches: jest.fn(),
  setUserProfile: jest.fn(),
  clearUser: jest.fn(),
};

jest.mock(
  '../src/store/cartStore',
  () => ({
    useCartStore: jest.fn((selector) => (selector ? selector(mockCartStore) : mockCartStore)),
  }),
  { virtual: true }
);

jest.mock(
  '../../src/store/cartStore',
  () => ({
    useCartStore: jest.fn((selector) => (selector ? selector(mockCartStore) : mockCartStore)),
  }),
  { virtual: true }
);

// Export mocks for test files to use
global.__mockHooks = mockHooks;
global.__mockCartStore = mockCartStore;

// Mock expo modules
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  useSegments: () => [],
  Link: 'Link',
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
  WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'WHEN_UNLOCKED_THIS_DEVICE_ONLY',
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

jest.mock('expo-constants', () => ({
  expoConfig: {
    slug: 'test-app',
    version: '1.0.0',
  },
}));

// Mock FontAwesome icons
jest.mock('@fortawesome/react-native-fontawesome', () => ({
  FontAwesomeIcon: 'FontAwesomeIcon',
}));

jest.mock('@fortawesome/free-solid-svg-icons', () => ({
  faEye: 'faEye',
  faEyeSlash: 'faEyeSlash',
  faCircleXmark: 'faCircleXmark',
}));

// Silence the warning: Animated: `useNativeDriver` is not supported
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock performance.now for consistent testing
if (typeof performance === 'undefined') {
  global.performance = {
    now: jest.fn(() => Date.now()),
  };
}

// Mock requestAnimationFrame
global.requestAnimationFrame = (callback) => setTimeout(callback, 16);
global.cancelAnimationFrame = (id) => clearTimeout(id);

// Mock console.warn and console.error to reduce noise in tests
const originalWarn = console.warn;
const originalError = console.error;

beforeAll(() => {
  console.warn = (...args) => {
    if (args[0]?.includes?.('Animated:')) return;
    if (args[0]?.includes?.('componentWillReceiveProps')) return;
    if (args[0]?.includes?.('componentWillMount')) return;
    originalWarn.call(console, ...args);
  };
  console.error = (...args) => {
    if (args[0]?.includes?.('Warning:')) return;
    if (args[0]?.includes?.('act(...)')) return;
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.warn = originalWarn;
  console.error = originalError;
});
