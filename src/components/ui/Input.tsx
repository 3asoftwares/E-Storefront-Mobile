import React, { useState, useRef, useEffect } from 'react';
import { TextInput as RNTextInput, View, Text, StyleSheet, TextInputProps as RNTextInputProps, ViewStyle, Animated, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faEyeSlash, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { Colors, BorderRadius, Spacing, FontSizes, FontWeights, Shadows } from '../../constants/theme';

type InputVariant = 'default' | 'filled' | 'outline' | 'underline';
type InputSize = 'sm' | 'md' | 'lg';

interface InputProps extends RNTextInputProps {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    containerStyle?: ViewStyle;
    variant?: InputVariant;
    size?: InputSize;
    showClear?: boolean;
    onClear?: () => void;
    floatingLabel?: boolean;
}

export function Input({
    label,
    error,
    hint,
    leftIcon,
    rightIcon,
    containerStyle,
    style,
    variant = 'default',
    size = 'md',
    showClear = false,
    onClear,
    floatingLabel = false,
    value,
    onFocus,
    onBlur,
    secureTextEntry,
    ...props
}: InputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const hasError = !!error;
    const hasValue = !!value && value.length > 0;

    const labelAnim = useRef(new Animated.Value(hasValue ? 1 : 0)).current;
    const borderAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (floatingLabel) {
            Animated.timing(labelAnim, {
                toValue: isFocused || hasValue ? 1 : 0,
                duration: 150,
                useNativeDriver: false,
            }).start();
        }
    }, [isFocused, hasValue, floatingLabel]);

    useEffect(() => {
        Animated.timing(borderAnim, {
            toValue: isFocused ? 1 : 0,
            duration: 150,
            useNativeDriver: false,
        }).start();
    }, [isFocused]);

    const handleFocus = (e: any) => {
        setIsFocused(true);
        onFocus?.(e);
    };

    const handleBlur = (e: any) => {
        setIsFocused(false);
        onBlur?.(e);
    };

    const getSizeStyles = () => {
        switch (size) {
            case 'sm':
                return { paddingVertical: Spacing.sm, fontSize: FontSizes.sm, height: 40 };
            case 'lg':
                return { paddingVertical: Spacing.lg, fontSize: FontSizes.lg, height: 56 };
            default:
                return { paddingVertical: Spacing.md, fontSize: FontSizes.base, height: 48 };
        }
    };

    const getVariantStyles = (): ViewStyle => {
        switch (variant) {
            case 'filled':
                return {
                    backgroundColor: Colors.light.surfaceSecondary,
                    borderWidth: 0,
                    borderBottomWidth: 2,
                    borderColor: isFocused ? Colors.light.primary : Colors.light.border,
                    borderRadius: BorderRadius.md,
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                };
            case 'underline':
                return {
                    backgroundColor: 'transparent',
                    borderWidth: 0,
                    borderBottomWidth: 2,
                    borderColor: isFocused ? Colors.light.primary : Colors.light.border,
                    borderRadius: 0,
                };
            case 'outline':
                return {
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderColor: isFocused ? Colors.light.primary : Colors.light.border,
                    borderRadius: BorderRadius.lg,
                };
            default:
                return {
                    backgroundColor: Colors.light.surface,
                    borderWidth: 1.5,
                    borderColor: isFocused ? Colors.light.primary : Colors.light.border,
                    borderRadius: BorderRadius.lg,
                    ...(isFocused ? Shadows.xs : {}),
                };
        }
    };

    const sizeStyles = getSizeStyles();

    const animatedBorderColor = borderAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [Colors.light.border, Colors.light.primary],
    });

    const labelTranslateY = labelAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [sizeStyles.height / 2 - 8, -10],
    });

    const labelScale = labelAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0.85],
    });

    const labelColor = labelAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [Colors.light.textTertiary, isFocused ? Colors.light.primary : Colors.light.textSecondary],
    });

    return (
        <View style={[styles.container, containerStyle]}>
            {label && !floatingLabel && <Text style={styles.label}>{label}</Text>}

            <Animated.View
                style={[
                    styles.inputContainer,
                    getVariantStyles(),
                    hasError && styles.inputError,
                    props.editable === false && styles.inputDisabled,
                    { height: sizeStyles.height },
                ]}>
                {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

                {floatingLabel && label && (
                    <Animated.Text
                        style={[
                            styles.floatingLabel,
                            {
                                transform: [{ translateY: labelTranslateY }, { scale: labelScale }],
                                color: labelColor,
                                left: leftIcon ? 44 : Spacing.base,
                            },
                        ]}>
                        {label}
                    </Animated.Text>
                )}

                <RNTextInput
                    style={[
                        styles.input,
                        { fontSize: sizeStyles.fontSize },
                        leftIcon ? styles.inputWithLeftIcon : null,
                        rightIcon || showClear || secureTextEntry ? styles.inputWithRightIcon : null,
                        floatingLabel && (isFocused || hasValue) ? styles.inputWithFloatingLabel : null,
                        style,
                    ]}
                    placeholderTextColor={Colors.light.textTertiary}
                    value={value}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    secureTextEntry={secureTextEntry && !isPasswordVisible}
                    {...props}
                />

                <View style={styles.rightSection}>
                    {showClear && hasValue && (
                        <TouchableOpacity onPress={onClear} style={styles.iconButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <FontAwesomeIcon icon={faCircleXmark} size={18} color={Colors.light.textTertiary} />
                        </TouchableOpacity>
                    )}
                    {secureTextEntry && (
                        <TouchableOpacity
                            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                            style={styles.iconButton}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <FontAwesomeIcon icon={isPasswordVisible ? faEyeSlash : faEye} size={18} color={Colors.light.textTertiary} />
                        </TouchableOpacity>
                    )}
                    {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
                </View>
            </Animated.View>

            {(error || hint) && (
                <View style={styles.helperContainer}>
                    <Text style={[styles.helperText, hasError && styles.errorText]}>{error || hint}</Text>
                </View>
            )}
        </View>
    );
}

// Modern Search Input
interface SearchInputProps extends Omit<InputProps, 'variant'> {
    onSearch?: () => void;
}

export function SearchInput({ onSearch, ...props }: SearchInputProps) {
    return (
        <Input
            variant='filled'
            placeholder='Search products...'
            showClear
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            leftIcon={<FontAwesomeIcon icon={require('@fortawesome/free-solid-svg-icons').faSearch} size={16} color={Colors.light.textTertiary} />}
            {...props}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.base,
    },
    label: {
        fontSize: FontSizes.sm,
        fontWeight: FontWeights.semibold,
        color: Colors.light.text,
        marginBottom: Spacing.sm,
        letterSpacing: 0.2,
    },
    floatingLabel: {
        position: 'absolute',
        fontSize: FontSizes.base,
        fontWeight: FontWeights.medium,
        backgroundColor: Colors.light.surface,
        paddingHorizontal: 4,
        zIndex: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
    },
    inputError: {
        borderColor: Colors.light.error,
    },
    inputDisabled: {
        backgroundColor: Colors.light.surfaceSecondary,
        opacity: 0.6,
    },
    input: {
        flex: 1,
        paddingHorizontal: Spacing.base,
        color: Colors.light.text,
        fontWeight: FontWeights.normal,
    },
    inputWithLeftIcon: {
        paddingLeft: Spacing.xs,
    },
    inputWithRightIcon: {
        paddingRight: Spacing.xs,
    },
    inputWithFloatingLabel: {
        paddingTop: Spacing.sm,
    },
    leftIcon: {
        paddingLeft: Spacing.md,
        marginRight: Spacing.xs,
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: Spacing.sm,
    },
    rightIcon: {
        marginLeft: Spacing.xs,
    },
    iconButton: {
        padding: Spacing.xs,
    },
    helperContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Spacing.xs,
        paddingHorizontal: Spacing.xs,
    },
    helperText: {
        fontSize: FontSizes.xs,
        color: Colors.light.textSecondary,
        flex: 1,
    },
    errorText: {
        color: Colors.light.error,
    },
});
