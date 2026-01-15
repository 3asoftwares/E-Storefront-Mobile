import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity, Animated } from 'react-native';
import { Colors, BorderRadius, Shadows, Spacing } from '../../constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'elevated' | 'outlined' | 'filled' | 'glass' | 'gradient';
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  onPress?: () => void;
  activeOpacity?: number;
}

export function Card({
  children,
  style,
  variant = 'elevated',
  padding = 'md',
  radius = 'lg',
  onPress,
  activeOpacity = 0.95,
}: CardProps) {
  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: Colors.light.surface,
          ...Shadows.md,
        };
      case 'outlined':
        return {
          backgroundColor: Colors.light.surface,
          borderWidth: 1,
          borderColor: Colors.light.border,
        };
      case 'filled':
        return {
          backgroundColor: Colors.light.surfaceSecondary,
        };
      case 'glass':
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.3)',
          ...Shadows.sm,
        };
      case 'gradient':
        return {
          backgroundColor: Colors.light.surface,
          borderWidth: 1,
          borderColor: Colors.light.primary + '30',
          ...Shadows.primary,
        };
      default:
        return {
          backgroundColor: Colors.light.surface,
          ...Shadows.md,
        };
    }
  };

  const getPaddingValue = () => {
    switch (padding) {
      case 'none':
        return 0;
      case 'xs':
        return Spacing.xs;
      case 'sm':
        return Spacing.sm;
      case 'lg':
        return Spacing.lg;
      case 'xl':
        return Spacing.xl;
      default:
        return Spacing.base;
    }
  };

  const getBorderRadius = () => {
    switch (radius) {
      case 'none':
        return BorderRadius.none;
      case 'sm':
        return BorderRadius.sm;
      case 'md':
        return BorderRadius.md;
      case 'lg':
        return BorderRadius.lg;
      case 'xl':
        return BorderRadius.xl;
      case '2xl':
        return BorderRadius['2xl'];
      default:
        return BorderRadius.lg;
    }
  };

  const cardStyle = [
    styles.card,
    getVariantStyle(),
    {
      padding: getPaddingValue(),
      borderRadius: getBorderRadius(),
    },
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity style={cardStyle} onPress={onPress} activeOpacity={activeOpacity}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
});
