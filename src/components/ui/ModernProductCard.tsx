import React, { useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, Animated, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart as faHeartSolid, faStar, faPlus, faShoppingBag, faBolt } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { Colors, BorderRadius, Spacing, FontSizes, FontWeights, Shadows } from '../../constants/theme';
import { useCartStore } from '../../store/cartStore';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - Spacing.base * 3) / 2;
const LARGE_CARD_WIDTH = width - Spacing.base * 2;

interface Product {
    id: string;
    name: string;
    price: number;
    salePrice?: number;
    compareAtPrice?: number;
    images?: string[];
    image?: string;
    rating?: number;
    reviewCount?: number;
    stock?: number;
    category?: { name: string };
    isNew?: boolean;
    isBestseller?: boolean;
}

interface ModernProductCardProps {
    product: Product;
    variant?: 'grid' | 'horizontal' | 'compact' | 'featured' | 'minimal';
    onPress?: () => void;
    index?: number;
}

export function ModernProductCard({ product, variant = 'grid', onPress, index = 0 }: ModernProductCardProps) {
    const router = useRouter();
    const addToCart = useCartStore((state) => state.addToCart);
    const toggleWishlistItem = useCartStore((state) => state.toggleWishlistItem);
    const isInWishlist = useCartStore((state) => state.wishlist.some((item) => item.productId === product.id));

    const scaleAnim = useRef(new Animated.Value(1)).current;
    const heartAnim = useRef(new Animated.Value(1)).current;

    const imageUrl = product.images?.[0] || product.image || 'https://via.placeholder.com/200';
    const actualPrice = product.salePrice || product.price;
    const originalPrice = product.salePrice ? product.price : product.compareAtPrice;
    const hasDiscount = originalPrice && originalPrice > actualPrice;
    const discountPercent = hasDiscount ? Math.round((1 - actualPrice / originalPrice) * 100) : 0;
    const isOutOfStock = product.stock === 0;

    const handlePress = () => {
        if (onPress) {
            onPress();
        } else {
            router.push(`/product/${product.id}`);
        }
    };

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.97,
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

    const handleWishlistToggle = () => {
        Animated.sequence([
            Animated.spring(heartAnim, {
                toValue: 1.3,
                tension: 200,
                friction: 5,
                useNativeDriver: true,
            }),
            Animated.spring(heartAnim, {
                toValue: 1,
                tension: 200,
                friction: 5,
                useNativeDriver: true,
            }),
        ]).start();

        toggleWishlistItem({
            id: product.id,
            name: product.name,
            price: actualPrice,
            image: imageUrl,
        });
    };

    const handleAddToCart = () => {
        addToCart({
            productId: product.id,
            name: product.name,
            price: actualPrice,
            image: imageUrl,
            quantity: 1,
            variant: undefined,
        });
    };

    // Featured variant - large horizontal card
    if (variant === 'featured') {
        return (
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Pressable style={[styles.featuredCard, Shadows.lg]} onPress={handlePress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
                    <Image source={{ uri: imageUrl }} style={styles.featuredImage} />
                    <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.featuredGradient}>
                        <View style={styles.featuredBadges}>
                            {product.isNew && (
                                <View style={styles.newBadge}>
                                    <FontAwesomeIcon icon={faBolt} size={10} color='#FFFFFF' />
                                    <Text style={styles.newBadgeText}>NEW</Text>
                                </View>
                            )}
                            {hasDiscount && (
                                <View style={styles.saleBadge}>
                                    <Text style={styles.saleBadgeText}>-{discountPercent}%</Text>
                                </View>
                            )}
                        </View>
                        <View style={styles.featuredContent}>
                            <Text style={styles.featuredName} numberOfLines={2}>
                                {product.name}
                            </Text>
                            <View style={styles.featuredPriceRow}>
                                <Text style={styles.featuredPrice}>${actualPrice.toFixed(2)}</Text>
                                {hasDiscount && <Text style={styles.featuredOriginalPrice}>${originalPrice.toFixed(2)}</Text>}
                            </View>
                        </View>
                        <TouchableOpacity style={styles.featuredCartButton} onPress={handleAddToCart}>
                            <FontAwesomeIcon icon={faShoppingBag} size={18} color='#FFFFFF' />
                        </TouchableOpacity>
                    </LinearGradient>
                    <Animated.View style={{ transform: [{ scale: heartAnim }] }}>
                        <TouchableOpacity style={styles.featuredWishlistButton} onPress={handleWishlistToggle}>
                            <FontAwesomeIcon
                                icon={isInWishlist ? faHeartSolid : faHeartRegular}
                                size={18}
                                color={isInWishlist ? Colors.light.error : '#FFFFFF'}
                            />
                        </TouchableOpacity>
                    </Animated.View>
                </Pressable>
            </Animated.View>
        );
    }

    // Horizontal variant
    if (variant === 'horizontal') {
        return (
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Pressable style={[styles.horizontalCard, Shadows.sm]} onPress={handlePress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
                    <View style={styles.horizontalImageContainer}>
                        <Image source={{ uri: imageUrl }} style={styles.horizontalImage} />
                        {hasDiscount && (
                            <View style={styles.horizontalDiscountBadge}>
                                <Text style={styles.horizontalDiscountText}>-{discountPercent}%</Text>
                            </View>
                        )}
                    </View>
                    <View style={styles.horizontalContent}>
                        <View style={styles.horizontalHeader}>
                            {product.category && <Text style={styles.horizontalCategory}>{product.category.name}</Text>}
                            <Animated.View style={{ transform: [{ scale: heartAnim }] }}>
                                <TouchableOpacity onPress={handleWishlistToggle} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                    <FontAwesomeIcon
                                        icon={isInWishlist ? faHeartSolid : faHeartRegular}
                                        size={16}
                                        color={isInWishlist ? Colors.light.error : Colors.light.textTertiary}
                                    />
                                </TouchableOpacity>
                            </Animated.View>
                        </View>
                        <Text style={styles.horizontalName} numberOfLines={2}>
                            {product.name}
                        </Text>
                        {product.rating && (
                            <View style={styles.ratingRow}>
                                <FontAwesomeIcon icon={faStar} size={12} color={Colors.light.warning} />
                                <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
                                {product.reviewCount && <Text style={styles.reviewCount}>({product.reviewCount})</Text>}
                            </View>
                        )}
                        <View style={styles.horizontalFooter}>
                            <View>
                                <Text style={styles.horizontalPrice}>${actualPrice.toFixed(2)}</Text>
                                {hasDiscount && <Text style={styles.horizontalOriginalPrice}>${originalPrice.toFixed(2)}</Text>}
                            </View>
                            <TouchableOpacity
                                style={[styles.horizontalAddButton, isOutOfStock && styles.disabledButton]}
                                onPress={handleAddToCart}
                                disabled={isOutOfStock}>
                                <FontAwesomeIcon icon={faPlus} size={14} color='#FFFFFF' />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Pressable>
            </Animated.View>
        );
    }

    // Compact variant
    if (variant === 'compact') {
        return (
            <Pressable style={[styles.compactCard, Shadows.xs]} onPress={handlePress}>
                <Image source={{ uri: imageUrl }} style={styles.compactImage} />
                <View style={styles.compactContent}>
                    <Text style={styles.compactName} numberOfLines={1}>
                        {product.name}
                    </Text>
                    <Text style={styles.compactPrice}>${actualPrice.toFixed(2)}</Text>
                </View>
            </Pressable>
        );
    }

    // Minimal variant
    if (variant === 'minimal') {
        return (
            <Pressable style={styles.minimalCard} onPress={handlePress}>
                <Image source={{ uri: imageUrl }} style={styles.minimalImage} />
                <Text style={styles.minimalName} numberOfLines={1}>
                    {product.name}
                </Text>
                <Text style={styles.minimalPrice}>${actualPrice.toFixed(2)}</Text>
            </Pressable>
        );
    }

    // Grid variant (default)
    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Pressable style={[styles.gridCard, Shadows.sm]} onPress={handlePress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: imageUrl }} style={styles.gridImage} />

                    {/* Badges */}
                    <View style={styles.badgesContainer}>
                        {product.isNew && (
                            <View style={styles.newBadge}>
                                <Text style={styles.newBadgeText}>NEW</Text>
                            </View>
                        )}
                        {product.isBestseller && (
                            <View style={styles.bestsellerBadge}>
                                <Text style={styles.bestsellerBadgeText}>BEST</Text>
                            </View>
                        )}
                        {hasDiscount && (
                            <View style={styles.discountBadge}>
                                <Text style={styles.discountText}>-{discountPercent}%</Text>
                            </View>
                        )}
                    </View>

                    {/* Out of stock overlay */}
                    {isOutOfStock && (
                        <View style={styles.outOfStockOverlay}>
                            <Text style={styles.outOfStockText}>Out of Stock</Text>
                        </View>
                    )}

                    {/* Wishlist button */}
                    <Animated.View style={[styles.wishlistButton, { transform: [{ scale: heartAnim }] }]}>
                        <TouchableOpacity onPress={handleWishlistToggle} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <FontAwesomeIcon
                                icon={isInWishlist ? faHeartSolid : faHeartRegular}
                                size={16}
                                color={isInWishlist ? Colors.light.error : Colors.light.textSecondary}
                            />
                        </TouchableOpacity>
                    </Animated.View>
                </View>

                <View style={styles.gridContent}>
                    {product.category && <Text style={styles.categoryText}>{product.category.name}</Text>}
                    <Text style={styles.productName} numberOfLines={2}>
                        {product.name}
                    </Text>

                    {product.rating && (
                        <View style={styles.ratingRow}>
                            <FontAwesomeIcon icon={faStar} size={11} color={Colors.light.warning} />
                            <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
                            {product.reviewCount && <Text style={styles.reviewCount}>({product.reviewCount})</Text>}
                        </View>
                    )}

                    <View style={styles.priceRow}>
                        <View>
                            <Text style={styles.price}>${actualPrice.toFixed(2)}</Text>
                            {hasDiscount && <Text style={styles.originalPrice}>${originalPrice.toFixed(2)}</Text>}
                        </View>
                        <TouchableOpacity style={[styles.addButton, isOutOfStock && styles.disabledButton]} onPress={handleAddToCart} disabled={isOutOfStock}>
                            <FontAwesomeIcon icon={faPlus} size={14} color='#FFFFFF' />
                        </TouchableOpacity>
                    </View>
                </View>
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    // Grid card styles
    gridCard: {
        width: CARD_WIDTH,
        backgroundColor: Colors.light.surface,
        borderRadius: BorderRadius.xl,
        overflow: 'hidden',
        marginBottom: Spacing.base,
    },
    imageContainer: {
        position: 'relative',
        backgroundColor: Colors.light.surfaceSecondary,
    },
    gridImage: {
        width: '100%',
        height: CARD_WIDTH * 1.1,
        resizeMode: 'cover',
    },
    badgesContainer: {
        position: 'absolute',
        top: Spacing.sm,
        left: Spacing.sm,
        flexDirection: 'row',
        gap: Spacing.xs,
    },
    discountBadge: {
        backgroundColor: Colors.light.error,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
        borderRadius: BorderRadius.md,
    },
    discountText: {
        color: '#FFFFFF',
        fontSize: FontSizes.xs,
        fontWeight: FontWeights.bold,
    },
    newBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.light.newTag,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
        borderRadius: BorderRadius.md,
        gap: 4,
    },
    newBadgeText: {
        color: '#FFFFFF',
        fontSize: FontSizes.xs,
        fontWeight: FontWeights.bold,
    },
    bestsellerBadge: {
        backgroundColor: Colors.light.bestseller,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
        borderRadius: BorderRadius.md,
    },
    bestsellerBadgeText: {
        color: '#FFFFFF',
        fontSize: FontSizes.xs,
        fontWeight: FontWeights.bold,
    },
    saleBadge: {
        backgroundColor: Colors.light.sale,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
        borderRadius: BorderRadius.md,
    },
    saleBadgeText: {
        color: '#FFFFFF',
        fontSize: FontSizes.xs,
        fontWeight: FontWeights.bold,
    },
    outOfStockOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    outOfStockText: {
        color: '#FFFFFF',
        fontSize: FontSizes.sm,
        fontWeight: FontWeights.bold,
    },
    wishlistButton: {
        position: 'absolute',
        top: Spacing.sm,
        right: Spacing.sm,
        width: 36,
        height: 36,
        backgroundColor: Colors.light.surface,
        borderRadius: BorderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        ...Shadows.sm,
    },
    gridContent: {
        padding: Spacing.md,
    },
    categoryText: {
        fontSize: FontSizes.xs,
        color: Colors.light.primary,
        fontWeight: FontWeights.medium,
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    productName: {
        fontSize: FontSizes.sm,
        fontWeight: FontWeights.semibold,
        color: Colors.light.text,
        marginBottom: Spacing.xs,
        lineHeight: 20,
        minHeight: 40,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.sm,
        gap: 4,
    },
    ratingText: {
        fontSize: FontSizes.xs,
        color: Colors.light.text,
        fontWeight: FontWeights.medium,
    },
    reviewCount: {
        fontSize: FontSizes.xs,
        color: Colors.light.textTertiary,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    price: {
        fontSize: FontSizes.lg,
        fontWeight: FontWeights.bold,
        color: Colors.light.text,
    },
    originalPrice: {
        fontSize: FontSizes.xs,
        color: Colors.light.textTertiary,
        textDecorationLine: 'line-through',
        marginTop: 2,
    },
    addButton: {
        width: 36,
        height: 36,
        backgroundColor: Colors.light.primary,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabledButton: {
        backgroundColor: Colors.light.borderDark,
    },

    // Horizontal card styles
    horizontalCard: {
        flexDirection: 'row',
        backgroundColor: Colors.light.surface,
        borderRadius: BorderRadius.xl,
        overflow: 'hidden',
        marginBottom: Spacing.md,
        marginHorizontal: Spacing.base,
    },
    horizontalImageContainer: {
        position: 'relative',
    },
    horizontalImage: {
        width: 130,
        height: 130,
        resizeMode: 'cover',
    },
    horizontalDiscountBadge: {
        position: 'absolute',
        top: Spacing.sm,
        left: Spacing.sm,
        backgroundColor: Colors.light.error,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        borderRadius: BorderRadius.sm,
    },
    horizontalDiscountText: {
        color: '#FFFFFF',
        fontSize: FontSizes.xs,
        fontWeight: FontWeights.bold,
    },
    horizontalContent: {
        flex: 1,
        padding: Spacing.md,
        justifyContent: 'space-between',
    },
    horizontalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    horizontalCategory: {
        fontSize: FontSizes.xs,
        color: Colors.light.primary,
        fontWeight: FontWeights.medium,
        textTransform: 'uppercase',
    },
    horizontalName: {
        fontSize: FontSizes.base,
        fontWeight: FontWeights.semibold,
        color: Colors.light.text,
        lineHeight: 22,
        marginTop: 4,
    },
    horizontalFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: Spacing.sm,
    },
    horizontalPrice: {
        fontSize: FontSizes.lg,
        fontWeight: FontWeights.bold,
        color: Colors.light.text,
    },
    horizontalOriginalPrice: {
        fontSize: FontSizes.xs,
        color: Colors.light.textTertiary,
        textDecorationLine: 'line-through',
    },
    horizontalAddButton: {
        width: 36,
        height: 36,
        backgroundColor: Colors.light.primary,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Compact card styles
    compactCard: {
        width: 140,
        backgroundColor: Colors.light.surface,
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
        marginRight: Spacing.md,
    },
    compactImage: {
        width: '100%',
        height: 120,
        resizeMode: 'cover',
        backgroundColor: Colors.light.surfaceSecondary,
    },
    compactContent: {
        padding: Spacing.sm,
    },
    compactName: {
        fontSize: FontSizes.sm,
        fontWeight: FontWeights.medium,
        color: Colors.light.text,
        marginBottom: 4,
    },
    compactPrice: {
        fontSize: FontSizes.base,
        fontWeight: FontWeights.bold,
        color: Colors.light.primary,
    },

    // Minimal card styles
    minimalCard: {
        width: 110,
        marginRight: Spacing.md,
    },
    minimalImage: {
        width: 110,
        height: 110,
        borderRadius: BorderRadius.lg,
        resizeMode: 'cover',
        backgroundColor: Colors.light.surfaceSecondary,
    },
    minimalName: {
        fontSize: FontSizes.sm,
        color: Colors.light.text,
        marginTop: Spacing.sm,
    },
    minimalPrice: {
        fontSize: FontSizes.sm,
        fontWeight: FontWeights.bold,
        color: Colors.light.primary,
        marginTop: 2,
    },

    // Featured card styles
    featuredCard: {
        width: LARGE_CARD_WIDTH,
        height: 220,
        borderRadius: BorderRadius['2xl'],
        overflow: 'hidden',
        marginHorizontal: Spacing.base,
        marginBottom: Spacing.base,
    },
    featuredImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    featuredGradient: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        padding: Spacing.lg,
    },
    featuredBadges: {
        position: 'absolute',
        top: Spacing.md,
        left: Spacing.md,
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    featuredContent: {
        marginBottom: Spacing.sm,
    },
    featuredName: {
        fontSize: FontSizes.xl,
        fontWeight: FontWeights.bold,
        color: '#FFFFFF',
        marginBottom: Spacing.xs,
    },
    featuredPriceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    featuredPrice: {
        fontSize: FontSizes['2xl'],
        fontWeight: FontWeights.bold,
        color: '#FFFFFF',
    },
    featuredOriginalPrice: {
        fontSize: FontSizes.base,
        color: 'rgba(255,255,255,0.7)',
        textDecorationLine: 'line-through',
    },
    featuredWishlistButton: {
        position: 'absolute',
        top: Spacing.md,
        right: Spacing.md,
        width: 44,
        height: 44,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: BorderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
    },
    featuredCartButton: {
        position: 'absolute',
        bottom: Spacing.lg,
        right: Spacing.lg,
        width: 48,
        height: 48,
        backgroundColor: Colors.light.primary,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
