import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { EmptyState, ErrorState } from '../../components/ui/EmptyState';

describe('EmptyState Component', () => {
  it('renders with title', () => {
    const { getByText } = render(<EmptyState title="No items found" />);
    expect(getByText('No items found')).toBeTruthy();
  });

  it('renders with default icon', () => {
    const { getByText } = render(<EmptyState title="No items" />);
    expect(getByText('📦')).toBeTruthy();
  });

  it('renders with custom icon', () => {
    const { getByText } = render(<EmptyState title="No items" icon="🛒" />);
    expect(getByText('🛒')).toBeTruthy();
  });

  it('renders with description', () => {
    const { getByText } = render(
      <EmptyState title="No items" description="Your cart is empty. Start shopping!" />
    );
    expect(getByText('Your cart is empty. Start shopping!')).toBeTruthy();
  });

  it('renders action button when actionLabel and onAction provided', () => {
    const onAction = jest.fn();
    const { getByText } = render(
      <EmptyState title="No items" actionLabel="Shop Now" onAction={onAction} />
    );

    const button = getByText('Shop Now');
    expect(button).toBeTruthy();

    fireEvent.press(button);
    expect(onAction).toHaveBeenCalled();
  });

  it('does not render action button when only actionLabel is provided', () => {
    const { queryByText } = render(<EmptyState title="No items" actionLabel="Shop Now" />);

    expect(queryByText('Shop Now')).toBeNull();
  });

  it('applies custom style', () => {
    const { getByText } = render(<EmptyState title="No items" style={{ marginTop: 20 }} />);
    expect(getByText('No items')).toBeTruthy();
  });
});

describe('ErrorState Component', () => {
  it('renders with default title and message', () => {
    const { getByText } = render(<ErrorState />);

    expect(getByText('Something went wrong')).toBeTruthy();
    expect(getByText('We encountered an error. Please try again.')).toBeTruthy();
  });

  it('renders with custom title', () => {
    const { getByText } = render(<ErrorState title="Connection Failed" />);
    expect(getByText('Connection Failed')).toBeTruthy();
  });

  it('renders with custom message', () => {
    const { getByText } = render(<ErrorState message="Please check your internet connection." />);
    expect(getByText('Please check your internet connection.')).toBeTruthy();
  });

  it('renders error icon', () => {
    const { getByText } = render(<ErrorState />);
    expect(getByText('❌')).toBeTruthy();
  });

  it('renders retry button when onRetry provided', () => {
    const onRetry = jest.fn();
    const { getByText } = render(<ErrorState onRetry={onRetry} />);

    const button = getByText('Try Again');
    expect(button).toBeTruthy();

    fireEvent.press(button);
    expect(onRetry).toHaveBeenCalled();
  });

  it('does not render retry button when onRetry not provided', () => {
    const { queryByText } = render(<ErrorState />);
    expect(queryByText('Try Again')).toBeNull();
  });

  it('applies custom style', () => {
    const { getByText } = render(<ErrorState style={{ padding: 20 }} />);
    expect(getByText('Something went wrong')).toBeTruthy();
  });
});
