import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faTrash,
  faPlus,
  faMinus,
  faShoppingCart,
  faShoppingBag,
} from '@fortawesome/free-solid-svg-icons';
import { useCartStore, CartItem } from '../../src/store/cartStore';
import { useValidateCoupon } from '../../src/lib/hooks';
import { Colors } from '../../src/constants/theme';
import { showAlert, showConfirm } from '../../src/utils/helpers';

// Cart Item Component
function CartItemCard({ item }: { item: CartItem }) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const handleIncrement = () => {
    updateQuantity(item.productId, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.productId, item.quantity - 1);
    } else {
      showConfirm(
        'Remove Item',
        'Are you sure you want to remove this item from your cart?',
        () => removeFromCart(item.productId),
        undefined,
        'Remove'
      );
    }
  };

  const handleRemove = () => {
    removeFromCart(item.productId);
  };

  const itemTotal = item.price * item.quantity;

  return (
    <View style={styles.cartItem}>
      <TouchableOpacity onPress={() => router.push(`/product/${item.productId}`)}>
        <Image
          source={{ uri: item.image || 'https://via.placeholder.com/100' }}
          style={styles.itemImage}
          resizeMode="cover"
        />
      </TouchableOpacity>
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.name}
        </Text>
        {item.variant && <Text style={styles.itemVariant}>{item.variant}</Text>}
        <Text style={styles.itemPrice}>₹{item.price.toFixed(2)}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity style={styles.quantityButton} onPress={handleDecrement}>
            <FontAwesomeIcon icon={faMinus} size={12} color={Colors.light.text} />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity style={styles.quantityButton} onPress={handleIncrement}>
            <FontAwesomeIcon icon={faPlus} size={12} color={Colors.light.text} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.itemActions}>
        <Text style={styles.itemTotal}>₹{itemTotal.toFixed(2)}</Text>
        <TouchableOpacity onPress={handleRemove} style={styles.removeButton}>
          <FontAwesomeIcon icon={faTrash} size={16} color={Colors.light.error} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Order Summary Component
