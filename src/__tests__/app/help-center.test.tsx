import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HelpCenterScreen from '../../../app/help-center';

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

jest.mock('react-native/Libraries/Linking/Linking', () => ({
    openURL: jest.fn(),
}));

describe('HelpCenterScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render help center screen correctly', () => {
        const { getByText } = render(<HelpCenterScreen />);

        expect(getByText('Help Center')).toBeTruthy();
    });

    it('should display hero section', () => {
        const { getByText } = render(<HelpCenterScreen />);

        expect(getByText('How can we help you?')).toBeTruthy();
        expect(getByText('Find answers to common questions or contact our support team')).toBeTruthy();
    });

    it('should display search input', () => {
        const { getByPlaceholderText } = render(<HelpCenterScreen />);

        expect(getByPlaceholderText('Search for help...')).toBeTruthy();
    });

    it('should display browse topics section', () => {
        const { getByText } = render(<HelpCenterScreen />);

        expect(getByText('Browse Topics')).toBeTruthy();
    });

    it('should display help categories', () => {
        const { getByText } = render(<HelpCenterScreen />);

        expect(getByText('Orders')).toBeTruthy();
        expect(getByText('Shipping')).toBeTruthy();
        expect(getByText('Returns')).toBeTruthy();
        expect(getByText('Payments')).toBeTruthy();
        expect(getByText('Account')).toBeTruthy();
        expect(getByText('General')).toBeTruthy();
    });

    it('should display category descriptions', () => {
        const { getByText } = render(<HelpCenterScreen />);

        expect(getByText('Track & manage')).toBeTruthy();
        expect(getByText('Delivery info')).toBeTruthy();
        expect(getByText('Refunds & exchanges')).toBeTruthy();
        expect(getByText('Billing help')).toBeTruthy();
    });

    it('should display FAQ section title', () => {
        const { getByText } = render(<HelpCenterScreen />);

        expect(getByText('Frequently Asked Questions')).toBeTruthy();
    });

    it('should display FAQ questions', () => {
        const { getByText } = render(<HelpCenterScreen />);

        expect(getByText('How do I track my order?')).toBeTruthy();
        expect(getByText('What is your return policy?')).toBeTruthy();
        expect(getByText('How do I change my shipping address?')).toBeTruthy();
        expect(getByText('What payment methods do you accept?')).toBeTruthy();
    });

    it('should expand FAQ answer when pressed', () => {
        const { getByText, queryByText } = render(<HelpCenterScreen />);

        const faqQuestion = getByText('How do I track my order?');
        
        // Initially, the answer should not be visible
        expect(queryByText(/You can track your order by going to/)).toBeNull();
        
        // Click to expand
        fireEvent.press(faqQuestion);
        
        // Now the answer should be visible
        expect(getByText(/You can track your order by going to/)).toBeTruthy();
    });

    it('should display still need help section', () => {
        const { getByText } = render(<HelpCenterScreen />);

        expect(getByText('Still need help?')).toBeTruthy();
    });

    it('should display email support option', () => {
        const { getByText } = render(<HelpCenterScreen />);

        expect(getByText('Email Us')).toBeTruthy();
        expect(getByText('support@3asoftwares.com')).toBeTruthy();
    });

    it('should display call support option', () => {
        const { getByText } = render(<HelpCenterScreen />);

        expect(getByText('Call Us')).toBeTruthy();
        expect(getByText('Available Mon-Fri, 9AM-6PM')).toBeTruthy();
    });

    it('should handle search input', () => {
        const { getByPlaceholderText } = render(<HelpCenterScreen />);

        const searchInput = getByPlaceholderText('Search for help...');
        fireEvent.changeText(searchInput, 'order tracking');

        expect(searchInput.props.value).toBe('order tracking');
    });

    it('should render correctly', () => {
        const { toJSON } = render(<HelpCenterScreen />);
        expect(toJSON()).toBeTruthy();
    });

    it('should display more FAQ questions', () => {
        const { getByText } = render(<HelpCenterScreen />);

        expect(getByText('How do I apply a coupon code?')).toBeTruthy();
        expect(getByText('My order arrived damaged. What should I do?')).toBeTruthy();
    });
});
