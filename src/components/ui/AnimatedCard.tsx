import React, { useRef, useEffect } from 'react';
import { StyleSheet, ViewStyle, Animated, Pressable } from 'react-native';
import { Colors, BorderRadius, Shadows, Spacing } from '../../constants/theme';

interface AnimatedCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'elevated' | 'outlined' | 'filled' | 'glass' | 'gradient' | 'neumorphic';
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  onPress?: () => void;
  activeOpacity?: number;
  animateOnMount?: boolean;
  delay?: number;
}

export function AnimatedCard({
  children,
  style,
  variant = 'elevated',
  padding = 'md',
  radius = 'xl',
  onPress,
  activeOpacity: _activeOpacity = 0.98,
  animateOnMount = true,
  delay = 0,
}: AnimatedCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(animateOnMount ? 0 : 1)).current;
  const translateYAnim = useRef(new Animated.Value(animateOnMount ? 20 : 0)).current;

  useEffect(() => {
    if (animateOnMount) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          delay,
          useNativeDriver: true,
        }),
        Animated.spring(translateYAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          delay,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [animateOnMount, delay, fadeAnim, translateYAnim]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      tension: 100,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 100,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

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
          borderWidth: 1.5,
          borderColor: Colors.light.border,
        };
      case 'filled':
        return {
          backgroundColor: Colors.light.surfaceSecondary,
        };
      case 'glass':
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.5)',
          ...Shadows.sm,
        };
      case 'gradient':
        return {
          backgroundColor: Colors.light.surface,
          borderWidth: 1.5,
          borderColor: Colors.light.primary + '30',
          ...Shadows.primary,
        };
      case 'neumorphic':
        return {
          backgroundColor: Colors.light.background,
          shadowColor: '#000',
          shadowOffset: { width: 4, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 5,
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
      case '3xl':
        return BorderRadius['3xl'];
      default:
        return BorderRadius.xl;
    }
  };

  const cardStyle = [
    styles.card,
    getVariantStyle(),
    { padding: getPaddingValue(), borderRadius: getBorderRadius() },
    style,
  ];

  const animatedStyle = {
    opacity: fadeAnim,
    transform: [{ scale: scaleAnim }, { translateY: translateYAnim }],
  };

  if (onPress) {
    return (
      <Animated.View style={animatedStyle}>
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={cardStyle}
        >
          {children}
        </Pressable>
      </Animated.View>
    );
  }

  return <Animated.View style={[cardStyle, animatedStyle]}>{children}</Animated.View>;
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
});
