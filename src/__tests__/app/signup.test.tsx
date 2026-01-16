import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import SignupScreen from '../../../app/signup';
import { useRegister } from '../../lib/hooks';

// Mock dependencies
jest.mock('expo-router', () => ({
    router: {
        back: jest.fn(),
        replace: jest.fn(),
    },
}));

jest.mock('../../lib/hooks', () => ({
    useRegister: jest.fn(),
}));

jest.spyOn(Alert, 'alert');

describe('SignupScreen', () => {
    const mockRegister = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useRegister as jest.Mock).mockReturnValue({
            register: mockRegister,
            isLoading: false,
        });
    });

    it('should render signup screen correctly', () => {
        const { getAllByText, getByPlaceholderText } = render(<SignupScreen />);

        expect(getAllByText('Create Account').length).toBeGreaterThan(0);
        expect(getByPlaceholderText('Enter your name')).toBeTruthy();
        expect(getByPlaceholderText('Enter your email')).toBeTruthy();
        expect(getByPlaceholderText('Create a password')).toBeTruthy();
        expect(getByPlaceholderText('Confirm your password')).toBeTruthy();
    });

    it('should handle name input', () => {
        const { getByPlaceholderText } = render(<SignupScreen />);
        const nameInput = getByPlaceholderText('Enter your name');

        fireEvent.changeText(nameInput, 'John Doe');
        expect(nameInput.props.value).toBe('John Doe');
    });

    it('should show validation error for empty name', async () => {
        const { getAllByText } = render(<SignupScreen />);
        const signupButtons = getAllByText('Create Account');
        const signupButton = signupButtons[signupButtons.length - 1]; // Get the last one (button)

        fireEvent.press(signupButton);

        await waitFor(() => {
            expect(getAllByText('Name is required').length).toBeGreaterThan(0);
        });
    });

    it('should show validation error for short name', async () => {
        const { getAllByText, getByPlaceholderText } = render(<SignupScreen />);
        const nameInput = getByPlaceholderText('Enter your name');
        const signupButtons = getAllByText('Create Account');
        const signupButton = signupButtons[signupButtons.length - 1];

        fireEvent.changeText(nameInput, 'J');
        fireEvent.press(signupButton);

        await waitFor(() => {
            expect(getAllByText('Name must be at least 2 characters').length).toBeGreaterThan(0);
        });
    });

    it('should show validation error for invalid email', async () => {
        const { getAllByText, getByPlaceholderText } = render(<SignupScreen />);
        const nameInput = getByPlaceholderText('Enter your name');
        const emailInput = getByPlaceholderText('Enter your email');
        const signupButtons = getAllByText('Create Account');
        const signupButton = signupButtons[signupButtons.length - 1];

        fireEvent.changeText(nameInput, 'John Doe');
        fireEvent.changeText(emailInput, 'invalid-email');
        fireEvent.press(signupButton);

        await waitFor(() => {
            expect(getAllByText('Please enter a valid email').length).toBeGreaterThan(0);
        });
    });

    it('should show validation error for weak password', async () => {
        const { getAllByText, getByPlaceholderText } = render(<SignupScreen />);
        const nameInput = getByPlaceholderText('Enter your name');
        const emailInput = getByPlaceholderText('Enter your email');
        const passwordInput = getByPlaceholderText('Create a password');
        const signupButtons = getAllByText('Create Account');
        const signupButton = signupButtons[signupButtons.length - 1];

        fireEvent.changeText(nameInput, 'John Doe');
        fireEvent.changeText(emailInput, 'test@example.com');
        fireEvent.changeText(passwordInput, 'weak');
        fireEvent.press(signupButton);

        await waitFor(() => {
            expect(getAllByText('Password must be at least 8 characters').length).toBeGreaterThan(0);
        });
    });

    it('should show validation error for password without required characters', async () => {
        const { getAllByText, getByPlaceholderText } = render(<SignupScreen />);
        const nameInput = getByPlaceholderText('Enter your name');
        const emailInput = getByPlaceholderText('Enter your email');
        const passwordInput = getByPlaceholderText('Create a password');
        const signupButtons = getAllByText('Create Account');
        const signupButton = signupButtons[signupButtons.length - 1];

        fireEvent.changeText(nameInput, 'John Doe');
        fireEvent.changeText(emailInput, 'test@example.com');
        fireEvent.changeText(passwordInput, 'password');
        fireEvent.press(signupButton);

        await waitFor(() => {
            expect(getAllByText('Password must contain uppercase, lowercase, and number').length).toBeGreaterThan(0);
        });
    });

    it('should show validation error for password mismatch', async () => {
        const { getAllByText, getByPlaceholderText } = render(<SignupScreen />);
        const nameInput = getByPlaceholderText('Enter your name');
        const emailInput = getByPlaceholderText('Enter your email');
        const passwordInput = getByPlaceholderText('Create a password');
        const confirmPasswordInput = getByPlaceholderText('Confirm your password');
        const signupButtons = getAllByText('Create Account');
        const signupButton = signupButtons[signupButtons.length - 1];

        fireEvent.changeText(nameInput, 'John Doe');
        fireEvent.changeText(emailInput, 'test@example.com');
        fireEvent.changeText(passwordInput, 'Password123');
        fireEvent.changeText(confirmPasswordInput, 'Different123');
        fireEvent.press(signupButton);

        await waitFor(() => {
            expect(getAllByText('Passwords do not match').length).toBeGreaterThan(0);
        });
    });

    it('should show validation error for not accepting terms', async () => {
        const { getAllByText, getByPlaceholderText } = render(<SignupScreen />);
        const nameInput = getByPlaceholderText('Enter your name');
        const emailInput = getByPlaceholderText('Enter your email');
        const passwordInput = getByPlaceholderText('Create a password');
        const confirmPasswordInput = getByPlaceholderText('Confirm your password');
        const signupButtons = getAllByText('Create Account');
        const signupButton = signupButtons[signupButtons.length - 1];

        fireEvent.changeText(nameInput, 'John Doe');
        fireEvent.changeText(emailInput, 'test@example.com');
        fireEvent.changeText(passwordInput, 'Password123');
        fireEvent.changeText(confirmPasswordInput, 'Password123');
        fireEvent.press(signupButton);

        await waitFor(() => {
            expect(getAllByText('You must accept the terms and conditions').length).toBeGreaterThan(0);
        });
    });

    it('should navigate back when back button is pressed', () => {
        const { getByText } = render(<SignupScreen />);
        const backButton = getByText('Back');

        fireEvent.press(backButton);
        expect(router.back).toHaveBeenCalled();
    });
});