function OrderSummary({
  subtotal,
  discount,
  shipping,
  total,
}: {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}) {
  return (
    <View style={styles.orderSummary}>
      <Text style={styles.summaryTitle}>Order Summary</Text>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Subtotal</Text>
        <Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text>
      </View>
      {discount > 0 && (
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Discount</Text>
          <Text style={[styles.summaryValue, styles.discountValue]}>-₹{discount.toFixed(2)}</Text>
        </View>
      )}
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Shipping</Text>
        <Text style={styles.summaryValue}>
          {shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}
        </Text>
      </View>
      <View style={styles.summaryDivider} />
      <View style={styles.summaryRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
      </View>
    </View>
  );
}

// Main Cart Screen
export default function CartScreen() {
  const cart = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const [couponCode, setCouponCode] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

  const { validateCoupon, isLoading: _isValidating, error: _couponError } = useValidateCoupon();

  // Calculate totals
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    // Use the pre-calculated discount from the server if available
    if (appliedCoupon.discount) return appliedCoupon.discount;
    // Otherwise calculate based on type
    if (
      appliedCoupon.discountType === 'percentage' ||
      appliedCoupon.discountType === 'PERCENTAGE'
    ) {
      return subtotal * (appliedCoupon.discountValue / 100);
    }
    return appliedCoupon.discountValue || 0;
  }, [appliedCoupon, subtotal]);

  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal - discount + shipping;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      showAlert('Error', 'Please enter a coupon code');
      return;
    }

    try {
      const result = await validateCoupon({ code: couponCode.trim(), orderTotal: subtotal });
      // eslint-disable-next-line no-console
      console.log('Coupon result:', result);
      if (result?.valid) {
        setAppliedCoupon({
          code: result.code || couponCode.trim(),
          discountType: result.discountType,
          discountValue: result.discountValue,
          discount: result.discount,
        });
        showAlert('Success', 'Coupon applied successfully!');
      } else {
        showAlert('Invalid Coupon', result?.message || 'This coupon is not valid');
      }
    } catch (err: unknown) {
      const error = err as Error;
      showAlert('Error', error.message || 'Failed to validate coupon');
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  const handleClearCart = () => {
    showConfirm(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      clearCart,
      undefined,
      'Clear'
    );
  };

  const handleCheckout = () => {
    // Check if user is authenticated
    const userProfile = useCartStore.getState().userProfile;
    if (!userProfile) {
      // Redirect to login with cart as the return path
      router.push('/login?redirect=/(tabs)/cart');
      return;
    }
    router.push('/checkout');
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Shopping Cart</Text>
        </View>
        <View style={styles.emptyState}>
          <View style={styles.emptyStateIconContainer}>
            <FontAwesomeIcon icon={faShoppingCart} size={48} color={Colors.light.textTertiary} />
          </View>
          <Text style={styles.emptyStateTitle}>Your cart is empty</Text>
          <Text style={styles.emptyStateText}>Add some items to your cart to get started</Text>
          <TouchableOpacity
            style={styles.continueShoppingButton}
            onPress={() => router.push('/products')}
          >
            <FontAwesomeIcon icon={faShoppingBag} size={16} color="#FFFFFF" />
            <Text style={styles.continueShoppingButtonText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        <TouchableOpacity onPress={handleClearCart}>
          <Text style={styles.clearButton}>Clear All</Text>
        </TouchableOpacity>
      </View>

      {/* Cart Items */}
      <FlatList
        data={cart}
        keyExtractor={(item) => item.productId}
        renderItem={({ item }) => <CartItemCard item={item} />}
        contentContainerStyle={styles.cartList}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text style={styles.itemCount}>
            {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'} in your cart
          </Text>
        }
        ListFooterComponent={
          <View>
            {/* Order Summary */}
            <OrderSummary
              subtotal={subtotal}
              discount={discount}
              shipping={shipping}
              total={total}
            />

            {/* Free Shipping Notice */}
            {subtotal < 50 && (
              <View style={styles.freeShippingNotice}>
                <Text style={styles.freeShippingText}>
                  🚚 Add ₹{(50 - subtotal).toFixed(2)} more for free shipping!
                </Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${Math.min((subtotal / 50) * 100, 100)}%` },
                    ]}
                  />
                </View>
              </View>
            )}
          </View>
        }
      />

      {/* Checkout Button */}
      <View style={styles.checkoutContainer}>
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutButtonText}>Proceed to Checkout • ₹{total.toFixed(2)}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.continueShoppingLink}
          onPress={() => router.push('/products')}
        >
          <Text style={styles.continueShoppingLinkText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  clearButton: {
    fontSize: 14,
    color: Colors.light.error,
    fontWeight: '600',
  },
  itemCount: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 16,
  },
  cartList: {
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  itemImage: {
    width: 88,
    height: 88,
    borderRadius: 12,
    backgroundColor: Colors.light.surfaceSecondary,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 14,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.text,
  },
  itemVariant: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.primary,
    marginTop: 6,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.light.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
    marginHorizontal: 18,
  },
  itemActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  itemTotal: {
    fontSize: 17,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  removeButton: {
    padding: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
  },
  orderSummary: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  discountValue: {
    color: '#059669',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  freeShippingNotice: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  freeShippingText: {
    fontSize: 14,
    color: '#92400E',
    textAlign: 'center',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#FDE68A',
    borderRadius: 3,
    marginTop: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 3,
  },
  checkoutContainer: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 100 : 84,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  checkoutButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  continueShoppingLink: {
    marginTop: 12,
    alignItems: 'center',
  },
  continueShoppingLinkText: {
    color: '#4F46E5',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.light.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  continueShoppingButton: {
    marginTop: 28,
    paddingHorizontal: 28,
    paddingVertical: 14,
    backgroundColor: Colors.light.primary,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  continueShoppingButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
