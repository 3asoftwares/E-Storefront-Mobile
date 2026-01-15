import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../../components/ui/Button';

describe('Button Component', () => {
  it('renders correctly with title', () => {
    const { getByText } = render(<Button title="Click Me" onPress={() => {}} />);
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<Button title="Press" onPress={onPressMock} />);

    fireEvent.press(getByText('Press'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<Button title="Disabled" onPress={onPressMock} disabled />);

    fireEvent.press(getByText('Disabled'));
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('shows loading indicator when loading', () => {
    const { UNSAFE_getByType } = render(<Button title="Loading" onPress={() => {}} loading />);

    // Check that ActivityIndicator is rendered when loading
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const ActivityIndicator = require('react-native').ActivityIndicator;
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });
});
