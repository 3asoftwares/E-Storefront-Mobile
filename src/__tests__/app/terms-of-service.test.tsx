import React from 'react';
import { render } from '@testing-library/react-native';
import TermsOfServiceScreen from '../../../app/terms-of-service';

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

describe('TermsOfServiceScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render terms of service screen correctly', () => {
    const { getByText } = render(<TermsOfServiceScreen />);

    expect(getByText('Terms of Service')).toBeTruthy();
  });

  it('should display last updated date', () => {
    const { getByText } = render(<TermsOfServiceScreen />);

    expect(getByText('Last updated: January 10, 2026')).toBeTruthy();
  });

  it('should display acceptance of terms section', () => {
    const { getByText } = render(<TermsOfServiceScreen />);

    expect(getByText('1. Acceptance of Terms')).toBeTruthy();
  });

  it('should display user accounts section', () => {
    const { getByText } = render(<TermsOfServiceScreen />);

    expect(getByText('2. User Accounts')).toBeTruthy();
  });

  it('should display user account responsibilities', () => {
    const { getByText } = render(<TermsOfServiceScreen />);

    expect(getByText('• Maintaining the security of your account')).toBeTruthy();
    expect(getByText('• All activities that occur under your account')).toBeTruthy();
    expect(getByText('• Notifying us of any unauthorized access')).toBeTruthy();
  });

  it('should display products and services section', () => {
    const { getByText } = render(<TermsOfServiceScreen />);

    expect(getByText('3. Products and Services')).toBeTruthy();
  });

  it('should display products rights', () => {
    const { getByText } = render(<TermsOfServiceScreen />);

    expect(getByText('• Limit quantities of items purchased')).toBeTruthy();
    expect(getByText('• Refuse service to anyone')).toBeTruthy();
    expect(getByText('• Discontinue products at any time')).toBeTruthy();
  });

  it('should display pricing and payment section', () => {
    const { getByText } = render(<TermsOfServiceScreen />);

    expect(getByText('4. Pricing and Payment')).toBeTruthy();
  });

  it('should display shipping and delivery section', () => {
    const { getByText } = render(<TermsOfServiceScreen />);

    expect(getByText('5. Shipping and Delivery')).toBeTruthy();
  });

  it('should display returns and refunds section', () => {
    const { getByText } = render(<TermsOfServiceScreen />);

    expect(getByText('6. Returns and Refunds')).toBeTruthy();
  });

  it('should display intellectual property section', () => {
    const { getByText } = render(<TermsOfServiceScreen />);

    expect(getByText('7. Intellectual Property')).toBeTruthy();
  });

  it('should display limitation of liability section', () => {
    const { getByText } = render(<TermsOfServiceScreen />);

    expect(getByText('8. Limitation of Liability')).toBeTruthy();
  });

  it('should display changes to terms section', () => {
    const { getByText } = render(<TermsOfServiceScreen />);

    expect(getByText('9. Changes to Terms')).toBeTruthy();
  });

  it('should display contact information section', () => {
    const { getByText } = render(<TermsOfServiceScreen />);

    expect(getByText('10. Contact Information')).toBeTruthy();
    expect(getByText('legal@3asoftwares.com')).toBeTruthy();
  });

  it('should render correctly', () => {
    const { toJSON } = render(<TermsOfServiceScreen />);
    expect(toJSON()).toBeTruthy();
  });

  it('should display acceptance terms content', () => {
    const { getByText } = render(<TermsOfServiceScreen />);

    expect(getByText(/By accessing and using this application/)).toBeTruthy();
  });

  it('should display return policy content', () => {
    const { getByText } = render(<TermsOfServiceScreen />);

    expect(getByText(/Our return policy allows returns within 30 days/)).toBeTruthy();
  });

  it('should display pricing content', () => {
    const { getByText } = render(<TermsOfServiceScreen />);

    expect(getByText(/All prices are displayed in USD unless otherwise noted/)).toBeTruthy();
  });

  it('should display intellectual property content', () => {
    const { getByText } = render(<TermsOfServiceScreen />);

    expect(getByText(/All content on this application, including text, graphics/)).toBeTruthy();
  });
});
