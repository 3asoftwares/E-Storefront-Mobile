import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faHeart,
  faShoppingCart,
  faTimes,
  faShoppingBag,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartOutline } from '@fortawesome/free-regular-svg-icons';
import { useCartStore, WishlistItem } from '../../src/store/cartStore';
import { Colors } from '../../src/constants/theme';
import { showAlert, showConfirm } from '../../src/utils/helpers';

// Wishlist Item Card Component
function WishlistItemCard({ item }: { item: WishlistItem }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromWishlist = useCartStore((state) => state.removeFromWishlist);

  // Support both productId and id for backwards compatibility
  const itemId = item.productId || item.id || '';

  const handleAddToCart = () => {
    addToCart({
      productId: itemId,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
      variant: undefined,
    });
    showAlert('Added to Cart', `${item.name} has been added to your cart`);
  };

  const handleRemove = () => {
    removeFromWishlist(itemId);
  };

  return (
    <View style={styles.wishlistCard}>
      <TouchableOpacity
        style={styles.cardContent}
        onPress={() => router.push(`/product/${itemId}`)}
        activeOpacity={0.7}
      >
        <Image
          source={{ uri: item.image || 'https://via.placeholder.com/100' }}
          style={styles.itemImage}
          resizeMode="cover"
        />
        <View style={styles.itemInfo}>
          <Text style={styles.itemName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.itemPrice}>₹{item.price.toFixed(2)}</Text>
          <View style={styles.itemActions}>
            <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
              <FontAwesomeIcon icon={faShoppingCart} size={14} color={Colors.light.primary} />
              <Text style={styles.addToCartText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.removeButton} onPress={handleRemove}>
        <FontAwesomeIcon icon={faTimes} size={12} color={Colors.light.textSecondary} />
      </TouchableOpacity>
    </View>
  );
}

// Main Wishlist Screen
export default function WishlistScreen() {
  const wishlist = useCartStore((state) => state.wishlist);
  const clearWishlist = useCartStore((state) => state.clearWishlist);
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddAllToCart = () => {
    wishlist.forEach((item) => {
      addToCart({
        productId: item.productId,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1,
        variant: undefined,
      });
    });
    showAlert('Success', 'All items have been added to your cart');
  };

  const handleClearWishlist = () => {
    showConfirm(
      'Clear Wishlist',
      'Are you sure you want to remove all items from your wishlist?',
      clearWishlist,
      undefined,
      'Clear'
    );
  };

  if (wishlist.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Wishlist</Text>
        </View>
        <View style={styles.emptyState}>
          <View style={styles.emptyStateIconContainer}>
            <FontAwesomeIcon icon={faHeartOutline} size={48} color={Colors.light.primary} />
          </View>
          <Text style={styles.emptyStateTitle}>Your wishlist is empty</Text>
          <Text style={styles.emptyStateText}>Save items you like by tapping the heart icon</Text>
          <TouchableOpacity style={styles.browseButton} onPress={() => router.push('/products')}>
            <FontAwesomeIcon icon={faShoppingBag} size={16} color="#FFFFFF" />
            <Text style={styles.browseButtonText}>Browse Products</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <FontAwesomeIcon icon={faHeart} size={20} color={Colors.light.primary} />
          <Text style={styles.headerTitle}>Wishlist</Text>
        </View>
        <TouchableOpacity style={styles.clearButtonContainer} onPress={handleClearWishlist}>
          <FontAwesomeIcon icon={faTrash} size={12} color={Colors.light.error} />
          <Text style={styles.clearButton}>Clear All</Text>
        </TouchableOpacity>
      </View>

      {/* Item Count */}
      <View style={styles.itemCountContainer}>
        <Text style={styles.itemCount}>
          {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
        </Text>
      </View>

      {/* Wishlist Items */}
      <FlatList
        data={wishlist}
        keyExtractor={(item) => item.productId}
        renderItem={({ item }) => <WishlistItemCard item={item} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Add All to Cart Button */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.addAllButton} onPress={handleAddAllToCart}>
          <FontAwesomeIcon icon={faShoppingCart} size={18} color="#FFFFFF" />
          <Text style={styles.addAllButtonText}>Add All to Cart ({wishlist.length} items)</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  clearButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FEE2E2',
    borderRadius: 20,
  },
  clearButton: {
    fontSize: 13,
    color: Colors.light.error,
    fontWeight: '600',
  },
  itemCountContainer: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: Colors.light.background,
  },
  itemCount: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 16,
  },
  wishlistCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 20,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
  },
  itemImage: {
    width: 110,
    height: 110,
    borderRadius: 14,
    backgroundColor: Colors.light.surface,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    lineHeight: 22,
  },
  itemPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.primary,
    marginTop: 6,
  },
  itemActions: {
    marginTop: 10,
  },
  addToCartButton: {
    borderColor: Colors.light.primary,
    borderWidth: 2,
    backgroundColor: Colors.light.background,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addToCartText: {
    color: Colors.light.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  removeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    fontWeight: 'bold',
  },
  bottomActions: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 100 : 84,
    backgroundColor: Colors.light.background,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  addAllButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addAllButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: Colors.light.background,
  },
  emptyStateIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.light.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyStateEmoji: {
    fontSize: 64,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginTop: 8,
  },
  emptyStateText: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 22,
  },
  browseButton: {
    marginTop: 28,
    paddingHorizontal: 28,
    paddingVertical: 16,
    backgroundColor: Colors.light.primary,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  browseButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
