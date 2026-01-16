import React from 'react';
import { render } from '@testing-library/react-native';
import PrivacyPolicyScreen from '../../../app/privacy-policy';

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

describe('PrivacyPolicyScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render privacy policy screen correctly', () => {
        const { getByText } = render(<PrivacyPolicyScreen />);

        expect(getByText('Privacy Policy')).toBeTruthy();
    });

    it('should display last updated date', () => {
        const { getByText } = render(<PrivacyPolicyScreen />);

        expect(getByText('Last updated: January 10, 2026')).toBeTruthy();
    });

    it('should display information we collect section', () => {
        const { getByText } = render(<PrivacyPolicyScreen />);

        expect(getByText('1. Information We Collect')).toBeTruthy();
    });

    it('should display collection bullet points', () => {
        const { getByText } = render(<PrivacyPolicyScreen />);

        expect(getByText('• Name and email address')).toBeTruthy();
        expect(getByText('• Shipping and billing addresses')).toBeTruthy();
        expect(getByText('• Payment information')).toBeTruthy();
        expect(getByText('• Phone number')).toBeTruthy();
        expect(getByText('• Order history and preferences')).toBeTruthy();
    });

    it('should display how we use your information section', () => {
        const { getByText } = render(<PrivacyPolicyScreen />);

        expect(getByText('2. How We Use Your Information')).toBeTruthy();
    });

    it('should display usage bullet points', () => {
        const { getByText } = render(<PrivacyPolicyScreen />);

        expect(getByText('• Process and fulfill your orders')).toBeTruthy();
        expect(getByText('• Send order confirmations and updates')).toBeTruthy();
        expect(getByText('• Provide customer support')).toBeTruthy();
    });

    it('should display information sharing section', () => {
        const { getByText } = render(<PrivacyPolicyScreen />);

        expect(getByText('3. Information Sharing')).toBeTruthy();
    });

    it('should display data security section', () => {
        const { getByText } = render(<PrivacyPolicyScreen />);

        expect(getByText('4. Data Security')).toBeTruthy();
    });

    it('should display your rights section', () => {
        const { getByText } = render(<PrivacyPolicyScreen />);

        expect(getByText('5. Your Rights')).toBeTruthy();
    });

    it('should display rights bullet points', () => {
        const { getByText } = render(<PrivacyPolicyScreen />);

        expect(getByText('• Access your personal data')).toBeTruthy();
        expect(getByText('• Correct inaccurate data')).toBeTruthy();
        expect(getByText('• Request deletion of your data')).toBeTruthy();
        expect(getByText('• Opt-out of marketing communications')).toBeTruthy();
    });

    it('should display cookies section', () => {
        const { getByText } = render(<PrivacyPolicyScreen />);

        expect(getByText('6. Cookies')).toBeTruthy();
    });

    it('should display contact us section', () => {
        const { getByText } = render(<PrivacyPolicyScreen />);

        expect(getByText('7. Contact Us')).toBeTruthy();
        expect(getByText('privacy@3asoftwares.com')).toBeTruthy();
    });

    it('should render correctly', () => {
        const { toJSON } = render(<PrivacyPolicyScreen />);
        expect(toJSON()).toBeTruthy();
    });

    it('should display security info content', () => {
        const { getByText } = render(<PrivacyPolicyScreen />);

        expect(getByText(/We implement industry-standard security measures/)).toBeTruthy();
    });

    it('should display cookie info content', () => {
        const { getByText } = render(<PrivacyPolicyScreen />);

        expect(getByText(/We use cookies and similar technologies/)).toBeTruthy();
    });
});
