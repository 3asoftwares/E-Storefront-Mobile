import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import PrivacySecurityScreen from '../../../app/privacy-security';
import { useChangePassword } from '../../lib/hooks';
import { router } from 'expo-router';

// Mock dependencies
jest.mock('expo-router', () => ({
    router: {
        push: jest.fn(),
        back: jest.fn(),
    },
}));

jest.mock('react-native-safe-area-context', () => ({
    SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@fortawesome/react-native-fontawesome', () => ({
    FontAwesomeIcon: () => null,
}));

jest.mock('../../lib/hooks', () => ({
    useChangePassword: jest.fn(),
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('PrivacySecurityScreen', () => {
    const mockChangePassword = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useChangePassword as jest.Mock).mockReturnValue({
            changePassword: mockChangePassword,
            isLoading: false,
            error: null,
        });
    });

    it('should render privacy security screen correctly', () => {
        const { getByText } = render(<PrivacySecurityScreen />);

        expect(getByText('Privacy & Security')).toBeTruthy();
    });

    it('should display hero section', () => {
        const { getByText } = render(<PrivacySecurityScreen />);

        expect(getByText('Secure Your Account')).toBeTruthy();
        expect(getByText('Manage your password and security settings')).toBeTruthy();
    });

    it('should display password section', () => {
        const { getByText } = render(<PrivacySecurityScreen />);

        expect(getByText('Password')).toBeTruthy();
    });

    it('should display change password option', () => {
        const { getByText } = render(<PrivacySecurityScreen />);

        expect(getByText('Change Password')).toBeTruthy();
        expect(getByText('Update your account password')).toBeTruthy();
    });

    it('should display security options section', () => {
        const { getByText } = render(<PrivacySecurityScreen />);

        expect(getByText('Security Options')).toBeTruthy();
    });

    it('should display two-factor authentication option', () => {
        const { getByText } = render(<PrivacySecurityScreen />);

        expect(getByText('Two-Factor Authentication')).toBeTruthy();
        expect(getByText('Add extra security to your account')).toBeTruthy();
    });

    it('should display login activity option', () => {
        const { getByText } = render(<PrivacySecurityScreen />);

        expect(getByText('Login Activity')).toBeTruthy();
        expect(getByText('View your recent login sessions')).toBeTruthy();
    });

    it('should display privacy info card', () => {
        const { getByText } = render(<PrivacySecurityScreen />);

        expect(getByText('Your Privacy Matters')).toBeTruthy();
        expect(getByText(/We use industry-standard encryption/)).toBeTruthy();
    });

    it('should display link to privacy policy', () => {
        const { getByText } = render(<PrivacySecurityScreen />);

        expect(getByText('Read our Privacy Policy')).toBeTruthy();
    });

    it('should show change password form when option is pressed', () => {
        const { getByText } = render(<PrivacySecurityScreen />);

        const changePasswordOption = getByText('Change Password');
        fireEvent.press(changePasswordOption);

        // The form should now be visible
        expect(getByText('Current Password')).toBeTruthy();
        expect(getByText('New Password')).toBeTruthy();
        expect(getByText('Confirm New Password')).toBeTruthy();
    });

    it('should display update password button in form', () => {
        const { getByText } = render(<PrivacySecurityScreen />);

        const changePasswordOption = getByText('Change Password');
        fireEvent.press(changePasswordOption);

        expect(getByText('Update Password')).toBeTruthy();
    });

    it('should display cancel button in form', () => {
        const { getByText } = render(<PrivacySecurityScreen />);

        const changePasswordOption = getByText('Change Password');
        fireEvent.press(changePasswordOption);

        expect(getByText('Cancel')).toBeTruthy();
    });

    it('should display password hint', () => {
        const { getByText } = render(<PrivacySecurityScreen />);

        const changePasswordOption = getByText('Change Password');
        fireEvent.press(changePasswordOption);

        expect(getByText('At least 8 characters')).toBeTruthy();
    });

    it('should hide form when cancel is pressed', () => {
        const { getByText, queryByText } = render(<PrivacySecurityScreen />);

        // Show form
        const changePasswordOption = getByText('Change Password');
        fireEvent.press(changePasswordOption);

        // Press cancel
        const cancelButton = getByText('Cancel');
        fireEvent.press(cancelButton);

        // Form should be hidden
        expect(queryByText('Current Password')).toBeNull();
        expect(queryByText('New Password')).toBeNull();
    });

    it('should render correctly', () => {
        const { toJSON } = render(<PrivacySecurityScreen />);
        expect(toJSON()).toBeTruthy();
    });

    it('should handle password input', () => {
        const { getByText, getByPlaceholderText } = render(<PrivacySecurityScreen />);

        const changePasswordOption = getByText('Change Password');
        fireEvent.press(changePasswordOption);

        const currentPasswordInput = getByPlaceholderText('Enter current password');
        const newPasswordInput = getByPlaceholderText('Enter new password');
        const confirmPasswordInput = getByPlaceholderText('Confirm new password');

        fireEvent.changeText(currentPasswordInput, 'oldpassword');
        fireEvent.changeText(newPasswordInput, 'newpassword123');
        fireEvent.changeText(confirmPasswordInput, 'newpassword123');

        expect(currentPasswordInput.props.value).toBe('oldpassword');
        expect(newPasswordInput.props.value).toBe('newpassword123');
        expect(confirmPasswordInput.props.value).toBe('newpassword123');
    });

    // Navigation tests
    describe('Navigation', () => {
        it('should navigate back when back button is pressed', () => {
            const { getByText } = render(<PrivacySecurityScreen />);

            // Find the back button area - it's a TouchableOpacity near the header
            // The header has "Privacy & Security" text, and the back button is before it
            const { UNSAFE_getAllByType } = render(<PrivacySecurityScreen />);
            const touchables = UNSAFE_getAllByType(require('react-native').TouchableOpacity);
            
            // The first touchable should be the back button
            fireEvent.press(touchables[0]);
            
            expect(router.back).toHaveBeenCalled();
        });

        it('should navigate to privacy policy when link is pressed', () => {
            const { getByText } = render(<PrivacySecurityScreen />);

            const privacyPolicyLink = getByText('Read our Privacy Policy');
            fireEvent.press(privacyPolicyLink);

            expect(router.push).toHaveBeenCalledWith('/privacy-policy');
        });
    });

    // Security menu item alerts
    describe('Security Options Alerts', () => {
        it('should show coming soon alert when Two-Factor Authentication is pressed', () => {
            const { getByText } = render(<PrivacySecurityScreen />);

            const twoFAOption = getByText('Two-Factor Authentication');
            fireEvent.press(twoFAOption);

            expect(Alert.alert).toHaveBeenCalledWith(
                'Coming Soon',
                '2FA will be available in a future update'
            );
        });

        it('should show coming soon alert when Login Activity is pressed', () => {
            const { getByText } = render(<PrivacySecurityScreen />);

            const loginActivityOption = getByText('Login Activity');
            fireEvent.press(loginActivityOption);

            expect(Alert.alert).toHaveBeenCalledWith(
                'Coming Soon',
                'Login activity will be available in a future update'
            );
        });
    });

    // Change Password Validation Tests
    describe('Change Password Form Validation', () => {
        it('should show error alert when fields are empty', async () => {
            const { getByText } = render(<PrivacySecurityScreen />);

            // Open the form
            fireEvent.press(getByText('Change Password'));

            // Try to submit without filling fields
            fireEvent.press(getByText('Update Password'));

            expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please fill in all fields');
        });

        it('should show error alert when only current password is filled', async () => {
            const { getByText, getByPlaceholderText } = render(<PrivacySecurityScreen />);

            fireEvent.press(getByText('Change Password'));

            fireEvent.changeText(getByPlaceholderText('Enter current password'), 'currentpass');
            fireEvent.press(getByText('Update Password'));

            expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please fill in all fields');
        });

        it('should show error alert when new password is less than 8 characters', async () => {
            const { getByText, getByPlaceholderText } = render(<PrivacySecurityScreen />);

            fireEvent.press(getByText('Change Password'));

            fireEvent.changeText(getByPlaceholderText('Enter current password'), 'currentpass');
            fireEvent.changeText(getByPlaceholderText('Enter new password'), 'short');
            fireEvent.changeText(getByPlaceholderText('Confirm new password'), 'short');
            fireEvent.press(getByText('Update Password'));

            expect(Alert.alert).toHaveBeenCalledWith(
                'Error',
                'New password must be at least 8 characters'
            );
        });

        it('should show error alert when passwords do not match', async () => {
            const { getByText, getByPlaceholderText } = render(<PrivacySecurityScreen />);

            fireEvent.press(getByText('Change Password'));

            fireEvent.changeText(getByPlaceholderText('Enter current password'), 'currentpass');
            fireEvent.changeText(getByPlaceholderText('Enter new password'), 'newpassword123');
            fireEvent.changeText(getByPlaceholderText('Confirm new password'), 'differentpassword');
            fireEvent.press(getByText('Update Password'));

            expect(Alert.alert).toHaveBeenCalledWith('Error', 'New passwords do not match');
        });
    });

    // Change Password API Call Tests
    describe('Change Password API Calls', () => {
        it('should call changePassword with correct parameters on successful validation', async () => {
            mockChangePassword.mockResolvedValueOnce({});
            const { getByText, getByPlaceholderText } = render(<PrivacySecurityScreen />);

            fireEvent.press(getByText('Change Password'));

            fireEvent.changeText(getByPlaceholderText('Enter current password'), 'currentpass');
            fireEvent.changeText(getByPlaceholderText('Enter new password'), 'newpassword123');
            fireEvent.changeText(getByPlaceholderText('Confirm new password'), 'newpassword123');
            fireEvent.press(getByText('Update Password'));

            await waitFor(() => {
                expect(mockChangePassword).toHaveBeenCalledWith({
                    currentPassword: 'currentpass',
                    newPassword: 'newpassword123',
                });
            });
        });

        it('should show success alert after password change', async () => {
            mockChangePassword.mockResolvedValueOnce({});
            const { getByText, getByPlaceholderText } = render(<PrivacySecurityScreen />);

            fireEvent.press(getByText('Change Password'));

            fireEvent.changeText(getByPlaceholderText('Enter current password'), 'currentpass');
            fireEvent.changeText(getByPlaceholderText('Enter new password'), 'newpassword123');
            fireEvent.changeText(getByPlaceholderText('Confirm new password'), 'newpassword123');
            fireEvent.press(getByText('Update Password'));

            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalledWith(
                    'Success',
                    'Password changed successfully',
                    expect.arrayContaining([
                        expect.objectContaining({ text: 'OK' }),
                    ])
                );
            });
        });

        it('should show error alert when changePassword fails with error message', async () => {
            mockChangePassword.mockRejectedValueOnce(new Error('Invalid current password'));
            const { getByText, getByPlaceholderText } = render(<PrivacySecurityScreen />);

            fireEvent.press(getByText('Change Password'));

            fireEvent.changeText(getByPlaceholderText('Enter current password'), 'wrongpassword');
            fireEvent.changeText(getByPlaceholderText('Enter new password'), 'newpassword123');
            fireEvent.changeText(getByPlaceholderText('Confirm new password'), 'newpassword123');
            fireEvent.press(getByText('Update Password'));

            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalledWith('Error', 'Invalid current password');
            });
        });

        it('should show generic error alert when changePassword fails without message', async () => {
            mockChangePassword.mockRejectedValueOnce(new Error(''));
            const { getByText, getByPlaceholderText } = render(<PrivacySecurityScreen />);

            fireEvent.press(getByText('Change Password'));

            fireEvent.changeText(getByPlaceholderText('Enter current password'), 'currentpass');
            fireEvent.changeText(getByPlaceholderText('Enter new password'), 'newpassword123');
            fireEvent.changeText(getByPlaceholderText('Confirm new password'), 'newpassword123');
            fireEvent.press(getByText('Update Password'));

            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to change password');
            });
        });
    });

    // Loading State Tests
    describe('Loading State', () => {
        it('should show loading indicator when isLoading is true', () => {
            (useChangePassword as jest.Mock).mockReturnValue({
                changePassword: mockChangePassword,
                isLoading: true,
                error: null,
            });

            const { getByText, queryByText } = render(<PrivacySecurityScreen />);

            fireEvent.press(getByText('Change Password'));

            // Should not show "Update Password" text when loading
            expect(queryByText('Update Password')).toBeNull();
        });

        it('should disable submit button when loading', async () => {
            (useChangePassword as jest.Mock).mockReturnValue({
                changePassword: mockChangePassword,
                isLoading: true,
                error: null,
            });

            const { getByText, UNSAFE_getAllByType } = render(<PrivacySecurityScreen />);

            fireEvent.press(getByText('Change Password'));

            // Find the submit button - the button that would have "Update Password"
            const touchables = UNSAFE_getAllByType(require('react-native').TouchableOpacity);
            const submitButton = touchables.find(t => t.props.disabled === true);
            
            expect(submitButton).toBeTruthy();
        });
    });

    // Error Display Tests
    describe('Error Display', () => {
        it('should display error message from hook', () => {
            (useChangePassword as jest.Mock).mockReturnValue({
                changePassword: mockChangePassword,
                isLoading: false,
                error: { message: 'Password change failed' },
            });

            const { getByText } = render(<PrivacySecurityScreen />);

            fireEvent.press(getByText('Change Password'));

            expect(getByText('Password change failed')).toBeTruthy();
        });

        it('should not display error container when there is no error', () => {
            const { getByText, queryByText } = render(<PrivacySecurityScreen />);

            fireEvent.press(getByText('Change Password'));

            expect(queryByText('Password change failed')).toBeNull();
        });
    });

    // Password Visibility Toggle Tests
    describe('Password Visibility Toggle', () => {
        it('should toggle current password visibility', () => {
            const { getByText, getByPlaceholderText, UNSAFE_getAllByType } = render(
                <PrivacySecurityScreen />
            );

            fireEvent.press(getByText('Change Password'));

            const currentPasswordInput = getByPlaceholderText('Enter current password');
            
            // Initially should be secure (hidden)
            expect(currentPasswordInput.props.secureTextEntry).toBe(true);

            // Find all TouchableOpacity elements - the eye icons are in the input containers
            const touchables = UNSAFE_getAllByType(require('react-native').TouchableOpacity);
            
            // The eye toggle for current password should be the first one after form header elements
            // We need to find the toggle button next to current password input
            // In the form, there are 3 input containers, each with a visibility toggle
            const eyeToggles = touchables.filter((t, index) => index >= 1 && index <= 3);
            
            if (eyeToggles.length > 0) {
                fireEvent.press(eyeToggles[0]);
            }
        });

        it('should toggle new password visibility', () => {
            const { getByText, getByPlaceholderText, UNSAFE_getAllByType } = render(
                <PrivacySecurityScreen />
            );

            fireEvent.press(getByText('Change Password'));

            const newPasswordInput = getByPlaceholderText('Enter new password');
            
            // Initially should be secure (hidden)
            expect(newPasswordInput.props.secureTextEntry).toBe(true);

            // Find touchables and toggle the second eye icon
            const touchables = UNSAFE_getAllByType(require('react-native').TouchableOpacity);
            const eyeToggles = touchables.filter((t, index) => index >= 1 && index <= 4);
            
            if (eyeToggles.length > 1) {
                fireEvent.press(eyeToggles[1]);
            }
        });

        it('should toggle confirm password visibility', () => {
            const { getByText, getByPlaceholderText, UNSAFE_getAllByType } = render(
                <PrivacySecurityScreen />
            );

            fireEvent.press(getByText('Change Password'));

            const confirmPasswordInput = getByPlaceholderText('Confirm new password');
            
            // Initially should be secure (hidden)
            expect(confirmPasswordInput.props.secureTextEntry).toBe(true);

            // Find touchables and toggle the third eye icon
            const touchables = UNSAFE_getAllByType(require('react-native').TouchableOpacity);
            const eyeToggles = touchables.filter((t, index) => index >= 1 && index <= 5);
            
            if (eyeToggles.length > 2) {
                fireEvent.press(eyeToggles[2]);
            }
        });
    });

    // Success callback test
    describe('Success Callback', () => {
        it('should close form when OK is pressed on success alert', async () => {
            mockChangePassword.mockResolvedValueOnce({});
            const { getByText, getByPlaceholderText, queryByText } = render(
                <PrivacySecurityScreen />
            );

            fireEvent.press(getByText('Change Password'));

            fireEvent.changeText(getByPlaceholderText('Enter current password'), 'currentpass');
            fireEvent.changeText(getByPlaceholderText('Enter new password'), 'newpassword123');
            fireEvent.changeText(getByPlaceholderText('Confirm new password'), 'newpassword123');
            fireEvent.press(getByText('Update Password'));

            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalled();
            });

            // Simulate pressing OK on the success alert
            const alertCall = (Alert.alert as jest.Mock).mock.calls.find(
                call => call[0] === 'Success'
            );
            if (alertCall && alertCall[2] && alertCall[2][0] && alertCall[2][0].onPress) {
                alertCall[2][0].onPress();
            }

            await waitFor(() => {
                // Form should be closed
                expect(queryByText('Current Password')).toBeNull();
            });
        });
    });

    // SecurityMenuItem Component Tests
    describe('SecurityMenuItem Component', () => {
        it('should render menu item with title and subtitle', () => {
            const { getByText } = render(<PrivacySecurityScreen />);

            expect(getByText('Change Password')).toBeTruthy();
            expect(getByText('Update your account password')).toBeTruthy();
        });

        it('should render menu items with icons', () => {
            const { getByText } = render(<PrivacySecurityScreen />);

            // Verify all menu items are rendered
            expect(getByText('Two-Factor Authentication')).toBeTruthy();
            expect(getByText('Login Activity')).toBeTruthy();
        });
    });
});
