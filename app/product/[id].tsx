import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, ActivityIndicator, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
    faArrowLeft,
    faHeart as faHeartSolid,
    faStar,
    faStarHalfAlt,
    faShoppingCart,
    faMinus,
    faPlus,
    faShare,
    faCheck,
    faTruck,
    faShieldAlt,
    faUndo,
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular, faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { useProduct, useProductReviews } from '../../src/lib/hooks';
import { useCartStore } from '../../src/store/cartStore';
import { Colors } from '../../src/constants/theme';

const { width } = Dimensions.get('window');

// Image Carousel Component
function ImageCarousel({ images }: { images: string[] }) {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleScroll = (event: any) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollPosition / width);
        setActiveIndex(index);
    };

    const displayImages = images?.length > 0 ? images : ['https://via.placeholder.com/400'];

    return (
        <View style={styles.carousel}>
            <FlatList
                data={displayImages}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => <Image source={{ uri: item }} style={styles.carouselImage} resizeMode='contain' />}
            />
            {displayImages.length > 1 && (
                <View style={styles.pagination}>
                    {displayImages.map((_, index) => (
                        <View key={index} style={[styles.paginationDot, index === activeIndex && styles.paginationDotActive]} />
                    ))}
                </View>
            )}
        </View>
    );
}

// Rating Stars Component
function RatingStars({ rating, size = 16 }: { rating: number; size?: number }) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;

    return (
        <View style={styles.ratingStars}>
            {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesomeIcon
                    key={star}
                    icon={star <= fullStars ? faStar : faStarRegular}
                    size={size}
                    color={star <= fullStars || (star === fullStars + 1 && hasHalfStar) ? '#F59E0B' : Colors.light.textTertiary}
                    style={{ marginRight: 2 }}
                />
            ))}
        </View>
    );
}

// Review Card Component
function ReviewCard({ review }: { review: any }) {
    return (
        <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
                <View style={styles.reviewAuthor}>
                    <View style={styles.reviewAvatar}>
                        <Text style={styles.reviewAvatarText}>{review.userName?.charAt(0)?.toUpperCase() || 'U'}</Text>
                    </View>
                    <View>
                        <Text style={styles.reviewName}>{review.userName || 'Anonymous'}</Text>
                        <RatingStars rating={review.rating} size={12} />
                    </View>
                </View>
                <Text style={styles.reviewDate}>{new Date(review.createdAt).toLocaleDateString()}</Text>
            </View>
            {review.title && <Text style={styles.reviewTitle}>{review.title}</Text>}
            <Text style={styles.reviewComment}>{review.comment}</Text>
        </View>
    );
}

// Quantity Selector Component
function QuantitySelector({ quantity, onIncrease, onDecrease, max }: { quantity: number; onIncrease: () => void; onDecrease: () => void; max: number }) {
    return (
        <View style={styles.quantitySelector}>
            <TouchableOpacity style={[styles.quantityButton, quantity <= 1 && styles.quantityButtonDisabled]} onPress={onDecrease} disabled={quantity <= 1}>
                <FontAwesomeIcon icon={faMinus} size={14} color={quantity <= 1 ? Colors.light.textTertiary : Colors.light.text} />
            </TouchableOpacity>
            <Text style={styles.quantityValue}>{quantity}</Text>
            <TouchableOpacity style={[styles.quantityButton, quantity >= max && styles.quantityButtonDisabled]} onPress={onIncrease} disabled={quantity >= max}>
                <FontAwesomeIcon icon={faPlus} size={14} color={quantity >= max ? Colors.light.textTertiary : Colors.light.text} />
            </TouchableOpacity>
        </View>
    );
}

