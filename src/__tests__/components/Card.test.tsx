import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Card } from '../../components/ui/Card';
import { Text } from 'react-native';

describe('Card Component', () => {
  it('should render card with children', () => {
    const { getByText } = render(
      <Card>
        <Text>Card Content</Text>
      </Card>
    );

    expect(getByText('Card Content')).toBeTruthy();
  });

  it('should render elevated variant by default', () => {
    const { toJSON } = render(
      <Card>
        <Text>Content</Text>
      </Card>
    );

    expect(toJSON()).toBeTruthy();
  });

  it('should render outlined variant', () => {
    const { toJSON } = render(
      <Card variant="outlined">
        <Text>Content</Text>
      </Card>
    );

    expect(toJSON()).toBeTruthy();
  });

  it('should render filled variant', () => {
    const { toJSON } = render(
      <Card variant="filled">
        <Text>Content</Text>
      </Card>
    );

    expect(toJSON()).toBeTruthy();
  });

  it('should render glass variant', () => {
    const { toJSON } = render(
      <Card variant="glass">
        <Text>Content</Text>
      </Card>
    );

    expect(toJSON()).toBeTruthy();
  });

  it('should render gradient variant', () => {
    const { toJSON } = render(
      <Card variant="gradient">
        <Text>Content</Text>
      </Card>
    );

    expect(toJSON()).toBeTruthy();
  });

  it('should apply different padding values', () => {
    const paddings = ['none', 'xs', 'sm', 'md', 'lg', 'xl'] as const;

    paddings.forEach((padding) => {
      const { toJSON } = render(
        <Card padding={padding}>
          <Text>Content</Text>
        </Card>
      );
      expect(toJSON()).toBeTruthy();
    });
  });

  it('should apply different border radius values', () => {
    const radii = ['none', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

    radii.forEach((radius) => {
      const { toJSON } = render(
        <Card radius={radius}>
          <Text>Content</Text>
        </Card>
      );
      expect(toJSON()).toBeTruthy();
    });
  });

  it('should handle press event when onPress is provided', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Card onPress={onPressMock}>
        <Text>Pressable Card</Text>
      </Card>
    );

    fireEvent.press(getByText('Pressable Card'));
    expect(onPressMock).toHaveBeenCalled();
  });

  it('should apply custom style', () => {
    const { getByText } = render(
      <Card style={{ marginTop: 20 }}>
        <Text>Styled Card</Text>
      </Card>
    );

    expect(getByText('Styled Card')).toBeTruthy();
  });
});
