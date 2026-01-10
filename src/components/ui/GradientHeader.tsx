import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Platform, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faBell, faSearch, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius } from '../../constants/theme';

interface GradientHeaderProps {
    title?: string;
    subtitle?: string;
    showBack?: boolean;
    onBack?: () => void;
    showSearch?: boolean;
    onSearch?: () => void;
    showNotification?: boolean;
    onNotification?: () => void;
    notificationCount?: number;
    showMenu?: boolean;
    onMenu?: () => void;
    rightContent?: React.ReactNode;
    variant?: 'gradient' | 'solid' | 'transparent';
    gradientColors?: string[];
    style?: ViewStyle;
}

export function GradientHeader({
    title,
    subtitle,
    showBack = false,
    onBack,
    showSearch = false,
    onSearch,
    showNotification = false,
    onNotification,
    notificationCount = 0,
    showMenu = false,
    onMenu,
    rightContent,
    variant = 'gradient',
    gradientColors = [Colors.light.primary, Colors.light.primaryDark],
    style,
}: GradientHeaderProps) {
    const insets = useSafeAreaInsets();

    const headerContent = (
        <View style={[styles.container, { paddingTop: insets.top + 8 }, style]}>
            <View style={styles.leftSection}>
                {showBack && (
                    <TouchableOpacity style={styles.iconButton} onPress={onBack} activeOpacity={0.7}>
                        <FontAwesomeIcon icon={faArrowLeft} size={20} color='#FFFFFF' />
                    </TouchableOpacity>
                )}
                <View style={styles.titleContainer}>
                    {title && (
                        <Text style={styles.title} numberOfLines={1}>
                            {title}
                        </Text>
                    )}
                    {subtitle && (
                        <Text style={styles.subtitle} numberOfLines={1}>
                            {subtitle}
                        </Text>
                    )}
                </View>
            </View>

            <View style={styles.rightSection}>
                {showSearch && (
                    <TouchableOpacity style={styles.iconButton} onPress={onSearch} activeOpacity={0.7}>
                        <FontAwesomeIcon icon={faSearch} size={18} color='#FFFFFF' />
                    </TouchableOpacity>
                )}
                {showNotification && (
                    <TouchableOpacity style={styles.iconButton} onPress={onNotification} activeOpacity={0.7}>
                        <FontAwesomeIcon icon={faBell} size={18} color='#FFFFFF' />
                        {notificationCount > 0 && (
                            <View style={styles.notificationBadge}>
                                <Text style={styles.notificationCount}>{notificationCount > 99 ? '99+' : notificationCount}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                )}
                {showMenu && (
                    <TouchableOpacity style={styles.iconButton} onPress={onMenu} activeOpacity={0.7}>
                        <FontAwesomeIcon icon={faEllipsisV} size={18} color='#FFFFFF' />
                    </TouchableOpacity>
                )}
                {rightContent}
            </View>
        </View>
    );

    if (variant === 'gradient') {
        return (
            <>
                <StatusBar barStyle='light-content' />
                <LinearGradient colors={gradientColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                    {headerContent}
                </LinearGradient>
            </>
        );
    }

    if (variant === 'transparent') {
        return (
            <>
                <StatusBar barStyle='dark-content' />
                <View style={[{ backgroundColor: 'transparent' }]}>{headerContent}</View>
            </>
        );
    }

    return (
        <>
            <StatusBar barStyle='light-content' />
            <View style={[{ backgroundColor: Colors.light.primary }]}>{headerContent}</View>
        </>
    );
}

// Modern Search Header with input
interface SearchHeaderProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    onBack?: () => void;
    onFilter?: () => void;
    autoFocus?: boolean;
}

export function SearchHeader({ value, onChangeText, placeholder = 'Search products...', onBack, onFilter, autoFocus = true }: SearchHeaderProps) {
    const insets = useSafeAreaInsets();

    return (
        <LinearGradient colors={[Colors.light.primary, Colors.light.primaryDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <StatusBar barStyle='light-content' />
            <View style={[styles.searchContainer, { paddingTop: insets.top + 8 }]}>
                {onBack && (
                    <TouchableOpacity style={styles.searchBackButton} onPress={onBack} activeOpacity={0.7}>
                        <FontAwesomeIcon icon={faArrowLeft} size={20} color='#FFFFFF' />
                    </TouchableOpacity>
                )}
                <View style={styles.searchInputContainer}>
                    <FontAwesomeIcon icon={faSearch} size={16} color={Colors.light.textTertiary} style={styles.searchIcon} />
                    <Text style={styles.searchPlaceholder}>{value || placeholder}</Text>
                </View>
                {onFilter && (
                    <TouchableOpacity style={styles.filterButton} onPress={onFilter} activeOpacity={0.7}>
                        <Text style={styles.filterText}>Filter</Text>
                    </TouchableOpacity>
                )}
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.base,
        paddingBottom: Spacing.md,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    titleContainer: {
        marginLeft: Spacing.sm,
        flex: 1,
    },
    title: {
        fontSize: FontSizes.xl,
        fontWeight: FontWeights.bold,
        color: '#FFFFFF',
        letterSpacing: -0.3,
    },
    subtitle: {
        fontSize: FontSizes.sm,
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 2,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        position: 'relative',
    },
    notificationBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: Colors.light.error,
        borderRadius: BorderRadius.full,
        minWidth: 18,
        height: 18,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
        borderWidth: 2,
        borderColor: Colors.light.primary,
    },
    notificationCount: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: FontWeights.bold,
    },
    // Search Header styles
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.base,
        paddingBottom: Spacing.md,
        gap: Spacing.sm,
    },
    searchBackButton: {
        width: 40,
        height: 40,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchInputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: BorderRadius.lg,
        paddingHorizontal: Spacing.md,
        height: 44,
    },
    searchIcon: {
        marginRight: Spacing.sm,
    },
    searchPlaceholder: {
        flex: 1,
        fontSize: FontSizes.base,
        color: Colors.light.textTertiary,
    },
    filterButton: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
    },
    filterText: {
        color: '#FFFFFF',
        fontSize: FontSizes.base,
        fontWeight: FontWeights.semibold,
    },
});
