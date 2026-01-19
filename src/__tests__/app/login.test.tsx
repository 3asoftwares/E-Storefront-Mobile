import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import LoginScreen from '../../../app/login';
import { useLogin } from '../../lib/hooks';

// Mock dependencies
jest.mock('expo-router', () => ({
  router: {
    back: jest.fn(),
    replace: jest.fn(),
  },
  useLocalSearchParams: () => ({}),
}));

jest.mock('../../lib/hooks', () => ({
  useLogin: jest.fn(),
}));

jest.spyOn(Alert, 'alert');

describe('LoginScreen', () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useLogin as jest.Mock).mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: null,
    });
  });

  it('should render login screen correctly', () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);

    expect(getByText('Welcome Back')).toBeTruthy();
    expect(getByText('Sign in to continue shopping')).toBeTruthy();
    expect(getByPlaceholderText('Enter your email')).toBeTruthy();
    expect(getByPlaceholderText('Enter your password')).toBeTruthy();
  });

  it('should handle email input', () => {
    const { getByPlaceholderText } = render(<LoginScreen />);
    const emailInput = getByPlaceholderText('Enter your email');

    fireEvent.changeText(emailInput, 'test@example.com');
    expect(emailInput.props.value).toBe('test@example.com');
  });

  it('should handle password input', () => {
    const { getByPlaceholderText } = render(<LoginScreen />);
    const passwordInput = getByPlaceholderText('Enter your password');

    fireEvent.changeText(passwordInput, 'password123');
    expect(passwordInput.props.value).toBe('password123');
  });

  it('should show validation error for empty email', async () => {
    const { getByText } = render(<LoginScreen />);
    const loginButton = getByText('Sign In');

    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(getByText('Email is required')).toBeTruthy();
    });
  });

  it('should show validation error for invalid email', async () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
    const emailInput = getByPlaceholderText('Enter your email');
    const loginButton = getByText('Sign In');

    fireEvent.changeText(emailInput, 'invalid-email');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(getByText('Please enter a valid email')).toBeTruthy();
    });
  });

  it('should show validation error for empty password', async () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
    const emailInput = getByPlaceholderText('Enter your email');
    const loginButton = getByText('Sign In');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(getByText('Password is required')).toBeTruthy();
    });
  });

  it('should show validation error for short password', async () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');
    const loginButton = getByText('Sign In');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, '12345');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(getByText('Password must be at least 6 characters')).toBeTruthy();
    });
  });

  it('should call login function with valid credentials', async () => {
    mockLogin.mockResolvedValue({});
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');
    const loginButton = getByText('Sign In');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('should navigate to tabs after successful login', async () => {
    mockLogin.mockResolvedValue({});
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');
    const loginButton = getByText('Sign In');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith('/(tabs)');
    });
  });

  it('should show alert on login error', async () => {
    mockLogin.mockRejectedValue(new Error('Invalid credentials'));
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');
    const loginButton = getByText('Sign In');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'wrongpassword');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Login Failed', 'Invalid credentials');
    });
  });

  it('should navigate back when back button is pressed', () => {
    const { getByText } = render(<LoginScreen />);
    const backButton = getByText('Back');

    fireEvent.press(backButton);
    expect(router.back).toHaveBeenCalled();
  });

  it('should disable button while loading', () => {
    (useLogin as jest.Mock).mockReturnValue({
      login: mockLogin,
      isLoading: true,
      error: null,
    });

    const { queryByText, UNSAFE_getByType } = render(<LoginScreen />);

    // When loading, "Sign In" text should not appear (replaced with ActivityIndicator)
    expect(queryByText('Sign In')).toBeNull();
  });
});
