import { Tabs } from 'expo-router';
import { Text, View, Platform, StyleSheet, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faShoppingBag, faShoppingCart, faHeart, faUser } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { useCartStore } from '../../src/store/cartStore';
import { Colors, BorderRadius, Shadows } from '../../src/constants/theme';
import { useRef, useEffect } from 'react';

type TabIconProps = {
    name: 'home' | 'products' | 'cart' | 'wishlist' | 'profile';
    focused: boolean;
    color: string;
};

const iconMap: Record<string, IconDefinition> = {
    home: faHome,
    products: faShoppingBag,
    cart: faShoppingCart,
    wishlist: faHeart,
    profile: faUser,
};

const TabIcon = ({ name, focused, color }: TabIconProps) => {
    const icon = iconMap[name];
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: focused ? 1.15 : 1,
            tension: 200,
            friction: 10,
            useNativeDriver: true,
        }).start();
    }, [focused]);

    return (
        <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <FontAwesomeIcon icon={icon} size={22} color={color} />
            </Animated.View>
            {focused && <View style={styles.activeIndicator} />}
        </View>
    );
};

export default function TabsLayout() {
    const cartItems = useCartStore((state) => state.items);
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.light.primary,
                tabBarInactiveTintColor: Colors.light.textTertiary,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderTopWidth: 0,
                    height: Platform.OS === 'ios' ? 88 : 72,
                    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
                    paddingTop: 12,
                    paddingHorizontal: 8,
                    ...Shadows.lg,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -4 },
                    shadowOpacity: 0.08,
                    shadowRadius: 16,
                    elevation: 20,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                    marginTop: 6,
                    letterSpacing: 0.2,
                },
                tabBarItemStyle: {
                    paddingVertical: 4,
                },
                headerShown: false,
            }}>
            <Tabs.Screen
                name='index'
                options={{
                    title: 'Home',
                    tabBarIcon: ({ focused, color }) => <TabIcon name='home' focused={focused} color={color} />,
                }}
            />
            <Tabs.Screen
                name='products'
                options={{
                    title: 'Shop',
                    tabBarIcon: ({ focused, color }) => <TabIcon name='products' focused={focused} color={color} />,
                }}
            />
            <Tabs.Screen
                name='cart'
                options={{
                    title: 'Cart',
                    tabBarIcon: ({ focused, color }) => (
                        <View style={styles.cartIconContainer}>
                            <TabIcon name='cart' focused={focused} color={color} />
                            {cartCount > 0 && (
                                <Animated.View style={styles.badge}>
                                    <Text style={styles.badgeText}>{cartCount > 99 ? '99+' : cartCount}</Text>
                                </Animated.View>
                            )}
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name='wishlist'
                options={{
                    title: 'Wishlist',
                    tabBarIcon: ({ focused, color }) => <TabIcon name='wishlist' focused={focused} color={color} />,
                }}
            />
            <Tabs.Screen
                name='profile'
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ focused, color }) => <TabIcon name='profile' focused={focused} color={color} />,
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 44,
        height: 32,
        borderRadius: BorderRadius.lg,
    },
    iconContainerActive: {
        backgroundColor: Colors.light.primary + '15',
    },
    activeIndicator: {
        position: 'absolute',
        bottom: -8,
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: Colors.light.primary,
    },
    cartIconContainer: {
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: -8,
        right: -14,
        backgroundColor: Colors.light.error,
        borderRadius: BorderRadius.full,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5,
        borderWidth: 2.5,
        borderColor: '#FFFFFF',
        ...Shadows.sm,
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: -0.3,
    },
});
