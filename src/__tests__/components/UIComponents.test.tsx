/**
 * Tests for UI Components
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Loading, Skeleton, ProductCardSkeleton, ListSkeleton } from '../../components/ui/Loading';

describe('Card Component', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <Card>
        <Text>Card Content</Text>
      </Card>
    );
    expect(getByText('Card Content')).toBeTruthy();
  });

  it('renders with different variants', () => {
    const variants = ['elevated', 'outlined', 'filled', 'glass', 'gradient'] as const;

    variants.forEach((variant) => {
      const { getByText } = render(
        <Card variant={variant}>
          <Text>{variant}</Text>
        </Card>
      );
      expect(getByText(variant)).toBeTruthy();
    });
  });

  it('renders with different padding sizes', () => {
    const paddings = ['none', 'xs', 'sm', 'md', 'lg', 'xl'] as const;

    paddings.forEach((padding) => {
      const { getByText } = render(
        <Card padding={padding}>
          <Text>{padding}</Text>
        </Card>
      );
      expect(getByText(padding)).toBeTruthy();
    });
  });

  it('renders with different radius sizes', () => {
    const radii = ['none', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

    radii.forEach((radius) => {
      const { getByText } = render(
        <Card radius={radius}>
          <Text>{radius}</Text>
        </Card>
      );
      expect(getByText(radius)).toBeTruthy();
    });
  });

  it('handles press events when onPress is provided', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Card onPress={onPressMock}>
        <Text>Pressable Card</Text>
      </Card>
    );

    fireEvent.press(getByText('Pressable Card'));
    expect(onPressMock).toHaveBeenCalled();
  });

  it('applies custom styles', () => {
    const { getByText } = render(
      <Card style={{ marginTop: 20 }}>
        <Text>Styled Card</Text>
      </Card>
    );
    expect(getByText('Styled Card')).toBeTruthy();
  });
});

describe('Badge Component', () => {
  it('renders text correctly', () => {
    const { getByText } = render(<Badge text="New" />);
    expect(getByText('New')).toBeTruthy();
  });

  it('renders with different variants', () => {
    const variants = [
      'default',
      'primary',
      'success',
      'warning',
      'error',
      'info',
      'secondary',
    ] as const;

    variants.forEach((variant) => {
      const { getByText } = render(<Badge text={variant} variant={variant} />);
      expect(getByText(variant)).toBeTruthy();
    });
  });

  it('renders with different sizes', () => {
    const sizes = ['sm', 'md', 'lg'] as const;

    sizes.forEach((size) => {
      const { getByText } = render(<Badge text={size} size={size} />);
      expect(getByText(size)).toBeTruthy();
    });
  });

  it('renders with icon', () => {
    const { getByText } = render(<Badge text="With Icon" icon={<Text>🎉</Text>} />);
    expect(getByText('With Icon')).toBeTruthy();
    expect(getByText('🎉')).toBeTruthy();
  });

  it('applies custom styles', () => {
    const { getByText } = render(<Badge text="Styled" style={{ marginLeft: 10 }} />);
    expect(getByText('Styled')).toBeTruthy();
  });
});

describe('Loading Component', () => {
  it('renders loading indicator', () => {
    const { UNSAFE_getByType } = render(<Loading />);
    expect(UNSAFE_getByType('ActivityIndicator' as any)).toBeTruthy();
  });

  it('renders with text', () => {
    const { getByText } = render(<Loading text="Loading..." />);
    expect(getByText('Loading...')).toBeTruthy();
  });

  it('renders in full screen mode', () => {
    const { getByText } = render(<Loading fullScreen text="Full Screen Loading" />);
    expect(getByText('Full Screen Loading')).toBeTruthy();
  });

  it('accepts different sizes', () => {
    const { UNSAFE_getByType } = render(<Loading size="small" />);
    expect(UNSAFE_getByType('ActivityIndicator' as any)).toBeTruthy();
  });

  it('accepts custom color', () => {
    const { UNSAFE_getByType } = render(<Loading color="#FF0000" />);
    expect(UNSAFE_getByType('ActivityIndicator' as any)).toBeTruthy();
  });
});

describe('Skeleton Component', () => {
  it('renders with default props', () => {
    const { UNSAFE_root } = render(<Skeleton />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('renders with custom dimensions', () => {
    const { UNSAFE_root } = render(<Skeleton width={100} height={50} />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('renders with percentage width', () => {
    const { UNSAFE_root } = render(<Skeleton width="80%" />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('renders with custom border radius', () => {
    const { UNSAFE_root } = render(<Skeleton borderRadius={16} />);
    expect(UNSAFE_root).toBeTruthy();
  });
});

describe('ProductCardSkeleton Component', () => {
  it('renders skeleton structure', () => {
    const { UNSAFE_root } = render(<ProductCardSkeleton />);
    expect(UNSAFE_root).toBeTruthy();
  });
});

describe('ListSkeleton Component', () => {
  it('renders default count of items', () => {
    const { UNSAFE_root } = render(<ListSkeleton />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('renders custom count of items', () => {
    const { UNSAFE_root } = render(<ListSkeleton count={3} />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('renders with custom item height', () => {
    const { UNSAFE_root } = render(<ListSkeleton count={2} itemHeight={80} />);
    expect(UNSAFE_root).toBeTruthy();
  });
});
