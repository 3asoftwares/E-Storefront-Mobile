/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  Animated,
  Pressable,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faHeart as faHeartSolid,
  faStar,
  faShoppingCart,
  faArrowRight,
  faTag,
  faBox,
  faChevronRight,
  faFire,
  faLaptop,
  faTshirt,
  faCouch,
  faBasketball,
  faGem,
  faBlender,
  faCheck,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { useProducts, useCategories } from '../../src/lib/hooks';
import { useCartStore } from '../../src/store/cartStore';
import {
  Colors,
  BorderRadius,
  Spacing,
  Shadows,
  FontSizes,
  FontWeights,
} from '../../src/constants/theme';

const { width } = Dimensions.get('window');
const PRODUCT_CARD_WIDTH = (width - 48) / 2;

// Product Card Component with modern animations
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ProductCard({ product, index = 0 }: { product: any; index?: number }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const toggleWishlistItem = useCartStore((state) => state.toggleWishlistItem);
  const isInWishlist = useCartStore((state) =>
    state.wishlist.some((item) => item.productId === product.id)
  );
  const isInCart = useCartStore((state) =>
    state.items.some((item) => item.productId === product.id)
  );

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const heartAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        tension: 50,
        friction: 8,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index, fadeAnim, translateY]);

  const imageUrl = product.imageUrl;
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercentage = hasDiscount
    ? Math.round((1 - product.salePrice / product.price) * 100)
    : 0;

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

  const handleWishlistPress = () => {
    Animated.sequence([
      Animated.spring(heartAnim, {
        toValue: 1.4,
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
      price: product.salePrice || product.price,
      image: imageUrl,
    });
  };

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      image: imageUrl,
      quantity: 1,
      variant: undefined,
    });
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }, { translateY }],
      }}
    >
      <Pressable
        style={styles.productCard}
        onPress={() => router.push(`/product/${product.id}`)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={styles.productImageContainer}>
          <Image source={{ uri: imageUrl }} style={styles.productImage} resizeMode="cover" />
          {hasDiscount && (
            <LinearGradient
              colors={[Colors.light.error, '#FF8080']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.discountBadge}
            >
              <Text style={styles.discountText}>-{discountPercentage}%</Text>
            </LinearGradient>
          )}
          <Animated.View style={[styles.wishlistButton, { transform: [{ scale: heartAnim }] }]}>
            <TouchableOpacity
              onPress={handleWishlistPress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <FontAwesomeIcon
                icon={isInWishlist ? faHeartSolid : faHeartRegular}
                size={18}
                color={isInWishlist ? Colors.light.error : Colors.light.textSecondary}
              />
            </TouchableOpacity>
          </Animated.View>
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {product.name}
          </Text>
          <View style={styles.priceContainer}>
            {hasDiscount ? (
              <>
                <Text style={styles.salePrice}>₹{product.salePrice.toFixed(2)}</Text>
                <Text style={styles.originalPrice}>₹{product.price.toFixed(2)}</Text>
              </>
            ) : (
              <Text style={styles.price}>₹{product.price.toFixed(2)}</Text>
            )}
          </View>
          {product.rating && (
            <View style={styles.ratingContainer}>
              <FontAwesomeIcon icon={faStar} size={12} color={Colors.light.warning} />
              <Text style={styles.rating}> {product.rating.toFixed(1)}</Text>
              <Text style={styles.reviewCount}>({product.reviewCount || 0})</Text>
            </View>
          )}
          {isInCart ? (
            <View style={styles.inCartButton}>
              <FontAwesomeIcon
                icon={faCheck}
                size={12}
                color="#FFFFFF"
                style={{ marginRight: 4 }}
              />
              <Text style={styles.inCartText}>In Cart</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addToCartButton}
              onPress={handleAddToCart}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[Colors.light.primary, Colors.light.primaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.addToCartGradient}
              >
                <FontAwesomeIcon icon={faShoppingCart} size={12} color="#FFFFFF" />
                <Text style={styles.addToCartText}>Add to Cart</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

// Category icons for display
const CATEGORY_ICONS: IconDefinition[] = [
  faLaptop,
  faTshirt,
  faCouch,
  faBasketball,
  faGem,
  faBlender,
];
const CATEGORY_COLORS = [
  ['#6366F1', '#818CF8'],
  ['#EC4899', '#F472B6'],
  ['#F59E0B', '#FBBF24'],
  ['#10B981', '#34D399'],
  ['#8B5CF6', '#A78BFA'],
  ['#EF4444', '#F87171'],
];

function CategoryCard({ category, index = 0 }: { category: any; index?: number }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const icon = CATEGORY_ICONS[index % CATEGORY_ICONS.length];
  const colors = CATEGORY_COLORS[index % CATEGORY_COLORS.length];

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
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

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        style={styles.categoryCard}
        onPress={() => router.push(`/products?category=${category.slug}`)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.categoryGradient}
        >
          <FontAwesomeIcon icon={icon} size={28} color="#FFFFFF" />
        </LinearGradient>
        <Text style={styles.categoryName} numberOfLines={1}>
          {category.name}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

// Modern Hero Banner Component
function HeroBanner() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.heroBanner}>
      <LinearGradient
        colors={[Colors.light.primary, Colors.light.primaryDark, '#4338CA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {/* Decorative circles */}
      <View style={styles.heroDecor1} />
      <View style={styles.heroDecor2} />

      <Animated.View
        style={[styles.heroContent, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      >
        <View style={styles.heroWelcomeContainer}>
          <Text style={styles.heroWelcome}>✨ Welcome Back</Text>
        </View>
        <Text style={styles.heroTitle}>Discover{'\n'}Amazing Products</Text>
        <Text style={styles.heroSubtitle}>
          Shop the latest trends with exclusive deals up to 50% off
        </Text>
        <TouchableOpacity
          style={styles.heroButton}
          onPress={() => router.push('/products')}
          activeOpacity={0.9}
        >
          <Text style={styles.heroButtonText}>Explore Now</Text>
          <View style={styles.heroButtonIcon}>
            <FontAwesomeIcon icon={faArrowRight} size={14} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

// Section Header Component with modern styling
function SectionHeader({
  title,
  subtitle,
  icon,
  onSeeAll,
}: {
  title: string;
  subtitle?: string;
  icon?: any;
  onSeeAll?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleContainer}>
        {icon && (
          <View style={styles.sectionIconContainer}>
            <FontAwesomeIcon icon={icon} size={16} color={Colors.light.primary} />
          </View>
        )}
        <View>
          <Text style={styles.sectionTitle}>{title}</Text>
          {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {onSeeAll && (
        <TouchableOpacity onPress={onSeeAll} style={styles.seeAllButton} activeOpacity={0.7}>
          <Text style={styles.seeAllText}>See All</Text>
          <View style={styles.seeAllIcon}>
            <FontAwesomeIcon icon={faChevronRight} size={10} color={Colors.light.primary} />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

// Main Home Screen
export default function HomeScreen() {
  const {
    data: productsData,
    isLoading: productsLoading,
    refetch: refetchProducts,
    isRefetching: isRefetchingProducts,
  } = useProducts(1, 8, { featured: true });

  // New Arrivals - sorted by newest
  const {
    data: newArrivalsData,
    isLoading: _newArrivalsLoading,
    refetch: refetchNewArrivals,
  } = useProducts(1, 8, { sortBy: 'createdAt', sortOrder: 'DESC' });

  const {
    data: categories,
    isLoading: categoriesLoading,
    refetch: refetchCategories,
  } = useCategories();

  const _addToRecentlyViewed = useCartStore((state) => state.addToRecentlyViewed);
  const recentlyViewed = useCartStore((state) => state.recentlyViewed);

  const products = productsData?.products || [];
  const newArrivals = newArrivalsData?.products || [];
  const isLoading = productsLoading || categoriesLoading;

  const onRefresh = useCallback(() => {
    refetchProducts();
    refetchCategories();
    refetchNewArrivals();
  }, [refetchProducts, refetchCategories, refetchNewArrivals]);

  if (isLoading && !products.length) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefetchingProducts} onRefresh={onRefresh} />}
      >
        <HeroBanner />

        {categories && categories.length > 0 && (
          <View style={styles.section}>
            <SectionHeader
              title="Shop by Category"
              subtitle="Find what you need"
              onSeeAll={() => router.push('/products')}
            />
            <FlatList
              data={[...categories]
                .sort((a: any, b: any) => b.productCount - a.productCount)
                .slice(0, 6)}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => <CategoryCard category={item} index={index} />}
              contentContainerStyle={styles.categoriesList}
            />
          </View>
        )}

        <View>
          <SectionHeader
            title="Featured Products"
            subtitle="Handpicked for you"
            icon={faFire}
            onSeeAll={() => router.push('/products')}
          />
          <View style={styles.productsGrid}>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {products.map((product: any, index: number) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </View>
          {products.length === 0 && !isLoading && (
            <View style={styles.emptyState}>
              <View style={styles.emptyStateIconContainer}>
                <FontAwesomeIcon icon={faBox} size={40} color={Colors.light.textTertiary} />
              </View>
              <Text style={styles.emptyStateText}>No products found</Text>
            </View>
          )}
        </View>

        {/* New Arrivals Section */}
        {newArrivals.length > 0 && (
          <View style={styles.newArrivalsSection}>
            <SectionHeader
              title="New Arrivals"
              subtitle="Fresh from our collection"
              icon={faClock}
              onSeeAll={() => router.push('/products')}
            />
            <View style={styles.productsGrid}>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {newArrivals.map((product: any, index: number) => (
                <ProductCard key={`new-${product.id}`} product={product} index={index} />
              ))}
            </View>
          </View>
        )}

        {recentlyViewed.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="Recently Viewed" />
            <FlatList
              data={recentlyViewed.slice(0, 6)}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.productId}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.recentlyViewedCard}
                  onPress={() => router.push(`/product/${item.productId}`)}
                >
                  <Image
                    source={{ uri: item.image }}
                    style={styles.recentlyViewedImage}
                    resizeMode="cover"
                  />
                  <Text style={styles.recentlyViewedName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.recentlyViewedPrice}>₹{item.price.toFixed(2)}</Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.recentlyViewedList}
            />
          </View>
        )}

        {/* Promo Banner */}
        <View style={styles.promoBanner}>
          <View style={styles.promoHeader}>
            <FontAwesomeIcon icon={faTag} size={20} color="#92400E" />
            <Text style={styles.promoTitle}> Special Offer</Text>
          </View>
          <Text style={styles.promoText}>Get 20% off on your first order with code FIRST20</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
    paddingBottom: Platform.OS === 'ios' ? 100 : 84,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
  newArrivalsSection: {
    marginTop: Spacing['2xl'],
    marginBottom: Spacing['2xl'],
  },
  loadingText: {
    marginTop: 16,
    fontSize: FontSizes.base,
    color: Colors.light.textSecondary,
    fontWeight: FontWeights.medium,
  },
  // Hero Banner Styles
  heroBanner: {
    marginHorizontal: Spacing.base,
    marginVertical: Spacing.base,
    borderRadius: BorderRadius['2xl'],
    overflow: 'hidden',
    minHeight: 220,
    position: 'relative',
    ...Shadows.lg,
  },
  heroDecor1: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  heroDecor2: {
    position: 'absolute',
    bottom: -60,
    left: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  heroContent: {
    padding: Spacing.xl,
    paddingVertical: Spacing['2xl'],
    zIndex: 1,
  },
  heroWelcomeContainer: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.md,
  },
  heroWelcome: {
    fontSize: FontSizes.sm,
    color: '#FFFFFF',
    fontWeight: FontWeights.semibold,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: FontWeights.extrabold,
    color: '#FFFFFF',
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: FontSizes.base,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: Spacing.sm,
    lineHeight: 22,
  },
  heroButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    marginTop: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: Spacing.sm,
    ...Shadows.md,
  },
  heroButtonText: {
    color: Colors.light.primary,
    fontWeight: FontWeights.bold,
    fontSize: FontSizes.base,
  },
  heroButtonIcon: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Section Styles
  section: {
    marginBottom: Spacing['2xl'],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.md,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  sectionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.light.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.light.text,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: FontSizes.xs,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.light.primary + '10',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  seeAllText: {
    fontSize: FontSizes.sm,
    color: Colors.light.primary,
    fontWeight: FontWeights.semibold,
  },
  seeAllIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Category Styles
  categoriesList: {
    paddingHorizontal: Spacing.base,
  },
  categoryCard: {
    width: 90,
    marginRight: Spacing.md,
    alignItems: 'center',
  },
  categoryGradient: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.light.surface,
  },
  categoryName: {
    marginTop: Spacing.sm,
    fontSize: FontSizes.sm,
    color: Colors.light.text,
    textAlign: 'center',
    fontWeight: FontWeights.medium,
  },
  // Products Grid Styles
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.base,
    justifyContent: 'space-between',
  },
  // Product Card Styles
  productCard: {
    width: PRODUCT_CARD_WIDTH,
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.base,
    ...Shadows.md,
    overflow: 'hidden',
  },
  productImageContainer: {
    position: 'relative',
    backgroundColor: Colors.light.surfaceSecondary,
  },
  productImage: {
    width: '100%',
    height: PRODUCT_CARD_WIDTH * 1.1,
    backgroundColor: Colors.light.surfaceSecondary,
  },
  discountBadge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
  },
  wishlistButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.light.surface,
    width: 38,
    height: 38,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  productInfo: {
    padding: Spacing.md,
  },
  productName: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.light.text,
    minHeight: 40,
    lineHeight: 20,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
    gap: Spacing.sm,
  },
  price: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.light.text,
  },
  salePrice: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.light.error,
  },
  originalPrice: {
    fontSize: FontSizes.sm,
    color: Colors.light.textTertiary,
    textDecorationLine: 'line-through',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  rating: {
    fontSize: FontSizes.xs,
    color: Colors.light.text,
    fontWeight: FontWeights.medium,
  },
  reviewCount: {
    fontSize: FontSizes.xs,
    color: Colors.light.textTertiary,
    marginLeft: 4,
  },
  addToCartButton: {
    marginTop: Spacing.sm,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  addToCartGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    gap: Spacing.xs,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
  },
  inCartButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: '#10B981',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
  },
  inCartText: {
    color: '#FFFFFF',
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
  },
  // Recently Viewed Styles
  recentlyViewedList: {
    paddingHorizontal: Spacing.base,
  },
  recentlyViewedCard: {
    width: 130,
    marginRight: Spacing.md,
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    ...Shadows.sm,
  },
  recentlyViewedImage: {
    width: 114,
    height: 114,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.light.surfaceSecondary,
  },
  recentlyViewedName: {
    fontSize: FontSizes.sm,
    color: Colors.light.text,
    marginTop: Spacing.sm,
    fontWeight: FontWeights.medium,
  },
  recentlyViewedPrice: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.light.primary,
    marginTop: 4,
  },
  // Empty State Styles
  emptyState: {
    padding: Spacing['3xl'],
    alignItems: 'center',
  },
  emptyStateIconContainer: {
    width: 88,
    height: 88,
    borderRadius: BorderRadius['2xl'],
    backgroundColor: Colors.light.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  emptyStateText: {
    fontSize: FontSizes.base,
    color: Colors.light.textSecondary,
    fontWeight: FontWeights.medium,
  },
  // Promo Banner Styles
  promoBanner: {
    marginHorizontal: Spacing.base,
    marginBottom: -Spacing['5xl'],
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#FEF3C7',
    borderWidth: 1.5,
    borderColor: '#FCD34D',
  },
  promoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  promoTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: '#92400E',
  },
  promoText: {
    fontSize: FontSizes.sm,
    color: '#92400E',
    marginTop: Spacing.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
});
