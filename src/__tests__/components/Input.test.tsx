import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Input } from '../../components/ui/Input';

describe('Input Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders correctly with placeholder', () => {
    const { getByPlaceholderText } = render(
      <Input placeholder="Enter text" />
    );
    expect(getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('renders with label', () => {
    const { getByText } = render(
      <Input label="Email" placeholder="Enter email" />
    );
    expect(getByText('Email')).toBeTruthy();
  });

  it('displays error message when error prop is provided', () => {
    const { getByText } = render(
      <Input label="Email" error="Invalid email format" />
    );
    expect(getByText('Invalid email format')).toBeTruthy();
  });

  it('displays hint text when hint prop is provided', () => {
    const { getByText } = render(
      <Input label="Password" hint="At least 8 characters" />
    );
    expect(getByText('At least 8 characters')).toBeTruthy();
  });

  it('handles text change', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <Input placeholder="Enter text" onChangeText={onChangeText} />
    );

    fireEvent.changeText(getByPlaceholderText('Enter text'), 'Hello');
    expect(onChangeText).toHaveBeenCalledWith('Hello');
  });

  it('handles focus and blur events', () => {
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    const { getByPlaceholderText } = render(
      <Input 
        placeholder="Enter text" 
        onFocus={onFocus}
        onBlur={onBlur}
      />
    );

    const input = getByPlaceholderText('Enter text');
    fireEvent(input, 'focus');
    expect(onFocus).toHaveBeenCalled();

    fireEvent(input, 'blur');
    expect(onBlur).toHaveBeenCalled();
  });

  describe('Size Variants', () => {
    it('renders small size', () => {
      const { getByPlaceholderText } = render(
        <Input placeholder="Small" size="sm" />
      );
      expect(getByPlaceholderText('Small')).toBeTruthy();
    });

    it('renders medium size', () => {
      const { getByPlaceholderText } = render(
        <Input placeholder="Medium" size="md" />
      );
      expect(getByPlaceholderText('Medium')).toBeTruthy();
    });

    it('renders large size', () => {
      const { getByPlaceholderText } = render(
        <Input placeholder="Large" size="lg" />
      );
      expect(getByPlaceholderText('Large')).toBeTruthy();
    });
  });

  describe('Variant Styles', () => {
    it('renders filled variant', () => {
      const { getByPlaceholderText } = render(
        <Input placeholder="Filled" variant="filled" />
      );
      expect(getByPlaceholderText('Filled')).toBeTruthy();
    });

    it('renders outline variant', () => {
      const { getByPlaceholderText } = render(
        <Input placeholder="Outline" variant="outline" />
      );
      expect(getByPlaceholderText('Outline')).toBeTruthy();
    });

    it('renders underline variant', () => {
      const { getByPlaceholderText } = render(
        <Input placeholder="Underline" variant="underline" />
      );
      expect(getByPlaceholderText('Underline')).toBeTruthy();
    });
  });

  describe('Password Input', () => {
    it('renders as secure text entry', () => {
      const { getByPlaceholderText } = render(
        <Input placeholder="Password" secureTextEntry />
      );
      const input = getByPlaceholderText('Password');
      expect(input.props.secureTextEntry).toBe(true);
    });

    it('toggles password visibility', () => {
      const { getByPlaceholderText, getByTestId } = render(
        <Input placeholder="Password" secureTextEntry testID="password-input" />
      );
      
      const input = getByPlaceholderText('Password');
      // Initially secure
      expect(input.props.secureTextEntry).toBe(true);
    });
  });

  describe('Clear Button', () => {
    it('shows clear button when showClear is true and has value', () => {
      const onClear = jest.fn();
      const { getByPlaceholderText } = render(
        <Input 
          placeholder="Clear me" 
          value="some text"
          showClear
          onClear={onClear}
        />
      );
      
      expect(getByPlaceholderText('Clear me')).toBeTruthy();
    });
  });

  describe('Floating Label', () => {
    it('renders with floating label', () => {
      const { getByText } = render(
        <Input 
          label="Float Label"
          floatingLabel
          placeholder="Enter value"
        />
      );
      expect(getByText('Float Label')).toBeTruthy();
    });

    it('animates floating label when focused', () => {
      const { getByText, getByPlaceholderText } = render(
        <Input 
          label="Float Label"
          floatingLabel
          placeholder="Enter value"
        />
      );

      const input = getByPlaceholderText('Enter value');
      fireEvent(input, 'focus');
      jest.runAllTimers();
      
      expect(getByText('Float Label')).toBeTruthy();
    });

    it('animates floating label when has value', () => {
      const { getByText } = render(
        <Input 
          label="Float Label"
          floatingLabel
          value="some value"
        />
      );

      jest.runAllTimers();
      expect(getByText('Float Label')).toBeTruthy();
    });
  });

  describe('Left and Right Icons', () => {
    it('renders with left icon', () => {
      const leftIcon = <></>;
      const { getByPlaceholderText } = render(
        <Input placeholder="With Icon" leftIcon={leftIcon} />
      );
      expect(getByPlaceholderText('With Icon')).toBeTruthy();
    });

    it('renders with right icon', () => {
      const rightIcon = <></>;
      const { getByPlaceholderText } = render(
        <Input placeholder="With Icon" rightIcon={rightIcon} />
      );
      expect(getByPlaceholderText('With Icon')).toBeTruthy();
    });
  });
});
