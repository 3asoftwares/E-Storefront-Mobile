/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faCheck,
  faArrowLeft,
  faPlus,
  faTimes,
  faMapMarkerAlt,
  faTruck,
  faCreditCard,
  faBuilding,
  faMobileAlt,
  faTag,
  faLock,
  faBolt,
} from '@fortawesome/free-solid-svg-icons';
import { useCartStore } from '../src/store/cartStore';
import { useCreateOrder, useAddresses, useValidateCoupon, useAddAddress } from '../src/lib/hooks';

// Order Item Component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function OrderItem({ item }: { item: any }) {
  return (
    <View style={styles.orderItem}>
      <Image
        source={{ uri: item.image || 'https://via.placeholder.com/60' }}
        style={styles.itemImage}
        resizeMode="cover"
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
      </View>
      <Text style={styles.itemPrice}>₹{(item.price * item.quantity).toFixed(2)}</Text>
    </View>
  );
}

// Main Checkout Screen
export default function CheckoutScreen() {
  const cart = useCartStore((state) => state.items);
  const userProfile = useCartStore((state) => state.userProfile);
  const clearCart = useCartStore((state) => state.clearCart);

  // Address states
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [newAddressForm, setNewAddressForm] = useState({
    name: '',
    email: '',
    mobile: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
  });

  // Delivery & Payment states
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [orderNotes, setOrderNotes] = useState('');

  // Coupon states
  const [couponCode, setCouponCode] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);

  const { createOrder } = useCreateOrder();
  const { validateCoupon, isLoading: isValidatingCoupon } = useValidateCoupon();
  const { data: savedAddresses = [], isLoading: addressesLoading } = useAddresses();
  const { addAddress, isLoading: isAddingAddress } = useAddAddress();

  // Select default address on load
  useEffect(() => {
    if (savedAddresses.length > 0 && !selectedAddressId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const defaultAddr = savedAddresses.find((a: any) => a.isDefault);
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
      } else if (savedAddresses[0]) {
        setSelectedAddressId(savedAddresses[0].id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedAddresses]);

  // Calculate totals
  const subtotal = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return cart.reduce((sum: any, item: any) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const discount = useMemo(() => {
    if (!appliedCoupon?.valid) return 0;
    if (
      appliedCoupon.discountType === 'percentage' ||
      appliedCoupon.discountType === 'PERCENTAGE'
    ) {
      return subtotal * (appliedCoupon.discountValue / 100);
    }
    return appliedCoupon.discountValue || appliedCoupon.discount || 0;
  }, [appliedCoupon, subtotal]);

  const shipping = useMemo(() => {
    if (deliveryMethod === 'express') return 80;
    return subtotal > 100 ? 0 : 10;
  }, [deliveryMethod, subtotal]);

  const tax = (subtotal - discount) * 0.08; // 8% tax
  const total = Math.max(0, subtotal - discount + shipping + tax);

  const handleAddNewAddress = async () => {
    // Validate required fields
    if (
      !newAddressForm.name ||
      !newAddressForm.street ||
      !newAddressForm.city ||
      !newAddressForm.state ||
      !newAddressForm.zip
    ) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    // Validate mobile
    if (newAddressForm.mobile && !/^\d{10}$/.test(newAddressForm.mobile)) {
      Alert.alert('Invalid Mobile', 'Please enter a valid 10-digit mobile number');
      return;
    }

    try {
      const result = await addAddress({
        name: newAddressForm.name,
        email: newAddressForm.email,
        mobile: newAddressForm.mobile,
        street: newAddressForm.street,
        city: newAddressForm.city,
        state: newAddressForm.state,
        zip: newAddressForm.zip,
        country: newAddressForm.country || 'India',
        isDefault: savedAddresses.length === 0,
      });

      // Select the newly added address
      if (result?.address?.id) {
        setSelectedAddressId(result.address.id);
      } else if (result?.id) {
        setSelectedAddressId(result.id);
      }

      setShowAddAddressModal(false);
      setNewAddressForm({
        name: '',
        email: '',
        mobile: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        country: 'India',
      });
      Alert.alert('Success', 'Address added successfully!');
    } catch (err: unknown) {
      const error = err as Error;
      Alert.alert('Error', error.message || 'Failed to add address');
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setCouponError('');

    try {
      const result = await validateCoupon({
        code: couponCode.trim().toUpperCase(),
        orderTotal: subtotal,
      });
      if (result?.valid) {
        setAppliedCoupon(result);
        Alert.alert(
          'Success',
          `Coupon applied! You save ₹${result.discount?.toFixed(2) || '0.00'}`
        );
      } else {
        setCouponError(result?.message || 'Invalid coupon code');
        setAppliedCoupon(null);
      }
    } catch (err: unknown) {
      const error = err as Error;
      setCouponError(error.message || 'Failed to validate coupon');
      setAppliedCoupon(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const handlePlaceOrder = async () => {
    // Validation
    if (!userProfile) {
      Alert.alert('Please Login', 'You need to be logged in to place an order', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Login', onPress: () => router.push('/login') },
      ]);
      return;
    }

    if (!selectedAddressId) {
      Alert.alert('Missing Address', 'Please select or add a shipping address');
      return;
    }

    const selectedAddress = savedAddresses.find((a: any) => a.id === selectedAddressId);
    if (!selectedAddress) {
      Alert.alert('Address Error', 'Selected address not found. Please select another.');
      return;
    }

    setIsProcessing(true);

    try {
      const orderItems = cart.map((item) => ({
        productId: item.productId,
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
        variant: item.variant,
        subtotal: item.price * item.quantity,
      }));

      const orderInput = {
        customerId: userProfile.id,
        customerEmail: userProfile.email,
        items: orderItems,
        shippingAddress: {
          name: selectedAddress.name,
          mobile: selectedAddress.mobile,
          email: selectedAddress.email,
          street: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          zip: selectedAddress.zip,
          country: selectedAddress.country,
        },
        paymentMethod,
        notes: orderNotes,
        subtotal,
        discount,
        shipping,
        tax,
        total,
        couponCode: appliedCoupon?.valid ? couponCode.trim().toUpperCase() : undefined,
      };

      const order = await createOrder(orderInput);
      clearCart();

      Alert.alert(
        'Order Placed!',
        `Your order #${order.orderNumber || order.id} has been placed successfully.`,
        [
          {
            text: 'View Order',
            onPress: () => router.replace(`/orders/${order.id}`),
          },
          {
            text: 'Continue Shopping',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } catch (err: unknown) {
      const error = err as Error;
      Alert.alert('Order Failed', error.message || 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <TouchableOpacity style={styles.shopButton} onPress={() => router.push('/products')}>
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesomeIcon icon={faArrowLeft} size={16} color="#4F46E5" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <FontAwesomeIcon icon={faLock} size={14} color="#10B981" />
          <Text style={styles.headerTitle}>Secure Checkout</Text>
        </View>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Shipping Address Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesomeIcon icon={faMapMarkerAlt} size={18} color="#4F46E5" />
            <Text style={styles.sectionTitle}>Shipping Address</Text>
          </View>

          {addressesLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#4F46E5" />
              <Text style={styles.loadingText}>Loading addresses...</Text>
            </View>
          ) : savedAddresses.length > 0 ? (
            <View style={styles.addressList}>
              {savedAddresses.map((address: any) => (
                <TouchableOpacity
                  key={address.id}
                  style={[
                    styles.addressCard,
                    selectedAddressId === address.id && styles.addressCardSelected,
                  ]}
                  onPress={() => setSelectedAddressId(address.id)}
                >
                  <View style={styles.radioContainer}>
                    <View
                      style={[
                        styles.radioOuter,
                        selectedAddressId === address.id && styles.radioOuterSelected,
                      ]}
                    >
                      {selectedAddressId === address.id && <View style={styles.radioInner} />}
                    </View>
                  </View>
                  <View style={styles.addressContent}>
                    <View style={styles.addressNameRow}>
                      <Text style={styles.addressName}>{address.name}</Text>
                      {address.isDefault && (
                        <View style={styles.defaultBadge}>
                          <Text style={styles.defaultBadgeText}>Default</Text>
                        </View>
                      )}
                    </View>
                    {address.mobile && (
                      <Text style={styles.addressDetail}>📱 {address.mobile}</Text>
                    )}
                    <Text style={styles.addressDetail}>{address.street}</Text>
                    <Text style={styles.addressDetail}>
                      {address.city}, {address.state} {address.zip}
                    </Text>
                    <Text style={styles.addressDetail}>{address.country}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={styles.noAddressText}>No saved addresses. Please add one below.</Text>
          )}

          <TouchableOpacity
            style={styles.addAddressButton}
            onPress={() => setShowAddAddressModal(true)}
          >
            <FontAwesomeIcon icon={faPlus} size={14} color="#4F46E5" />
            <Text style={styles.addAddressButtonText}>Add New Address</Text>
          </TouchableOpacity>
        </View>

        {/* Delivery Method Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesomeIcon icon={faTruck} size={18} color="#4F46E5" />
            <Text style={styles.sectionTitle}>Delivery Method</Text>
          </View>

          <TouchableOpacity
            style={[styles.optionCard, deliveryMethod === 'standard' && styles.optionCardSelected]}
            onPress={() => setDeliveryMethod('standard')}
          >
            <View style={styles.radioContainer}>
              <View
                style={[
                  styles.radioOuter,
                  deliveryMethod === 'standard' && styles.radioOuterSelected,
                ]}
              >
                {deliveryMethod === 'standard' && <View style={styles.radioInner} />}
              </View>
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Standard Delivery</Text>
              <Text style={styles.optionDescription}>
                5-7 business days • {subtotal > 100 ? 'FREE' : '₹10'}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionCard, deliveryMethod === 'express' && styles.optionCardSelected]}
            onPress={() => setDeliveryMethod('express')}
          >
            <View style={styles.radioContainer}>
              <View
                style={[
                  styles.radioOuter,
                  deliveryMethod === 'express' && styles.radioOuterSelected,
                ]}
              >
                {deliveryMethod === 'express' && <View style={styles.radioInner} />}
              </View>
            </View>
            <View style={styles.optionContent}>
              <View style={styles.optionTitleRow}>
                <Text style={styles.optionTitle}>Express Delivery</Text>
                <FontAwesomeIcon icon={faBolt} size={12} color="#F59E0B" />
              </View>
              <Text style={styles.optionDescription}>2-3 business days • ₹80</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Payment Method Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesomeIcon icon={faCreditCard} size={18} color="#4F46E5" />
            <Text style={styles.sectionTitle}>Payment Method</Text>
          </View>

          <TouchableOpacity
            style={[styles.optionCard, paymentMethod === 'card' && styles.optionCardSelected]}
            onPress={() => setPaymentMethod('card')}
          >
            <View style={styles.radioContainer}>
              <View
                style={[styles.radioOuter, paymentMethod === 'card' && styles.radioOuterSelected]}
              >
                {paymentMethod === 'card' && <View style={styles.radioInner} />}
              </View>
            </View>
            <FontAwesomeIcon
              icon={faCreditCard}
              size={20}
              color="#6B7280"
              style={styles.optionIcon}
            />
            <Text style={styles.optionTitle}>Credit/Debit Card</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionCard, paymentMethod === 'bank' && styles.optionCardSelected]}
            onPress={() => setPaymentMethod('bank')}
          >
            <View style={styles.radioContainer}>
              <View
                style={[styles.radioOuter, paymentMethod === 'bank' && styles.radioOuterSelected]}
              >
                {paymentMethod === 'bank' && <View style={styles.radioInner} />}
              </View>
            </View>
            <FontAwesomeIcon
              icon={faBuilding}
              size={20}
              color="#6B7280"
              style={styles.optionIcon}
            />
            <Text style={styles.optionTitle}>Bank Transfer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionCard, paymentMethod === 'upi' && styles.optionCardSelected]}
            onPress={() => setPaymentMethod('upi')}
          >
            <View style={styles.radioContainer}>
              <View
                style={[styles.radioOuter, paymentMethod === 'upi' && styles.radioOuterSelected]}
              >
                {paymentMethod === 'upi' && <View style={styles.radioInner} />}
              </View>
            </View>
            <FontAwesomeIcon
              icon={faMobileAlt}
              size={20}
              color="#6B7280"
              style={styles.optionIcon}
            />
            <Text style={styles.optionTitle}>UPI</Text>
          </TouchableOpacity>
        </View>

        {/* Order Notes Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitleSimple}>Order Notes (Optional)</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Add any special instructions for delivery..."
            value={orderNotes}
            onChangeText={setOrderNotes}
            multiline
            numberOfLines={3}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Order Summary Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitleSimple}>Order Summary</Text>

          {/* Order Items */}
          <View style={styles.orderItemsContainer}>
            {cart.map((item: any) => (
              <OrderItem key={item.productId} item={item} />
            ))}
          </View>

          {/* Coupon Section */}
          <View style={styles.couponSection}>
            <View style={styles.couponHeader}>
              <FontAwesomeIcon icon={faTag} size={14} color="#4F46E5" />
              <Text style={styles.couponTitle}>Have a coupon?</Text>
            </View>

            {appliedCoupon?.valid ? (
              <View style={styles.appliedCoupon}>
                <View style={styles.appliedCouponInfo}>
                  <FontAwesomeIcon icon={faCheck} size={14} color="#10B981" />
                  <Text style={styles.appliedCouponCode}>
                    {appliedCoupon.code || couponCode.toUpperCase()}
                  </Text>
                </View>
                <View style={styles.appliedCouponDetails}>
                  <Text style={styles.appliedCouponDiscount}>
                    {appliedCoupon.discountType === 'percentage' ||
                    appliedCoupon.discountType === 'PERCENTAGE'
                      ? `${appliedCoupon.discountValue}% off`
                      : `₹${appliedCoupon.discount?.toFixed(2)} off`}
                  </Text>
                  <TouchableOpacity onPress={handleRemoveCoupon}>
                    <FontAwesomeIcon icon={faTimes} size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.couponInputRow}>
                <TextInput
                  style={styles.couponInput}
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChangeText={(text) => {
                    setCouponCode(text.toUpperCase());
                    setCouponError('');
                  }}
                  autoCapitalize="characters"
                  placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity
                  style={styles.couponApplyButton}
                  onPress={handleApplyCoupon}
                  disabled={isValidatingCoupon}
                >
                  {isValidatingCoupon ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.couponApplyButtonText}>Apply</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
            {couponError ? <Text style={styles.couponError}>{couponError}</Text> : null}
          </View>

          {/* Price Breakdown */}
          <View style={styles.priceBreakdown}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Subtotal</Text>
              <Text style={styles.priceValue}>₹{subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Shipping</Text>
              <Text style={[styles.priceValue, shipping === 0 && styles.freeShipping]}>
                {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}
              </Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Tax (8%)</Text>
              <Text style={styles.priceValue}>₹{tax.toFixed(2)}</Text>
            </View>
            {discount > 0 && (
              <View style={styles.priceRow}>
                <Text style={[styles.priceLabel, styles.discountLabel]}>Discount</Text>
                <Text style={styles.discountValue}>-₹{discount.toFixed(2)}</Text>
              </View>
            )}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomBarLeft}>
          <Text style={styles.bottomBarTotal}>₹{total.toFixed(2)}</Text>
          <Text style={styles.bottomBarItems}>{cart.length} items</Text>
        </View>
        <TouchableOpacity
          style={[styles.placeOrderButton, isProcessing && styles.placeOrderButtonDisabled]}
          onPress={handlePlaceOrder}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.placeOrderButtonText}>Place Order</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Add New Address Modal */}
      <Modal
        visible={showAddAddressModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddAddressModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Address</Text>
              <TouchableOpacity onPress={() => setShowAddAddressModal(false)}>
                <FontAwesomeIcon icon={faTimes} size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="John Doe"
                  value={newAddressForm.name}
                  onChangeText={(text) => setNewAddressForm({ ...newAddressForm, name: text })}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Mobile Number *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="9876543210"
                  value={newAddressForm.mobile}
                  onChangeText={(text) => setNewAddressForm({ ...newAddressForm, mobile: text })}
                  keyboardType="phone-pad"
                  maxLength={10}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email (Optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="john@example.com"
                  value={newAddressForm.email}
                  onChangeText={(text) => setNewAddressForm({ ...newAddressForm, email: text })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Street Address *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="123 Main Street, Apt 4B"
                  value={newAddressForm.street}
                  onChangeText={(text) => setNewAddressForm({ ...newAddressForm, street: text })}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>City *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Mumbai"
                    value={newAddressForm.city}
                    onChangeText={(text) => setNewAddressForm({ ...newAddressForm, city: text })}
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <View style={{ width: 12 }} />
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>State *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Maharashtra"
                    value={newAddressForm.state}
                    onChangeText={(text) => setNewAddressForm({ ...newAddressForm, state: text })}
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>PIN Code *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="400001"
                    value={newAddressForm.zip}
                    onChangeText={(text) => setNewAddressForm({ ...newAddressForm, zip: text })}
                    keyboardType="numeric"
                    maxLength={6}
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <View style={{ width: 12 }} />
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Country</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="India"
                    value={newAddressForm.country}
                    onChangeText={(text) => setNewAddressForm({ ...newAddressForm, country: text })}
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowAddAddressModal(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={handleAddNewAddress}
                disabled={isAddingAddress}
              >
                {isAddingAddress ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.modalSaveButtonText}>Save Address</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    marginLeft: 4,
    fontSize: 16,
    color: '#4F46E5',
    fontWeight: '500',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  sectionTitleSimple: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 8,
  },
  loadingText: {
    color: '#6B7280',
    fontSize: 14,
  },
  addressList: {
    gap: 10,
  },
  addressCard: {
    flexDirection: 'row',
    padding: 14,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  addressCardSelected: {
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },
  radioContainer: {
    marginRight: 12,
    justifyContent: 'flex-start',
    paddingTop: 2,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: '#4F46E5',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4F46E5',
  },
  addressContent: {
    flex: 1,
  },
  addressNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  addressName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  defaultBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1D4ED8',
  },
  addressDetail: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  noAddressText: {
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 20,
  },
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 12,
    gap: 8,
  },
  addAddressButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  optionCardSelected: {
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },
  optionContent: {
    flex: 1,
  },
  optionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  optionDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  optionIcon: {
    marginRight: 12,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#111827',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  orderItemsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 16,
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  itemQuantity: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  couponSection: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 16,
    marginBottom: 16,
  },
  couponHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  couponTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  couponInputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  couponInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111827',
  },
  couponApplyButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  couponApplyButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  couponError: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 8,
  },
  appliedCoupon: {
    backgroundColor: '#ECFDF5',
    borderWidth: 2,
    borderColor: '#10B981',
    borderRadius: 10,
    padding: 12,
  },
  appliedCouponInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  appliedCouponCode: {
    fontSize: 14,
    fontWeight: '600',
    color: '#065F46',
  },
  appliedCouponDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  appliedCouponDiscount: {
    fontSize: 12,
    color: '#059669',
  },
  priceBreakdown: {
    gap: 10,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  freeShipping: {
    color: '#10B981',
    fontWeight: '600',
  },
  discountLabel: {
    color: '#10B981',
  },
  discountValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#10B981',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  bottomBarLeft: {
    flex: 1,
  },
  bottomBarTotal: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  bottomBarItems: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  placeOrderButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 14,
    minWidth: 160,
    alignItems: 'center',
  },
  placeOrderButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  placeOrderButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyEmoji: {
    fontSize: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
  },
  shopButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#4F46E5',
    borderRadius: 10,
  },
  shopButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  modalBody: {
    padding: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  modalCancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  modalSaveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
  },
  modalSaveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  inputRow: {
    flexDirection: 'row',
  },
});
