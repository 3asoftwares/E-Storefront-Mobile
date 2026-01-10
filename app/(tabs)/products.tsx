import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    TextInput,
    ActivityIndicator,
    RefreshControl,
    Dimensions,
    Modal,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch, faSliders, faTimes, faHeart as faHeartSolid, faStar, faShoppingCart, faCheck } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { useProducts, useCategories } from '../../src/lib/hooks';
import { useCartStore } from '../../src/store/cartStore';
import { Colors } from '../../src/constants/theme';

const { width } = Dimensions.get('window');
const PRODUCT_CARD_WIDTH = (width - 48) / 2;

// Product Card Component
function ProductCard({ product }: { product: any }) {
    const addToCart = useCartStore((state) => state.addToCart);
    const toggleWishlistItem = useCartStore((state) => state.toggleWishlistItem);
    const isInWishlist = useCartStore((state) => state.wishlist.some((item) => item.productId === product.id));
    const isInCart = useCartStore((state) => state.items.some((item) => item.productId === product.id));

    const imageUrl = product.imageUrl
    const hasDiscount = product.salePrice && product.salePrice < product.price;
    const discountPercentage = hasDiscount ? Math.round((1 - product.salePrice / product.price) * 100) : 0;

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
        <TouchableOpacity style={styles.productCard} onPress={() => router.push(`/product/${product.id}`)} activeOpacity={0.7}>
            <View style={styles.productImageContainer}>
                <Image source={{ uri: imageUrl }} style={styles.productImage} resizeMode='cover' />
                {hasDiscount && (
                    <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>-{discountPercentage}%</Text>
                    </View>
                )}
                <TouchableOpacity
                    style={styles.wishlistButton}
                    onPress={() =>
                        toggleWishlistItem({
                            id: product.id,
                            name: product.name,
                            price: product.salePrice || product.price,
                            image: imageUrl,
                        })
                    }>
                    <FontAwesomeIcon
                        icon={isInWishlist ? faHeartSolid : faHeartRegular}
                        size={16}
                        color={isInWishlist ? Colors.light.error : Colors.light.textSecondary}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>
                    {product.name}
                </Text>
                <View style={styles.priceContainer}>
                    {hasDiscount ? (
                        <>
                            <Text style={styles.salePrice}>${product.salePrice.toFixed(2)}</Text>
                            <Text style={styles.originalPrice}>${product.price.toFixed(2)}</Text>
                        </>
                    ) : (
                        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
                    )}
                </View>
                {product.rating && (
                    <View style={styles.ratingContainer}>
                        <FontAwesomeIcon icon={faStar} size={12} color='#F59E0B' />
                        <Text style={styles.rating}> {product.rating.toFixed(1)}</Text>
                        <Text style={styles.reviewCount}>({product.reviewCount || 0})</Text>
                    </View>
                )}
                {isInCart ? (
                    <View style={styles.inCartButton}>
                        <FontAwesomeIcon icon={faCheck} size={12} color='#FFFFFF' style={{ marginRight: 4 }} />
                        <Text style={styles.inCartText}>In Cart</Text>
                    </View>
                ) : (
                    <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
                        <View style={styles.addToCartContent}>
                            <FontAwesomeIcon icon={faShoppingCart} size={12} color='#FFFFFF' />
                            <Text style={styles.addToCartText}>Add to Cart</Text>
                        </View>
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    );
}

// Filter Modal Component
function FilterModal({
    visible,
    onClose,
    categories,
    selectedCategory,
    onSelectCategory,
    sortBy,
    onSelectSort,
    priceRange,
    onPriceChange,
    onApply,
    onReset,
}: {
    visible: boolean;
    onClose: () => void;
    categories: any[];
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
    sortBy: string;
    onSelectSort: (sort: string) => void;
    priceRange: { min: string; max: string };
    onPriceChange: (type: 'min' | 'max', value: string) => void;
    onApply: () => void;
    onReset: () => void;
}) {
    const sortOptions = [
        { value: 'createdAt_desc', label: 'Newest First' },
        { value: 'createdAt_asc', label: 'Oldest First' },
        { value: 'price_asc', label: 'Price: Low to High' },
        { value: 'price_desc', label: 'Price: High to Low' },
        { value: 'name_asc', label: 'Name: A to Z' },
        { value: 'name_desc', label: 'Name: Z to A' },
    ];

    return (
        <Modal visible={visible} animationType='slide' transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Filters</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButtonContainer}>
                            <FontAwesomeIcon icon={faTimes} size={20} color={Colors.light.text} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.filterScroll}>
                        {/* Category Filter */}
                        <Text style={styles.filterLabel}>Category</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={styles.categoryChips}>
                                <TouchableOpacity style={[styles.chip, selectedCategory === '' && styles.chipActive]} onPress={() => onSelectCategory('')}>
                                    <Text style={[styles.chipText, selectedCategory === '' && styles.chipTextActive]}>All</Text>
                                </TouchableOpacity>
                                {categories.map((cat) => (
                                    <TouchableOpacity
                                        key={cat.id}
                                        style={[styles.chip, selectedCategory === cat.slug && styles.chipActive]}
                                        onPress={() => onSelectCategory(cat.slug)}>
                                        <Text style={[styles.chipText, selectedCategory === cat.slug && styles.chipTextActive]}>{cat.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>

                        {/* Sort Filter */}
                        <Text style={styles.filterLabel}>Sort By</Text>
                        <View style={styles.sortOptions}>
                            {sortOptions.map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    style={[styles.sortOption, sortBy === option.value && styles.sortOptionActive]}
                                    onPress={() => onSelectSort(option.value)}>
                                    <Text style={[styles.sortOptionText, sortBy === option.value && styles.sortOptionTextActive]}>{option.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Price Range */}
                        <Text style={styles.filterLabel}>Price Range</Text>
                        <View style={styles.priceInputs}>
                            <View style={styles.priceInputContainer}>
                                <Text style={styles.priceInputLabel}>Min</Text>
                                <TextInput
                                    style={styles.priceInput}
                                    placeholder='0'
                                    keyboardType='numeric'
                                    value={priceRange.min}
                                    onChangeText={(value) => onPriceChange('min', value)}
                                />
                            </View>
                            <Text style={styles.priceSeparator}>-</Text>
                            <View style={styles.priceInputContainer}>
                                <Text style={styles.priceInputLabel}>Max</Text>
                                <TextInput
                                    style={styles.priceInput}
                                    placeholder='1000'
                                    keyboardType='numeric'
                                    value={priceRange.max}
                                    onChangeText={(value) => onPriceChange('max', value)}
                                />
                            </View>
                        </View>
                    </ScrollView>

                    <View style={styles.modalActions}>
                        <TouchableOpacity style={styles.resetButton} onPress={onReset}>
                            <Text style={styles.resetButtonText}>Reset</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.applyButton} onPress={onApply}>
                            <Text style={styles.applyButtonText}>Apply Filters</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

// Main Products Screen
export default function ProductsScreen() {
    const params = useLocalSearchParams();
    const categoryFromUrl = (params.category as string) || '';

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
    const [sortBy, setSortBy] = useState('createdAt_desc');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [filterModalVisible, setFilterModalVisible] = useState(false);

    // Sync category from URL params
    useEffect(() => {
        setSelectedCategory(categoryFromUrl);
        setPage(1);
    }, [categoryFromUrl]);

    // Debounce search
    const handleSearch = useCallback((text: string) => {
        setSearch(text);
        const timer = setTimeout(() => {
            setDebouncedSearch(text);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const filters = useMemo(() => {
        const [sortField, sortOrder] = sortBy.split('_');
        return {
            search: debouncedSearch || undefined,
            category: selectedCategory || undefined,
            minPrice: priceRange.min ? parseFloat(priceRange.min) : undefined,
            maxPrice: priceRange.max ? parseFloat(priceRange.max) : undefined,
            sortBy: sortField,
            sortOrder: sortOrder?.toUpperCase(),
        };
    }, [debouncedSearch, selectedCategory, sortBy, priceRange]);

    const { data: productsData, isLoading, refetch, isRefetching, isFetching } = useProducts(page, 20, filters);

    const { data: categories = [] } = useCategories();

    const products = productsData?.products || [];
    const totalPages = productsData?.pagination?.totalPages || 1;

    const handleLoadMore = () => {
        if (page < totalPages && !isFetching) {
            setPage((prev) => prev + 1);
        }
    };

    const handleApplyFilters = () => {
        setPage(1);
        setFilterModalVisible(false);
        refetch();
    };

    const handleResetFilters = () => {
        setSelectedCategory('');
        setSortBy('createdAt_desc');
        setPriceRange({ min: '', max: '' });
        setPage(1);
    };

    const activeFiltersCount = useMemo(() => {
        let count = 0;
        if (selectedCategory) count++;
        if (priceRange.min || priceRange.max) count++;
        if (sortBy !== 'createdAt_desc') count++;
        return count;
    }, [selectedCategory, priceRange, sortBy]);

    const renderFooter = () => {
        if (!isFetching || page === 1) return null;
        return (
            <View style={styles.loadingFooter}>
                <ActivityIndicator size='small' color='#4F46E5' />
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                    <FontAwesomeIcon icon={faSearch} size={16} color={Colors.light.textTertiary} style={styles.searchIconFA} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder='Search products...'
                        value={search}
                        onChangeText={handleSearch}
                        placeholderTextColor='#9CA3AF'
                    />
                    {search.length > 0 && (
                        <TouchableOpacity
                            onPress={() => {
                                setSearch('');
                                setDebouncedSearch('');
                            }}
                            style={styles.clearSearchButton}>
                            <FontAwesomeIcon icon={faTimes} size={14} color={Colors.light.textTertiary} />
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
                    <FontAwesomeIcon icon={faSliders} size={18} color={Colors.light.primary} />
                    {activeFiltersCount > 0 && (
                        <View style={styles.filterBadge}>
                            <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            {/* Active Filters */}
            {(selectedCategory || debouncedSearch) && (
                <View style={styles.activeFilters}>
                    {debouncedSearch && (
                        <View style={styles.activeFilterChip}>
                            <Text style={styles.activeFilterText}>"{debouncedSearch}"</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    setSearch('');
                                    setDebouncedSearch('');
                                }}>
                                <FontAwesomeIcon icon={faTimes} size={12} color={Colors.light.primary} style={{ marginLeft: 8 }} />
                            </TouchableOpacity>
                        </View>
                    )}
                    {selectedCategory && (
                        <View style={styles.activeFilterChip}>
                            <Text style={styles.activeFilterText}>{selectedCategory}</Text>
                            <TouchableOpacity onPress={() => setSelectedCategory('')}>
                                <FontAwesomeIcon icon={faTimes} size={12} color={Colors.light.primary} style={{ marginLeft: 8 }} />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            )}

            {/* Products List */}
            {isLoading && page === 1 ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size='large' color='#4F46E5' />
                    <Text style={styles.loadingText}>Loading products...</Text>
                </View>
            ) : products.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateEmoji}>🔍</Text>
                    <Text style={styles.emptyStateTitle}>No products found</Text>
                    <Text style={styles.emptyStateText}>Try adjusting your search or filters</Text>
                    <TouchableOpacity
                        style={styles.resetFiltersButton}
                        onPress={() => {
                            handleResetFilters();
                            setSearch('');
                            setDebouncedSearch('');
                        }}>
                        <Text style={styles.resetFiltersButtonText}>Clear All Filters</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={products}
                    numColumns={2}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <ProductCard product={item} />}
                    contentContainerStyle={styles.productsList}
                    columnWrapperStyle={styles.productsRow}
                    showsVerticalScrollIndicator={false}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefetching && page === 1}
                            onRefresh={() => {
                                setPage(1);
                                refetch();
                            }}
                        />
                    }
                />
            )}

            <FilterModal
                visible={filterModalVisible}
                onClose={() => setFilterModalVisible(false)}
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                sortBy={sortBy}
                onSelectSort={setSortBy}
                priceRange={priceRange}
                onPriceChange={(type, value) => setPriceRange((prev) => ({ ...prev, [type]: value }))}
                onApply={handleApplyFilters}
                onReset={handleResetFilters}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 56,
        backgroundColor: Colors.light.backgroundSecondary,
    },
    searchContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: Colors.light.background,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
    },
    searchInputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.light.surfaceSecondary,
        borderRadius: 14,
        paddingHorizontal: 14,
    },
    searchIconFA: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        height: 48,
        fontSize: 16,
        color: Colors.light.text,
    },
    clearSearchButton: {
        padding: 8,
    },
    filterButton: {
        width: 48,
        height: 48,
        marginLeft: 12,
        backgroundColor: Colors.light.surfaceSecondary,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterBadge: {
        position: 'absolute',
        top: 2,
        right: 2,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: Colors.light.error,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.light.background,
    },
    filterBadgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    activeFilters: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: Colors.light.background,
        gap: 8,
    },
    activeFilterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.light.surfaceSecondary,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 4,
    },
    activeFilterText: {
        fontSize: 14,
        color: '#4F46E5',
    },
    removeFilter: {
        fontSize: 12,
        color: '#4F46E5',
        marginLeft: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#6B7280',
    },
    productsList: {
        padding: 16,
    },
    productsRow: {
        justifyContent: 'space-between',
    },
    productCard: {
        width: PRODUCT_CARD_WIDTH,
        backgroundColor: Colors.light.background,
        borderRadius: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
        overflow: 'hidden',
    },
    productImageContainer: {
        position: 'relative',
        backgroundColor: Colors.light.surfaceSecondary,
    },
    productImage: {
        width: '100%',
        height: 170,
        backgroundColor: Colors.light.surfaceSecondary,
    },
    discountBadge: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: Colors.light.error,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    discountText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    wishlistButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: Colors.light.background,
        width: 38,
        height: 38,
        borderRadius: 19,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    productInfo: {
        padding: 14,
    },
    productName: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.light.text,
        minHeight: 40,
        lineHeight: 20,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    price: {
        fontSize: 17,
        fontWeight: 'bold',
        color: Colors.light.text,
    },
    salePrice: {
        fontSize: 17,
        fontWeight: 'bold',
        color: Colors.light.error,
    },
    originalPrice: {
        fontSize: 13,
        color: Colors.light.textTertiary,
        textDecorationLine: 'line-through',
        marginLeft: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    rating: {
        fontSize: 12,
        color: Colors.light.text,
        fontWeight: '500',
    },
    reviewCount: {
        fontSize: 12,
        color: Colors.light.textTertiary,
        marginLeft: 4,
    },
    addToCartButton: {
        backgroundColor: Colors.light.primary,
        paddingVertical: 12,
        borderRadius: 12,
        marginTop: 10,
        alignItems: 'center',
    },
    addToCartContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    addToCartText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '700',
    },
    inCartButton: {
        backgroundColor: Colors.light.success || '#10B981',
        paddingVertical: 12,
        borderRadius: 12,
        marginTop: 10,
        alignItems: 'center',
    },
    inCartText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '700',
    },
    loadingFooter: {
        paddingVertical: 24,
        alignItems: 'center',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyStateEmoji: {
        fontSize: 64,
    },
    emptyStateTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginTop: 16,
    },
    emptyStateText: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 8,
        textAlign: 'center',
    },
    resetFiltersButton: {
        marginTop: 20,
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: '#4F46E5',
        borderRadius: 8,
    },
    resetFiltersButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    closeButtonContainer: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: Colors.light.surfaceSecondary,
    },
    closeButton: {
        fontSize: 20,
        color: '#6B7280',
        padding: 4,
    },
    filterScroll: {
        padding: 16,
    },
    filterLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginTop: 16,
        marginBottom: 12,
    },
    categoryChips: {
        flexDirection: 'row',
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        marginRight: 8,
    },
    chipActive: {
        backgroundColor: '#4F46E5',
    },
    chipText: {
        fontSize: 14,
        color: '#374151',
    },
    chipTextActive: {
        color: '#FFFFFF',
    },
    sortOptions: {
        gap: 8,
    },
    sortOption: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        marginBottom: 8,
    },
    sortOptionActive: {
        backgroundColor: '#EEF2FF',
        borderWidth: 1,
        borderColor: '#4F46E5',
    },
    sortOptionText: {
        fontSize: 14,
        color: '#374151',
    },
    sortOptionTextActive: {
        color: '#4F46E5',
        fontWeight: '500',
    },
    priceInputs: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    priceInputContainer: {
        flex: 1,
    },
    priceInputLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 4,
    },
    priceInput: {
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#111827',
    },
    priceSeparator: {
        paddingHorizontal: 16,
        fontSize: 18,
        color: '#6B7280',
        marginTop: 16,
    },
    modalActions: {
        flexDirection: 'row',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        gap: 12,
    },
    resetButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
    },
    resetButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
    },
    applyButton: {
        flex: 2,
        paddingVertical: 14,
        borderRadius: 8,
        backgroundColor: '#4F46E5',
        alignItems: 'center',
    },
    applyButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});