// Main Product Detail Screen
export default function ProductDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

    const { data: product, isLoading, error } = useProduct(id || '');
    const { data: reviewsData } = useProductReviews(id || '');

    const addToCart = useCartStore((state) => state.addToCart);
    const toggleWishlistItem = useCartStore((state) => state.toggleWishlistItem);
    const addToRecentlyViewed = useCartStore((state) => state.addToRecentlyViewed);
    const isInWishlist = useCartStore((state) => state.wishlist.some((item) => item.id === id));

    const reviews = reviewsData?.data || [];

    // Add to recently viewed
    useEffect(() => {
        if (product) {
            addToRecentlyViewed({
                id: product.id,
                name: product.name,
                price: product.salePrice || product.price,
                image: product.images?.[0] || 'https://via.placeholder.com/200',
            });
        }
    }, [product]);

    const handleAddToCart = () => {
        if (!product) return;

        addToCart({
            productId: product.id,
            name: product.name,
            price: product.salePrice || product.price,
            image: product.images?.[0] || 'https://via.placeholder.com/200',
            quantity,
            variant: selectedVariant || undefined,
        });

        Alert.alert('Added to Cart', `${product.name} has been added to your cart`);
    };

    const handleBuyNow = () => {
        handleAddToCart();
        router.push('/checkout');
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <Stack.Screen options={{ headerShown: false }} />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size='large' color='#4F46E5' />
                    <Text style={styles.loadingText}>Loading product...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error || !product) {
        return (
            <SafeAreaView style={styles.container}>
                <Stack.Screen options={{ headerShown: false }} />
                <View style={styles.errorContainer}>
                    <Text style={styles.errorEmoji}>😕</Text>
                    <Text style={styles.errorTitle}>Product not found</Text>
                    <Text style={styles.errorText}>The product you're looking for doesn't exist or has been removed.</Text>
                    <TouchableOpacity style={styles.errorButton} onPress={() => router.push('/products')}>
                        <Text style={styles.errorButtonText}>Browse Products</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const hasDiscount = product.salePrice && product.salePrice < product.price;
    const discountPercentage = hasDiscount ? Math.round((1 - product.salePrice / product.price) * 100) : 0;
    const inStock = (product.stock || 0) > 0;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
                    <FontAwesomeIcon icon={faArrowLeft} size={20} color={Colors.light.text} />
                </TouchableOpacity>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.headerButton} onPress={() => Alert.alert('Share', 'Share functionality coming soon')}>
                        <FontAwesomeIcon icon={faShare} size={18} color={Colors.light.text} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={() =>
                            toggleWishlistItem({
                                id: product.id,
                                name: product.name,
                                price: product.salePrice || product.price,
                                image: product.images?.[0] || 'https://via.placeholder.com/200',
                            })
                        }>
                        <FontAwesomeIcon
                            icon={isInWishlist ? faHeartSolid : faHeartRegular}
                            size={20}
                            color={isInWishlist ? Colors.light.error : Colors.light.text}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Image Carousel */}
                <ImageCarousel images={product.images || []} />

                {/* Product Info */}
                <View style={styles.productInfo}>
                    {/* Category Badge */}
                    {product.category && (
                        <View style={styles.categoryBadge}>
                            <Text style={styles.categoryText}>{product.category.name}</Text>
                        </View>
                    )}

                    {/* Name */}
                    <Text style={styles.productName}>{product.name}</Text>

                    {/* Rating */}
                    {product.rating && (
                        <View style={styles.ratingContainer}>
                            <RatingStars rating={product.rating} />
                            <Text style={styles.ratingText}>
                                {product.rating.toFixed(1)} ({product.reviewCount || 0} reviews)
                            </Text>
                        </View>
                    )}

                    {/* Price */}
                    <View style={styles.priceContainer}>
                        {hasDiscount ? (
                            <>
                                <Text style={styles.salePrice}>${product.salePrice.toFixed(2)}</Text>
                                <Text style={styles.originalPrice}>${product.price.toFixed(2)}</Text>
                                <View style={styles.discountBadge}>
                                    <Text style={styles.discountText}>-{discountPercentage}%</Text>
                                </View>
                            </>
                        ) : (
                            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
                        )}
                    </View>

                    {/* Stock Status */}
                    <View style={styles.stockContainer}>
                        <View style={[styles.stockIndicator, { backgroundColor: inStock ? '#10B981' : '#EF4444' }]} />
                        <Text style={styles.stockText}>{inStock ? `${product.stock} in stock` : 'Out of stock'}</Text>
                    </View>

                    {/* Description */}
                    <View style={styles.descriptionContainer}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.description}>{product.description}</Text>
                    </View>

                    {/* Variants (if any) */}
                    {product.variants && product.variants.length > 0 && (
                        <View style={styles.variantsContainer}>
                            <Text style={styles.sectionTitle}>Variants</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {product.variants.map((variant: any, index: number) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[styles.variantChip, selectedVariant === variant.name && styles.variantChipSelected]}
                                        onPress={() => setSelectedVariant(variant.name)}>
                                        <Text style={[styles.variantText, selectedVariant === variant.name && styles.variantTextSelected]}>{variant.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    {/* Quantity Selector */}
                    <View style={styles.quantityContainer}>
                        <Text style={styles.sectionTitle}>Quantity</Text>
                        <QuantitySelector
                            quantity={quantity}
                            onIncrease={() => setQuantity((q) => Math.min(q + 1, product.stock || 10))}
                            onDecrease={() => setQuantity((q) => Math.max(q - 1, 1))}
                            max={product.stock || 10}
                        />
                    </View>

                    {/* Reviews Section */}
                    <View style={styles.reviewsSection}>
                        <View style={styles.reviewsHeader}>
                            <Text style={styles.sectionTitle}>Reviews ({reviews.length})</Text>
                            <TouchableOpacity>
                                <Text style={styles.seeAllLink}>See All</Text>
                            </TouchableOpacity>
                        </View>
                        {reviews.length > 0 ? (
                            reviews.slice(0, 3).map((review: any) => <ReviewCard key={review.id} review={review} />)
                        ) : (
                            <Text style={styles.noReviews}>No reviews yet. Be the first to review!</Text>
                        )}
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Action Buttons */}
            <View style={styles.bottomActions}>
                <TouchableOpacity style={[styles.addToCartButton, !inStock && styles.buttonDisabled]} onPress={handleAddToCart} disabled={!inStock}>
                    <Text style={styles.addToCartButtonText}>Add to Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.buyNowButton, !inStock && styles.buttonDisabled]} onPress={handleBuyNow} disabled={!inStock}>
                    <Text style={styles.buyNowButtonText}>Buy Now</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.light.background,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: Colors.light.textSecondary,
        fontWeight: '500',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        backgroundColor: Colors.light.background,
    },
    errorEmoji: {
        fontSize: 64,
    },
    errorTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginTop: 20,
    },
    errorText: {
        fontSize: 15,
        color: Colors.light.textSecondary,
        textAlign: 'center',
        marginTop: 10,
        lineHeight: 22,
    },
    errorButton: {
        marginTop: 28,
        paddingHorizontal: 32,
        paddingVertical: 14,
        backgroundColor: Colors.light.primary,
        borderRadius: 14,
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    errorButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    headerActions: {
        flexDirection: 'row',
        gap: 10,
    },
    headerButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
    },
    headerButtonText: {
        fontSize: 20,
    },
    carousel: {
        backgroundColor: Colors.light.surface,
    },
    carouselImage: {
        width: width,
        height: 420,
        backgroundColor: Colors.light.surface,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 16,
        backgroundColor: Colors.light.background,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.light.border,
        marginHorizontal: 5,
    },
    paginationDotActive: {
        backgroundColor: Colors.light.primary,
        width: 28,
    },
    productInfo: {
        padding: 20,
    },
    categoryBadge: {
        backgroundColor: Colors.light.primaryLight,
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginBottom: 12,
    },
    categoryText: {
        fontSize: 13,
        color: Colors.light.primary,
        fontWeight: '600',
    },
    productName: {
        fontSize: 26,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: 10,
        lineHeight: 34,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    ratingStars: {
        flexDirection: 'row',
        gap: 3,
    },
    ratingText: {
        marginLeft: 10,
        fontSize: 14,
        color: Colors.light.textSecondary,
        fontWeight: '500',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        flexWrap: 'wrap',
    },
    price: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.light.text,
    },
    salePrice: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.light.error,
    },
    originalPrice: {
        fontSize: 18,
        color: Colors.light.textMuted,
        textDecorationLine: 'line-through',
        marginLeft: 14,
    },
    discountBadge: {
        backgroundColor: '#FEE2E2',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        marginLeft: 14,
    },
    discountText: {
        color: Colors.light.error,
        fontWeight: 'bold',
        fontSize: 14,
    },
    stockContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        backgroundColor: Colors.light.surface,
        padding: 12,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    stockIndicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    stockText: {
        fontSize: 14,
        color: Colors.light.textSecondary,
        fontWeight: '500',
    },
    descriptionContainer: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: 12,
    },
    description: {
        fontSize: 15,
        color: Colors.light.textSecondary,
        lineHeight: 24,
    },
    variantsContainer: {
        marginBottom: 24,
    },
    variantChip: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
        backgroundColor: Colors.light.surface,
        marginRight: 10,
        borderWidth: 2,
        borderColor: Colors.light.border,
    },
    variantChipSelected: {
        backgroundColor: Colors.light.primary,
        borderColor: Colors.light.primary,
    },
    variantText: {
        fontSize: 14,
        color: Colors.light.textSecondary,
        fontWeight: '600',
    },
    variantTextSelected: {
        color: '#FFFFFF',
    },
    quantityContainer: {
        marginBottom: 24,
    },
    quantitySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: Colors.light.surface,
        borderRadius: 14,
        padding: 6,
    },
    quantityButton: {
        width: 44,
        height: 44,
        borderRadius: 10,
        backgroundColor: Colors.light.background,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    quantityButtonDisabled: {
        opacity: 0.4,
    },
    quantityButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.light.textSecondary,
    },
    quantityValue: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.light.text,
        marginHorizontal: 24,
        minWidth: 30,
        textAlign: 'center',
    },
    reviewsSection: {
        marginBottom: 120,
    },
    reviewsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    seeAllLink: {
        color: Colors.light.primary,
        fontSize: 14,
        fontWeight: '600',
    },
    reviewCard: {
        backgroundColor: Colors.light.surface,
        borderRadius: 16,
        padding: 18,
        marginBottom: 14,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    reviewAuthor: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    reviewAvatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: Colors.light.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    reviewAvatarText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    reviewName: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: 3,
    },
    reviewDate: {
        fontSize: 12,
        color: Colors.light.textMuted,
    },
    reviewTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: 6,
    },
    reviewComment: {
        fontSize: 14,
        color: Colors.light.textSecondary,
        lineHeight: 22,
    },
    noReviews: {
        fontSize: 15,
        color: Colors.light.textMuted,
        textAlign: 'center',
        paddingVertical: 28,
    },
    bottomActions: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        padding: 16,
        paddingBottom: 24,
        backgroundColor: Colors.light.background,
        borderTopWidth: 1,
        borderTopColor: Colors.light.border,
        gap: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 8,
    },
    addToCartButton: {
        flex: 1,
        paddingVertical: 18,
        borderRadius: 16,
        backgroundColor: Colors.light.primaryLight,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    addToCartButtonText: {
        color: Colors.light.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    buyNowButton: {
        flex: 1,
        paddingVertical: 18,
        borderRadius: 16,
        backgroundColor: Colors.light.primary,
        alignItems: 'center',
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buyNowButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonDisabled: {
        opacity: 0.5,
    },
});
