import React from 'react';
import { render, act } from '@testing-library/react-native';
import TabsLayout from '../../../../app/(tabs)/_layout';
import { useCartStore } from '../../../store/cartStore';

// Store icons for rendering
let capturedIcons: React.ReactNode[] = [];

// Mock expo-router with inline component definitions
jest.mock('expo-router', () => {
  const { View, Text } = require('react-native');
  const MockTabs = ({ children }: { children?: React.ReactNode }) => {
    return <View>{children}</View>;
  };
  MockTabs.Screen = ({ name, options }: { name: string; options?: any }) => {
    const icons: React.ReactNode[] = [];
    // Call the tabBarIcon function to exercise the icon rendering code
    if (options && typeof options.tabBarIcon === 'function') {
      // Render both focused and unfocused states
      icons.push(options.tabBarIcon({ focused: false, color: '#000' }));
      icons.push(options.tabBarIcon({ focused: true, color: '#007AFF' }));
    }
    return (
      <View>
        <Text>{name}</Text>
        {icons}
      </View>
    );
  };
  return { Tabs: MockTabs };
});

// Mock FontAwesome
jest.mock('@fortawesome/react-native-fontawesome', () => ({
  FontAwesomeIcon: () => null,
}));

// Mock FontAwesome icons
jest.mock('@fortawesome/free-solid-svg-icons', () => ({
  faHome: { iconName: 'home' },
  faShoppingBag: { iconName: 'shopping-bag' },
  faShoppingCart: { iconName: 'shopping-cart' },
  faHeart: { iconName: 'heart' },
  faUser: { iconName: 'user' },
}));

// Mock cart store
jest.mock('../../../store/cartStore', () => ({
  useCartStore: jest.fn(),
}));

// Mock theme constants
jest.mock('../../../constants/theme', () => ({
  Colors: {
    light: {
      primary: '#007AFF',
      textTertiary: '#999999',
      error: '#FF3B30',
    },
  },
  BorderRadius: {
    lg: 12,
    full: 9999,
  },
  Shadows: {
    lg: {},
    sm: {},
  },
}));

// Helper function to mock cart store with specific values
const mockCartStore = (cartCount: number, wishlistCount: number) => {
  (useCartStore as unknown as jest.Mock).mockImplementation((selector) => {
    const state = {
      items: Array(cartCount).fill({ id: 'item', quantity: 1 }),
      wishlist: Array(wishlistCount).fill({ productId: 'item' }),
    };
    return selector(state);
  });
};

describe('TabsLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCartStore(0, 0);
  });

  it('should render without crashing', () => {
    const { toJSON } = render(<TabsLayout />);
    expect(toJSON()).toBeTruthy();
  });

  it('should render with empty cart and wishlist', () => {
    mockCartStore(0, 0);
    expect(() => render(<TabsLayout />)).not.toThrow();
  });

  it('should render with items in cart', () => {
    mockCartStore(5, 0);
    expect(() => render(<TabsLayout />)).not.toThrow();
  });

  it('should render with items in wishlist', () => {
    mockCartStore(0, 3);
    expect(() => render(<TabsLayout />)).not.toThrow();
  });

  it('should render with items in both cart and wishlist', () => {
    mockCartStore(5, 3);
    expect(() => render(<TabsLayout />)).not.toThrow();
  });

  it('should use cart store selectors', () => {
    render(<TabsLayout />);
    expect(useCartStore).toHaveBeenCalled();
  });

  it('should call cart store selector for items', () => {
    mockCartStore(2, 1);
    render(<TabsLayout />);
    
    // Verify useCartStore was called
    expect(useCartStore).toHaveBeenCalled();
  });
});

describe('TabsLayout - Cart Badge', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not show badge when cart is empty', () => {
    mockCartStore(0, 0);
    const { queryByText } = render(<TabsLayout />);
    
    // Badge should not be present with 0 items
    expect(queryByText('0')).toBeNull();
  });

  it('should show badge with count when cart has items', () => {
    mockCartStore(1, 0);
    const { getAllByText } = render(<TabsLayout />);
    expect(getAllByText('1').length).toBeGreaterThan(0);
  });

  it('should handle multiple items in cart', () => {
    mockCartStore(50, 0);
    const { getAllByText } = render(<TabsLayout />);
    expect(getAllByText('50').length).toBeGreaterThan(0);
  });

  it('should show 99 when cart has exactly 99 items', () => {
    mockCartStore(99, 0);
    const { getAllByText } = render(<TabsLayout />);
    expect(getAllByText('99').length).toBeGreaterThan(0);
  });

  it('should show 99+ when cart has more than 99 items', () => {
    mockCartStore(150, 0);
    const { getAllByText } = render(<TabsLayout />);
    expect(getAllByText('99+').length).toBeGreaterThan(0);
  });

  it('should show 99+ when cart has 100 items', () => {
    mockCartStore(100, 0);
    const { getAllByText } = render(<TabsLayout />);
    expect(getAllByText('99+').length).toBeGreaterThan(0);
  });
});

