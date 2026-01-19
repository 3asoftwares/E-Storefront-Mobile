import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
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

  describe('Variants', () => {
    it('renders primary variant', () => {
      const { getByText } = render(<Button title="Primary" onPress={() => {}} variant="primary" />);
      expect(getByText('Primary')).toBeTruthy();
    });

    it('renders secondary variant', () => {
      const { getByText } = render(
        <Button title="Secondary" onPress={() => {}} variant="secondary" />
      );
      expect(getByText('Secondary')).toBeTruthy();
    });

    it('renders outline variant', () => {
      const { getByText } = render(<Button title="Outline" onPress={() => {}} variant="outline" />);
      expect(getByText('Outline')).toBeTruthy();
    });

    it('renders ghost variant', () => {
      const { getByText } = render(<Button title="Ghost" onPress={() => {}} variant="ghost" />);
      expect(getByText('Ghost')).toBeTruthy();
    });

    it('renders danger variant', () => {
      const { getByText } = render(<Button title="Danger" onPress={() => {}} variant="danger" />);
      expect(getByText('Danger')).toBeTruthy();
    });

    it('renders accent variant', () => {
      const { getByText } = render(<Button title="Accent" onPress={() => {}} variant="accent" />);
      expect(getByText('Accent')).toBeTruthy();
    });

    it('renders soft variant', () => {
      const { getByText } = render(<Button title="Soft" onPress={() => {}} variant="soft" />);
      expect(getByText('Soft')).toBeTruthy();
    });
  });

  describe('Sizes', () => {
    it('renders xs size', () => {
      const { getByText } = render(<Button title="XS" onPress={() => {}} size="xs" />);
      expect(getByText('XS')).toBeTruthy();
    });

    it('renders sm size', () => {
      const { getByText } = render(<Button title="SM" onPress={() => {}} size="sm" />);
      expect(getByText('SM')).toBeTruthy();
    });

    it('renders md size (default)', () => {
      const { getByText } = render(<Button title="MD" onPress={() => {}} size="md" />);
      expect(getByText('MD')).toBeTruthy();
    });

    it('renders lg size', () => {
      const { getByText } = render(<Button title="LG" onPress={() => {}} size="lg" />);
      expect(getByText('LG')).toBeTruthy();
    });

    it('renders xl size', () => {
      const { getByText } = render(<Button title="XL" onPress={() => {}} size="xl" />);
      expect(getByText('XL')).toBeTruthy();
    });
  });

  describe('Icon Support', () => {
    const iconElement = <Text>Icon</Text>;

    it('renders with left icon', () => {
      const { getByText } = render(
        <Button title="With Icon" onPress={() => {}} icon={iconElement} iconPosition="left" />
      );
      expect(getByText('With Icon')).toBeTruthy();
      expect(getByText('Icon')).toBeTruthy();
    });

    it('renders with right icon', () => {
      const { getByText } = render(
        <Button title="With Icon" onPress={() => {}} icon={iconElement} iconPosition="right" />
      );
      expect(getByText('With Icon')).toBeTruthy();
      expect(getByText('Icon')).toBeTruthy();
    });

    it('defaults to left icon position', () => {
      const { getByText } = render(
        <Button title="With Icon" onPress={() => {}} icon={iconElement} />
      );
      expect(getByText('Icon')).toBeTruthy();
    });
  });

  describe('Additional Props', () => {
    it('renders full width button', () => {
      const { getByText } = render(<Button title="Full Width" onPress={() => {}} fullWidth />);
      expect(getByText('Full Width')).toBeTruthy();
    });

    it('renders rounded button', () => {
      const { getByText } = render(<Button title="Rounded" onPress={() => {}} rounded />);
      expect(getByText('Rounded')).toBeTruthy();
    });

    it('applies custom style', () => {
      const customStyle = { marginTop: 20 };
      const { getByText } = render(
        <Button title="Custom" onPress={() => {}} style={customStyle} />
      );
      expect(getByText('Custom')).toBeTruthy();
    });

    it('applies custom text style', () => {
      const customTextStyle = { fontWeight: 'bold' as const };
      const { getByText } = render(
        <Button title="Custom Text" onPress={() => {}} textStyle={customTextStyle} />
      );
      expect(getByText('Custom Text')).toBeTruthy();
    });
  });

  describe('Loading State', () => {
    it('is disabled when loading', () => {
      const onPressMock = jest.fn();
      const { UNSAFE_getByType } = render(<Button title="Loading" onPress={onPressMock} loading />);

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const button = UNSAFE_getByType(TouchableOpacity);
      // When loading, the button should be disabled
      expect(button.props.disabled).toBe(true);
    });

    it('does not show title when loading', () => {
      const { queryByText } = render(<Button title="Loading" onPress={() => {}} loading />);
      expect(queryByText('Loading')).toBeNull();
    });
  });

  describe('Combined States', () => {
    it('handles disabled + loading state', () => {
      const onPressMock = jest.fn();
      const { UNSAFE_getByType } = render(
        <Button title="Disabled Loading" onPress={onPressMock} disabled loading />
      );

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const button = UNSAFE_getByType(TouchableOpacity);
      // Button should be disabled
      expect(button.props.disabled).toBe(true);
    });

    it('handles different variant + size combinations', () => {
      const { getByText } = render(
        <Button title="Combo" onPress={() => {}} variant="outline" size="lg" />
      );
      expect(getByText('Combo')).toBeTruthy();
    });

    it('handles rounded + fullWidth combination', () => {
      const { getByText } = render(
        <Button title="Round Full" onPress={() => {}} rounded fullWidth />
      );
      expect(getByText('Round Full')).toBeTruthy();
    });
  });
});
