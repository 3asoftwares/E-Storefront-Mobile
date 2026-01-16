import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import ForgotPasswordScreen from '../../../app/forgot-password';
import { router } from 'expo-router';

const mockForgotPassword = jest.fn();

// Mock dependencies
jest.mock('expo-router', () => ({
    router: {
        back: jest.fn(),
    },
    Stack: {
        Screen: () => null,
    },
}));

jest.mock('../../lib/hooks', () => ({
    useForgotPassword: () => ({
        forgotPassword: mockForgotPassword,
        isLoading: false,
        error: null,
    }),
}));

jest.spyOn(Alert, 'alert');

describe('ForgotPasswordScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockForgotPassword.mockResolvedValue({ success: true });
    });

    it('should render forgot password screen', () => {
        const { getByText, getByPlaceholderText } = render(<ForgotPasswordScreen />);

        expect(getByText('Forgot Password?')).toBeTruthy();
        expect(getByPlaceholderText('Enter your email')).toBeTruthy();
    });

    it('should handle email input', () => {
        const { getByPlaceholderText } = render(<ForgotPasswordScreen />);
        const emailInput = getByPlaceholderText('Enter your email');

        fireEvent.changeText(emailInput, 'test@example.com');
        expect(emailInput.props.value).toBe('test@example.com');
    });

    it('should show validation error for empty email', async () => {
        const { getByText } = render(<ForgotPasswordScreen />);
        const resetButton = getByText('Send Reset Link');

        fireEvent.press(resetButton);

        await waitFor(() => {
            expect(getByText('Email is required')).toBeTruthy();
        });
    });

    it('should show validation error for invalid email', async () => {
        const { getByText, getByPlaceholderText } = render(<ForgotPasswordScreen />);
        const emailInput = getByPlaceholderText('Enter your email');
        const resetButton = getByText('Send Reset Link');

        fireEvent.changeText(emailInput, 'invalid-email');
        fireEvent.press(resetButton);

        await waitFor(() => {
            expect(getByText('Please enter a valid email')).toBeTruthy();
        });
    });

    it('should call forgotPassword with valid email', async () => {
        const { getByText, getByPlaceholderText } = render(<ForgotPasswordScreen />);
        const emailInput = getByPlaceholderText('Enter your email');
        const resetButton = getByText('Send Reset Link');

        fireEvent.changeText(emailInput, 'test@example.com');
        fireEvent.press(resetButton);

        await waitFor(() => {
            expect(mockForgotPassword).toHaveBeenCalledWith({
                email: 'test@example.com',
                domain: 'https://store.3asoftwares.com',
            });
        });
    });

    it('should navigate back when back button is pressed', () => {
        const { getByText } = render(<ForgotPasswordScreen />);
        const backButton = getByText('Back');

        fireEvent.press(backButton);
        expect(router.back).toHaveBeenCalled();
    });
});