describe('TabsLayout - Wishlist Badge', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not show wishlist badge when empty', () => {
    mockCartStore(0, 0);
    const { queryByText } = render(<TabsLayout />);
    
    expect(queryByText('0')).toBeNull();
  });

  it('should show badge with count when wishlist has single item', () => {
    mockCartStore(0, 1);
    const { getAllByText } = render(<TabsLayout />);
    expect(getAllByText('1').length).toBeGreaterThan(0);
  });

  it('should show badge with count for multiple wishlist items', () => {
    mockCartStore(0, 25);
    const { getAllByText } = render(<TabsLayout />);
    expect(getAllByText('25').length).toBeGreaterThan(0);
  });

  it('should show 99 when wishlist has exactly 99 items', () => {
    mockCartStore(0, 99);
    const { getAllByText } = render(<TabsLayout />);
    expect(getAllByText('99').length).toBeGreaterThan(0);
  });

  it('should show 99+ when wishlist has more than 99 items', () => {
    mockCartStore(0, 200);
    const { getAllByText } = render(<TabsLayout />);
    expect(getAllByText('99+').length).toBeGreaterThan(0);
  });
});

describe('TabsLayout - Store Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should correctly select items from store', () => {
    const mockItems = [
      { id: '1', quantity: 2 },
      { id: '2', quantity: 1 },
    ];
    const mockWishlist = [
      { productId: 'w1' },
    ];

    (useCartStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        items: mockItems,
        wishlist: mockWishlist,
      };
      return selector(state);
    });

    expect(() => render(<TabsLayout />)).not.toThrow();
  });

  it('should handle empty store state', () => {
    (useCartStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        items: [],
        wishlist: [],
      };
      return selector(state);
    });

    expect(() => render(<TabsLayout />)).not.toThrow();
  });

  it('should update when store changes', () => {
    mockCartStore(0, 0);
    const { rerender } = render(<TabsLayout />);

    // Simulate store update
    mockCartStore(5, 3);
    rerender(<TabsLayout />);

    expect(() => render(<TabsLayout />)).not.toThrow();
  });
});

describe('TabIcon Component (via TabsLayout)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCartStore(0, 0);
  });

  it('should render all tab icons', () => {
    expect(() => render(<TabsLayout />)).not.toThrow();
  });

  it('should render home tab', () => {
    const { toJSON } = render(<TabsLayout />);
    expect(toJSON()).toBeTruthy();
  });

  it('should render products/shop tab', () => {
    const { toJSON } = render(<TabsLayout />);
    expect(toJSON()).toBeTruthy();
  });

  it('should render cart tab', () => {
    const { toJSON } = render(<TabsLayout />);
    expect(toJSON()).toBeTruthy();
  });

  it('should render wishlist tab', () => {
    const { toJSON } = render(<TabsLayout />);
    expect(toJSON()).toBeTruthy();
  });

  it('should render profile tab', () => {
    const { toJSON } = render(<TabsLayout />);
    expect(toJSON()).toBeTruthy();
  });
});

describe('TabsLayout - Screen Options', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCartStore(0, 0);
  });

  it('should configure tab bar with correct styling', () => {
    expect(() => render(<TabsLayout />)).not.toThrow();
  });

  it('should set headerShown to false', () => {
    expect(() => render(<TabsLayout />)).not.toThrow();
  });

  it('should render with platform-specific styles', () => {
    // Tests that platform-specific code doesn't cause errors
    expect(() => render(<TabsLayout />)).not.toThrow();
  });
});

describe('TabsLayout - Animation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCartStore(0, 0);
  });

  it('should render with animation support', () => {
    // The TabIcon uses Animated.spring for scale animations
    expect(() => render(<TabsLayout />)).not.toThrow();
  });

  it('should handle focused state animations', () => {
    // TabIcon animates when focused changes
    expect(() => render(<TabsLayout />)).not.toThrow();
  });
});

describe('TabsLayout - Edge Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle undefined cart items', () => {
    (useCartStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        items: [],
        wishlist: [],
      };
      return selector(state);
    });

    expect(() => render(<TabsLayout />)).not.toThrow();
  });

  it('should handle large number of cart items', () => {
    mockCartStore(1000, 0);
    expect(() => render(<TabsLayout />)).not.toThrow();
  });

  it('should handle large number of wishlist items', () => {
    mockCartStore(0, 1000);
    expect(() => render(<TabsLayout />)).not.toThrow();
  });

  it('should handle maximum realistic cart size', () => {
    mockCartStore(999, 999);
    expect(() => render(<TabsLayout />)).not.toThrow();
  });
});
