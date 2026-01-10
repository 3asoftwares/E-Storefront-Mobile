import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle, View, Animated } from 'react-native';
import { Colors, BorderRadius, Spacing, FontSizes, FontWeights, Shadows } from '../../constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'accent' | 'soft';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    fullWidth?: boolean;
    rounded?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export function Button({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    rounded = false,
    style,
    textStyle,
}: ButtonProps) {
    const getBackgroundColor = () => {
        if (disabled) return Colors.light.borderLight;

        switch (variant) {
            case 'primary':
                return Colors.light.primary;
            case 'secondary':
                return Colors.light.secondary;
            case 'accent':
                return Colors.light.accent;
            case 'danger':
                return Colors.light.error;
            case 'soft':
                return Colors.light.primary + '15';
            case 'outline':
            case 'ghost':
                return 'transparent';
            default:
                return Colors.light.primary;
        }
    };

    const getTextColor = () => {
        if (disabled) return Colors.light.textTertiary;

        switch (variant) {
            case 'primary':
            case 'secondary':
            case 'accent':
            case 'danger':
                return Colors.light.textInverse;
            case 'outline':
            case 'soft':
                return Colors.light.primary;
            case 'ghost':
                return Colors.light.text;
            default:
                return Colors.light.textInverse;
        }
    };

    const getBorderColor = () => {
        if (disabled) return Colors.light.borderDark;

        switch (variant) {
            case 'outline':
                return Colors.light.primary;
            default:
                return 'transparent';
        }
    };

    const getShadow = () => {
        if (disabled || variant === 'ghost' || variant === 'outline' || variant === 'soft') {
            return {};
        }
        switch (variant) {
            case 'primary':
                return Shadows.primary;
            case 'accent':
                return Shadows.accent;
            default:
                return Shadows.sm;
        }
    };

    const getPadding = () => {
        switch (size) {
            case 'xs':
                return { paddingVertical: Spacing.xs + 2, paddingHorizontal: Spacing.sm + 2 };
            case 'sm':
                return { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md };
            case 'lg':
                return { paddingVertical: Spacing.base, paddingHorizontal: Spacing.xl };
            case 'xl':
                return { paddingVertical: Spacing.lg, paddingHorizontal: Spacing['2xl'] };
            default:
                return { paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg };
        }
    };

    const getFontSize = () => {
        switch (size) {
            case 'xs':
                return FontSizes.xs;
            case 'sm':
                return FontSizes.sm;
            case 'lg':
                return FontSizes.lg;
            case 'xl':
                return FontSizes.xl;
            default:
                return FontSizes.base;
        }
    };

    const getBorderRadius = () => {
        if (rounded) return BorderRadius.full;
        switch (size) {
            case 'xs':
            case 'sm':
                return BorderRadius.sm;
            case 'lg':
            case 'xl':
                return BorderRadius.lg;
            default:
                return BorderRadius.md;
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                getPadding(),
                {
                    backgroundColor: getBackgroundColor(),
                    borderColor: getBorderColor(),
                    borderWidth: variant === 'outline' ? 1.5 : 0,
                    borderRadius: getBorderRadius(),
                },
                fullWidth && styles.fullWidth,
                getShadow(),
                style,
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}>
            {loading ? (
                <ActivityIndicator color={getTextColor()} size='small' />
            ) : (
                <View style={styles.content}>
                    {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
                    <Text style={[styles.text, { color: getTextColor(), fontSize: getFontSize() }, size === 'xl' && { letterSpacing: 0.5 }, textStyle]}>
                        {title}
                    </Text>
                    {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    fullWidth: {
        width: '100%',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontWeight: FontWeights.semibold,
        letterSpacing: 0.3,
    },
    iconLeft: {
        marginRight: Spacing.sm,
    },
    iconRight: {
        marginLeft: Spacing.sm,
    },
});
