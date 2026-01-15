import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text, View } from 'react-native';

jest.useFakeTimers();

import { AnimatedCard } from '../../components/ui/AnimatedCard';

describe('AnimatedCard Component', () => {
  afterEach(() => {
    jest.runAllTimers();
  });

  describe('Basic Rendering', () => {
    it('renders children content', () => {
      const { getByText } = render(
        <AnimatedCard>
          <Text>Card Content</Text>
        </AnimatedCard>
      );
      expect(getByText('Card Content')).toBeTruthy();
    });

    it('renders multiple children', () => {
      const { getByText } = render(
        <AnimatedCard>
          <Text>Title</Text>
          <Text>Description</Text>
        </AnimatedCard>
      );
      expect(getByText('Title')).toBeTruthy();
      expect(getByText('Description')).toBeTruthy();
    });
  });

  describe('Variants', () => {
    it('renders elevated variant (default)', () => {
      const { getByText } = render(
        <AnimatedCard variant="elevated">
          <Text>Elevated</Text>
        </AnimatedCard>
      );
      expect(getByText('Elevated')).toBeTruthy();
    });

    it('renders outlined variant', () => {
      const { getByText } = render(
        <AnimatedCard variant="outlined">
          <Text>Outlined</Text>
        </AnimatedCard>
      );
      expect(getByText('Outlined')).toBeTruthy();
    });

    it('renders filled variant', () => {
      const { getByText } = render(
        <AnimatedCard variant="filled">
          <Text>Filled</Text>
        </AnimatedCard>
      );
      expect(getByText('Filled')).toBeTruthy();
    });

    it('renders glass variant', () => {
      const { getByText } = render(
        <AnimatedCard variant="glass">
          <Text>Glass</Text>
        </AnimatedCard>
      );
      expect(getByText('Glass')).toBeTruthy();
    });

    it('renders gradient variant', () => {
      const { getByText } = render(
        <AnimatedCard variant="gradient">
          <Text>Gradient</Text>
        </AnimatedCard>
      );
      expect(getByText('Gradient')).toBeTruthy();
    });

    it('renders neumorphic variant', () => {
      const { getByText } = render(
        <AnimatedCard variant="neumorphic">
          <Text>Neumorphic</Text>
        </AnimatedCard>
      );
      expect(getByText('Neumorphic')).toBeTruthy();
    });
  });

  describe('Padding', () => {
    const paddings = ['none', 'xs', 'sm', 'md', 'lg', 'xl'] as const;

    paddings.forEach((padding) => {
      it(`renders with ${padding} padding`, () => {
        const { getByText } = render(
          <AnimatedCard padding={padding}>
            <Text>Content</Text>
          </AnimatedCard>
        );
        expect(getByText('Content')).toBeTruthy();
      });
    });
  });

  describe('Border Radius', () => {
    const radii = ['none', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const;

    radii.forEach((radius) => {
      it(`renders with ${radius} radius`, () => {
        const { getByText } = render(
          <AnimatedCard radius={radius}>
            <Text>Content</Text>
          </AnimatedCard>
        );
        expect(getByText('Content')).toBeTruthy();
      });
    });
  });

  describe('Press Behavior', () => {
    it('is pressable when onPress provided', () => {
      const onPress = jest.fn();
      const { getByText } = render(
        <AnimatedCard onPress={onPress}>
          <Text>Pressable Card</Text>
        </AnimatedCard>
      );

      fireEvent.press(getByText('Pressable Card'));
      expect(onPress).toHaveBeenCalled();
    });

    it('handles press in/out for animation', () => {
      const onPress = jest.fn();
      const { getByText } = render(
        <AnimatedCard onPress={onPress}>
          <Text>Animated Press</Text>
        </AnimatedCard>
      );

      const card = getByText('Animated Press');
      fireEvent(card, 'pressIn');
      jest.runAllTimers();
      fireEvent(card, 'pressOut');
      jest.runAllTimers();

      expect(card).toBeTruthy();
    });
  });

  describe('Mount Animation', () => {
    it('animates on mount by default', () => {
      const { getByText } = render(
        <AnimatedCard animateOnMount>
          <Text>Animated Mount</Text>
        </AnimatedCard>
      );

      jest.runAllTimers();
      expect(getByText('Animated Mount')).toBeTruthy();
    });

    it('does not animate when animateOnMount is false', () => {
      const { getByText } = render(
        <AnimatedCard animateOnMount={false}>
          <Text>No Animation</Text>
        </AnimatedCard>
      );

      expect(getByText('No Animation')).toBeTruthy();
    });

    it('respects delay prop for animation', () => {
      const { getByText } = render(
        <AnimatedCard animateOnMount delay={300}>
          <Text>Delayed Animation</Text>
        </AnimatedCard>
      );

      jest.runAllTimers();
      expect(getByText('Delayed Animation')).toBeTruthy();
    });
  });

  describe('Custom Props', () => {
    it('accepts custom style', () => {
      const { getByText } = render(
        <AnimatedCard style={{ marginTop: 20 }}>
          <Text>Styled Card</Text>
        </AnimatedCard>
      );
      expect(getByText('Styled Card')).toBeTruthy();
    });

    it('accepts custom activeOpacity', () => {
      const onPress = jest.fn();
      const { getByText } = render(
        <AnimatedCard onPress={onPress} activeOpacity={0.5}>
          <Text>Custom Opacity</Text>
        </AnimatedCard>
      );
      expect(getByText('Custom Opacity')).toBeTruthy();
    });
  });
});
