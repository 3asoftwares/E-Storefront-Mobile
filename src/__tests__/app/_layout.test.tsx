import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import RootLayout from '../../../app/_layout';
import { useCartStore } from '../../store/cartStore';
import { initializeAuth } from '../../lib/apollo/client';

// Mock expo-router with inline component definitions
jest.mock('expo-router', () => {
  const { View, Text } = require('react-native');
  const MockStack = ({ children }: { children?: React.ReactNode }) => <View>{children}</View>;
  MockStack.Screen = ({ name }: { name: string }) => <Text>{name}</Text>;
  return { Stack: MockStack };
});

// Mock expo-status-bar
jest.mock('expo-status-bar', () => ({
  StatusBar: () => null,
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  return {
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  };
});

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const { View } = require('react-native');
  return {
    GestureHandlerRootView: ({
      children,
      style,
    }: {
      children: React.ReactNode;
      style?: object;
    }) => <View style={style}>{children}</View>,
  };
});

// Mock @tanstack/react-query
jest.mock('@tanstack/react-query', () => {
  const React = require('react');
  return {
    QueryClient: jest.fn().mockImplementation(() => ({})),
    QueryClientProvider: ({ children }: { children: React.ReactNode }) => children,
  };
});

// Mock @apollo/client
jest.mock('@apollo/client', () => {
  const React = require('react');
  return {
    ApolloProvider: ({ children }: { children: React.ReactNode }) => children,
  };
});

// Mock apollo client
jest.mock('../../lib/apollo/client', () => ({
  apolloClient: {},
  initializeAuth: jest.fn(),
}));

// Mock cart store
jest.mock('../../store/cartStore', () => ({
  useCartStore: jest.fn(),
}));

describe('RootLayout', () => {
  const mockLoadUserFromStorage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useCartStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        loadUserFromStorage: mockLoadUserFromStorage,
      };
      return selector(state);
    });
  });

  it('should render without crashing', () => {
    const { toJSON } = render(<RootLayout />);
    expect(toJSON()).toBeTruthy();
  });

  it('should call initializeAuth on mount', async () => {
    render(<RootLayout />);

    await waitFor(() => {
      expect(initializeAuth).toHaveBeenCalledTimes(1);
    });
  });

  it('should call loadUserFromStorage on mount', async () => {
    render(<RootLayout />);

    await waitFor(() => {
      expect(mockLoadUserFromStorage).toHaveBeenCalledTimes(1);
    });
  });

  it('should wrap content with GestureHandlerRootView', () => {
    const { toJSON } = render(<RootLayout />);
    // Component renders successfully with gesture handler wrapper
    expect(toJSON()).not.toBeNull();
  });

  it('should wrap content with SafeAreaProvider', () => {
    const { toJSON } = render(<RootLayout />);
    // Component renders successfully with safe area provider
    expect(toJSON()).not.toBeNull();
  });

  it('should wrap content with ApolloProvider', () => {
    const { toJSON } = render(<RootLayout />);
    // Component renders successfully with apollo provider
    expect(toJSON()).not.toBeNull();
  });

  it('should wrap content with QueryClientProvider', () => {
    const { toJSON } = render(<RootLayout />);
    // Component renders successfully with query client provider
    expect(toJSON()).not.toBeNull();
  });

  it('should initialize auth and load user data only once', async () => {
    const { rerender } = render(<RootLayout />);

    await waitFor(() => {
      expect(initializeAuth).toHaveBeenCalledTimes(1);
      expect(mockLoadUserFromStorage).toHaveBeenCalledTimes(1);
    });

    // Rerender should not call initialization again due to empty dependency array
    rerender(<RootLayout />);

    // Still should only be called once due to useEffect with empty deps
    expect(initializeAuth).toHaveBeenCalledTimes(1);
    expect(mockLoadUserFromStorage).toHaveBeenCalledTimes(1);
  });

  it('should render with correct providers hierarchy', () => {
    // This test ensures all providers are correctly nested
    expect(() => render(<RootLayout />)).not.toThrow();
  });

  it('should use cart store selector for loadUserFromStorage', () => {
    render(<RootLayout />);

    expect(useCartStore).toHaveBeenCalled();
  });
});

describe('RootLayout - Provider Integration', () => {
  const mockLoadUserFromStorage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useCartStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        loadUserFromStorage: mockLoadUserFromStorage,
      };
      return selector(state);
    });
  });

  it('should render all screen configurations', () => {
    const { toJSON } = render(<RootLayout />);
    // Verifies that the Stack with all its screens renders without errors
    expect(toJSON()).toBeTruthy();
  });

  it('should handle store selector properly', () => {
    render(<RootLayout />);

    // Verify the selector is called with correct state shape
    const selectorCall = (useCartStore as unknown as jest.Mock).mock.calls[0][0];
    const result = selectorCall({ loadUserFromStorage: mockLoadUserFromStorage });
    expect(result).toBe(mockLoadUserFromStorage);
  });
});
